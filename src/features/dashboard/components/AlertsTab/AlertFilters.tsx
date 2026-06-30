import { useDashboardStore } from "@dashboard/store/dashboardStore";
import { FilterField, FilterPanel } from "@shared/components/FilterPanel";
import { memo } from "react";

export interface AlertFiltersState {
  severityId?: number;
  applicationId?: string;
  statusId?: number;
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

  const fields: FilterField[] = [
    {
      key: "severityId",
      title: "Severidad",
      label: "Todas",
      options: severityLevels?.map((s) => ({ id: s.id, name: s.name })),
    },
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
      options: alertStatuses?.map((s) => ({ id: s.id, name: s.name })),
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
    filters.severityId ||
    filters.applicationId ||
    filters.statusId
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
