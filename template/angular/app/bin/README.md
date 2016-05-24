## Arquivos executáveis

### Publicação local de ambiente para deploy

Todos comandos que terminam com "hífen-publish" (ex: client-build-publish.bat) terão o propósito de criar uma pasta invisível que começam com "." (ex: .client.build) que é ignorada pelo git (não comitada) e serve para ter a cópia fiel da aplicação para o deploy.

Exemplo

```
cd trooka/bin
./client-build-publish.bat
```


### Build para o deploy

O deploy acontece para o ambiente do heroku. Bata executar uma sequência de 2 comandos, "publish" e "build"

#### Execução de deploy do front

- 1.0: Execute o comando `client-build-publish.sh` para criar o ambiente de deploy
```
cd trooka/bin
./client-build-publish.sh
```
Só é necessário rodar este comando uma vez. Será gerado uma pasta invisível .client.build na raiz do projeto

- 2.0: Gerar a build e enviar para nuvem
```
./client-build.sh
```

#### Execução de deploy do backend (api)

- 1.0: Execute o comando `server-build-publish.sh` para criar o ambiente de deploy
```
cd trooka/bin
./server-build-publish.sh
```
Só é necessário rodar este comando uma vez. Será gerado uma pasta invisível .server.build na raiz do projeto

- 2.0: Gerar a build e enviar para nuvem
```
./server-build.sh
```