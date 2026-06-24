import { memo } from 'react';
import { X } from 'lucide-react';
import { FilterSelect, FilterOption } from './FilterSelect';

export interface FilterField {
  key: string;
  label: string;
  options?: FilterOption[];
}

interface FilterPanelProps {
  fields: FilterField[];
  values: Record<string, string | number | undefined>;
  onFilterChange: (key: string, value: string | number | undefined) => void;
  onClear: () => void;
  hasFilters: boolean;
}

export const FilterPanel = memo(function FilterPanel({
  fields,
  values,
  onFilterChange,
  onClear,
  hasFilters,
}: FilterPanelProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center mb-4">
      {fields.map((field) => (
        <FilterSelect
          key={field.key}
          label={field.label}
          value={values[field.key]}
          options={field.options}
          onChange={(value) => onFilterChange(field.key, value)}
        />
      ))}

      {hasFilters && (
        <button
          onClick={onClear}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Limpiar filtros"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
});
