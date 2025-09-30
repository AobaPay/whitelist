"use client"

import { useEffect } from "react"
import { CheckCircle2 } from "lucide-react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-300"
        style={{
          animation: "fadeInScale 0.3s ease-out",
        }}
      >
        <div
          className="rounded-2xl border border-[#08d6b4]/30 p-8 text-center shadow-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(0, 46, 201, 0.95) 0%, rgba(0, 26, 112, 0.95) 100%)",
            boxShadow: "0 0 60px rgba(8, 214, 180, 0.3)",
          }}
        >
          <div className="mb-4 flex justify-center">
            <div
              className="rounded-full p-3"
              style={{
                backgroundColor: "rgba(8, 214, 180, 0.2)",
              }}
            >
              <CheckCircle2 className="h-12 w-12" style={{ color: "#08d6b4" }} />
            </div>
          </div>

          <h3 className="mb-2 text-2xl font-bold text-white">Bem-vindo à lista!</h3>
          <p className="text-white/70">
            Você foi adicionado com sucesso à nossa whitelist. Em breve entraremos em contato.
          </p>
        </div>
      </div>
    </div>
  )
}
