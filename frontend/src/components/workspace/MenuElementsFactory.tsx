import { ContentCopy, ContentCut, ContentPaste, Delete, Edit } from "@mui/icons-material";
import { Divider, MenuItem, MenuList } from "@mui/material";
import { action } from "mobx";
import React, { UIEvent } from "react";
import { useWorkspaceStore } from "storemodel/contexts";
import WorkspaceStore from "storemodel/WorkspaceStore";

export enum MenuElement {
    PASTE,
    COPY,
    CUT,
    DELETE,

    RENAME,

    DOWNLOAD,
    UPLOAD,

    DIVIDER
}

type CloseHandler = (event?: {}, reason?: "backdropClick" | "escapeKeyDown") => void;
type ActionWraper = (action: Function) => ((event?: UIEvent) => void);
type MenuElementsFactoryProps = { elements: MenuElement[], closeHandler: CloseHandler };

function MenuElementsFactory({ elements, closeHandler }: MenuElementsFactoryProps) {
    const workspaceStore = useWorkspaceStore();

    const closeWithActionWraper = (action: Function) => {
        return () => {
            closeHandler();
            action();
        };
    }

    return (
        <MenuList dense>
            {elements.map((element, index) => {
                switch(element) {
                    case MenuElement.PASTE:
                        return <PasteMenuElement workspaceStore={workspaceStore} actionWraper={closeWithActionWraper} key={index} />;
                    case MenuElement.COPY:
                        return <CopyMenuElement workspaceStore={workspaceStore} actionWraper={closeWithActionWraper} key={index} />;
                    case MenuElement.CUT:
                        return <CutMenuElement workspaceStore={workspaceStore} actionWraper={closeWithActionWraper} key={index} />;
                    case MenuElement.DELETE:
                        return <DeleteMenuElement workspaceStore={workspaceStore} actionWraper={closeWithActionWraper} key={index} />;

                    case MenuElement.RENAME:
                        return <RenameMenuElement workspaceStore={workspaceStore} actionWraper={closeWithActionWraper} key={index} />

                    case MenuElement.DOWNLOAD:
                        return <DownloadMenuElement key={index} />;
                    case MenuElement.UPLOAD:
                        return <UploadMenuElement key={index} />;

                    case MenuElement.DIVIDER:
                        return <Divider orientation="horizontal" key={index} />;
                }
            })}
        </MenuList>
    )
}

function PasteMenuElement({ workspaceStore, actionWraper }: { workspaceStore: WorkspaceStore, actionWraper: ActionWraper }) {
    const paste = action(() => {
        workspaceStore.paste();
    });

    return (
        <MenuItem disabled={!workspaceStore.canPaste} onClick={actionWraper(paste)}><ContentPaste/> Paste </MenuItem>
    )
}

function CopyMenuElement({ workspaceStore, actionWraper }: { workspaceStore: WorkspaceStore, actionWraper: ActionWraper }) {
    const copySelected = action(() => {
        workspaceStore.copySelected();
    });

    return (
        <MenuItem disabled={workspaceStore.isSelectionEmpty} onClick={actionWraper(copySelected)}><ContentCopy/> Copy </MenuItem>
    )
}

function CutMenuElement({ workspaceStore, actionWraper }: { workspaceStore: WorkspaceStore, actionWraper: ActionWraper }) {
    const cutSelected = action(() => {
        workspaceStore.cutSelected();
    });

    return (
        <MenuItem disabled={workspaceStore.isSelectionEmpty} onClick={actionWraper(cutSelected)}><ContentCut/> Cut </MenuItem>
    )
}

function DeleteMenuElement({ workspaceStore, actionWraper }: { workspaceStore: WorkspaceStore, actionWraper: ActionWraper }) {
    const deleteSelected = action(() => {
        workspaceStore.deleteSelected();
    });

    return (
        <MenuItem disabled={workspaceStore.isSelectionEmpty} onClick={actionWraper(deleteSelected)}><Delete/> Delete </MenuItem>
    )
}

function RenameMenuElement({ workspaceStore, actionWraper }: { workspaceStore: WorkspaceStore, actionWraper: ActionWraper }) {
    const inputName = action(() => {
        workspaceStore.startRename();
    });

    return (
        <MenuItem disabled={workspaceStore.isSelectionEmpty} onClick={actionWraper(inputName)}><Edit/> Rename </MenuItem>
    )
}

function DownloadMenuElement() {
    return (
        <MenuItem> Download </MenuItem>
    )
}

function UploadMenuElement() {
    return (
        <MenuItem> Upload </MenuItem>
    )
}

export default MenuElementsFactory;