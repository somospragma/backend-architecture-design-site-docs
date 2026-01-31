# Modifying Templates

Learn how to modify existing FreeMarker templates to customize code generation.

## Overview

Templates are FreeMarker (`.ftl`) files that define how code is generated. They are located in the `backend-architecture-design-archetype-generator-templates` repository.

## Template Structure

```
templates/
├── components/
│   ├── entity/
│   │   └── Entity.java.ftl
│   ├── usecase/
│   │   ├── UseCasePort.java.ftl
│   │   └── UseCaseImpl.java.ftl
│   ├── driven-adapters/
│   │   ├── redis/
│   │   │   ├── RedisAdapter.java.ftl
│   │   │   ├── Mapper.java.ftl
│   │   │   └── DataEntity.java.ftl
│   │   ├── mongodb/
│   │   └── postgresql/
│   └── entry-points/
│       └── rest/
│           └── RestController.java.ftl
└── project/
    ├── hexagonal-single/
    ├── hexagonal-multi/
    └── onion-single/
```

## FreeMarker Basics

### Variables

```ftl
${packageName}
${entityName}
${useCaseName}
```

### Conditionals

```ftl
<#if hasId>
    private ${idType} id;
</#if>
```

### Loops

```ftl
<#list fields as field>
    private ${field.type} ${field.name};
</#list>
```

### String Operations

```ftl
${entityName?lower_case}
${entityName?upper_case}
${entityName?cap_first}
${entityName?uncap_first}
```

## Step-by-Step Guide

### 1. Locate the Template

Find the template you want to modify in the templates repository:

```bash
cd backend-architecture-design-archetype-generator-templates
ls -la templates/components/
```

### 2. Understand the Data Model

Check the use case implementation to see what data is passed to the template:

```java
// Example from GenerateEntityUseCaseImpl.java
Map<String, Object> dataModel = new HashMap<>();
dataModel.put("packageName", request.packageName());
dataModel.put("entityName", request.name());
dataModel.put("fields", fieldsList);
dataModel.put("hasId", request.hasId());
dataModel.put("idType", request.idType());
```

### 3. Modify the Template

Edit the `.ftl` file with your changes:

**Example: Add Lombok annotations to Entity template**

```ftl
package ${packageName};

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ${entityName} {

<#if hasId>
    private ${idType} id;
</#if>

<#list fields as field>
    private ${field.type} ${field.name};
</#list>

}
```

### 4. Test the Template

Publish the templates locally:

```bash
cd backend-architecture-design-archetype-generator-templates
git add .
git commit -m "Add Lombok annotations to entity template"
git push
```

Then update the core plugin to use the new template version and test:

```bash
cd backend-architecture-design-archetype-generator-core
./gradlew clean build publishToMavenLocal -x test

# Test in a sample project
cd test-project
./gradlew generateEntity \
  --name=User \
  --fields=name:String,email:String \
  --packageName=com.test.domain.model
```

### 5. Verify the Output

Check the generated file to ensure your changes are applied correctly:

```bash
cat src/main/java/com/test/domain/model/User.java
```

## Common Modifications

### 1. Add Validation Annotations

**Template: `Entity.java.ftl`**

```ftl
package ${packageName};

import jakarta.validation.constraints.*;

public class ${entityName} {

<#if hasId>
    @NotNull
    private ${idType} id;
</#if>

<#list fields as field>
    <#if field.type == "String">
    @NotBlank
    @Size(min = 1, max = 255)
    <#elseif field.type == "Integer">
    @Min(0)
    </#if>
    private ${field.type} ${field.name};
</#list>

}
```

### 2. Add Audit Fields

**Template: `Entity.java.ftl`**

```ftl
package ${packageName};

import java.time.Instant;

public class ${entityName} {

<#if hasId>
    private ${idType} id;
</#if>

<#list fields as field>
    private ${field.type} ${field.name};
</#list>

    // Audit fields
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;

}
```

### 3. Add Logging to Adapters

**Template: `RedisAdapter.java.ftl`**

```ftl
package ${packageName};

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ${adapterName}Adapter {

    public Mono<${entityName}> save(${entityName} entity) {
        log.debug("Saving ${entityName?lower_case}: {}", entity.getId());
        
        return redisTemplate.opsForValue()
            .set(KEY_PREFIX + entity.getId(), mapper.toData(entity))
            .doOnSuccess(v -> log.info("${entityName} saved successfully: {}", entity.getId()))
            .doOnError(e -> log.error("Failed to save ${entityName}: {}", entity.getId(), e))
            .thenReturn(entity);
    }

}
```

### 4. Add OpenAPI Documentation

**Template: `RestController.java.ftl`**

```ftl
package ${packageName};

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api")
@Tag(name = "${controllerName}", description = "${controllerName} management endpoints")
public class ${controllerName}Controller {

<#list endpoints as endpoint>
    @${endpoint.method?cap_first}Mapping("${endpoint.path}")
    @Operation(
        summary = "${endpoint.method} ${endpoint.path}",
        description = "Executes ${endpoint.useCaseMethod} use case method"
    )
    @ApiResponse(responseCode = "200", description = "Successful operation")
    @ApiResponse(responseCode = "404", description = "Resource not found")
    public Mono<ResponseEntity<${endpoint.returnType}>> ${endpoint.useCaseMethod}(
        <#list endpoint.params as param>
        @${param.annotation} ${param.type} ${param.name}<#if param?has_next>,</#if>
        </#list>
    ) {
        return ${useCaseName?uncap_first}.${endpoint.useCaseMethod}(<#list endpoint.params as param>${param.name}<#if param?has_next>, </#if></#list>)
            .map(result -> ResponseEntity.ok(result))
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

</#list>
}
```

### 5. Change Package Structure

**Template: `RedisAdapter.java.ftl`**

```ftl
package ${packageName}.adapter;

import ${packageName}.mapper.${entityName}Mapper;
import ${packageName}.entity.${entityName}Data;
```

## Template Variables Reference

### Entity Template

| Variable | Type | Description |
|----------|------|-------------|
| `packageName` | String | Full package name |
| `entityName` | String | Entity name |
| `fields` | List | List of field objects |
| `hasId` | Boolean | Whether entity has ID |
| `idType` | String | Type of ID field |

### Use Case Template

| Variable | Type | Description |
|----------|------|-------------|
| `packageName` | String | Full package name |
| `useCaseName` | String | Use case name |
| `methods` | List | List of method objects |

### Adapter Template

| Variable | Type | Description |
|----------|------|-------------|
| `packageName` | String | Full package name |
| `adapterName` | String | Adapter name |
| `entityName` | String | Entity name |
| `adapterType` | String | Type of adapter |

### Controller Template

| Variable | Type | Description |
|----------|------|-------------|
| `packageName` | String | Full package name |
| `controllerName` | String | Controller name |
| `useCaseName` | String | Use case name |
| `endpoints` | List | List of endpoint objects |

## Field Object Structure

```java
{
    "name": "email",
    "type": "String"
}
```

## Method Object Structure

```java
{
    "name": "execute",
    "returnType": "User",
    "params": [
        {
            "name": "userId",
            "type": "String"
        }
    ]
}
```

## Endpoint Object Structure

```java
{
    "path": "/users",
    "method": "POST",
    "useCaseMethod": "execute",
    "returnType": "User",
    "params": [
        {
            "name": "userData",
            "type": "UserData",
            "annotation": "RequestBody"
        }
    ]
}
```

## Best Practices

### 1. Keep Templates Simple

Avoid complex logic in templates. Move complexity to the use case implementation.

```ftl
<!-- Good -->
<#list fields as field>
    private ${field.type} ${field.name};
</#list>

<!-- Avoid -->
<#list fields as field>
    <#if field.type == "String">
        <#if field.name?contains("email")>
            @Email
        <#elseif field.name?contains("phone")>
            @Pattern(regexp = "...")
        </#if>
    </#if>
    private ${field.type} ${field.name};
</#list>
```

### 2. Use Consistent Formatting

Follow Java code style guidelines:

```ftl
package ${packageName};

import java.util.List;

public class ${entityName} {

    private ${idType} id;
    
    // Constructor
    public ${entityName}() {
    }
    
    // Getters and Setters
    public ${idType} getId() {
        return id;
    }
    
}
```

### 3. Add Comments

Document template sections:

```ftl
<#-- Entity class definition -->
public class ${entityName} {

<#-- ID field (optional) -->
<#if hasId>
    private ${idType} id;
</#if>

<#-- Domain fields -->
<#list fields as field>
    private ${field.type} ${field.name};
</#list>

}
```

### 4. Handle Edge Cases

```ftl
<#-- Check if list is not empty -->
<#if fields?has_content>
    <#list fields as field>
        private ${field.type} ${field.name};
    </#list>
<#else>
    // No fields defined
</#if>
```

### 5. Test Thoroughly

Test templates with various inputs:

```bash
# Test with minimal fields
./gradlew generateEntity --name=Simple --fields=name:String

# Test with many fields
./gradlew generateEntity --name=Complex --fields=name:String,age:Integer,email:String,active:Boolean

# Test without ID
./gradlew generateEntity --name=NoId --fields=name:String --hasId=false

# Test with custom ID type
./gradlew generateEntity --name=CustomId --fields=name:String --idType=Long
```

## Troubleshooting

### Template Not Found

**Error**: `Template not found: components/entity/Entity.java.ftl`

**Solution**: Check template path in use case implementation:

```java
String templatePath = "components/entity/Entity.java.ftl";
```

### Variable Not Defined

**Error**: `Expression packageName is undefined`

**Solution**: Ensure variable is added to data model:

```java
dataModel.put("packageName", request.packageName());
```

### Syntax Error

**Error**: `Syntax error in template`

**Solution**: Check FreeMarker syntax:

```ftl
<#-- Correct -->
<#if hasId>
    private ${idType} id;
</#if>

<#-- Incorrect -->
<#if hasId>
    private ${idType} id;
<#endif>  <!-- Should be </#if> -->
```

## Next Steps

- [Adding New Commands](adding-commands)
- [Adding New Adapters](adding-adapters)
- [Contributing Overview](overview)
- [Template Reference](../reference/templates)
