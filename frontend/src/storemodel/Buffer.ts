import { makeAutoObservable } from "mobx";
import FileData from "./FileData";

export default class Buffer {
    status: BufferStatus = "empty";
    sourceDirectory: string | null = null;
    _bufferedFiles: FileData[] = [];
    bufferSymbol: Symbol = Symbol();

    constructor() {
        makeAutoObservable(this);
    }

    fillBuffer(files: FileData[], path: string, operation: BufferStatus): void {
        this.clear();
        this._bufferedFiles.push(...files);
        this.sourceDirectory = path;
        this.status = operation;
        this.bufferSymbol = Symbol();
    }

    isCutted(file: FileData, directory: string): boolean {
        if (this.status === "cutted" && this.sourceDirectory === directory)
            return !!this._bufferedFiles.find(bufferedFile => bufferedFile.name === file.name);
        else
            return false;
    }

    get bufferedFiles(): FileData[] {
        return [...this._bufferedFiles];
    }

    clear(): void {
        this._bufferedFiles.splice(0, this._bufferedFiles.length);
        this.sourceDirectory = null;
        this.status = "empty";
        this.bufferSymbol = Symbol();
    }

    get isEmpty(): boolean {
        return this._bufferedFiles.length === 0;
    }

    isBufferChanged(bufferSymbol: Symbol): boolean {
        return bufferSymbol === this.bufferSymbol;
    }
}

export type BufferStatus = "empty" | "copied" | "cutted";