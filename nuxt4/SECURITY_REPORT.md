# Juspericia Nuxt4 — Relatório de Segurança

Data: 2025-12-08

Este relatório apresenta uma análise de segurança da aplicação Nuxt (SPA) localizada em `nuxt4/`. A revisão foca em exposição de segredos, gerenciamento de sessão, risco de XSS, cabeçalhos/headers, e práticas gerais de hardening.

## Sumário Executivo

- Severidade Alta: XSS via `v-html` sem sanitização; tokens JWT armazenados em `localStorage`; segredos expostos em `runtimeConfig.public`.
- Severidade Média: Ausência de cabeçalhos de segurança (CSP, HSTS, X-Frame-Options, etc.); exibição de PII sem mascaramento consistente.
- Severidade Baixa: Melhorias em tratamento de erros e resiliência de interceptors; ausência de SRI em recursos externos.

## Achados Detalhados

### 1) XSS via `v-html` sem sanitização (Alta)

- Evidência:

  - `app/components/Solicitation/SolicitationDetails.vue:136` renderiza conteúdo vindo do servidor com `v-html`.
  - `app/components/MedicalReport/MedicalReportDetails.vue:57` usa `v-html` para laudo médico.
  - `app/pages/terms/index.vue:9` usa `v-html` nos termos de serviço.
  - `app/pages/terms-first-login/index.vue:9`, `:15`, `:18` usam `v-html` para exibir termos.

- Risco: Qualquer conteúdo HTML malicioso entregue pelo backend ou persistido pode executar scripts no cliente, comprometendo tokens, dados do usuário e conta.

- Recomendações:
  - Sanitizar HTML no servidor antes de persistir/retornar.
  - Caso sanitização precise ocorrer no cliente, utilizar biblioteca de sanitização (ex.: `DOMPurify`) com uma política restritiva (permitir apenas tags inline seguras). Evitar permitir `script`, `style`, `on*` handlers, `iframe`, `form`, `svg` arriscado.
  - Substituir `v-html` por um componente `SafeHtml` que sanitiza antes de injetar.

### 2) Segredos expostos em `runtimeConfig.public` (Alta)

- Evidência:

  - `nuxt.config.ts:145-157` expõe variáveis em `runtimeConfig.public`, incluindo `zapsignApiToken` e `zegoCloudAppSecret`.

- Risco: Tudo em `public` fica acessível no cliente via `useRuntimeConfig()`. Tokens e segredos expostos podem permitir uso indevido de APIs de terceiros.

- Recomendações:
  - Mover segredos para `runtimeConfig` (privado) fora de `public` e acessá-los apenas em rotas/métodos no backend.
  - Para Zego Cloud, gerar tokens no servidor e fornecer apenas o `appId` público ao cliente (o fluxo já usa um `tokenKit` vindo da API em `app/pages/room/[roomId].vue:92-101`, manter esse padrão e remover o `secret` do cliente).
  - Para ZapSign, encapsular chamadas sensíveis em endpoints server-side.

### 3) Tokens em `localStorage` (Alta)

- Evidência:

  - `app/store/auth.ts:35-41` grava token e usuário em `localStorage`.
  - `app/composables/axiosApi.ts:16-26` lê token do `localStorage` e injeta `Authorization`.
  - `app/middleware/01.auth-token.global.ts:4-6` acessa `localStorage` para controle de sessão.

- Risco: Em caso de XSS, `localStorage` é exfiltrável. Isso permite roubo de sessão.

- Recomendações:
  - Migrar autenticação para cookies `HttpOnly`, `Secure`, `SameSite=Strict` setados pelo backend.
  - Remover leitura/escrita de token no cliente e usar sessão baseada em cookie.
  - Implementar proteção CSRF (ex.: `SameSite=Strict` + token CSRF em cabeçalho custom) nas rotas mutáveis.

### 4) Cabeçalhos de Segurança e CSP (Média)

- Evidência:

  - `nuxt.config.ts` não define `routeRules.headers` ou equivalente; como `ssr: false`, a entrega provavelmente depende do hosting/proxy.

- Recomendações:
  - Configurar no reverse proxy/hosting: `Content-Security-Policy` (bloquear inline scripts; whitelists estritas para `self` e domínios necessários, incluindo `https://challenges.cloudflare.com`, `https://fonts.googleapis.com`, `https://fonts.gstatic.com`), `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `Permissions-Policy`.
  - Evitar inline scripts/estilos; preferir arquivos estáticos versionados.

### 5) PII exposta sem mascaramento consistente (Média)

- Evidência:

  - Vários componentes exibem CPF/PII (ex.: `app/components/SelectsSearch/SelectSearchPatient.vue:27`).

- Recomendações:
  - Mascarar PII em listagens (ex.: mostrar apenas final do CPF/telefone) e exibir completo apenas em telas restritas.
  - Garantir que logs não armazenem PII sensível.

### 6) Recursos externos sem SRI (Baixa)

- Evidência:

  - `nuxt.config.ts:60-66` carrega script externo do Turnstile sem SRI.

- Recomendações:
  - Quando possível, usar `integrity` + `crossorigin` para recursos externos. Caso o provedor não suporte, confiar via CSP estrita.

### 7) Interceptors/Erros resilientes (Baixa)

- Evidência:

  - `app/composables/axiosApi.ts:40-80` e `:97-122` acessam `error.response` sem verificar sua existência (erros de rede não possuem `response`).

- Recomendações:
  - Proteger acesso com `if (error?.response)` e padronizar fluxo de logout apenas para `401/403` com `response` definido.

## Boas Práticas Observadas

- Uso de Turnstile (anti-bot) em termos de serviço.
- Separação por `store` e chamadas encapsuladas.
- Sem `eval`/`new Function` encontrados.
- Token de Zego gerado no servidor e consumido pelo cliente em `room/[roomId].vue`.

## Plano de Correção (Resumo)

1. Substituir `v-html` por `SafeHtml` com sanitização ou sanitizar no backend.
2. Migrar autenticação para cookies `HttpOnly` e remover token do `localStorage`.
3. Remover segredos de `runtimeConfig.public` e usar endpoints server-side.
4. Aplicar cabeçalhos de segurança via hosting/proxy; definir CSP estrita.
5. Mascarar PII em componentes de listagem.
6. Robustez nos interceptors de Axios.

## Prompt para Correção (copiar/colar)

Objetivo: Endurecer segurança da SPA Nuxt `nuxt4` corrigindo XSS, segredos expostos e sessão.

Contexto:

- Locais com `v-html`: `app/components/Solicitation/SolicitationDetails.vue:136`, `app/components/MedicalReport/MedicalReportDetails.vue:57`, `app/pages/terms/index.vue:9`, `app/pages/terms-first-login/index.vue:9|15|18`.
- Segredos expostos: `nuxt.config.ts:145-157` (`zapsignApiToken`, `zegoCloudAppSecret`).
- Tokens em `localStorage`: `app/store/auth.ts:35-41`; uso em `app/composables/axiosApi.ts:16-26`.

Instruções:

- Implementar um util de sanitização (`sanitizeHtml`) usando `DOMPurify` e substituir usos diretos de `v-html` por um componente `SafeHtml` que chama `sanitizeHtml`.
- Alterar autenticação: remover leitura/gravação de token em `localStorage`. Backend deve setar cookie `HttpOnly; Secure; SameSite=Strict`. No cliente, remover injeção de `Authorization` no interceptor e confiar no cookie.
- Em `nuxt.config.ts`, mover `zapsignApiToken` e `zegoCloudAppSecret` para `runtimeConfig` privado (fora de `public`). Consumir esses segredos apenas em chamadas server-side.
- Adicionar cabeçalhos de segurança no proxy/hosting (CSP, HSTS, XFO, XCTO, Referrer-Policy, Permissions-Policy). CSP deve permitir apenas domínios estritamente necessários (self, fonts.googleapis.com/fonts.gstatic.com, challenges.cloudflare.com) e bloquear inline scripts.
- Mascarar CPF/PII em listagens, mantendo exibição completa apenas em contextos restritos.
- Fortalecer interceptors: verificar `error?.response` antes de acessar `status` e padronizar handling.

Critérios de Aceitação:

- Nenhum segredo acessível via `useRuntimeConfig().public`.
- Nenhum token de sessão é gravado/lido de `localStorage`.
- Todos os pontos que antes usavam `v-html` passam por sanitização.
- CSP implantada (ou documentada para o ambiente de produção) sem quebra funcional.
- Testes manuais confirmam login, navegação e exibição de conteúdo sanitizado.

Notas:

- Como `ssr: false`, headers devem ser aplicados no serviço que serve os assets (CDN/proxy). Documentar a configuração.

## Referências

- OWASP Cheat Sheet: Cross Site Scripting Prevention
- OWASP Cheat Sheet: Session Management
- Nuxt Runtime Config docs
- DOMPurify docs
