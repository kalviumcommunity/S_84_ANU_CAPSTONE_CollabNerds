import React, { useEffect } from 'react';
import '../Styles/MagicCursorTrail.css';

const MagicCursorTrail = () => {
  useEffect(() => {
    const colors = ['#8f5fe8', '#ff8de8', '#62e3ff', '#a6ffcb'];

    const handleMouseMove = (e) => {
      const trail = document.createElement('div');
      trail.className = 'trail';

      // Random color and size
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 6 + 6;

      trail.style.width = `${size}px`;
      trail.style.height = `${size}px`;
      trail.style.left = `${e.pageX}px`;
      trail.style.top = `${e.pageY}px`;
      trail.style.background = `radial-gradient(circle at center, ${color}, white)`;
      trail.style.boxShadow = `0 0 10px ${color}, 0 0 25px white`;

      document.body.appendChild(trail);

      setTimeout(() => {
        trail.remove();
      }, 800);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return null;
};

export default MagicCursorTrail;
