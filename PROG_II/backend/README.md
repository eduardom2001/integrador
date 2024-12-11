Se estiver abrindo o backend pela primeira vez:

1) Crie uma database com nome radio_database (cmd -> psql -u postgres -> ```CREATE DATABASE radio_database```
2) Altere em backend/configs/conexaodb.js o seu usuario e senha do postgres
3) Dê ```npm install``` dentro da pasta backend no terminal para instalar o node_modules
4) Após isso só executar o script ```npm run dev``` na pasta backend e o servidor será carregado, sempre que quiser abri-lo use ```npm run dev```.
