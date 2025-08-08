import React, { useState } from "react";
import "./persona.css";

interface Toggle {
  key: string;
  label: string;
}

const toggles: Toggle[] = [
  { key: "low-vision", label: "Low Vision" },
  { key: "color-blind", label: "Color Blind" },
  { key: "dyslexia-font", label: "Dyslexia Font" },
  { key: "motion-sensitive", label: "Motion Sensitive" },
  { key: "low-bandwidth", label: "Low Bandwidth" },
];

const InclusionToolbar: React.FC = () => {
  const [state, setState] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setState((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      const html = document.documentElement;
      if (next[key]) {
        html.setAttribute(`data-${key}`, "true");
      } else {
        html.removeAttribute(`data-${key}`);
      }
      return next;
    });
  };

  return (
    <div className="flex gap-2 p-2 border rounded inclusion-toolbar">
      {toggles.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => toggle(t.key)}
          className={`px-2 py-1 text-sm border rounded transition-colors ${
            state[t.key]
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

export default InclusionToolbar;
