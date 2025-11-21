# Documentación de API - Dashboard de Monitoreo de Flotas

Esta documentación describe los endpoints y formatos de datos que la API debe proporcionar para que el dashboard de monitoreo funcione correctamente.

## 📋 Índice

- [Endpoints](#endpoints)
- [Formatos de Datos](#formatos-de-datos)
- [Ejemplos de Respuestas](#ejemplos-de-respuestas)
- [Notas Importantes](#notas-importantes)

---

## Endpoints

### 1. Obtener Rutas de Buses Activas

**Endpoint:** `GET /api/routes`

**Descripción:** Retorna todas las rutas de buses activas con su posición actual, segmentos completados y pendientes.

**Headers:**

```
Content-Type: application/json
Authorization: Bearer {token}  // Si se requiere autenticación
```

**Response Status:** `200 OK`

---

### 2. Obtener Alertas

**Endpoint:** `GET /api/alerts`

**Descripción:** Retorna todas las alertas activas del sistema, ordenadas por timestamp (más recientes primero).

**Query Parameters (Opcionales):**

- `limit` (number): Número máximo de alertas a retornar. Por defecto: sin límite.
- `unread` (boolean): Si es `true`, solo retorna alertas no leídas. Por defecto: `false`.
- `priority` (string): Filtro por prioridad (`alta`, `media`, `baja`). Por defecto: todas.
- `type` (string): Filtro por tipo de alerta. Por defecto: todas.

**Headers:**

```
Content-Type: application/json
Authorization: Bearer {token}  // Si se requiere autenticación
```

**Response Status:** `200 OK`

---

### 3. Marcar Alerta como Leída

**Endpoint:** `PATCH /api/alerts/:alertId/read`

**Descripción:** Marca una alerta específica como leída.

**Path Parameters:**

- `alertId` (string): ID de la alerta a marcar como leída.

**Headers:**

```
Content-Type: application/json
Authorization: Bearer {token}  // Si se requiere autenticación
```

**Response Status:** `200 OK`

---

### 4. Eliminar Alerta

**Endpoint:** `DELETE /api/alerts/:alertId`

**Descripción:** Elimina una alerta específica del sistema.

**Path Parameters:**

- `alertId` (string): ID de la alerta a eliminar.

**Headers:**

```
Content-Type: application/json
Authorization: Bearer {token}  // Si se requiere autenticación
```

**Response Status:** `200 OK` o `204 No Content`

---

### 5. Marcar Todas las Alertas como Leídas

**Endpoint:** `PATCH /api/alerts/read-all`

**Descripción:** Marca todas las alertas como leídas.

**Headers:**

```
Content-Type: application/json
Authorization: Bearer {token}  // Si se requiere autenticación
```

**Response Status:** `200 OK`

---

### 6. Eliminar Todas las Alertas

**Endpoint:** `DELETE /api/alerts`

**Descripción:** Elimina todas las alertas del sistema.

**Headers:**

```
Content-Type: application/json
Authorization: Bearer {token}  // Si se requiere autenticación
```

**Response Status:** `200 OK` o `204 No Content`

---

## Formatos de Datos

### BusRoute (Ruta de Bus)

Representa una ruta activa de un bus con su posición actual y progreso.

```typescript
{
  id: string;                    // ID único de la ruta (ej: "route-13g-Bus 1")
  routeId: string;               // ID de la ruta (ej: "13g", "5a")
  unitId: string;                // ID de la unidad/bus (ej: "Bus 1", "Bus Hannover 5")
  routeName: string;             // Nombre descriptivo de la ruta (ej: "Ruta 13g")
  completedSegments: RouteSegment[];  // Segmentos de ruta ya completados
  remainingSegments: RouteSegment[];  // Segmentos de ruta pendientes
  currentPosition: BusPosition;  // Posición actual del bus
  rideStart: string;             // Fecha/hora de inicio del viaje (ISO 8601)
  rideEnd: string;               // Fecha/hora de fin del viaje (ISO 8601)
  delay: number;                 // Retraso en minutos (negativo = adelantado, positivo = retrasado)
}
```

**RouteSegment:**

```typescript
{
  lat: number; // Latitud (ej: -33.4489)
  lng: number; // Longitud (ej: -70.6693)
}
```

**BusPosition:**

```typescript
{
  lat: number; // Latitud (ej: -33.4489)
  lng: number; // Longitud (ej: -70.6693)
  timestamp: string; // Fecha/hora de la posición (ISO 8601)
}
```

---

### Alert (Alerta)

Representa una alerta generada por el sistema de monitoreo.

```typescript
{
  id: string; // ID único de la alerta
  type: AlertType; // Tipo de alerta (ver tipos abajo)
  priority: AlertPriority; // Prioridad de la alerta (ver prioridades abajo)
  timestamp: string; // Fecha/hora de la alerta (ISO 8601)
  unitId: string; // ID de la unidad/bus relacionada
  routeId: string; // ID de la ruta relacionada
  rideStart: string; // Fecha/hora de inicio del viaje (ISO 8601)
  rideEnd: string; // Fecha/hora de fin del viaje (ISO 8601)
  details: AlertDetails; // Detalles específicos de la alerta
  isRead: boolean; // Indica si la alerta ha sido leída
}
```

**AlertType:**

- `"exceso_velocidad"` - Exceso de velocidad detectado
- `"detencion_no_autorizada"` - Detención no autorizada
- `"salida_ruta"` - Salida de ruta detectada
- `"perdida_senal"` - Pérdida de señal GPS

**AlertPriority:**

- `"alta"` - Prioridad alta
- `"media"` - Prioridad media
- `"baja"` - Prioridad baja

**AlertDetails:**

```typescript
{
  delay?: number;              // Retraso en minutos (opcional)
  stopSkipped?: number;       // Número de paradas omitidas (opcional)
  speed?: number;             // Velocidad en km/h (opcional, para exceso_velocidad)
  location?: {                 // Ubicación donde ocurrió la alerta (opcional)
    lat: number;
    lng: number;
  };
}
```

---

## Ejemplos de Respuestas

### GET /api/routes

```json
{
  "routes": [
    {
      "id": "route-13g-Bus 1",
      "routeId": "13g",
      "unitId": "Bus 1",
      "routeName": "Ruta 13g",
      "completedSegments": [
        { "lat": -33.4489, "lng": -70.6693 },
        { "lat": -33.449, "lng": -70.6694 },
        { "lat": -33.4491, "lng": -70.6695 }
      ],
      "remainingSegments": [
        { "lat": -33.4492, "lng": -70.6696 },
        { "lat": -33.4493, "lng": -70.6697 },
        { "lat": -33.4494, "lng": -70.6698 }
      ],
      "currentPosition": {
        "lat": -33.4491,
        "lng": -70.6695,
        "timestamp": "2024-01-15T17:23:43.000Z"
      },
      "rideStart": "2024-01-15T17:19:00.000Z",
      "rideEnd": "2024-01-15T17:41:00.000Z",
      "delay": -2
    },
    {
      "id": "route-5a-Bus 2",
      "routeId": "5a",
      "unitId": "Bus 2",
      "routeName": "Ruta 5a",
      "completedSegments": [
        { "lat": -33.45, "lng": -70.67 },
        { "lat": -33.4501, "lng": -70.6701 }
      ],
      "remainingSegments": [
        { "lat": -33.4502, "lng": -70.6702 },
        { "lat": -33.4503, "lng": -70.6703 },
        { "lat": -33.4504, "lng": -70.6704 }
      ],
      "currentPosition": {
        "lat": -33.4501,
        "lng": -70.6701,
        "timestamp": "2024-01-15T17:25:00.000Z"
      },
      "rideStart": "2024-01-15T17:20:00.000Z",
      "rideEnd": "2024-01-15T17:45:00.000Z",
      "delay": 3
    }
  ]
}
```

### GET /api/alerts

```json
{
  "alerts": [
    {
      "id": "alert-1705335823000-abc123",
      "type": "exceso_velocidad",
      "priority": "alta",
      "timestamp": "2024-01-15T17:23:43.000Z",
      "unitId": "Bus 1",
      "routeId": "13g",
      "rideStart": "2024-01-15T17:19:00.000Z",
      "rideEnd": "2024-01-15T17:41:00.000Z",
      "details": {
        "speed": 85,
        "delay": -2,
        "location": {
          "lat": -33.4491,
          "lng": -70.6695
        }
      },
      "isRead": false
    },
    {
      "id": "alert-1705335803000-def456",
      "type": "detencion_no_autorizada",
      "priority": "media",
      "timestamp": "2024-01-15T17:22:03.000Z",
      "unitId": "Bus 1",
      "routeId": "13g",
      "rideStart": "2024-01-15T17:19:00.000Z",
      "rideEnd": "2024-01-15T17:41:00.000Z",
      "details": {
        "stopSkipped": 1,
        "delay": -2,
        "location": {
          "lat": -33.4485,
          "lng": -70.6689
        }
      },
      "isRead": false
    },
    {
      "id": "alert-1705335723000-ghi789",
      "type": "perdida_senal",
      "priority": "baja",
      "timestamp": "2024-01-15T17:17:03.000Z",
      "unitId": "Bus 2",
      "routeId": "5a",
      "rideStart": "2024-01-15T17:15:00.000Z",
      "rideEnd": "2024-01-15T17:36:00.000Z",
      "details": {
        "location": {
          "lat": -33.45,
          "lng": -70.67
        }
      },
      "isRead": true
    }
  ]
}
```

### PATCH /api/alerts/:alertId/read

**Request:**

```json
{}
```

**Response:**

```json
{
  "success": true,
  "message": "Alerta marcada como leída",
  "alert": {
    "id": "alert-1705335823000-abc123",
    "isRead": true
  }
}
```

### DELETE /api/alerts/:alertId

**Response:**

```json
{
  "success": true,
  "message": "Alerta eliminada correctamente"
}
```

---

## Notas Importantes

### Formato de Fechas

**Todas las fechas deben enviarse en formato ISO 8601 (UTC):**

- Formato: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Ejemplo: `2024-01-15T17:23:43.000Z`

El frontend convertirá automáticamente estas fechas a objetos `Date` de JavaScript.

### Coordenadas GPS

- **Latitud (lat):** Debe estar en el rango `-90` a `90`
- **Longitud (lng):** Debe estar en el rango `-180` a `180`
- Se recomienda usar al menos 4 decimales para precisión (ej: `-33.4489`)

### Segmentos de Ruta

- Los `completedSegments` representan la parte de la ruta que el bus ya ha recorrido
- Los `remainingSegments` representan la parte de la ruta que aún falta por recorrer
- Los segmentos deben estar ordenados secuencialmente desde el inicio hasta el final de la ruta
- Cada segmento debe contener al menos 2 puntos para poder dibujar una línea en el mapa

### Retraso (Delay)

- **Valor negativo:** El bus está adelantado (ej: `-2` = 2 minutos adelantado)
- **Valor positivo:** El bus está retrasado (ej: `3` = 3 minutos retrasado)
- **Valor cero:** El bus está en horario

### IDs Únicos

- Los `id` de rutas y alertas deben ser únicos en todo el sistema
- Se recomienda usar formatos como:
  - Rutas: `route-{routeId}-{unitId}`
  - Alertas: `alert-{timestamp}-{random}`

### Relación entre Alertas y Rutas

- Las alertas deben tener `unitId` y `routeId` que coincidan con las rutas activas
- El frontend usa esta relación para:
  - Mostrar qué buses tienen alertas (iconos rojos)
  - Centrar el mapa cuando se selecciona una alerta
  - Filtrar alertas por bus

### Ordenamiento de Alertas

- Las alertas deben estar ordenadas por `timestamp` descendente (más recientes primero)
- Esto asegura que las alertas más importantes aparezcan en la parte superior del panel

### Actualización en Tiempo Real

Si la API soporta WebSockets o Server-Sent Events (SSE), se recomienda implementar actualizaciones en tiempo real para:

- Posiciones actualizadas de los buses
- Nuevas alertas generadas
- Cambios en el estado de las alertas

**Ejemplo de estructura para WebSocket:**

```json
{
  "type": "route_update" | "alert_new" | "alert_updated" | "alert_deleted",
  "data": { /* objeto Route o Alert */ }
}
```

---

## Manejo de Errores

### Códigos de Estado HTTP

- `200 OK` - Solicitud exitosa
- `400 Bad Request` - Datos inválidos en la solicitud
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No autorizado
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

### Formato de Error

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje descriptivo del error",
    "details": {} // Opcional: detalles adicionales del error
  }
}
```

---

## Consideraciones de Rendimiento

1. **Paginación:** Para grandes volúmenes de datos, considerar implementar paginación en los endpoints
2. **Caché:** Implementar headers de caché apropiados (`Cache-Control`, `ETag`)
3. **Compresión:** Usar compresión gzip para respuestas grandes
4. **Rate Limiting:** Implementar límites de tasa para prevenir abusos

---
