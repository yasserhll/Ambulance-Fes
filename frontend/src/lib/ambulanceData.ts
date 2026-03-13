export interface Ambulance {
  id: string;
  name: string;
  plate: string;
  status: "disponible" | "en_mission" | "en_panne" | "maintenance";
  totalHours: number;
  lastOilChange: number; // km
  currentKm: number;
  oilChangeInterval: number; // km between oil changes
  problems: Problem[];
  createdAt: string;
}

export interface Problem {
  id: string;
  description: string;
  date: string;
  resolved: boolean;
  type: "panne" | "maintenance" | "accident";
}

const STORAGE_KEY = "ambulance_fleet_data";

const defaultAmbulances: Ambulance[] = [
  {
    id: "1",
    name: "Ambulance Alpha",
    plate: "12345-أ-1",
    status: "disponible",
    totalHours: 1250,
    lastOilChange: 45000,
    currentKm: 48500,
    oilChangeInterval: 5000,
    problems: [],
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Ambulance Beta",
    plate: "67890-ب-2",
    status: "en_mission",
    totalHours: 980,
    lastOilChange: 30000,
    currentKm: 34200,
    oilChangeInterval: 5000,
    problems: [
      { id: "p1", description: "Problème de climatisation", date: "2024-12-01", resolved: false, type: "panne" },
    ],
    createdAt: "2024-03-20",
  },
  {
    id: "3",
    name: "Ambulance Gamma",
    plate: "11223-ج-3",
    status: "maintenance",
    totalHours: 2100,
    lastOilChange: 60000,
    currentKm: 64800,
    oilChangeInterval: 5000,
    problems: [
      { id: "p2", description: "Vidange programmée", date: "2025-01-10", resolved: false, type: "maintenance" },
    ],
    createdAt: "2023-06-10",
  },
  {
    id: "4",
    name: "Ambulance Delta",
    plate: "44556-د-4",
    status: "disponible",
    totalHours: 560,
    lastOilChange: 15000,
    currentKm: 17800,
    oilChangeInterval: 5000,
    problems: [],
    createdAt: "2024-08-01",
  },
];

export const getAmbulances = (): Ambulance[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* fall through */ }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAmbulances));
  return defaultAmbulances;
};

export const saveAmbulances = (ambulances: Ambulance[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ambulances));
};

export const addAmbulance = (ambulance: Omit<Ambulance, "id" | "problems" | "createdAt">): Ambulance[] => {
  const ambulances = getAmbulances();
  const newAmbulance: Ambulance = {
    ...ambulance,
    id: Date.now().toString(),
    problems: [],
    createdAt: new Date().toISOString().split("T")[0],
  };
  ambulances.push(newAmbulance);
  saveAmbulances(ambulances);
  return ambulances;
};

export const updateAmbulance = (id: string, updates: Partial<Ambulance>): Ambulance[] => {
  const ambulances = getAmbulances();
  const index = ambulances.findIndex((a) => a.id === id);
  if (index !== -1) {
    ambulances[index] = { ...ambulances[index], ...updates };
    saveAmbulances(ambulances);
  }
  return ambulances;
};

export const deleteAmbulance = (id: string): Ambulance[] => {
  const ambulances = getAmbulances().filter((a) => a.id !== id);
  saveAmbulances(ambulances);
  return ambulances;
};

export const getAvailabilityRate = (ambulances: Ambulance[]): number => {
  if (ambulances.length === 0) return 0;
  const available = ambulances.filter((a) => a.status === "disponible").length;
  return Math.round((available / ambulances.length) * 100);
};

export const getKmUntilOilChange = (ambulance: Ambulance): number => {
  return ambulance.oilChangeInterval - (ambulance.currentKm - ambulance.lastOilChange);
};

export const getStatusLabel = (status: Ambulance["status"]): string => {
  const labels: Record<Ambulance["status"], string> = {
    disponible: "Disponible",
    en_mission: "En Mission",
    en_panne: "En Panne",
    maintenance: "Maintenance",
  };
  return labels[status];
};

export const getStatusColor = (status: Ambulance["status"]): string => {
  const colors: Record<Ambulance["status"], string> = {
    disponible: "bg-accent",
    en_mission: "bg-primary",
    en_panne: "bg-destructive",
    maintenance: "bg-warning",
  };
  return colors[status];
};
