import { useDrop } from "react-dnd";
import FileRow from "./FileRow.tsx";
import { FILE_ROW_TYPE, getUIEventHTMLTarget } from "../../types.ts";
import { FileBlockContext } from "../../storemodel/contexts.ts";
import { observer } from "mobx-react";
import { action, computed } from "mobx";
import Loading from "./Loading.tsx";
import FileBlockStore from "storemodel/FileBlockStore.ts";
import React, { MouseEvent, useRef } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { FileIcons } from "./FileIcons.tsx";
import FileBlockBar from "./FileBlockBar.tsx";


function FilesBlock({ fileBlockStore }: { fileBlockStore: FileBlockStore }) {
    const dropRef = useRef<HTMLDivElement>(null);
    const [, drop] = useDrop(() => ({
        accept: FILE_ROW_TYPE,
        drop: () => {
            fileBlockStore.endDND();
        },
        hover: () => {
            
        }
    }));
    drop(dropRef);

    const selectBlock = action((event: MouseEvent) => {
        let fileSelected = !!getUIEventHTMLTarget(event)?.closest('.file-row');
        fileBlockStore.selectBlock(fileSelected);
    });

    const isSelected = computed(() => {
        return fileBlockStore.isSelected();
    }).get();

    const goToParentDirectory = action(() => {
        fileBlockStore.changeDirectory(fileBlockStore.parentDirectory);
    });

    return (
        <FileBlockContext value={fileBlockStore}>
            <div ref={ dropRef } className="files-block" 
                onClick={selectBlock} onContextMenu={selectBlock}
                style={{borderColor: isSelected ? '' : 'gray'}}
            >
                <Typography className="block-path">{ fileBlockStore.path }</Typography>
                <Divider />
                <FileBlockBar fileBlockStore={ fileBlockStore }/>
                <Divider />
                {fileBlockStore.status !== "ready" && <Loading />}
                {fileBlockStore.status === "ready" && fileBlockStore.hasParentDirectory && (<Box className="file-row" onDoubleClick={goToParentDirectory}><Stack paddingLeft="6px" alignItems="center" direction="row" gap={0.5}>{ FileIcons.DIRECTORY_BACK } ..</Stack></Box>) }
                {fileBlockStore.status === "ready" && fileBlockStore.files.map((file) => (<FileRow key={file.name} file={file} />))}
            </div>
        </FileBlockContext>
    );
}


export default observer(FilesBlock);