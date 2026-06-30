import { useDashboardStore } from "@dashboard/store/dashboardStore";
import { FilterField, FilterPanel } from "@shared/components/FilterPanel";
import { ChangeEvent, memo } from "react";

export interface EventsFiltersState {
  applicationId?: string;
  severityId?: number;
  eventTypeId?: number;
  occurredAt?: string;
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
      key: "applicationId",
      title: "Aplicación",
      label: "Todas",
      options: applications?.map((a) => ({ id: a.id, name: a.name })),
    },
    {
      key: "severityId",
      title: "Severidad",
      label: "Todas",
      options: severityLevels?.map((s) => ({ id: s.id, name: s.name })),
    },
    {
      key: "eventTypeId",
      title: "Tipo de evento",
      label: "Todos",
      options: eventTypes?.map((e) => ({ id: e.id, name: e.name })),
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

  const handleOccurredAtChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      occurredAt: e.target.value || undefined,
    });
  };

  const hasFilters = !!(
    filters.applicationId ||
    filters.severityId ||
    filters.eventTypeId ||
    filters.occurredAt
  );

  const handleClear = () => onFilterChange({});

  return (
    <FilterPanel
      fields={fields}
      values={filters}
      onFilterChange={handleFilterChange}
      onClear={handleClear}
      hasFilters={hasFilters}
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500 px-0.5">Fecha</label>
        <input
          type="date"
          value={filters.occurredAt || ""}
          onChange={handleOccurredAtChange}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 sm:w-auto"
        />
      </div>
    </FilterPanel>
  );
});
