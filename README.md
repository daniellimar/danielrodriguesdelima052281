# Pet Manager - Frontend Challenge

### 📋 Sobre o Projeto

O **Pet Manager** é uma aplicação de alta performance desenvolvida em **Angular 18**, projetada para o gerenciamento
eficiente de pets e tutores. O projeto foca em uma experiência de usuário (UX) fluida, utilizando uma arquitetura
moderna, escalável e seguindo rigorosamente os princípios de **Clean Code** e **SOLID**.

---

### 👤 Informações do Candidato

- **Nome:** Daniel Rodrigues de Lima
- **Vaga:** Desenvolvedor Frontend (Angular)
- **Inscrição:** 16253
- **PROCESSO SELETIVO CONJUNTO Nº 001/2026/SEPLAG e demais Órgãos - Engenheiro da Computação - Sênior**
- **Local:**  SECRETARIA DE ESTADO DE PLANEJAMENTO E GESTÃO

---

### 🏗️ Arquitetura e Decisões Técnicas

A aplicação foi estruturada utilizando o padrão **Feature-based Folder Structure**, otimizando a manutenibilidade e o
isolamento de responsabilidades.

#### **Core & Design Patterns**

- **Facade Pattern**: Implementação de `AuthFacade` para centralizar a lógica de estado e autenticação, desacoplando os
  componentes dos serviços de infraestrutura.
- **Angular Signals**: Utilização de reatividade granular com Signals para garantir atualizações de DOM ultra-eficientes
  e reduzir o overhead de detecção de mudanças.
- **Standalone Components**: Arquitetura 100% baseada em componentes independentes, facilitando o *tree-shaking* e
  reduzindo o tamanho do bundle final.
- **OnPush Change Detection**: Estratégia adotada para otimizar a performance de renderização em listas complexas.

#### **UI/UX & Design System**

- **Tailwind CSS**: Design System baseado em utilitários para garantir consistência visual e responsividade.
- **Glassmorphism & Micro-interactions**: Interface moderna com efeitos de desfoque, gradientes suaves e feedbacks
  visuais (spinners, skeletons e animações de transição).
- **Dynamic View Engine**: Sistema que permite alternar entre modos de visualização (Grid, List, Compact) com
  persistência de estado via `LocalStorage`.

---

### 🚀 Como Executar o Projeto (Infraestrutura)

#### **1. Containerização (Docker + Nginx)**

O artefato foi empacotado em um container multi-stage para garantir o isolamento total das dependências de build.

```bash
# Build da imagem otimizada
docker build -t pet-manager-v3 .

# Execução do container (Porta 8080)
docker run -d -p 8080:80 --name pet-app pet-manager-v3
```

Acesse em: [http://localhost:8080](http://localhost:4200)

*O servidor Nginx está configurado para lidar com o roteamento de Single Page Application (SPA), redirecionando rotas
não encontradas para o index.html.*

#### **2. Desenvolvimento Local**

```bash
npm install
npm start
```

Acesse em: [http://localhost:4200](http://localhost:4200)

---

### 🧪 Qualidade e Testes

A estratégia de testes foca na confiabilidade da lógica de negócio e na integridade das rotas.

- **Testes Unitários**: Cobertura de componentes core e lógica de serviços.
- **Mocks Manuais**: Implementação de mocks leves para garantir que a suíte de testes seja rápida e independente de
  frameworks externos pesados.

```bash
npm test
```

---

### 🔒 Segurança e Resiliência

- **JWT Management**: Interceptor para inclusão automática de tokens e tratamento de expiração.
- **Auto-Refresh**: Lógica de renovação de sessão integrada ao fluxo de autenticação.
- **Route Guards**: Proteção de rotas sensíveis e redirecionamento inteligente.
- **Error Handling**: Normalização de erros de API para mensagens amigáveis em PT-BR.

---

### ✅ Requisitos Implementados

- [x] Autenticação JWT com persistência segura.
- [x] CRUD completo de Pets e Tutores com validações reativas.
- [x] Dockerização otimizada (Build context reduzido de 238MB para 1.9MB).
- [x] Interface 100% responsiva.
- [x] Persistência de preferências de visualização do usuário.

---

### 🛠️ Priorização (Visão de Engenharia)

Dada a restrição de tempo, a prioridade foi estabelecer uma **base sólida de infraestrutura (Docker/Nginx)** e uma **UX
impecável**.
**Próximos passos em um cenário real:**

- Implementação de Testes E2E com Playwright.
- Estratégia de Cache com Service Workers (PWA).
- Internacionalização (i18n) nativa do Angular.

---

### 🔑 Credenciais de Acesso

- **Usuário:** admin
- **Senha:** admin

---
**Daniel Rodrigues de Lima** - *Senior Frontend Engineer*