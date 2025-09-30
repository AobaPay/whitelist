import { AnimatedBackground } from "@/components/animated-background"
import { WaitlistForm } from "@/components/waitlist-form"
import Image from "next/image"

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-10 text-center">
          <div className="flex justify-center animate-in fade-in slide-in-from-top duration-700">
            <div className="rounded-full border border-[#08d6b4] bg-[#08d6b4]/10 px-4 py-1.5 text-sm font-medium text-[#08d6b4] backdrop-blur-sm">
              Coming soon
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-top duration-700 delay-150">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="AOBAPAY Logo"
                width={70}
                height={70}
                className="h-auto w-auto drop-shadow-[0_0_25px_rgba(8,214,180,0.5)]"
                priority
              />
            </div>
            <h2 className="text-balance font-sans text-4xl font-bold tracking-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl">
              Gateway de Pagamentos
            </h2>
          </div>

          <p className="text-pretty text-lg text-white/80 drop-shadow-md md:text-xl animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            Pix com valor fixo de{" "}
            <span className="font-bold drop-shadow-[0_0_10px_rgba(8,214,180,0.5)]" style={{ color: "#08d6b4" }}>
              R$ 0,78
            </span>{" "}
            por transação. Solicite seu acesso à plataforma mais rápida e confiável do mercado.
          </p>

          <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-500">
            <WaitlistForm />
          </div>
        </div>
      </div>
    </main>
  )
}
