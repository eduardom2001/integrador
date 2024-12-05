========================================LÓGICO===============================================

1)Notei uma redundância no meu modelo conceitual, eu estava armazenando nome, duração e endereço do arquivo de áudio em MODELO DE ROTEIRO, 
mas isso não é necessário pois eu estou armazenando em cada tipo de material já, posso obter todos esses dados por JOIN

2) Armazenei a duração das músicas como int que serão armazenadas em segundos


=======================================CONCEITUAL=============================================

Como é um projeto relativamente grande, fiz algumas simplificações em relação aos Requisitos:

1) Os Modelos de Roteiro incialmente propostos como Segunda-Domingo foram adaptados para Dias de Semana e Fim de Semana;

2) As Vinhetas e as Músicas foram agregadas em uma Entidade-Mãe com nome Material de Áudio;

3) Da mesma forma, Gênero Músical e Tipo de Vinheta foram unidos em Gênero/Tipo, pois ambas entidades teriam mesmos funcionamento e mesmos atributos.

->Arthur Emanuel da Silva (2211100029)
                                                                                                                
