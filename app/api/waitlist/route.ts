import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
interface Contact {
  email: string
  timestamp: string
}

const contacts: Contact[] = []
const csvPath = path.join(process.cwd(), "contacts.csv")

// Ensure CSV file exists with header
if (!fs.existsSync(csvPath)) {
  fs.writeFileSync(csvPath, "email,timestamp\n", "utf-8")
}

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

    // Append to CSV file
    const csvLine = `"${newContact.email}","${newContact.timestamp}"\n`
    fs.appendFileSync(csvPath, csvLine, "utf-8")

    return NextResponse.json({ success: true, contact: newContact }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao processar requisição" }, { status: 500 })
  }
}
