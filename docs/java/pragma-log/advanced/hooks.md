---
sidebar_position: 1
title: Hooks y Alertas
---

# Hooks y Alertas

Los hooks permiten recibir notificaciones cuando ocurren eventos especiales en el logging.

## Eventos disponibles

| Evento | Cuándo se dispara |
|--------|-------------------|
| `onLogSizeExceeded` | Cuando un log formateado supera `maxLogSize` |
| `onMaskingError` | Cuando falla el enmascaramiento de un campo |

## Implementar un hook

```java
import co.pragma.logging.core.alert.LogAlertListener;
import co.pragma.logging.core.domain.LogEvent;

public class SlackLogAlertListener implements LogAlertListener {

    @Override
    public void onLogSizeExceeded(LogEvent event, int actualSize, int maxSize) {
        // Enviar alerta a Slack
        String msg = String.format(
            "⚠️ Log excede tamaño máximo: %d/%d chars. Message: %s",
            actualSize, maxSize, event.getMessage()
        );
        slackClient.send("#alerts", msg);
    }

    @Override
    public void onMaskingError(LogEvent event, Exception error) {
        // Reportar a Sentry
        sentry.captureException(error);
    }
}
```

## Registrar hooks

```yaml
# pragma-log-config.yml
maxLogSize: 5000
hooks:
  - com.mycompany.alerts.SlackLogAlertListener
  - com.mycompany.alerts.SentryLogAlertListener
```

Los hooks se instancian por reflexión al iniciar la aplicación. Requisitos:
- Constructor sin argumentos
- Implementar `LogAlertListener`
- Estar en el classpath

## Casos de uso

- Alertar en Slack/Teams cuando se detectan logs muy grandes
- Reportar errores de masking a Sentry/Datadog
- Métricas: contar logs que exceden el umbral
- Auditoría: registrar cuándo se loguean datos que deberían estar enmascarados
