import { memo } from 'react';

export interface FilterOption {
  id: string | number;
  name: string;
}

interface FilterSelectProps {
  label: string;
  value: string | number | undefined;
  options?: FilterOption[];
  onChange: (value: string | number | undefined) => void;
}

const selectClass = 'px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 cursor-pointer';

export const FilterSelect = memo(function FilterSelect({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value ? (isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value)) : undefined;
    onChange(val);
  };

  return (
    <select
      value={value ?? ''}
      onChange={handleChange}
      className={selectClass}
      title={label}
    >
      <option value="">{label}</option>
      {options?.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.name}
        </option>
      ))}
    </select>
  );
});
