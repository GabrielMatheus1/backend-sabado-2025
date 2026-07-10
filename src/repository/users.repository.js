// Importa a funcao neon, usada para conectar e executar comandos SQL no banco Neon/PostgreSQL.
import { neon } from "@neondatabase/serverless"

// Cria a conexao com o banco usando a string salva no arquivo .env.
// process.env.DB deve conter a URL de conexao do banco.
const sql = neon(process.env.DB)


// Objeto que agrupa todas as funcoes de acesso ao banco da tabela users.
// Essa camada e chamada de repository porque centraliza as consultas SQL.
const userRepository = {

    // Query que busca todos os usuarios no banco de dados.
    async getAllUsers() {
        return await sql`SELECT * FROM users`
    },

    // Query que busca um usuario pelo id no banco de dados.
    async getUserById(id) {
        // O ${id} dentro da template string do Neon envia o valor como parametro seguro.
        return await sql`SELECT * FROM users WHERE id = ${id}`
    },

    // Query que busca um usuario pelo email.
    // Essa funcao e usada principalmente no login.
    async getUserByEmail(email) {
        // O email tambem e enviado como parametro, evitando concatenar texto direto no SQL.
        return await sql`SELECT * FROM users WHERE email = ${email}`
    },

    // Query que cria um novo usuario no banco de dados.
    async createNewUser(name, email, password) {
        // Executa o INSERT na tabela users.
        // A senha recebida aqui ja deve vir em formato de hash pelo controller.
        const newUser = await sql`
        INSERT INTO users (name, email, password) 
             VALUES (${name}, ${email}, ${password})`

        // Retorna uma mensagem simples para a rota responder ao cliente.
        return `O usuario ${name} foi cadastrado`
    },


    // Query que remove um usuario pelo id.
    async deleteUser(id) {
        // Executa o DELETE apenas no usuario cujo id foi informado.
        const deleteUser = await sql`
        DELETE FROM users 
        WHERE id = ${id};
        `

        // Retorna uma mensagem simples de sucesso.
        return 'Usuario deletado com sucesso!'
    }, 

    // Query que altera name, email e password de um usuario pelo id.
    async alterUserById(id, name, email, password) {
        // Executa o UPDATE na tabela users.
        // A senha recebida aqui tambem ja deve chegar como hash.
        const alterUser = await sql`
        UPDATE users
        SET name = ${name}, email = ${email}, password = ${password} 
        WHERE id = ${id};
        `

        // Retorna uma mensagem simples indicando qual usuario foi atualizado.
        return `Usuario ${name} foi atualizado!`
    }


}

// Exporta o repository para ser usado pelos controllers.
export default userRepository
