import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Iniciando Backend do Sistema de Estágios...\n');

// Verificar se o diretório server existe
const serverDir = join(__dirname, 'server');
if (!fs.existsSync(serverDir)) {
  console.error('❌ Diretório "server" não encontrado!');
  console.log('📁 Criando estrutura do servidor...');
  process.exit(1);
}

// Verificar se package.json existe no server
const serverPackageJson = join(serverDir, 'package.json');
if (!fs.existsSync(serverPackageJson)) {
  console.log('📦 Instalando dependências do servidor...');
  
  // Criar package.json no servidor se não existir
  const packageContent = {
    "name": "internship-backend",
    "version": "1.0.0",
    "type": "module",
    "main": "index.js",
    "scripts": {
      "start": "node index.js",
      "dev": "nodemon index.js"
    },
    "dependencies": {
      "express": "^4.18.2",
      "cors": "^2.8.5",
      "helmet": "^7.1.0",
      "bcryptjs": "^2.4.3",
      "jsonwebtoken": "^9.0.2",
      "sqlite3": "^5.1.6",
      "socket.io": "^4.7.4",
      "multer": "^1.4.5-lts.1",
      "csv-parser": "^3.0.0",
      "json2csv": "^5.0.7",
      "nodemailer": "^6.9.7",
      "dotenv": "^16.3.1",
      "uuid": "^9.0.1"
    }
  };
  
  fs.writeFileSync(serverPackageJson, JSON.stringify(packageContent, null, 2));
}

// Instalar dependências do servidor
console.log('📦 Verificando dependências do servidor...');
const npmInstall = spawn('npm', ['install'], { 
  cwd: serverDir, 
  stdio: 'inherit',
  shell: true 
});

npmInstall.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Falha na instalação das dependências (código ${code})`);
    process.exit(1);
  }
  
  console.log('✅ Dependências instaladas com sucesso!');
  console.log('🚀 Iniciando servidor...\n');
  
  // Iniciar o servidor
  const serverProcess = spawn('node', ['index.js'], { 
    cwd: serverDir, 
    stdio: 'inherit',
    shell: true 
  });
  
  serverProcess.on('close', (serverCode) => {
    console.log(`🛑 Servidor encerrado com código ${serverCode}`);
  });
  
  serverProcess.on('error', (error) => {
    console.error('❌ Erro ao iniciar servidor:', error);
  });
});

npmInstall.on('error', (error) => {
  console.error('❌ Erro ao instalar dependências:', error);
  process.exit(1);
});