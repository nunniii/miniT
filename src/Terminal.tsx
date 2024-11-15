import React, { useState, useRef, useEffect } from 'react';
import { executeCommand } from './wasmHelper';
import './styles/Terminal.scss';

const Terminal: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const [output, setOutput] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Coloca o foco no input assim que o componente for montado
        inputRef.current?.focus();
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // Para enviar o comando para o WebAssembly
        if (input.trim()) {
            try {
                // Chama a função call_function no WebAssembly e passa o comando
                const result = await executeCommand(input);
                setOutput([...output, `> ${input}`, result]);
            } catch (error) {
                // Afirmando que o tipo de erro é 'Error'
                if (error instanceof Error) {
                    setOutput([...output, `> ${input}`, `Error: ${error.message}`]);
                } else {
                    setOutput([...output, `> ${input}`, "Unknown error"]);
                }
            }
        }
        setInput('');  // Limpa o input após o envio do comando
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
                    {/* '$' para simular o bash*/}
                    <span className="bash-symbol">$ </span>
                    <input 
                        ref={inputRef}  // Referência para o input
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
