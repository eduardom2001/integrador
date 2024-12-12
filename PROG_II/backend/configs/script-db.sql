
CREATE TABLE IF NOT EXISTS login(
    username varchar(255) NOT NULL,
    "password" varchar(255) NOT NULL,
    constraint pk_login primary key (username)
    
);

CREATE TABLE IF NOT EXISTS clientes(
    cnpj varchar(14) NOT NULL,
    nome varchar(255) NOT NULL,
    telef varchar(11) NOT NULL,
    email varchar(255) NOT NULL,
    rua varchar(255) NOT NULL,
    num varchar(10) NOT NULL,
    bairro varchar(255) NOT NULL,
    cidade varchar(255) NOT NULL,
    uf varchar(2) NOT NULL,
    constraint pk_clientes primary key (cnpj)
);

CREATE TABLE IF NOT EXISTS comerciais(
    cod SERIAL NOT NULL,
    nome varchar(255) NULL,
    cnpj_cliente varchar(14) NOT NULL,
    file_path varchar(255) NOT NULL,
    dur int NOT NULL,
    dt_cad date NOT NULL,
    dt_venc date NOT NULL,
    constraint pk_comerciais primary key (cod),
    constraint fk_clientes_comerciais foreign key (cnpj_cliente) references clientes(cnpj),
    CONSTRAINT unique_comercial UNIQUE (nome, cnpj_cliente)
    
);

CREATE TABLE IF NOT EXISTS generos(
    cod SERIAL NOT NULL,
    nome varchar(255) UNIQUE NOT NULL,
    constraint pk_generos primary key (cod) 
);

CREATE TABLE IF NOT EXISTS musicas(
    cod SERIAL NOT NULL,
    cod_gen int NOT NULL,
    nome varchar(255) NOT NULL,
    file_path varchar(255) NOT NULL,
    dur int NOT NULL,
    artist varchar (255),
    constraint pk_musicas primary key (cod),
    constraint fk_generos_musicas foreign key (cod_gen) references generos(cod),
    CONSTRAINT unique_musica UNIQUE (nome, cod_gen, artist) 
);

CREATE TABLE IF NOT EXISTS vinhetas(
    cod SERIAL NOT NULL,
    cod_gen int NOT NULL,
    nome varchar(255) NOT NULL,
    file_path varchar(255) NOT NULL,
    dur int NOT NULL,
    constraint pk_vinhetas primary key (cod),
    constraint fk_generos_vinhetas foreign key (cod_gen) references generos(cod),
    CONSTRAINT unique_vinheta UNIQUE (nome, cod_gen) 
);

CREATE TABLE IF NOT EXISTS items_playlist(
    id SERIAL NOT NULL,
    posicao int UNIQUE NOT NULL,
    cod_material int NOT NULL,
    tipo varchar(255) NOT NULL,
    constraint pk_items_playlist primary key (id)
);
