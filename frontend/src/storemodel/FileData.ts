import { makeAutoObservable } from "mobx";

export type FileComparator = (a: FileData, b: FileData) => number;

export enum FileExtension {
    TEXT = "TEXT",
    BINARY = "BINARY",
    DIRECTORY = "DIRECTORY",
    DIRECTORY_BACK = "DIRECTORY_BACK",
    OTHER = "OTHER"
}

export enum FileStatus {
    ENTITY = "ENTITY",
    DELETE = "DELETE",
    PASTE = "PASTE",
    RENAME_INPUT = "RENAME_INPUT",
    RENAME_SOURCE = "RENAME_SOURCE",
    RENAME_TARGET = "RENAME_TARGET"
}

const SIZE_SIGNIFICANT_DIGITS = 3;
const SIZE_TRESHOLD = 768;
const SIZE_UNITS = 1024;

enum Sizes {
    B = "B",
    KB = "KB",
    MB = "MB",
    GB = "GB",
    TB = "TB",
    PB = "PB"
}

export default class FileData {
    name: string;
    size: number;
    lastModifiedTime: Date;
    extension: FileExtension;
    status: FileStatus = FileStatus.ENTITY;

    constructor(name: string, size: number, lastModifiedTime: Date, extension: FileExtension) {
        this.name = name;
        this.size = size;
        this.lastModifiedTime = lastModifiedTime;
        this.extension = extension;
        makeAutoObservable(this);
    }

    get inProcess(): boolean {
        return this.status !== FileStatus.ENTITY;
    }

    get sizeString(): string {
        if (this.size < SIZE_TRESHOLD){
            return this.size + " " + Sizes.B;
        }
        else if (this.size < SIZE_TRESHOLD * SIZE_UNITS) {
            return (this.size / 1024).toFixed(this.size > 10 * SIZE_UNITS ? 0 : SIZE_SIGNIFICANT_DIGITS) + " " + Sizes.KB;
        }
        else if (this.size < SIZE_TRESHOLD * SIZE_UNITS ** 2) {
            return (this.size / (1024 * 1024)).toFixed(this.size > 10 * SIZE_UNITS ** 2 ? 0 : SIZE_SIGNIFICANT_DIGITS) + " " + Sizes.MB;
        }
        return (this.size / (1024 * 1024 * 1024)).toFixed(this.size > 10 * SIZE_UNITS ** 3 ? 0 : SIZE_SIGNIFICANT_DIGITS) + " " + Sizes.GB;
    }

    static copy(file: FileData): FileData {
        return new FileData(file.name, file.size, file.lastModifiedTime, file.extension);
    }
}

