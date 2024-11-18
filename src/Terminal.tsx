// Terminal.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Command } from './wasmHelper'; // função para chamar o wasm
import { loadFilesystem } from './filesystem'; // importações relacionadas ao filesystem
import './styles/Terminal.scss';

// #arch
// -- Exemplo de código:  d|name|{ d|test|{  a|hello.txt|{this is the string of here}  } a|hi.txt|{string hi} }
//
// -- Estrutura::     
//     /name
//      |
//      /test  --> hello.txt
//      hi.txt
//
// 🦄 segue a declaração inicial:
export let path = "p{/home/uwu} c{cd}{/path/este/path} % d|name|{ d|test|{  a|hello.txt|{this is the string of here}  } a|hi.txt|{string hi}";

const Terminal: React.FC = () => {
    const [input, setInput] = useState<string>(''); // Estado para armazenar o comando de entrada
    const [output, setOutput] = useState<string[]>([]); // Estado para armazenar a saída do terminal
    const [currentPathToShow, setCurrentPathToShow] = useState<string>(extractPath(path)); // Diretório atual
    const inputRef = useRef<HTMLInputElement>(null); // Referência para o input
    const outputRef = useRef<HTMLDivElement>(null); // Referência para o container da saída

    useEffect(() => {
        inputRef.current?.focus(); // isso direciona o foco no input assim que o componente é montado
    }, []);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight; // Scroll automático
        }
    }, [output]); // Atualiza quando o output muda

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    function AtribuirCommand(newPath: string, command: string) {
        
        const rest = ` d|name|{ d|test|{  a|hello.txt|{this is the string of here}  } a|hi.txt|{string hi}`;

        path = `p{${newPath}} c{${command}} % ${rest}`
        return path;
    }

    // Função para extrair path encontrado no indexDB
    function extractPath(input: string): string {
        let path = '';
    
        // Lógica para isolar o path em string
        const pathStart = input.indexOf("p{");
        const pathEnd = input.indexOf("}");
    
        if (pathStart !== -1 && pathEnd !== -1) {
            path = input.substring(pathStart + 2, pathEnd); // Extrai o path
        }
    
        return path;
    }

    const handleSubmit = async (event: React.FormEvent) => {

        let result = "";
        event.preventDefault();
        if (input.trim()) {
            if (input.trim() === 'clear') {
                setOutput([]); // Limpa o histórico de saída
                setInput(''); // Limpa o campo de entrada
                return;
            }

            try {
                    //p{/home/uwu} c{cd}{/path/este/path} % d|name|{ d|test|{  a|hello.txt|{this is the string of here}  } a|hi.txt|{string hi}
                if (  input.trim().startsWith('cd')  ) {
                    path = AtribuirCommand("/novoPath", "cd")
                    result = await Command(input, path) 
                } else {
                    
                    result = await Command(input, path);

                }
                result = await Command(input, path);



                setOutput((prevOutput) => [
                    ...prevOutput,
                    `> ${input}`, // Exibe o comando no terminal
                    result,
                ]);

                if (input.startsWith('cd')) {
                    const parts = input.split(' ');
                    if (parts.length > 1) {
                        setCurrentPathToShow(parts[1]);
                    }
                }
            } catch (error) {
                if (error instanceof Error) {
                    setOutput((prevOutput) => [
                        ...prevOutput,
                        `> ${input}`,
                        `Error: ${error.message}`,
                    ]);
                } else {
                    setOutput((prevOutput) => [
                        ...prevOutput,
                        `> ${input}`,
                        'Unknown error',
                    ]);
                }
            }
        }
        setInput(''); // Limpa o campo de entrada após o comando
    };

    return (
        <div className="terminal">
            <div className="output" ref={outputRef}>
                {output.map((line, index) => (
                    <div key={index} className="line">{line}</div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <div className="input-container bg-zinc-900 p-2 h-8">
                    <span className="bash-symbol inline whitespace-nowrap">
                        {/* para mostrar o diretório atual antes do prompt: */}
                        {` ${currentPathToShow} $ `}
                    </span>
                    <input
                        ref={inputRef}
                        type="text"
                        className="input"
                        value={input}
                        onChange={handleInputChange}
                        placeholder=""
                    />
                </div>
            </form>
        </div>
    );
};

export default Terminal;
