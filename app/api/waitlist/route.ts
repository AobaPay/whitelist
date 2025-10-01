import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
interface Contact {
  id: string
  email: string
  createdAt: string
}

const contacts: Contact[] = []

const CSV_FILE_PATH = path.join(process.cwd(), 'data', 'leads.csv');

// Garantir que o diretório data existe
const ensureDirectoryExists = () => {
  const dir = path.dirname(CSV_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Criar arquivo CSV se não existir
  if (!fs.existsSync(CSV_FILE_PATH)) {
    fs.writeFileSync(CSV_FILE_PATH, 'id,email,createdAt\n');
  }
};


export async function GET() {
  try {
    ensureDirectoryExists();
    
    if (!fs.existsSync(CSV_FILE_PATH)) {
      return NextResponse.json({ leads: [] });
    }
    
    const csvData = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
    const rows = csvData.split('\n');
    const headers = rows[0].split(',');
    
    const leads = rows.slice(1)
      .filter(row => row.trim() !== '')
      .map(row => {
        const values = row.split(',');
        const lead: Record<string, string> = {};
        
        headers.forEach((header, index) => {
          lead[header] = values[index] || '';
        });
        
        return lead;
      });
    
    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Erro ao ler leads:', error);
    return NextResponse.json({ error: 'Erro ao ler leads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // try {
  //   const body = await request.json()
  //   const { email, timestamp } = body

  //   if (!email) {
  //     return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 })
  //   }

  //   const newContact: Contact = {
  //     email,
  //     timestamp: timestamp || new Date().toISOString(),
  //   }

  //   contacts.push(newContact)

  //   // Append to CSV file
  //   const csvLine = `"${newContact.email}","${newContact.timestamp}"\n`
  //   fs.appendFileSync(csvPath, csvLine, "utf-8")

  //   return NextResponse.json({ success: true, contact: newContact }, { status: 201 })
  // } catch (error) {
  //   return NextResponse.json({ error: "Erro ao processar requisição" }, { status: 500 })
  // }

   try {
    ensureDirectoryExists();
    
    const lead = await request.json();
    
    if (!lead.email) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }
    
    // Adicionar ID e data se não existirem
    lead.id = lead.id || Date.now().toString();
    lead.createdAt = lead.createdAt || new Date().toISOString();
    
    // Formatar linha CSV
    const csvLine = `${lead.id},${lead.email},${lead.createdAt}\n`;
    
    // Adicionar ao arquivo
    fs.appendFileSync(CSV_FILE_PATH, csvLine);
    
    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error('Erro ao salvar lead:', error);
    return NextResponse.json({ error: 'Erro ao salvar lead' }, { status: 500 });
  }
}







// import { NextRequest, NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';

// const CSV_FILE_PATH = path.join(process.cwd(), 'data', 'leads.csv');

// // Garantir que o diretório data existe
// const ensureDirectoryExists = () => {
//   const dir = path.dirname(CSV_FILE_PATH);
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
  
//   // Criar arquivo CSV se não existir
//   if (!fs.existsSync(CSV_FILE_PATH)) {
//     fs.writeFileSync(CSV_FILE_PATH, 'id,name,email,cnpj,volume,createdAt\n');
//   }
// };

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const password = searchParams.get('pswd');
  
//   // Verificar senha
//   if (password !== 'BBgg0218') {
//     return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
//   }
  
//   try {
//     ensureDirectoryExists();
    
//     if (!fs.existsSync(CSV_FILE_PATH)) {
//       return NextResponse.json({ leads: [] });
//     }
    
//     const csvData = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
//     const rows = csvData.split('\n');
//     const headers = rows[0].split(',');
    
//     const leads = rows.slice(1)
//       .filter(row => row.trim() !== '')
//       .map(row => {
//         const values = row.split(',');
//         const lead: Record<string, string> = {};
        
//         headers.forEach((header, index) => {
//           lead[header] = values[index] || '';
//         });
        
//         return lead;
//       });
    
//     return NextResponse.json({ leads });
//   } catch (error) {
//     console.error('Erro ao ler leads:', error);
//     return NextResponse.json({ error: 'Erro ao ler leads' }, { status: 500 });
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     ensureDirectoryExists();
    
//     const lead = await request.json();
    
//     if (!lead.name || !lead.email || !lead.cnpj || !lead.volume) {
//       return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
//     }
    
//     // Adicionar ID e data se não existirem
//     lead.id = lead.id || Date.now().toString();
//     lead.createdAt = lead.createdAt || new Date().toISOString();
    
//     // Formatar linha CSV
//     const csvLine = `${lead.id},${lead.name},${lead.email},${lead.cnpj},${lead.volume},${lead.createdAt}\n`;
    
//     // Adicionar ao arquivo
//     fs.appendFileSync(CSV_FILE_PATH, csvLine);
    
//     return NextResponse.json({ success: true, lead });
//   } catch (error) {
//     console.error('Erro ao salvar lead:', error);
//     return NextResponse.json({ error: 'Erro ao salvar lead' }, { status: 500 });
//   }
// }

// export async function DELETE(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const password = searchParams.get('pswd');
//   const id = searchParams.get('id');
  
//   // Verificar senha
//   if (password !== 'BBgg0218') {
//     return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
//   }
  
//   if (!id) {
//     return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
//   }
  
//   try {
//     ensureDirectoryExists();
    
//     if (!fs.existsSync(CSV_FILE_PATH)) {
//       return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 });
//     }
    
//     const csvData = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
//     const rows = csvData.split('\n');
//     const headers = rows[0];
    
//     // Filtrar a linha com o ID correspondente
//     const filteredRows = rows.filter(row => {
//       if (!row.trim()) return false;
//       const values = row.split(',');
//       return values[0] !== id;
//     });
    
//     // Reescrever o arquivo
//     fs.writeFileSync(CSV_FILE_PATH, filteredRows.join('\n'));
    
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Erro ao excluir lead:', error);
//     return NextResponse.json({ error: 'Erro ao excluir lead' }, { status: 500 });
//   }
// }
