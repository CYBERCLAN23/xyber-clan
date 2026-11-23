import React from 'react';
import { isHolidaySeason } from '../utils/festive';

const Snowfall = () => {
  if (!isHolidaySeason()) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-[40] overflow-hidden select-none" aria-hidden="true">
      <style>{`
        .snowflake {
          position: fixed;
          top: -10%;
          color: white;
          font-size: 1.2em;
          font-family: Arial, sans-serif;
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
          cursor: default;
          z-index: 40;
          user-select: none;
          animation: fall linear infinite;
          opacity: 0.6;
        }

        .dark .snowflake {
          opacity: 0.4;
        }

        @keyframes fall {
          0% {
            transform: translateY(0vh) rotate(0deg);
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
          }
        }

        ${Array.from({ length: 50 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 20;
        const duration = 10 + Math.random() * 20;
        const size = 0.5 + Math.random() * 1.5;
        const horizontalVariation = (Math.random() - 0.5) * 200;

        return `
            .snowflake:nth-child(${i + 1}) {
              left: ${left}%;
              animation-delay: ${delay}s;
              animation-duration: ${duration}s;
              font-size: ${size}em;
              --horizontal-end: ${left + horizontalVariation}%;
            }
          `;
      }).join('')}
      `}</style>
      {Array.from({ length: 50 }).map((_, i) => (
        <div key={i} className="snowflake">❅</div>
      ))}
    </div>
  );
};

export default Snowfall;
