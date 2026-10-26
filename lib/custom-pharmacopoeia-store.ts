'use client';

import { DrugMonograph } from './pharmacopoeia-data';

const DRUGS_KEY = 'pharmadz-custom-drugs';
const SPECIALTIES_KEY = 'pharmadz-custom-specialties';

export interface CustomPharmacopoeiaSnapshot {
  drugs: DrugMonograph[];
  specialties: string[];
}

const emptySnapshot: CustomPharmacopoeiaSnapshot = { drugs: [], specialties: [] };

let cachedSnapshot: CustomPharmacopoeiaSnapshot = emptySnapshot;
let cachedSignature = '';

const readSnapshot = (): CustomPharmacopoeiaSnapshot => {
  const drugsRaw = window.localStorage.getItem(DRUGS_KEY);
  const specialtiesRaw = window.localStorage.getItem(SPECIALTIES_KEY);
  const signature = `${drugsRaw ?? ''}\u0000${specialtiesRaw ?? ''}`;

  if (signature === cachedSignature) {
    return cachedSnapshot;
  }

  cachedSignature = signature;

  try {
    const parsedDrugs: unknown = JSON.parse(drugsRaw || '[]');
    const parsedSpecialties: unknown = JSON.parse(specialtiesRaw || '[]');
    cachedSnapshot = {
      drugs: Array.isArray(parsedDrugs) ? (parsedDrugs as DrugMonograph[]) : [],
      specialties: Array.isArray(parsedSpecialties)
        ? parsedSpecialties.filter((item): item is string => typeof item === 'string')
        : [],
    };
  } catch {
    cachedSnapshot = emptySnapshot;
  }

  return cachedSnapshot;
};

const listeners = new Set<() => void>();

const emitChange = () => {
  cachedSignature = '';
  listeners.forEach((listener) => listener());
};

export const subscribeCustomPharmacopoeia = (listener: () => void) => {
  listeners.add(listener);

  const handleStorage = (event: StorageEvent) => {
    if (event.key === DRUGS_KEY || event.key === SPECIALTIES_KEY) {
      listener();
    }
  };

  window.addEventListener('storage', handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', handleStorage);
  };
};

export const getCustomPharmacopoeiaSnapshot = () => readSnapshot();

export const getCustomPharmacopoeiaServerSnapshot = () => emptySnapshot;

export const saveCustomPharmacopoeia = (snapshot: CustomPharmacopoeiaSnapshot) => {
  window.localStorage.setItem(DRUGS_KEY, JSON.stringify(snapshot.drugs));
  window.localStorage.setItem(SPECIALTIES_KEY, JSON.stringify(snapshot.specialties));
  emitChange();
};
