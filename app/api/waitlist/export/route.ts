import { NextResponse } from "next/server"

interface Contact {
  email: string
  timestamp: string
}

const contacts: Contact[] = []

export async function GET() {
  const csvHeader = "Email,Data de Cadastro\n"

  const csvRows = contacts
    .map((contact) => {
      const date = new Date(contact.timestamp).toLocaleString("pt-BR")
      return `"${contact.email}","${date}"`
    })
    .join("\n")

  const csv = csvHeader + csvRows

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="waitlist-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  })
}
