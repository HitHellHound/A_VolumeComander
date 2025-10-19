import { useDrag } from "react-dnd";
import { FILE_ROW_TYPE } from "../../types.ts";
import { useFileBlockStore } from "../../storemodel/contexts.ts";
import { observer } from "mobx-react";
import { action, computed } from "mobx";
import { MouseEvent, useEffect, useRef } from "react";
import { getEmptyImage } from "react-dnd-html5-backend";
import React from "react";
import FileData, { FileExtension } from "storemodel/FileData.ts";
import { Stack, Typography } from "@mui/material";
import { FileIcons, FileStatusColors } from "./FileIcons.tsx";


function FileRow({ file }: {file: FileData}) {
    const blockStore = useFileBlockStore();
    const dragRef = useRef<HTMLDivElement>(null);

    const [, drag, dragPreview] = useDrag(() => ({
            type: FILE_ROW_TYPE,
            item: () => blockStore.beginDND(file),
            collect: (monitor) => {
                return {isDragging: monitor.isDragging()}
            },
            end: (item, monitor) => {
                if (!monitor.didDrop())
                    blockStore.cancelDND();
            }
        })
    );

    drag(dragRef);

    useEffect(() => {
        dragPreview(getEmptyImage(), { captureDraggingState: true });
    }, [dragPreview]);

    const fileClick = file.inProcess ? undefined : action((event: MouseEvent) => {
        blockStore.selectFile(file, event.ctrlKey, event.shiftKey);
    });

    const doubleClick = file.inProcess ? undefined : action(() => {
        if (file.extension === FileExtension.DIRECTORY)
            blockStore.openDirectory(file.name);
    });

    const contextMenu = file.inProcess ? undefined : action(() => {
        if (!blockStore.isFileSelected(file))
            blockStore.selectFile(file, false, false);
        else {
            blockStore.selectFile(file, true, false);
            blockStore.selectFile(file, true, false);
        }
    });

    const isSelected = computed(() => {
        return blockStore.isFileSelected(file);
    }).get();

    const isCutted = computed(() => {
        return blockStore.isFileCutted(file);
    }).get();

    return (
        <div ref={ dragRef } className={"file-row " + (isSelected ? "selected " : "")} 
            onClick={ fileClick } onDoubleClick={ doubleClick } onContextMenu={contextMenu}
            style={ {opacity: file.inProcess || isCutted ? 0.5 : 1, backgroundColor: FileStatusColors[file.status] } }
        >
            <Stack className="field" data-field="name" alignItems="center" direction="row" gap={0.5}>{ FileIcons[file.extension] } <Typography>{ file.name }</Typography></Stack>
            <Typography className="field" data-field="lastModifiedTime">{ file.lastModifiedTime.toDateString() }</Typography>
            <Typography className="field" data-field="size">{ file.sizeString }</Typography>
        </div>
    );
}

export default observer(FileRow);