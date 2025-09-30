export const runtime = "edge"

interface Contact {
  email: string
  timestamp: string
}

// Import KVNamespace from Cloudflare Workers
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

    if (!kv) {
      // Fallback for non-Cloudflare environments
      return new Response(JSON.stringify({ contacts: [] }), {
        headers: { "Content-Type": "application/json" },
      })
    }

    const contactsData = (await kv.get("contacts", "json")) as Contact[] | null
    const contacts = contactsData || []

    return new Response(JSON.stringify({ contacts }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ contacts: [] }), {
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, timestamp } = body

    if (!email) {
      return new Response(JSON.stringify({ error: "Email é obrigatório" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const env = (request as any).env as CloudflareEnv
    const kv = env?.WAITLIST_KV

    if (!kv) {
      // Fallback for non-Cloudflare environments
      return new Response(JSON.stringify({ success: true, contact: { email, timestamp } }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      })
    }

    const contactsData = (await kv.get("contacts", "json")) as Contact[] | null
    const contacts = contactsData || []

    const newContact: Contact = {
      email,
      timestamp: timestamp || new Date().toISOString(),
    }

    contacts.push(newContact)
    await kv.put("contacts", JSON.stringify(contacts))

    return new Response(JSON.stringify({ success: true, contact: newContact }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro ao processar requisição" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
