# QR de Pago con Impuestos

Guía para generar códigos QR EMVCo que incluyen información de impuestos colombianos (IVA e INC).

## Contexto

En Colombia, los códigos QR de pago pueden incluir información tributaria usando los tags propietarios:

| Tag | Descripción |
|-----|-------------|
| `81` | Condición de IVA |
| `82` | Valor del IVA |
| `83` | Base gravable del IVA |
| `84` | Condición de INC |
| `85` | Valor del INC |

### Condiciones de Impuesto

| Valor | Significado |
|-------|-------------|
| `01` | Gravado |
| `02` | Exento |
| `03` | Excluido |

## Ejemplo: Producto Gravado con IVA 19%

```typescript
import { EMVCoContentSemanticBuilder } from "emvcode";

function generarQRConIVA() {
  const ACQUIRER = "COM.CO.MIPAGO";

  const subtotal = 50000;
  const iva = Math.round(subtotal * 0.19); // 9500
  const total = subtotal + iva;             // 59500

  const emv = new EMVCoContentSemanticBuilder();

  return emv
    .setPayloadFormatIndicator("01")
    .setDynamicQR()
    .setMerchantCategoryCode("5999")
    .setCurrencyISO4217("170")
    .setTransactionAmount(total.toString())
    .setCountryCode("CO")
    .setMerchantName("TIENDA VARIEDADES")
    .setMerchantCity("BARRANQUILLA")
    // IVA
    .setVATConditionGui(`${ACQUIRER}.CIVAT`)
    .setVATCondition("01")                      // Gravado
    .setVATValueGui(`${ACQUIRER}.VAT`)
    .setVATValue(iva.toString())
    .setVATBaseGui(`${ACQUIRER}.BASE`)
    .setVATBase(subtotal.toString())
    .build();
}
```

## Ejemplo: Producto Exento de IVA

```typescript
function generarQRExentoIVA() {
  const ACQUIRER = "COM.CO.MIPAGO";
  const emv = new EMVCoContentSemanticBuilder();

  return emv
    .setPayloadFormatIndicator("01")
    .setDynamicQR()
    .setMerchantCategoryCode("5411")
    .setCurrencyISO4217("170")
    .setTransactionAmount("30000")
    .setCountryCode("CO")
    .setMerchantName("SUPERMERCADO")
    .setMerchantCity("BOGOTA")
    .setVATConditionGui(`${ACQUIRER}.CIVAT`)
    .setVATCondition("02")                      // Exento
    .setVATValueGui(`${ACQUIRER}.VAT`)
    .setVATValue("0")
    .setVATBaseGui(`${ACQUIRER}.BASE`)
    .setVATBase("0")
    .build();
}
```

## Ejemplo: Producto con IVA + INC (Restaurante)

```typescript
function generarQRRestaurante() {
  const ACQUIRER = "COM.CO.MIPAGO";

  const subtotal = 80000;
  const iva = Math.round(subtotal * 0.19);  // 15200
  const inc = Math.round(subtotal * 0.08);  // 6400
  const total = subtotal + iva + inc;        // 101600

  const emv = new EMVCoContentSemanticBuilder();

  return emv
    .setPayloadFormatIndicator("01")
    .setDynamicQR()
    .setMerchantCategoryCode("5812")           // Restaurante
    .setCurrencyISO4217("170")
    .setTransactionAmount(total.toString())
    .setCountryCode("CO")
    .setMerchantName("RESTAURANTE EL SABOR")
    .setMerchantCity("MEDELLIN")
    // IVA
    .setVATConditionGui(`${ACQUIRER}.CIVAT`)
    .setVATCondition("01")
    .setVATValueGui(`${ACQUIRER}.VAT`)
    .setVATValue(iva.toString())
    .setVATBaseGui(`${ACQUIRER}.BASE`)
    .setVATBase(subtotal.toString())
    // INC
    .setINCConditionGui(`${ACQUIRER}.CINC`)
    .setINCCondition("01")
    .setINCValueGui(`${ACQUIRER}.INC`)
    .setINCValue(inc.toString())
    .build();
}
```

## Ver También

- [EMVCoContentSemanticBuilder](../api/semantic-builder) — API completa del builder
- [QR Dinámico con Seguridad](dynamic-qr-security) — Agregar hash de seguridad
- [Referencia de Tags EMV](../reference/emv-tags) — Tabla completa de tags
