import React from "react";
import { AppBar, Box, Button, Toolbar } from "@mui/material";
import EditMenuButton from "./EditMenuButton.tsx";
import FileMenuButton from "./FileMenuButton.tsx";

export const MENUBAR_HEIGHT = 25;

function MenuBar() {

    return (
        <Box>
            <AppBar position="fixed" color="inherit">
                <Toolbar 
                    sx={{ 
                        minHeight: "unset", 
                        height: MENUBAR_HEIGHT,
                        px: '0 !important',
                        "& .MuiButton-root": {
                            minHeight: 0,
                            height: "100%",
                            py:0,
                            textTransform: "none"
                        }
                    }} 
                    variant="dense"
                >
                    <Box component="img" src="/logo512x182.png" alt="AVC Logo" sx={{height: MENUBAR_HEIGHT}}/>
                    <FileMenuButton />
                    <EditMenuButton />
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default MenuBar;