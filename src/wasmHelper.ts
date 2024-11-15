// src/wasmHelper.ts
import init, { get_message } from './wasm/minilinux/pkg/minilinux.js';

export async function fetchMessage() {
  await init(); // Inicializa o WebAssembly
  return get_message();
}
