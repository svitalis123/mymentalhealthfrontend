// src/components/a11y/AccessibleModal.tsx
import { useEffect, useRef } from 'react'
import { useA11y } from '../../hooks/useA11y'
import { X } from 'lucide-react'

interface AccessibleModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export const AccessibleModal = ({
  isOpen,
  onClose,
  title,
  children
}: AccessibleModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const { trapFocus } = useA11y()

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const cleanup = trapFocus(modalRef.current)
      return cleanup
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        />

        {/* Modal */}
        <div
          ref={modalRef}
          className="relative bg-white rounded-lg max-w-lg w-full mx-4 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 id="modal-title" className="text-lg font-medium">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
