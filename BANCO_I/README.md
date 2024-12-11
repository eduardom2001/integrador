==========================================NOTAS FINAIS=======================================

1)De modo a deixar o projeto menos complexo, atualizei o banco para ser mais simples de implementar, principalmente devido ao front e backend do aplicativo web;

2)Deixei numa pasta separada as versões antigas, os Atualizados são os que eu efetivamente utilizei para a aplicação, os Atualizados foram feitos com base nas adaptações que fiz no script-db.sql enquanto projetava o backend.


->Arthur Emanuel da Silva (2211100029)

========================================FÍSICO===============================================

1)Fiz algumas alterações no modelo, o único jeito que consegui implementar a adição de diferentes materiais em uma playlist foi fazer uma relação indireta, em items_playlist eu tenho o atributo cod_material, que faz uma referência indireta com as tabelas de música, vinheta ou comerciais, a identificação de qual tipo é feita pelo atributo tipo, o controle de qual chave apontará (cod_musica, cod_vinheta ou cod_comercial) será feito a nível de aplicação, com base no atributo tipo.

2)Mudei o Bloco Comercial para funcionar mais como um "Gênero de Comerciais", porque acredito que fique mais intuitivo.

->Arthur Emanuel da Silva (2211100029)

========================================LÓGICO===============================================

1) Notei uma redundância no meu modelo conceitual, eu estava armazenando nome, duração e endereço do arquivo de áudio em MODELO DE ROTEIRO, 
mas isso não é necessário pois eu estou armazenando em cada tipo de material já, posso obter todos esses dados por JOIN

2) Armazenei a duração das músicas como int que serão armazenadas em segundos

->Arthur Emanuel da Silva (2211100029)

=======================================CONCEITUAL=============================================

Como é um projeto relativamente grande, fiz algumas simplificações em relação aos Requisitos:

1) Os Modelos de Roteiro incialmente propostos como Segunda-Domingo foram adaptados para Dias de Semana e Fim de Semana;

2) As Vinhetas e as Músicas foram agregadas em uma Entidade-Mãe com nome Material de Áudio;

3) Da mesma forma, Gênero Músical e Tipo de Vinheta foram unidos em Gênero/Tipo, pois ambas entidades teriam mesmos funcionamento e mesmos atributos.

->Arthur Emanuel da Silva (2211100029)
                                                                                                                
