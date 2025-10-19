package com.hhh.avolumecommander.model.message;

public record ErrorMessage(ErrorType errorType, String message) {
    public enum ErrorType {
        ERROR,
        SECURITY_ERROR,
        IO_ERROR
    }
}
