"use client";

import { addCommas } from "@/utils";

interface Props {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  placeholder?: string;
  min?: number;
}

function parseNumericValue(value: string) {
  const normalizedValue = value.replace(/[^\d]/g, "");
  if (!normalizedValue) {
    return 0;
  }

  return Number(normalizedValue);
}

export default function FormattedNumberInput({
  value,
  onChange,
  className = "",
  placeholder,
  min = 0,
}: Props) {
  return (
    <input
      type="text"
      inputMode="numeric"
      value={addCommas(String(value ?? 0))}
      placeholder={placeholder}
      onChange={(event) => onChange(parseNumericValue(event.target.value))}
      onBlur={() => {
        if (value < min) {
          onChange(min);
        }
      }}
      className={className}
    />
  );
}
