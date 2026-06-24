import { memo } from 'react';
import { FilterPanel, FilterField } from '@shared/components/FilterPanel';
import { useDashboardStore } from '@store/dashboardStore';

export interface AlertFiltersState {
  severity?: number;
  applicationId?: string;
  statusId?: number;
  eventTypeId?: number;
}

interface AlertFiltersProps {
  filters: AlertFiltersState;
  onFilterChange: (filters: AlertFiltersState) => void;
}

export const AlertFilters = memo(function AlertFilters({
  filters,
  onFilterChange,
}: AlertFiltersProps) {
  const applications = useDashboardStore((s) => s.applications);
  const severityLevels = useDashboardStore((s) => s.severityLevels);
  const alertStatuses = useDashboardStore((s) => s.alertStatuses);
  const eventTypes = useDashboardStore((s) => s.eventTypes);

  const fields: FilterField[] = [
    {
      key: 'severity',
      label: 'Todas las severidades',
      options: severityLevels?.map((s) => ({ id: s.id, name: s.name })),
    },
    {
      key: 'applicationId',
      label: 'Todas las aplicaciones',
      options: applications?.map((a) => ({ id: a.id, name: a.name })),
    },
    {
      key: 'statusId',
      label: 'Todos los estados',
      options: alertStatuses?.map((s) => ({ id: s.id, name: s.name })),
    },
    {
      key: 'eventTypeId',
      label: 'Todos los eventos',
      options: eventTypes?.map((e) => ({ id: e.id, name: e.name })),
    },
  ];

  const handleFilterChange = (key: string, value: string | number | undefined) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const handleClear = () => {
    onFilterChange({});
  };

  const hasFilters = !!(filters.severity || filters.applicationId || filters.statusId || filters.eventTypeId);

  return (
    <FilterPanel
      fields={fields}
      values={filters}
      onFilterChange={handleFilterChange}
      onClear={handleClear}
      hasFilters={hasFilters}
    />
  );
});
