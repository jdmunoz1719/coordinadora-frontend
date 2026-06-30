import { useDashboardStore } from "@dashboard/store/dashboardStore";
import { FilterField, FilterPanel } from "@shared/components/FilterPanel";
import { memo } from "react";

export interface IncidentsFiltersState {
  applicationId?: string;
  statusId?: number;
  severityId?: number;
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
      key: "applicationId",
      title: "Aplicación",
      label: "Todas",
      options: applications?.map((a) => ({ id: a.id, name: a.name })),
    },
    {
      key: "statusId",
      title: "Estado",
      label: "Todos",
      options: incidentStatuses?.map((s) => ({ id: s.id, name: s.name })),
    },
    {
      key: "severityId",
      title: "Severidad",
      label: "Todas",
      options: severityLevels?.map((s) => ({ id: s.id, name: s.name })),
    },
  ];

  const handleFilterChange = (
    key: string,
    value: string | number | undefined,
  ) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const handleClear = () => {
    onFilterChange({});
  };

  const hasFilters = !!(
    filters.applicationId ||
    filters.statusId ||
    filters.severityId
  );

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
