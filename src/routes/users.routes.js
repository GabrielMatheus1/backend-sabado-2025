
// Importa o controller responsavel pela regra de negocio das rotas de usuarios.
import usersController from "../controller/users.controller.js"

// Exporta uma funcao que recebe a instancia do Fastify.
// O Fastify chama essa funcao quando o arquivo de rotas e registrado no server.js.
export default function usersRoutes(fastify) {

    // Rota de consulta de todos os usuarios.
    // GET /users chama o controller, que depois busca os dados no repository.
    fastify.get('/users', async (req, reply) => {
        return await usersController.getUsers()
    })

    // Rota de consulta de um unico usuario pelo id informado na URL.
    // Exemplo: GET /user/1 envia o id 1 para o controller.
    fastify.get('/user/:id', async (req, reply) => {
        return await usersController.getUser(req, reply)
    })

    // Rota para cadastrar um novo usuario.
    // Os dados esperados chegam no corpo da requisicao: name, email e password.
    fastify.post('/newUser', async (req, reply) => { 
        return await usersController.newUser(req, reply)
    })

    // Rota para excluir um usuario pelo id informado na URL.
    // Exemplo: DELETE /deleteUser/1 tenta apagar o usuario de id 1.
    fastify.delete('/deleteUser/:id', async (req, reply) => { 
        return await usersController.deleteById(req, reply)
    })

    // Rota para alterar os dados de um usuario pelo id informado na URL.
    // Os novos dados chegam no corpo da requisicao.
    fastify.put('/alterUser/:id', async (req, reply) => {
        return await usersController.alterUser(req, reply)
    })

}
