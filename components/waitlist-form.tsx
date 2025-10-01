"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { toast } from 'sonner';
import { SuccessModal } from "./success-modal"

export function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast('Campo obrigatório',{
        description: "Por favor, preencha seu email.",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        toast.success('Cadastro realizado com sucesso!', {
          description: 'Você foi adicionado à whitelist.',
          position: 'bottom-center'
        });
        setEmail('')
      } else {
        throw new Error("Erro ao adicionar à lista")
      }
    } catch (error) {
      toast.error("Erro",{
        description: "Não foi possível adicionar você à lista. Tente novamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex m-auto w-full max-w-xl gap-3">
        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 flex-1 border-white/20 bg-white/10 text-white placeholder:text-white/50 backdrop-blur-sm transition-all duration-300 hover:border-[#08d6b4]/50 focus:border-[#08d6b4] focus:ring-2 focus:ring-[#08d6b4]/50"
          required
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="h-10 px-8 text-xs font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
          style={{
            backgroundColor: "#08d6b4",
            color: "#000814",
          }}
        >
          {isLoading ? "Joining..." : "Join Waitlist"}
        </Button>
      </form>

      <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />

      {/* <Toaster /> */}
    </>
  )
}
