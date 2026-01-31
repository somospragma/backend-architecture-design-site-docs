# Adding a New Command

Learn how to add a new Gradle task to the Clean Architecture Generator plugin.

## Overview

Adding a new command involves:
1. Creating a domain model
2. Creating a use case
3. Creating a Gradle task
4. Registering the task in the plugin
5. Creating documentation
6. Adding tests

## Step-by-Step Guide

### Step 1: Define the Domain Model

Create a configuration model in `domain/model/`:

**Example: `ServiceConfig.java`**

```java
package com.pragma.archetype.domain.model;

import java.util.List;

/**
 * Configuration for service generation.
 */
public record ServiceConfig(
    String name,
    String packageName,
    List<ServiceMethod> methods,
    boolean generateInterface,
    boolean generateImpl
) {

  public record ServiceMethod(
      String name,
      String returnType,
      List<MethodParameter> parameters
  ) {}

  public record MethodParameter(
      String name,
      String type
  ) {}

  public static Builder builder() {
    return new Builder();
  }

  public static class Builder {
    private String name;
    private String packageName;
    private List<ServiceMethod> methods;
    private boolean generateInterface = true;
    private boolean generateImpl = true;

    public Builder name(String name) {
      this.name = name;
      return this;
    }

    public Builder packageName(String packageName) {
      this.packageName = packageName;
      return this;
    }

    public Builder methods(List<ServiceMethod> methods) {
      this.methods = methods;
      return this;
    }

    public Builder generateInterface(boolean generateInterface) {
      this.generateInterface = generateInterface;
      return this;
    }

    public Builder generateImpl(boolean generateImpl) {
      this.generateImpl = generateImpl;
      return this;
    }

    public ServiceConfig build() {
      return new ServiceConfig(name, packageName, methods, generateInterface, generateImpl);
    }
  }
}
```

### Step 2: Create the Use Case Port

Create an interface in `domain/port/in/`:

**Example: `GenerateServiceUseCase.java`**

```java
package com.pragma.archetype.domain.port.in;

import com.pragma.archetype.domain.model.GeneratedFile;
import com.pragma.archetype.domain.model.ServiceConfig;

import java.nio.file.Path;
import java.util.List;

/**
 * Use case for generating services.
 */
public interface GenerateServiceUseCase {

  /**
   * Generates service files based on configuration.
   *
   * @param projectPath path to the project
   * @param config service configuration
   * @return result of the generation
   */
  GenerationResult execute(Path projectPath, ServiceConfig config);

  /**
   * Result of service generation.
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

### Step 3: Create the Validator

Create a validator in `domain/service/`:

**Example: `ServiceValidator.java`**

```java
package com.pragma.archetype.domain.service;

import com.pragma.archetype.domain.model.ServiceConfig;
import com.pragma.archetype.domain.model.ValidationResult;
import com.pragma.archetype.domain.port.out.ConfigurationPort;
import com.pragma.archetype.domain.port.out.FileSystemPort;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

/**
 * Validates service configuration.
 */
public class ServiceValidator {

  private final FileSystemPort fileSystemPort;
  private final ConfigurationPort configurationPort;

  public ServiceValidator(FileSystemPort fileSystemPort, ConfigurationPort configurationPort) {
    this.fileSystemPort = fileSystemPort;
    this.configurationPort = configurationPort;
  }

  /**
   * Validates service configuration.
   */
  public ValidationResult validate(Path projectPath, ServiceConfig config) {
    List<String> errors = new ArrayList<>();

    // Validate project is initialized
    if (!fileSystemPort.exists(projectPath.resolve(".cleanarch.yml"))) {
      errors.add("Project not initialized. Run initCleanArch first.");
    }

    // Validate service name
    if (config.name() == null || config.name().isBlank()) {
      errors.add("Service name is required");
    } else if (!isValidJavaIdentifier(config.name())) {
      errors.add("Service name must be a valid Java identifier");
    }

    // Validate package name
    if (config.packageName() == null || config.packageName().isBlank()) {
      errors.add("Package name is required");
    } else if (!isValidPackageName(config.packageName())) {
      errors.add("Package name must be a valid Java package");
    }

    // Validate methods
    if (config.methods() == null || config.methods().isEmpty()) {
      errors.add("At least one method is required");
    }

    return errors.isEmpty() 
        ? ValidationResult.valid() 
        : ValidationResult.invalid(errors);
  }

  private boolean isValidJavaIdentifier(String name) {
    return name.matches("[A-Z][a-zA-Z0-9]*");
  }

  private boolean isValidPackageName(String packageName) {
    return packageName.matches("^[a-z][a-z0-9_]*(\\.[a-z][a-z0-9_]*)*$");
  }
}
```

### Step 4: Create the Generator

Create a generator in `application/generator/`:

**Example: `ServiceGenerator.java`**

```java
package com.pragma.archetype.application.generator;

import com.pragma.archetype.domain.model.GeneratedFile;
import com.pragma.archetype.domain.model.ServiceConfig;
import com.pragma.archetype.domain.port.out.FileSystemPort;
import com.pragma.archetype.domain.port.out.TemplateRepository;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Generates service files.
 */
public class ServiceGenerator {

  private final TemplateRepository templateRepository;
  private final FileSystemPort fileSystemPort;

  public ServiceGenerator(TemplateRepository templateRepository, FileSystemPort fileSystemPort) {
    this.templateRepository = templateRepository;
    this.fileSystemPort = fileSystemPort;
  }

  /**
   * Generates service files based on configuration.
   */
  public List<GeneratedFile> generate(Path projectPath, ServiceConfig config) {
    List<GeneratedFile> generatedFiles = new ArrayList<>();

    // Prepare template data
    Map<String, Object> data = prepareTemplateData(config);

    // Generate interface if requested
    if (config.generateInterface()) {
      GeneratedFile interfaceFile = generateInterface(projectPath, config, data);
      generatedFiles.add(interfaceFile);
    }

    // Generate implementation if requested
    if (config.generateImpl()) {
      GeneratedFile implFile = generateImplementation(projectPath, config, data);
      generatedFiles.add(implFile);
    }

    return generatedFiles;
  }

  private GeneratedFile generateInterface(Path projectPath, ServiceConfig config, Map<String, Object> data) {
    String templatePath = "components/service/ServiceInterface.java.ftl";
    String content = templateRepository.processTemplate(templatePath, data);

    String packagePath = config.packageName().replace('.', '/');
    String fileName = config.name() + "Service.java";
    Path filePath = projectPath
        .resolve("src/main/java")
        .resolve(packagePath)
        .resolve(fileName);

    return GeneratedFile.javaSource(filePath, content);
  }

  private GeneratedFile generateImplementation(Path projectPath, ServiceConfig config, Map<String, Object> data) {
    String templatePath = "components/service/ServiceImpl.java.ftl";
    String content = templateRepository.processTemplate(templatePath, data);

    String packagePath = config.packageName().replace('.', '/');
    String fileName = config.name() + "ServiceImpl.java";
    Path filePath = projectPath
        .resolve("src/main/java")
        .resolve(packagePath)
        .resolve(fileName);

    return GeneratedFile.javaSource(filePath, content);
  }

  private Map<String, Object> prepareTemplateData(ServiceConfig config) {
    Map<String, Object> data = new HashMap<>();
    data.put("serviceName", config.name());
    data.put("packageName", config.packageName());

    // Convert methods to Maps for Freemarker
    List<Map<String, Object>> methodMaps = new ArrayList<>();
    for (ServiceConfig.ServiceMethod method : config.methods()) {
      Map<String, Object> methodMap = new HashMap<>();
      methodMap.put("name", method.name());
      methodMap.put("returnType", method.returnType());

      List<Map<String, Object>> paramMaps = new ArrayList<>();
      for (ServiceConfig.MethodParameter param : method.parameters()) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("name", param.name());
        paramMap.put("type", param.type());
        paramMaps.add(paramMap);
      }
      methodMap.put("parameters", paramMaps);
      methodMaps.add(methodMap);
    }
    data.put("methods", methodMaps);

    return data;
  }
}
```

### Step 5: Create the Use Case Implementation

Create implementation in `application/usecase/`:

**Example: `GenerateServiceUseCaseImpl.java`**

```java
package com.pragma.archetype.application.usecase;

import com.pragma.archetype.application.generator.ServiceGenerator;
import com.pragma.archetype.domain.model.GeneratedFile;
import com.pragma.archetype.domain.model.ServiceConfig;
import com.pragma.archetype.domain.model.ValidationResult;
import com.pragma.archetype.domain.port.in.GenerateServiceUseCase;
import com.pragma.archetype.domain.port.out.ConfigurationPort;
import com.pragma.archetype.domain.port.out.FileSystemPort;
import com.pragma.archetype.domain.service.ServiceValidator;

import java.nio.file.Path;
import java.util.List;

/**
 * Implementation of GenerateServiceUseCase.
 */
public class GenerateServiceUseCaseImpl implements GenerateServiceUseCase {

  private final ServiceValidator validator;
  private final ServiceGenerator generator;
  private final ConfigurationPort configurationPort;
  private final FileSystemPort fileSystemPort;

  public GenerateServiceUseCaseImpl(
      ServiceValidator validator,
      ServiceGenerator generator,
      ConfigurationPort configurationPort,
      FileSystemPort fileSystemPort) {
    this.validator = validator;
    this.generator = generator;
    this.configurationPort = configurationPort;
    this.fileSystemPort = fileSystemPort;
  }

  @Override
  public GenerationResult execute(Path projectPath, ServiceConfig config) {
    // 1. Validate configuration
    ValidationResult validationResult = validator.validate(projectPath, config);
    if (!validationResult.valid()) {
      return GenerationResult.failure(validationResult.errors());
    }

    try {
      // 2. Generate service files
      List<GeneratedFile> generatedFiles = generator.generate(projectPath, config);

      // 3. Write files to disk
      for (GeneratedFile file : generatedFiles) {
        fileSystemPort.writeFile(file);
      }

      return GenerationResult.success(generatedFiles);

    } catch (Exception e) {
      return GenerationResult.failure(List.of("Failed to generate service: " + e.getMessage()));
    }
  }
}
```

### Step 6: Create the Gradle Task

Create task in `infrastructure/entry-points/gradle/`:

**Example: `GenerateServiceTask.java`**

```java
package com.pragma.archetype.infrastructure.adapter.in.gradle;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import org.gradle.api.DefaultTask;
import org.gradle.api.tasks.Input;
import org.gradle.api.tasks.TaskAction;
import org.gradle.api.tasks.options.Option;

import com.pragma.archetype.application.generator.ServiceGenerator;
import com.pragma.archetype.application.usecase.GenerateServiceUseCaseImpl;
import com.pragma.archetype.domain.model.ServiceConfig;
import com.pragma.archetype.domain.port.in.GenerateServiceUseCase;
import com.pragma.archetype.domain.port.in.GenerateServiceUseCase.GenerationResult;
import com.pragma.archetype.domain.port.out.ConfigurationPort;
import com.pragma.archetype.domain.port.out.FileSystemPort;
import com.pragma.archetype.domain.port.out.TemplateRepository;
import com.pragma.archetype.domain.service.ServiceValidator;
import com.pragma.archetype.infrastructure.adapter.out.config.YamlConfigurationAdapter;
import com.pragma.archetype.infrastructure.adapter.out.filesystem.LocalFileSystemAdapter;
import com.pragma.archetype.infrastructure.adapter.out.template.FreemarkerTemplateRepository;

/**
 * Gradle task for generating services.
 * 
 * Usage:
 * ./gradlew generateService --name=UserService
 * --methods=create:User:userData:UserData,findById:User:id:String
 * --packageName=com.pragma.application.service
 */
public class GenerateServiceTask extends DefaultTask {

  private String serviceName = "";
  private String methods = "";
  private String packageName = "";
  private boolean generateInterface = true;
  private boolean generateImpl = true;

  @Option(option = "name", description = "Service name (e.g., UserService)")
  public void setServiceName(String serviceName) {
    this.serviceName = serviceName;
  }

  @Input
  public String getServiceName() {
    return serviceName;
  }

  @Option(option = "methods", description = "Methods (format: methodName:ReturnType:param1:Type1,param2:Type2)")
  public void setMethods(String methods) {
    this.methods = methods;
  }

  @Input
  public String getMethods() {
    return methods;
  }

  @Option(option = "packageName", description = "Package name (e.g., com.company.application.service)")
  public void setPackageName(String packageName) {
    this.packageName = packageName;
  }

  @Input
  public String getPackageName() {
    return packageName;
  }

  @Option(option = "generateInterface", description = "Generate interface (default: true)")
  public void setGenerateInterface(boolean generateInterface) {
    this.generateInterface = generateInterface;
  }

  @Input
  public boolean getGenerateInterface() {
    return generateInterface;
  }

  @Option(option = "generateImpl", description = "Generate implementation (default: true)")
  public void setGenerateImpl(boolean generateImpl) {
    this.generateImpl = generateImpl;
  }

  @Input
  public boolean getGenerateImpl() {
    return generateImpl;
  }

  @TaskAction
  public void generateService() {
    getLogger().lifecycle("Generating service: {}", serviceName);

    try {
      // 1. Validate inputs
      validateInputs();

      // 2. Parse methods
      List<ServiceConfig.ServiceMethod> serviceMethods = parseMethods(methods);

      // 3. Create configuration
      ServiceConfig config = ServiceConfig.builder()
          .name(serviceName)
          .packageName(packageName)
          .methods(serviceMethods)
          .generateInterface(generateInterface)
          .generateImpl(generateImpl)
          .build();

      // 4. Setup dependencies
      FileSystemPort fileSystemPort = new LocalFileSystemAdapter();
      ConfigurationPort configurationPort = new YamlConfigurationAdapter();
      TemplateRepository templateRepository = createTemplateRepository();

      // 5. Setup use case
      ServiceValidator validator = new ServiceValidator(fileSystemPort, configurationPort);
      ServiceGenerator generator = new ServiceGenerator(templateRepository, fileSystemPort);
      GenerateServiceUseCase useCase = new GenerateServiceUseCaseImpl(
          validator,
          generator,
          configurationPort,
          fileSystemPort);

      // 6. Execute use case
      Path projectPath = getProject().getProjectDir().toPath();
      GenerationResult result = useCase.execute(projectPath, config);

      // 7. Handle result
      if (result.success()) {
        getLogger().lifecycle("✓ Service generated successfully!");
        getLogger().lifecycle("  Generated {} file(s)", result.generatedFiles().size());
        result.generatedFiles().forEach(file -> getLogger().lifecycle("    - {}", file.path()));
      } else {
        getLogger().error("✗ Failed to generate service:");
        result.errors().forEach(error -> getLogger().error("  - {}", error));
        throw new RuntimeException("Service generation failed");
      }

    } catch (Exception e) {
      getLogger().error("✗ Error generating service: {}", e.getMessage());
      throw new RuntimeException("Service generation failed", e);
    }
  }

  private void validateInputs() {
    if (serviceName.isBlank()) {
      throw new IllegalArgumentException("Service name is required. Use --name=UserService");
    }

    if (methods.isBlank()) {
      throw new IllegalArgumentException("Methods are required. Use --methods=create:User:userData:UserData");
    }

    if (packageName.isBlank()) {
      throw new IllegalArgumentException("Package name is required. Use --packageName=com.company.application.service");
    }
  }

  private List<ServiceConfig.ServiceMethod> parseMethods(String methodsStr) {
    // Parse method string into ServiceMethod list
    // Implementation similar to GenerateUseCaseTask
    return new ArrayList<>();
  }

  private TemplateRepository createTemplateRepository() {
    Path projectDir = getProject().getProjectDir().toPath();
    Path localTemplates = projectDir
        .resolve("../../backend-architecture-design-archetype-generator-templates/templates").normalize();

    if (java.nio.file.Files.exists(localTemplates)) {
      getLogger().info("Using local templates from: {}", localTemplates.toAbsolutePath());
      return new FreemarkerTemplateRepository(localTemplates);
    }

    getLogger().info("Using embedded templates");
    return new FreemarkerTemplateRepository("embedded");
  }
}
```

### Step 7: Register the Task in Plugin

Edit `CleanArchPlugin.java`:

```java
@Override
public void apply(Project project) {
  // ... existing tasks ...

  // Register generateService task
  project.getTasks().register("generateService", GenerateServiceTask.class, task -> {
    task.setGroup("clean architecture");
    task.setDescription("Generate an application service");
  });
}
```

### Step 8: Create Templates

Create `ServiceInterface.java.ftl`:

```java
package ${packageName};

/**
 * Service interface: ${serviceName}
 */
public interface ${serviceName}Service {

<#list methods as method>
  /**
   * ${method.name}
   <#if method.parameters?has_content>
   <#list method.parameters as param>
   * @param ${param.name} ${param.type}
   </#list>
   </#if>
   * @return ${method.returnType}
   */
  ${method.returnType} ${method.name}(<#if method.parameters?has_content><#list method.parameters as param>${param.type} ${param.name}<#sep>, </#sep></#list></#if>);

</#list>
}
```

### Step 9: Create Documentation

Create `docs/clean-arch/reference/commands/generate-service.md`

### Step 10: Add Tests

Create `GenerateServiceTaskTest.java`

## Testing Your Command

```bash
# Build and publish
./gradlew clean build publishToMavenLocal -x test

# Test in sample project
cd ../test-project
./gradlew generateService --name=UserService --methods=create:User:userData:UserData --packageName=com.pragma.application.service
```

## Checklist

- [ ] Created domain model
- [ ] Created use case port
- [ ] Created validator
- [ ] Created generator
- [ ] Created use case implementation
- [ ] Created Gradle task
- [ ] Registered task in plugin
- [ ] Created templates
- [ ] Created documentation
- [ ] Added tests
- [ ] Tested end-to-end

## Next Steps

- [Adding a New Adapter](adding-adapters)
- [Modifying Templates](modifying-templates)
- [Contributing Overview](overview)
