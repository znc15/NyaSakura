"use client";

import { useEffect, useState } from "react";
import "../styles/home.css";

interface SakuraProps {
  count?: number;
}

export function Sakura({ count = 15 }: SakuraProps) {
  const [sakuras, setSakuras] = useState<Array<{
    id: number;
    left: string;
    animationDelay: string;
    animationDuration: string;
    scale: string;
  }>>([]);

  useEffect(() => {
    const newSakuras = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${15 + Math.random() * 15}s, ${3 + Math.random() * 2}s`,
      scale: `${0.15 + Math.random() * 0.2}`
    }));
    setSakuras(newSakuras);
  }, [count]);

  const SakuraSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="100%" height="100%">
      <path fill="#FFB7C5" d="M20,0 C22,7 28,12 35,15 C28,18 22,23 20,30 C18,23 12,18 5,15 C12,12 18,7 20,0 Z"/>
      <path fill="#FF99B4" d="M20,5 C21.2,10 25,14 30,15 C25,16 21.2,20 20,25 C18.8,20 15,16 10,15 C15,14 18.8,10 20,5 Z"/>
    </svg>
  );

  return (
    <div className="sakura-container">
      {sakuras.map((sakura) => (
        <div
          key={sakura.id}
          style={{
            position: 'absolute',
            top: '-50px',
            left: sakura.left,
            width: '25px',
            height: '25px',
            animationName: 'fall, sway',
            animationTimingFunction: 'linear, ease-in-out',
            animationIterationCount: 'infinite, infinite',
            animationDirection: 'normal, alternate',
            animationDelay: sakura.animationDelay,
            animationDuration: sakura.animationDuration,
            transform: `scale(${sakura.scale})`,
            zIndex: 8,
            willChange: 'transform, top'
          }}
        >
          <SakuraSvg />
        </div>
      ))}
    </div>
  );
} 