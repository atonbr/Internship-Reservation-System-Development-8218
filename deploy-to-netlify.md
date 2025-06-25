# 🚀 DEPLOY RÁPIDO NO NETLIFY

## 🎯 OPÇÃO 1: DEPLOY AUTOMÁTICO (RECOMENDADO)

### Passo 1: Acesse o Netlify
1. Vá para: https://www.netlify.com
2. Clique em **"Sign up"** ou **"Log in"**
3. Use sua conta do **GitHub** para fazer login

### Passo 2: Conectar Repositório
1. No dashboard, clique **"Add new site"**
2. Escolha **"Import an existing project"**
3. Selecione **"Deploy with GitHub"**
4. **Autorize** o Netlify (se solicitado)
5. Encontre e selecione seu **repositório** com o código do Greta

### Passo 3: Configurar Build
1. **Build command:** `npm run build`
2. **Publish directory:** `dist`
3. **Node version:** `18` (se necessário)
4. Clique **"Deploy site"**

---

## 🎯 OPÇÃO 2: DEPLOY MANUAL (MAIS RÁPIDO)

### Passo 1: Preparar Build
```bash
# Fazer build do projeto
npm run build
```

### Passo 2: Upload Manual
1. Acesse: https://app.netlify.com
2. Faça login
3. Clique **"Add new site"** → **"Deploy manually"**
4. **Arraste a pasta `dist`** para a área de upload
5. Aguarde o upload completar

---

## ✅ VERIFICAÇÃO FINAL

Após o deploy, teste:
- ✅ Site carrega corretamente
- ✅ Título mostra "Sistema de Estágios"
- ✅ Login funciona: `contato@posfaunaemfoco.com` / `Faunalivre2020$$`
- ✅ Design está correto (azul, moderno)

---

## 🔧 SE DER PROBLEMA

### Build falhou:
```bash
# Teste local primeiro
npm install
npm run build

# Se funcionar, problema é no Netlify
# Verificar configurações de build
```

### Site não carrega:
- Verificar se `dist` foi publicado
- Verificar redirects no `netlify.toml`

### Versão errada:
- Fazer deploy manual da pasta `dist`
- Verificar se repositório está atualizado