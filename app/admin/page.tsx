"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AnimatedBackground } from "@/components/animated-background"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Users, Mail } from "lucide-react"
import Image from "next/image"

interface Contact {
  email: string
  timestamp: string
}

function AdminContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const password = searchParams.get("pswd")
    if (password === "102030") {
      setIsAuthorized(true)
      loadContacts()
    } else {
      setIsAuthorized(false)
      setIsLoading(false)
    }
  }, [searchParams])

  const loadContacts = async () => {
    try {
      const response = await fetch("/api/waitlist")
      if (response.ok) {
        const data = await response.json()
        setContacts(data.contacts || [])
      }
    } catch (error) {
      console.error("Error loading contacts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadCSV = async () => {
    try {
      const response = await fetch("/api/waitlist/export")
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `waitlist-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Error downloading CSV:", error)
    }
  }

  if (!isAuthorized) {
    return (
      <main className="relative min-h-screen">
        <AnimatedBackground />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
          <Card className="w-full max-w-md border-white/20 bg-white/5 backdrop-blur-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Acesso Negado</CardTitle>
              <CardDescription className="text-white/60">
                Você precisa da senha correta para acessar o painel administrativo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push("/")}
                className="w-full"
                style={{
                  backgroundColor: "#08d6b4",
                  color: "#000814",
                }}
              >
                Voltar para a página inicial
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="relative min-h-screen">
        <AnimatedBackground />
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="text-white">Carregando...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />
      <div className="relative z-10 min-h-screen px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image src="/logo.svg" alt="Logo" width={120} height={40} className="h-auto w-auto" />
              <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
            </div>
            <Button
              onClick={handleDownloadCSV}
              className="gap-2"
              style={{
                backgroundColor: "#08d6b4",
                color: "#000814",
              }}
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-white/20 bg-white/5 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Total de Contatos</CardTitle>
                <Users className="h-4 w-4 text-[#08d6b4]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{contacts.length}</div>
              </CardContent>
            </Card>

            <Card className="border-white/20 bg-white/5 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Emails Únicos</CardTitle>
                <Mail className="h-4 w-4 text-[#08d6b4]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{new Set(contacts.map((c) => c.email)).size}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-white/20 bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Lista de Contatos</CardTitle>
              <CardDescription className="text-white/60">
                Todos os contatos cadastrados na lista de espera
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="pb-3 text-left text-sm font-medium text-white/80">Email</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/80">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="py-8 text-center text-white/60">
                          Nenhum contato cadastrado ainda
                        </td>
                      </tr>
                    ) : (
                      contacts.map((contact, index) => (
                        <tr key={index} className="border-b border-white/5">
                          <td className="py-3 text-white">{contact.email}</td>
                          <td className="py-3 text-white/60">
                            {new Date(contact.timestamp).toLocaleDateString("pt-BR")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <main className="relative min-h-screen">
          <AnimatedBackground />
          <div className="relative z-10 flex min-h-screen items-center justify-center">
            <div className="text-white">Carregando...</div>
          </div>
        </main>
      }
    >
      <AdminContent />
    </Suspense>
  )
}
