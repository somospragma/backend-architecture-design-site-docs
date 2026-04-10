# EMVCoContentBuilder

Constructor básico para crear códigos QR EMVCo usando tags directamente.

## Importación

```typescript
import { EMVCoContentBuilder } from "emvcode";
```

## Uso Básico

```typescript
const emv = new EMVCoContentBuilder();

const qrString = emv
  .setTag("00", "01")
  .setTag("52", "5411")
  .setTag("53", "170")
  .setTag("58", "CO")
  .setTag("59", "MI TIENDA")
  .setTag("60", "BOGOTA")
  .build();
```

## Métodos

### setTag(tag, value)

Establece un tag simple EMV.

**Parámetros:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `tag` | `EMVTag` | Tag EMV de 2 dígitos (`"00"` a `"99"`) |
| `value` | `string` | Valor del tag |

**Retorna:** `this` (permite encadenamiento)

**Errores:**
- `Error` si el tag no está definido en el estándar EMVCo
- `Error` si el tag es de tipo template (usar `setSubTag` en su lugar)
- `Error` si el valor es inválido (vacío, null, undefined)

```typescript
emv
  .setTag("00", "01")       // Payload Format Indicator
  .setTag("01", "12")       // QR Dinámico
  .setTag("52", "5411")     // MCC
  .setTag("53", "170")      // Moneda COP
  .setTag("54", "50000")    // Monto
  .setTag("58", "CO")       // País
  .setTag("59", "MI TIENDA") // Nombre comercio
  .setTag("60", "BOGOTA");  // Ciudad
```

:::warning Validación de longitud
Si el valor excede la longitud máxima del tag según el estándar, se trunca automáticamente. Por ejemplo, el tag `59` (Merchant Name) tiene un máximo de 25 caracteres.
:::

### setSubTag(templateTag, subTag, value)

Establece un sub-tag dentro de un template tag.

**Parámetros:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `templateTag` | `EMVTag` | Tag template padre (`"26"` a `"51"`, `"62"`, `"64"`, `"80"` a `"99"`) |
| `subTag` | `string` | Sub-tag de 2 dígitos |
| `value` | `string` | Valor del sub-tag |

**Retorna:** `this`

**Errores:**
- `Error` si el tag no es de tipo template (usar `setTag` en su lugar)

```typescript
emv
  // Merchant Account Information (tag 26)
  .setSubTag("26", "00", "COM.MIPAGO.ID")  // GUI
  .setSubTag("26", "01", "123456789")       // Merchant ID

  // Additional Data (tag 62)
  .setSubTag("62", "07", "TERMINAL001")     // Terminal Label
  .setSubTag("62", "08", "02")              // Purpose

  // Language Template (tag 64)
  .setSubTag("64", "00", "en")              // Idioma
  .setSubTag("64", "01", "MY STORE");       // Nombre alternativo
```

### build()

Construye y retorna el string del código QR con CRC calculado automáticamente.

**Retorna:** `string` — Cadena TLV completa con CRC16 al final.

```typescript
const qrString = emv.build();
// "000201010212520454115303170540550005802CO5909MI TIENDA6006BOGOTA6304XXXX"
```

:::info Comportamiento
- Los tags se ordenan automáticamente según el estándar EMVCo
- El CRC16-CCITT se calcula y agrega como tag `63` al final
- El builder se limpia después de cada `build()` — puedes reutilizar la instancia
:::

## Ejemplo Completo

```typescript
import { EMVCoContentBuilder } from "emvcode";

const ACQUIRER_ID = "COM.CO.MIPAGO";
const emv = new EMVCoContentBuilder();

emv
  .setTag("00", "01")
  .setTag("01", "12")
  .setTag("52", "5411")
  .setTag("53", "170")
  .setTag("54", "50000")
  .setTag("58", "CO")
  .setTag("59", "MI TIENDA")
  .setTag("60", "BOGOTA")
  .setSubTag("26", "00", `${ACQUIRER_ID}.LLA`)
  .setSubTag("26", "05", "27899526")
  .setSubTag("49", "00", `${ACQUIRER_ID}.RED`)
  .setSubTag("49", "01", "FULL")
  .setSubTag("62", "07", "TERMINAL001")
  .setSubTag("64", "00", "en")
  .setSubTag("64", "01", "MY STORE");

const qrString = emv.build();
```

## Aliases (Compatibilidad)

Para compatibilidad con versiones anteriores, también está disponible como:

```typescript
import { EMVCoQRContentBuilder } from "emvcode"; // Alias
```

## Ver También

- [EMVCoContentSemanticBuilder](semantic-builder) — Builder semántico (recomendado)
- [Referencia de Tags EMV](../reference/emv-tags) — Tabla completa de tags
