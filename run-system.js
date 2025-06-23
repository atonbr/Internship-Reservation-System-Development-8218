import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🎯 Iniciando Sistema Completo de Estágios...\n');

// Função para iniciar um processo
const startProcess = (command, args, options, name) => {
  console.log(`🚀 Iniciando ${name}...`);
  
  const process = spawn(command, args, {
    ...options,
    stdio: 'inherit',
    shell: true
  });
  
  process.on('close', (code) => {
    console.log(`🛑 ${name} encerrado com código ${code}`);
  });
  
  process.on('error', (error) => {
    console.error(`❌ Erro no ${name}:`, error);
  });
  
  return process;
};

// Aguardar um pouco antes de iniciar o frontend
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const startSystem = async () => {
  // Iniciar backend primeiro
  const backend = startProcess('node', ['start-backend.js'], { cwd: __dirname }, 'Backend');
  
  // Aguardar 3 segundos para o backend inicializar
  console.log('⏳ Aguardando backend inicializar...');
  await delay(3000);
  
  // Iniciar frontend
  const frontend = startProcess('npm', ['run', 'dev'], { cwd: __dirname }, 'Frontend');
  
  // Lidar com encerramento graceful
  process.on('SIGINT', () => {
    console.log('\n🛑 Encerrando sistema...');
    backend.kill();
    frontend.kill();
    process.exit(0);
  });
  
  console.log('\n✅ Sistema iniciado com sucesso!');
  console.log('📡 Backend: http://localhost:3001');
  console.log('🌐 Frontend: http://localhost:5173');
  console.log('\n💡 Pressione Ctrl+C para encerrar o sistema');
};

startSystem().catch(console.error);