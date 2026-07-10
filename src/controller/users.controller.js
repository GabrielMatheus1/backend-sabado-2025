// Importa o repository, que e a camada responsavel por conversar com o banco de dados.
import userRepository from "../repository/users.repository.js"

// Importa o bcrypt, biblioteca usada para transformar a senha em hash antes de salvar.
import bcrypt from 'bcrypt'


// Objeto que agrupa as funcoes de controle das rotas de usuarios.
// O controller recebe os dados da requisicao, prepara o que for necessario e chama o repository.
const usersController = {

    // Busca todos os usuarios cadastrados.
    // Aqui nao existe tratamento extra, entao o controller apenas repassa a chamada para o repository.
    async getUsers() {
        return await userRepository.getAllUsers()
    },

    // Busca um usuario especifico pelo id recebido na rota.
    async getUser(req, reply) {
        // Pega o parametro id da URL.
        // Exemplo: em /user/5, req.params.id sera 5.
        const { id } = req.params;

        // Chama o repository para executar a consulta no banco.
        return await userRepository.getUserById(id)
    },

    // Cria um novo usuario.
    async newUser(req, reply) {

        // Extrai do corpo da requisicao os dados enviados pelo cliente.
        const { name, email, password } = req.body

        // Define o custo do hash do bcrypt.
        // Quanto maior o numero, mais trabalhoso fica gerar o hash.
        const saltroud = 10

        // Gera o hash da senha.
        // A senha original nao deve ser salva diretamente no banco por questao de seguranca.
        const hash = await bcrypt.hash(String(password), saltroud)

        // Envia os dados para o repository salvar no banco.
        // O password enviado para o banco ja e o hash, nao a senha pura.
        return await userRepository.createNewUser(name, email, hash)
    },

    // Exclui um usuario pelo id recebido na rota.
    async deleteById(req, reply) {

        // Recupera o id informado na URL.
        const { id } = req.params

        // Chama o repository para executar o DELETE no banco.
        return await userRepository.deleteUser(id)

    },

    // Altera os dados de um usuario existente.
    async alterUser(req, reply){
        // Recupera o id da URL para saber qual usuario sera atualizado.
        const { id } = req.params

        // Recupera do corpo da requisicao os novos dados do usuario.
        const { name, email, password } = req.body

        // Define o custo do hash do bcrypt para a nova senha.
        const salt = 10

        // Gera um novo hash para a senha recebida.
        const hash = await bcrypt.hash(String(password), salt)

        // Chama o repository para executar o UPDATE no banco.
        return await userRepository.alterUserById(id, name, email, hash)
    }

}


// Exporta o controller para que as rotas possam usar essas funcoes.
export default usersController
