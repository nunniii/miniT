// filesystem.ts

import { sendPath } from './wasmHelper';

/**
 * Função: ler path no indexDB, enviar path para módulo wasm, receber código path manipulado, salvar alterações no indexDB.
 *
 * @param path - Caminho inicial do sistema de arquivos
 * @returns O estado atual do filesystem como string
 */
export async function loadFilesystem(path: string): Promise<string> {
    // Simula leitura do IndexedDB
    const storedPath = await readFromIndexedDB('filesystemPath');
    const pathToUse =  storedPath || path; // Usa o path salvo ou o default

    // Envia o path para o WebAssembly
    const manipulatedPath = await sendPath(pathToUse);

    // Salva as alterações no IndexedDB
    await saveToIndexedDB('filesystemPath', manipulatedPath);

    return manipulatedPath;
}

/**
 * Lê dados do IndexedDB com base em uma chave.
 * @param key - Chave para buscar no IndexedDB
 * @returns O valor salvo ou null
 */
async function readFromIndexedDB(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('filesystemDB', 1);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains('filesystemStore')) {
                db.createObjectStore('filesystemStore');
            }
        };

        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction('filesystemStore', 'readonly');
            const store = transaction.objectStore('filesystemStore');
            const getRequest = store.get(key);

            getRequest.onsuccess = () => resolve(getRequest.result || null);
            getRequest.onerror = () => reject(getRequest.error);
        };

        request.onerror = () => reject(request.error);
    });
}

/**
 * Salva dados no IndexedDB com base em uma chave.
 * @param key - Chave para salvar no IndexedDB
 * @param value - Valor a ser salvo
 */
async function saveToIndexedDB(key: string, value: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('filesystemDB', 1);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains('filesystemStore')) {
                db.createObjectStore('filesystemStore');
            }
        };

        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction('filesystemStore', 'readwrite');
            const store = transaction.objectStore('filesystemStore');
            const putRequest = store.put(value, key);

            putRequest.onsuccess = () => resolve();
            putRequest.onerror = () => reject(putRequest.error);
        };

        request.onerror = () => reject(request.error);
    });
}
