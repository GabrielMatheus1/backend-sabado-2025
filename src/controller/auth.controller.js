// Importa o repository para consultar usuarios no banco de dados.
import userRepository from "../repository/users.repository.js"

// Importa o bcrypt para comparar a senha digitada com o hash salvo no banco.
import bcrypt from 'bcrypt'

// Objeto que agrupa as funcoes relacionadas a autenticacao.
const authController = { 

    // Consulta um usuario pelo email.
    // Essa funcao ajuda o login a descobrir se o email existe no banco.
    async consultEmail(email) {
        // Busca no banco todos os usuarios com o email informado.
        // Pela regra do sistema, o esperado e encontrar zero ou um usuario.
        const usuario = await userRepository.getUserByEmail(email)
        
        // Se a consulta retornar pelo menos um registro, devolve o primeiro usuario encontrado.
        if (usuario.length > 0) {
            return usuario[0]
        } else {
            // Se nao encontrou nenhum usuario, devolve null para indicar que o login nao pode continuar.
            return null
        }

    },

    // Valida o login do usuario.
    // Recebe email e password no corpo da requisicao.
    async validaLogin(req, reply) {
        // Extrai email e senha enviados pelo cliente.
        const { email, password } = req.body

        // Procura no banco se existe um usuario com esse email.
        const existeUsuario = await this.consultEmail(email)

        // Se o email nao existir, retorna uma mensagem generica.
        // A mensagem nao diz se o erro foi no usuario ou na senha para evitar expor informacoes.
        if( !existeUsuario ) {
            return { 'message': 'Usuario ou senha incorreta!' }
        }

        // Compara a senha digitada com o hash salvo no banco.
        // bcrypt.compare retorna true quando a senha corresponde ao hash.
        const senhaCorreta = await bcrypt.compare( String(password), existeUsuario.password )

        // Se a senha nao bater, retorna a mesma mensagem generica de erro.
        if ( !senhaCorreta ) {
            return { 'message': 'Usuario ou senha incorreta!' }
        }


        // Se chegou ate aqui, o email existe e a senha esta correta.
        // Retorna alguns dados do usuario logado para o cliente.
        return { 
            "Usuario": existeUsuario.name,
            "Email": existeUsuario.email,
            "ID": existeUsuario.id
        }
        
    }

}

// Exporta o controller para que a rota /login possa usa-lo.
export default authController
