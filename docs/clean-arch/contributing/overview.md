# Contributing to Clean Architecture Generator

Thank you for your interest in contributing to the Clean Architecture Generator! This guide will help you understand how to contribute effectively.

## 🎯 Ways to Contribute

### 1. Add New Adapter Templates
Create templates for new technologies (e.g., Cassandra, Elasticsearch, RabbitMQ)

### 2. Add New Commands
Extend the plugin with new Gradle tasks

### 3. Improve Existing Templates
Enhance current templates with better practices or features

### 4. Fix Bugs
Help us identify and fix issues

### 5. Improve Documentation
Help make our docs clearer and more comprehensive

## 📋 Before You Start

### Prerequisites

- Java 21 or higher
- Gradle 8.x or higher
- Git
- Basic understanding of:
  - Clean Architecture principles
  - Hexagonal Architecture
  - Spring Boot (Reactive & Imperative)
  - Freemarker templates

### Repository Structure

We have 3 main repositories:

1. **core** - The Gradle plugin
   - `backend-architecture-design-archetype-generator-core`
   
2. **templates** - Freemarker templates
   - `backend-architecture-design-archetype-generator-templates`
   
3. **docs** - Documentation site (Docusaurus)
   - `backend-architecture-design-site-docs`

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/backend-architecture-design-archetype-generator-core.git
cd backend-architecture-design-archetype-generator-core

# Add upstream remote
git remote add upstream https://github.com/somospragma/backend-architecture-design-archetype-generator-core.git
```

### 2. Create a Branch

```bash
git checkout -b feature/my-new-feature
# or
git checkout -b fix/bug-description
```

### 3. Make Your Changes

Follow the specific guides:
- [Adding a New Adapter](adding-adapters)
- [Adding a New Command](adding-commands)
- [Modifying Templates](modifying-templates)

### 4. Test Your Changes

```bash
# Build the plugin
./gradlew clean build publishToMavenLocal

# Test in a sample project
cd ../test-project
./gradlew generateOutputAdapter --name=MyAdapter --entity=MyEntity --type=mynewtype
```

### 5. Commit Your Changes

Follow conventional commits:

```bash
git add .
git commit -m "feat: add Cassandra adapter template"
# or
git commit -m "fix: correct Redis template package name"
# or
git commit -m "docs: improve adapter documentation"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### 6. Push and Create Pull Request

```bash
git push origin feature/my-new-feature
```

Then create a Pull Request on GitHub.

## 📝 Pull Request Guidelines

### PR Title

Use conventional commit format:
```
feat: add Cassandra driven adapter
fix: correct package naming in MongoDB template
docs: add guide for custom adapters
```

### PR Description

Include:

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (please describe)

## Changes Made
- Added Cassandra adapter template
- Updated documentation
- Added tests

## Testing
- [ ] Tested locally
- [ ] Added unit tests
- [ ] Updated integration tests

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed my code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No breaking changes (or documented if necessary)
```

## 🎨 Code Style Guidelines

### Java Code

```java
// Good - Clear naming, proper formatting
@Component
public class UserRepositoryAdapter implements UserRepositoryPort {

  private final ReactiveRedisTemplate<String, UserData> redisTemplate;
  private final UserMapper mapper;
  private static final String KEY_PREFIX = "user:";

  public UserRepositoryAdapter(
      ReactiveRedisTemplate<String, UserData> redisTemplate,
      UserMapper mapper) {
    this.redisTemplate = redisTemplate;
    this.mapper = mapper;
  }

  @Override
  public Mono<User> save(User entity) {
    UserData data = mapper.toData(entity);
    String key = KEY_PREFIX + entity.getId();
    
    return redisTemplate.opsForValue()
        .set(key, data)
        .thenReturn(entity);
  }
}
```

### Freemarker Templates

```java
// Good - Clear structure, proper indentation
package ${packageName};

import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

/**
 * ${adapterName} adapter for ${entityName}.
 * Implements the output port using ${technology}.
 */
@Component
public class ${adapterName}Adapter implements ${portName} {

  private final ${technology}Template template;
  private final ${entityName}Mapper mapper;

  public ${adapterName}Adapter(
      ${technology}Template template,
      ${entityName}Mapper mapper) {
    this.template = template;
    this.mapper = mapper;
  }

  @Override
  public Mono<${entityName}> save(${entityName} entity) {
    // Implementation
  }
}
```

## 🧪 Testing Guidelines

### Unit Tests

```java
@ExtendWith(MockitoExtension.class)
class UserRepositoryAdapterTest {

  @Mock
  private ReactiveRedisTemplate<String, UserData> redisTemplate;

  @Mock
  private UserMapper mapper;

  @InjectMocks
  private UserRepositoryAdapter adapter;

  @Test
  void shouldSaveUser() {
    // Given
    User user = new User("1", "John", "john@example.com");
    UserData userData = new UserData("1", "John", "john@example.com");
    
    when(mapper.toData(user)).thenReturn(userData);
    when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    when(valueOperations.set(anyString(), any())).thenReturn(Mono.just(true));

    // When
    Mono<User> result = adapter.save(user);

    // Then
    StepVerifier.create(result)
        .expectNext(user)
        .verifyComplete();
  }
}
```

### Integration Tests

```java
@SpringBootTest
@Testcontainers
class UserRepositoryAdapterIntegrationTest {

  @Container
  static GenericContainer<?> redis = new GenericContainer<>("redis:7-alpine")
      .withExposedPorts(6379);

  @Autowired
  private UserRepositoryAdapter adapter;

  @Test
  void shouldSaveAndRetrieveUser() {
    // Test implementation
  }
}
```

## 📚 Documentation Guidelines

### Code Comments

```java
/**
 * Saves a user to Redis cache.
 * 
 * @param entity the user entity to save
 * @return a Mono emitting the saved user
 */
public Mono<User> save(User entity) {
  // Implementation
}
```

### Markdown Documentation

```markdown
# Title

Brief description of what this does.

## Usage

\`\`\`bash
./gradlew command --param=value
\`\`\`

## Parameters

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `--name` | Yes | Adapter name | `UserRepository` |

## Examples

### Basic Example

\`\`\`bash
./gradlew generateOutputAdapter --name=User --type=redis
\`\`\`

## Generated Files

1. **Adapter**: `UserRepositoryAdapter.java`
2. **Mapper**: `UserMapper.java`
3. **Data Entity**: `UserData.java`
```

## 🏗️ Architecture Guidelines

### Naming Conventions

#### Driven Adapters (Output)

Located in: `infrastructure/driven-adapters/{technology}/`

```
UserRepositoryRedisAdapter.java      ✅ Good
UserRedisAdapter.java                ✅ Good
RedisUserAdapter.java                ❌ Avoid
UserAdapter.java                     ❌ Too generic
```

#### Entry Points (Input)

Located in: `infrastructure/entry-points/{type}/`

```
UserController.java                  ✅ Good
UserRestController.java              ✅ Good
RestUserController.java              ❌ Avoid
UserEndpoint.java                    ❌ Unclear
```

### Package Structure

```
com.company.service/
├── domain/
│   ├── model/                       # Entities
│   ├── port/
│   │   ├── in/                      # Input ports (use cases)
│   │   └── out/                     # Output ports
│   └── usecase/                     # Use case implementations
│
└── infrastructure/
    ├── driven-adapters/             # Output adapters
    │   ├── redis/
    │   ├── mongodb/
    │   └── postgresql/
    │
    ├── entry-points/                # Input adapters
    │   ├── rest/
    │   ├── graphql/
    │   └── kafka/
    │
    └── config/
```

## 🔍 Review Process

### What We Look For

1. **Code Quality**
   - Clean, readable code
   - Proper error handling
   - No code smells

2. **Tests**
   - Unit tests for new code
   - Integration tests where applicable
   - Test coverage >80%

3. **Documentation**
   - Clear comments
   - Updated README/docs
   - Examples provided

4. **Compatibility**
   - Works with supported versions
   - No breaking changes (or documented)
   - Backward compatible

### Review Timeline

- Initial review: Within 3-5 business days
- Follow-up reviews: Within 2 business days
- Merge: After approval from 2 maintainers

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Run command '...'
2. See error

**Expected behavior**
What you expected to happen.

**Actual behavior**
What actually happened.

**Environment:**
- Plugin version: [e.g., 0.1.14-SNAPSHOT]
- Java version: [e.g., 21]
- Gradle version: [e.g., 8.5]
- OS: [e.g., macOS 14.0]

**Additional context**
Any other relevant information.
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Any other relevant information.
```

## 📞 Getting Help

### Community Channels

- **GitHub Discussions**: For questions and discussions
- **GitHub Issues**: For bugs and feature requests
- **Documentation**: Check our comprehensive docs first

### Maintainers

- Review PRs
- Triage issues
- Release new versions
- Maintain documentation

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

---

**Next Steps:**
- [Adding a New Adapter](adding-adapters)
- [Adding a New Command](adding-commands)
- [Modifying Templates](modifying-templates)
