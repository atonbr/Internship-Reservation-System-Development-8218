# 🔄 REDIRECIONAMENTO DO SITE ANTIGO PARA O NOVO

## 🎯 SITUAÇÃO ATUAL:
- ✅ **Site novo (correto):** https://praticafaunaemfoco.netlify.app/
- ❌ **Site antigo (incorreto):** https://effervescent-hamster-624d2a.netlify.app

## 🚀 OPÇÃO 1: REDIRECIONAMENTO AUTOMÁTICO (RECOMENDADO)

### Passo 1: Acessar o Site Antigo
1. Vá para: https://app.netlify.com
2. Faça login na sua conta
3. Encontre o site **"effervescent-hamster-624d2a"**
4. Clique nele para acessar

### Passo 2: Configurar Redirecionamento
1. Vá em **"Site settings"**
2. Clique em **"Build & deploy"**
3. Role até **"Post processing"**
4. Clique em **"Redirects and rewrites"**
5. Clique **"Add redirect rule"**

### Passo 3: Criar Regra de Redirecionamento
```
From: /*
To: https://praticafaunaemfoco.netlify.app/:splat
Status: 301 (Permanent redirect)
Force: Yes
```

### Passo 4: Salvar
1. Clique **"Save"**
2. Aguarde alguns minutos para propagar

---

## 🎯 OPÇÃO 2: SUBSTITUIR CONTEÚDO DO SITE ANTIGO

### Método A: Deploy Manual no Site Antigo
1. Acesse o site antigo no Netlify
2. Vá em **"Deploys"**
3. Clique **"Deploy manually"**
4. Faça build local: `npm run build`
5. Arraste a pasta `dist` atualizada

### Método B: Reconectar Repositório
1. No site antigo, vá em **"Site settings"**
2. **"Build & deploy"** → **"Link to a different repository"**
3. Conecte ao repositório correto
4. Configure build: `npm run build`, publish: `dist`

---

## 🎯 OPÇÃO 3: DELETAR SITE ANTIGO (MAIS SIMPLES)

### ⚠️ **CUIDADO:** Isso vai quebrar links existentes

1. Acesse o site antigo no Netlify
2. **"Site settings"** → **"General"**
3. Role até **"Danger zone"**
4. Clique **"Delete site"**
5. Confirme a exclusão

---

## 🎯 OPÇÃO 4: PÁGINA DE REDIRECIONAMENTO SIMPLES

Criar uma página HTML simples no site antigo:

### Passo 1: Criar arquivo de redirecionamento
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Redirecionando...</title>
    <meta http-equiv="refresh" content="0;url=https://praticafaunaemfoco.netlify.app">
    <script>
        window.location.href = "https://praticafaunaemfoco.netlify.app";
    </script>
</head>
<body>
    <div style="text-align: center; margin-top: 50px; font-family: Arial;">
        <h2>🔄 Redirecionando...</h2>
        <p>Você será redirecionado automaticamente para:</p>
        <a href="https://praticafaunaemfoco.netlify.app" style="color: #2563eb; font-size: 18px;">
            https://praticafaunaemfoco.netlify.app
        </a>
        <p><small>Se não for redirecionado automaticamente, clique no link acima.</small></p>
    </div>
</body>
</html>
```

### Passo 2: Deploy manual
1. Salve o código acima como `index.html`
2. No site antigo, faça deploy manual deste arquivo

---

## 🏆 **RECOMENDAÇÃO:**

**Use a OPÇÃO 1 (Redirecionamento automático)** porque:
- ✅ Mantém SEO e links existentes
- ✅ Redirecionamento automático e transparente
- ✅ Não quebra bookmarks ou links compartilhados
- ✅ Profissional e limpo

---

## 📋 **CHECKLIST APÓS CONFIGURAR:**

- [ ] Teste o link antigo: https://effervescent-hamster-624d2a.netlify.app
- [ ] Verifique se redireciona para: https://praticafaunaemfoco.netlify.app
- [ ] Teste login no site novo: `contato@posfaunaemfoco.com` / `Faunalivre2020$$`
- [ ] Verifique se todas as páginas funcionam
- [ ] Atualize bookmarks pessoais

---

## 🆘 **SE TIVER DIFICULDADE:**

1. **Não consegue acessar site antigo?**
   - Verifique se está logado na conta correta
   - Procure por "effervescent-hamster" na lista de sites

2. **Opção de redirecionamento não aparece?**
   - Use a OPÇÃO 4 (página HTML simples)
   - Sempre funciona

3. **Quer algo mais rápido?**
   - Use OPÇÃO 3 (deletar site antigo)
   - Mas vai quebrar links existentes

**Qual opção você quer tentar primeiro?**