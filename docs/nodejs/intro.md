# Librerías y Herramientas Node.js

Colección de librerías y herramientas para desarrollo backend con Node.js/TypeScript, enfocadas en estándares de la industria de pagos, mejores prácticas y productividad.

## 💳 Pagos y Estándares

### EMVCode

**Herramientas de desarrollo EMVCo para aplicaciones de pago modernas**

Librería TypeScript completa para trabajar con códigos QR EMVCo, tags EMV, validación CRC y generación de códigos de seguridad. Perfecta para desarrollar aplicaciones de pago, billeteras digitales y sistemas de cobro.

**Características principales:**
- ✅ Construcción de QR EMVCo compatible con el estándar EMVCo v1.4
- ✅ Builder Semántico con API intuitiva y métodos descriptivos
- ✅ Validación CRC16-CCITT automática
- ✅ Generación de Hash de Seguridad SHA-256
- ✅ Generación de QR en Base64 y PNG
- ✅ Conversión Binario/Hex
- ✅ TypeScript First con tipado completo

**Casos de uso:**
- Generar códigos QR de pago compatibles con EMVCo
- Construir billeteras digitales y apps de cobro
- Validar integridad de códigos QR con CRC16
- Generar hashes de seguridad para transacciones
- Integrar pagos QR en sistemas POS

**Tecnologías:**
- TypeScript 5.x
- Node.js 16+
- Web Crypto API (compatible con navegadores)

[Ver documentación completa →](./emvcode/intro.md)

---

## ⚡ Serverless y Arquitectura

### Arquetipo Node.js Hexagonal

**Proyecto base serverless con AWS SAM y arquitectura hexagonal**

Arquetipo TypeScript para crear funciones AWS Lambda siguiendo la arquitectura hexagonal (Puertos y Adaptadores) de AWS. Incluye un CRUD completo como ejemplo y es totalmente personalizable.

**Características principales:**
- ✅ Arquitectura Hexagonal con separación en capas (domain, adapters, entrypoints, libraries)
- ✅ AWS SAM para despliegue serverless con Lambda y API Gateway
- ✅ CQRS (Command Query Responsibility Segregation)
- ✅ Validación de schemas con Zod
- ✅ Observabilidad integrada (Logger, Tracer, Metrics)
- ✅ Patrones de diseño: Factory, Proxy, Builder
- ✅ Testing con Jest y cobertura de código
- ✅ Scripts de instalación automatizados

**Casos de uso:**
- Crear microservicios serverless con arquitectura limpia
- APIs REST con AWS Lambda y API Gateway
- Proyectos que requieran separación estricta de responsabilidades
- Equipos que buscan un punto de partida estandarizado

**Tecnologías:**
- TypeScript + Node.js 18+
- AWS SAM + Lambda + API Gateway
- Sequelize / SQLite
- Jest + ESLint (Antfu)

[Ver documentación completa →](./node-hexagonal/intro.md)

---

## 📚 Próximas Librerías

### API Scaffolding Tools (Próximamente)

Herramientas para scaffolding rápido de APIs REST y GraphQL.

### Microservices Utilities (Próximamente)

Utilidades comunes para construir microservicios.

---

## 🎯 Filosofía

Todas nuestras librerías Node.js siguen estos principios:

1. **TypeScript First**: Tipado completo y autocompletado
2. **Clean Architecture**: Separación clara de responsabilidades
3. **Estándares**: Cumplimiento de estándares de la industria (EMVCo, ISO)
4. **Testeable**: Cobertura de tests completa
5. **Multiplataforma**: Compatible con Node.js y navegadores

## 📄 Licencia

Todas las librerías están licenciadas bajo **MIT License**.

- ✅ Uso comercial permitido
- ✅ Modificación y distribución permitida
- 📋 Requiere atribución
