import { useEffect, useRef, useState } from "react";
import { AppProps } from "../../base/types";
import { WindowFrame } from "@/components/layout/WindowFrame";
import { Button } from "@/components/ui/button";
import { UtsurundesuMenuBar } from "./UtsurundesuMenuBar";
import { useSound, Sounds } from "@/hooks/useSound";
import { CameraOff, RotateCcw, Download, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export function UtsurundesuAppComponent({
  isWindowOpen,
  onClose,
  isForeground,
  skipInitialSound,
  instanceId,
  onNavigateNext,
  onNavigatePrevious,
}: AppProps) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { play: playShutter } = useSound(Sounds.PHOTO_SHUTTER, 0.4);

  // Initialize camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
    }
  };

  // 写ルンです風フィルター（実写サンプルに近づける）
  const applyUtsurundesuFilter = (imageData: ImageData): ImageData => {
    const { data, width, height } = imageData;
    // 0. 全体をやや暗めに
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] * 0.93; // R
      data[i + 1] = data[i + 1] * 0.93;
      data[i + 2] = data[i + 2] * 0.93;
    }
    // 1. 色味補正（緑・青寄り、シャドウ部に青緑）
    for (let i = 0; i < data.length; i += 4) {
      // 全体を少しグリーン・ブルー寄りに
      data[i] = data[i] * 0.98; // R
      data[i + 1] = data[i + 1] * 1.05; // G
      data[i + 2] = data[i + 2] * 1.08; // B
      // シャドウ部に青緑を加える
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (avg < 60) {
        data[i + 1] = Math.min(255, data[i + 1] + 8); // G
        data[i + 2] = Math.min(255, data[i + 2] + 12); // B
      }
    }
    // 2. コントラスト・彩度を下げる
    for (let i = 0; i < data.length; i += 4) {
      // コントラスト
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = data[i] * 0.85 + avg * 0.15;
      data[i + 1] = data[i + 1] * 0.85 + avg * 0.15;
      data[i + 2] = data[i + 2] * 0.85 + avg * 0.15;
      // 彩度を下げる
      const sat = 0.7; // 0=グレースケール, 1=元の色
      data[i] = avg * (1 - sat) + data[i] * sat;
      data[i + 1] = avg * (1 - sat) + data[i + 1] * sat;
      data[i + 2] = avg * (1 - sat) + data[i + 2] * sat;
    }
    // 3. グレイン（粒状感）をさらに弱く
    for (let i = 0; i < data.length; i += 4) {
      const grain = (Math.random() - 0.5) * 4;
      data[i] = Math.max(0, Math.min(255, data[i] + grain));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
    }
    // 4. ハイライト・シャドウの自然な強調
    for (let i = 0; i < data.length; i += 4) {
      // 明るい部分をほんのり明るく
      if (data[i] > 220 && data[i + 1] > 220 && data[i + 2] > 220) {
        data[i] = Math.min(255, data[i] + 8);
        data[i + 1] = Math.min(255, data[i + 1] + 8);
        data[i + 2] = Math.min(255, data[i + 2] + 8);
      }
      // 暗い部分をほんのり暗く
      if (data[i] < 30 && data[i + 1] < 30 && data[i + 2] < 30) {
        data[i] = data[i + 1] = data[i + 2] = data[i] * 0.8;
      }
    }
    // 5. 周辺減光（四隅を自然に暗く）
    const vignetteStrength = 0.22;
    const cx = width / 2;
    const cy = height / 2;
    const maxDist = Math.sqrt(cx * cx + cy * cy);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const vignette = 1 - vignetteStrength * (dist / maxDist);
        data[idx] *= vignette;
        data[idx + 1] *= vignette;
        data[idx + 2] *= vignette;
      }
    }
    // 6. 肌色領域の美肌補正（平滑化・色ムラ平均化）
    // 肌色判定: R>90, G>40, B>20, R>G>B, 彩度・明度が中程度
    const getIdx = (x: number, y: number) => (y * width + x) * 4;
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = getIdx(x, y);
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const sat = max === 0 ? 0 : (max - min) / max;
        const val = max;
        // 肌色条件
        if (
          r > 90 && g > 40 && b > 20 && r > g && g > b &&
          sat > 0.12 && sat < 0.6 && val > 60 && val < 240
        ) {
          // 3x3周囲の平均色
          let sumR = 0, sumG = 0, sumB = 0, count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nidx = getIdx(x + dx, y + dy);
              sumR += data[nidx];
              sumG += data[nidx + 1];
              sumB += data[nidx + 2];
              count++;
            }
          }
          // 平滑化（ぼかし）
          data[idx] = (data[idx] * 0.3 + (sumR / count) * 0.7);
          data[idx + 1] = (data[idx + 1] * 0.3 + (sumG / count) * 0.7);
          data[idx + 2] = (data[idx + 2] * 0.3 + (sumB / count) * 0.7);
        }
      }
    }
    return imageData;
  };
  

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    playShutter();
    setIsProcessing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    // 反転して描画
    context.save();
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    context.restore();
    
    // Get image data and apply 写ルンです風フィルター
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const filteredData = applyUtsurundesuFilter(imageData);
    context.putImageData(filteredData, 0, 0);
    // 6. ピントが甘い（ぼかし）
    context.save();
    context.globalAlpha = 0.7;
    context.filter = 'blur(0.8px)';
    context.drawImage(canvas, 0, 0);
    context.restore();
    
    // Convert to data URL and set as captured image
    const imageUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageUrl);
    setIsCaptured(true);
    setIsProcessing(false);
    
    // Stop camera after capture
    stopCamera();
  };

  // Download captured image
  const downloadImage = () => {
    if (!capturedImage) return;
    
    const link = document.createElement('a');
    link.download = `utsurundesu-${new Date().toISOString().replace(/[:.]/g, '-')}.jpg`;
    link.href = capturedImage;
    link.click();
  };

  // Reset camera
  const resetCamera = () => {
    setCapturedImage(null);
    setIsCaptured(false);
    startCamera();
  };

  // Initialize camera on mount
  useEffect(() => {
    startCamera();
    
    return () => {
      stopCamera();
    };
  }, []);

  if (!isWindowOpen) return null;

  return (
    <>
      <UtsurundesuMenuBar
        onShowHelp={() => {}}
        onShowAbout={() => {}}
        onClose={onClose}
      />
      <WindowFrame
        appId="utsurundesu"
        title="写るんです"
        onClose={onClose}
        isForeground={isForeground}
        skipInitialSound={skipInitialSound}
        instanceId={instanceId}
        onNavigateNext={onNavigateNext}
        onNavigatePrevious={onNavigatePrevious}
      >
      <div className="flex flex-col h-full w-full bg-gray-100 p-0 m-0 overflow-hidden">
        <div className="flex-1 flex flex-col w-full h-full items-stretch justify-stretch overflow-hidden p-0 m-0">
          {/* Camera view area */}
            <div className={cn(
              "relative w-full h-full bg-black overflow-hidden transition-all duration-300"
            )}>
              {/* Viewfinder frame */}
              <div className="absolute inset-0.5 border border-white/20 rounded pointer-events-none" />
              
              {/* Camera feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-300",
                  !isCameraActive || isCaptured ? 'opacity-0' : 'opacity-100'
                )}
                style={{
                  filter: 'saturate(2) contrast(1.5)', // プレビューにもビビット加工
                  transform: 'scaleX(-1)' // ミラー反転（必要に応じて）
                }}
              />
              
              {/* Captured image */}
              {isCaptured && capturedImage && (
                <div className="absolute inset-0">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full h-full object-cover"
                  />
                  {/* Film grain overlay */}
                  <div 
                    className="absolute inset-0 opacity-10 pointer-events-none" 
                    style={{
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
                      mixBlendMode: 'overlay'
                    }}
                  />
                  
                  {/* Date stamp */}
                  <div className="absolute bottom-2 right-3 text-white/80 text-xs font-mono bg-black/40 px-2 py-1 rounded">
                    {new Date().toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    }).replace(/(\d+)\/(\d+)\/(\d+),?/, '$1.$2.$3')}
                  </div>
                </div>
              )}
              
              {/* Camera inactive state */}
              {!isCameraActive && !isCaptured && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white/70">
                  <CameraOff className="w-12 h-12 mb-3 opacity-50" />
                  <div className="text-center px-4">
                    <p className="font-medium">カメラが接続されていません</p>
                    <p className="text-xs mt-1">カメラのアクセスを許可してください</p>
                  </div>
                </div>
              )}
              
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>
        
        
        {/* Controls */}
        <div className="w-full pt-2 pb-4 flex-shrink-0">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg w-full max-w-full">
            {!isCaptured ? (
              <div className="flex flex-col items-center">
                <Button
                  onClick={capturePhoto}
                  disabled={!isCameraActive || isProcessing}
                  className={cn(
                    "w-24 h-24 rounded-full transition-all duration-200 -mt-12 shadow-lg",
                    isProcessing 
                      ? "bg-gray-400" 
                      : "bg-red-500 hover:bg-red-600 active:bg-red-700 active:scale-95 border-4 border-white"
                  )}
                >
                  {isProcessing ? (
                    <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Circle className="w-12 h-12 fill-white text-white" />
                  )}
                </Button>
                <p className="mt-3 text-sm text-gray-600 font-medium">
                  {isProcessing ? '処理中...' : 'タップして撮影'}
                </p>
              </div>
            ) : (
              <div className="flex justify-center gap-8">
                <button
                  onClick={resetCamera}
                  className="flex flex-col items-center group"
                >
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mb-1 group-hover:bg-gray-50 transition-colors shadow-sm">
                    <RotateCcw className="w-7 h-7 text-gray-700" />
                  </div>
                  <span className="text-xs text-gray-700 font-medium">撮り直す</span>
                </button>
                
                <button
                  onClick={downloadImage}
                  className="flex flex-col items-center group"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mb-1 group-hover:bg-blue-600 transition-colors shadow-sm">
                    <Download className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-xs text-gray-700 font-medium">ダウンロード</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </WindowFrame>
    </>
  );
}
