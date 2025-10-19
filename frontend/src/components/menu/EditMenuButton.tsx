import { ContentCopy, ContentCut, ContentPaste, Delete } from "@mui/icons-material";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import { action } from "mobx";
import { observer } from "mobx-react";
import React, { MouseEvent, useState } from "react";
import { useWorkspaceStore } from "storemodel/contexts";


function EditMenuButton () {
    let workspaceStore = useWorkspaceStore();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl); 

    
    const editButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const closeEditMenu = () => {
        setAnchorEl(null);
    }

    const closeMenuWithAction = (action: Function) => {
        return () => {
            closeEditMenu();
            action();
        };
    }

    const paste = action(() => {
        workspaceStore.paste();
    });

    const copySelected = action(() => {
        workspaceStore.copySelected();
    });

    const cutSelected = action(() => {
        workspaceStore.cutSelected();
    });

    const deleteSelected = action(() => {
        workspaceStore.deleteSelected();
    });
    
    return (
        <Box>
            <Button
                id="edit-button"
                aria-controls={!anchorEl ? 'edit-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={!anchorEl ? 'true' : undefined}
                onClick={editButtonClick}
            >
                Edit
            </Button>
            <Menu
                id="edit-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={closeEditMenu}
                slotProps={{
                    list: {
                        "aria-labelledby": "edit-button"
                    }
                }}
            >
                <MenuItem disabled={!workspaceStore.canPaste} onClick={closeMenuWithAction(paste)}><ContentPaste/> Paste </MenuItem>
                <MenuItem disabled={workspaceStore.isSelectionEmpty} onClick={closeMenuWithAction(copySelected)}><ContentCopy/> Copy </MenuItem>
                <MenuItem disabled={workspaceStore.isSelectionEmpty} onClick={closeMenuWithAction(cutSelected)}><ContentCut/> Cut </MenuItem>
                <MenuItem disabled={workspaceStore.isSelectionEmpty} onClick={closeMenuWithAction(deleteSelected)}><Delete/> Delete </MenuItem>
            </Menu>
        </Box>
    )
}

export default EditMenuButton;