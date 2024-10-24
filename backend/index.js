const express = require('express');

const server = express();

server.use(express.json());
server.use(express.urlencoded({extended: true}));

server.listen(3001, () => console.log("servidor rodando na porta 3001"));

//pagina inicial
server.get("/", (req, res) => {
    res.send("retorna pagina inicial");
});

//crud login
server.post("/login", (req, res) => {
    res.send("retorna confirmação de validação");
});

server.post("/logout", (req, res) => {
    res.send("aviso de logout recebido");
});

//crud clientes
server.get("/clientes", (req, res) => {
    res.send("retornando lista de clientes");
});
server.post("/clientes", (req, res) => {
    res.send("criado cliente novo");
});
server.put("/clientes/id", (req, res) => {
    res.send("atualizado cliente existente");
});
server.delete("/clientes/id", (req, res) => {
    res.send("deletado cliente existente");
});

//crud comerciais
server.get("/comerciais", (req, res) => {
    res.send("retornando lista de comerciais");
});
server.post("/comerciais", (req, res) => {
    res.send("criado comercial novo");
});
server.put("/comerciais/id", (req, res) => {
    res.send("atualizado comercial existente");
});
server.delete("/comerciais/id", (req, res) => {
    res.send("deletado comercial existente");
});

//crud modelo de roteiros
server.get("/modelos", (req, res) => {
    res.send("retornando lista de modelos");
});
server.post("/modelos", (req, res) => {
    res.send("criado modelo novo");
});
server.put("/modelos/id", (req, res) => {
    res.send("atualizado modelo existente");
});
server.delete("/modelos/id", (req, res) => {
    res.send("deletado modelo existente");
});

//crud musicas
server.get("/musicas", (req, res) => {
    res.send("retornando lista de musicas");
});
server.post("/musicas", (req, res) => {
    res.send("criada musica nova");
});
server.put("/musicas/id", (req, res) => {
    res.send("atualizada musica existente");
});
server.delete("/musicas/id", (req, res) => {
    res.send("deletada musica existente");
});

//crud vinhetas
server.get("/vinhetas", (req, res) => {
    res.send("retornando lista de vinhetas");
});
server.post("/vinhetas", (req, res) => {
    res.send("criada vinheta nova");
});
server.put("/vinhetas/id", (req, res) => {
    res.send("atualizada vinheta existente");
});
server.delete("/vinhetas/id", (req, res) => {
    res.send("deletada vinheta existente");
});

//crud modelo do dia
server.post("/modelos/hoje/musicas", (req, res) => {
    res.send("adicionada musica ao modelo do dia");
});
server.post("/modelos/hoje/vinhetas", (req, res) => {
    res.send("adicionada vinheta ao  modelo do dia");
});
server.put("/modelos/hoje/musicas", (req, res) => {
    res.send("atualizada musica no modelo do dia");
});
server.put("/modelos/hoje/vinhetas", (req, res) => {
    res.send("atualizada vinheta no modelo do dia");
});
server.delete("/vinhetas/hoje/musicas", (req, res) => {
    res.send("deletada musica no modelo do dia");
});
server.delete("/modelos/hoje/vinhetas", (req, res) => {
    res.send("deletada vinheta no modelo do dia");
});
