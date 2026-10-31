---
sidebar_position: 3
title: Enmascaramiento (Masking)
---

# Enmascaramiento de Datos Sensibles

La librería enmascara automáticamente campos sensibles cuando logeas objetos. Usa la anotación `@MaskedLogField` en tus DTOs/modelos.

## Uso básico

```java
import co.pragma.logging.core.annotations.MaskedLogField;
import co.pragma.logging.core.masking.MaskType;

public class LoginRequest {

    private String username;

    @MaskedLogField(type = MaskType.FULL)
    private String password;

    @MaskedLogField(type = MaskType.PREFIX, length = 12)
    private String creditCard;

    @MaskedLogField(type = MaskType.HIDDEN)
    private String internalToken;
}
```

Cuando logeas este objeto:
```java
log.info("Login attempt: {}", loginRequest);
```

**Output:**
```json
{
  "message": "Login attempt: {\"username\":\"john\",\"password\":\"*********\",\"creditCard\":\"************9010\"}"
}
```

El campo `internalToken` no aparece (HIDDEN lo elimina completamente).

---

## Tipos de enmascaramiento (`MaskType`)

### PREFIX — Enmascara los primeros N caracteres

```java
@MaskedLogField(type = MaskType.PREFIX, length = 4)
private String phone = "3001234567";
// Resultado: "****234567"
```

### SUFFIX — Enmascara los últimos N caracteres

```java
@MaskedLogField(type = MaskType.SUFFIX, length = 4)
private String email = "john@example.com";
// Resultado: "john@example****"
```

### MIDDLE — Enmascara los caracteres centrales

```java
@MaskedLogField(type = MaskType.MIDDLE, length = 4)
private String cardNumber = "1234567890";
// Resultado: "12****90"
```

### FULL — Enmascara todo el valor

```java
@MaskedLogField(type = MaskType.FULL)
private String password = "secret123";
// Resultado: "*********"
```

### HIDDEN — Elimina el campo completamente del log

```java
@MaskedLogField(type = MaskType.HIDDEN)
private String apiKey = "sk-abc123xyz";
// El campo no aparece en el log
```

### CUSTOM — Usa una estrategia personalizada

```java
@MaskedLogField(type = MaskType.CUSTOM, strategy = "EMAIL")
private String email = "john.doe@example.com";
// Resultado depende de tu implementación
```

---

## Anotación a nivel de clase

Puedes anotar toda la clase para enmascarar su representación completa:

```java
@MaskedLogField(type = MaskType.FULL)
public class SensitivePayload {
    private String token;
    private String secret;
}
// Al loguear: "********************" (todo el toString enmascarado)
```

---

## Configuración YAML

```yaml
masking:
  enabled: true           # Activa/desactiva globalmente
  character: "*"          # Carácter de máscara (default: "-")
  defaultType: FULL       # Tipo por defecto si no se especifica en @MaskedLogField
  defaultLength: 8        # Longitud por defecto para PREFIX/SUFFIX/MIDDLE
  strategies:             # Estrategias personalizadas
    EMAIL: com.mycompany.masking.EmailMaskingStrategy
    CREDIT_CARD: com.mycompany.masking.CreditCardMaskingStrategy
```

---

## Crear estrategias personalizadas

### 1. Implementar la interfaz

```java
import co.pragma.logging.core.masking.MaskingStrategy;

public class EmailMaskingStrategy implements MaskingStrategy {

    @Override
    public String mask(String value, char maskChar, int length) {
        // john.doe@example.com → jo****@example.com
        int atIndex = value.indexOf('@');
        if (atIndex <= 2) return value;

        String prefix = value.substring(0, 2);
        String domain = value.substring(atIndex);
        String masked = String.valueOf(maskChar).repeat(4);

        return prefix + masked + domain;
    }
}
```

### 2. Registrar en configuración

```yaml
masking:
  strategies:
    EMAIL: com.mycompany.masking.EmailMaskingStrategy
```

### 3. Usar en la anotación

```java
@MaskedLogField(type = MaskType.CUSTOM, strategy = "EMAIL")
private String email = "john.doe@example.com";
// Resultado: "jo****@example.com"
```

---

## Comportamiento con objetos anidados

El masking se aplica recursivamente:

```java
public class PaymentRequest {
    private String orderId;

    @MaskedLogField(type = MaskType.FULL)
    private String cvv;

    private CardInfo card;  // Objeto anidado
}

public class CardInfo {
    @MaskedLogField(type = MaskType.PREFIX, length = 12)
    private String number = "4532123456789010";

    private String holderName;
}
```

Al loguear `PaymentRequest`, tanto `cvv` como `card.number` serán enmascarados.

---

## Desactivar masking

Para desactivar completamente:

```yaml
masking:
  enabled: false
```

:::warning Ambientes de desarrollo
En desarrollo puedes desactivar masking para ver los datos completos. **Nunca desactives en producción.**
:::
