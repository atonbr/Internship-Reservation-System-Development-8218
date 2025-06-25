# 🔄 INSTRUÇÕES PARA SINCRONIZAR NETLIFY

## 🚨 PROBLEMA IDENTIFICADO:
O Netlify está servindo uma versão antiga do sistema ("Sistema de Demonstração") 
que não corresponde ao código atual.

## ✅ SOLUÇÕES POSSÍVEIS:

### OPÇÃO 1: RECONECTAR REPOSITÓRIO (RECOMENDADO)

1. **Vá ao painel do Netlify:**
   - Acesse: https://app.netlify.com
   - Entre na sua conta

2. **Encontre o site:**
   - Procure por "effervescent-hamster-624d2a"
   - Clique no site

3. **Desconecte o repositório atual:**
   - Site settings > Build & deploy
   - Clique em "Link to a different repository"
   - Ou delete o site e crie um novo

4. **Reconecte com o repositório correto:**
   - Deploy > Connect to Git provider
   - Selecione GitHub/GitLab
   - Escolha o repositório correto com o código atual

### OPÇÃO 2: VERIFICAR BRANCH CORRETO

1. **No painel Netlify:**
   - Site settings > Build & deploy
   - Production branch: deve estar "main" ou "master"

2. **Verificar se está no branch certo:**
   - Deploy settings > Branch to deploy
   - Confirme que está apontando para o branch com código atual

### OPÇÃO 3: DEPLOY MANUAL

1. **Build local:**
   ```bash
   npm run build
   ```

2. **Deploy manual:**
   - No Netlify: Deploys > Deploy manually
   - Arraste a pasta "dist" para o campo de upload

### OPÇÃO 4: CRIAR NOVO SITE

1. **Delete o site atual:**
   - Site settings > General > Danger zone > Delete site

2. **Crie um novo site:**
   - Add new site > Import existing project
   - Conecte com o repositório atual

## 📋 CONFIGURAÇÕES CORRETAS PARA NETLIFY:

### Build settings:
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** `18`

### Environment variables (se necessário):
- Nenhuma variável é necessária para este projeto

## 🔍 COMO VERIFICAR SE ESTÁ CORRETO:

1. **Após novo deploy, verifique:**
   - Título deve ser "Sistema de Estágios" (não "Sistema de Demonstração")
   - Login deve aceitar: contato@posfaunaemfoco.com / Faunalivre2020$$
   - Design deve estar moderno com Tailwind CSS

2. **Teste de funcionamento:**
   - Login como admin deve funcionar
   - Navegação entre abas deve funcionar
   - Não deve aparecer "Sistema de Demonstração"