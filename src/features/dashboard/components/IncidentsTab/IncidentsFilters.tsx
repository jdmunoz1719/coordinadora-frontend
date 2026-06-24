import { memo } from 'react';
import { FilterPanel, FilterField } from '@shared/components/FilterPanel';
import { useDashboardStore } from '@store/dashboardStore';

export interface IncidentsFiltersState {
  applicationId?: string;
  statusId?: number;
  severity?: number;
}

interface IncidentsFiltersProps {
  onFilterChange: (filters: IncidentsFiltersState) => void;
  filters: IncidentsFiltersState;
}

export const IncidentsFilters = memo(function IncidentsFilters({
  onFilterChange,
  filters,
}: IncidentsFiltersProps) {
  const applications = useDashboardStore((s) => s.applications);
  const incidentStatuses = useDashboardStore((s) => s.incidentStatuses);
  const severityLevels = useDashboardStore((s) => s.severityLevels);

  const fields: FilterField[] = [
    {
      key: 'applicationId',
      label: 'Todas las aplicaciones',
      options: applications?.map((a) => ({ id: a.id, name: a.name })),
    },
    {
      key: 'statusId',
      label: 'Todos los estados',
      options: incidentStatuses?.map((s) => ({ id: s.id, name: s.name })),
    },
    {
      key: 'severity',
      label: 'Todas las severidades',
      options: severityLevels?.map((s) => ({ id: s.id, name: s.name })),
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

  const hasFilters = !!(filters.applicationId || filters.statusId || filters.severity);

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
