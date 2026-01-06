"use client";

import React, { useEffect, useRef, useState } from 'react';

interface DialogProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Dialog: React.FC<DialogProps> = ({ title, children, onClose }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  
  // 处理关闭动画
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // 动画持续时间
  };

  // 点击对话框外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // 按ESC键关闭对话框
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  // 防止滚动
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-black/25" />
      <div 
        ref={dialogRef}
        className={`relative ns-dialog backdrop-blur-sm rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'} animate-dialog-enter`}
      >
        <div className="flex justify-between items-center p-4 ns-dialog__header">
          <h3 className="text-xl font-semibold ns-dialog__title">{title}</h3>
          <button 
            onClick={handleClose}
            className="ns-dialog__close focus:outline-none transition-colors"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog; 