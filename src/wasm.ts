import init, { remove_duplicates, filter_primes } from '../wasm/pkg/wasm';

// Inicializa o WebAssembly
export async function initWasm(): Promise<void> {
  await init(); // Inicializa o Wasm
}

// Função que chama remove_duplicates
export async function processDuplicates(array: number[]): Promise<number[]> {
  // Converter array de 'number[]' para 'BigUint64Array'
  const bigIntArray = new BigUint64Array(array.map(BigInt)); // Converte cada número para BigInt
  
  // Chama a função Rust 'remove_duplicates'
  const result = remove_duplicates(bigIntArray);

  // Converte o resultado de volta para 'number[]'
  return Array.from(result).map(Number);
}


export async function filterPrimes(array: number[]): Promise<number[]> {
  const bigIntArray = new BigUint64Array(array.map(BigInt)); // Converte cada número para BigInt
  const result = filter_primes(bigIntArray);

  return Array.from(result).map(Number); // Converte o resultado de volta para 'number[]'
}
