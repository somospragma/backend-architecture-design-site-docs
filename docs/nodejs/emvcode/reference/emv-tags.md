# Referencia de Tags EMV

Tabla completa de tags EMVCo soportados por EMVCode, basada en la especificación EMVCo QR Code v1.4 con extensiones propietarias para Colombia.

## Estructura TLV

Cada campo en un QR EMVCo sigue el formato **Tag-Length-Value**:

```
Tag (2 dígitos) + Length (2 dígitos) + Value (variable)

Ejemplo: 59 09 MI TIENDA
         ── ── ─────────
         Tag Len Value (Merchant Name, 9 caracteres)
```

## Tags Principales (00-64)

| Tag | Tipo | Descripción | Requerido | Máx. Long. |
|-----|------|-------------|-----------|------------|
| `00` | Simple | Payload Format Indicator | ✅ | 2 |
| `01` | Simple | Point of Initiation Method (`11`=estático, `12`=dinámico) | ✅ | 2 |
| `02-25` | Simple | Reservado para EMVCo | ❌ | — |
| `26-51` | Template | Merchant Account Information | ❌ | — |
| `52` | Simple | Merchant Category Code (MCC) | ✅ | 4 |
| `53` | Simple | Transaction Currency (ISO 4217) | ✅ | 3 |
| `54` | Simple | Transaction Amount | ❌ | 13 |
| `55` | Simple | Tip or Convenience Indicator | ❌ | 2 |
| `56` | Simple | Value of Convenience Fee Fixed | ❌ | 13 |
| `57` | Simple | Value of Convenience Fee Percentage | ❌ | 5 |
| `58` | Simple | Country Code (ISO 3166-1) | ✅ | 2 |
| `59` | Simple | Merchant Name | ✅ | 25 |
| `60` | Simple | Merchant City | ✅ | 15 |
| `61` | Simple | Postal Code | ✅ | 10 |
| `62` | Template | Additional Data Field Template | ❌ | — |
| `63` | Simple | CRC (calculado automáticamente) | ✅ | 4 |
| `64` | Template | Merchant Information – Language Template | ❌ | — |

## Sub-tags de Merchant Account Information (Tag 26)

| Sub-tag | Descripción | EMVField |
|---------|-------------|----------|
| `00` | Globally Unique Identifier (GUI) | `MERCHANT_ACCOUNT_GUI` |
| `01` | Merchant Account ID | `MERCHANT_ACCOUNT_ID` |
| `02` | Merchant Mobile | `MERCHANT_ACCOUNT_MOBILE` |
| `03` | Merchant Email | `MERCHANT_ACCOUNT_EMAIL` |
| `04` | Merchant Alphanumeric | `MERCHANT_ACCOUNT_ALPHANUMERIC` |
| `05` | Merchant ID | `MERCHANT_ACCOUNT_MERCHANT_ID` |

## Sub-tags de Additional Data (Tag 62)

| Sub-tag | Descripción | EMVField |
|---------|-------------|----------|
| `01` | Bill Number | `ADDITIONAL_BILL_NUMBER` |
| `02` | Mobile Number | `ADDITIONAL_MOBILE_NUMBER` |
| `03` | Store Label | `ADDITIONAL_STORE_LABEL` |
| `04` | Loyalty Number | `ADDITIONAL_LOYALTY_NUMBER` |
| `05` | Reference Label | `ADDITIONAL_REFERENCE_LABEL` |
| `06` | Customer Label | `ADDITIONAL_CUSTOMER_LABEL` |
| `07` | Terminal Label | `ADDITIONAL_TERMINAL_LABEL` |
| `08` | Purpose of Transaction | `ADDITIONAL_PURPOSE` |
| `09` | Consumer Data Request | `ADDITIONAL_CONSUMER_DATA` |
| `10` | Merchant Tax ID | `ADDITIONAL_MERCHANT_TAX_ID` |
| `11` | Channel Origin | `ADDITIONAL_CHANNEL_ORIGIN` |

## Sub-tags de Language Template (Tag 64)

| Sub-tag | Descripción | EMVField |
|---------|-------------|----------|
| `00` | Language Preference (ISO 639) | `LANGUAGE_PREFERENCE` |
| `01` | Merchant Name (alternativo) | `MERCHANT_NAME_ALT` |
| `02` | Merchant City (alternativo) | `MERCHANT_CITY_ALT` |

## Tags Propietarios Colombia (80-99)

| Tag | Sub-tag | Descripción | EMVField |
|-----|---------|-------------|----------|
| `80` | `00` | Channel GUI | `CHANNEL_GUI` |
| `80` | `01` | Channel | `CHANNEL` |
| `81` | `00` | VAT Condition GUI | `VAT_CONDITION_GUI` |
| `81` | `01` | VAT Condition (`01`/`02`/`03`) | `VAT_CONDITION` |
| `82` | `00` | VAT Value GUI | `VAT_VALUE_GUI` |
| `82` | `01` | VAT Value | `VAT_VALUE` |
| `83` | `00` | VAT Base GUI | `VAT_BASE_GUI` |
| `83` | `01` | VAT Base | `VAT_BASE` |
| `84` | `00` | INC Condition GUI | `INC_CONDITION_GUI` |
| `84` | `01` | INC Condition (`01`/`02`/`03`) | `INC_CONDITION` |
| `85` | `00` | INC Value GUI | `INC_VALUE_GUI` |
| `85` | `01` | INC Value | `INC_VALUE` |
| `90` | `00` | Transaction ID GUI | `TRANSACTION_ID_GUI` |
| `90` | `01` | Transaction ID | `TRANSACTION_ID` |
| `91` | `00` | Security Hash GUI | `SECURITY_HASH_GUI` |
| `91` | `01` | Security Hash (SHA-256) | `SECURITY_HASH` |
| `92` | `01` | Service Code | `SERVICE_CODE` |
| `93` | `00` | Reference/Mobile GUI | `REFERENCE_OR_MOBILE_GUI` |
| `93` | `01` | Reference/Mobile | `REFERENCE_OR_MOBILE` |
| `94` | `01` | Product Type (Recaudo) | `PRODUCT_TYPE_RECAUDO` |
| `95` | `01` | Origin Account | `ORIGIN_ACCOUNT` |
| `96` | `01` | Destination Account | `DESTINATION_ACCOUNT` |
| `97` | `01` | Destination Account Ref | `DESTINATION_ACCOUNT_REF` |
| `98` | `01` | Product Type (Transfer) | `PRODUCT_TYPE_TRANSFER` |
| `99` | `00` | Discount Application GUI | `DISCOUNT_APPLICATION_GUI` |
| `99` | `01` | Discount Application | `DISCOUNT_APPLICATION` |

## Códigos de Referencia

### Códigos de Moneda (ISO 4217)

| Código | Moneda |
|--------|--------|
| `170` | COP (Peso Colombiano) |
| `840` | USD (Dólar Estadounidense) |
| `484` | MXN (Peso Mexicano) |
| `604` | PEN (Sol Peruano) |
| `032` | ARS (Peso Argentino) |
| `986` | BRL (Real Brasileño) |

### Códigos de País (ISO 3166-1)

| Código | País |
|--------|------|
| `CO` | Colombia |
| `US` | Estados Unidos |
| `MX` | México |
| `PE` | Perú |
| `AR` | Argentina |
| `BR` | Brasil |

### MCC Comunes (Merchant Category Code)

| MCC | Categoría |
|-----|-----------|
| `4111` | Transporte |
| `5411` | Supermercados |
| `5812` | Restaurantes |
| `5999` | Tiendas misceláneas |
| `7011` | Hoteles |
| `7299` | Servicios varios |

## Enlaces Externos

- [Especificación EMVCo QR Code](https://www.emvco.com/emv-technologies/qrcodes/)
- [ISO 4217 — Códigos de Moneda](https://www.iso.org/iso-4217-currency-codes.html)
- [ISO 3166-1 — Códigos de País](https://www.iso.org/iso-3166-country-codes.html)
