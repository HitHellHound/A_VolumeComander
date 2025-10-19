package com.hhh.avolumecommander.service;

import com.hhh.avolumecommander.model.CommanderDirectory;
import com.hhh.avolumecommander.model.FileOperation;

public interface FileService {
    CommanderDirectory getFilesFromDirectory(String directory);
    void operateWithFile(String source, String target, FileOperation operation);
}
