# Template para Back-End

Este é um template para iniciar seu back-end de forma rápida. Ele contém o básico para criação, atualização, remoção e autenticação de usuários, utilizando Node.js, Express, TypeORM, Postgres, Redis e Docker.

## Começando

<br/>

OBS: Este exemplo está utilizando o SO Linux Ubuntu então alguns comandos de terminal só funcionarão utilizando Linux, caso esteja utilizando outro SO procure pesquisar comandos semelhantes.

<br/>

Tenha o [git](https://git-scm.com/) em sua máquina, assim poderá clonar o template.

Use o comando:

```
git clone https://github.com/PattonHoffiman/back-end-template
```

Ou baixe o [ZIP](https://github.com/PattonHoffiman/back-end-template/archive/master.zip).

## Pré-Requisitos
### Node.js

<br/>

<p>
  O Node.js será utilizado para construir o back-end utilizando do javascript para tal.
</p>

<br/>

- Baixe e instale o [Node.js](https://nodejs.org/en/) em sua máquina.
- Após isso digite em seu terminal:
```
node -v
```
- Caso tenha aparecido a versão do mesmo você o instalou com sucesso.

<br/>

### Yarn

<br/>

<p>
  O Yarn é o gerenciador de pacotes que utilizaremos para baixar e atualizar as bibliotecas nescessárias para a execução do back-end.
</p>

<br/>

  - Digite o seguinte no Terminal:
  ```
  npm install -g yarn
  ```
  - Espere a conclusão da instalação e depois digite:
  ```
  yarn -v
  ```
  - Caso tenha aparecido a versão do mesmo você o instalou com sucesso.
  - Se tiver dúvidas ou precisar de mais informações: [Yarn](https://yarnpkg.com/getting-started/install)

<br/>

### Docker

<br/>

  <p>
    O Docker servirá para componentizar os serviços nescessários para que o back-end possa funcionar devidamente. Neste caso utilizaremos ele para que possa manter o Postgres e assim garantir a permanência dos dados.
  </p>

<br/>

  - Baixe e instale o [Docker](https://docs.docker.com/engine/install) em sua máquina.
  - Após isso digite em seu terminal:
  ```
  docker -v
  ```
  - Caso tenha aparecido a versão do mesmo você o instalou com sucesso.

<br/>

### Postgres

<br/>

<p>
  O Postgres é o banco de dados escolhido para manter a persitência do back-end, mas você pode escolher outro se assim desejar, apenas pesquise o nome da imagem e siga as mesmas etapas.
</p>

  - Abra o terminal e digite:
  ```
  sudo docker run --name nome_da_imagem -e POSTGRES_PASSWORD=senha_do_banco -p 5432:5432 -d postgres
  ```
  - Onde:
    - --name nome_da_imagem: digite o nome que dará para acessar o postgres pelo docker.
    - -e POSTGRES_PASSWORD: digite a senha que utilizará para acessa o banco de dados.
    - -p 5432:5432 : Esta é a porta que dá acesso ao postgres o padrão é a porta 5432, mas você pode alterá-la caso necessite.
    - -d postgres: o nome da imagem do postgres.
    - Digite em seu terminal:
    ```
      sudo docker ps -a
    ```
    - Algo parecido com isso deverá aparecer:
    ```
    CONTAINER ID        IMAGE               COMMAND                  CREATED         STATUS                     PORTS                      NAMES
    0054fcb7fac2        postgres            "docker-entrypoint.s…"   3 months ago        Up 4 hours                 0.0.0.0:5432->5432/tcp     postgresdb
    ```
    - Para que o postgres seja executado pelo docker digite:
    ```
      sudo docker start nome_da_imagem
    ```
    - Caso o nome da imagem apareça, então a mesma já estará rodando no docker.

<br/>

### Redis

<br/>

<p>
  O Redis lida com o cache do back-end, ele servirá para reduzir a interação com o banco de dados melhorando a escalabilidade do mesmo retornando informações que são constantemente acessadas de forma mais rápida reduzindo o tempo de execução.
</p>

- A instalação do Redis é muito semelhante ao do postgres. Apenas digite:
```
sudo docker run --name nome_da_imagem -p 6379:6379 -d redis:alpine
```

- Siga as mesmas instruções do postgres que tudo deverá ocorrer bem.

<br/>

## Importante!

Verifique os arquivos que possuem "sample" no nome, neles você precisará inserir dados próprios, como senha para o banco de dados, secret do JWT e afins. Remova o sample ou renomeie o arquivo assim que adicionar suas mudanças.

Não esqueça de criar o banco de dados, você pode utilizar um SGBD ou o próprio terminal.

Execute o comando:
```
yarn typeorm:run
```

Para que todas as Migrations sejam executadas, dessa forma o banco de dados será construído e atualizado.

## Instalação

<br/>

Depois de tudo feito acesse a pasta do projeto e digite no terminal:
```
yarn install
```

<br/>

Espere a instalação ser concluída e para verificar que está rodando digite:
```
yarn dev:server
```

<br/>

Caso apareça:
```
Server Started on Port: 3333
```

Então tudo está corretamente configurado e instalado. A partir daqui você pode desenvolver o que precisar para dar forma ao seu projeto.


<br/>

Você pode executar o seguinte comando no terminal:
```
yarn test
```
Dessa forma executará os testes já desenvolvidos para o usuário.

vá em: src/modules/users/services/__ tests __ caso queira mais informações do que está sendo testado. Você também pode criar os seus próprios a medida que vai desenvolvendo seu projeto.

<br/>


## Lista de Bibliotecas

### BCryptjs
Utilizada para encripitar as senhas antes que elas sejam salvas no banco de dados.

### Celebrate
Utilizado para validar os campos dentro das rotas, impedindo alguma manipulação indevida dos dados e forçando um formato de entrada nas chamadas da API.

### Class Trasformer
Utilazado para moldar os objetos antes de enviar para o front-end, podendo remover campos ou adicionar novos na medida da nescessidade. Nesse caso está sendo utilizado para remover o campo "password" por se tratar de um dado sensível.

### Cors
Utilizado para validar quem está utilizando o back-end, podendo restringir o acesso apenas a um determinado site por exemplo.

### Date FNS
Utilizada para manipular datas e horários. Nesse caso o usamos para validar o tempo de expiração do token.

### Dot Env
Utilizado para adicionar as variáveis ambientes podendo manter quaisquer dados sensíveis apenas no seu ambiente de desenvolvimento. Mantenha o arquivo "sample.env" e crie um novo com as suas próprias variáveis, não esqueça de atualizar o sample.

### Express
Utilizado para realizar as requisições http, sem ele não será possível enviar ou receber dados.

### Express Async Errors
Utilizado para que se possa captar erros quando se utiliza funções assíncronas, visto que muitas tarefas no back-end exigem um tempo de resposta.

### Handlebars
Utilizado para desenvolver os templates de e-mail deixando o documento mais agradável aos olhos do usuário.

### IoRedis
Utilizado para acessar o Redis.

### Json Web Token
Utilizado para criar e comparar os tokens de sua aplicação, dessa forma se limita quais recursos podem ser acessados, dependendo do token. Nesse caso o usamos para diferenciar quem está logado de quem não está pois há rotas que só podem ser acessadas por quem efetuou o login. Ex: Atualizar Dados, Remover Usuário.

### Multer
Utilizado para receber, adicionar, remover e atualizar arquivos. Nesse caso o usamos para salvar a imagem de avatar, mas o mesmo pode ser utilizado com outros tipos de arquivo. Apenas o use para testes no desenvolvimento.

### Node Mailer
Utilizado para o envio de e-mails, juntamente com o ethereal o usamos para testar o envio, use-o apenas como teste.

### PG
Utilizado para acessar o Postgres.

### Reflect Meta Data e Tsyringe
Ambos são usados em conjunto para realizar a injeção de dependência no projeto, tornado a instanciação de objetos mais fácil e de conformidade com os princípios SOLID.

### Type ORM
Utilizado para criar migrações para o banco de dados, normalizando a estrutura do mesmo para todos os envolvidos no projeto. Também facilita a manipulação dos dados entre o back-end e o banco.

### UUID
Utilizado para criar ids únicos. Nesse caso o usamos nos fakes dos testes.

## Dependências de Desenvolvimento

### Eslint e Prettier
Utilizados para padronizar os códigos.

### Typescript
Adiciona tipagens ao javascript facilitando o desenvolvimento.

### Jest
Utilizada para a criação e execução de testes automatizados.
