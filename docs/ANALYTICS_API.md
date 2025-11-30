## API de Analytics - Panel de Monitoreo de Flota

Esta guía describe **cómo deberían venir los datos desde el backend** para alimentar el panel de `Analytics` (KPIs y gráficos) del dashboard de monitoreo de flota.

La idea es que, cuando se reemplace la data dummy, el frontend pueda usar estas respuestas casi sin transformaciones adicionales.

---

## Consideraciones generales

- **Formato de fechas**: siempre en ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- **Unidades**:
  - Velocidad: km/h.
  - Tiempos: minutos (para `delay`), segundos en timestamps.
- **Zona horaria**: idealmente UTC en la API, la UI se encarga de formatear según la zona deseada.
- **Convención de enums**: usar los mismos strings que en el frontend:
  - `AlertType`:
    - `exceso_velocidad`
    - `detencion_no_autorizada`
    - `salida_ruta`
    - `perdida_senal`
  - `AlertPriority`:
    - `alta`
    - `media`
    - `baja`

---

## 1. Endpoint principal de monitoreo para Analytics

- **URL**: `/api/analytics/monitoring`
- **Método**: `GET`
- **Objetivo**: entregar en una sola llamada los datos necesarios para:
  - KPIs de flota (buses monitoreados, con/sin alertas).
  - Gráfico de alertas en el tiempo (última hora o ventana definida).
  - Gráfico de distribución por tipo de alerta (dona).
  - Gráfico de alertas por prioridad.
  - Comparación de volumen mensual (actual vs anterior).

### 1.1. Request

Query params sugeridos (opcionales):

- `windowMinutes` (number, opcional): ventana de tiempo en minutos para considerar alertas recientes (por defecto: `60`).
- `city` (string, opcional): identificador de ciudad (`"astana"`, `"rio"`, etc.).
- `routeId` (string, opcional): filtrar por ruta específica.

Ejemplo:

```http
GET /api/analytics/monitoring?windowMinutes=60&city=astana
```

### 1.2. Response

```json
{
  "routes": [
    {
      "id": "route-13g-bus-001",
      "routeId": "13g",
      "unitId": "Bus 001",
      "routeName": "Ruta 13G",
      "completedSegments": [
        { "lat": -33.4489, "lng": -70.6693 },
        { "lat": -33.4491, "lng": -70.6685 }
      ],
      "remainingSegments": [
        { "lat": -33.451, "lng": -70.667 },
        { "lat": -33.452, "lng": -70.666 }
      ],
      "currentPosition": {
        "lat": -33.4491,
        "lng": -70.6685,
        "timestamp": "2025-03-10T10:25:30.000Z"
      },
      "rideStart": "2025-03-10T10:05:00.000Z",
      "rideEnd": "2025-03-10T10:45:00.000Z",
      "delay": 3
    }
  ],
  "alerts": [
    {
      "id": "alert-123",
      "type": "exceso_velocidad",
      "priority": "alta",
      "timestamp": "2025-03-10T10:22:15.000Z",
      "unitId": "Bus 001",
      "routeId": "13g",
      "rideStart": "2025-03-10T10:05:00.000Z",
      "rideEnd": "2025-03-10T10:45:00.000Z",
      "details": {
        "delay": 4,
        "stopSkipped": 1,
        "speed": 82.5,
        "location": {
          "lat": -33.4495,
          "lng": -70.6681
        }
      },
      "isRead": false
    }
  ],
  "monthlyComparison": {
    "current": 1250,
    "previous": 980,
    "changePct": 27.6,
    "isIncrease": true
  }
}
```

#### 1.3. Mapeo con el frontend

En el frontend, estos datos se mapean a los tipos existentes:

- `routes` → `BusRoute[]` (`src/shared/types/monitoring.ts`).
- `alerts` → `Alert[]` (`src/shared/types/monitoring.ts`).
- `monthlyComparison` → estructura usada en `AnalyticsPage`:
  - `current`: número de alertas mes actual.
  - `previous`: número de alertas mes anterior.
  - `changePct`: porcentaje de variación.
  - `isIncrease`: `true` si `current >= previous`.

La lógica actual de la página `Analytics` ya sabe cómo:

- Contar buses por `routes.length`.
- Calcular buses con/ sin alertas (`unitId` en `alerts`).
- Construir series de tiempo agrupando `alerts` por timestamp.
- Calcular distribución por tipo (`type`) y por prioridad (`priority`).

> Nota: si se prefiere, el backend puede devolver también series ya agregadas para ahorrar cómputo en frontend, pero con esta respuesta única ya es suficiente para replicar el comportamiento actual.

---

## 2. Endpoint de alertas recientes (compatible con AlertPanel y Analytics)

Este endpoint puede reutilizarse tanto para el `AlertPanel` como para el panel de `Analytics`.

- **URL**: `/api/alerts/recent`
- **Método**: `GET`

### 2.1. Request

Query params sugeridos:

- `limit` (number, opcional): máximo de alertas a retornar (ej. `100`).
- `windowMinutes` (number, opcional): ventana de tiempo hacia atrás (ej. `60`).
- `onlyUnread` (boolean, opcional): si `true`, sólo alertas no leídas.

Ejemplo:

```http
GET /api/alerts/recent?limit=100&windowMinutes=60
```

### 2.2. Response

```json
{
  "alerts": [
    {
      "id": "alert-123",
      "type": "exceso_velocidad",
      "priority": "alta",
      "timestamp": "2025-03-10T10:22:15.000Z",
      "unitId": "Bus 001",
      "routeId": "13g",
      "rideStart": "2025-03-10T10:05:00.000Z",
      "rideEnd": "2025-03-10T10:45:00.000Z",
      "details": {
        "delay": 4,
        "speed": 82.5,
        "location": { "lat": -33.4495, "lng": -70.6681 }
      },
      "isRead": false
    }
  ]
}
```

---

## 3. Endpoint de series temporales (opcional, si se precalcula en backend)

Si el backend ya tiene un motor de agregación (por ejemplo, sobre un data warehouse o motor de CEP), se puede exponer un endpoint de series temporales listo para graficar.

- **URL**: `/api/analytics/alerts/time-series`
- **Método**: `GET`

### 3.1. Request

- `bucketMinutes` (number): tamaño del bucket temporal (ej. `5`).
- `windowMinutes` (number): ventana hacia atrás (ej. `60`).
- `city`, `routeId` (opcionales).

### 3.2. Response

```json
{
  "buckets": [
    {
      "label": "10:00",
      "total": 12,
      "high": 3
    },
    {
      "label": "10:05",
      "total": 9,
      "high": 1
    }
  ]
}
```

Esto se mapea directamente a la estructura que usa el gráfico de líneas en `AnalyticsPage`:

- `label`: string para el eje X (ej. `"HH:mm"`).
- `total`: total de alertas en el bucket.
- `high`: total de alertas de prioridad `alta` en el bucket.

---

## 4. Resumen mensual de alertas (opcional, si se desacopla de `/monitoring`)

Si se quiere desacoplar la comparación mensual del endpoint principal:

- **URL**: `/api/analytics/alerts/monthly-summary`
- **Método**: `GET`

### 4.1. Request

- `city` (opcional).
- `routeId` (opcional).
- `month` (opcional, formato `YYYY-MM`), por defecto mes actual.

### 4.2. Response

```json
{
  "current": 1250,
  "previous": 980,
  "changePct": 27.6,
  "isIncrease": true
}
```

---

## 5. Resumen rápido de flota (si se quiere un endpoint dedicado)

Aunque `AnalyticsPage` puede calcular esto con `routes` y `alerts`, también se puede exponer un resumen ya procesado.

- **URL**: `/api/analytics/fleet-summary`
- **Método**: `GET`

### 5.1. Response

```json
{
  "totalBuses": 42,
  "unitsWithAlerts": 15,
  "unitsWithoutAlerts": 27,
  "unresolvedHighPriorityAlerts": 6
}
```

---

## 6. Resumen

Para que el panel de `Analytics` funcione igual que hoy (con data dummy), el backend debería al menos exponer:

- **Opción simple (recomendada)**: un único endpoint `GET /api/analytics/monitoring` que devuelva:
  - `routes: BusRoute[]`
  - `alerts: Alert[]`
  - `monthlyComparison` (opcional, pero conveniente)

- **Opción más granular**: dividir en endpoints:
  - `/api/alerts/recent`
  - `/api/analytics/alerts/time-series`
  - `/api/analytics/alerts/monthly-summary`
  - `/api/analytics/fleet-summary`

Con cualquiera de estas dos estrategias, bastará con reemplazar las llamadas a `generateDummyData()` por `fetch`/React Query hacia estos endpoints, mapeando las respuestas a los tipos ya definidos en el frontend.
