# Frontend — Dashboard Operacional

## Arquitectura

Organización por features. Cada feature encapsula su propia lógica, componentes y estado. Sin acoplamiento entre features.

```
src/
├── api/                  # Llamadas HTTP por dominio (alerts, events, incidents, metrics, master)
├── config/               # Configuración centralizada (API base URL, timeouts, WebSocket)
├── features/             # Features aisladas
│   └── dashboard/
│       ├── components/   # Componentes por tab (AlertsTab/, EventsTab/, IncidentsTab/, ResumenTab/)
│       ├── hooks/        # Lógica de cada tab (useAlertsTab, useEventsTab, useResumenTab…)
│       ├── pages/        # DashboardPage — contenedor principal
│       └── store/        # Estado global con Zustand
├── services/
│   ├── http/             # HttpClient — wrapper de Axios con reintentos y backoff
│   └── websocket/        # WebSocketManager — wrapper de Socket.io con reconexión
└── shared/               # Componentes reutilizables (Badge, Button, Paginator, FilterPanel…)
```

### Capas internas de cada feature

| Capa | Responsabilidad |
|------|-----------------|
| `hooks/` | Orquesta llamadas HTTP, WebSocket, filtros y paginación |
| `components/` | Solo presentación — recibe datos via props o lee store |
| `store/` | Estado global con Zustand (selectores atómicos) |
| `interface/` | Tipos TypeScript del dominio de la feature |

### Flujo de datos

```
Interacción usuario → Hook → Service (HTTP/WS) → Zustand store → Componente → UI
```

### Actualizaciones en tiempo real

`WebSocketManager` mantiene una sola conexión Socket.io con reconexión automática. Cada tab se suscribe a sus eventos al montarse y cancela la suscripción al desmontarse. El tab Resumen además hace polling cada 30 segundos como respaldo.

### Path aliases

| Alias | Ruta |
|-------|------|
| `@api/*` | `src/api/*` |
| `@services/*` | `src/services/*` |
| `@features/*` | `src/features/*` |
| `@shared/*` | `src/shared/*` |
| `@config/*` | `src/config/*` |
| `@dashboard/*` | `src/features/dashboard/*` |

---

## Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=10000

VITE_WS_URL=ws://localhost:3001
VITE_WS_RECONNECT_INTERVAL=5000
VITE_WS_MAX_RETRIES=5
```

---

## Cómo ejecutar

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:5173)
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

### Otros comandos

```bash
npm run type-check   # Verificar tipos sin compilar
npm run lint         # ESLint
npm run test         # Tests con Vitest
npm run test:ui      # Vitest en modo UI
npm run test:coverage
```

> El servidor de desarrollo hace proxy de `/api` hacia `http://localhost:3001`. El backend debe estar corriendo antes de iniciar el frontend.
