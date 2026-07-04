import React, { useState, useEffect } from 'react';
import { getLogo } from '../utils/festive';

const Preloader = ({ onComplete }) => {
  const [phase, setPhase] = useState('entrance');

  useEffect(() => {
    if (sessionStorage.getItem('xc_visited')) {
      onComplete?.();
      return;
    }

    const t1 = setTimeout(() => setPhase('hold'), 80);
    const t2 = setTimeout(() => setPhase('exit'), 2200);
    const t3 = setTimeout(() => {
      sessionStorage.setItem('xc_visited', 'true');
      onComplete?.();
    }, 3600);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  if (phase === 'done') return null;

  const isExit = phase === 'exit';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: isExit ? 'none' : 'all',
      }}
    >
      <style>{`
        @keyframes logoEntrance {
          0% { opacity: 0; transform: scale(0.92) translateY(12px); filter: blur(6px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        @keyframes logoPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.03); }
        }
        @keyframes logoExit {
          0% { opacity: 1; transform: scale(1); filter: blur(0); }
          100% { opacity: 0; transform: scale(1.35); filter: blur(4px); }
        }
        @keyframes barsExit {
          0% { transform: translateY(0); }
          100% { transform: translateY(var(--dir, -100%)); }
        }
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-3%, -2%); }
          20% { transform: translate(2%, -4%); }
          30% { transform: translate(-4%, 3%); }
          40% { transform: translate(3%, 2%); }
          50% { transform: translate(-2%, -3%); }
          60% { transform: translate(4%, 1%); }
          70% { transform: translate(-3%, 4%); }
          80% { transform: translate(1%, -3%); }
          90% { transform: translate(-2%, 2%); }
        }
      `}</style>

      {/* Film grain overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: isExit ? 0 : 0.35,
          transition: 'opacity 1s ease',
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
        }}
      >
        <div
          style={{
            width: '200%',
            height: '200%',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.5\'/%3E%3C/svg%3E")',
            backgroundSize: '256px 256px',
            animation: 'grain 0.3s steps(4) infinite',
            opacity: 0.4,
          }}
        />
      </div>

      {/* Letterbox bars */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '12vh',
          background: '#000',
          zIndex: 2,
          animation: isExit ? 'barsExit 0.8s cubic-bezier(0.65, 0, 0.35, 1) forwards' : 'none',
          '--dir': '-100%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '12vh',
          background: '#000',
          zIndex: 2,
          animation: isExit ? 'barsExit 0.8s cubic-bezier(0.65, 0, 0.35, 1) forwards' : 'none',
          '--dir': '100%',
        }}
      />

      {/* Logo */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
          animation:
            phase === 'entrance' ? 'logoEntrance 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards' :
            phase === 'hold' ? 'logoPulse 3s ease-in-out infinite' :
            'logoExit 1.4s cubic-bezier(0.65, 0, 0.35, 1) forwards',
        }}
      >
        <img
          src={getLogo()}
          alt="XyberClan"
          style={{
            width: 96,
            height: 96,
            objectFit: 'contain',
          }}
        />
      </div>
    </div>
  );
};

export default Preloader;
