import { usePreview } from "react-dnd-preview";
import { FILE_ROW_TYPE } from "../../types.ts";
import { CSSProperties, memo, useLayoutEffect, useRef, useState } from "react";
import React from "react";
import { usePreviewStateFull } from "react-dnd-preview/dist/usePreview";
import { DNDFileItem } from "storemodel/FileBlockStore.ts";
import FileData from "storemodel/FileData.ts";
import { Stack, Typography } from "@mui/material";
import { FileIcons } from "./FileIcons.tsx";

const FILES_TO_SHOW = 5;
const ELEMENT_DISPLACEMENT = 4;
const BASE_Z_INDEX = 1000;

function FileDragPreview() {
    const {display, itemType, item, style, ref} = usePreview() as usePreviewStateFull<DNDFileItem, HTMLDivElement>;
    if (!display || itemType !== FILE_ROW_TYPE) {
        return null;
    }
    return (
        <div style={ style } ref={ ref }>
            <FilesPreview files={item.files} />
        </div>
    );
}

const FilesPreview = memo(function ({ files }: {files: FileData[]}) {
    const [size, setSize] = useState({width: 0, height: 0});
    const mainDndFileRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        const computedStyles = window.getComputedStyle(mainDndFileRef.current!);
        const xPaddings = parseFloat(computedStyles.paddingLeft) + parseFloat(computedStyles.paddingRight);
        const yPaddings = parseFloat(computedStyles.paddingTop) + parseFloat(computedStyles.paddingBottom);
        setSize({width: mainDndFileRef.current!.clientWidth - xPaddings, height: mainDndFileRef.current!.clientHeight - yPaddings});
    }, [])

    let filesComponents = files.slice(0, Math.min(files.length, FILES_TO_SHOW)).map((file, index) => {
            const fileStyle: CSSProperties = {
                position: 'absolute',
                opacity: Math.max(1 - index * (1 / FILES_TO_SHOW), 0),
                zIndex: BASE_Z_INDEX - index,
                left: `${ index * ELEMENT_DISPLACEMENT }px`,
                top: `${ index * ELEMENT_DISPLACEMENT }px`
            };
            if (index !== 0) {
                fileStyle.width = size.width;
                fileStyle.height = size.height;
                return (<div className="file-drag-preview" key={index} style={fileStyle} />);
            }
            return (
                <div className="file-drag-preview" key={ index } style={ fileStyle } ref={ mainDndFileRef }>
                    <Typography><Stack alignItems="center" direction="row" gap={0.5}>{ FileIcons[file.extension] }{ file.name }</Stack></Typography>
                </div>
            );
        });
    return filesComponents;
}) 

export default FileDragPreview;