package com.hhh.avolumecommander.config;

import com.hhh.avolumecommander.model.CommanderFile;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import java.util.List;
import java.util.Map;

@Configuration
@PropertySource("application.properties")
public class CommanderConfiguration {
    @Value("#{${extension.mapping}}")
    private Map<String, List<String>> extensionMapping;

    @PostConstruct
    public void intiExtensions() {
        for (Map.Entry<String, List<String>> typeToExtensions: extensionMapping.entrySet()) {
            CommanderFile.CommanderFileExtension.valueOf(typeToExtensions.getKey()).addExtensions(typeToExtensions.getValue());
        }
    }
}
