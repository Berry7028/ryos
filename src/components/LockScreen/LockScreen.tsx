import React, { useState, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useWallpaper } from '../../hooks/useWallpaper';

interface GlobalStyleProps {
  wallpaper: string;
}

const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
  body.lock-screen-active {
    overflow: hidden;
    height: 100vh;
    width: 100vw;
    
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url(${(props: GlobalStyleProps) => props.wallpaper || '/wallpapers/default.jpg'});
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      filter: blur(20px) brightness(0.8);
      transform: scale(1.1); /* Slightly scale to hide blur edges */
      z-index: -1;
      will-change: transform; /* Optimize for animations */
    }
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const LockScreenContainer = styled.div<{ isUnlocking: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  z-index: 10000;
  transition: opacity 0.5s ease-in-out;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  animation: ${({ isUnlocking }) => (isUnlocking ? fadeOut : fadeIn)} 0.5s ease-in-out forwards;
  color: white;
  padding: 10vh 0 15vh 0;
  pointer-events: ${({ isUnlocking }) => (isUnlocking ? 'none' : 'auto')};
  overflow: hidden;
`;

const TimeContainer = styled.div`
  text-align: center;
  margin-top: 5vh;
`;

const DateText = styled.p`
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', 'Segoe UI', Arial, sans-serif;
  font-size: 1.3rem;
  margin: 0 0 0.5rem 0;
  opacity: 0.95;
  font-weight: 500;
`;

const Time = styled.h1`
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', 'Segoe UI', Arial, sans-serif;
  font-size: 7rem;
  font-weight: 200;
  margin: 0;
  letter-spacing: -4px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const LoginSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const GolfBall = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  position: relative;
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.2),
    inset -2px -2px 5px rgba(0, 0, 0, 0.1),
    inset 2px 2px 5px rgba(255, 255, 255, 0.8);
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    height: 70%;
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(0,0,0,0.1) 1px, transparent 1px),
      radial-gradient(circle at 60% 20%, rgba(0,0,0,0.1) 1px, transparent 1px),
      radial-gradient(circle at 80% 60%, rgba(0,0,0,0.1) 1px, transparent 1px),
      radial-gradient(circle at 30% 80%, rgba(0,0,0,0.1) 1px, transparent 1px),
      radial-gradient(circle at 70% 70%, rgba(0,0,0,0.1) 1px, transparent 1px);
    background-size: 8px 8px;
    border-radius: 50%;
  }
`;

const PasswordInput = styled.input`
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  outline: none;
  text-align: center;
  transition: all 0.3s;
  width: 200px;
  backdrop-filter: blur(20px);
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
    font-weight: 300;
  }
  
  &:focus {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  }
`;

const LockScreen: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [password, setPassword] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const { wallpaperSource } = useWallpaper();
  
  useEffect(() => {
    document.body.classList.add('lock-screen-active');
    return () => {
      document.body.classList.remove('lock-screen-active');
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleUnlock = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startUnlock();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      startUnlock();
    }
  };

  const startUnlock = () => {
    // Start the unlock animation
    setIsUnlocking(true);
    
    // Wait for the animation to complete before calling onUnlock
    setTimeout(() => {
      onUnlock();
    }, 500); // Match this with the animation duration
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <>
      <GlobalStyle wallpaper={wallpaperSource} />
      <LockScreenContainer isUnlocking={isUnlocking}>
        <TimeContainer>
          <DateText>{formatDate(currentTime)}</DateText>
          <Time>{formatTime(currentTime)}</Time>
        </TimeContainer>
        
        <LoginSection>
          <GolfBall />
          <form onSubmit={handleUnlock}>
            <PasswordInput
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />
          </form>
        </LoginSection>
      </LockScreenContainer>
    </>
  );
};

export { LockScreen };