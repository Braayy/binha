# binha
bun + rinha, Minha implementação de interpretador de rinha para o [rinha de compiladores](https://github.com/aripiprazole/rinha-de-compiler)

## Executando com Docker

### Construindo a imagem

1. `git clone https://github.com/Braayy/binha.git`
2. `cd binha`
3. `docker build -t binha:1.0.0 .`

### Executando em um container

A imagem foi feita para executar o arquivo de AST no caminho "/var/rinha/source.rinha.json", então é necessário passar o arquivo que deseja executar através de um volume.

`docker run -it -v "<ARQUIVO AST AQUI>:/var/rinha/source.rinha.json" binha:1.0.0`

## Executando diretamente

Você precisa ter o [bun](https://bun.sh/) instalado no seu sistema.

1. `git clone https://github.com/Braayy/binha.git`
2. `cd binha`
3. `bun install`

### Executando arquivos AST

`bun start <arquivo ast>`

### REPL

`cargo install rinha` - Caso não tenha o parser do rinha instalado

`bun run repl`