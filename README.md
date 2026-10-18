# Xabi Fest 2026 🎂

Um mini cartão de aniversário interativo: a festa vai sendo montada com as coisas favoritas da Xabi e termina com uma mensagem surpresa. Projeto mobile-first, sem backend nem navegação.

## Stack

- Vite + React + TypeScript
- GSAP (uma timeline para coordenar a animação)
- SCSS
- SVGs autorais, leves e com fundo transparente em `public/assets/`

## Rodar no computador

Requer Node.js 20.19+ ou 22.12+.

```bash
npm install
npm run dev
```

Abra o endereço informado pelo Vite (normalmente `http://localhost:5173`).

Antes de publicar, teste a versão de produção:

```bash
npm run build
npm run preview
```

## Alterar a mensagem e os elementos

O arquivo **`src/constants/party.ts`** centraliza os textos, as referências da festa e o caminho de cada SVG. Basta alterar `PARTY_CONTENT.finale` para personalizar o recado, inclusive a assinatura `com carinho, Xu`.

As posições dos adesivos são definidas em `src/components/PartyItem/styles.scss`. As etapas e os tempos da animação estão em `src/components/PartyScene/index.tsx`.

Para trocar uma ilustração, substitua o SVG correspondente na pasta `public/assets/` mantendo o nome, ou atualize o caminho na lista `PARTY_ITEMS`.

> O carrinho 95, a bandeirinha SPFC e a referência à Taylor Swift são **ilustrações estilizadas de fã**, não imagens oficiais. Nenhuma imagem remota é exigida para que a festa funcione.

## Publicar via GitHub e Vercel

1. No GitHub, crie um repositório vazio, por exemplo `xabi-fest`.
2. Na pasta do projeto, rode:

   ```bash
   git init
   git add .
   git commit -m "feat: birthday party for Xabi"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/xabi-fest.git
   git push -u origin main
   ```

3. Na [Vercel](https://vercel.com/new), importe o repositório do GitHub.
4. Confirme as configurações automáticas (Framework Preset: **Vite**, Build Command: `npm run build`, Output Directory: `dist`).
5. Clique em **Deploy**. A Vercel fornecerá o link para enviar no aniversário.

## Checklist rápido antes de compartilhar

- [ ] Conferir a mensagem e a assinatura no `party.ts`.
- [ ] Abrir no celular e verificar se o botão inicial aparece inteiro.
- [ ] Conferir a entrada do carro, confetes e o botão "rever a festinha".
- [ ] Testar com o som desligado (o projeto é intencionalmente silencioso).
- [ ] Confirmar que o link público da Vercel está funcionando.

## Acessibilidade e comportamento

- A experiência começa após clicar no botão; não existe autoplay inicial.
- Se o dispositivo usar **reduzir movimento**, a festa aparece sem a sequência de deslocamentos.
- A página não exige cookies, login, coleta de dados ou APIs externas.
