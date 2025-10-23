package com.hhh.avolumecommander.controler;

import com.hhh.avolumecommander.model.CommanderDirectory;
import com.hhh.avolumecommander.model.FileOperation;
import com.hhh.avolumecommander.model.exception.CommanderIOException;
import com.hhh.avolumecommander.model.message.OperationMessage;
import com.hhh.avolumecommander.model.message.ErrorMessage;
import com.hhh.avolumecommander.model.message.OperationResultMessage;
import com.hhh.avolumecommander.service.FileService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/commander")
public class CommanderController {
    public static final String COMMANDER_PATH = "/commander";

    @Autowired
    private FileService fileService;

    @GetMapping("**")
    public CommanderDirectory getDirectoryData(HttpServletRequest request) {
        String directoryPath = request.getRequestURI().substring(COMMANDER_PATH.length());
        return fileService.getFilesFromDirectory(directoryPath);
    }

    @PostMapping
    public List<OperationResultMessage> operateFiles(@RequestBody List<OperationMessage> operations) {
        List<OperationResultMessage> results = new ArrayList<>();
        for (OperationMessage operation: operations) {
            OperationResultMessage result;
            try {
                fileService.operateWithFile(operation.source(), operation.target(), operation.type());
                result = OperationResultMessage.buildSuccessResultMessage(operation);
            } catch (SecurityException | CommanderIOException exception) {
                result = OperationResultMessage.buildErrorResultMessage(operation, exception.getMessage());
            } catch (Exception exception) {
                result = OperationResultMessage.buildErrorResultMessage(operation, "Error occurred");
            }
            results.add(result);
        }
        return results;
    }

    @DeleteMapping("**")
    public void deleteFile(HttpServletRequest request) {
        String filePath = request.getRequestURI().substring(COMMANDER_PATH.length());
        fileService.operateWithFile("", filePath, FileOperation.DELETE);
    }

    @ExceptionHandler(SecurityException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorMessage securityExceptionHandler(Exception exception) {
        return new ErrorMessage(ErrorMessage.ErrorType.SECURITY_ERROR, exception.getMessage());
    }

    @ExceptionHandler(CommanderIOException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorMessage ioExceptionHandler(CommanderIOException exception) {
        return new ErrorMessage(ErrorMessage.ErrorType.IO_ERROR, exception.getMessage());
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorMessage defaultExceptionHandler() {
        return new ErrorMessage(ErrorMessage.ErrorType.ERROR, "Error occurred");
    }
}
