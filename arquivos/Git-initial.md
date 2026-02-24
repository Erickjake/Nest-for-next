# Git Configuration and Setup

## 1. Configurações de usuário e normalização de quebra de linha (LF)

git config user.name "Erickson Costa" git config user.email
"ericsonmano@gmail.com" git config core.autocrlf input git config core.eol lf

## 2. Renomear branch principal e adicionar o repositório remoto (via SSH)

git branch -M main git remote add origin
git@github.com:Erickjake/Nest-for-next.git

## 3. Adicionar arquivos e criar o primeiro commit

git add . git commit -m "initial"

## 4. Enviar para o GitHub vinculando a branch

git push origin main -u
