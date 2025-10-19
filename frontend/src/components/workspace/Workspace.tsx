import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { observer } from "mobx-react";
import { MouseEvent, useEffect, useState } from "react";
import { useWorkspaceStore } from "../../storemodel/contexts.ts";
import React from "react";
import { Box, PopoverPosition, Toolbar } from "@mui/material";
import { MENUBAR_HEIGHT } from "../menu/MenuBar.tsx";
import FileDragPreview from "./FileDragPreview.tsx";
import FilesBlock from "./FilesBlock.tsx";
import { getUIEventHTMLTarget } from "types.ts";
import ContextMenu, { ContextMenuType } from "./ContexMenu.tsx";
import RenameDialog from "./RenameDialog.tsx";


function Workspace() { 
    const workspace = useWorkspaceStore();
    const [contextMenuAnchor, setContextMenuAnchor] = useState<PopoverPosition | null>(null);
    const [contextMenuType, setContextMenuType] = useState<ContextMenuType>(ContextMenuType.FILE_BLOCK);

    const handleContextMenu = (event: MouseEvent) => {
        event.preventDefault();

        if (contextMenuAnchor !== null) {
            onContextMenuClose();
            return;
        }

        if (!!getUIEventHTMLTarget(event)?.closest('.file-row')) {
            setContextMenuType(ContextMenuType.FILE_ROW);
        } else if (getUIEventHTMLTarget(event)?.matches('.files-block')) {
            setContextMenuType(ContextMenuType.FILE_BLOCK);
        } else {
            setContextMenuAnchor(null);
            return;
        }

        setContextMenuAnchor({top: event.clientY, left: event.clientX});
    }

    const onContextMenuClose = () => {
        if (document.activeElement instanceof HTMLElement) {
            (document.activeElement as HTMLElement).blur();
        }
        setContextMenuAnchor(null);
    }

    useEffect(() => {
        workspace.addFileBlock("/");
        workspace.addFileBlock("/");
        return () => workspace.clear();
    }, [workspace]);

    return (
        <Box position="fixed"
            onContextMenu={handleContextMenu}
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                width: '100vw'
            }}
        >
            <Toolbar sx={{ minHeight: "unset", height: MENUBAR_HEIGHT }} variant="dense"/>
            <DndProvider backend={HTML5Backend}>
                <div className="workspace">
                    
                        {workspace.fileBLocks.map((blockStore, index) => (<FilesBlock fileBlockStore={blockStore} key={index}/>))}
                    
                </div>
                <FileDragPreview />
            </DndProvider>
            <ContextMenu menuType={contextMenuType} positionAnchor={contextMenuAnchor} onClose={onContextMenuClose}/>
            <RenameDialog />
        </Box>
    );
}

export default observer(Workspace);