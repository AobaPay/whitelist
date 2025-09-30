import { NextResponse } from "next/server"

interface Contact {
  email: string
  timestamp: string
}

const contacts: Contact[] = []

export async function GET() {
  return NextResponse.json({ contacts })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, timestamp } = body

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 })
    }

    const newContact: Contact = {
      email,
      timestamp: timestamp || new Date().toISOString(),
    }

    contacts.push(newContact)

    return NextResponse.json({ success: true, contact: newContact }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao processar requisição" }, { status: 500 })
  }
}
