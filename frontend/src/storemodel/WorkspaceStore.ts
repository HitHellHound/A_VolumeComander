import { makeAutoObservable } from "mobx";
import FileBlockStore from "./FileBlockStore.ts";
import FileDirectory from "./FileDirectory.ts";
import Buffer from "./Buffer.ts";
import Selection from "./Selection.ts";
import FileData, { FileStatus } from "./FileData.ts";
import { parseFilePath } from "utils.ts";

type Operation = {source: string, target: string, type: OperationType};

type OperationResult = {source: string, target: string, type: OperationResultType, message: string}

enum OperationType {
    COPY = "COPY",
    FORCE_COPY = "FORCE_COPY",
    MOVE = "MOVE",
    FORCE_MOVE = "FORCE_MOVE",
    DELETE = "DELETE"
}

enum OperationResultType {
    OK = "OK",
    ERROR = "ERROR"
}

type ServerProceesedTulpe = [Map<string, Map<string, string>>, Map<string, Map<string, string>>];

export default class WorkspaceStore {
    fileDirectories: Map<string, FileDirectory> = new Map();
    fileBLocks: FileBlockStore[] = [];
    selection: Selection;
    buffer: Buffer;
    fileRenameState: { directory: string, name: string } | null = null;

    constructor() {
        makeAutoObservable(this);
        this.selection = new Selection(this);
        this.buffer = new Buffer();
    }

    getFileDirectory(path: string): FileDirectory {
        let fileDir = this.fileDirectories.get(path);
        if (!fileDir) {
            fileDir = new FileDirectory(path);
            this.fileDirectories.set(path, fileDir);
        }
        return fileDir;
    }

    addFileBlock(path: string) {
        this.fileBLocks.push(new FileBlockStore(path, this));
    }

    dragNDrop(file: FileData, sourceDir: string, destinationDir: string) {
        if (sourceDir === destinationDir)
            return;
        this.getFileDirectory(sourceDir).delete(file);
        this.getFileDirectory(destinationDir).add(file);
    }

    *paste() {
        if (this.buffer.isEmpty || 
            this.selection.selectedDirectory === this.buffer.sourceDirectory) {
            return;
        }

        let operationType = this.buffer.status === "copied" ? OperationType.COPY : OperationType.MOVE;
        let operations: Operation[] = [];
        let operatedFileNames = new Set<string>();
        let sourceDir: string = this.buffer.sourceDirectory!;
        let targetDir: string = this.selection.selectedDirectory!;

        for (let file of this.buffer.bufferedFiles) {
            operatedFileNames.add(file.name);

            this.fileDirectories.get(targetDir)?.add(FileData.copy(file));

            operations.push({
                source: sourceDir + file.name,
                target: targetDir + file.name,
                type: operationType
            });
        }

        this.fileDirectories.get(targetDir)?.startOperation(operatedFileNames, FileStatus.PASTE);
        if (operationType === OperationType.MOVE) {
            this.fileDirectories.get(sourceDir)?.startOperation(operatedFileNames, FileStatus.DELETE);
        }

        this.buffer.clear();
        let bufferSymbol = this.buffer.bufferSymbol;
        this.selection.clear();
        let selectionSymbol = this.selection.selectionSymbol;

        let commitedOps: Map<string, Map<string, string>>;
        let rollbackOps: Map<string, Map<string, string>>;
        try {
            [commitedOps, rollbackOps] = yield this.processOperations(operations);
        } catch (error) {
            console.log(error);
            this.fileDirectories.get(sourceDir)?.finishOperations(operatedFileNames, true);
            this.fileDirectories.get(targetDir)?.finishOperations(operatedFileNames, true);
            return;
        }

        if ([...rollbackOps.entries()].length > 0){
            [...rollbackOps.entries()].forEach(cause => console.log(cause));
        }

        if (this.selection.isSelectionChanged(selectionSymbol) && this.buffer.isBufferChanged(bufferSymbol)) {
            if (this.fileDirectories.has(targetDir) && commitedOps.has(targetDir)) {
                let fileDir = this.fileDirectories.get(targetDir)!;
                [...(commitedOps.get(targetDir)?.keys()!)].forEach(fileName => 
                    this.selection.toggleSelection(fileDir.getFile(fileName)!, targetDir))
            }
            //TODO Buffer
        }
    }

    *renameFile(newFileName: string) {
        if (!this.fileRenameState)
            return;
        const sourceDir = this.fileRenameState.directory;
        const oldName = this.fileRenameState.name;
        this.fileRenameState = null;


        let operation: Operation = {
            source: sourceDir + oldName,
            target: sourceDir + newFileName,
            type: OperationType.MOVE
        };

        const originalFile = this.fileDirectories.get(sourceDir)!.getFile(oldName)!;
        const renamedCopy = FileData.copy(originalFile);
        renamedCopy.name = newFileName;

        this.fileDirectories.get(sourceDir)?.add(renamedCopy);

        this.fileDirectories.get(sourceDir)?.startOperation(new Set([oldName]), FileStatus.DELETE);
        this.fileDirectories.get(sourceDir)?.startOperation(new Set([newFileName]), FileStatus.PASTE);

        const operatedFileNames = new Set([originalFile.name, newFileName])

        this.fileRenameState = null;
        this.buffer.clear();
        let bufferSymbol = this.buffer.bufferSymbol;
        this.selection.clear();
        let selectionSymbol = this.selection.selectionSymbol;

        let commitedOps: Map<string, Map<string, string>>;
        let rollbackOps: Map<string, Map<string, string>>;
        try {
            [commitedOps, rollbackOps] = yield this.processOperations([operation]);
        } catch (error) {
            console.log(error);
            this.fileDirectories.get(sourceDir)?.finishOperations(operatedFileNames, true);
            return;
        }

        if ([...rollbackOps.entries()].length > 0){
            [...rollbackOps.entries()].forEach(cause => console.log(cause));
        }
    }

    *deleteSelected() {
        let operations: Operation[] = [];
        let operatedFileNames = new Set<string>();
        let targetDir: string = this.selection.selectedDirectory!;

        for (let file of this.selection.selectedFiles) {
            operatedFileNames.add(file.name);

            operations.push({
                source: targetDir + file.name,
                target: targetDir + file.name,
                type: OperationType.DELETE
            });
        }

        this.fileDirectories.get(targetDir)?.startOperation(operatedFileNames, FileStatus.DELETE);
        
        this.selection.clear();
        let selectionSymbol = this.selection.selectionSymbol;

        let commitedOps: Map<string, Map<string, string>>;
        let rollbackOps: Map<string, Map<string, string>>;

        try {
            [commitedOps, rollbackOps] = yield this.processOperations(operations);
        } catch (error) {
            console.log(error);
            this.fileDirectories.get(targetDir)?.finishOperations(operatedFileNames, true);
            return;
        }

        if ([...rollbackOps.entries()].length > 0){
            [...rollbackOps.entries()].forEach(cause => console.log(cause));
            if (this.selection.isSelectionChanged(selectionSymbol) && this.fileDirectories.has(targetDir)) {
                let fileDir = this.fileDirectories.get(targetDir)!;
                [...(rollbackOps.get(targetDir)?.keys()!)].forEach(fileName => 
                    this.selection.toggleSelection(fileDir.getFile(fileName)!, targetDir))
            }
        }
    }

    async processOperations(operations: Operation[]): Promise<ServerProceesedTulpe> {
        console.log(JSON.stringify(operations))
        const response: Response = await fetch("/commander", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(operations)
        });

        let resu = await new Promise<number>(res => setTimeout(() => res(200), 1000));

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }

        const results: OperationResult[] =  await response.json();

        const commitedOps = new Map<string, Map<string, string>>();
        const rollbackOps = new Map<string, Map<string, string>>();

        for (let result of results) {
            let resultMap: Map<string, Map<string, string>>;
            if (result.type === OperationResultType.OK) {
                resultMap = commitedOps;
            } else {
                resultMap = rollbackOps;
            }

            if (result.source) {
                let [sourceDir, sourceFile] = parseFilePath(result.source);
                if (!resultMap.has(sourceDir)) resultMap.set(sourceDir, new Map<string, string>());
                resultMap.get(sourceDir)?.set(sourceFile, result.message);
            }

            if (result.target) {
                let [targetDir, targetFile] = parseFilePath(result.target);
                if (!resultMap.has(targetDir)) resultMap.set(targetDir, new Map<string, string>());
                resultMap.get(targetDir)?.set(targetFile, result.message);
            }
        }

        [...commitedOps.entries()].forEach(entry => {
            if (this.fileDirectories.has(entry[0])) {
                console.log();
                this.fileDirectories.get(entry[0])?.finishOperations(new Set(entry[1].keys()));
            }
        });
        [...rollbackOps.entries()].forEach(entry => {
            if (this.fileDirectories.has(entry[0])) {
                this.fileDirectories.get(entry[0])?.finishOperations(new Set(entry[1].keys()), true);
            }
        });

        return [commitedOps, rollbackOps];
    }

    startRename() {
        if (this.selection.selectionFileBase === null || this.selection.selectedDirectory === null)
            return;

        this.selection.selectionFileBase!.status = FileStatus.RENAME_INPUT;
        this.fileRenameState = { directory: this.selection.selectedDirectory!, name: this.selection.selectionFileBase!.name };
    }

    cancelRename() {
        if (!this.fileRenameState)
            return;

        this.fileDirectories.get(this.fileRenameState.directory)!.getFile(this.fileRenameState.name)!.status = FileStatus.ENTITY;
        this.fileRenameState = null;
    }

    copySelected() {
        this.buffer.fillBuffer(this.selection.selectedFiles, this.selection.selectedDirectory as string, "copied");
    }

    cutSelected() {
        this.buffer.fillBuffer(this.selection.selectedFiles, this.selection.selectedDirectory as string, "cutted");
    }

    get isSelectionEmpty(): boolean {
        return this.selection.isEmpty;
    }

    get canPaste(): boolean {
        let isBufferEmpty = this.buffer.isEmpty;
        let isDirectorySelected = !!this.selection.selectedDirectory
        return !isBufferEmpty && isDirectorySelected;
    }

    clear() {
        this.fileDirectories.clear();
        this.fileBLocks.splice(0, this.fileBLocks.length);
        this.selection.clear();
        this.buffer.clear();
    }
};

