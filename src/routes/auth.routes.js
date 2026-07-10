// Importa o controller que contem a regra de validacao do login.
import authController from "../controller/auth.controller.js"

// Exporta uma funcao de rotas para ser registrada no Fastify pelo server.js.
export default function authRoutes(fastify) {

    // Rota de login.
    // Recebe email e password no corpo da requisicao e devolve os dados do usuario se a senha estiver correta.
    fastify.post('/login', async (req, reply) => {
        return await authController.validaLogin(req, reply)
    })


}
