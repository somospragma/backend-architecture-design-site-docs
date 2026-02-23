# Testing Templates - Validation and Quality Assurance

Comprehensive guide for testing and validating template changes before submitting pull requests.

## Overview

This guide covers:
- Template validation tools
- Unit testing templates
- Integration testing
- Cross-architecture testing
- Property-based testing
- Continuous integration

## Template Validation

### Automated Validation

The plugin provides a validation command that checks templates without generating projects:

```bash
./gradlew validateTemplates
```

**What it checks:**
- ✅ All template files exist
- ✅ FreeMarker syntax is valid
- ✅ No undefined variables
- ✅ Metadata references are correct
- ✅ Structure definitions are complete
- ✅ YAML files are valid

**Example output:**

```
> Task :validateTemplates

Validating architecture templates...
✓ hexagonal-single: OK
✓ hexagonal-multi: OK
✓ hexagonal-multi-granular: OK
✓ onion-single: OK

Validating adapter templates...
✓ mongodb: OK
✓ redis: OK
✓ postgresql: OK
✗ cassandra: FAILED
  - Template file 'Config.java.ftl' not found
  - Undefined variable 'clusterName' in Adapter.java.ftl

Validation completed with 1 error(s)
```

### Validate Specific Architecture

```bash
./gradlew validateTemplates --architecture=onion-single
```

### Validate Specific Adapter

```bash
./gradlew validateTemplates --adapter=mongodb
```

### Validation in CI/CD

Add to your GitHub Actions workflow:

```yaml
name: Validate Templates

on:
  pull_request:
    paths:
      - 'templates/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK 21
        uses: actions/setup-java@v3
        with:
          java-version: '21'
          distribution: 'temurin'
      
      - name: Validate Templates
        run: ./gradlew validateTemplates
```

## Unit Testing Templates

### Testing Template Processing

Test that templates process correctly with various inputs:

```java
@Test
void shouldProcessMongoDBAdapterTemplate() {
  // Given
  Map<String, Object> context = Map.of(
      "name", "UserRepository",
      "entityName", "User",
      "packageName", "com.example.infrastructure.adapter.out.mongodb",
      "basePackage", "com.example",
      "projectName", "user-service",
      "paradigm", "reactive"
  );

  // When
  String result = templateEngine.process(
      "adapters/mongodb/templates/Adapter.java.ftl",
      context
  );

  // Then
  assertThat(result)
      .contains("public class UserRepositoryAdapter")
      .contains("package com.example.infrastructure.adapter.out.mongodb")
      .contains("private final UserMapper mapper")
      .contains("import reactor.core.publisher.Mono")
      .doesNotContain("${")  // No unprocessed variables
      .doesNotContain("<#");  // No unprocessed directives
}
```

### Testing Variable Substitution

```java
@Test
void shouldSubstituteAllVariables() {
  // Given
  Map<String, Object> context = Map.of(
      "name", "ProductRepository",
      "entityName", "Product"
  );

  // When
  String result = templateEngine.process("Adapter.java.ftl", context);

  // Then
  assertThat(result)
      .doesNotContain("${name}")
      .doesNotContain("${entityName}")
      .contains("ProductRepositoryAdapter")
      .contains("Product entity");
}
```

### Testing Conditional Logic

```java
@Test
void shouldGenerateReactiveCodeWhenParadigmIsReactive() {
  // Given
  Map<String, Object> context = Map.of(
      "paradigm", "reactive",
      "name", "UserRepository",
      "entityName", "User"
  );

  // When
  String result = templateEngine.process("Adapter.java.ftl", context);

  // Then
  assertThat(result)
      .contains("import reactor.core.publisher.Mono")
      .contains("public Mono<User> save(User entity)");
}

@Test
void shouldGenerateImperativeCodeWhenParadigmIsImperative() {
  // Given
  Map<String, Object> context = Map.of(
      "paradigm", "imperative",
      "name", "UserRepository",
      "entityName", "User"
  );

  // When
  String result = templateEngine.process("Adapter.java.ftl", context);

  // Then
  assertThat(result)
      .doesNotContain("reactor.core.publisher")
      .contains("public User save(User entity)");
}
```

### Testing Edge Cases

```java
@Test
void shouldHandleEmptyMethodsList() {
  // Given
  Map<String, Object> context = Map.of(
      "name", "UserRepository",
      "entityName", "User",
      "methods", List.of()  // Empty list
  );

  // When
  String result = templateEngine.process("Adapter.java.ftl", context);

  // Then
  assertThat(result)
      .contains("public class UserRepositoryAdapter")
      .doesNotContain("TODO: Implement custom method");
}

@Test
void shouldHandleNullMethodsList() {
  // Given
  Map<String, Object> context = Map.of(
      "name", "UserRepository",
      "entityName", "User"
      // methods not provided
  );

  // When
  String result = templateEngine.process("Adapter.java.ftl", context);

  // Then - Should not throw exception
  assertThat(result).isNotNull();
}
```

## Integration Testing

### End-to-End Generation Test

Test complete project generation:

```java
@Test
void shouldGenerateCompleteProject() throws IOException {
  // Given
  Path testProject = Files.createTempDirectory("test-project");
  
  // When
  projectGenerator.generate(
      testProject,
      ProjectConfig.builder()
          .name("user-service")
          .basePackage("com.example.user")
          .architecture(ArchitectureType.ONION_SINGLE)
          .paradigm(Paradigm.REACTIVE)
          .framework(Framework.SPRING)
          .build()
  );

  // Then
  assertThat(testProject.resolve("build.gradle")).exists();
  assertThat(testProject.resolve("settings.gradle")).exists();
  assertThat(testProject.resolve("README.md")).exists();
  assertThat(testProject.resolve("src/main/java/com/example/user/core/domain")).exists();
  assertThat(testProject.resolve("src/main/java/com/example/user/core/application")).exists();
  assertThat(testProject.resolve("src/main/java/com/example/user/infrastructure")).exists();
}
```

### Adapter Generation Test

```java
@Test
void shouldGenerateMongoDBAdapter() throws IOException {
  // Given
  Path testProject = createTestProject();
  
  // When
  adapterGenerator.generate(
      testProject,
      AdapterConfig.builder()
          .name("UserRepository")
          .entityName("User")
          .type(AdapterType.MONGODB)
          .packageName("com.example.infrastructure.adapter.out.mongodb")
          .build()
  );

  // Then
  Path adapterPath = testProject.resolve(
      "src/main/java/com/example/infrastructure/adapter/out/mongodb"
  );
  
  assertThat(adapterPath.resolve("UserRepositoryAdapter.java")).exists();
  assertThat(adapterPath.resolve("entity/UserData.java")).exists();
  assertThat(adapterPath.resolve("mapper/UserMapper.java")).exists();
  
  // Verify generated code compiles
  CompilationResult result = compileJavaFiles(adapterPath);
  assertThat(result.isSuccess()).isTrue();
}
```

### Configuration Merging Test

```java
@Test
void shouldMergeApplicationProperties() throws IOException {
  // Given
  Path testProject = createTestProject();
  Path appYml = testProject.resolve("src/main/resources/application.yml");
  
  Files.writeString(appYml, """
      spring:
        application:
          name: user-service
      """);

  // When
  adapterGenerator.generate(testProject, mongoDBAdapterConfig());

  // Then
  String mergedYaml = Files.readString(appYml);
  
  assertThat(mergedYaml)
      .contains("name: user-service")  // Existing preserved
      .contains("mongodb:")             // New added
      .contains("uri:");
}
```

## Cross-Architecture Testing

### Test Adapter in All Architectures

```java
@ParameterizedTest
@EnumSource(ArchitectureType.class)
void shouldGenerateAdapterInAllArchitectures(ArchitectureType architecture) {
  // Given
  Path testProject = createProjectWithArchitecture(architecture);
  
  // When
  adapterGenerator.generate(testProject, mongoDBAdapterConfig());

  // Then
  // Verify adapter exists in architecture-specific location
  Path adapterPath = resolveAdapterPath(testProject, architecture, "mongodb");
  assertThat(adapterPath).exists();
  
  // Verify generated code compiles
  assertThat(compileProject(testProject)).isTrue();
}
```

### Manual Cross-Architecture Testing

```bash
#!/bin/bash
# test-all-architectures.sh

ARCHITECTURES=("hexagonal-single" "hexagonal-multi" "hexagonal-multi-granular" "onion-single")
ADAPTERS=("mongodb" "redis" "postgresql" "rest-controller")

for arch in "${ARCHITECTURES[@]}"; do
  echo "Testing architecture: $arch"
  
  # Create test project
  mkdir -p "test-$arch"
  cd "test-$arch"
  
  # Initialize project
  ../gradlew initCleanArch --architecture=$arch
  
  # Test each adapter
  for adapter in "${ADAPTERS[@]}"; do
    echo "  Testing adapter: $adapter"
    
    if [[ $adapter == "rest-controller" ]]; then
      ../gradlew generateInputAdapter --name=UserController --type=$adapter
    else
      ../gradlew generateOutputAdapter --name=UserRepository --entity=User --type=$adapter
    fi
    
    # Verify build
    if ! ../gradlew build; then
      echo "  ✗ FAILED: $adapter in $arch"
      exit 1
    fi
    
    echo "  ✓ PASSED: $adapter in $arch"
  done
  
  cd ..
  rm -rf "test-$arch"
done

echo "All tests passed!"
```

## Property-Based Testing

### Testing Universal Properties

Use property-based testing to verify correctness across randomized inputs:

```java
@Property
void adapterPlacementByType(
    @ForAll("architectures") ArchitectureType architecture,
    @ForAll("adapterTypes") AdapterType adapterType,
    @ForAll("adapterNames") String name) {
  
  // When
  Path path = pathResolver.resolveAdapterPath(architecture, adapterType, name);
  
  // Then
  String expectedPath = architecture.getStructureMetadata()
      .getAdapterPaths()
      .get(adapterType.toString().toLowerCase());
  
  assertThat(path.toString())
      .contains(expectedPath.replace("{name}", name));
}

@Provide
Arbitrary<ArchitectureType> architectures() {
  return Arbitraries.of(ArchitectureType.values());
}

@Provide
Arbitrary<AdapterType> adapterTypes() {
  return Arbitraries.of(AdapterType.DRIVEN, AdapterType.DRIVING);
}

@Provide
Arbitrary<String> adapterNames() {
  return Arbitraries.strings()
      .withCharRange('a', 'z')
      .ofMinLength(3)
      .ofMaxLength(20);
}
```

### Testing YAML Round-Trip

```java
@Property
void yamlRoundTripEquivalence(@ForAll("yamlMaps") Map<String, Object> original) {
  // When
  String yaml = yamlWriter.write(original);
  Map<String, Object> parsed = yamlParser.parse(yaml);
  
  // Then
  assertThat(parsed).isEqualTo(original);
}

@Provide
Arbitrary<Map<String, Object>> yamlMaps() {
  return Arbitraries.maps(
      Arbitraries.strings().alpha().ofMinLength(1).ofMaxLength(20),
      Arbitraries.oneOf(
          Arbitraries.strings(),
          Arbitraries.integers(),
          Arbitraries.booleans()
      )
  ).ofMinSize(1).ofMaxSize(10);
}
```

## Manual Testing Workflow

### 1. Setup Test Environment

```bash
# Clone repositories
git clone https://github.com/somospragma/backend-architecture-design-archetype-generator-core.git
git clone https://github.com/somospragma/backend-architecture-design-archetype-generator-templates.git

# Create test workspace
mkdir test-workspace
cd test-workspace
```

### 2. Make Template Changes

```bash
cd ../backend-architecture-design-archetype-generator-templates

# Create feature branch
git checkout -b feature/cassandra-adapter

# Make changes
vim adapters/cassandra/metadata.yml
vim adapters/cassandra/templates/Adapter.java.ftl

# Commit changes
git add .
git commit -m "feat: add Cassandra adapter"
```

### 3. Build Plugin

```bash
cd ../backend-architecture-design-archetype-generator-core
./gradlew clean build publishToMavenLocal
```

### 4. Test Template Changes

```bash
cd ../test-workspace

# Create test project
mkdir test-cassandra
cd test-cassandra

# Initialize project
gradle initCleanArch --architecture=hexagonal-single

# Generate adapter
gradle generateOutputAdapter \
  --name=UserRepository \
  --entity=User \
  --type=cassandra

# Verify generated files
ls -la src/main/java/com/example/infrastructure/driven-adapters/cassandra/

# Check generated code
cat src/main/java/com/example/infrastructure/driven-adapters/cassandra/UserRepositoryAdapter.java

# Verify compilation
gradle build
```

### 5. Test in Multiple Architectures

```bash
# Test in Onion architecture
cd ../
mkdir test-cassandra-onion
cd test-cassandra-onion

gradle initCleanArch --architecture=onion-single
gradle generateOutputAdapter --name=User --entity=User --type=cassandra
gradle build

# Verify adapter location
ls -la src/main/java/com/example/infrastructure/adapter/out/cassandra/
```

### 6. Test Configuration Merging

```bash
# Generate multiple adapters
gradle generateOutputAdapter --name=User --entity=User --type=mongodb
gradle generateOutputAdapter --name=Cache --entity=User --type=redis

# Verify application.yml
cat src/main/resources/application.yml

# Should contain both MongoDB and Redis configuration
```

### 7. Test Edge Cases

```bash
# Test with complex names
gradle generateOutputAdapter --name=UserProfileRepository --entity=UserProfile --type=cassandra

# Test with different packages
gradle generateOutputAdapter \
  --name=User \
  --entity=User \
  --type=cassandra \
  --packageName=com.other.package

# Test with custom methods
# (if your adapter supports custom methods)
```

## Continuous Integration

### GitHub Actions Workflow

Create `.github/workflows/test-templates.yml`:

```yaml
name: Test Templates

on:
  pull_request:
    paths:
      - 'templates/**'
      - 'src/**'

jobs:
  validate:
    name: Validate Templates
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK 21
        uses: actions/setup-java@v3
        with:
          java-version: '21'
          distribution: 'temurin'
      
      - name: Validate Templates
        run: ./gradlew validateTemplates

  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK 21
        uses: actions/setup-java@v3
        with:
          java-version: '21'
          distribution: 'temurin'
      
      - name: Run Unit Tests
        run: ./gradlew test
      
      - name: Upload Test Results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: build/test-results/

  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    strategy:
      matrix:
        architecture: [hexagonal-single, hexagonal-multi, onion-single]
        adapter: [mongodb, redis, postgresql]
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK 21
        uses: actions/setup-java@v3
        with:
          java-version: '21'
          distribution: 'temurin'
      
      - name: Build Plugin
        run: ./gradlew clean build publishToMavenLocal
      
      - name: Test ${{ matrix.adapter }} in ${{ matrix.architecture }}
        run: |
          mkdir test-project
          cd test-project
          gradle initCleanArch --architecture=${{ matrix.architecture }}
          gradle generateOutputAdapter --name=User --entity=User --type=${{ matrix.adapter }}
          gradle build
```

## Testing Checklist

Before submitting a PR, verify:

### Template Validation
- [ ] `./gradlew validateTemplates` passes
- [ ] No FreeMarker syntax errors
- [ ] No undefined variables
- [ ] All referenced files exist

### Unit Tests
- [ ] Template processing tests pass
- [ ] Variable substitution works correctly
- [ ] Conditional logic works as expected
- [ ] Edge cases are handled

### Integration Tests
- [ ] Project generation succeeds
- [ ] Adapter generation succeeds
- [ ] Generated code compiles
- [ ] Configuration merging works

### Cross-Architecture Tests
- [ ] Adapter works in Hexagonal Single
- [ ] Adapter works in Hexagonal Multi
- [ ] Adapter works in Hexagonal Multi-Granular
- [ ] Adapter works in Onion Single

### Manual Tests
- [ ] Generated code follows conventions
- [ ] Package names are correct
- [ ] Imports are correct
- [ ] Documentation is generated
- [ ] README is accurate

### Code Quality
- [ ] No hardcoded values
- [ ] Proper null checks
- [ ] Consistent formatting
- [ ] Comprehensive documentation

## Troubleshooting

### Template Validation Fails

**Problem:** `validateTemplates` reports errors

**Solutions:**
1. Check error message for specific issue
2. Verify all template files exist
3. Check FreeMarker syntax
4. Ensure all variables are defined

### Generated Code Doesn't Compile

**Problem:** `gradle build` fails after generation

**Solutions:**
1. Check generated code for syntax errors
2. Verify imports are correct
3. Check package names match folder structure
4. Ensure dependencies are in build.gradle

### Configuration Merge Fails

**Problem:** application.yml is corrupted after merge

**Solutions:**
1. Check YAML syntax in template
2. Verify existing application.yml is valid
3. Test merge with simple configuration first
4. Check for special characters or quotes

### Adapter in Wrong Location

**Problem:** Adapter generated in unexpected folder

**Solutions:**
1. Check `adapterPaths` in structure.yml
2. Verify architecture type is correct
3. Check adapter type (driven vs driving)
4. Test path resolution logic

## Next Steps

- [Developer Mode](developer-mode) - Set up local development
- [Adding Adapters](adding-adapters) - Create new adapters
- [Adding Architectures](adding-architectures) - Create new architectures

## Resources

- [JUnit 5 Documentation](https://junit.org/junit5/docs/current/user-guide/)
- [AssertJ Documentation](https://assertj.github.io/doc/)
- [jqwik Property Testing](https://jqwik.net/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
