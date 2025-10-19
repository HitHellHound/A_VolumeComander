package com.hhh.avolumecommander.model;

import java.util.List;

public record CommanderDirectory(boolean hasParentDirectory, List<CommanderFile> files) {
}
