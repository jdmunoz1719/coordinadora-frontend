# Frontend - Dashboard de Gestión de Incidentes

Dashboard React moderno, responsive y en tiempo real para monitoreo de incidentes, eventos y alertas.

## Arquitectura

### Feature-Based Folder Structure

Componentes organizados por **feature** con subcarpetas por componente:

```
src/
├── features/dashboard/
│   ├── components/
│   │   ├── IncidentsTab/              # Feature aislada
│   │   │   ├── IncidentsTable.tsx
│   │   │   ├── IncidentsFilters.tsx
│   │   │   ├── ChangeStatusModal.tsx
│   │   │   └── index.ts
│   │   ├── AlertsTab/                 # Feature aislada
│   │   │   ├── AlertsTable.tsx
│   │   │   ├── AlertFilters.tsx
│   │   │   └── index.ts
│   │   ├── EventsTab/                 # Feature aislada
│   │   │   ├── EventsTable.tsx
│   │   │   ├── EventsFilters.tsx
│   │   │   └── index.ts
│   │   ├── ResumenTab/                # Feature aislada
│   │   │   ├── EventsByApplicationChart.tsx
│   │   │   ├── EventsBySeverityChart.tsx
│   │   │   └── index.ts
│   │   ├── Header.tsx
│   │   ├── TabBar.tsx
│   │   └── MetricsCard.tsx
│   ├── hooks/
│   │   ├── useTabManager.ts           # Orquesta tabs, WS, paginación
│   │   └── useDashboard.ts
│   ├── pages/
│   │   └── DashboardPage.tsx
│   └── styles/
├── shared/
│   ├── components/
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Paginator.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── FilterSelect.tsx
│   │   ├── FloatingRefreshButton.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── EmptyState.tsx
│   │   └── ...
│   └── hooks/
│       └── useFilters.ts              # Hook reutilizable para filtros
├── services/
│   ├── dashboard/
│   │   └── dashboardService.ts        # Lógica de negocio
│   ├── websocket/
│   │   └── WebSocketManager.ts        # Real-time updates
│   └── api/
├── store/
│   └── dashboardStore.ts              # Zustand global state
├── config/
│   ├── api.config.ts
│   ├── ws.config.ts
│   └── constants.ts
└── types/
    └── dashboard.types.ts
```

### Separación por Feature

Cada tab (Incidentes, Alertas, Eventos, Resumen) está **completamente aislado**:

✅ **Ventajas:**
- Cambios locales, no afectan otros tabs
- Fácil identificar qué pertenece a cada feature
- Reutilización clara de shared components
- Escalable: agregar un nuevo tab es copiar la carpeta

## Stack Tecnológico

- **React 18** - UI library
- **TypeScript** - Type safety
- **Zustand** - Global state (minimal, performant)
- **TailwindCSS** - Styling responsive
- **Socket.io-client** - Real-time WebSocket updates
- **Lucide React** - Icons
- **Date-fns** - Date formatting
- **Vite** - Build tool

## Flujo de Datos

```
User Interaction
    ↓
Hook (useTabManager, useFilters)
    ↓
Service (dashboardService, WebSocketManager)
    ↓
Zustand Store (useDashboardStore)
    ↓
Component (memo + React.FC)
    ↓
UI Render
```

### Zustand Store (`dashboardStore.ts`)

```typescript
interface DashboardState {
  // Data
  incidents: Incident[];
  alerts: Alert[];
  events: Event[];
  
  // Aggregated metrics
  metrics?: {
    totalOpenIncidents: number;
    totalResolvedIncidents: number;
    totalAlerts: number;
  };
  eventsByApplication: Array<{ appName: string; count: number }>;
  eventsBySeverity: Array<{ severity: string; count: number }>;
  
  // Actions
  setIncidents(incidents: Incident[]): void;
  setAlerts(alerts: Alert[]): void;
  setEvents(events: Event[]): void;
  setCounts(counts: Partial<Counts>): void;
  // ... etc
}

// Atomic selectors - no re-renders on unrelated changes
export const selectIncidents = (s) => s.incidents;
export const selectAlerts = (s) => s.alerts;
export const selectMetrics = (s) => s.metrics;
```

**Uso correcto:**
```typescript
const incidents = useDashboardStore(selectIncidents);  // ✅ Solo re-render si incidents cambian
const { incidents, alerts } = useDashboardStore();      // ❌ Re-render en CUALQUIER cambio
```

## Real-Time Updates (WebSocket)

### WebSocketManager

```typescript
// Conectar
wsManager.connect('/dashboard', socketId);

// Escuchar eventos
wsManager.on('incident:created', (data) => {
  s().setIncidents([...incidents, data]);
});

wsManager.on('incident:status_updated', () => {
  s().setCounts({ open: open - 1, resolved: resolved + 1 });
});

// Desconectar
wsManager.disconnect();
```

### Per-Tab Subscriptions (`useTabManager`)

Cada tab maneja su propia subscripción:

1. **Resumen:** Escucha `incident:created`, `incident:status_updated`, `alert:created`, `event:critical`
   - Solo incrementa contadores, no carga items
   
2. **Incidentes:** Escucha `incident:*`
   - Recarga tabla cuando hay cambios
   
3. **Alertas:** Escucha `alert:created`
   - Incrementa contador
   
4. **Eventos:** Escucha `event:critical`
   - Recarga tabla

**Al cambiar de tab:**
1. ✅ Cierra subscripción anterior
2. ✅ Consulta backend para verificar cambios desde la última carga
3. ✅ Abre nueva subscripción

## Performance Optimizations

### React Best Practices

```typescript
// ✅ Named imports ONLY (React 18 no necesita 'import React')
import { memo, useCallback, useMemo } from 'react';

// ✅ Memoización de componentes
export const IncidentsTable = memo(function IncidentsTable({
  incidents,
  onPageChange,
}: IncidentsTableProps) {
  // useCallback para callbacks en props
  const handlePageChange = useCallback((page: number) => {
    onPageChange(page);
  }, [onPageChange]);
  
  // useMemo para cálculos costosos
  const sortedIncidents = useMemo(() => {
    return incidents.sort((a, b) => b.createdAt - a.createdAt);
  }, [incidents]);
  
  return (
    <table>
      {sortedIncidents.map((item) => (
        <Row key={item.id} item={item} />
      ))}
    </table>
  );
});
```

### Zustand Optimization

```typescript
// ✅ Atomic selectors previenen re-renders innecesarios
const incidents = useDashboardStore(selectIncidents);
const alerts = useDashboardStore(selectAlerts);

// ❌ Evita extraer todo con destructuring o spread
// const { incidents, alerts, events, ... } = useDashboardStore();  // Re-renders en CUALQUIER cambio
```

## Paginación

### Paginator Component (Reutilizable)

```typescript
<Paginator
  page={pagination.page}
  limit={pagination.limit}
  total={pagination.total}
  onPageChange={onPageChange}
  onLimitChange={onLimitChange}
/>
```

Usado en todos los tabs con la misma interfaz.

**Backend format:** `?page=1&limit=10`

## Filtros

### FilterPanel + FilterSelect (Reusables)

```typescript
<FilterPanel
  fields={[
    {
      name: 'applicationId',
      label: 'Aplicación',
      type: 'select',
      options: applications.map(a => ({ value: a.id, label: a.name })),
    },
    {
      name: 'severity',
      label: 'Severidad',
      type: 'select',
      options: severityLevels.map(s => ({ value: s.id, label: s.name })),
    },
  ]}
  values={filters}
  onFilterChange={setFilters}
  hasFilters={hasFilters}
/>
```

### useFilters Hook (Reusable)

```typescript
const { filters, updateFilter, clearFilters, hasFilters } = useFilters({
  applicationId: '',
  severity: undefined,
  dateFrom: '',
  dateTo: '',
});

// Usar
updateFilter('applicationId', 'app-123');
clearFilters();
```

## Styling

### Tailwind + Responsive

```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols */}
</div>

<div className="text-xs sm:text-sm md:text-base lg:text-lg">
  {/* Responsive text sizes */}
</div>
```

**Colores semantic:**
- `text-red-600` - Danger
- `text-green-600` - Success
- `text-blue-600` - Info
- `text-yellow-600` - Warning

## Types

`src/types/dashboard.types.ts`:
```typescript
export interface Incident {
  id: string;
  title: string;
  description: string;
  applicationId: string;
  applicationName?: string;
  severityId: number;
  severityName?: string;
  statusName?: string;
  assignedToId?: string;
  assignedToName?: string;
  createdAt: string;
}

export interface Alert {
  id: string;
  sourceEventId: string;
  severityId: number;
  severityName?: string;
  statusId: number;
  statusName?: string;
  applicationId: string;
  applicationName?: string;
  createdAt: string;
}

export interface Event {
  id: string;
  applicationId: string;
  applicationName?: string;
  eventTypeId: number;
  eventTypeName?: string;
  severityId: number;
  severityName?: string;
  description: string;
  traceId: string;
  occurredAt: string;
  createdAt: string;
}
```

## Scripts

```bash
npm install                    # Instalar
npm run dev                    # Vite dev server (hot reload)
npm run build                  # Build producción
npm run preview                # Preview build localmente
npm run lint                   # ESLint
npm run type-check            # TypeScript check (sin build)
```

## Configuración API

`src/config/api.config.ts`:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
```

`.env.local`:
```
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001
```

## Convenciones

✅ **Hacer:**
- Carpeta por componente si tiene subcomponentes propios
- Usar `memo()` para componentes que reciben props
- `useCallback` para callbacks pasados a props
- Atomic selectors en Zustand
- Nombres descriptivos (ActiveIncidents, no List)
- Comentarios solo si el "why" no es obvio (no para el "what")

❌ **NO hacer:**
- `import React` (React 18+ no lo necesita)
- Props inline (crea nueva ref cada render)
- useEffect dependencies incompletas
- Componentes sin memo si reciben props frecuentes
- Selectors spread del store (`const { a, b } = useStore()`)
- Componentes fuera de carpeta de feature
