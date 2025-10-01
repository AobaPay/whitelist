"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Users, Mail, Building, Trash2, AlertCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const password = searchParams.get("pswd")
  
  useEffect(() => {
    // Verificar senha
    if (password !== "BBgg0218") {
      setError("Acesso não autorizado. Senha incorreta.")
      setAuthorized(false)
      setLoading(false)
      return
    }
    
    setAuthorized(true)
    fetchLeads()
  }, [password])
  
  const fetchLeads = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/waitlist?pswd=${password}`)
      
      if (!response.ok) {
        throw new Error("Falha ao carregar leads")
      }
      
      const data = await response.json()
      setLeads(data.leads || [])
      setError("")
    } catch (err) {
      console.error("Erro ao carregar leads:", err)
      setError("Falha ao carregar leads. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const downloadCSV = () => {
    const csvContent = [
      "Email,Data",
      ...leads.map(
        (lead) =>
          `${lead.email},${new Date(lead.createdAt).toLocaleDateString("pt-BR")}`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `leads-cpay-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  const deleteLead = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este lead?")) {
      return
    }
    
    try {
      const response = await fetch(`/api/leads?pswd=${password}&id=${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error("Falha ao excluir lead")
      }
      
      // Atualizar a lista após exclusão
      setLeads(leads.filter(lead => lead.id !== id))
    } catch (err) {
      console.error("Erro ao excluir lead:", err)
      alert("Falha ao excluir lead. Tente novamente.")
    }
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || "Acesso não autorizado"}</AlertDescription>
          </Alert>
          <p className="text-center mt-4">Para acessar esta página, adicione o parâmetro de senha correto na URL.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-bricolage">Gerenciar Leads</h1>
            <p className="text-muted-foreground">Visualize e exporte os leads capturados pelo site</p>
          </div>
          <Button onClick={downloadCSV} className="bg-[#08d6b4] hover:bg-[#08d6b4]/90 text-black font-semibold">
            <Download className="w-4 h-4 mr-2" />
            Baixar CSV
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#08d6b4]/10 rounded-lg">
                  <Users className="w-6 h-6 text-[#08d6b4]" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-bricolage">{leads.length}</p>
                  <p className="text-muted-foreground">Total de Leads</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#08d6b4]/10 rounded-lg">
                  <Mail className="w-6 h-6 text-[#08d6b4]" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-bricolage">
                    {
                      leads.filter(
                        (lead) => new Date(lead.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                      ).length
                    }
                  </p>
                  <p className="text-muted-foreground">Esta Semana</p>
                </div>
              </div>
            </CardContent>
          </Card>

     
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-bricolage">Lista de Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {loading ? (
                <p className="text-center py-8">Carregando leads...</p>
              ) : leads.length === 0 ? (
                <p className="text-center py-8">Nenhum lead encontrado.</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-bricolage">Email</th>
                      <th className="text-left p-4 font-bricolage">Data</th>
                      <th className="text-left p-4 font-bricolage">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b border-border hover:bg-muted/50">
                        <td className="p-4 text-muted-foreground">{lead.email}</td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="p-4">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteLead(lead.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
