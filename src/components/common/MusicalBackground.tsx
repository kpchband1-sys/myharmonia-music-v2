import React from 'react';

export const MusicalBackground: React.FC = () => {
  const notes = [
    { symbol: '𝄞', left: '5%', top: '15%', size: '3rem', delay: '0s', duration: '9s' },
    { symbol: '♪', left: '12%', top: '65%', size: '2rem', delay: '1.5s', duration: '7s' },
    { symbol: '♫', left: '22%', top: '25%', size: '2.5rem', delay: '3s', duration: '8.5s' },
    { symbol: '♬', left: '35%', top: '80%', size: '1.75rem', delay: '0.8s', duration: '6.5s' },
    { symbol: '♩', left: '48%', top: '18%', size: '2.2rem', delay: '2.2s', duration: '10s' },
    { symbol: '𝄢', left: '58%', top: '70%', size: '2.8rem', delay: '4s', duration: '8s' },
    { symbol: '♫', left: '70%', top: '30%', size: '2.4rem', delay: '1s', duration: '9.5s' },
    { symbol: '𝄞', left: '82%', top: '75%', size: '3.2rem', delay: '2.8s', duration: '7.5s' },
    { symbol: '♪', left: '92%', top: '20%', size: '2.1rem', delay: '3.5s', duration: '8.8s' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 no-print select-none">
      {/* Deep Navy/Black Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#091129] to-[#020617] opacity-95" />

      {/* Radial Blue Light Orbs */}
      <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]" />
      <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-sky-600/10 rounded-full blur-[130px]" />

      {/* Subtle Stave Lines (5 parallel lines) */}
      <div className="absolute inset-0 opacity-[0.03] flex flex-col justify-around py-20 pointer-events-none">
        {[0, 1, 2].map((staveIdx) => (
          <div key={staveIdx} className="w-full space-y-3">
            <div className="w-full h-px bg-blue-300" />
            <div className="w-full h-px bg-blue-300" />
            <div className="w-full h-px bg-blue-300" />
            <div className="w-full h-px bg-blue-300" />
            <div className="w-full h-px bg-blue-300" />
          </div>
        ))}
      </div>

      {/* Animated Floating Musical Notes */}
      {notes.map((n, idx) => (
        <span
          key={idx}
          className="absolute text-blue-400/20 font-serif transition-all"
          style={{
            left: n.left,
            top: n.top,
            fontSize: n.size,
            animation: `floatNote ${n.duration} ease-in-out infinite`,
            animationDelay: n.delay,
            filter: 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.2))',
          }}
        >
          {n.symbol}
        </span>
      ))}
    </div>
  );
};
