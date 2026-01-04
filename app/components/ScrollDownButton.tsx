"use client";

import React from "react";

type ScrollDownButtonProps = {
  onClick: () => void;
  ariaLabel?: string;
};

export function ScrollDownButton({ onClick, ariaLabel = "向下滚动" }: ScrollDownButtonProps) {
  return (
    <button
      onClick={onClick}
      className="animate-bounce cursor-pointer bg-transparent border-none focus:outline-none"
      aria-label={ariaLabel}
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-[#FFC7C7] hover:text-[#8785A2] transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </button>
  );
}
