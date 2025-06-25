# 🚀 COMO CONECTAR O GRETA A UMA NOVA CONTA NETLIFY

## 📋 PRÉ-REQUISITOS

1. **Conta no GitHub/GitLab** com o código do projeto
2. **Nova conta no Netlify** (ou limpar a atual)
3. **Código atualizado** no repositório

---

## 🔧 PASSO 1: PREPARAR O PROJETO

### 1.1 Verificar se está tudo funcionando localmente:
```bash
# Testar o projeto
npm run dev

# Fazer build para testar
npm run build
```

### 1.2 Verificar arquivos de configuração:
- ✅ `netlify.toml` existe
- ✅ `package.json` tem scripts corretos
- ✅ `dist/` é criada após build

---

## 🌐 PASSO 2: CONFIGURAR NETLIFY

### 2.1 Criar/Acessar conta Netlify:
1. Acesse: https://www.netlify.com
2. Clique em **"Sign up"** (nova conta) ou **"Log in"**
3. Use GitHub/GitLab para fazer login

### 2.2 Conectar repositório:
1. No dashboard, clique **"Add new site"**
2. Selecione **"Import an existing project"**
3. Escolha **GitHub** ou **GitLab**
4. **Autorize** o Netlify a acessar seus repositórios
5. Selecione o **repositório** com o código do Greta

---

## ⚙️ PASSO 3: CONFIGURAÇÕES DE BUILD

### 3.1 Configurações automáticas:
O Netlify deve detectar automaticamente:
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18

### 3.2 Se não detectar, configure manualmente:
```
Build command: npm run build
Publish directory: dist
Node version: 18
```

### 3.3 Configurações avançadas (se necessário):
```
Base directory: (deixar vazio)
Functions directory: (deixar vazio)
Environment variables: (nenhuma necessária)
```

---

## 🎯 PASSO 4: DEPLOY E TESTE

### 4.1 Fazer primeiro deploy:
1. Clique **"Deploy site"**
2. Aguarde o build completar
3. Verifique se não há erros

### 4.2 Testar o site:
1. Acesse a URL gerada (ex: `random-name-123.netlify.app`)
2. Verifique se aparece **"Sistema de Estágios"**
3. Teste login: `contato@posfaunaemfoco.com` / `Faunalivre2020$$`

---

## 🔄 PASSO 5: CONFIGURAR DOMÍNIO (OPCIONAL)

### 5.1 Mudar nome do site:
1. Site settings → General → Site details
2. **Change site name**
3. Escolha um nome único (ex: `sistema-estagios-2024`)

### 5.2 Domínio personalizado (se tiver):
1. Site settings → Domain management
2. **Add custom domain**
3. Configure DNS conforme instruções

---

## 🚨 SOLUÇÃO DE PROBLEMAS

### Erro: "Build failed"
```bash
# Verificar localmente
npm install
npm run build

# Se funcionar local, verificar:
# - Node version no Netlify (deve ser 18)
# - Build command correto
# - Publish directory correto
```

### Erro: "Page not found"
- Verificar se `netlify.toml` existe
- Verificar redirects para SPA

### Erro: Site mostra versão antiga
- Fazer deploy manual da pasta `dist`
- Limpar cache do navegador
- Verificar se branch está correto

---

## 📱 DEPLOY MANUAL (ALTERNATIVA RÁPIDA)

Se tiver problemas com Git, use deploy manual:

1. **Build local:**
   ```bash
   npm run build
   ```

2. **No Netlify:**
   - Vá em **"Deploys"**
   - Clique **"Deploy manually"**
   - Arraste pasta `dist` para upload

---

## ✅ CHECKLIST FINAL

- [ ] Projeto funciona localmente (`npm run dev`)
- [ ] Build funciona localmente (`npm run build`)
- [ ] Conta Netlify criada/acessada
- [ ] Repositório conectado
- [ ] Build settings configurados
- [ ] Deploy realizado com sucesso
- [ ] Site testado e funcionando
- [ ] Login admin funcionando
- [ ] Título correto: "Sistema de Estágios"

---

## 🆘 SE NADA FUNCIONAR

### Opção 1: Deploy manual
- Sempre funciona
- Upload direto da pasta `dist`

### Opção 2: Novo repositório
- Criar novo repositório no GitHub
- Fazer push do código atual
- Conectar ao Netlify

### Opção 3: Outros serviços
- Vercel: https://vercel.com
- GitHub Pages
- Firebase Hosting