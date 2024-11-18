// src/wasmHelper.ts

import init, { get_message, call_function, filesystem } from './wasm/minilinux/pkg/minilinux.js';

// Função para inicializar o WebAssembly
export async function fetchMessage() {
  await init(); // Inicializa o WebAssembly
  return get_message(); // Chama a função exportada de Rust
}


// Função para inicializar o WebAssembly e chamar o comando
export async function Command(command: string, path: string): Promise<string> {
    await init();  // Inicializa o WebAssembly
    return call_function(command, path);  // Chama a função call_function do WebAssembly
}


export async function sendPath( path: string  ) : Promise<string> {

  await init();
  return filesystem(path);


}




