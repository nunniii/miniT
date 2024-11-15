import React, { useState } from 'react';
import { executeCommand } from './wasmHelper';
import './styles/Terminal.scss';

const Terminal: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const [output, setOutput] = useState<string[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // para enviar o comando para o WebAssembly
        if (input.trim()) {
            try {
                // chama a função call_function no WebAssembly e passa o comando
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
        setInput('');
    };
    

    return (
        <div className="terminal">
            <div className="output">
                {output.map((line, index) => (
                    <div key={index} className="line">{line}</div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="input"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Digite um comando"
                />
            </form>
        </div>
    );
};

export default Terminal;
