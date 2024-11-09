# integrador
TRABALHO INTEGRADOR - SISTEMA PARA RÁDIO

Resumo do Projeto

Nosso trabalho integrador será um sistema de gerenciamento e funcionamento de uma rádio.

O sistema funciona com base em 3 níveis diferentes de acesso, sendo eles o Administrador, o Gravador e o Operador.

O sistema iniciará em uma tela de login, onde conforme o usuário (Administrador, Gravador ou Operador) irá renderizar os componentes que cada usuário terá acesso.

O Administrador possui acesso ao setor comercial, onde é possível fazer cadastro de comerciais e contratos, os comerciais possuem cadastro em banco de dados, onde são fornecidas informações sobre os anunciantes, um anunciante pode ter vários comerciais cadastrados (ex. Uma distribuidora de produtos naturais com mais de um produto promovido), cada comercial pode estar linkado a apenas um anunciante, cada comercial possui um arquivo de áudio, um pdf do contrato e informações referentes ao contrato, esses comerciais serão postos na playlist, em blocos com rótulos do horário em que deverão ser veiculados, o(s) bloco(s) no(s) qual(is) cada comercial deve sair são especificados no contrato.

O Gravador possui acesso a programação de todos os dias em um raio de tempo de um mês, é possível mudar como será gerado o novo roteiro (um roteiro é a playlist de um dia específico, começando às 00:00 e terminando 23:59), o Gravador pode adicionar qualquer música e qualquer vinheta na programação, os blocos comerciais são indicados aqui apenas pelo rótulo do horário, o Gravador não consegue remover comerciais, mas consegue adicionar e remover tanto músicas como vinhetas ao banco de dados do sistema.

O Operador tem acesso apenas ao roteiro do dia atual, ele pode adicionar músicas e vinhetas ao roteiro, ele pode pausar a playlist, adicionar loops, dar play etc. O operador tem acesso a execução singular de uma música ou vinheta também, por um mini player auxiliar, o operador não pode remover comerciais nem alterá-los.