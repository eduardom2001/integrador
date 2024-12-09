//================================================================importacoes e configs==============================================
const express = require('express');
const multer = require('multer');
const fs = require("fs");
const getMP3Duration = require("get-mp3-duration");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const path = require('path');
const app = express(); 
app.use(cors());
app.use(express.json());  
const db = require('../configs/conexaodb.js')
const PORT = 3001
app.listen(PORT, ( ) => {
    console.log(`Servidor rodando no endereco http://localhost:${PORT}`);
})


//========================================================================================================================================


//==============================================================para gerenciar os arquivos e extrair seus dados=========================================================

//funcao pra armazenamento de musicas
const storageMusicas = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads/musicas")),  
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const uploadMusica = multer({ storage: storageMusicas });

// funcao de armazenamento para vinhetas
const storageVinhetas = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads/vinhetas")),  
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const uploadVinheta = multer({ storage: storageVinhetas });

// funcao de armazenamento para comerciais
const storageComerciais = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads/comerciais")),  
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const uploadComercial = multer({ storage: storageComerciais });


const calculateAudioDuration = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, buffer) => {
            if (err) {
                reject(err); // Caso não consiga ler o arquivo
            } else {
                const duration = getMP3Duration(buffer); // Calcula a duração em segundos
                resolve(duration); // Retorna a duração
            }
        });
    });
};
//========================================================================================================================================================================

//================================================AUTENTICACAO E AUTORIZACAO CONFIGS======================================================================================
app.use(
	session({
		secret: 'eu sou a frase que sera usada de base para a criptografia',
		resave: false,
		saveUninitialized: false,
		cookie: { secure: true },
	}),
);

app.use(passport.initialize());
app.use(passport.session());

const saltRounds = 10;

//inserção dos usuarios manual
async function cadastrarUsuarios() {
    try {
        await db.none('INSERT INTO login (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING', ['gravadora', bcrypt.hashSync('gravadora', saltRounds)]);
        await db.none('INSERT INTO login (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING', ['comercial', bcrypt.hashSync('comercial', saltRounds)]);
        await db.none('INSERT INTO login (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING', ['operador', bcrypt.hashSync('operador', saltRounds)]);
        console.log('Usuários cadastrados com sucesso!');
    } catch (err) {
        console.error('Erro ao cadastrar usuários:', err);
    }
}
cadastrarUsuarios();

passport.use(
	new LocalStrategy(
		{
			usernameField: "username",
			passwordField: "password",
		},
		async (username, password, done) => {
			try {
				// busca o usuário no banco de dados
				const user = await db.oneOrNone(
					"SELECT username, password FROM login WHERE username = $1;",
					[username],
				);

				// se não encontrou, retorna erro
				if (!user) {
					return done(null, false, { message: "Usuário incorreto." });
				}

				// verifica se o hash da senha bate com a senha informada
				const passwordMatch = await bcrypt.compare(
					password,
					user.password,
				);

				// se senha está ok, retorna o objeto usuário
				if (passwordMatch) {
					console.log("Usuário autenticado!");
					return done(null, user);
				} else {
					// senão, retorna um erro
					return done(null, false, { message: "Senha incorreta." });
				}
			} catch (error) {
				return done(error);
			}
		},
	),
);
passport.serializeUser(function (user, cb) {
	process.nextTick(function () {
        return cb(null, user.username);
	});
});

passport.deserializeUser(function (user, cb) {
	process.nextTick(function () {
		return cb(null, user);
	});
});

//========================================================================================================================================================================
//rota raiz
app.get('/', (req,res) => {
    res.send('Bem vindo ao Backend da Rádio!!!!!!')
})

app.post(
	"/login",
	passport.authenticate("local", { session: false }),
	(req, res) => {

		// Cria o token JWT
		const token = jwt.sign({ username: req.body.username }, "your-secret-key", {
			expiresIn: "1h",
		});

		res.json({ message: "Login successful", token: token });
	},
);

//ROTAS PARA SETOR COMERCIAL

//CRUD DE COMERCIAIS
app.get('/comerciais', async (req,res) => {
    try {
        const comerciais = await db.any("SELECT co.cod,co.cnpj_cliente,cl.nome as nome_cliente,co.nome as nome_comercial,co.dur,co.file_path,co.dt_cad,co.dt_venc FROM comerciais co JOIN clientes cl ON co.cnpj_cliente = cl.cnpj;");
        console.log('Retornando todos os comerciais.'); 
        res.json(comerciais).status(200); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(400); 
    }
})
 
app.post('/comerciais',uploadComercial.single("audio"), async (req,res) => {
    try{
        const comercialNome = req.body.nome;
        const comercialClienteCnpj = req.body.cnpj;
        const comercialDataCadastro = req.body.cadastro;
        const comercialDataVencimento = req.body.vencimento;
        const comercialFilePath = path.join(__dirname, "uploads/comerciais", req.file.filename);
        const duration = await calculateAudioDuration(comercialFilePath);


        
        await db.none(
            "INSERT INTO comerciais (nome,cnpj_cliente,file_path,dur,dt_cad,dt_venc) VALUES ($1,$2,$3,$4,$5,$6) ",
            [comercialNome,comercialClienteCnpj, comercialFilePath, duration,comercialDataCadastro,comercialDataVencimento]
        );
    
        res.sendStatus(201);
    }  catch (error) {
    console.error("Erro ao salvar música:", error);
    res.status(500).json({ error: "Erro ao salvar música" });
}
})

app.put('/comerciais/:cod', async (req,res) => {
    try{
        const comercialCod = req.params.cod;
        const comercialNome = req.body.nome;
        const comercialClienteCnpj = req.body.cnpj;
        const comercialDataCadastro = req.body.cadastro;
        const comercialDataVencimento = req.body.vencimento;
        await db.none(
            "UPDATE comerciais SET nome = $1, cnpj_cliente = $2, dt_cad = $3, dt_venc = $4  WHERE cod = $5",
            [comercialNome,comercialClienteCnpj,comercialDataCadastro,comercialDataVencimento,comercialCod]
        );
    
        res.sendStatus(201);
    }  catch (error) {
    console.error("Erro ao salvar música:", error);
    res.status(500).json({ error: "Erro ao salvar música" });
}
})

app.delete('/comerciais/:cod', async (req,res) => {
    try{
        const comercialCod= req.params.cod;
        const comercial_caminho = await db.one("SELECT file_path FROM comerciais WHERE cod = $1", [comercialCod]);
        fs.unlink(comercial_caminho.file_path, (err) => {
            if (err) {
                console.log("Erro ao deletar o arquivo:", err);
            } else {
                console.log("Arquivo deletado com sucesso");
            }
        });;
        await db.none("DELETE FROM musicas WHERE cod = $1", comercialCod);
        res.sendStatus(200);
    }catch (error){
        console.log(error)
        res.sendStatus(400)

    }
})

//CRUD DE CLIENTES

//lista todos os dados de todos os clientes
app.get('/clientes', async (req,res) => {
    try {
        const clientes = await db.any("SELECT * FROM clientes ORDER BY nome;");
        console.log('Retornando todos os clientes.'); 
        res.json(clientes).status(200); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(400); 
    }
})
 
//listar clientes com nome "similar" ao nome recebido
app.get('/cliente-similares', async (req,res) => {
    try {
        const clienteNome = req.query.nome;
        const cliente = await db.any("SELECT * FROM clientes WHERE nome ILIKE $1",
    [`%${clienteNome}%`]);
        console.log('Retornando todos os clientes.'); 
        res.json(cliente).status(200); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(400); 
    }
})

//registra cliente novo
app.post('/clientes', async (req,res) => {
    try {
        //pega os dados a serem inseridos 
        const clienteCpnj = req.body.cnpj; 
        const clienteNome = req.body.nome;
        const clienteTelef = req.body.telef; 
        const clienteEmail = req.body.email;
        const clienteRua = req.body.rua; 
        const clienteNum = req.body.num;
        const clienteBairro = req.body.bairro; 
        const clienteCidade = req.body.cidade;
        const clienteUf = req.body.uf; 

        // Insere um novo cliente na tabela 'cliente' no banco de dados
        await db.none(
            "INSERT INTO clientes (cnpj,nome,telef,email,rua,num,bairro,cidade,uf) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);",
            [clienteCpnj, clienteNome, clienteTelef, clienteEmail, clienteRua, clienteNum, clienteBairro, clienteCidade, clienteUf]
        );
        res.sendStatus(200); // Retorna status 200 em caso de sucesso
    } catch (error) {
        console.log(error); // Log do erro para depuração
        res.sendStatus(400); // Retorna status 400 em caso de erro
    }
})

app.put('/clientes/:cnpj', async (req,res) => {
    try {
        const clienteCpnj = req.params.cnpj; 
        const clienteNome = req.body.nome;
        const clienteTelef = req.body.telef; 
        const clienteEmail = req.body.email;
        const clienteRua = req.body.rua; 
        const clienteNum = req.body.num;
        const clienteBairro = req.body.bairro; 
        const clienteCidade = req.body.cidade;
        const clienteUf = req.body.uf; 
        await db.none(
            "UPDATE clientes SET nome = $1,telef = $2,email = $3,rua = $4,num = $5,bairro = $6,cidade = $7,uf = $8 WHERE cnpj=$9",
            [clienteNome, clienteTelef, clienteEmail, clienteRua, clienteNum, clienteBairro, clienteCidade, clienteUf, clienteCpnj]
        );
        console.log('Atualizações feitas...'); 
        res.sendStatus(200); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(400); 
    }
})

app.delete('/clientes/:cnpj', async (req,res) => {
    try {
        const clienteCnpj = req.params.cnpj; 
        await db.none(
            "DELETE FROM clientes WHERE cnpj = $1",
            [clienteCnpj]
        );
        res.sendStatus(200); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(400); 
    }
})


//===============================ROTAS PARA GRAVADORA===============================


//CRUD DE MUSICAS
app.get('/musicas', async (req,res) => {
    try {
        const musicas = await db.any("SELECT m.cod,m.artist,m.nome as nome_musica,m.cod_gen,g.nome as nome_genero,m.dur,m.file_path FROM musicas m JOIN generos g ON m.cod_gen = g.cod;");
        console.log('Retornando todas as musicas.'); 
        res.json(musicas).status(200); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(400); 
    }
})


app.post("/musica", uploadMusica.single("audio"), async (req, res) => {
    try {
        
        const musicaNome = req.body.nome;
        const musicaArtista = req.body.artista;
        const musicaCod_Gen = req.body.genero;
        const musicaFilePath = path.join(__dirname, "uploads/musicas", req.file.filename);
        const duration = await calculateAudioDuration(musicaFilePath);


        
        await db.none(
            "INSERT INTO musicas (cod_gen,nome,file_path,dur,artist) VALUES ($1,$2,$3,$4,$5) ",
            [ musicaCod_Gen, musicaNome, musicaFilePath, duration,musicaArtista ]
        );
        
        res.sendStatus(201);
    } catch (error) {
        console.error("Erro ao salvar música:", error);
        res.status(500).json({ error: "Erro ao salvar música" });
    }
});
app.put('/musicas/:cod', async (req,res) => {
    try{
        const musicaCod = req.params.cod;
        const musicaNome = req.body.nome;
        const musicaArtista = req.body.artista;
        const musicaCod_Gen = req.body.genero;
        await db.none(
            "UPDATE musicas SET nome = $1, artist = $2, cod_gen = $3 WHERE cod = $4",
            [musicaNome, musicaArtista,musicaCod_Gen,musicaCod ]
        )
        res.sendStatus(201);
    }catch (error) {
        console.log(error)
        res.sendStatus(400)
    }
})

app.delete('/musicas/:cod', async (req,res) => {
    try{
        const musicaCod = req.params.cod;
        const musica_caminho = await db.one("SELECT file_path FROM musicas WHERE cod = $1", [musicaCod]);
        fs.unlink(musica_caminho.file_path, (err) => {
            if (err) {
                console.log("Erro ao deletar o arquivo:", err);
            } else {
                console.log("Arquivo deletado com sucesso");
            }
        });;
        await db.none("DELETE FROM musicas WHERE cod = $1", musicaCod);
        res.sendStatus(200);
    }catch (error){
        console.log(error)
        res.sendStatus(400)

    }
})

//CRUD DE VINHETAS

app.get('/vinhetas', async (req,res) => {
    try {
        const vinhetas = await db.any("SELECT v.cod,v.nome as nome_vinheta,v.cod_gen,g.nome as nome_genero,v.dur,v.file_path FROM vinhetas v JOIN generos g ON v.cod_gen = g.cod;");
        console.log('Retornando todas as vinhetas.'); 
        res.json(vinhetas).status(200); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(400); 
    }
})

app.post('/vinhetas', uploadVinheta.single("audio"), async (req,res) => {
    try {
        
        const vinhetaNome = req.body.nome;
        const vinhetaCod_Gen = req.body.genero;
        const vinhetaFilePath = path.join(__dirname, "uploads/vinhetas", req.file.filename);
        const duration = await calculateAudioDuration(vinhetaFilePath);


        
        await db.none(
            "INSERT INTO vinhetas (cod_gen,nome,file_path,dur) VALUES ($1,$2,$3,$4) ",
            [ vinhetaCod_Gen, vinhetaNome, vinhetaFilePath, duration ]
        );
        
        res.sendStatus(201);
    } catch (error) {
        console.error("Erro ao salvar música:", error);
        res.status(500).json({ error: "Erro ao salvar música" });
    }
    
})

app.put('/vinhetas/:cod', async (req,res) => {
    try{
        const vinhetaCod = req.params.cod;
        const vinhetaNome = req.body.nome;
        const vinhetaCod_Gen = req.body.genero;
        await db.none(
            "UPDATE vinhetas SET nome = $1, cod_gen = $2 WHERE cod = $3",
            [vinhetaNome, vinhetaCod_Gen,vinhetaCod ]
        )
        res.sendStatus(201);
    }catch (error) {
        console.log(error)
        res.sendStatus(400)
    }
})

app.delete('/vinhetas/:cod', async (req,res) => {
    try{
        const vinhetaCod = req.params.cod;
        const vinheta_caminho = await db.one("SELECT file_path FROM vinhetas WHERE cod = $1", [vinhetaCod]);
        fs.unlink(vinheta_caminho.file_path, (err) => {
            if (err) {
                console.log("Erro ao deletar o arquivo:", err);
            } else {
                console.log("Arquivo deletado com sucesso");
            }
        });;
        await db.none("DELETE FROM vinhetas WHERE cod = $1", vinhetaCod);
        res.sendStatus(200);
    }catch (error){
        console.log(error)
        res.sendStatus(400)

    }
})

//GENEROS MUSICAIS E TIPOS DE VINHETAS
app.get('/generos', async(req,res) => {
    try {
        const generos = await db.any("SELECT * FROM generos ORDER BY cod;");
        console.log('Retornando todos os generos.'); 
        res.json(generos).status(200); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(400); 
    }
})

app.post('/generos', async (req,res) => {
    try {
        //pega os dados a serem inseridos 
        const generoNome = req.body.nome; 

        // Insere um novo cliente na tabela 'cliente' no banco de dados
         await db.none(
            "INSERT INTO generos (nome) values ($1);",
            [generoNome]
        );
        res.sendStatus(200); // Retorna status 200 em caso de sucesso
    } catch (error) {
        console.log(error); // Log do erro para depuração
        res.sendStatus(400); // Retorna status 400 em caso de erro
    }
})

app.put('/generos/:cod', async (req,res) => {
    try {
        const generoCod = req.params.cod;
        const generoNome = req.body.nome;
        await db.none(
            "UPDATE generos SET nome = $1 WHERE cod = $2 ",
            [generoNome,generoCod]
        );
        console.log('Atualizações feitas...'); 
        res.sendStatus(200); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(400); 
    }
})

app.delete('/generos/:cod', async (req,res) => {
    try {
        const generoCod = req.params.cod; 
        await db.none(
            "DELETE FROM generos WHERE cod = $1",
            [generoCod]
        );
        res.sendStatus(200); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(400); 
    }
})

//PLAYLIST

app.get('/items-playlist', async (req, res) => {
    try {
        const query = `
            SELECT 
                ip.id,
                ip.posicao,
                ip.tipo,
                CASE
                    WHEN ip.tipo = 'musica' THEN m.dur
                    WHEN ip.tipo = 'comercial' THEN c.dur
                    WHEN ip.tipo = 'vinheta' THEN v.dur
                    ELSE NULL
                END AS material_duracao,
                CASE
                    WHEN ip.tipo = 'musica' THEN CONCAT(m.nome, ' - ', m.artist)
                    WHEN ip.tipo = 'comercial' THEN c.nome
                    WHEN ip.tipo = 'vinheta' THEN v.nome
                    ELSE NULL
                END AS material_nome,
                CASE
                    WHEN ip.tipo = 'musica' THEN m.file_path
                    WHEN ip.tipo = 'comercial' THEN c.file_path
                    WHEN ip.tipo = 'vinheta' THEN v.file_path
                    ELSE NULL
                END AS endereco
            FROM 
                items_playlist ip
            LEFT JOIN musicas m ON ip.cod_material = m.cod AND ip.tipo = 'musica'
            LEFT JOIN vinhetas v ON ip.cod_material = v.cod AND ip.tipo = 'vinheta'
            LEFT JOIN comerciais c ON ip.cod_material = c.cod AND ip.tipo = 'comercial';
        `;

        const items = await db.any(query);

        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.post('/items-playlist', async (req, res) => {
    try {
        const itemPlaylistCod = req.body.cod;
        const itemPlaylistTipo = req.body.tipo;

    
        // Obter a maior posição já existente na playlist
        const result = await db.oneOrNone(`SELECT MAX(posicao) AS max_posicao FROM items_playlist`);

        let posicao = 1;
        if (result && result.max_posicao) {
            posicao = result.max_posicao + 1;
        }

        
        await db.none(
            "INSERT INTO items_playlist (posicao, cod_material, tipo) VALUES ($1, $2, $3)",
            [posicao, itemPlaylistCod, itemPlaylistTipo]
        );

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.delete('/items-playlist/:id', async (req, res) => {
    try {
        const itemPlaylistId = req.params.id;

        //qual a posicao do itemq ue vai ser excluido
        const item = await db.one("SELECT posicao FROM items_playlist WHERE id = $1", [itemPlaylistId]);

        const posicaoDeletada = item.posicao;

        await db.none("DELETE FROM items_playlist WHERE id = $1", [itemPlaylistId]);

        await db.none("UPDATE items_playlist SET posicao = posicao - 1 WHERE posicao > $1", [posicaoDeletada]);

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(400);
    }
});



//por questão de boas praticas é ideal voce separar as rotas do server em si, por isso
//deve-se separar o listen em um arquivo server na pasta root, esse export possibilita isso
//mas antes, para ativar os exports, deve-se inserir "type": "module" no package.json, olhe la
module.exports = app;
