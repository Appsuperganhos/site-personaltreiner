# APEX Training — Elite Personal Trainer Website

Site premium com animações 3D, scroll cinematográfico e WebGL.

## Stack
- **Three.js r128** — cena 3D com figura atlética, partículas e linhas de energia
- **GSAP 3.12.5** — ScrollTrigger, animações de scroll cinematic
- **HTML5 / CSS3 / Vanilla JS** — zero dependências de build

## Estrutura
```
apex-training/
├── index.html          ← página principal
├── css/
│   └── styles.css      ← estilos separados
├── js/
│   ├── hero3d.js       ← cena Three.js do hero
│   └── main.js         ← GSAP, ScrollTrigger, lógica de scroll
├── images/
│   ├── hero/           ← imagem de fundo do hero (substitua aqui)
│   ├── services/       ← fotos dos serviços (6 imagens)
│   ├── programs/       ← fotos dos cards horizontais (5 imagens)
│   ├── testimonials/   ← fotos dos depoimentos (4 imagens)
│   └── icons/          ← favicon, og:image
└── README.md
```

## Como usar as imagens

### Hero
- `images/hero/hero-bg.jpg` — 1920×1080px mínimo, atleta em ação (gerada com Midjourney/Flow Labs)

### Serviços (6 cards)
- `images/services/treino-personalizado.jpg`
- `images/services/nutricao.jpg`
- `images/services/mentoria.jpg`
- `images/services/high-performance.jpg`
- `images/services/recomposicao.jpg`
- `images/services/online.jpg`

### Programas (5 cards horizontais)
- `images/programs/forca.jpg`
- `images/programs/hiit.jpg`
- `images/programs/estetica.jpg`
- `images/programs/mobilidade.jpg`
- `images/programs/emagrecimento.jpg`

### Depoimentos (4 avatares)
- `images/testimonials/marcos.jpg`
- `images/testimonials/carolina.jpg`
- `images/testimonials/andre.jpg`
- `images/testimonials/patricia.jpg`

## Prompts sugeridos para gerar as imagens

### Midjourney / Ideogram / Flow Labs:
**Hero:** `cinematic ultra-HD photo of a muscular athletic male personal trainer in a dark premium gym, dramatic red lighting, high contrast, black background, dynamic pose, hyper realistic --ar 16:9 --style raw`

**Serviços:** `professional personal training session in dark luxury gym, red accent lighting, high contrast, athlete performing [exercício], photography --ar 4:3`

**Programas:** `dark cinematic gym photography, [modalidade de treino], dramatic lighting, moody atmosphere, athletic person in motion --ar 4:5`

## Deploy na Vercel

1. Faça fork ou upload para o GitHub
2. Acesse [vercel.com](https://vercel.com) → New Project
3. Importe o repositório
4. Framework: **Other** (HTML estático)
5. Output Directory: `/` (raiz)
6. Clique em Deploy

Não precisa de build — é HTML puro.

## Personalizar

| O que mudar | Onde |
|---|---|
| Nome do personal trainer | `index.html` → hero título + nav logo |
| Cores | `css/styles.css` → variáveis `:root` |
| Textos e serviços | `index.html` → cada seção |
| Imagens | Pasta `images/` |
| Email de contato | `index.html` → footer |
| WhatsApp | `index.html` → botão CTA |
