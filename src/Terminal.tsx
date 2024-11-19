import React, { useState, useRef, useEffect } from "react";
import { Command } from "./wasmHelper";
import "./styles/Terminal.scss";

export let path = "% a|hello.txt|{this is the string of here} a|hi.txt|{string hi} }";

const Terminal: React.FC = () => {
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string[]>([]);
    const [files, setFiles] = useState<string[]>(extractFileNames(path));
    const inputRef = useRef<HTMLInputElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Tab" && input.startsWith("cat ")) {
            event.preventDefault();

            const partial = input.slice(4).trim(); // Parte digitada após `cat `
            const match = files.find((file) => file.startsWith(partial)); console.log(setFiles);
            if (match) {
                setInput(`cat ${match}`);
            }
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (input.trim()) {
            if (input.trim() === "clear") {
                setOutput([]);
                setInput("");
                return;
            }

            let result = "";
            try {
                result = await Command(input, path);

                setOutput((prevOutput) => [...prevOutput, `> ${input}`, result]);
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                setOutput((prevOutput) => [...prevOutput, `> ${input}`, `Error: ${errorMessage}`]);
            }
        }

        setInput("");
    };

    return (
        <div className="terminal">
            <div className="output" ref={outputRef}>
                {output.map((line, index) => (
                    <div key={index} className="line">
                        {line}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <div className="input-container bg-zinc-900 p-2 h-8">
                    <span className="bash-symbol inline whitespace-nowrap">
                        {` uwu::  `}
                    </span>
                    <input
                        ref={inputRef}
                        type="text"
                        className="input"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder=""
                    />
                </div>
            </form>
        </div>
    );
};

export default Terminal;

// Função auxiliar para extrair nomes de arquivos do `path`
function extractFileNames(input: string): string[] {
    const regex = /a\|([\w.-]+)\|/g;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(input)) !== null) {
        matches.push(match[1]);
    }
    return matches;
}

