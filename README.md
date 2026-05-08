
<div align="center">

  <h1> CryptoMarket — Consumo da CoinGecko API</h1>
  <br/>
  <img width="180" height="180" alt="apple-touch-icon" src="https://github.com/user-attachments/assets/e1cda2c6-e564-4cfe-9b21-a2de7291c881" />
  <br/>

  

  <p>Projeto em <mark>React + Vite</mark> que consome a <mark>CoinGecko API</mark> para listar criptomoedas, exibir detalhes de uma moeda e um gráfico com dados históricos.
</p>
</div>


---

## 1) Escolha da API

**API escolhida:** CoinGecko API (Public/Demo)

**Motivo da escolha**
- É uma API pública focada em **dados de mercado de criptomoedas** (preços, market cap, rankings, histórico, etc.).
---

## Techs utilizadas

![My Skills](https://skillicons.dev/icons?i=react,vite,js,css,eslint&theme=dark)

---

## 2) Consumo da API (requisições reais)

Este projeto faz requisições reais via `fetch()` (frontend) para os endpoints da CoinGecko.

### Requisição GET (exemplo)

**Endpoint:** `GET /ping` (verifica status da API)

Exemplo com `curl` (com API key Demo via header):
```bash
curl -s "https://api.coingecko.com/api/v3/ping" \
  -H "accept: application/json" \
  -H "x-cg-demo-api-key: SUA_CHAVE"
```

### Requisição GET com parâmetros (exemplo)

**Endpoint:** `GET /coins/markets` (lista moedas com dados de mercado)

Parâmetros usados (exemplo):
- `vs_currency=usd`
- `order=market_cap_desc`
- `per_page=10`
- `page=1`

```bash
curl -s "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false" \
  -H "accept: application/json" \
  -H "x-cg-demo-api-key: SUA_CHAVE"
```

### Endpoints usados no app

- Lista (Home): `GET /coins/markets?vs_currency=<moeda>&order=market_cap_desc&per_page=50&page=1&sparkline=false`
  - Implementação: `api-test/src/context/CoinContext.jsx`
- Detalhes (Coin): `GET /coins/{id}`
  - Implementação: `api-test/src/pages/Coin/Coin.jsx`
- Histórico (Coin): `GET /coins/{id}/market_chart?vs_currency=<moeda>&days=10&interval=daily`
  - Implementação: `api-test/src/pages/Coin/Coin.jsx`

### Explicação rápida da implementação

- A Home consome a lista de moedas via `CoinContext` e renderiza uma tabela com os **Top 15** (com busca por nome).
- A tela de detalhes (`/coin/:coinId`) busca:
  - dados completos da moeda (`/coins/{id}`) para nome, imagem, rank e preços,
  - dados históricos (`/market_chart`) para alimentar o gráfico.
- A URL base e a API key são configuráveis por `.env.local`:
  - `VITE_COINGECKO_BASE_URL` (padrão `/coingecko/api/v3`, usando proxy do Vite)
  - `VITE_COINGECKO_API_KEY` (Demo ou Pro; o código escolhe o header automaticamente)

---

## 3) Análise da API (itens obrigatórios)

### Propósito da API
Fornecer **dados de mercado e metadados** de criptoativos (preço atual, variação, market cap, ranking, histórico, etc.) via endpoints REST.

### Base URL
- **Public/Demo:** `https://api.coingecko.com/api/v3/`
- **Pro (paga):** `https://pro-api.coingecko.com/api/v3/`

### Principais endpoints (para este projeto)
- `GET /ping`
- `GET /coins/markets`
- `GET /coins/{id}`
- `GET /coins/{id}/market_chart`

### Autenticação
Sim. A CoinGecko trabalha com **API Key** (varia por plano).

**Tipos**
- Demo (Public/Demo): API Key em `x-cg-demo-api-key` (header) ou `x_cg_demo_api_key` (query)
- Pro (pago): API Key em `x-cg-pro-api-key` (header) ou `x_cg_pro_api_key` (query)

**Onde é enviada**
- Preferencialmente no **header** (recomendado pela própria doc)
- Alternativamente em **query string**

> Neste projeto, a chave é opcional no código (para facilitar testes). Se você tiver uma chave, coloque em `.env.local` (ver seção “Como executar”).

### Versionamento
O versionamento é tratado no **path** via `/api/v3` (ex.: `https://api.coingecko.com/api/v3/...`).

### HATEOAS
Não é uma API HATEOAS: as respostas típicas são objetos/arrays JSON com dados (sem “links” de navegação/hipermídia no payload como parte do padrão de resposta).

### Tipo de resposta
Predominantemente **JSON** (`application/json`).

### Estrutura de um objeto retornado

Exemplo de campos retornados por `GET /coins/markets` (cada item do array):
```json
{
  "id": "bitcoin",
  "symbol": "btc",
  "name": "Bitcoin",
  "image": "https://...",
  "current_price": 12345.67,
  "market_cap": 123456789,
  "market_cap_rank": 1,
  "price_change_24h": -12.34
}
```

No app, esses campos são usados na tabela da Home (`current_price`, `market_cap`, `market_cap_rank`, `image`, `name`, `symbol`, etc.).

---

---
### Observação sobre CORS 
No modo dev, o projeto usa **proxy do Vite** para evitar problemas de CORS:
- Configuração: `api-test/vite.config.js`
- O app chama `/coingecko/api/v3/...`, e o Vite encaminha para `https://api.coingecko.com/api/v3/...`.
