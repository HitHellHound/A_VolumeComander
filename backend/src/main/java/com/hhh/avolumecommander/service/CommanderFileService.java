package com.hhh.avolumecommander.service;

import com.hhh.avolumecommander.model.CommanderDirectory;
import com.hhh.avolumecommander.model.CommanderFile;
import com.hhh.avolumecommander.model.FileOperation;
import com.hhh.avolumecommander.model.exception.CommanderIOException;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Service
@PropertySource("application.properties")
public class CommanderFileService implements FileService {
    private final Path root;

    public CommanderFileService(@Value("${root.directory}") String rootPath) {
        root = Paths.get(rootPath).toAbsolutePath();
    }

    @Override
    public CommanderDirectory getFilesFromDirectory(String directory) {
        Path dirPath = resolvePath(directory);

        if (!dirPath.startsWith(root))
            throw new SecurityException("Access denied");
        if (!Files.isDirectory(dirPath))
            throw new CommanderIOException(directory + " is not a directory");

        boolean hasParentDirectory = !root.equals(dirPath);
        List<CommanderFile> commanderFiles = new ArrayList<>();
        try (Stream<Path> files = Files.list(dirPath)) {
            files.forEach(filePath -> commanderFiles.add(createCommanderFile(filePath)));
        } catch (IOException e) {
            throw new CommanderIOException("Error occurred while work  with " + directory + " directory");
        }

        return new CommanderDirectory(hasParentDirectory, commanderFiles);
    }

    @Override
    public void operateWithFile(String source, String target, FileOperation operation) {
        Path sourcePath = resolvePath(source);
        Path targetPath = resolvePath(target);

        if (!sourcePath.startsWith(root) || !targetPath.startsWith(root) || targetPath.equals(root))
            throw new SecurityException("Access denied");
        if (!Files.exists(sourcePath))
            throw new CommanderIOException("File " + source + " doesn't exist");
        if (!Files.exists(targetPath.getParent()))
            throw new CommanderIOException("Target directory " + Paths.get(target).getParent() + " doesn't exist");

        try {
            switch (operation) {
                case COPY -> Files.copy(sourcePath, targetPath);
                case FORCE_COPY -> Files.copy(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING);
                case MOVE -> Files.move(sourcePath, targetPath);
                case FORCE_MOVE -> Files.move(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING);
                case DELETE -> Files.delete(targetPath);
            }
        } catch (FileAlreadyExistsException  e) {
            throw new CommanderIOException("Error occurred when doing " + operation + " operation: target file "
                + target + " already exists. Try force operation");
        } catch (IOException e) {
            throw new CommanderIOException("Error occurred when doing " + operation + " operation");
        }
    }

    private Path resolvePath(String path) {
        path = path.startsWith("/") ? path.substring(1) : path;
        return root.resolve(path).normalize();
    }

    private CommanderFile createCommanderFile(Path filePath) {
        String name = filePath.getFileName().toString();
        long size = FileUtils.sizeOf(filePath.toFile());
        Instant lastModifiedTime = null;
        try {
            lastModifiedTime = FileUtils.lastModifiedFileTime(filePath.toFile()).toInstant();
        } catch (IOException ignored) {

        }

        CommanderFile.CommanderFileExtension type = Files.isDirectory(filePath) ?
                CommanderFile.CommanderFileExtension.DIRECTORY :
                CommanderFile.CommanderFileExtension.getExtension(
                        FilenameUtils.getExtension(name));

        return new CommanderFile(name, size, lastModifiedTime, type);
    }
}
