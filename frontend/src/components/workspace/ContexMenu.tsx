import { Menu, MenuItem, PopoverPosition } from "@mui/material";
import React from "react";
import { useWorkspaceStore } from "storemodel/contexts";
import MenuElementsFactory, { MenuElement } from "./MenuElementsFactory";


export enum ContextMenuType {
    FILE_ROW = "File Row",
    FILE_BLOCK = "File Block"
}

export type ContextMenuProps = { 
    menuType: ContextMenuType, 
    positionAnchor: PopoverPosition | null, 
    onClose: () => void
}

const CONTEXT_MENUS = {
    [ContextMenuType.FILE_ROW]: [
        MenuElement.COPY, 
        MenuElement.CUT, 
        MenuElement.DELETE, 
        MenuElement.DIVIDER, 
        MenuElement.RENAME, 
        MenuElement.DIVIDER, 
        MenuElement.DOWNLOAD
    ],
    [ContextMenuType.FILE_BLOCK]: [
        MenuElement.PASTE,
        MenuElement.DIVIDER, 
        MenuElement.UPLOAD
    ]
}

function ContextMenu({ menuType, positionAnchor, onClose }: ContextMenuProps) {
    const workspace = useWorkspaceStore();
    const open = Boolean(positionAnchor);

    return (
        <Menu
            open={open}
            onClose={onClose}
            anchorReference="anchorPosition"
            anchorPosition={positionAnchor !== null ? positionAnchor : undefined}
        >
            <MenuElementsFactory elements={CONTEXT_MENUS[menuType]} closeHandler={onClose} />
        </Menu>
    )
}

export default ContextMenu;