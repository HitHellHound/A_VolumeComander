import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { Box, Button, Divider } from "@mui/material";
import { action } from "mobx";
import React, { MouseEvent } from "react";
import FileBlockStore, { SortFileld } from "storemodel/FileBlockStore";
import { getUIEventHTMLTarget } from "types";


function FileBlockBar({ fileBlockStore }: { fileBlockStore: FileBlockStore }) {
    const changeSortFileld = action((event: MouseEvent) => {
        const button = getUIEventHTMLTarget(event)?.closest<HTMLElement>(".sort-button");
        if (!button)
            return;
        fileBlockStore.changeSortFileld(button.dataset.field as unknown as SortFileld);
    });

    return (
        <Box className="sort-bar">
            <Button 
                startIcon={fileBlockStore.sortField === "name" && (fileBlockStore.sortAscending ? <ArrowDownward /> : <ArrowUpward />)} 
                className="field sort-button" onClick={changeSortFileld} data-field="name" title="Name" 
            >
                Name 
            </Button>
            <Divider orientation="vertical" flexItem />
            <Button 
                startIcon={fileBlockStore.sortField === "lastModifiedTime" && (fileBlockStore.sortAscending ? <ArrowDownward /> : <ArrowUpward />)}
                className="field sort-button" onClick={changeSortFileld} data-field="lastModifiedTime" title="Last Modified Time" 
            >
                Last Modified Time
            </Button>
            <Divider orientation="vertical" flexItem />
            <Button 
                startIcon={fileBlockStore.sortField === "size" && (fileBlockStore.sortAscending ? <ArrowDownward /> : <ArrowUpward />)}
                className="field sort-button" onClick={changeSortFileld} data-field="size" title="Size" 
            >
                Size
            </Button>
        </Box>
    )
}

export default FileBlockBar;