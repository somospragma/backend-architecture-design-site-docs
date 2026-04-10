# EMVCoContentSemanticBuilder

Constructor semántico con métodos descriptivos para mayor legibilidad. **Recomendado** para la mayoría de casos de uso.

## Importación

```typescript
import { EMVCoContentSemanticBuilder, EMVField } from "emvcode";
```

## Uso Básico

```typescript
const emv = new EMVCoContentSemanticBuilder();

const qrString = emv
  .setPayloadFormatIndicator("01")
  .setDynamicQR()
  .setMerchantCategoryCode("5411")
  .setCurrencyISO4217("170")
  .setTransactionAmount("50000")
  .setCountryCode("CO")
  .setMerchantName("MI TIENDA")
  .setMerchantCity("BOGOTA")
  .build();
```

## Métodos por Categoría

### Configuración Inicial

#### setPayloadFormatIndicator(value)

Establece el indicador de formato del payload (Tag `00`). Siempre debe ser `"01"`.

```typescript
emv.setPayloadFormatIndicator("01");
```

#### setDynamicQR() / setStaticQR()

Define si el QR es dinámico (un solo uso) o estático (múltiples usos). Tag `01`.

```typescript
emv.setDynamicQR();  // Valor "12" — para pagos únicos
emv.setStaticQR();   // Valor "11" — para pagos recurrentes
```

#### setAcquirerNetworkId(value)

Define el identificador de red del adquirente. Se usa como prefijo para los GUIs.

```typescript
emv.setAcquirerNetworkId("COM.CO.MIPAGO");
// Luego: emv.setMerchantAccountGUI(`${emv.acquirerNetworkId}.LLA`)
```

---

### Información de Cuenta del Comercio (Tags 26-51)

#### setMerchantAccountGUI(value)

GUI del comercio. Tag `26`, Sub-tag `00`.

```typescript
emv.setMerchantAccountGUI("COM.CO.MIPAGO.LLA");
```

#### setMerchantAccountId(value, keyType)

ID del comercio con tipo de identificador. Tag `26`, Sub-tag variable.

```typescript
import { EMVField } from "emvcode";

emv.setMerchantAccountId("123456789", EMVField.MERCHANT_ACCOUNT_MERCHANT_ID);
```

**Tipos de identificador disponibles:**

| keyType | Sub-tag | Descripción |
|---------|---------|-------------|
| `EMVField.MERCHANT_ACCOUNT_ID` | `01` | ID genérico |
| `EMVField.MERCHANT_ACCOUNT_MOBILE` | `02` | Número móvil |
| `EMVField.MERCHANT_ACCOUNT_EMAIL` | `03` | Email |
| `EMVField.MERCHANT_ACCOUNT_ALPHANUMERIC` | `04` | Alfanumérico |
| `EMVField.MERCHANT_ACCOUNT_MERCHANT_ID` | `05` | ID del comercio |

#### setNetworkGUI(value) / setNetworkId(value)

Red de pago. Tag `49`.

```typescript
emv.setNetworkGUI("COM.CO.MIPAGO.RED");  // Sub-tag 00
emv.setNetworkId("FULL");                 // Sub-tag 01
```

#### setMerchantCodeGUI(value) / setMerchantCode(value)

Código del comercio. Tag `50`.

```typescript
emv.setMerchantCodeGUI("COM.CO.MIPAGO.CU");  // Sub-tag 00
emv.setMerchantCode("27899526");               // Sub-tag 01
```

#### setAggregatorCodeGUI(value) / setAggregatorCode(value)

Código del agregador. Tag `51`.

```typescript
emv.setAggregatorCodeGUI("COM.CO.MIPAGO.AC");  // Sub-tag 00
emv.setAggregatorCode("27899526");               // Sub-tag 01
```

---

### Información de Transacción (Tags 52-61)

#### setMerchantCategoryCode(value)

Código de categoría del comercio (MCC). Tag `52`.

```typescript
emv.setMerchantCategoryCode("5411"); // Supermercados
// '5812' - Restaurantes | '5999' - Misceláneas | '4111' - Transporte
```

#### setCurrencyISO4217(value)

Código de moneda ISO 4217. Tag `53`.

```typescript
emv.setCurrencyISO4217("170"); // COP
// '840' - USD | '484' - MXN | '604' - PEN
```

#### setTransactionAmount(value)

Monto de la transacción. Tag `54`.

```typescript
emv.setTransactionAmount("50000");
```

#### setTipIndicator(value) / setTipFixedAmount(value) / setTipPercentage(value)

Propina. Tags `55`, `56`, `57`.

```typescript
emv.setTipIndicator("01");     // '01' solicitada | '02' fija | '03' porcentaje
emv.setTipFixedAmount("5000"); // Monto fijo
emv.setTipPercentage("10");    // Porcentaje
```

#### setCountryCode(value)

Código de país ISO 3166-1. Tag `58`.

```typescript
emv.setCountryCode("CO");
```

#### setMerchantName(value) / setMerchantCity(value) / setPostalCode(value)

Información del comercio. Tags `59`, `60`, `61`.

```typescript
emv.setMerchantName("MI TIENDA");  // Máx 25 caracteres
emv.setMerchantCity("BOGOTA");     // Máx 15 caracteres
emv.setPostalCode("110111");       // Máx 10 caracteres
```

---

### Datos Adicionales (Tag 62)

#### setAdditionalBillNumber(value)

Número de factura. Tag `62`, Sub-tag `01`.

```typescript
emv.setAdditionalBillNumber("FACT-2024-001");
```

#### setAdditionalMobileNumber(value)

Número móvil. Tag `62`, Sub-tag `02`.

```typescript
emv.setAdditionalMobileNumber("3001234567");
```

#### setAdditionalStoreLabel(value)

Etiqueta de sucursal. Tag `62`, Sub-tag `03`.

```typescript
emv.setAdditionalStoreLabel("SUCURSAL-01");
```

#### setAdditionalLoyaltyNumber(value)

Número de lealtad. Tag `62`, Sub-tag `04`.

```typescript
emv.setAdditionalLoyaltyNumber("LOYALTY-123");
```

#### setAdditionalReferenceLabel(value)

Etiqueta de referencia. Tag `62`, Sub-tag `05`.

```typescript
emv.setAdditionalReferenceLabel("REF-001");
```

#### setAdditionalCustomerLabel(value)

Etiqueta del cliente. Tag `62`, Sub-tag `06`.

```typescript
emv.setAdditionalCustomerLabel("CLIENTE-VIP");
```

#### setAdditionalTerminalLabel(value)

Etiqueta del terminal. Tag `62`, Sub-tag `07`.

```typescript
emv.setAdditionalTerminalLabel("CAJA-01");
```

#### setAdditionalPurpose(value)

Propósito de la transacción. Tag `62`, Sub-tag `08`.

```typescript
emv.setAdditionalPurpose("00");
```

#### setAdditionalConsumerData(value)

Datos del consumidor. Tag `62`, Sub-tag `09`.

```typescript
emv.setAdditionalConsumerData("ME");
```

#### setAdditionalMerchantTaxId(value)

NIT del comercio. Tag `62`, Sub-tag `10`.

```typescript
emv.setAdditionalMerchantTaxId("900123456");
```

---

### Idioma Alternativo (Tag 64)

#### setLanguagePreference(value)

Código de idioma ISO 639. Tag `64`, Sub-tag `00`.

```typescript
emv.setLanguagePreference("en");
```

#### setMerchantNameAlt(value) / setMerchantCityAlt(value)

Nombre y ciudad en idioma alternativo. Tag `64`, Sub-tags `01`, `02`.

```typescript
emv.setMerchantNameAlt("THE CORNER STORE");
emv.setMerchantCityAlt("BOGOTA");
```

---

### Canal y Origen (Tag 80)

#### setChannelGui(value) / setChannel(value)

Canal de la transacción. Tag `80`.

```typescript
emv.setChannelGui("COM.CO.MIPAGO.CHANNEL");  // Sub-tag 00
emv.setChannel("POS");                        // Sub-tag 01
// Valores comunes: 'POS', 'WEB', 'APP', 'ATM'
```

---

### Impuestos IVA (Tags 81-83)

#### setVATConditionGui(value) / setVATCondition(value)

Condición de IVA. Tag `81`.

```typescript
emv.setVATConditionGui("COM.CO.MIPAGO.CIVAT");  // Sub-tag 00
emv.setVATCondition("02");                        // Sub-tag 01
// '01' - Gravado | '02' - Exento | '03' - Excluido
```

#### setVATValueGui(value) / setVATValue(value)

Valor del IVA. Tag `82`.

```typescript
emv.setVATValueGui("COM.CO.MIPAGO.VAT");  // Sub-tag 00
emv.setVATValue("9500");                    // Sub-tag 01
```

#### setVATBaseGui(value) / setVATBase(value)

Base gravable del IVA. Tag `83`.

```typescript
emv.setVATBaseGui("COM.CO.MIPAGO.BASE");  // Sub-tag 00
emv.setVATBase("50000");                    // Sub-tag 01
```

---

### Impuesto al Consumo INC (Tags 84-85)

#### setINCConditionGui(value) / setINCCondition(value)

Condición de INC. Tag `84`.

```typescript
emv.setINCConditionGui("COM.CO.MIPAGO.CINC");  // Sub-tag 00
emv.setINCCondition("01");                       // Sub-tag 01
```

#### setINCValueGui(value) / setINCValue(value)

Valor del INC. Tag `85`.

```typescript
emv.setINCValueGui("COM.CO.MIPAGO.INC");  // Sub-tag 00
emv.setINCValue("4000");                    // Sub-tag 01
```

---

### Transacción y Seguridad (Tags 90-91)

#### setTransactionIdGui(value) / setTransactionId(value)

Identificador de transacción. Tag `90`.

```typescript
emv.setTransactionIdGui("COM.CO.MIPAGO.TRXID");  // Sub-tag 00
emv.setTransactionId("TRX-2024-001234");           // Sub-tag 01
```

#### setSecurityHashGui(value) / setSecurityHash(value)

Hash de seguridad. Tag `91`. Ver [HashCodeBuilder](hash-service) para generar el hash.

```typescript
emv.setSecurityHashGui("COM.CO.MIPAGO.SEC");       // Sub-tag 00
emv.setSecurityHash("03BcHg1czs5u7LQGzuo7oNIA");   // Sub-tag 01
```

---

### Otras Operaciones (Tags 92-99)

#### setServiceCode(value)

Código de servicio para recaudo/recarga. Tag `92`.

#### setReferenceOrMobileGui(value) / setReferenceOrMobile(value)

Referencia de cobro o móvil. Tag `93`.

```typescript
emv.setReferenceOrMobileGui("COM.CO.MIPAGO.PREF");  // Sub-tag 00
emv.setReferenceOrMobile("315234");                   // Sub-tag 01
```

#### setProductTypeCollection(value)

Tipo de producto para recaudo. Tag `94`.

#### setOriginAccount(value) / setDestinationAccount(value)

Cuentas para transferencias. Tags `95`, `96`.

#### setDestinationAccountReference(value)

Referencia adicional de cuenta destino. Tag `97`.

#### setProductTypeTransference(value)

Tipo de producto para transferencia. Tag `98`.

#### setDiscountApplicationGui(value) / setDiscountApplication(value)

Descuento aplicado. Tag `99`.

```typescript
emv.setDiscountApplicationGui("COM.CO.MIPAGO.DISC");  // Sub-tag 00
emv.setDiscountApplication("5000");                     // Sub-tag 01
```

---

### build()

Construye y retorna el string del código QR. Mismo comportamiento que [EMVCoContentBuilder.build()](emv-builder#build).

```typescript
const qrString = emv.build();
```

## Aliases (Compatibilidad)

```typescript
import { EMVCoQrContentSemanticBuilder } from "emvcode"; // Alias
```

## Ver También

- [EMVCoContentBuilder](emv-builder) — Builder básico por tags
- [HashCodeBuilder](hash-service) — Generación de hashes de seguridad
- [Referencia de Tags EMV](../reference/emv-tags) — Tabla completa de tags
