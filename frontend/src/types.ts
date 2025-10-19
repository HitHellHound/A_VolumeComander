import { UIEvent } from "react";

export const FILE_ROW_TYPE = 'FileRow';
export function getUIEventHTMLTarget(event: UIEvent): HTMLElement | null {
    if (event.target instanceof HTMLElement){
        return event.target;
    }
    return null;
}