import React, { useState, useRef, useEffect } from 'react';
import { executeCommand } from './wasmHelper'; // Função para chamar o WebAssembly
import './styles/Terminal.scss';

const Terminal: React.FC = () => {
    const [input, setInput] = useState<string>(''); // Estado para armazenar o comando de entrada
    const [output, setOutput] = useState<string[]>([]); // Estado para armazenar a saída do terminal
    const [currentDirectory, setCurrentDirectory] = useState<string>('home'); // Diretório atual
    const inputRef = useRef<HTMLInputElement>(null); // Referência para o input

    useEffect(() => {
        inputRef.current?.focus(); // Coloca o foco no input assim que o componente é montado
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (input.trim()) {
            try {
                const result = await executeCommand(input); // Executa o comando via WebAssembly

                setOutput((prevOutput) => [
                    ...prevOutput,
                    `> ${input}`, // Exibe o comando no terminal
                    result,
                ]);

                
                if (input.startsWith('cd')) {
                    const parts = input.split(' ');
                    if (parts.length > 1) {
                        setCurrentDirectory(parts[1]);
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
            <div className="output">
                {output.map((line, index) => (
                    <div key={index} className="line">{line}</div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <span className="bash-symbol inline whitespace-nowrap">
                        {/* Mostra o diretório atual antes do prompt */}
                        {` ${currentDirectory} $ `}
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
