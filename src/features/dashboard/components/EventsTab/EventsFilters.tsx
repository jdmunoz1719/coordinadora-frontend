import { memo } from 'react';
import { FilterPanel, FilterField } from '@shared/components/FilterPanel';
import { useDashboardStore } from '@store/dashboardStore';

export interface EventsFiltersState {
  applicationId?: string;
  severity?: number;
  eventTypeId?: number;
  dateFrom?: string;
  dateTo?: string;
}

interface EventsFiltersProps {
  filters: EventsFiltersState;
  onFilterChange: (filters: EventsFiltersState) => void;
}

export const EventsFilters = memo(function EventsFilters({
  filters,
  onFilterChange,
}: EventsFiltersProps) {
  const applications = useDashboardStore((s) => s.applications);
  const severityLevels = useDashboardStore((s) => s.severityLevels);
  const eventTypes = useDashboardStore((s) => s.eventTypes);

  const fields: FilterField[] = [
    {
      key: 'applicationId',
      label: 'Todas las aplicaciones',
      options: applications?.map((a) => ({ id: a.id, name: a.name })),
    },
    {
      key: 'severity',
      label: 'Todas las severidades',
      options: severityLevels?.map((s) => ({ id: s.id, name: s.name })),
    },
    {
      key: 'eventTypeId',
      label: 'Todos los tipos de evento',
      options: eventTypes?.map((e) => ({ id: e.id, name: e.name })),
    },
  ];

  const handleFilterChange = (key: string, value: string | number | undefined) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      dateFrom: e.target.value || undefined,
    });
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      dateTo: e.target.value || undefined,
    });
  };

  const hasFilters = !!(
    filters.applicationId ||
    filters.severity ||
    filters.eventTypeId ||
    filters.dateFrom ||
    filters.dateTo
  );

  const handleClear = () => {
    onFilterChange({});
  };

  return (
    <div className="space-y-4 mb-4">
      <FilterPanel
        fields={fields}
        values={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClear}
        hasFilters={hasFilters}
      />

      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="datetime-local"
          value={filters.dateFrom || ''}
          onChange={handleDateFromChange}
          placeholder="Desde"
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
        />
        <input
          type="datetime-local"
          value={filters.dateTo || ''}
          onChange={handleDateToChange}
          placeholder="Hasta"
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
        />
      </div>
    </div>
  );
});
