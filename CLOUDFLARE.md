# Configuração para Cloudflare Workers

Este projeto está configurado para deploy no Cloudflare Pages com Workers.

## Pré-requisitos

1. Conta no Cloudflare
2. Wrangler CLI instalado: `npm install -g wrangler`

## Configuração do KV Namespace

1. Crie um KV namespace:
\`\`\`bash
wrangler kv:namespace create "WAITLIST_KV"
\`\`\`

2. Copie o ID gerado e atualize no arquivo `wrangler.toml`:
\`\`\`toml
[[kv_namespaces]]
binding = "WAITLIST_KV"
id = "seu-id-aqui"
\`\`\`

## Deploy

### Via Cloudflare Pages (Recomendado)

1. Conecte seu repositório ao Cloudflare Pages
2. Configure as variáveis de ambiente no dashboard
3. O deploy será automático a cada push

### Via Wrangler CLI

\`\`\`bash
npm run build
wrangler pages deploy
\`\`\`

## Variáveis de Ambiente

Configure no dashboard do Cloudflare Pages:
- `WAITLIST_KV`: Binding automático do KV namespace

## Testando Localmente

\`\`\`bash
npm run dev
\`\`\`

O projeto funcionará localmente sem o KV (modo fallback), mas para testar com KV:

\`\`\`bash
wrangler pages dev .vercel/output/static --kv WAITLIST_KV
\`\`\`

## Notas

- O projeto usa Edge Runtime para compatibilidade total com Cloudflare Workers
- Os dados são persistidos no Cloudflare KV
- Não há dependências de Node.js runtime
