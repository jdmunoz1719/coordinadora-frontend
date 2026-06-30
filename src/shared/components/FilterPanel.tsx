import { X } from "lucide-react";
import { memo, ReactNode } from "react";
import { FilterOption, FilterSelect } from "./FilterSelect";

export interface FilterField {
  key: string;
  label: string;
  title?: string;
  options?: FilterOption[];
}

interface FilterPanelProps {
  fields: FilterField[];
  values: Record<string, string | number | undefined>;
  onFilterChange: (key: string, value: string | number | undefined) => void;
  onClear: () => void;
  hasFilters: boolean;
  children?: ReactNode;
}

export const FilterPanel = memo(function FilterPanel({
  fields,
  values,
  onFilterChange,
  onClear,
  hasFilters,
  children,
}: FilterPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-end sm:gap-3 mb-4">
      {fields.map((field) => (
        <div key={field.key} className="flex flex-col gap-1">
          {field.title && (
            <label className="text-xs font-medium text-slate-500 px-0.5">
              {field.title}
            </label>
          )}
          <FilterSelect
            label={field.label}
            value={values[field.key]}
            options={field.options}
            onChange={(value) => onFilterChange(field.key, value)}
          />
        </div>
      ))}

      {children}

      {hasFilters && (
        <button
          onClick={onClear}
          className="col-span-2 self-end flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors sm:w-auto sm:col-span-1 sm:p-2"
          title="Limpiar filtros"
        >
          <X size={16} />
          <span className="sm:hidden">Limpiar</span>
        </button>
      )}
    </div>
  );
});
