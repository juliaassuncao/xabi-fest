# Xabi Fest 2026 🎂

Um mini cartão de aniversário interativo: a festa vai sendo montada com as coisas favoritas da Xabi e termina com uma mensagem surpresa. Projeto mobile-first, sem backend nem navegação.

## Stack

- Vite + React + TypeScript
- GSAP (uma timeline para coordenar a animação)
- SCSS
- Assets PNG e WebP em `public/assets/final/`

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

O arquivo **`src/constants/party.ts`** centraliza a mensagem, a tag, os status da animação e os caminhos dos assets ativos. Altere `PARTY_CONTENT.finale` para personalizar o recado e a assinatura.

Os tamanhos, posições, rotações e camadas dos adesivos ficam em `src/components/PartyItem/styles.scss`: as regras iniciais definem o desktop e a media query `max-width: 959px` define o mobile. As etapas e os tempos da animação ficam em `src/components/PartyScene/index.tsx`.

Para trocar uma imagem, coloque o arquivo em `public/assets/final/` e atualize seu caminho na lista `PARTY_ITEMS`. O banner e as imagens decorativas ficam em `PARTY_DECOR`.

O banner e o fundo são posicionados em `src/components/PartyScene/styles.scss`. A tag e o cartão de mensagem são estilizados em `src/components/BirthdayMessage/styles.scss`; no mobile, a tag usa margens automáticas para se centralizar sem transformações próprias.

`src/hooks/useCardFit.ts` ajusta o cartão à viewport: escala o conjunto no desktop e distribui o espaço restante entre os assets no mobile, preservando o tamanho do texto. Os recortes e animações ficam contidos no cenário. As imagens são locais; as fontes são carregadas pelo Google Fonts.

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
- [ ] Testar a música, o botão de mute e o replay com som ativo e silenciado.
- [ ] Confirmar que o link público da Vercel está funcionando.

## Acessibilidade e comportamento

- A experiência começa após clicar no botão; não existe autoplay inicial.
- A trilha local `public/assets/audio/celebration.mp3` começa no clique de preparar a festa e toca em loop. O botão de volume aparece após esse clique e alterna `audio.muted`, mantendo a música avançando. O replay sempre volta ao início da música e preserva a preferência de mute.
- `src/hooks/usePartyAudio.ts` mantém um único elemento de áudio durante todas as fases. A chamada a `play()` ocorre diretamente no clique, sem aguardar `canplaythrough`; eventos de mídia sincronizam o botão e falhas permitem uma nova tentativa manual. O volume inicial é 50% quando o navegador permite; no iPhone vale o controle do dispositivo.
- Se o dispositivo usar **reduzir movimento**, a festa aparece sem a sequência de deslocamentos.
- A página não exige cookies, login, coleta de dados ou APIs externas.
