# Adding a New Command

This guide explains how to add a new Gradle task (command) to the Clean Architecture Generator plugin.

## Overview

Adding a new command involves creating three main components following Clean Architecture principles:

1. **Gradle Task** (Input Adapter) - Receives user input
2. **Use Case** (Application Layer) - Contains business logic
3. **Generator** (Application Layer) - Generates files from templates

## Architecture Flow

```
User Command (Gradle)
    ↓
Gradle Task (Input Adapter)
    ↓
Use Case (Application Logic)
    ↓
Generator (Template Processing)
    ↓
File System (Output Adapter)
```

## Example: Adding `generateDTO` Command

Let's create a command to generate Data Transfer Objects (DTOs).

### Step 1: Create Domain Model

Define the configuration model for your command.

**File:** `src/main/java/com/pragma/archetype/domain/model/DTOConfig.java`

```java
package com.pragma.archetype.domain.model;

import java.util.List;

/**
 * Configuration for DTO generation.
 */
public record DTOConfig(
    String name,
    String packageName,
    List<DTOField> fields,
    DTOType type
) {

    public record DTOField(
        String name,
        String type,
        boolean required
    ) {}

    public enum DTOType {
        REQUEST,
        RESPONSE,
        BOTH
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String name;
        private String packageName;
        private List<DTOField> fields;
        private DTOType type = DTOType.BOTH;

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder packageName(String packageName) {
            this.packageName = packageName;
            return this;
        }

        public Builder fields(List<DTOField> fields) {
            this.fields = fields;
            return this;
        }

        public Builder type(DTOType type) {
            this.type = type;
            return this;
        }

        public DTOConfig build() {
            return new DTOConfig(name, packageName, fields, type);
        }
    }
}
```

### Step 2: Create Use Case Port (Interface)

Define the contract for your use case.

**File:** `src/main/java/com/pragma/archetype/domain/port/in/GenerateDTOUseCase.java`

```java
package com.pragma.archetype.domain.port.in;

import java.nio.file.Path;
import java.util.List;

import com.pragma.archetype.domain.model.DTOConfig;
import com.pragma.archetype.domain.model.GeneratedFile;

/**
 * Use case for generating DTOs.
 */
public interface GenerateDTOUseCase {

    /**
     * Generates DTO files based on configuration.
     *
     * @param projectPath path to the project root
     * @param config      DTO configuration
     * @return result of the generation
     */
    GenerationResult execute(Path projectPath, DTOConfig config);

    /**
     * Result of DTO generation.
     */
    record GenerationResult(
        boolean success,
        List<GeneratedFile> generatedFiles,
        List<String> errors
    ) {
        public static GenerationResult success(List<GeneratedFile> files) {
            return new GenerationResult(true, files, List.of());
        }

        public static GenerationResult failure(List<String> errors) {
            return new GenerationResult(false, List.of(), errors);
        }
    }
}
```

### Step 3: Create Generator

Create the generator that processes templates.

**File:** `src/main/java/com/pragma/archetype/application/generator/DTOGenerator.java`

```java
package com.pragma.archetype.application.generator;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.pragma.archetype.domain.model.DTOConfig;
import com.pragma.archetype.domain.model.GeneratedFile;
import com.pragma.archetype.domain.model.ProjectConfig;
import com.pragma.archetype.domain.port.out.FileSystemPort;
import com.pragma.archetype.domain.port.out.TemplateRepository;

/**
 * Generator for DTOs.
 */
public class DTOGenerator {

    private final TemplateRepository templateRepository;
    private final FileSystemPort fileSystemPort;

    public DTOGenerator(TemplateRepository templateRepository, FileSystemPort fileSystemPort) {
        this.templateRepository = templateRepository;
        this.fileSystemPort = fileSystemPort;
    }

    public List<GeneratedFile> generate(
            Path projectPath,
            ProjectConfig projectConfig,
            DTOConfig dtoConfig) {

        List<GeneratedFile> files = new ArrayList<>();

        // Prepare template context
        Map<String, Object> context = prepareContext(projectConfig, dtoConfig);

        // Generate Request DTO
        if (dtoConfig.type() == DTOConfig.DTOType.REQUEST || 
            dtoConfig.type() == DTOConfig.DTOType.BOTH) {
            files.add(generateRequestDTO(projectPath, dtoConfig, context));
        }

        // Generate Response DTO
        if (dtoConfig.type() == DTOConfig.DTOType.RESPONSE || 
            dtoConfig.type() == DTOConfig.DTOType.BOTH) {
            files.add(generateResponseDTO(projectPath, dtoConfig, context));
        }

        return files;
    }

    private GeneratedFile generateRequestDTO(
            Path projectPath,
            DTOConfig config,
            Map<String, Object> context) {

        String content = templateRepository.processTemplate(
                "frameworks/spring/reactive/dto/RequestDTO.java.ftl",
                context);

        Path filePath = projectPath
                .resolve("src/main/java")
                .resolve(config.packageName().replace('.', '/'))
                .resolve(config.name() + "Request.java");

        fileSystemPort.createDirectory(filePath.getParent());

        return GeneratedFile.javaSource(filePath, content);
    }

    private GeneratedFile generateResponseDTO(
            Path projectPath,
            DTOConfig config,
            Map<String, Object> context) {

        String content = templateRepository.processTemplate(
                "frameworks/spring/reactive/dto/ResponseDTO.java.ftl",
                context);

        Path filePath = projectPath
                .resolve("src/main/java")
                .resolve(config.packageName().replace('.', '/'))
                .resolve(config.name() + "Response.java");

        fileSystemPort.createDirectory(filePath.getParent());

        return GeneratedFile.javaSource(filePath, content);
    }

    private Map<String, Object> prepareContext(
            ProjectConfig projectConfig,
            DTOConfig dtoConfig) {

        Map<String, Object> context = new HashMap<>();

        context.put("packageName", dtoConfig.packageName());
        context.put("dtoName", dtoConfig.name());
        context.put("basePackage", projectConfig.basePackage());

        // Convert fields to Maps for FreeMarker
        List<Map<String, Object>> fieldMaps = new ArrayList<>();
        for (DTOConfig.DTOField field : dtoConfig.fields()) {
            Map<String, Object> fieldMap = new HashMap<>();
            fieldMap.put("name", field.name());
            fieldMap.put("type", field.type());
            fieldMap.put("required", field.required());
            fieldMaps.add(fieldMap);
        }
        context.put("fields", fieldMaps);

        // Helper flags
        context.put("needsValidation", hasValidation(dtoConfig.fields()));

        return context;
    }

    private boolean hasValidation(List<DTOConfig.DTOField> fields) {
        return fields.stream().anyMatch(DTOConfig.DTOField::required);
    }
}
```

### Step 4: Create Use Case Implementation

Implement the business logic.

**File:** `src/main/java/com/pragma/archetype/application/usecase/GenerateDTOUseCaseImpl.java`

```java
package com.pragma.archetype.application.usecase;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import com.pragma.archetype.application.generator.DTOGenerator;
import com.pragma.archetype.domain.model.DTOConfig;
import com.pragma.archetype.domain.model.GeneratedFile;
import com.pragma.archetype.domain.model.ProjectConfig;
import com.pragma.archetype.domain.port.in.GenerateDTOUseCase;
import com.pragma.archetype.domain.port.out.ConfigurationPort;
import com.pragma.archetype.domain.port.out.FileSystemPort;

/**
 * Use case implementation for generating DTOs.
 */
public class GenerateDTOUseCaseImpl implements GenerateDTOUseCase {

    private final DTOGenerator generator;
    private final ConfigurationPort configurationPort;
    private final FileSystemPort fileSystemPort;

    public GenerateDTOUseCaseImpl(
            DTOGenerator generator,
            ConfigurationPort configurationPort,
            FileSystemPort fileSystemPort) {
        this.generator = generator;
        this.configurationPort = configurationPort;
        this.fileSystemPort = fileSystemPort;
    }

    @Override
    public GenerationResult execute(Path projectPath, DTOConfig config) {
        List<String> errors = new ArrayList<>();

        // 1. Validate project exists
        if (!configurationPort.configurationExists(projectPath)) {
            errors.add("Project not initialized. Run initCleanArch first.");
            return GenerationResult.failure(errors);
        }

        // 2. Read project configuration
        ProjectConfig projectConfig = configurationPort.readConfiguration(projectPath)
                .orElseThrow(() -> new RuntimeException("Failed to read project configuration"));

        // 3. Validate DTO configuration
        errors.addAll(validateConfig(config));
        if (!errors.isEmpty()) {
            return GenerationResult.failure(errors);
        }

        // 4. Generate files
        try {
            List<GeneratedFile> generatedFiles = generator.generate(
                    projectPath,
                    projectConfig,
                    config);

            // 5. Write files to disk
            fileSystemPort.writeFiles(generatedFiles);

            return GenerationResult.success(generatedFiles);

        } catch (Exception e) {
            errors.add("Failed to generate DTO: " + e.getMessage());
            return GenerationResult.failure(errors);
        }
    }

    private List<String> validateConfig(DTOConfig config) {
        List<String> errors = new ArrayList<>();

        if (config.name() == null || config.name().isBlank()) {
            errors.add("DTO name is required");
        }

        if (config.packageName() == null || config.packageName().isBlank()) {
            errors.add("Package name is required");
        }

        if (config.fields() == null || config.fields().isEmpty()) {
            errors.add("At least one field is required");
        }

        return errors;
    }
}
```

### Step 5: Create Gradle Task

Create the input adapter that users interact with.

**File:** `src/main/java/com/pragma/archetype/infrastructure/adapter/in/gradle/GenerateDTOTask.java`

```java
package com.pragma.archetype.infrastructure.adapter.in.gradle;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import org.gradle.api.DefaultTask;
import org.gradle.api.tasks.Input;
import org.gradle.api.tasks.TaskAction;
import org.gradle.api.tasks.options.Option;

import com.pragma.archetype.application.generator.DTOGenerator;
import com.pragma.archetype.application.usecase.GenerateDTOUseCaseImpl;
import com.pragma.archetype.domain.model.DTOConfig;
import com.pragma.archetype.domain.port.in.GenerateDTOUseCase;
import com.pragma.archetype.domain.port.out.ConfigurationPort;
import com.pragma.archetype.domain.port.out.FileSystemPort;
import com.pragma.archetype.domain.port.out.TemplateRepository;
import com.pragma.archetype.infrastructure.adapter.out.config.YamlConfigurationAdapter;
import com.pragma.archetype.infrastructure.adapter.out.filesystem.LocalFileSystemAdapter;
import com.pragma.archetype.infrastructure.adapter.out.template.FreemarkerTemplateRepository;

/**
 * Gradle task for generating DTOs.
 */
public class GenerateDTOTask extends DefaultTask {

    private String dtoName = "";
    private String packageName = "";
    private String fields = "";
    private String type = "both";

    @Option(option = "name", description = "DTO name (e.g., CreateOrder)")
    public void setDtoName(String dtoName) {
        this.dtoName = dtoName;
    }

    @Input
    public String getDtoName() {
        return dtoName;
    }

    @Option(option = "packageName", description = "Package name (optional, auto-detected from .cleanarch.yml)")
    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    @Input
    public String getPackageName() {
        return packageName;
    }

    @Option(option = "fields", description = "Fields (format: name:Type:required,name2:Type2:optional)")
    public void setFields(String fields) {
        this.fields = fields;
    }

    @Input
    public String getFields() {
        return fields;
    }

    @Option(option = "type", description = "DTO type: request, response, or both (default: both)")
    public void setType(String type) {
        this.type = type;
    }

    @Input
    public String getType() {
        return type;
    }

    @TaskAction
    public void generateDTO() {
        getLogger().lifecycle("Generating DTO: {}", dtoName);

        try {
            // 1. Parse configuration
            DTOConfig config = parseConfiguration();

            // 2. Setup dependencies
            FileSystemPort fileSystemPort = new LocalFileSystemAdapter();
            ConfigurationPort configurationPort = new YamlConfigurationAdapter();
            TemplateRepository templateRepository = createTemplateRepository();

            // 3. Setup use case
            DTOGenerator generator = new DTOGenerator(templateRepository, fileSystemPort);
            GenerateDTOUseCase useCase = new GenerateDTOUseCaseImpl(
                    generator,
                    configurationPort,
                    fileSystemPort);

            // 4. Execute use case
            Path projectPath = getProject().getProjectDir().toPath();
            GenerateDTOUseCase.GenerationResult result = useCase.execute(projectPath, config);

            // 5. Handle result
            if (result.success()) {
                getLogger().lifecycle("✓ DTO generated successfully!");
                getLogger().lifecycle("  Generated {} file(s)", result.generatedFiles().size());
                result.generatedFiles().forEach(file ->
                        getLogger().lifecycle("    - {}", file.path()));
            } else {
                getLogger().error("✗ Failed to generate DTO:");
                result.errors().forEach(error -> getLogger().error("  - {}", error));
                throw new RuntimeException("DTO generation failed");
            }

        } catch (Exception e) {
            getLogger().error("✗ Error generating DTO: {}", e.getMessage());
            throw new RuntimeException("DTO generation failed", e);
        }
    }

    private DTOConfig parseConfiguration() {
        // Parse fields
        List<DTOConfig.DTOField> fieldList = parseFields(fields);

        // Resolve package name
        String resolvedPackage = resolvePackageName();

        // Parse type
        DTOConfig.DTOType dtoType = parseDTOType(type);

        return DTOConfig.builder()
                .name(dtoName)
                .packageName(resolvedPackage)
                .fields(fieldList)
                .type(dtoType)
                .build();
    }

    private List<DTOConfig.DTOField> parseFields(String fieldsStr) {
        List<DTOConfig.DTOField> fieldList = new ArrayList<>();

        if (fieldsStr == null || fieldsStr.isBlank()) {
            throw new IllegalArgumentException("Fields are required");
        }

        String[] fieldParts = fieldsStr.split(",");
        for (String fieldPart : fieldParts) {
            String[] parts = fieldPart.trim().split(":");
            if (parts.length < 2) {
                throw new IllegalArgumentException(
                        "Invalid field format: " + fieldPart + 
                        ". Expected: name:Type:required");
            }

            String name = parts[0].trim();
            String type = parts[1].trim();
            boolean required = parts.length > 2 && "required".equalsIgnoreCase(parts[2].trim());

            fieldList.add(new DTOConfig.DTOField(name, type, required));
        }

        return fieldList;
    }

    private String resolvePackageName() {
        if (packageName != null && !packageName.isBlank()) {
            return packageName;
        }

        // Auto-detect from .cleanarch.yml
        Path projectPath = getProject().getProjectDir().toPath();
        ConfigurationPort configPort = new YamlConfigurationAdapter();

        return configPort.readConfiguration(projectPath)
                .map(config -> config.basePackage() + ".infrastructure.entrypoints.rest.dto")
                .orElseThrow(() -> new IllegalArgumentException(
                        "Could not auto-detect package name. Please specify --packageName"));
    }

    private DTOConfig.DTOType parseDTOType(String typeStr) {
        return switch (typeStr.toLowerCase()) {
            case "request" -> DTOConfig.DTOType.REQUEST;
            case "response" -> DTOConfig.DTOType.RESPONSE;
            case "both" -> DTOConfig.DTOType.BOTH;
            default -> throw new IllegalArgumentException(
                    "Invalid DTO type: " + typeStr + ". Valid values: request, response, both");
        };
    }

    private TemplateRepository createTemplateRepository() {
        // Same logic as InitCleanArchTask
        Path projectDir = getProject().getProjectDir().toPath();
        YamlConfigurationAdapter configAdapter = new YamlConfigurationAdapter();

        if (configAdapter.configurationExists(projectDir)) {
            // ... check for local templates in .cleanarch.yml
        }

        // Auto-detect or use embedded
        Path autoDetectPath = projectDir
                .resolve("../../backend-architecture-design-archetype-generator-templates/templates")
                .normalize();

        if (java.nio.file.Files.exists(autoDetectPath)) {
            return new FreemarkerTemplateRepository(autoDetectPath);
        }

        return new FreemarkerTemplateRepository("embedded");
    }
}
```

### Step 6: Register Task in Plugin

Register your new task in the plugin.

**File:** `src/main/java/com/pragma/archetype/infrastructure/config/CleanArchPlugin.java`

```java
@Override
public void apply(Project project) {
    // ... existing tasks

    // Register generateDTO task
    project.getTasks().register("generateDTO", GenerateDTOTask.class, task -> {
        task.setGroup("Clean Architecture");
        task.setDescription("Generates DTO classes (Request/Response)");
    });
}
```

### Step 7: Create Templates

Create FreeMarker templates for your DTOs.

**File:** `templates/frameworks/spring/reactive/dto/RequestDTO.java.ftl`

```java
package ${packageName};

<#if needsValidation>
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
</#if>

/**
 * Request DTO for ${dtoName}.
 */
public record ${dtoName}Request(
<#list fields as field>
    <#if field.required>
    @NotNull
    </#if>
    ${field.type} ${field.name}<#if field_has_next>,</#if>
</#list>
) {}
```

**File:** `templates/frameworks/spring/reactive/dto/ResponseDTO.java.ftl`

```java
package ${packageName};

/**
 * Response DTO for ${dtoName}.
 */
public record ${dtoName}Response(
<#list fields as field>
    ${field.type} ${field.name}<#if field_has_next>,</#if>
</#list>
) {}
```

### Step 8: Test Your Command

```bash
# Publish plugin
./gradlew clean build publishToMavenLocal -x test

# Test in project
cd test-project
../gradlew generateDTO --name=CreateOrder --fields="customerId:String:required,amount:BigDecimal:required,status:String:optional" --type=both
```

## Checklist

- [ ] Domain model created (`DTOConfig.java`)
- [ ] Use case port created (`GenerateDTOUseCase.java`)
- [ ] Generator created (`DTOGenerator.java`)
- [ ] Use case implementation created (`GenerateDTOUseCaseImpl.java`)
- [ ] Gradle task created (`GenerateDTOTask.java`)
- [ ] Task registered in `CleanArchPlugin.java`
- [ ] Templates created (`.ftl` files)
- [ ] Command tested end-to-end
- [ ] Documentation updated
- [ ] Examples added

## Tips

1. **Follow existing patterns**: Look at `GenerateEntityTask` and `EntityGenerator` for reference
2. **Use auto-detection**: Let users omit `packageName` when possible
3. **Validate early**: Check inputs in the task before calling use case
4. **Clear error messages**: Help users understand what went wrong
5. **Test thoroughly**: Try edge cases and invalid inputs

## Need Help?

- Review existing commands: `GenerateEntityTask`, `GenerateUseCaseTask`
- Check [Template System](./template-system.md) for FreeMarker syntax
- Ask in [GitHub Discussions](https://github.com/somospragma/backend-architecture-design/discussions)
