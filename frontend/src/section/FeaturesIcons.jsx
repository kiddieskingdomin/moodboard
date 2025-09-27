// src/components/FeatureIconsRow.jsx
import React from "react";
import { FiTruck, FiShield, FiRefreshCcw, FiCheckCircle } from "react-icons/fi";

const features = [
  {
    icon: <FiTruck className="h-5 w-5 text-white" />,
    label: "Free delivery",
  },
  {
    icon: <FiShield className="h-5 w-5 text-white" />,
    label: "10-year warranty*",
  },
  {
    icon: <FiRefreshCcw className="h-5 w-5 text-white" />,
    label: "Sustainable timber",
  },
  {
    icon: <FiCheckCircle className="h-5 w-5 text-white" />,
    label: "Safe & secure",
  },
];

const FeatureIconsRow = () => {
  return (
    <section className="py-6 bg-[#fff2ea]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-y-6 text-center sm:grid-cols-4 sm:gap-y-0">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d8a298]">
                {f.icon}
              </span>
              <span className="text-sm text-slate-700">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureIconsRow;
