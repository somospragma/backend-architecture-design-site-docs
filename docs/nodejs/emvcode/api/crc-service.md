# CRCService

Servicio para cálculo y validación de CRC16-CCITT (Cyclic Redundancy Check).

## Importación

```typescript
import { CRCService } from "emvcode";
```

## Métodos

### calculateCRC16(data)

Calcula el CRC16-CCITT de una cadena de texto.

**Parámetros:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `data` | `string` | Cadena de texto para calcular el CRC |

**Retorna:** `string` — CRC de 4 caracteres hexadecimales en mayúsculas.

```typescript
const crc = CRCService.calculateCRC16("00020101021152045411");
console.log(crc); // 'A1B2' (ejemplo)
```

:::info Algoritmo
Usa el polinomio CRC16-CCITT (`0x1021`) con valor inicial `0xFFFF`, que es el estándar definido por EMVCo para códigos QR de pago.
:::

### validateCRC16(qrData)

Valida que el CRC de un string QR sea correcto.

**Parámetros:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `qrData` | `string` | String QR completo incluyendo el CRC al final |

**Retorna:** `boolean` — `true` si el CRC es válido.

```typescript
const isValid = CRCService.validateCRC16(qrString);

if (!isValid) {
  console.error("CRC inválido — el QR puede estar corrupto");
}
```

:::tip Uso automático
No necesitas calcular el CRC manualmente al usar los builders. El método `build()` lo agrega automáticamente como tag `63`.
:::

## Ejemplo: Validación de QR Recibido

```typescript
import { CRCService } from "emvcode";

function validarQRRecibido(qrString: string): boolean {
  if (qrString.length < 4) {
    console.error("QR demasiado corto");
    return false;
  }

  if (!CRCService.validateCRC16(qrString)) {
    console.error("CRC inválido");
    return false;
  }

  return true;
}
```

## Aliases (Compatibilidad)

```typescript
import { Crc } from "emvcode";      // Alias
import { CRCUtils } from "emvcode"; // Alias
```
