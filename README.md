# EuropAssist - Rastreamento de Motorista

Aplicação React mobile-first para rastreamento de motorista em tempo real, similar a Uber/99. Otimizada para visualização em dispositivos móveis (iOS/Android browsers).

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **Vite** - Build tool e dev server
- **React Router** - Roteamento de páginas
- **React Leaflet** - Integração React com Leaflet
- **Leaflet** - Biblioteca de mapas open-source
- **OpenStreetMap** - Tiles de mapa gratuitos
- **OSRM** - Serviço de roteamento (demo, gratuito para testes)

## 📱 Características Mobile-First

- Layout responsivo otimizado para mobile
- Viewport configurado para experiência app-like
- Header e footer fixos com conteúdo legível
- Mapa ocupando espaço restante da tela
- Touch-friendly com ícones maiores
- Scroll desabilitado no mapa para evitar zoom acidental

## 🛠️ Instalação

```bash
# Instalar dependências
npm install
```

## 🏃 Execução

```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📦 Deploy no Netlify

1. Conecte seu repositório ao Netlify
2. Configure as seguintes opções:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Deploy automático a cada push

## 🗺️ Funcionalidades

- **Mapa interativo**: Visualização usando OpenStreetMap (100% gratuito)
- **Rota em tempo real**: Calculada via OSRM demo service (HTTPS)
- **Animação em tempo real**: Movimento suave pela rota em ~45 segundos
- **Interface mobile-friendly**: Header e footer fixos, layout otimizado
- **Rotas disponíveis**:
  - `/` - Rastreamento de motorista (João)
  - `/guincho` - Rastreamento de guincho parceiro

## 📍 Coordenadas

- **Origem (João)**: São Paulo [-23.5505, -46.6333]
- **Destino (Passageiro)**: São Paulo [-23.5612, -46.6560]

## ⚠️ Observações

- **OSRM Demo**: O serviço OSRM usado é uma demo pública e pode ter rate limits. Para produção, considere usar uma instância própria ou serviço pago.
- **Mobile Optimizations**: 
  - Viewport meta tag configurado para evitar zoom acidental
  - `invalidateSize()` chamado após render para garantir tamanho correto do mapa
  - `user-scalable=no` para experiência app-like
- **Teste em mobile**: Use DevTools do Chrome/Firefox com emulação mobile ou teste diretamente no dispositivo

## 🎨 Estrutura do Projeto

```
EuropAssist/
├── index.html          # HTML base com viewport meta
├── vite.config.js      # Configuração do Vite
├── netlify.toml        # Configuração Netlify (SPA routing)
├── package.json        # Dependências
├── src/
│   ├── main.jsx        # Entry point
│   ├── App.jsx         # Router principal (React Router)
│   ├── index.css       # Estilos mobile-first
│   ├── pages/
│   │   ├── MotoristaPage.jsx    # Página do motorista (/)
│   │   └── GuinchoPage.jsx      # Página do guincho (/guincho)
│   └── components/
│       ├── MapaRastreamento.jsx    # Mapa para motorista
│       └── GuinchoRastreamento.jsx # Mapa para guincho
└── README.md
```

## 📝 Licença

Este projeto é um mock/demonstração para fins educacionais.

