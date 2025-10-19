package com.hhh.avolumecommander.model.message;

public record OperationResultMessage(ResultType type, String source, String target, String message) {

    public OperationResultMessage {

    }

    public OperationResultMessage(ResultType type, String source, String target) {
        this(type, source, target, "");
    }

    public OperationResultMessage(ResultType type, OperationMessage operation) {
        this(type, operation.source(), operation.target(), "");
    }

    public OperationResultMessage(ResultType type, OperationMessage operation, String message) {
        this(type, operation.source(), operation.target(), message);
    }

    public static OperationResultMessage buildSuccessResultMessage(OperationMessage operation) {
        return new OperationResultMessage(ResultType.OK, operation);
    }

    public static OperationResultMessage buildErrorResultMessage(OperationMessage operation, String message) {
        return new OperationResultMessage(ResultType.ERROR, operation, message);
    }

    public enum ResultType {
        OK,
        ERROR
    }
}
