#!/bin/bash

# Diretório do repositório WebAssembly
repoUrl="https://github.com/nunniii/minilinux.git"
targetDir="$(pwd)/src/wasm/minilinux"

# Cria a pasta ./src/wasm se não existir
if [ ! -d "$(pwd)/src/wasm" ]; then
    echo "Criando diretório ./src/wasm..."
    mkdir -p "$(pwd)/src/wasm"
fi

# Verifica se o repositório já foi clonado
if [ ! -d "$targetDir" ]; then
    echo "Clonando o repositório minilinux em ./src/wasm/minilinux..."
    git clone $repoUrl $targetDir
else
    echo "Repositório já clonado em ./src/wasm/minilinux. Pulando esta etapa..."
fi

# Compilando WebAssembly
echo "Compilando WebAssembly..."
cd $targetDir
if [ ! -d "./pkg" ]; then
    wasm-pack build --target web
    echo "Compilação concluída!"
else
    echo "WebAssembly já compilado. Pulando esta etapa..."
fi

echo "Script concluído com sucesso!"
