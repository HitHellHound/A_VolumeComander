import { createContext, useContext } from "react";
import FileBlockStore from "./FileBlockStore";
import WorkspaceStore from "./WorkspaceStore";

export const FileBlockContext = createContext<FileBlockStore | null>(null);
export const WorkspaceContext = createContext<WorkspaceStore | null>(null);

export const useFileBlockStore = (): FileBlockStore => {
    const data = useContext(FileBlockContext);

    if (!data) {
        throw new Error('Out of FileBlock context');
    }

    return data;
};

export const useWorkspaceStore = (): WorkspaceStore => {
    const data = useContext(WorkspaceContext);

    if (!data) {
        throw new Error('Out of Workspace context');
    }

    return data;
};