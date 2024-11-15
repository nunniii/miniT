# Diretório do repositório WebAssembly
$repoUrl = "https://github.com/nunniii/minilinux.git"
$targetDir = "$PSScriptRoot/../src/wasm/minilinux"

# Cria a pasta ./src/wasm/minilinux se não existir
if (-Not (Test-Path "$PSScriptRoot/../src/wasm")) {
    Write-Host "Criando diretório ./src/wasm..."
    New-Item -ItemType Directory -Force -Path "$PSScriptRoot/../src/wasm" | Out-Null
}

if (-Not (Test-Path $targetDir)) {
    Write-Host "Clonando o repositório minilinux em ./src/wasm/minilinux..."
    git clone $repoUrl $targetDir
} else {
    Write-Host "Repositório já clonado em ./src/wasm/minilinux. Pulando esta etapa..."
}

# Compilando WebAssembly
Write-Host "Compilando WebAssembly..."
Set-Location -Path $targetDir
if (-Not (Test-Path ".\pkg")) {
    wasm-pack build --target web
    Write-Host "Compilação concluída!"
} else {
    Write-Host "WebAssembly já compilado. Pulando esta etapa..."
}

Write-Host "Script concluído com sucesso!"
