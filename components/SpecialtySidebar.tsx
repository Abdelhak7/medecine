'use client';

import React from 'react';
import { Filter } from 'lucide-react';
import { DrugMonograph } from '../lib/pharmacopoeia-data';

interface SpecialtySidebarProps {
  specialties: string[];
  selectedSpecialty: string;
  onSelectSpecialty: (specialty: string) => void;
  drugs: DrugMonograph[];
}

export const SpecialtySidebar: React.FC<SpecialtySidebarProps> = ({
  specialties,
  selectedSpecialty,
  onSelectSpecialty,
  drugs,
}) => {
  const getSpecialtyCount = (spec: string) => {
    if (spec === 'Toutes') return drugs.length;
    return drugs.filter((d) => d.specialty === spec).length;
  };

  return (
    <aside className="w-64 shrink-0 flex flex-col gap-5 text-sm">
      {/* Category header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-[#0F2942]">
          <Filter className="w-3.5 h-3.5 text-[#0D9488]" />
          <span>Spécialités Cliniques</span>
        </div>

        <div className="space-y-1">
          {specialties.map((spec) => {
            const count = getSpecialtyCount(spec);
            const isSelected = selectedSpecialty === spec;
            return (
              <button
                key={spec}
                onClick={() => onSelectSpecialty(spec)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded transition-colors text-left font-medium ${
                  isSelected
                    ? 'bg-[#0F2942] text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="truncate">{spec}</span>
                <span
                  className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clinical resident on-call memo */}
      <div className="p-3 bg-[#F1F5F9] border border-slate-200 rounded-xl text-xs text-slate-600">
        <span className="font-bold text-[#0F2942] block mb-1">Avis de Garde Clinique :</span>
        Toute association d&apos;anticoagulants ou d&apos;antiarythmiques nécessite un contrôle ECG préalable et une clairance de Cockcroft-Gault actualisée.
      </div>
    </aside>
  );
};
