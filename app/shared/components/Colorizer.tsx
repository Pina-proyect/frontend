import { useState } from "react";

export function Colorizer({
  defaultColor = "#16a34a",
  onChange,
  classNameProperty,
}: {
  defaultColor?: string;
  onChange?: (color: string) => void;
  classNameProperty?: string;
}) {
  const [color, setColor] = useState(defaultColor);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <label
      className={classNameProperty}
      style={{ backgroundColor: color }}
    >
      <input
        type="color"
        value={color}
        onChange={handleChange}
        className="hidden"
      />
    </label>
  );
}
