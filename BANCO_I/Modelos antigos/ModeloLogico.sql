-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/y0A6es
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "LOGIN" (
    "username" varchar(20)   NOT NULL,
    "password" varchar(20)   NOT NULL,
    CONSTRAINT "pk_LOGIN" PRIMARY KEY (
        "username"
     )
);

CREATE TABLE "CLIENTE" (
    "cnpj" varchar(14)   NOT NULL,
    "nome" varchar(20)   NOT NULL,
    "tel" varchar(9)   NOT NULL,
    "email" varchar(30)   NOT NULL,
    "rua" varchar(20)   NOT NULL,
    "num" varchar(10)   NOT NULL,
    "bairro" varchar(20)   NOT NULL,
    "cidade" varchar(20)   NOT NULL,
    "uf" varchar(2)   NOT NULL,
    CONSTRAINT "pk_CLIENTE" PRIMARY KEY (
        "cnpj"
     )
);

CREATE TABLE "COMERCIAL" (
    "cod" int   NOT NULL,
    "cnpj_cl" varchar(14)   NOT NULL,
    "file" varchar(50)   NOT NULL,
    "dur" int   NOT NULL,
    "dt_cad" date   NOT NULL,
    "dt_venc" date   NOT NULL,
    CONSTRAINT "pk_COMERCIAL" PRIMARY KEY (
        "cod"
     )
);

CREATE TABLE "BLOCOS_COMERCIAIS" (
    "cod_com" int   NOT NULL,
    "id_mr" int   NOT NULL,
    "hor_bloco" time   NOT NULL,
    CONSTRAINT "pk_BLOCOS_COMERCIAIS" PRIMARY KEY (
        "cod_com","id_mr"
     )
);

CREATE TABLE "MODELO_ROTEIRO" (
    "id" int   NOT NULL,
    CONSTRAINT "pk_MODELO_ROTEIRO" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "MUSICA_PROGRAMADA" (
    "cod_mus" int   NOT NULL,
    "id_mr" int   NOT NULL,
    CONSTRAINT "pk_MUSICA_PROGRAMADA" PRIMARY KEY (
        "cod_mus","id_mr"
     )
);

CREATE TABLE "MUSICAS" (
    "cod" int   NOT NULL,
    "cod_gt" int   NOT NULL,
    "nome" varchar(50)   NOT NULL,
    "file" varchar(50)   NOT NULL,
    "dur" int   NOT NULL,
    "artist" varchar(50)   NOT NULL,
    CONSTRAINT "pk_MUSICAS" PRIMARY KEY (
        "cod"
     )
);

CREATE TABLE "VINHETA_PROGRAMADA" (
    "cod_vnt" int   NOT NULL,
    "id_mr" int   NOT NULL,
    CONSTRAINT "pk_VINHETA_PROGRAMADA" PRIMARY KEY (
        "cod_vnt","id_mr"
     )
);

CREATE TABLE "VINHETAS" (
    "cod" int   NOT NULL,
    "cod_gt" int   NOT NULL,
    "nome" varchar(50)   NOT NULL,
    "file" varchar(50)   NOT NULL,
    "dur" int   NOT NULL,
    CONSTRAINT "pk_VINHETAS" PRIMARY KEY (
        "cod"
     )
);

CREATE TABLE "GENERO_TIPO" (
    "cod" int   NOT NULL,
    "nome" varchar(50)   NOT NULL,
    CONSTRAINT "pk_GENERO_TIPO" PRIMARY KEY (
        "cod"
     )
);

ALTER TABLE "COMERCIAL" ADD CONSTRAINT "fk_COMERCIAL_cnpj_cl" FOREIGN KEY("cnpj_cl")
REFERENCES "CLIENTE" ("cnpj");

ALTER TABLE "BLOCOS_COMERCIAIS" ADD CONSTRAINT "fk_BLOCOS_COMERCIAIS_cod_com" FOREIGN KEY("cod_com")
REFERENCES "COMERCIAL" ("cod");

ALTER TABLE "BLOCOS_COMERCIAIS" ADD CONSTRAINT "fk_BLOCOS_COMERCIAIS_id_mr" FOREIGN KEY("id_mr")
REFERENCES "MODELO_ROTEIRO" ("id");

ALTER TABLE "MUSICA_PROGRAMADA" ADD CONSTRAINT "fk_MUSICA_PROGRAMADA_cod_mus" FOREIGN KEY("cod_mus")
REFERENCES "MUSICAS" ("cod");

ALTER TABLE "MUSICA_PROGRAMADA" ADD CONSTRAINT "fk_MUSICA_PROGRAMADA_id_mr" FOREIGN KEY("id_mr")
REFERENCES "MODELO_ROTEIRO" ("id");

ALTER TABLE "MUSICAS" ADD CONSTRAINT "fk_MUSICAS_cod_gt" FOREIGN KEY("cod_gt")
REFERENCES "GENERO_TIPO" ("cod");

ALTER TABLE "VINHETA_PROGRAMADA" ADD CONSTRAINT "fk_VINHETA_PROGRAMADA_cod_vnt" FOREIGN KEY("cod_vnt")
REFERENCES "VINHETAS" ("cod");

ALTER TABLE "VINHETA_PROGRAMADA" ADD CONSTRAINT "fk_VINHETA_PROGRAMADA_id_mr" FOREIGN KEY("id_mr")
REFERENCES "MODELO_ROTEIRO" ("id");

ALTER TABLE "VINHETAS" ADD CONSTRAINT "fk_VINHETAS_cod_gt" FOREIGN KEY("cod_gt")
REFERENCES "GENERO_TIPO" ("cod");

