// Configura a conexão com o banco de dados PostgreSQL
const pgp = require("pg-promise")({}); // Importa a biblioteca pg-promise para interagir com o PostgreSQL
const {join} = require("node:path") //para trabalhar com caminhos de arquivos

const usuario = "postgres"; 
const senha = "trybswtaw";


//LEMBRE DE CRIAR UMA DATABASE radio_database e atualizar user e senha do seu usuario no postgres!!!!
const db = pgp(`postgres://${usuario}:${senha}@localhost:5432/radio_database`);



const filePath = join(__dirname, "script-db.sql"); //pega o caminho do script de criacao do banco
const query = new pgp.QueryFile(filePath); //atribui essa query do caminho do scrip
db.query(query) //executa, cria as tabelas de script-db.sql

module.exports = db //apos iniciar o banco exporta db para ser