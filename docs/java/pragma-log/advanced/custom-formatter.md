---
sidebar_position: 2
title: Formatter Personalizado
---

# Crear un Formatter Personalizado

Puedes crear tu propio formato de log extendiendo `LogFormatter`.

## Pasos

### 1. Extender LogFormatter

```java
import co.pragma.logging.core.formatter.LogFormatter;
import java.util.Map;

public class XmlFormatter extends LogFormatter {

    public XmlFormatter() {
        super(); // Carga config automáticamente del singleton
    }

    @Override
    protected String convertToString(Map<String, Object> orderedFields) {
        StringBuilder xml = new StringBuilder("<log>");

        for (Map.Entry<String, Object> entry : orderedFields.entrySet()) {
            if (entry.getValue() != null) {
                xml.append("<").append(entry.getKey()).append(">")
                   .append(escapeXml(entry.getValue().toString()))
                   .append("</").append(entry.getKey()).append(">");
            }
        }

        xml.append("</log>");
        return xml.toString();
    }

    private String escapeXml(String text) {
        return text.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;");
    }
}
```

### 2. (Opcional) Override de colores

```java
@Override
protected String applyColors(String formattedLog, LogLevel level) {
    // Solo si tu formato es para consola
    return formattedLog; // Sin colores por defecto
}
```

## Lo que NO necesitas implementar

El pipeline base ya hace por ti:
- ✅ Validación de campos requeridos
- ✅ Transformación de campos (hide, rename, order)
- ✅ Masking de datos sensibles
- ✅ Formateo de excepciones
- ✅ Truncado de textos
- ✅ Validación de tamaño + hooks

Tu formatter solo convierte el `Map<String, Object>` final a String.

## El Map que recibes

`orderedFields` ya tiene:
- Campos en el orden configurado
- Campos ocultos eliminados
- Campos renombrados
- Valores enmascarados
- Excepciones convertidas a String
- Textos truncados

Solo necesitas iterar y producir tu formato de salida.
