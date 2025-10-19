import { Box, Button, Menu, MenuItem } from "@mui/material";
import { action } from "mobx";
import React from "react";
import { MouseEvent, useState } from "react";
import { useWorkspaceStore } from "storemodel/contexts";


function FileMenuButton () {
    let workspaceStore = useWorkspaceStore();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl); 

    
    const fileButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const closeFileMenu = () => {
        setAnchorEl(null);
    }
    
    return (
        <Box>
            <Button
                id="file-button"
                aria-controls={!anchorEl ? 'file-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={!anchorEl ? 'true' : undefined}
                onClick={fileButtonClick}
            >
                File
            </Button>
            <Menu
                id="file-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={closeFileMenu}
                slotProps={{
                    list: {
                        "aria-labelledby": "file-button"
                    }
                }}
            >
                <MenuItem> Download </MenuItem>
                <MenuItem> Upload </MenuItem>
            </Menu>
        </Box>
    )
}

export default FileMenuButton;