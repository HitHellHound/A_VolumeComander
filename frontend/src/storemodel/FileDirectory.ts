import { makeAutoObservable, observable } from "mobx";
import FileData, { FileExtension, FileStatus } from "./FileData";

export default class FileDirectory {
    private _files: Map<string, FileData> = new Map();
    status: FileDirectoryStatus = "created";
    path: string;

    constructor(path: string) {
        this.path = path;
        makeAutoObservable(this, {
            has: false
        });
        this.fetchFiles();
    }

    add(file: FileData): void {
        this._files.set(file.name, file);
    }

    delete(file: FileData): any {
        this._files.delete(file.name);
    }

    has(fileName: string): boolean {
        return this._files.has(fileName);
    }

    get filesArray(): FileData[] {
        return [...this._files.values()];
    }

    getFile(fileName: string): FileData | undefined {
        return this._files.get(fileName);
    }
    
    changePath(newPath: string): void {
        this.path = newPath;
    }

    startOperation(fileNames: Set<string>, operation: FileStatus) {
        console.log(fileNames)
        this.filesArray.filter(file => fileNames.has(file.name))
            .forEach(file => file.status = operation);
    }

    finishOperations(fileNames: Set<string>, rollback: boolean = false): void {
        this.filesArray.filter(file => fileNames.has(file.name))
            .forEach(file => {
                if ((file.status === FileStatus.DELETE && !rollback) || (file.status === FileStatus.PASTE && rollback)) {
                    this.delete(file);
                }
                file.status = FileStatus.ENTITY;
            });
    }

    *fetchFiles(): any {
        this.status = 'fetching';
        const response = yield fetch("/commander" + this.path);
        const data = yield response.json();
        this._files = observable(this.makeFilesMap(data.files));
        this.status = 'ready';
    }

    private makeFilesMap(filesArr: any): Map<string, FileData> {
        const files = new Map<string, FileData>();
        for (let file of filesArr) {
            files.set(file.name, new FileData(file.name, file.size, 
                new Date(file.lastModifiedTime),
                FileExtension[file.extension as keyof typeof FileExtension]));
        }
        return files;
    }
}

export type FileDirectoryStatus = "created" | "fetching" | "ready";