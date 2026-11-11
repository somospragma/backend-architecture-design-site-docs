---
title: Cuánto cuesta cada log
description: El costo medido de pragma-log por evento, de dónde sale y cómo reducirlo.
sidebar:
  order: 41
---

pragma-log hace más trabajo por log que un encoder JSON común: recorre los objetos para enmascararlos y revisa los nombres sensibles. Esta página muestra cuánto cuesta y cuándo importa.

## Lo que se midió

Los benchmarks JMH del repositorio miden solo el encoding de un evento, sin escribirlo: el costo que la librería agrega a cada log. Se compararon contra `logstash-logback-encoder`, un encoder JSON muy usado.

| Escenario | logstash-logback-encoder | pragma-log | Diferencia |
|---|---|---|---|
| Mensaje simple con MDC | 383 ns | 565 ns | 1,5× |
| Objeto en `{}` (record de 4 campos) | 454 ns | 1.343 ns | 3,0× |
| Objeto como key-value | — | 1.474 ns | — |

Medido en un Apple M4 con OpenJDK 21, promedio por evento. La comparación con objetos no es equivalente: logstash-logback-encoder usa el `toString()` del objeto y no enmascara nada; pragma-log lo convierte a JSON y aplica el masking.

## Qué significa para tu servicio

- El costo fijo, unos 180 ns por log, viene de revisar los nombres sensibles del MDC y escribir los campos fijos.
- Enmascarar un objeto cuesta unos 800 ns más. No hay una forma segura de loguear un objeto sin recorrerlo.
- 1,5 µs por log equivale a cerca del 0,15 % de un núcleo para un servicio que escribe 1.000 logs por segundo.

Para la mayoría de los servicios la diferencia no se nota frente al costo de escribir el log en la consola o en un archivo.

## Cómo reducir el costo

- **Usa el [logging asíncrono](../async/)** si el logging aparece en tus perfiles: el hilo que atiende el request no espera el masking ni la escritura.
- **Mantén corta la lista de [patrones](../masking/#busca-datos-dentro-del-texto-con-patrones).** Cada patrón recorre el texto de cada log.
- **Loguea solo lo que necesitas.** Un objeto grande cuesta más que sus dos campos relevantes como key-values.
- **Activa los bodies HTTP solo donde hacen falta.** Son los objetos más grandes que pasan por el masking.

## Mídelo tú

Los benchmarks están en el [repositorio](https://github.com/somospragma/pragma-log-lib/tree/main/benchmarks):

```bash
./gradlew :benchmarks:jmh
```

Para una corrida rápida filtrando por nombre:

```bash
./gradlew :benchmarks:jmh -PjmhArgs="-wi 1 -i 2 -f 1 Masked"
```
