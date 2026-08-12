import React, { useEffect, useRef, useId } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  closeOnBackdropClick?: boolean;
  className?: string;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  initialFocusRef,
  closeOnBackdropClick = true,
  className = "",
}) => {
  const dialogId = useId();
  const titleId = `modal-title-${dialogId}`;
  const descriptionId = `modal-desc-${dialogId}`;

  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Keep stable refs for callbacks to prevent effect re-triggering on parent re-renders
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const initialFocusRefRef = useRef(initialFocusRef);
  initialFocusRefRef.current = initialFocusRef;

  // Focus trap & focus restoration lifecycle triggered exclusively on `isOpen` transition
  useEffect(() => {
    if (!isOpen) return;

    // 1. Store the element that had focus before modal opened
    previousActiveElement.current = document.activeElement as HTMLElement | null;

    // 2. Lock body scroll safely, preserving previous inline style
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Helper function to query currently visible and tabbable elements dynamically
    const getFocusableElements = (): HTMLElement[] => {
      if (!dialogRef.current) return [];
      return Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter(
        (el) =>
          !el.hasAttribute("disabled") &&
          el.getAttribute("aria-hidden") !== "true" &&
          (el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement)
      );
    };

    // 3. Move initial focus into modal
    const timer = setTimeout(() => {
      const customFocusEl = initialFocusRefRef.current?.current;
      if (customFocusEl && document.body.contains(customFocusEl)) {
        customFocusEl.focus();
      } else {
        const focusables = getFocusableElements();
        if (focusables.length > 0) {
          focusables[0].focus();
        } else if (dialogRef.current) {
          dialogRef.current.focus();
        }
      }
    }, 10);

    // 4. Handle Escape and Tab key trapping dynamically
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (event.key === "Tab") {
        if (!dialogRef.current) return;

        // Dynamic query at the exact moment of tab press
        const focusables = getFocusableElements();

        if (focusables.length === 0) {
          event.preventDefault();
          dialogRef.current.focus();
          return;
        }

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];
        const currentActive = document.activeElement;

        // If focus is currently outside the modal container, force focus back inside
        if (!dialogRef.current.contains(currentActive)) {
          event.preventDefault();
          if (event.shiftKey) {
            lastElement.focus();
          } else {
            firstElement.focus();
          }
          return;
        }

        if (event.shiftKey) {
          // Shift + Tab: Wrap from first element (or dialog container) to last
          if (currentActive === firstElement || currentActive === dialogRef.current) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: Wrap from last element to first
          if (currentActive === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup: Restore body scroll style, remove listener, and restore focus safely
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);

      if (
        previousActiveElement.current &&
        document.body.contains(previousActiveElement.current) &&
        typeof previousActiveElement.current.focus === "function"
      ) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={`relative w-full max-w-lg rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-2xl outline-none text-slate-100 animate-in zoom-in-95 duration-200 ${className}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 id={titleId} className="text-xl font-semibold text-white tracking-tight">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="text-sm text-slate-400 mt-1">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-2 text-slate-300">{children}</div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};
