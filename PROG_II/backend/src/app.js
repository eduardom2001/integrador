//================================================================importacoes e configs==============================================
const express = require('express');
const multer = require('multer');
const fs = require("fs");
const getMP3Duration = require("get-mp3-duration");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const path = require('path');
const app = express(); 
const cors = require("cors");
app.use(cors());
app.use(express.json());  
const db = require('../configs/conexaodb.js')

// abre servidor
const PORT = 3001
app.listen(PORT, ( ) => {
    console.log(`Servidor rodando no endereco http://localhost:${PORT}`);
})


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


//calcula a duracao do audio
const calculateAudioDuration = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, buffer) => {
            if (err) {
                reject(err); 
            } else {
                const duration = [getMP3Duration(buffer)]; 
                resolve(duration/1000); // retorna em segundos
            }
        });
    });
};


//converte tempo segundos para hh:mm:ss
const secondsToTime = (seconds) => {
    const date = new Date(null);
    date.setSeconds(seconds); // specify value for SECONDS here
    const result = date.toISOString().slice(11, 19);
    return result;
};


//================================================AUTENTICACAO E AUTORIZACAO CONFIGS======================================================================================

//configura sessao
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

//inserção dos usuarios manuais, usuarios pre-setados, senha eh inserida criptografada
async function cadastrarUsuarios() {
    try {
        await db.none('INSERT INTO login (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING', ['gravadora', bcrypt.hashSync('gravadora', saltRounds)]);
        await db.none('INSERT INTO login (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING', ['comercial', bcrypt.hashSync('comercial', saltRounds)]);
        await db.none('INSERT INTO login (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING', ['operador', bcrypt.hashSync('operador', saltRounds)]);
        console.log('Usuários cadastrados com sucesso!');
    } catch (err) {
        console.error(err);
    }
}
cadastrarUsuarios();


//verifica se a senha cadastrada eh igual a recebida dada a criptografia
passport.use(
	new LocalStrategy(
		{
			usernameField: "username",
			passwordField: "password",
		},
		async (username, password, done) => {
			try {
				
				const user = await db.oneOrNone(
					"SELECT username, password FROM login WHERE username = $1;",
					[username],
				);

				
				if (!user) {
					return done(null, false, { message: "Usuário incorreto." });
				}

				
				const passwordMatch = await bcrypt.compare(
					password,
					user.password,
				);

				
				if (passwordMatch) {
					console.log("Usuário autenticado!");
					return done(null, user);
				} else {
					
					return done(null, false, { message: "Senha incorreta." });
				}
			} catch (error) {
				return done(error);
			}
		},
	),
);

//serializa e deserialize
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


//estrategia de verificacao para o token
passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: "eu sou a frase que sera usada de base para a criptografia",
		},
		async (payload, done) => {
			try {
				const user = await db.oneOrNone(
					"SELECT * FROM login WHERE username = $1;",
					[payload.username],
				);

				if (user) {
					done(null, user);
				} else {
					done(null, false);
				}
			} catch (error) {
				done(error, false);
			}
		},
	),
);


//verificar a autorizacao com base no username, para diferentes autorizacoes
function authorizeUsername(usernames) {
    return (req, res, next) => {
        if (usernames.includes(req.user.username)) { //includes para poder autorizar mais de um username
            next();
        } else {
            res.sendStatus(403);
        }
    };
}


//=====================================================================ROTAS======================================================================================
//rota raiz
app.get('/', (req,res) => {
    res.send('Bem vindo ao Backend da Rádio!!!!!!')
})


//rota de login padrao
app.post(
	"/login",
	passport.authenticate("local", { session: false }),
	(req, res) => {

		const token = jwt.sign({ username: req.body.username }, "eu sou a frase que sera usada de base para a criptografia", {
			expiresIn: "1h",
		});

		res.json({ message: "Login successful", token: token });
	},
);


//================================================================================================CRUD DE COMERCIAIS==========================================================================================================

//read comercial
app.get('/comerciais', 
    passport.authenticate("jwt", { session: false }),
    authorizeUsername(["comercial", "gravadora","operador"]), async (req,res) => {
    try {
        const comerciais = await db.any("SELECT co.cod,co.cnpj_cliente,co.nome as nome,co.dur,co.file_path,co.dt_cad,co.dt_venc FROM comerciais co JOIN clientes cl ON co.cnpj_cliente = cl.cnpj;");
        console.log('Retornando todos os comerciais.'); 

        //converte em hh:mm:ss para cada objeto do json
        for (let i = 0; i < comerciais.length; i++) {
            comerciais[i].dur = secondsToTime(comerciais[i].dur);
        }
        res.json(comerciais).status(200); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(404); 
    }
})
 
//create comercial
app.post('/comerciais', uploadComercial.single("audio"),  
    passport.authenticate("jwt", { session: false }),  
    authorizeUsername(["comercial"]), async (req, res) => {
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
    console.log(error);
    res.sendStatus(400);
}
})

//update comercial
app.put('/comerciais/:cod',  
    passport.authenticate("jwt", { session: false }),  
    authorizeUsername(["comercial"]), async (req, res) => {
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
    
        res.sendStatus(200);
    }  catch (error) {
    console.error(error);
    res.status(400);
}
})

//delete comercial
app.delete('/comerciais/:cod',
    passport.authenticate("jwt", { session: false }),  
    authorizeUsername(["comercial"]), async (req, res) => {
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
        await db.none("DELETE FROM comerciais WHERE cod = $1", comercialCod);
        res.sendStatus(200);
    }catch (error){
        console.log(error)
        res.sendStatus(400)

    }
})

//================================================================================================CRUD DE CLIENTES==========================================================================================================

//read cliente
app.get('/clientes',
    passport.authenticate("jwt", { session: false }),  
    authorizeUsername(["comercial"]), async (req, res) => {
    try {
        const clientes = await db.any("SELECT * FROM clientes ORDER BY nome;");
        res.json(clientes).status(200); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(400); 
    }
})
 
//read clientes com nome "similar" ao nome recebido
app.get('/cliente-similares', 
    passport.authenticate("jwt", { session: false }),  
    authorizeUsername(["comercial"]), async (req, res) => {
    try {
        const clienteNome = req.query.nome;
        const cliente = await db.any("SELECT * FROM clientes WHERE nome ILIKE $1",
    [`%${clienteNome}%`]);
        res.json(cliente).status(200); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(404); 
    }
})

//create cliente
app.post('/clientes', 
    passport.authenticate("jwt", { session: false }),  
    authorizeUsername(["comercial"]), async (req, res) => {
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
        res.sendStatus(201); // Retorna status 200 em caso de sucesso
    } catch (error) {
        console.log(error); // Log do erro para depuração
        res.sendStatus(400); // Retorna status 400 em caso de erro
    }
})

//update cliente
app.put('/clientes/:cnpj',
    passport.authenticate("jwt", { session: false }),  
    authorizeUsername(["comercial"]), async (req, res) => {
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
        res.sendStatus(200); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(400); 
    }
})

//delete cliente
app.delete('/clientes/:cnpj', 
    passport.authenticate("jwt", { session: false }),  
    authorizeUsername(["comercial"]), async (req, res) => {
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





//================================================================================================CRUD DE MUSICAS==========================================================================================================

//read musicas
app.get('/musicas', 
    passport.authenticate("jwt", { session: false }),  
    authorizeUsername(["gravadora","operador"]), async (req, res) => {
    try {
        const musicas = await db.any("SELECT m.cod,m.artist,m.nome as nome_musica,m.cod_gen,g.nome as nome_genero,m.dur,m.file_path FROM musicas m JOIN generos g ON m.cod_gen = g.cod;");
        for (let i = 0; i < musicas.length; i++) {
            musicas[i].dur = secondsToTime(musicas[i].dur);
        }
        res.json(musicas).status(200); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(404); 
    }
})


//create musica
app.post("/musica", uploadMusica.single("audio"), 
    passport.authenticate("jwt", { session: false }),  
    authorizeUsername(["gravadora"]), async (req, res) => {
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
        console.log(error);
        res.status(400);
    }
});

//update musica
app.put('/musicas/:cod',
    passport.authenticate("jwt", { session: false }),  
    authorizeUsername(["gravadora"]), async (req, res) => {
    try{
        const musicaCod = req.params.cod;
        const musicaNome = req.body.nome;
        const musicaArtista = req.body.artista;
        const musicaCod_Gen = req.body.genero;
        await db.none(
            "UPDATE musicas SET nome = $1, artist = $2, cod_gen = $3 WHERE cod = $4",
            [musicaNome, musicaArtista,musicaCod_Gen,musicaCod ]
        )
        res.sendStatus(200);
    }catch (error) {
        console.log(error)
        res.sendStatus(400)
    }
})

//delete musica
app.delete('/musicas/:cod', 
    passport.authenticate("jwt", { session: false }),  
    authorizeUsername(["gravadora"]), async (req, res) => {
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

//================================================================================================CRUD DE VINHETAS==========================================================================================================

//read vinheta
app.get('/vinhetas', 
    passport.authenticate("jwt", { session: false }),  
    authorizeUsername(["gravadora","operador"]), async (req, res) => {
    try {
        const vinhetas = await db.any("SELECT v.cod,v.nome as nome_vinheta,v.cod_gen,g.nome as nome_genero,v.dur,v.file_path FROM vinhetas v JOIN generos g ON v.cod_gen = g.cod;");
        for (let i = 0; i < vinhetas.length; i++) {
            vinhetas[i].dur = secondsToTime(vinhetas[i].dur);
        }
        res.json(vinhetas).status(200); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(404); 
    }
})

//create vinheta
app.post('/vinhetas', uploadVinheta.single("audio"), 
    passport.authenticate("jwt", { session: false }),  
    authorizeUsername(["gravadora"]), async (req, res) => {
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
        console.log(error);
        res.status(400);
    }
    
})

//update vinheta
app.put('/vinhetas/:cod', 
    passport.authenticate("jwt", { session: false }),  
    authorizeUsername(["gravadora"]), async (req, res) => {
    try{
        const vinhetaCod = req.params.cod;
        const vinhetaNome = req.body.nome;
        const vinhetaCod_Gen = req.body.genero;
        await db.none(
            "UPDATE vinhetas SET nome = $1, cod_gen = $2 WHERE cod = $3",
            [vinhetaNome, vinhetaCod_Gen,vinhetaCod ]
        )
        res.sendStatus(200);
    }catch (error) {
        console.log(error)
        res.sendStatus(400)
    }
})

//delete vinheta
app.delete('/vinhetas/:cod', 
    passport.authenticate("jwt", { session: false }),  
    authorizeUsername(["gravadora"]), async (req, res) => {
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

//================================================================================================CRUD DE GENEROS==========================================================================================================

//read generos
app.get('/generos', 
    passport.authenticate("jwt", { session: false }),  
    authorizeUsername(["gravadora"]), async (req, res) => {
    try {
        const generos = await db.any("SELECT * FROM generos ORDER BY cod;");
        res.json(generos).status(200); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(404); 
    }
})

//create genero
app.post('/generos', 
    passport.authenticate("jwt", { session: false }),  
    authorizeUsername(["gravadora"]), async (req, res) => {
    try {
        //pega os dados a serem inseridos 
        const generoNome = req.body.nome; 

        // Insere um novo cliente na tabela 'cliente' no banco de dados
         await db.none(
            "INSERT INTO generos (nome) values ($1);",
            [generoNome]
        );
        res.sendStatus(201); // Retorna status 200 em caso de sucesso
    } catch (error) {
        console.log(error); // Log do erro para depuração
        res.sendStatus(400); // Retorna status 400 em caso de erro
    }
})

//update genero
app.put('/generos/:cod', 
    passport.authenticate("jwt", { session: false }),  
    authorizeUsername(["gravadora"]), async (req, res) => {
    try {
        const generoCod = req.params.cod;
        const generoNome = req.body.nome;
        await db.none(
            "UPDATE generos SET nome = $1 WHERE cod = $2 ",
            [generoNome,generoCod]
        );
        res.sendStatus(200); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(400); 
    }
})

//delete genero
app.delete('/generos/:cod', 
    passport.authenticate("jwt", { session: false }),  
    authorizeUsername(["gravadora"]), async (req, res) => {
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


//================================================================================================ PLAYLIST ==========================================================================================================

//read items da playlist
app.get('/items-playlist', 
    passport.authenticate("jwt", { session: false }),  
    authorizeUsername(["comercial","gravadora","operador"]), async (req, res) => {
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
        res.sendStatus(404);
    }
});


//post items na playlist
app.post('/items-playlist', 
    passport.authenticate("jwt", { session: false }),  
    authorizeUsername(["comercial","gravadora","operador"]), async (req, res) => {
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

        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.sendStatus(400);
    }
});

//delete item na playlist atualizando as posicoes
app.delete('/items-playlist/:id', 
    passport.authenticate("jwt", { session: false }),  
    authorizeUsername(["comercial","gravadora","operador"]), async (req, res) => {
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


module.exports = app;
