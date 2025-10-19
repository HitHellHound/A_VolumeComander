package com.hhh.avolumecommander.model.message;

import com.hhh.avolumecommander.model.FileOperation;

public record OperationMessage(String source, String target, FileOperation type) {
}
