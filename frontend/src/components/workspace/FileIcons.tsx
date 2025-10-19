import { DescriptionOutlined, DriveFolderUpload, Folder, InsertDriveFileOutlined, PictureInPictureOutlined } from "@mui/icons-material"
import React from "react"
import { FileExtension, FileStatus } from "storemodel/FileData"


export const FileIcons = {
    [FileExtension.DIRECTORY]: <Folder />,
    [FileExtension.TEXT]: <DescriptionOutlined />,
    [FileExtension.BINARY]: <PictureInPictureOutlined />,
    [FileExtension.DIRECTORY_BACK]: <DriveFolderUpload />,
    [FileExtension.OTHER]: <InsertDriveFileOutlined />
}

export const FileStatusColors = {
    [FileStatus.ENTITY]: "",
    [FileStatus.DELETE]: "crimson",
    [FileStatus.PASTE]: "lightgreen",
    [FileStatus.RENAME_INPUT]: "lightyellow",
    [FileStatus.RENAME_SOURCE]: "crimson",
    [FileStatus.RENAME_TARGET]: "lightgreen",
}