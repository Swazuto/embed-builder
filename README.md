# Discord Embed Creator

Um criador de embeds Discord moderno e completo, construído com Next.js 16, TypeScript e Ant Design. Crie, personalize e envie embeds ricos para o Discord com visualização em tempo real e suporte completo a markdown.

## ✨ Funcionalidades

### 🎨 Editor Completo de Embeds
- **Informações Básicas**: Título, descrição, URL e cor personalizável
- **Autor**: Nome, URL e ícone com hover underline
- **Campos**: Até 25 campos com opção inline
- **Imagens**: Thumbnail e imagem principal
- **Rodapé**: Texto, ícone e timestamp automático
- **Mensagem**: Conteúdo fora do embed com suporte a markdown

### 📝 Suporte Completo a Markdown Discord
- **Formatação de Texto**: Negrito, itálico, sublinhado, tachado
- **Cabeçalhos**: `#`, `##`, `###`
- **Listas**: Com suporte a sublistas aninhadas
- **Blocos de Código**: Com syntax highlighting (JS, Python, Rust)
- **Código Inline**: `` `código` ``
- **Citações**: Single-line (`>`) e multi-line (`>>>`)
- **Links**: `[texto](url)` e auto-detecção de URLs
- **Spoilers**: `||spoiler||`
- **Subtext**: `-# texto pequeno`
- **Menções**: User, channel, role e timestamp

### 🎯 Sistema de Templates
- **Salvar Templates**: Guarde seus embeds favoritos localmente
- **Carregar Templates**: Acesse rapidamente configurações salvas
- **Importar/Exportar JSON**: Compartilhe embeds em formato JSON
- **Descrições**: Adicione notas aos templates salvos

### 🚀 Webhook Integration
- **Envio Direto**: Envie embeds para webhooks Discord
- **Customização do Bot**: Nome e avatar personalizados
- **Copy JSON**: Copie o payload completo para uso em bots

### 🌍 Suporte Multilíngue
- 🇧🇷 Português (Brasil)
- 🇺🇸 English (US)
- 🇷🇺 Русский (Russian)
- 🇯🇵 日本語 (Japanese)
- 🇨🇳 中文 (Chinese)

### 🎨 Interface Moderna
- **Preview em Tempo Real**: Veja exatamente como ficará no Discord
- **Dark Theme**: Interface inspirada no Discord
- **Responsivo**: Funciona em desktop e mobile
- **Validação**: Limites e validações seguindo as regras do Discord

## 🚀 Como Começar

### Pré-requisitos

- Node.js 18+ instalado
- npm, yarn, pnpm ou bun

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Swazuto/embed-builder.git
cd embed-builder
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

### Build para Produção

```bash
npm run build
npm run start
```

## 🛠️ Tecnologias Utilizadas

- **[Next.js 16](https://nextjs.org)** - Framework React com App Router
- **[TypeScript](https://www.typescriptlang.org)** - Tipagem estática
- **[Ant Design](https://ant.design)** - Biblioteca de componentes UI
- **[Zustand](https://zustand-demo.pmnd.rs)** - Gerenciamento de estado
- **[Tailwind CSS](https://tailwindcss.com)** - Estilização utilitária

## 📁 Estrutura do Projeto

```
discord-embed-creator-v2/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Página principal
│   ├── layout.tsx         # Layout raiz
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── Common/           # Componentes reutilizáveis
│   ├── Editor/           # Seções do editor
│   └── Preview/          # Preview do Discord
├── lib/                  # Lógica de negócio
│   ├── hooks/           # Custom hooks
│   ├── i18n/            # Traduções
│   ├── markdown/        # Parser de markdown
│   ├── types/           # Definições TypeScript
│   └── utils/           # Funções utilitárias
└── public/              # Arquivos estáticos
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para abrir issues ou pull requests.

## 📄 Licença

Este projeto está sob a licença MIT.

## 🔗 Links Úteis

- [Documentação Discord Webhooks](https://discord.com/developers/docs/resources/webhook)
- [Discord Markdown Guide](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline-)
- [Next.js Documentation](https://nextjs.org/docs)
