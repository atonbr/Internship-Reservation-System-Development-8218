# 🚀 Como Exportar seu Projeto para o GitHub

Como este projeto está rodando em um ambiente seguro no navegador (WebContainer), você não pode enviar o código diretamente daqui para o GitHub. Siga os passos abaixo para fazer isso manualmente.

## 📦 Passo 1: Baixar o Código

1. **Baixe os arquivos do projeto** para o seu computador.
   - A maioria dos editores online possui uma opção **"Download Project"** ou **"Export to ZIP"** no menu de arquivos.
2. **Extraia o arquivo ZIP** (se baixou zipado) em uma pasta no seu computador.
3. **Abra o terminal** (Prompt de Comando ou PowerShell no Windows, Terminal no Mac/Linux) e navegue até essa pasta.

## 🐙 Passo 2: Criar Repositório no GitHub

1. Acesse [github.com/new](https://github.com/new).
2. **Repository name**: Digite um nome (ex: `sistema-estagios`).
3. **Visibility**: Escolha Public ou Private.
4. **NÃO** marque "Add a README file" ou outras opções de inicialização (pois você já tem o código).
5. Clique em **Create repository**.

## 💻 Passo 3: Enviar o Código (No seu computador)

No terminal, dentro da pasta do projeto que você baixou:

1. **Inicie o Git:**
   ```bash
   git init
   ```

2. **Adicione os arquivos:**
   ```bash
   git add .
   ```

3. **Faça o primeiro commit:**
   ```bash
   git commit -m "Primeiro commit: Sistema de Estágios Completo"
   ```

4. **Renomeie a branch principal (se necessário):**
   ```bash
   git branch -M main
   ```

5. **Conecte ao repositório do GitHub** (substitua a URL pela do seu repositório):
   ```bash
   git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPO.git
   ```

6. **Envie o código:**
   ```bash
   git push -u origin main
   ```

## ✅ Passo 4: Verificar

Atualize a página do seu repositório no GitHub. Você deverá ver todos os seus arquivos lá!

---

## 💡 Dicas Importantes

- **Node Modules**: O arquivo `.gitignore` incluído no projeto já está configurado para **não** enviar a pasta `node_modules` para o GitHub. Isso é correto. Quando alguém (ou o Netlify) baixar seu projeto, eles rodarão `npm install` para baixar as dependências.
- **Ambiente**: Lembre-se de configurar as variáveis de ambiente (`.env`) no painel do Netlify ou onde for hospedar, pois o arquivo `.env` geralmente não é enviado para o GitHub por segurança (embora neste template de exemplo ele possa ir se não estiver no gitignore, verifique o `.gitignore`).