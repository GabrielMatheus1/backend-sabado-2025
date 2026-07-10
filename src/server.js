// Importa o Fastify, que e o framework usado para criar o servidor HTTP.
import Fastify from 'fastify'

// Carrega automaticamente as variaveis do arquivo .env para dentro de process.env.
// Exemplo: process.env.PORT e process.env.DB passam a ficar disponiveis no codigo.
import 'dotenv/config'; 

// Importa o arquivo que registra as rotas relacionadas a usuarios.
import usersRoutes from './routes/users.routes.js'

// Importa o arquivo que registra a rota de autenticacao/login.
import authRoutes from './routes/auth.routes.js';

// Cria a instancia principal do servidor Fastify.
// A opcao logger: true faz o Fastify mostrar logs das requisicoes no terminal.
const fastify = Fastify({
  logger: true
})

// Registra no servidor todas as rotas de usuarios, como /users, /newUser e outras.
await fastify.register(usersRoutes)

// Registra no servidor as rotas de autenticacao, como /login.
await fastify.register(authRoutes)


// Rota inicial para testar rapidamente se o servidor esta online.
// Quando alguem acessar GET /, o servidor responde com esta mensagem simples.
fastify.get('/', async function handler (request, reply) {
  return 'Servidor funcionando na porta 3000'
})


// Inicia o servidor usando a porta definida no arquivo .env.
// O try/catch evita que um erro de inicializacao passe despercebido.
try {
  await fastify.listen({ port: process.env.PORT })
} catch (err) {
  // Registra o erro no logger do Fastify para facilitar a investigacao.
  fastify.log.error(err)

  // Encerra a aplicacao com codigo de erro caso o servidor nao consiga subir.
  process.exit(1)
}
