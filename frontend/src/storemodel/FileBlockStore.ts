import { makeAutoObservable, runInAction} from "mobx";
import WorkspaceStore from "./WorkspaceStore";
import { FileDirectoryStatus } from "./FileDirectory";
import FileData, { FileComparator, FileExtension } from "./FileData";
import { DIRECTORY_SEPARATOR, getParentDirectory } from "utils";

export default class FileBlockStore {
    path: string;
    workspace: WorkspaceStore;

    sortField: SortFileld = null;
    sortAscending: boolean = true;

    constructor(path: string, workspace: WorkspaceStore) {
        this.path = path;
        this.workspace = workspace;
        makeAutoObservable(this);
    }

    //Selection

    selectFile(file: FileData, ctrlKeyPressed: boolean, shiftKeyKeyPressed: boolean): void {
        if (shiftKeyKeyPressed)
            this.workspace.selection.continuousSelection(file, this.path, this.files);
        else if (ctrlKeyPressed)
            this.workspace.selection.toggleSelection(file, this.path);
        else
            this.workspace.selection.startSelection(file);
    }

    isFileSelected(file: FileData): boolean {
        return this.workspace.selection.isSelected(file, this.path);
    }

    selectBlock(fileSelected: boolean): void {
        this.workspace.selection.selectBlock(this.path, fileSelected);
    }

    isSelected(): boolean {
        return this.workspace.selection.isDirectorySelected(this.path);
    }

    //DND

    beginDND(file: FileData): DNDFileItem {
        runInAction(() => {
            if (!this.isFileSelected(file)) {
                this.workspace.selection.startSelection(file);
                this.selectBlock(true);
            }
            this.workspace.cutSelected();
        });
        const item = {
            files: this.workspace.selection.selectedFiles
        };
        return item;
    }

    endDND(): void {
        if (this.path !== this.workspace.buffer.sourceDirectory) {
            this.selectBlock(false);
            this.workspace.paste();
        }
        this.workspace.buffer.clear();
    }

    cancelDND(): void {
        this.workspace.buffer.clear();
    }

    //Buffer

    isFileCutted(file: FileData): boolean {
        return this.workspace.buffer.isCutted(file, this.path);
    }

    //FileDirectory

    deleteFile(file: FileData): void {
        this.workspace.selection.startSelection(file);
        this.workspace.deleteSelected();
    }

    openDirectory(directioryName: string): void {
        this.changeDirectory(this.path + directioryName + '/');
    }

    changeDirectory(newPath: string): void {
        this.path = newPath;
        this.selectBlock(false);
    }

    get parentDirectory(): string {
        return getParentDirectory(this.path);
    }

    get hasParentDirectory(): boolean {
        return this.path !== DIRECTORY_SEPARATOR;
    }

    get status(): FileDirectoryStatus {
        return this.workspace.getFileDirectory(this.path).status;
    }

    get files(): FileData[] {
        return this.workspace.getFileDirectory(this.path).filesArray.slice().sort(this.comparator);
    }

    //Sort

    changeSortFileld(field: SortFileld): void {
        if (field === this.sortField)
            this.sortAscending = !this.sortAscending;
        else {
            this.sortField = field;
            this.sortAscending = true;
        }
    }

    get comparator(): FileComparator {
        const ascendingMult = this.sortAscending ? -1 : 1;
        switch(this.sortField) {
            case "name":
                return (fileA: FileData, fileB: FileData) => {
                    return ascendingMult * fileA.name.localeCompare(fileB.name);
                }
            case "size":
                return (fileA: FileData, fileB: FileData) => {
                    return ascendingMult * (fileA.size - fileB.size);
                }
            case "lastModifiedTime":
                return (fileA: FileData, fileB: FileData) => {
                    return ascendingMult * (fileA.lastModifiedTime.getTime() - fileB.lastModifiedTime.getTime());
                }
            default:
                return (fileA: FileData, fileB: FileData) => {
                    if ((fileA.extension === FileExtension.DIRECTORY && fileB.extension === FileExtension.DIRECTORY) ||
                        (fileA.extension !== FileExtension.DIRECTORY && fileB.extension !== FileExtension.DIRECTORY)) {
                            return fileA.name.localeCompare(fileB.name);
                    } else if (fileA.extension === FileExtension.DIRECTORY) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
        }
    }
}

export type SortFileld = "name" | "size" | "lastModifiedTime" | null;
export type DNDFileItem = { files: FileData[] };