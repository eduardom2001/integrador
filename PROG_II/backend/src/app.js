//importa express
const express = require('express');

//const cors = require("cors"); // Importa o middleware CORS para habilitar requisições de diferentes origens (authn e authz)




const app = express(); //instancia de express em app

//app.use(cors()); // para authn e authz
app.use(express.json()); //aceitar arquivos json 
const db = require('../configs/conexaodb.js')

const PORT = 3001
app.listen(PORT, ( ) => {
    console.log(`Servidor rodando no endereco http://localhost:${PORT}`);
})

//rota raiz
//app.get('/', (req,res) => {
   // res.send('Olá Mundo em Express!!!!!!')
//})

app.get('/login', (req,res) =>{
    
})

//ROTAS PARA SETOR COMERCIAL

//CRUD DE COMERCIAIS
app.get('/comerciais', (req,res) => {
    res.send(comerciais)
})
 
app.post('/comerciais', (req,res) => {
    
})

app.put('/comerciais/:id', (req,res) => {
    
})

app.delete('/comerciais/:id', (req,res) => {
    
})

//CRUD DE CLIENTES

app.get('/clientes', (req,res) => {
    res.send(comerciais)
})
 
app.post('/clientes', (req,res) => {
    
})

app.put('/clientes/:id', (req,res) => {
    
})

app.delete('/clientes/:id', (req,res) => {
    
})


//===============================ROTAS PARA GRAVADORA===============================


//CRUD DE MUSICAS
app.get('/musicas', (req,res) => {
    res.send(musicas);
})
app.post('/musicas', (req,res) => {
    
})
app.put('/musicas/:id', (req,res) => {
    
})
app.delete('/musicas/:id', (req,res) => {
    
})

//CRUD DE VINHETAS

app.get('vinhetas', (req,res) => {
    res.send(musicas);
})

app.post('/vinhetas', (req,res) => {
    
})

app.put('/vinhetas/:id', (req,res) => {
    
})

app.delete('/vinhetas/:id', (req,res) => {
    
})

//GENEROS MUSICAIS E TIPOS DE VINHETAS
app.get('/gravadora/generos-tipos', (req,res) => {
    res.send(musicas);
})

app.post('/generos-tipos', (req,res) => {
    
})

app.put('/generos-tipos/:id', (req,res) => {
    
})

app.delete('/generos-tipos/:id', (req,res) => {
    
})

//MODELOS DE PLAYLIST

app.get('/generos-tipos', (req,res) => {
    res.send(musicas);
})



//por questão de boas praticas é ideal voce separar as rotas do server em si, por isso
//deve-se separar o listen em um arquivo server na pasta root, esse export possibilita isso
//mas antes, para ativar os exports, deve-se inserir "type": "module" no package.json, olhe la
module.exports = app;
