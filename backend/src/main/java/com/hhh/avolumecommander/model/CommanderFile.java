package com.hhh.avolumecommander.model;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public record CommanderFile(String name, long size, Instant lastModifiedTime, CommanderFileExtension extension) {
    public CommanderFile {

    }

    public CommanderFile(String name, long size, Instant lastModifiedTime) {
        this(name, size, lastModifiedTime, CommanderFileExtension.OTHER);
    }

    public enum CommanderFileExtension {
        TEXT,
        BINARY,
        DIRECTORY,
        OTHER;

        private static final Map<String, CommanderFileExtension> EXTENSION_MAPPING = new HashMap<>();

        public static CommanderFileExtension getExtension(String extension) {
            CommanderFileExtension type = EXTENSION_MAPPING.get(extension);
            return type != null ? type : CommanderFileExtension.OTHER;
        }

        public void addExtension(String extension) {
            if (EXTENSION_MAPPING.containsKey(extension))
                throw new RuntimeException("Extension " + extension + " already mapped to "
                        + EXTENSION_MAPPING.get(extension));
            EXTENSION_MAPPING.put(extension, this);
        }

        public void addExtensions(List<String> extensions) {
            for (String extension: extensions)
                addExtension(extension);
        }
    }
}
