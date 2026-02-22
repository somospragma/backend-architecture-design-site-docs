# Developer Mode - Local Template Development

Learn how to develop and test templates locally without pushing to Git.

## Overview

Developer mode enables rapid template iteration by loading templates from your local filesystem instead of downloading from GitHub. This is essential for:

- Creating new adapter templates
- Modifying existing templates
- Testing template changes before committing
- Debugging template issues

## How It Works

The plugin supports three template loading modes:

1. **Local Configured** - Explicitly configured local path in `.cleanarch.yml`
2. **Local Auto-Detected** - Automatically detects `../backend-architecture-design-archetype-generator-templates`
3. **Remote** - Downloads templates from GitHub repository

## Setting Up Developer Mode

### Option 1: Auto-Detection (Recommended)

The simplest approach is to clone the templates repository alongside your plugin:

```bash
# Your workspace structure
workspace/
├── backend-architecture-design-archetype-generator-core/    # Plugin
├── backend-architecture-design-archetype-generator-templates/  # Templates
└── test-project/                                            # Test project
```

Clone the templates repository:

```bash
cd workspace
git clone https://github.com/somospragma/backend-architecture-design-archetype-generator-templates.git
```

The plugin will automatically detect and use the local templates. No configuration needed!

### Option 2: Explicit Configuration

If your templates are in a different location, configure the path in `.cleanarch.yml`:

```yaml
project:
  name: my-service
  basePackage: com.example.myservice
  pluginVersion: 1.0.0

architecture:
  type: hexagonal-single
  paradigm: reactive
  framework: spring

templates:
  mode: developer                    # Enable developer mode
  localPath: /path/to/templates      # Absolute or relative path
  cache: false                       # Disable caching for hot reload
```

**Path Options:**
- Absolute: `/Users/dev/templates`
- Relative to project: `../templates`
- Relative to home: `~/workspace/templates`

## Template Hot Reload

In developer mode, templates are reloaded on every generation command. This means:

✅ **You can:**
- Edit template files
- Run generation command
- See changes immediately
- No restart required

❌ **No need to:**
- Restart Gradle daemon
- Clear caches
- Republish plugin
- Push to Git

### Example Workflow

```bash
# 1. Edit template
vim ../backend-architecture-design-archetype-generator-templates/adapters/mongodb/templates/Adapter.java.ftl

# 2. Generate adapter (uses updated template)
./gradlew generateOutputAdapter --name=User --entity=User --type=mongodb

# 3. Check generated code
cat src/main/java/.../UserAdapter.java

# 4. Iterate - repeat steps 1-3 until satisfied
```

## Template Repository Structure

Understanding the template structure helps you navigate and modify templates:

```
backend-architecture-design-archetype-generator-templates/
├── architectures/
│   ├── hexagonal-single/
│   │   ├── structure.yml              # Architecture definition
│   │   ├── README.md.ftl              # Project README template
│   │   └── templates/
│   │       ├── build.gradle.ftl
│   │       └── settings.gradle.ftl
│   ├── hexagonal-multi/
│   ├── hexagonal-multi-granular/
│   └── onion-single/
│       ├── structure.yml
│       ├── README.md.ftl
│       └── templates/
│
└── adapters/
    ├── mongodb/
    │   ├── metadata.yml               # Adapter configuration
    │   ├── application-properties.yml.ftl
    │   └── templates/
    │       ├── Adapter.java.ftl       # Main adapter
    │       ├── Repository.java.ftl    # Repository interface
    │       ├── Entity.java.ftl        # Data entity
    │       └── Config.java.ftl        # Configuration class
    ├── redis/
    ├── rest-controller/
    └── ...
```

## Common Development Tasks

### Creating a New Adapter

1. **Create adapter directory:**

```bash
cd backend-architecture-design-archetype-generator-templates/adapters
mkdir cassandra
cd cassandra
```

2. **Create metadata.yml:**

```yaml
name: cassandra-adapter
type: driven
description: Cassandra database adapter using Spring Data Reactive

dependencies:
  - group: org.springframework.boot
    artifact: spring-boot-starter-data-cassandra-reactive
    version: ${springBootVersion}

testDependencies:
  - group: org.testcontainers
    artifact: cassandra
    version: 1.19.0
    scope: test

applicationPropertiesTemplate: application-properties.yml.ftl

configurationClasses:
  - name: CassandraConfig
    packagePath: config
    templatePath: Config.java.ftl

templates:
  - path: Adapter.java.ftl
    output: "{name}Adapter.java"
  - path: Repository.java.ftl
    output: "{name}Repository.java"
  - path: Entity.java.ftl
    output: "{name}Data.java"
```

3. **Create template files** (see [Adding Adapters](adding-adapters))

4. **Test locally:**

```bash
cd ../../../test-project
./gradlew generateOutputAdapter --name=User --entity=User --type=cassandra
```

### Modifying Existing Templates

1. **Find the template:**

```bash
cd backend-architecture-design-archetype-generator-templates
find . -name "*.ftl" | grep mongodb
```

2. **Edit the template:**

```bash
vim adapters/mongodb/templates/Adapter.java.ftl
```

3. **Test changes:**

```bash
cd ../../test-project
./gradlew generateOutputAdapter --name=User --entity=User --type=mongodb
```

4. **Verify generated code:**

```bash
cat src/main/java/.../UserAdapter.java
```

### Testing Architecture Changes

1. **Edit structure.yml:**

```bash
vim architectures/onion-single/structure.yml
```

2. **Test project generation:**

```bash
cd ../../test-project
./gradlew initCleanArch --architecture=onion-single
```

3. **Verify folder structure:**

```bash
tree src/main/java
```

## Debugging Templates

### Enable Verbose Logging

Add to `gradle.properties`:

```properties
org.gradle.logging.level=debug
```

Run with `--info` or `--debug`:

```bash
./gradlew generateOutputAdapter --name=User --type=mongodb --info
```

### Common Template Errors

#### 1. Undefined Variable

**Error:**
```
FreeMarker template error: The following has evaluated to null or missing:
==> entityName
```

**Solution:**
Check that the variable is provided in the template context. Add null checks:

```java
<#if entityName??>
public class ${entityName}Adapter {
<#else>
// entityName not provided
</#if>
```

#### 2. Syntax Error

**Error:**
```
FreeMarker syntax error at line 23: Unclosed directive #if
```

**Solution:**
Ensure all directives are properly closed:

```java
<#if condition>
  // code
</#if>  ← Don't forget closing tag
```

#### 3. Missing Template File

**Error:**
```
Template file 'Config.java.ftl' not found in adapter 'mongodb'
```

**Solution:**
- Check file exists in `templates/` directory
- Verify path in `metadata.yml` is correct
- Check file name spelling

### Template Validation

Validate templates before testing:

```bash
./gradlew validateTemplates
```

This checks:
- ✅ All referenced template files exist
- ✅ FreeMarker syntax is valid
- ✅ Required variables are defined
- ✅ Structure metadata is complete

## Testing with Different Architectures

Test your adapter works across all architectures:

```bash
# Test with Hexagonal Single
cd test-hexagonal-single
./gradlew generateOutputAdapter --name=User --type=cassandra

# Test with Hexagonal Multi
cd ../test-hexagonal-multi
./gradlew generateOutputAdapter --name=User --type=cassandra

# Test with Onion Single
cd ../test-onion-single
./gradlew generateOutputAdapter --name=User --type=cassandra
```

Verify:
- ✅ Adapter is placed in correct location for each architecture
- ✅ Package names match architecture conventions
- ✅ Generated code compiles
- ✅ No hardcoded paths or assumptions

## Remote Branch Testing

Test templates from a feature branch before merging:

```yaml
templates:
  mode: production
  repository: https://github.com/somospragma/backend-architecture-design-archetype-generator-templates
  branch: feature/cassandra-adapter  # Your feature branch
  cache: true
```

This is useful for:
- Testing changes in CI/CD
- Sharing templates with team members
- Validating before merging to main

## Best Practices

### 1. Use Version Control

Always work in a feature branch:

```bash
cd backend-architecture-design-archetype-generator-templates
git checkout -b feature/cassandra-adapter
```

### 2. Test Incrementally

Test after each change, don't wait until everything is done:

```bash
# Edit template
vim adapters/cassandra/templates/Adapter.java.ftl

# Test immediately
cd ../../test-project
./gradlew generateOutputAdapter --name=User --type=cassandra

# Verify
cat src/main/java/.../UserAdapter.java
```

### 3. Test Edge Cases

Test with different inputs:

```bash
# Simple name
./gradlew generateOutputAdapter --name=User --type=cassandra

# Complex name
./gradlew generateOutputAdapter --name=UserProfile --type=cassandra

# Different package
./gradlew generateOutputAdapter --name=User --type=cassandra --packageName=com.other.pkg
```

### 4. Clean Between Tests

Remove generated files between tests:

```bash
rm -rf src/main/java/com/example/infrastructure/driven-adapters/cassandra
./gradlew generateOutputAdapter --name=User --type=cassandra
```

### 5. Document Your Changes

Add comments to templates explaining complex logic:

```java
<#-- 
  Generate repository methods based on entity fields.
  For each field, create a findBy method.
-->
<#if entityFields?has_content>
<#list entityFields as field>
  public Mono<${entityName}> findBy${field.name?cap_first}(${field.type} ${field.name}) {
    // Implementation
  }
</#list>
</#if>
```

## Troubleshooting

### Templates Not Reloading

**Problem:** Changes to templates not reflected in generated code.

**Solutions:**
1. Check `cache: false` in `.cleanarch.yml`
2. Verify you're editing the correct template file
3. Check Gradle is not caching (run with `--no-build-cache`)
4. Restart Gradle daemon: `./gradlew --stop`

### Path Not Found

**Problem:** `Template path not found: ../templates`

**Solutions:**
1. Verify path exists: `ls -la ../templates`
2. Use absolute path instead of relative
3. Check current working directory
4. Verify `.cleanarch.yml` is in project root

### Permission Denied

**Problem:** `Failed to read template: Permission denied`

**Solutions:**
1. Check file permissions: `ls -la ../templates`
2. Make files readable: `chmod -R +r ../templates`
3. Check directory permissions

## Next Steps

- [Adding Adapters](adding-adapters) - Create new adapter templates
- [Adding Architectures](adding-architectures) - Create new architecture patterns
- [Testing Templates](testing-templates) - Comprehensive testing guide

## Resources

- [FreeMarker Documentation](https://freemarker.apache.org/docs/)
- [Template Repository](https://github.com/somospragma/backend-architecture-design-archetype-generator-templates)
- [Plugin Repository](https://github.com/somospragma/backend-architecture-design-archetype-generator-core)
