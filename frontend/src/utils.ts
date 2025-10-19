
export const DIRECTORY_SEPARATOR: string = '/';

export function parseFilePath(path: string): [string, string] {
    const name: string = path.slice(path.lastIndexOf(DIRECTORY_SEPARATOR) + 1);
    const directory: string = path.slice(0, path.length - name.length);
    return [directory, name]
}

export function getParentDirectory(path: string): string {
    let [dir, file] = parseFilePath(path);
    if (file !== "") return dir;
    return parseFilePath(dir.slice(0, dir.length - 1))[0];
}