import React, { useState, useEffect, useRef } from 'react';
import { getLogo } from '../utils/festive';

const Preloader = ({ onComplete }) => {
  const [hide, setHide] = useState(() => !!sessionStorage.getItem('xc_visited'));
  const cb = useRef(onComplete);
  cb.current = onComplete;

  useEffect(() => {
    if (hide) {
      cb.current?.();
      return;
    }
    const timer = setTimeout(() => {
      sessionStorage.setItem('xc_visited', 'true');
      setHide(true);
      cb.current?.();
    }, 2000);
    return () => { clearTimeout(timer); };
  }, [hide]);

  if (hide) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes slFadeIn {
          0% { opacity: 0; transform: scale(0.92) translateY(12px); filter: blur(6px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        @keyframes slFadeOut {
          0% { opacity: 1; transform: scale(1); filter: blur(0); }
          100% { opacity: 0; transform: scale(1.35); filter: blur(4px); }
        }
        @keyframes slCharIn {
          0% { opacity: 0; transform: translateY(6px); filter: blur(3px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes slBarsOut {
          0% { transform: translateY(0); }
          100% { transform: translateY(var(--d, -100%)); }
        }
        @keyframes slGrain {
          0%, 100% { transform: translate(0,0); }
          25% { transform: translate(-3%,2%); }
          50% { transform: translate(2%,-3%); }
          75% { transform: translate(-2%,3%); }
        }
      `}</style>

      {/* Film grain */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.35,
        pointerEvents: 'none', mixBlendMode: 'overlay',
      }}>
        <div style={{
          width: '200%', height: '200%', position: 'absolute',
          top: '-50%', left: '-50%',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.5\'/%3E%3C/svg%3E")',
          backgroundSize: '256px 256px',
          animation: 'slGrain 0.3s steps(4) infinite',
          opacity: 0.4,
        }} />
      </div>

      {/* Letterbox bars */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '12vh',
        background: '#000', zIndex: 2,
        animation: 'slBarsOut 0.7s cubic-bezier(0.65,0,0.35,1) 1.3s forwards',
        '--d': '-100%',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '12vh',
        background: '#000', zIndex: 2,
        animation: 'slBarsOut 0.7s cubic-bezier(0.65,0,0.35,1) 1.3s forwards',
        '--d': '100%',
      }} />

      {/* Center content */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
        animation: 'slFadeIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards, slFadeOut 0.7s cubic-bezier(0.65,0,0.35,1) 1.3s forwards',
      }}>
        <img src={getLogo()} alt="" style={{ width: 96, height: 96, objectFit: 'contain' }} />
        <span style={{
          marginTop: 20,
          fontFamily: "'Inter','Helvetica Neue',sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(1.4rem,3.5vw,2.2rem)',
          letterSpacing: '-0.03em',
          color: '#fff', lineHeight: 1,
          display: 'flex', gap: 1,
        }}>
          {'XyberClan'.split('').map((c, i) => (
            <span key={i} style={{
              display: 'inline-block',
              animation: `slCharIn 0.3s cubic-bezier(0.22,1,0.36,1) ${0.15 + i * 0.08}s forwards`,
              opacity: 0,
            }}>{c}</span>
          ))}
        </span>
      </div>
    </div>
  );
};

export default Preloader;
