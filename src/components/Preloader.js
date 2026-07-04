import React, { useState, useEffect } from 'react';
import { getLogo } from '../utils/festive';

const Preloader = ({ onComplete }) => {
  const [phase, setPhase] = useState('entering');

  useEffect(() => {
    if (sessionStorage.getItem('xc_visited')) {
      onComplete?.();
      return;
    }

    const enterTimer = setTimeout(() => setPhase('loading'), 50);
    const loadTimer = setTimeout(() => setPhase('exiting'), 1800);
    const doneTimer = setTimeout(() => {
      sessionStorage.setItem('xc_visited', 'true');
      onComplete?.();
    }, 2400);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(loadTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'opacity 0.4s ease, transform 0.5s ease',
      opacity: phase === 'exiting' ? 0 : 1,
      transform: phase === 'exiting' ? 'scale(1.05)' : 'scale(1)',
      pointerEvents: phase === 'exiting' ? 'none' : 'all',
    }}>
      <style>{`
        @keyframes xcPulse { 0%,100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
        @keyframes xcProgress { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
      `}</style>

      <div style={{
        position: 'relative',
        marginBottom: 20,
        width: 72,
        height: 72,
        opacity: phase === 'entering' ? 0 : 1,
        transition: 'opacity 0.4s ease',
      }}>
        <div style={{
          position: 'absolute',
          inset: -16,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.35) 0%, transparent 70%)',
          animation: 'xcPulse 2.4s ease-in-out infinite',
        }} />
        <img
          src={getLogo()}
          alt=""
          style={{
            width: '100%', height: '100%', objectFit: 'contain',
            position: 'relative', zIndex: 1,
            filter: 'drop-shadow(0 0 16px rgba(6,182,212,0.6))',
          }}
        />
      </div>

      <h1 style={{
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        fontWeight: 900,
        fontSize: 'clamp(2rem, 5vw, 3.2rem)',
        letterSpacing: '-0.04em',
        color: '#fff',
        lineHeight: 1,
        margin: 0,
        marginBottom: 32,
        opacity: phase === 'entering' ? 0 : 1,
        transition: 'opacity 0.5s ease 0.2s',
      }}>
        Xyber<span style={{ color: '#06b6d4' }}>Clan</span>
      </h1>

      <div style={{ width: 'min(280px, 55vw)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{
          width: '100%', height: 1,
          background: 'rgba(255,255,255,0.1)',
          position: 'relative', overflow: 'hidden',
          opacity: phase === 'entering' ? 0 : 1,
          transition: 'opacity 0.3s ease 0.4s',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
            boxShadow: '0 0 8px rgba(6,182,212,0.8)',
            transformOrigin: 'left center',
            transform: phase === 'loading' ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 1.6s ease-in-out',
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: "'Inter', monospace", fontSize: '0.6rem', fontWeight: 500,
            letterSpacing: '0.15em', textTransform: 'uppercase', color: '#333',
          }}>Loading</span>
          <span style={{
            fontFamily: "'Inter', monospace", fontSize: '0.65rem', fontWeight: 700,
            letterSpacing: '0.1em', color: '#06b6d4', fontVariantNumeric: 'tabular-nums',
          }}>
            {phase === 'entering' ? '0%' : '100%'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
