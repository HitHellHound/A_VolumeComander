import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { action } from "mobx";
import { observer } from "mobx-react";
import React, { FormEvent } from "react";
import { useWorkspaceStore } from "storemodel/contexts";


function RenameDialog() {
    const workspace = useWorkspaceStore();
    const renameState = workspace.fileRenameState;

    const handleClose = action(() => {
        workspace.cancelRename();
    });

    const handleSubmit = action((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        let newName = formData.get("newName")?.toString();
        if (!newName || newName == renameState?.name || newName === "")
            workspace.cancelRename();
        else
             workspace.renameFile(newName);
    });

    return (
        <Dialog open={!!renameState} onClose={ handleClose }>
            <DialogTitle>Enter new file name</DialogTitle>
            <DialogContent>
                <DialogContentText>Source: { renameState?.directory }{ renameState?.name }</DialogContentText>
                <form onSubmit={handleSubmit} id="file-rename-form">
                    <TextField 
                        autoFocus
                        required
                        margin="dense"
                        id="newName"
                        name="newName"
                        label="New name"
                        fullWidth
                        variant="standard"
                        defaultValue={ renameState?.name }
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={ handleClose }>Cancel</Button>
                <Button type="submit" form="file-rename-form">Enter</Button>
            </DialogActions>
        </Dialog>
    );
}

export default observer(RenameDialog);