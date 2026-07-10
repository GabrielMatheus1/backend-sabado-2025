# Backend - Aula JYNX Sabado Manha

Este projeto e uma API simples feita em Node.js com Fastify. Ela foi criada em sala de aula para praticar rotas, controllers, repository, conexao com banco Neon/PostgreSQL e criptografia de senha com bcrypt.

## Tecnologias usadas

- Node.js
- Fastify
- Neon Database/PostgreSQL
- bcrypt
- dotenv

## 1. Iniciar o projeto Node.js

Depois iniciamos o projeto com `npm init`:

```bash
npm init -y
```

Esse comando cria o arquivo `package.json`, que guarda as informacoes do projeto, os scripts e as dependencias instaladas.

## 2. Configurar o projeto para usar import/export

No `package.json`, adicionamos:

```json
"type": "module"
```

Isso permite usar `import` e `export` nos arquivos JavaScript.

## 3. Instalar as dependencias

Instalamos as bibliotecas usadas no backend, uma por vez:

```bash
npm install fastify
```

```bash
npm install dotenv
```

```bash
npm install @neondatabase/serverless
```

```bash
npm install bcrypt
```

Funcao de cada biblioteca:

- `fastify`: cria o servidor e as rotas da API.
- `dotenv`: carrega variaveis do arquivo `.env`.
- `@neondatabase/serverless`: conecta o projeto ao banco Neon/PostgreSQL.
- `bcrypt`: cria hash de senha e compara senha no login.

## 4. Criar a estrutura de pastas

A estrutura criada foi:

```text
Backend/
|-- src/
|   |-- controller/
|   |   `-- arquivos de controller
|   |-- repository/
|   |   `-- arquivos de repository
|   |-- routes/
|   |   `-- arquivos de routes
|   `-- arquivo principal do servidor
|-- .env
|-- package.json
`-- package-lock.json
```

Responsabilidade de cada pasta:

- `routes`: define os endpoints da API.
- `controller`: recebe a requisicao, pega os dados e chama a regra necessaria.
- `repository`: executa as consultas SQL no banco de dados.
- `server.js`: cria o servidor Fastify, registra as rotas e inicia a aplicacao.

## 5. Criar o arquivo .env

Na raiz do projeto criamos o arquivo `.env`:

```env
DB='postgresql://usuario:senha@host/neondb?sslmode=require'
PORT=3000
```

O `DB` guarda a string de conexao com o banco Neon/PostgreSQL.
O `PORT` define a porta em que o servidor vai rodar.

Para pegar a chave do banco no Neon, siga os prints abaixo:

**Print 1 - Clicar no botao Connect**

No dashboard do projeto no Neon, clique no botao `Connect`.

![Botao Connect no dashboard do Neon](docs/images/neon-connect.png)

**Print 2 - Copiar a string de conexao**

Na janela que abrir, copie a connection string clicando em `Copy snippet`.

![Copiar connection string no Neon](docs/images/neon-copy-snippet.png)

Importante: o arquivo `.env` possui dados sensiveis e nao deve ser enviado para repositorios publicos.

## 6. Entender como os arquivos se conectam

O projeto foi separado em camadas para deixar cada arquivo com uma responsabilidade clara.

```text
server.js
   |
   v
routes
   |
   v
controllers
   |
   v
repository
   |
   v
banco de dados
```

### Arquivo principal do servidor

O arquivo `src/server.js` e o ponto inicial do backend.

Ele faz quatro coisas principais:

- importa o Fastify;
- carrega as variaveis do `.env`;
- conecta os arquivos de rotas ao servidor;
- inicia o servidor na porta configurada.

De forma generica, esse arquivo e responsavel por ligar o servidor aos arquivos de rotas.

Exemplo de conexao:

- `server.js` importa arquivos da pasta `routes`;
- cada arquivo de rota registrado passa a fazer parte da API.

---
### Arquivos de routes

Os arquivos da pasta `src/routes` ficam responsaveis por receber as requisicoes.

Eles definem qual caminho da API sera acessado e qual controller deve ser chamado.

Um arquivo de rota pode representar qualquer assunto do sistema, por exemplo:

- usuarios;
- produtos;
- pedidos;
- alunos;
- turmas;
- login.

De forma generica, um arquivo de rota faz isso:

- recebe a chamada da API;
- pega dados da URL, do body ou dos parametros;
- chama uma funcao do controller;
- devolve a resposta para quem fez a requisicao.

Conexao com outros arquivos:

- arquivos de `routes` normalmente importam arquivos de `controller`;
- eles nao devem concentrar regra de negocio;
- eles tambem nao precisam acessar o banco diretamente.

---
### Arquivos de controller

Os arquivos da pasta `src/controller` ficam no meio do caminho entre as rotas e o banco de dados.

Eles recebem os dados que vieram das rotas e decidem o que precisa acontecer.

Um controller pode ser usado para:

- validar dados recebidos;
- organizar informacoes antes de salvar;
- aplicar regras do sistema;
- criptografar senhas;
- chamar uma ou mais funcoes do repository;
- montar a resposta que sera devolvida para a rota.

Conexao com outros arquivos:

- arquivos de `controller` normalmente sao chamados pelos arquivos de `routes`;
- arquivos de `controller` normalmente importam arquivos de `repository`;
- quando necessario, tambem podem importar bibliotecas como `bcrypt`.

---
### Arquivos de repository

Os arquivos da pasta `src/repository` ficam responsaveis por conversar com o banco de dados.

Essa camada concentra os comandos SQL e a conexao com o banco.

Um repository pode ser usado para:

- buscar registros;
- cadastrar registros;
- alterar registros;
- remover registros;
- consultar dados por id, email, nome ou outro campo.

Conexao com outros arquivos:

- arquivos de `repository` normalmente sao chamados pelos arquivos de `controller`;
- eles usam a variavel `DB` do `.env` para conectar no banco;
- eles nao precisam saber qual rota chamou aquela acao.

### Exemplo usando este projeto

Neste backend, temos exemplos dessa organizacao:

- `server.js` registra os arquivos `users.routes.js` e `auth.routes.js`;
- `users.routes.js` chama funcoes do `users.controller.js`;
- `auth.routes.js` chama funcoes do `auth.controller.js`;
- `users.controller.js` chama funcoes do `users.repository.js`;
- `auth.controller.js` tambem usa o `users.repository.js` para buscar usuario pelo email;
- `users.repository.js` acessa o banco Neon/PostgreSQL usando `process.env.DB`.

Essa mesma ideia pode ser repetida para outras partes do sistema.

Exemplo:

- `products.routes.js`;
- `products.controller.js`;
- `products.repository.js`.

Ou:

- `students.routes.js`;
- `students.controller.js`;
- `students.repository.js`.

Resumo da comunicacao:

- `server.js` chama os arquivos de rotas;
- os arquivos de rotas chamam os controllers;
- os controllers chamam o repository;
- o repository executa comandos no banco de dados;
- a resposta volta pelo mesmo caminho ate chegar ao cliente.

## 7. Criar o script para rodar o projeto

No `package.json`, foi criado o script:

```json
"scripts": {
  "dev": "node --watch src/server.js"
}
```

O `--watch` reinicia automaticamente o servidor quando algum arquivo e alterado.

## 8. Rodar o projeto

Para iniciar o backend:

```bash
npm run dev
```

Se tudo estiver correto, o servidor sobe na porta configurada no `.env`.

Exemplo:

```text
http://localhost:3000
```

## 9. Testar as rotas

### Testar servidor

```http
GET http://localhost:3000/
```

Resposta esperada:

```text
Servidor funcionando na porta 3000
```

### Criar usuario

```http
POST http://localhost:3000/newUser
Content-Type: application/json
```

Body:

```json
{
  "name": "Aluno",
  "email": "aluno@email.com",
  "password": "123456"
}
```

### Listar usuarios

```http
GET http://localhost:3000/users
```

### Buscar usuario por id

```http
GET http://localhost:3000/user/1
```

### Alterar usuario

```http
PUT http://localhost:3000/alterUser/1
Content-Type: application/json
```

Body:

```json
{
  "name": "Aluno Atualizado",
  "email": "aluno.atualizado@email.com",
  "password": "654321"
}
```

### Deletar usuario

```http
DELETE http://localhost:3000/deleteUser/1
```

### Fazer login

```http
POST http://localhost:3000/login
Content-Type: application/json
```

Body:

```json
{
  "email": "aluno@email.com",
  "password": "123456"
}
```

## Fluxo geral do projeto

```text
Cliente/Postman/Insomnia
        |
        v
Routes
        |
        v
Controller
        |
        v
Repository
        |
        v
Banco de dados Neon/PostgreSQL
```

Resumo:

- A rota recebe a requisicao.
- O controller organiza os dados e aplica regras, como gerar hash de senha.
- O repository executa comandos SQL.
- O banco retorna os dados.
- A API responde ao cliente.
