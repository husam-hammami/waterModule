import { useState, useCallback } from 'react';

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function useConfirmation() {
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    options: ConfirmationOptions;
    onConfirm: () => void;
  } | null>(null);

  const confirm = useCallback((options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmation({
        isOpen: true,
        options,
        onConfirm: () => {
          resolve(true);
          setConfirmation(null);
        }
      });

      // Auto-resolve to false if the dialog is closed without confirmation
      const timeout = setTimeout(() => {
        resolve(false);
        setConfirmation(null);
      }, 30000); // 30 second timeout

      // Clear timeout if confirmed before timeout
      const originalOnConfirm = () => {
        clearTimeout(timeout);
        resolve(true);
        setConfirmation(null);
      };

      setConfirmation(prev => prev ? { ...prev, onConfirm: originalOnConfirm } : null);
    });
  }, []);

  const closeConfirmation = useCallback(() => {
    setConfirmation(null);
  }, []);

  return {
    confirmation,
    confirm,
    closeConfirmation
  };
}