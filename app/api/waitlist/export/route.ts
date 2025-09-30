export const runtime = "edge"

interface Contact {
  email: string
  timestamp: string
}

import type { KVNamespace } from "@cloudflare/workers-types"

declare global {
  interface CloudflareEnv {
    WAITLIST_KV: KVNamespace
  }
}

export async function GET(request: Request) {
  try {
    const env = (request as any).env as CloudflareEnv
    const kv = env?.WAITLIST_KV

    let contacts: Contact[] = []

    if (kv) {
      const contactsData = (await kv.get("contacts", "json")) as Contact[] | null
      contacts = contactsData || []
    }

    const csvHeader = "Email,Data de Cadastro\n"

    const csvRows = contacts
      .map((contact) => {
        const date = new Date(contact.timestamp).toLocaleString("pt-BR")
        return `"${contact.email}","${date}"`
      })
      .join("\n")

    const csv = csvHeader + csvRows

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="waitlist-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    return new Response("Erro ao exportar dados", { status: 500 })
  }
}
