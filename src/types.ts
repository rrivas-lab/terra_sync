export type ParameterType = 'NUMERIC' | 'BOOLEAN' | 'SELECTION';
export type ParameterCategory = 'FISICO_QUIMICO' | 'MICROBIOLOGICO';
export type QualityCategory = 'Bueno' | 'Regular' | 'Malo';
export type BarrelStatus = 'EN ESPERA' | 'EN ANÁLISIS' | 'LIBERADO' | 'RECHAZADO';

export interface DynamicParameter {
  id: string;
  name: string;
  type: ParameterType;
  category: ParameterCategory;
  unit?: string;
  min?: number;
  max?: number;
  options?: string[]; // For SELECTION type
  booleanOptimalState?: boolean; // true if 'Active' is Optimal, false if 'Active' is Alert
  selectionCategories?: { [option: string]: QualityCategory };
}

export interface Crop {
  id: string;
  name: string;
  icon: string;
  parameters: DynamicParameter[];
}

export type SoilType = 'Arcilloso' | 'Limoso' | 'Arenoso' | 'Franco';
export type LotStatus = 'PREPARACIÓN' | 'SEMBRADO' | 'VACÍO' | 'EN_CURA';
export type UnitSystem = 'METRICO' | 'IMPERIAL';

export type SowingStatus = 'PREPARACIÓN' | 'ACTIVO' | 'COSECHA' | 'FINALIZADO';

export type ActivityType = 'Siembra' | 'Riego' | 'Fertilización' | 'Cura' | 'Cosecha' | 'Otra';
export type ActivityResource = 'Maquinaria' | 'Cuadrilla' | 'Ninguno';

export interface ActivityLog {
  id: string;
  date: string;
  type: ActivityType | string;
  resource: ActivityResource;
  machinery?: string; // Added for specific machinery tracking
  crew?: string;      // Added for specific crew/cuadrilla tracking
  supplyId?: string; 
  consumedQuantity?: number;
  description?: string;
}

export interface SowingProject {
  id: string;
  name: string;
  lotIds: string[];
  activityRecords: ActivityLog[];
  status: SowingStatus;
  startDate: string;
  endDate?: string;
}

export interface Contact {
  id: string;
  name: string;
  role: 'Administrador' | 'Operador' | 'Proveedor';
  phone: string;
  externalId: string;
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  adminId: string;
  totalHectares: number;
  unitSystem: UnitSystem;
  coordinates?: { lat: number; lng: number };
}

export interface Chemical {
  id: string;
  name: string;
  type: 'Fungicida' | 'Insecticida' | 'Fertilizante';
  unit: string;
}

export interface CureRecord {
  id: string;
  lotId: string;
  date: string;
  chemicalId: string;
  dosage: number;
  responsibleId: string;
}

export interface SowingRecord {
  id: string;
  lotId: string;
  date: string;
  density: number; // plants per hectare
  responsibleId: string;
}

export interface DispatchRecord {
  id: string;
  lotId: string;
  cropId?: string;
  date: string;
  quantity: number;
  status: 'PENDIENTE' | 'EN TRÁNSITO' | 'RECIBIDO';
  type: 'INTERNO' | 'EXTERNO';
  originFarmId?: string;
  originProjectId?: string; // Vincula al SowingProject de origen
  estimatedBrix?: number;   // °Brix estimados del campo
  providerName?: string;
}

export interface Barrel {
  id: string;
  code: string;
  cropId: string;
  lotId?: string;
  status: BarrelStatus;
  analysisValues: { [parameterId: string]: any };
  date: string;
  creationTimestamp: number;   // Unix ms — inicio de la cuarentena
  incubationEndDate: number;   // creationTimestamp + 72h (ms)
  brix?: number;               // Grados Brix finales
}

export interface Silo {
  id: string;
  name: string;
  capacity: number;
  currentLevel: number;
  unit: string;
  cropId?: string;
  averageBrix?: number; // Brix promedio calculado al mezclar cargas
}

export interface LotAnalysis {
  id: string;
  lotId: string;
  date: string;
  values: { [parameterId: string]: any };
  status: 'APROBADO' | 'RECHAZADO' | 'PENDIENTE';
}

export interface MaterialReception {
  id: string;
  date: string;
  provider: string;
  cropId: string;
  lotId?: string; // Optional since it could be an external supply
  farmId?: string;
  bundleCount: number;
  averageWeight: number;
  availableQuantity: number; // STOCK MANAGEMENT: subtract when assigned to SowingProject
  qualityValues: { [parameterId: string]: any };
  healthScore: number;
  status: QualityCategory;
}

export interface Lot {
  id: string;
  lotCode: string;
  area: number;
  soilType: SoilType;
  cropId: string;
  farmId: string;
  status: LotStatus;
  location?: {
    lat: number;
    lng: number;
  };
  analyses?: LotAnalysis[];
  receptions?: MaterialReception[];
  cureRecords?: CureRecord[];
  sowingRecords?: SowingRecord[];
}

export const UNITS_MASTER = ['%', '°Bx', 'g/L', 'cfu/g', 'UFC/ml', 'pH', 'Ratio', 'mm', 'ml/L', 'g/Ha'];

export const INITIAL_CHEMICALS: Chemical[] = [
  { id: 'chem-1', name: 'Vitavax 200', type: 'Fungicida', unit: 'ml/Kg' },
  { id: 'chem-2', name: 'Cruiser 350', type: 'Insecticida', unit: 'ml/Kg' },
  { id: 'chem-3', name: 'Maxim XL', type: 'Fungicida', unit: 'ml/Kg' },
  { id: 'chem-4', name: 'Apron XL', type: 'Fungicida', unit: 'ml/Kg' }
];

export const INITIAL_SILOS: Silo[] = [
  { id: 'silo-1', name: 'Silo A1', capacity: 100000, currentLevel: 0, unit: 'L' },
  { id: 'silo-2', name: 'Silo B2', capacity: 150000, currentLevel: 0, unit: 'L' },
];

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'contact-1',
    name: 'Ing. Roberto Rivas',
    role: 'Administrador',
    phone: '+58 412 1234567',
    externalId: 'V-12345678'
  },
  {
    id: 'contact-2',
    name: 'Juan Pérez',
    role: 'Operador',
    phone: '+58 414 7654321',
    externalId: 'V-87654321'
  }
];

export const INITIAL_FARMS: Farm[] = [
  {
    id: 'farm-1',
    name: 'Hacienda La Esperanza',
    location: 'Yaracuy, Venezuela',
    adminId: 'contact-1',
    totalHectares: 100,
    unitSystem: 'METRICO',
    coordinates: { lat: 10.1234, lng: -68.5678 }
  }
];

export const INITIAL_CROPS: Crop[] = [
  {
    id: 'pina',
    name: 'Piña',
    icon: '🍍',
    parameters: [
      { id: 'p1', name: 'Brix', type: 'NUMERIC', category: 'FISICO_QUIMICO', unit: '°Bx', min: 12, max: 14.5 },
      { id: 'p2', name: 'Acidez', type: 'NUMERIC', category: 'FISICO_QUIMICO', unit: '%', min: 0.5, max: 0.8 },
      { id: 'p3', name: 'Acidúricos', type: 'NUMERIC', category: 'MICROBIOLOGICO', unit: 'UFC/ml', min: 0, max: 10 }
    ],
  },
  {
    id: 'naranja',
    name: 'Naranja',
    icon: '🍊',
    parameters: [
      { id: 'n1', name: 'Brix', type: 'NUMERIC', category: 'FISICO_QUIMICO', unit: '°Bx', min: 10, max: 12 },
      { id: 'n2', name: 'Ratio', type: 'NUMERIC', category: 'FISICO_QUIMICO', unit: 'Ratio', min: 12, max: 16 }
    ],
  },
];

export const INITIAL_LOTS: Lot[] = [
  {
    id: 'lot-1',
    lotCode: 'L1-P01',
    area: 15.5,
    soilType: 'Arcilloso',
    cropId: 'pina',
    farmId: 'farm-1',
    status: 'SEMBRADO',
    location: { lat: 10.1234, lng: -68.5678 }
  }
];
