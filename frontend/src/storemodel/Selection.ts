import { makeAutoObservable } from "mobx";
import WorkspaceStore from "./WorkspaceStore";
import FileData from "./FileData";

export default class Selection {
    workspace: WorkspaceStore;
    selectedDirectory: string | null = null;
    selectionFileBase: FileData | null = null;
    _selectedFiles: FileData[] = [];
    selectionSymbol: Symbol = Symbol();

    constructor(workspace: WorkspaceStore) {
        makeAutoObservable(this, {
            isSelected: false,
            isSameBlock: false,
            isDirectorySelected: false

        });
        this.workspace = workspace;
    }

    startSelection(file: FileData): void {
        this.clear();
        this.selectionFileBase = file;
        this._selectedFiles.push(file);
        this.selectionSymbol = Symbol();
    }

    clear(): void {
        this._selectedFiles.splice(0, this._selectedFiles.length);
        this.selectionSymbol = Symbol();
    }

    toggleSelection(file: FileData, dirPath: string): void {
        if (!this.isSameBlock(dirPath)) {
            this.startSelection(file);
            return;
        }

        this.selectionFileBase = file;
        if (this.isSelected(file, dirPath)) {
            let index = this._selectedFiles.findIndex(blockFile => blockFile.name === file.name);
            this._selectedFiles.splice(index, 1);
        } else {
            this._selectedFiles.push(file);
        }
        this.selectionSymbol = Symbol();
    }

    continuousSelection(file: FileData, dirPath: string, files: FileData[]): void {
        if (!this.isSameBlock(dirPath)) {
            this.startSelection(file);
            return;
        }
        
        this.clear();
        let selectionInterval = false;
        files.forEach(element => {
            if (element.name === file.name || element.name === this.selectionFileBase?.name)
                selectionInterval = !selectionInterval;
            if (selectionInterval || element.name === file.name || element.name === this.selectionFileBase?.name)
                this._selectedFiles.push(element);
        });
        this.selectionSymbol = Symbol();
    }

    selectBlock(path: string, fileSelected: boolean): void {
        if (!fileSelected) {
            this.clear();
            this.selectionSymbol = Symbol();
        }
        this.selectedDirectory = path;
    }

    isSelected(file: FileData, dirPath: string): boolean {
        let sameBlock = this.isSameBlock(dirPath);
        let contains = !!this._selectedFiles.find(selectedFile => selectedFile.name === file.name);
        return contains && sameBlock;
    }

    isSameBlock(path: string): boolean {
        return path === this.selectedDirectory;
    }

    isDirectorySelected(path: string): boolean {
        return this.selectedDirectory === path;
    }

    isSelectionChanged(selectionSymbol: Symbol): boolean {
        return selectionSymbol === this.selectionSymbol;
    }

    get selectedFiles(): FileData[] {
        return [...this._selectedFiles];
    }

    get isEmpty(): boolean {
        return this._selectedFiles.length === 0;
    }
}