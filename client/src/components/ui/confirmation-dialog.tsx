import React from 'react';
import { Button } from './button';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconColor: 'text-red-400',
          titleColor: 'text-red-300',
          confirmBg: 'bg-red-600/80 hover:bg-red-600 border-red-500/50',
          borderGlow: 'border-red-500/50 shadow-red-500/20'
        };
      case 'warning':
        return {
          iconColor: 'text-orange-400',
          titleColor: 'text-orange-300',
          confirmBg: 'bg-orange-600/80 hover:bg-orange-600 border-orange-500/50',
          borderGlow: 'border-orange-500/50 shadow-orange-500/20'
        };
      default:
        return {
          iconColor: 'text-cyan-400',
          titleColor: 'text-cyan-300',
          confirmBg: 'bg-cyan-600/80 hover:bg-cyan-600 border-cyan-500/50',
          borderGlow: 'border-cyan-500/50 shadow-cyan-500/20'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className={`
        relative bg-slate-900/95 backdrop-blur-md border-2 rounded-xl p-6 max-w-md w-full
        shadow-2xl ${styles.borderGlow}
        transform transition-all duration-300 ease-out
      `}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-2 rounded-full bg-slate-800/50 ${styles.iconColor}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${styles.titleColor} mb-2`}>
              {title}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/70 hover:text-slate-100 transition-all duration-200"
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`${styles.confirmBg} text-white font-medium transition-all duration-200 shadow-lg`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}