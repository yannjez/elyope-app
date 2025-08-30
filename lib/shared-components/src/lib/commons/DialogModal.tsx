'use client';

import { ReactNode, useCallback } from 'react';
import { cn } from '../utils/cn';
import Button from '../forms/Button';

export type DialogModalProps = {
  open: boolean;
  title?: string | ReactNode;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  className?: string;
  confirmClassName?: string;
  cancelClassName?: string;
  icon?: ReactNode;
  disableOutsideClick?: boolean;
};

export default function DialogModal({
  open,
  title = 'Dialog',
  children,
  confirmLabel = 'Save',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
  className,
  confirmClassName,
  cancelClassName,
  icon,
  disableOutsideClick = false,
}: DialogModalProps) {
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (disableOutsideClick) return;
      if (e.target === e.currentTarget) {
        onCancel();
      }
    },
    [disableOutsideClick, onCancel]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center rounded-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-black/30" />

      <div
        className={cn(
          'relative z-10 w-[92%] max-w-lg rounded-8 bg-white p-4 shadow-lg',
          className
        )}
      >
        <div className="flex items-start gap-3">
          {icon && <div className="mt-1">{icon}</div>}
          <div className="flex-1">
            {typeof title === 'string' ? (
              <h2 className="text-16 font-semibold text-el-grey-600">{title}</h2>
            ) : (
              title
            )}
          </div>
        </div>

        <div className="mt-3">{children}</div>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            onClick={onCancel}
            className={cn('min-w-24 bg-el-grey-100 text-el-grey-500', cancelClassName)}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={cn('min-w-24 button-primary', confirmClassName)}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}


