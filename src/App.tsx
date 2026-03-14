/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, Minus, Beaker, ShieldCheck, Clock, ChevronRight, Save, Leaf, 
  Map, LayoutGrid, MapPin, Layers, Info, Home, User, Settings, 
  Activity, Trash2, CheckCircle2, XCircle, ListFilter, Briefcase, Factory, Users, Search, Phone, CreditCard,
  Droplets, Sprout, Truck, Box, Sun, Moon, FlaskConical, ClipboardCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Crop, INITIAL_CROPS, DynamicParameter, Lot, INITIAL_LOTS, 
  SoilType, LotStatus, Farm, INITIAL_FARMS, UnitSystem, 
  UNITS_MASTER, ParameterType, ParameterCategory, LotAnalysis,
  QualityCategory, MaterialReception, Contact, INITIAL_CONTACTS,
  Chemical, INITIAL_CHEMICALS, CureRecord, SowingRecord, Barrel, DispatchRecord, BarrelStatus, Silo, SiloStatus
} from './types';

// --- Helpers ---

const getUnit = (farm: Farm | undefined, type: 'weight' | 'area') => {
  if (!farm) return type === 'weight' ? 'Kg' : 'Ha';
  if (farm.unitSystem === 'IMPERIAL') return type === 'weight' ? 'Lb' : 'Ac';
  return type === 'weight' ? 'Kg' : 'Ha';
};

const SiloMonitorView = ({ silos, crops }: { silos: Silo[], crops: Crop[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
      {silos.map(silo => {
        const crop = crops.find(c => c.id === silo.cropId);
        const levelPercent = (silo.currentLevel / silo.capacity) * 100;
        return (
          <motion.div 
            key={silo.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-8 rounded-[28px] shadow-sm border border-black/5 flex flex-col gap-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold tracking-tight">{silo.code}</h3>
                <p className="text-black/40 font-bold uppercase text-xs tracking-widest mt-1">{crop?.name || 'Vacío'}</p>
              </div>
              <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${silo.status === 'VACÍO' ? 'bg-black/5 text-black/40' : 'bg-emerald-100 text-emerald-700'}`}>
                {silo.status}
              </div>
            </div>

            <div className="flex items-end gap-6 h-40">
              <div className="relative w-20 h-full bg-black/5 rounded-2xl overflow-hidden">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${levelPercent}%` }}
                  className="absolute bottom-0 w-full bg-blue-500/80 transition-all duration-1000"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-4xl font-black tracking-tighter">{levelPercent.toFixed(0)}%</div>
                <div className="text-black/40 font-bold text-sm">{silo.currentLevel} / {silo.capacity} Kg</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/5">
              <div>
                <p className="text-[10px] font-bold text-black/40 uppercase">Brix Promedio</p>
                <p className="text-xl font-black">{silo.brixAverage.toFixed(1)} °Bx</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-black/40 uppercase">Acidez Promedio</p>
                <p className="text-xl font-black">{silo.acidityAverage.toFixed(2)} %</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

const TruckReceptionView = ({ silos, dispatches, onUpdateSilo, onUpdateDispatch }: { silos: Silo[], dispatches: DispatchRecord[], onUpdateSilo: (silo: Silo) => void, onUpdateDispatch: (id: string, updates: Partial<DispatchRecord>) => void }) => {
  const [selectedDispatchId, setSelectedDispatchId] = useState<string>('');
  const [selectedSiloId, setSelectedSiloId] = useState<string>('');
  
  const pendingDispatches = dispatches.filter(d => d.status === 'PENDIENTE');
  const selectedDispatch = pendingDispatches.find(d => d.id === selectedDispatchId);

  const handleAssign = () => {
    if (!selectedDispatch || !selectedSiloId) return;
    const silo = silos.find(s => s.id === selectedSiloId);
    if (!silo) return;

    onUpdateSilo({
      ...silo,
      currentLevel: silo.currentLevel + selectedDispatch.quantity,
      status: 'MEZCLANDO'
    });
    onUpdateDispatch(selectedDispatch.id, { status: 'RECIBIDO' });
    setSelectedDispatchId('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
      <div className="bg-white p-10 rounded-[28px] shadow-sm border border-black/5 flex flex-col gap-8">
        <h3 className="text-3xl font-bold tracking-tight">Despachos Pendientes</h3>
        <div className="flex flex-col gap-4">
          {pendingDispatches.map(d => (
            <button key={d.id} onClick={() => setSelectedDispatchId(d.id)} className={`p-6 rounded-2xl text-left border-2 transition-all ${selectedDispatchId === d.id ? 'border-[#0052CC] bg-blue-50' : 'border-black/5'}`}>
              <p className="font-bold">{d.providerName || 'Despacho Interno'}</p>
              <p className="text-sm text-black/40">{d.quantity} Kg</p>
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white p-10 rounded-[28px] shadow-sm border border-black/5 flex flex-col gap-8">
        <h3 className="text-3xl font-bold tracking-tight">Asignar a Silo</h3>
        <select value={selectedSiloId} onChange={e => setSelectedSiloId(e.target.value)} className="h-[60px] px-6 bg-black/5 rounded-[20px] font-bold appearance-none">
          <option value="">Seleccione un silo...</option>
          {silos.map(s => <option key={s.id} value={s.id}>{s.code} - {s.currentLevel} Kg</option>)}
        </select>
        <button onClick={handleAssign} disabled={!selectedSiloId || !selectedDispatchId} className="h-[80px] bg-black text-white rounded-[28px] font-black text-xl shadow-xl disabled:opacity-30">Asignar Carga</button>
      </div>
    </div>
  );
};

const ProductionProcessView = ({ silos, onUpdateSilo, onAddBarrel }: { silos: Silo[], onUpdateSilo: (silo: Silo) => void, onAddBarrel: (b: Barrel) => void }) => {
  const [selectedSiloId, setSelectedSiloId] = useState<string>('');
  const [liters, setLiters] = useState<number>(0);
  const [efficiency, setEfficiency] = useState<number>(0);

  const handleProcess = () => {
    const silo = silos.find(s => s.id === selectedSiloId);
    if (!silo || liters === 0) return;
    
    const weightProcessed = (liters / 1000) * 1000; // Simplified logic
    const eff = silo.currentLevel / liters;
    setEfficiency(eff);

    onUpdateSilo({...silo, currentLevel: silo.currentLevel - weightProcessed, status: 'VACIANDO'});
    onAddBarrel({ id: `barrel-${Date.now()}`, code: `B-${Date.now()}`, cropId: silo.cropId, status: 'EN ESPERA', analysisValues: {}, date: new Date().toISOString() });
  };

  return (
    <div className="bg-white p-10 rounded-[28px] shadow-sm border border-black/5 flex flex-col gap-8">
      <h3 className="text-3xl font-bold tracking-tight">Evaporador</h3>
      <select value={selectedSiloId} onChange={e => setSelectedSiloId(e.target.value)} className="h-[60px] px-6 bg-black/5 rounded-[20px] font-bold">
        <option value="">Seleccione Silo Activo...</option>
        {silos.filter(s => s.currentLevel > 0).map(s => <option key={s.id} value={s.id}>{s.code} ({s.currentLevel} Kg)</option>)}
      </select>
      <input type="number" placeholder="Litros de Caudal" value={liters} onChange={e => setLiters(Number(e.target.value))} className="h-[60px] px-6 bg-black/5 rounded-2xl font-bold" />
      <button onClick={handleProcess} className="h-[80px] bg-[#0052CC] text-white rounded-[28px] font-black text-xl shadow-xl">PROCESAR Y LLENAR</button>
      {efficiency > 0 && <p className="text-center font-black text-2xl">Eficiencia: {efficiency.toFixed(2)} Kg/L</p>}
    </div>
  );
};

const HomeDashboardView = ({ onNavigate }: { onNavigate: (tab: string) => void, key?: React.Key }) => {
  const modules = [
    { id: 'campo', label: 'OPERACIONES DE CAMPO', icon: Map, color: 'bg-emerald-700', description: 'Cura, Siembra y Lotes' },
    { id: 'planta', label: 'PROCESAMIENTO EN PLANTA', icon: Factory, color: 'bg-slate-600', description: 'Recepción y Despacho' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[70vh]"
    >
      {modules.map((m) => (
        <button
          key={m.id}
          onClick={() => onNavigate(m.id)}
          className={`${m.color} rounded-[3rem] p-12 flex flex-col justify-between text-white text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl group relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
            <m.icon size={240} />
          </div>
          <div className="z-10">
            <div className="p-4 bg-white/20 rounded-2xl w-fit mb-6">
              <m.icon size={32} />
            </div>
            <h2 className="text-5xl font-black tracking-tighter mb-4">{m.label}</h2>
            <p className="text-white/70 font-medium text-lg">{m.description}</p>
          </div>
          <div className="z-10 flex items-center gap-2 font-bold text-sm uppercase tracking-widest">
            Acceder Módulo <ChevronRight size={18} />
          </div>
        </button>
      ))}
    </motion.div>
  );
};

const ContactManagementView = ({ 
  contacts, 
  onAddContact, 
  onDeleteContact 
}: { 
  contacts: Contact[], 
  onAddContact: (c: Partial<Contact>) => void, 
  onDeleteContact: (id: string) => void,
  key?: React.Key
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    name: '',
    role: 'Administrador',
    phone: '',
    externalId: ''
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Maestro de Contactos</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform"
        >
          <Plus size={20} /> Nuevo Contacto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {contacts.map(contact => (
          <BentoCard key={contact.id} title={contact.name} icon={Users}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-blue-50 text-[#0052CC] text-[10px] font-black uppercase rounded-full">
                  {contact.role}
                </div>
              </div>
              <div className="flex items-center gap-3 text-black/60">
                <Phone size={16} />
                <span className="font-bold">{contact.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-black/60">
                <CreditCard size={16} />
                <span className="font-bold">ID: {contact.externalId}</span>
              </div>
              <div className="pt-4 border-t border-black/5 flex justify-end">
                <button 
                  onClick={() => onDeleteContact(contact.id)}
                  className="p-2 text-black/10 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </BentoCard>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-10 flex flex-col gap-8">
              <h3 className="text-3xl font-bold tracking-tight">Registrar Contacto</h3>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Nombre Completo</span>
                  <input type="text" value={newContact.name} onChange={e => setNewContact(prev => ({ ...prev, name: e.target.value }))} className="h-16 px-6 bg-black/5 rounded-2xl font-bold" />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Cargo / Rol</span>
                  <select 
                    value={newContact.role} 
                    onChange={e => setNewContact(prev => ({ ...prev, role: e.target.value as any }))}
                    className="h-16 px-6 bg-black/5 rounded-2xl font-bold appearance-none"
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Operador">Operador</option>
                    <option value="Proveedor">Proveedor</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Teléfono</span>
                    <input type="text" value={newContact.phone} onChange={e => setNewContact(prev => ({ ...prev, phone: e.target.value }))} className="h-16 px-6 bg-black/5 rounded-2xl font-bold" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">ID / Cédula</span>
                    <input type="text" value={newContact.externalId} onChange={e => setNewContact(prev => ({ ...prev, externalId: e.target.value }))} className="h-16 px-6 bg-black/5 rounded-2xl font-bold" />
                  </div>
                </div>
                <button 
                  onClick={() => { onAddContact(newContact); setIsAdding(false); }}
                  className="h-20 bg-black text-white font-bold rounded-3xl shadow-xl mt-4"
                >
                  Guardar Contacto
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ChemicalManagementView = ({ 
  chemicals, 
  onAddChemical, 
  onDeleteChemical 
}: { 
  chemicals: Chemical[], 
  onAddChemical: (c: Partial<Chemical>) => void, 
  onDeleteChemical: (id: string) => void,
  key?: React.Key
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newChemical, setNewChemical] = useState<Partial<Chemical>>({
    name: '',
    type: 'Fungicida',
    unit: 'ml/Kg'
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Maestro de Insumos</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-[28px] font-bold shadow-xl hover:scale-105 transition-transform h-[60px]"
        >
          <Plus size={20} /> Nuevo Insumo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {chemicals.map(chemical => (
          <BentoCard key={chemical.id} title={chemical.name} icon={FlaskConical}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-full">
                  {chemical.type}
                </div>
              </div>
              <div className="flex items-center gap-3 text-black/60">
                <span className="font-bold text-sm uppercase tracking-widest">Unidad: {chemical.unit}</span>
              </div>
              <div className="pt-4 border-t border-[var(--border)] flex justify-end">
                <button 
                  onClick={() => onDeleteChemical(chemical.id)}
                  className="p-2 text-black/10 hover:text-red-500 transition-colors h-[60px] w-[60px] flex items-center justify-center"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
          </BentoCard>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-xl rounded-[28px] shadow-2xl p-10 flex flex-col gap-8">
              <h3 className="text-3xl font-bold tracking-tight">Registrar Insumo</h3>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Nombre del Insumo</span>
                  <input type="text" value={newChemical.name} onChange={e => setNewChemical(prev => ({ ...prev, name: e.target.value }))} className="h-[60px] px-6 bg-black/5 rounded-[20px] font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Tipo</span>
                    <select 
                      value={newChemical.type} 
                      onChange={e => setNewChemical(prev => ({ ...prev, type: e.target.value as any }))}
                      className="h-[60px] px-6 bg-black/5 rounded-[20px] font-bold appearance-none"
                    >
                      <option value="Fungicida">Fungicida</option>
                      <option value="Insecticida">Insecticida</option>
                      <option value="Fertilizante">Fertilizante</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Unidad</span>
                    <input type="text" value={newChemical.unit} onChange={e => setNewChemical(prev => ({ ...prev, unit: e.target.value }))} className="h-[60px] px-6 bg-black/5 rounded-[20px] font-bold" placeholder="Ej: ml/Kg" />
                  </div>
                </div>
                <button 
                  onClick={() => { onAddChemical(newChemical); setIsAdding(false); }}
                  className="h-[60px] bg-black text-white font-bold rounded-[20px] shadow-xl mt-4"
                >
                  Guardar Insumo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const BentoCard = ({ children, title, icon: Icon, className = "", noPadding = false }: { children: React.ReactNode, title: string, icon: any, className?: string, noPadding?: boolean, key?: React.Key }) => (
  <div className={`bg-white border border-[var(--border)] rounded-[28px] shadow-[var(--shadow)] hover:shadow-md transition-shadow flex flex-col ${noPadding ? '' : 'p-8'} gap-6 ${className}`}>
    <div className={`flex items-center gap-3 ${noPadding ? 'p-8 pb-0' : ''}`}>
      <div className="p-3 bg-blue-50 rounded-2xl text-[#0052CC]">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-black">{title}</h3>
    </div>
    <div className="flex-1">
      {children}
    </div>
  </div>
);

const Stepper = ({ 
  label, 
  value, 
  onChange, 
  step = 0.1, 
  min = 0, 
  max = 1000, 
  unit = "" 
}: { 
  label: string, 
  value: number, 
  onChange: (val: number) => void, 
  step?: number, 
  min?: number, 
  max?: number,
  unit?: string
}) => {
  const increment = () => onChange(Math.min(max, Number((value + step).toFixed(2))));
  const decrement = () => onChange(Math.max(min, Number((value - step).toFixed(2))));

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-between items-end">
        <span className="text-sm font-medium text-black/50 uppercase tracking-wider">{label}</span>
        <span className="text-2xl font-bold text-[#0052CC]">
          {value} <span className="text-sm font-normal text-black/30">{unit}</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={decrement}
          className="flex-1 h-16 bg-black/5 active:bg-black/10 rounded-2xl flex items-center justify-center transition-colors"
        >
          <Minus size={28} />
        </button>
        <button 
          onClick={increment}
          className="flex-1 h-16 bg-[#0052CC] active:bg-[#0041a3] text-white rounded-2xl flex items-center justify-center transition-colors shadow-lg shadow-blue-200"
        >
          <Plus size={28} />
        </button>
      </div>
    </div>
  );
};

const PrecisionSlider = ({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 0.1,
  unit = ""
}: { 
  label: string, 
  value: number, 
  onChange: (val: number) => void, 
  min: number, 
  max: number,
  step?: number,
  unit?: string
}) => (
  <div className="flex flex-col gap-4 w-full">
    <div className="flex justify-between items-end">
      <span className="text-sm font-medium text-black/50 uppercase tracking-wider">{label}</span>
      <span className="text-xl font-bold text-black">
        {value} <span className="text-xs font-normal text-black/30">{unit}</span>
      </span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step} 
      value={value} 
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-3 bg-black/5 rounded-full appearance-none cursor-pointer accent-[#0052CC]"
    />
  </div>
);

const StatusBadge = ({ status }: { status: LotStatus }) => {
  const styles = {
    'PREPARACIÓN': 'bg-amber-100 text-amber-700 border-amber-200',
    'SEMBRADO': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'VACÍO': 'bg-slate-100 text-slate-700 border-slate-200'
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border ${styles[status]}`}>
      {status}
    </span>
  );
};

// --- Views ---

const FarmManagementView = ({ 
  farms, 
  contacts,
  onAddFarm, 
  onDeleteFarm 
}: { 
  farms: Farm[], 
  contacts: Contact[],
  onAddFarm: (farm: Partial<Farm>) => void, 
  onDeleteFarm: (id: string) => void,
  key?: React.Key
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newFarm, setNewFarm] = useState<Partial<Farm>>({
    name: '',
    location: '',
    adminId: '',
    totalHectares: 0,
    unitSystem: 'METRICO'
  });

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNewFarm(prev => ({
            ...prev,
            location: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
            coordinates: { lat: position.coords.latitude, lng: position.coords.longitude }
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("No se pudo obtener la ubicación automáticamente.");
        }
      );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col gap-8"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Fincas</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform"
        >
          <Plus size={20} /> Registrar Finca
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {farms.map(farm => {
          const admin = contacts.find(c => c.id === farm.adminId);
          return (
            <BentoCard key={farm.id} title={farm.name} icon={Home} className="relative group">
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-black/5 rounded-xl text-black/40">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-black/40 block">Ubicación</span>
                    <span className="font-bold">{farm.location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-black/5 rounded-xl text-black/40">
                    <User size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-black/40 block">Administrador</span>
                    <span className="font-bold">{admin?.name || 'Sin asignar'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-black/5 rounded-xl text-black/40">
                    <Layers size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-black/40 block">Área Total</span>
                    <span className="font-bold">{farm.totalHectares} Ha</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-black/5">
                  <div className="flex items-center gap-2">
                    <Settings size={16} className="text-black/30" />
                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Sistema: {farm.unitSystem}</span>
                  </div>
                  <button 
                    onClick={() => onDeleteFarm(farm.id)}
                    className="p-2 text-black/10 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </BentoCard>
          );
        })}
      </div>

      {/* Add Farm Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 border-b border-black/5 flex justify-between items-center">
                <h3 className="text-3xl font-bold tracking-tight">Nueva Finca</h3>
                <button onClick={() => setIsAdding(false)} className="p-4 bg-black/5 rounded-2xl"><Plus className="rotate-45" /></button>
              </div>
              <div className="p-10 flex flex-col gap-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Nombre de la Finca</span>
                    <input 
                      type="text" 
                      value={newFarm.name}
                      onChange={e => setNewFarm(prev => ({ ...prev, name: e.target.value }))}
                      className="h-16 px-6 bg-black/5 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Hectáreas Totales</span>
                    <input 
                      type="number" 
                      value={newFarm.totalHectares}
                      onChange={e => setNewFarm(prev => ({ ...prev, totalHectares: Number(e.target.value) }))}
                      className="h-16 px-6 bg-black/5 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Ubicación</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Ej: Yaracuy, Venezuela"
                      value={newFarm.location}
                      onChange={e => setNewFarm(prev => ({ ...prev, location: e.target.value }))}
                      className="flex-1 h-16 px-6 bg-black/5 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-100"
                    />
                    <button 
                      onClick={handleGetLocation}
                      className="px-6 bg-black text-white rounded-2xl flex items-center justify-center"
                      title="Obtener ubicación actual"
                    >
                      <MapPin size={24} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Administrador</span>
                    <select 
                      value={newFarm.adminId}
                      onChange={e => setNewFarm(prev => ({ ...prev, adminId: e.target.value }))}
                      className="h-16 px-6 bg-black/5 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 appearance-none"
                    >
                      <option value="">Seleccionar...</option>
                      {contacts.filter(c => c.role === 'Administrador').map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Sistema de Unidades</span>
                    <div className="flex bg-black/5 p-1 rounded-2xl h-16">
                      {(['METRICO', 'IMPERIAL'] as UnitSystem[]).map(u => (
                        <button
                          key={u}
                          onClick={() => setNewFarm(prev => ({ ...prev, unitSystem: u }))}
                          className={`flex-1 rounded-xl font-bold transition-all ${newFarm.unitSystem === u ? 'bg-white shadow-sm text-[#0052CC]' : 'text-black/40'}`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => { onAddFarm(newFarm); setIsAdding(false); }}
                  className="h-20 bg-[#0052CC] text-white font-bold rounded-3xl shadow-xl shadow-blue-200 mt-4"
                >
                  Confirmar Registro
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CropMasterView = ({ 
  crops, 
  selectedCropId, 
  setSelectedCropId, 
  onUpdateCrop 
}: { 
  crops: Crop[], 
  selectedCropId: string, 
  setSelectedCropId: (id: string) => void,
  onUpdateCrop: (crop: Crop) => void,
  key?: React.Key
}) => {
  const currentCrop = crops.find(c => c.id === selectedCropId)!;
  const [isAddingParam, setIsAddingParam] = useState(false);
  const [newParam, setNewParam] = useState<Partial<DynamicParameter>>({
    name: '',
    type: 'NUMERIC',
    category: 'FISICO_QUIMICO',
    unit: '°Bx',
    min: 0,
    max: 100,
    options: []
  });
  const [optionInput, setOptionInput] = useState('');

  const addParameter = () => {
    const param: DynamicParameter = {
      id: `p-${Date.now()}`,
      name: newParam.name || 'Nuevo Parámetro',
      type: newParam.type || 'NUMERIC',
      category: newParam.category || 'FISICO_QUIMICO',
      unit: newParam.type === 'NUMERIC' ? newParam.unit : undefined,
      min: newParam.type === 'NUMERIC' ? newParam.min : undefined,
      max: newParam.type === 'NUMERIC' ? newParam.max : undefined,
      options: newParam.type === 'SELECTION' ? newParam.options : undefined,
      booleanOptimalState: newParam.type === 'BOOLEAN' ? (newParam.booleanOptimalState ?? true) : undefined,
      selectionCategories: newParam.type === 'SELECTION' ? newParam.selectionCategories : undefined
    };
    onUpdateCrop({
      ...currentCrop,
      parameters: [...currentCrop.parameters, param]
    });
    setIsAddingParam(false);
    setNewParam({
      name: '',
      type: 'NUMERIC',
      category: 'FISICO_QUIMICO',
      unit: '°Bx',
      min: 0,
      max: 100,
      options: []
    });
  };

  const removeParameter = (id: string) => {
    onUpdateCrop({
      ...currentCrop,
      parameters: currentCrop.parameters.filter(p => p.id !== id)
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Crop Selector */}
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {crops.map(crop => (
          <button
            key={crop.id}
            onClick={() => setSelectedCropId(crop.id)}
            className={`flex items-center gap-3 px-8 py-5 rounded-3xl border transition-all whitespace-nowrap ${
              selectedCropId === crop.id 
                ? 'bg-white border-[#0052CC] shadow-xl text-[#0052CC] ring-4 ring-blue-50' 
                : 'bg-white border-black/5 text-black/50 hover:border-black/20'
            }`}
          >
            <span className="text-3xl">{crop.icon}</span>
            <span className="font-extrabold text-xl">{crop.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Physical-Chemical Section */}
        <div className="lg:col-span-12 flex flex-col gap-6">
          <div className="flex justify-between items-end px-4">
            <div>
              <h3 className="text-2xl font-black tracking-tight">Constructor de Análisis</h3>
              <p className="text-black/40 font-medium">Define los parámetros dinámicos para el control de calidad.</p>
            </div>
            <button 
              onClick={() => setIsAddingParam(true)}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-bold shadow-lg"
            >
              <Plus size={18} /> Agregar Parámetro
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentCrop.parameters.map(param => (
              <BentoCard 
                key={param.id} 
                title={param.name} 
                icon={param.category === 'FISICO_QUIMICO' ? Beaker : ShieldCheck}
                className="relative"
              >
                <button 
                  onClick={() => removeParameter(param.id)}
                  className="absolute top-8 right-8 p-2 text-black/20 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border ${
                      param.category === 'FISICO_QUIMICO' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'
                    }`}>
                      {param.category.replace('_', ' ')}
                    </span>
                    <span className="px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border bg-black/5 text-black/40 border-black/5">
                      {param.type}
                    </span>
                  </div>

                  {param.type === 'NUMERIC' && (
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between text-xs font-bold text-black/40 uppercase tracking-widest">
                        <span>Rango de Aceptación</span>
                        <span>{param.unit}</span>
                      </div>
                      <div className="flex items-center gap-4 bg-black/5 p-4 rounded-2xl">
                        <div className="flex-1 text-center">
                          <span className="text-[10px] block text-black/30">MIN</span>
                          <span className="text-lg font-black">{param.min}</span>
                        </div>
                        <div className="w-px h-8 bg-black/10" />
                        <div className="flex-1 text-center">
                          <span className="text-[10px] block text-black/30">MAX</span>
                          <span className="text-lg font-black">{param.max}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {param.type === 'SELECTION' && (
                    <div className="flex flex-wrap gap-2">
                      {param.options?.map((opt, idx) => (
                        <span key={idx} className="px-3 py-1 bg-black/5 rounded-lg text-xs font-bold">
                          {opt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </BentoCard>
            ))}
          </div>
        </div>
      </div>

      {/* Add Parameter Modal */}
      <AnimatePresence>
        {isAddingParam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsAddingParam(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 border-b border-black/5 flex justify-between items-center">
                <h3 className="text-3xl font-bold tracking-tight">Nuevo Parámetro</h3>
                <button onClick={() => setIsAddingParam(false)} className="p-4 bg-black/5 rounded-2xl"><Plus className="rotate-45" /></button>
              </div>
              <div className="p-10 flex flex-col gap-10">
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Nombre del Análisis</span>
                    <input 
                      type="text" 
                      placeholder="Ej: Grados Brix"
                      value={newParam.name}
                      onChange={e => setNewParam(prev => ({ ...prev, name: e.target.value }))}
                      className="h-16 px-6 bg-black/5 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Categoría</span>
                    <div className="flex bg-black/5 p-1 rounded-2xl h-16">
                      {(['FISICO_QUIMICO', 'MICROBIOLOGICO'] as ParameterCategory[]).map(c => (
                        <button
                          key={c}
                          onClick={() => setNewParam(prev => ({ ...prev, category: c }))}
                          className={`flex-1 rounded-xl font-bold text-[10px] transition-all ${newParam.category === c ? 'bg-white shadow-sm text-[#0052CC]' : 'text-black/40'}`}
                        >
                          {c.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Tipo de Valor</span>
                    <div className="grid grid-cols-3 gap-2">
                      {(['NUMERIC', 'BOOLEAN', 'SELECTION'] as ParameterType[]).map(t => (
                        <button
                          key={t}
                          onClick={() => setNewParam(prev => ({ ...prev, type: t }))}
                          className={`h-12 rounded-xl font-bold text-[10px] border transition-all ${newParam.type === t ? 'bg-black text-white border-black' : 'bg-white text-black/40 border-black/10'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Unidad de Medida</span>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                      {UNITS_MASTER.map(u => (
                        <button
                          key={u}
                          onClick={() => setNewParam(prev => ({ ...prev, unit: u }))}
                          className={`px-4 py-2 rounded-xl font-bold text-xs border whitespace-nowrap transition-all ${newParam.unit === u ? 'bg-[#0052CC] text-white border-[#0052CC]' : 'bg-white text-black/40 border-black/10'}`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {newParam.type === 'NUMERIC' && (
                  <div className="grid grid-cols-2 gap-10 bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100">
                    <Stepper 
                      label="Mínimo Permitido" 
                      value={newParam.min || 0} 
                      onChange={v => setNewParam(prev => ({ ...prev, min: v }))} 
                      step={0.1}
                    />
                    <Stepper 
                      label="Máximo Permitido" 
                      value={newParam.max || 100} 
                      onChange={v => setNewParam(prev => ({ ...prev, max: v }))} 
                      step={0.1}
                    />
                  </div>
                )}

                {newParam.type === 'BOOLEAN' && (
                  <div className="flex flex-col gap-4 bg-emerald-50/50 p-8 rounded-[2rem] border border-emerald-100">
                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Lógica de Calidad (Boolean)</span>
                    <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-emerald-200">
                      <span className="font-bold">Estado 'ACTIVO' significa:</span>
                      <div className="flex bg-black/5 p-1 rounded-xl">
                        <button 
                          onClick={() => setNewParam(prev => ({ ...prev, booleanOptimalState: true }))}
                          className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${newParam.booleanOptimalState !== false ? 'bg-emerald-500 text-white shadow-lg' : 'text-black/40'}`}
                        >
                          ÓPTIMO
                        </button>
                        <button 
                          onClick={() => setNewParam(prev => ({ ...prev, booleanOptimalState: false }))}
                          className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${newParam.booleanOptimalState === false ? 'bg-red-500 text-white shadow-lg' : 'text-black/40'}`}
                        >
                          ALERTA
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {newParam.type === 'SELECTION' && (
                  <div className="flex flex-col gap-4 bg-purple-50/50 p-8 rounded-[2rem] border border-purple-100">
                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Opciones y Categorías</span>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Nueva opción..."
                        value={optionInput}
                        onChange={e => setOptionInput(e.target.value)}
                        className="flex-1 h-14 px-6 bg-white rounded-xl font-bold border border-purple-200"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && optionInput.trim()) {
                            const opt = optionInput.trim();
                            setNewParam(prev => ({ 
                              ...prev, 
                              options: [...(prev.options || []), opt],
                              selectionCategories: { ...(prev.selectionCategories || {}), [opt]: 'Bueno' }
                            }));
                            setOptionInput('');
                          }
                        }}
                      />
                      <button 
                        onClick={() => {
                          if (optionInput.trim()) {
                            const opt = optionInput.trim();
                            setNewParam(prev => ({ 
                              ...prev, 
                              options: [...(prev.options || []), opt],
                              selectionCategories: { ...(prev.selectionCategories || {}), [opt]: 'Bueno' }
                            }));
                            setOptionInput('');
                          }
                        }}
                        className="px-6 bg-black text-white rounded-xl font-bold"
                      >
                        Agregar
                      </button>
                    </div>
                    <div className="flex flex-col gap-3">
                      {newParam.options?.map((opt, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white border border-purple-200 rounded-2xl">
                          <span className="font-bold">{opt}</span>
                          <div className="flex items-center gap-2">
                            {(['Bueno', 'Regular', 'Malo'] as QualityCategory[]).map(cat => (
                              <button
                                key={cat}
                                onClick={() => setNewParam(prev => ({
                                  ...prev,
                                  selectionCategories: { ...(prev.selectionCategories || {}), [opt]: cat }
                                }))}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border ${
                                  newParam.selectionCategories?.[opt] === cat
                                    ? cat === 'Bueno' ? 'bg-emerald-500 text-white border-emerald-600' : 
                                      cat === 'Regular' ? 'bg-amber-500 text-white border-amber-600' : 
                                      'bg-red-500 text-white border-red-600'
                                    : 'bg-black/5 text-black/40 border-transparent'
                                }`}
                              >
                                {cat.toUpperCase()}
                              </button>
                            ))}
                            <button 
                              onClick={() => {
                                const newOpts = newParam.options?.filter((_, i) => i !== idx);
                                const newCats = { ...newParam.selectionCategories };
                                delete newCats[opt];
                                setNewParam(prev => ({ ...prev, options: newOpts, selectionCategories: newCats }));
                              }}
                              className="ml-2 p-2 text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button 
                  onClick={addParameter}
                  className="h-20 bg-black text-white font-bold rounded-3xl shadow-2xl active:scale-95 transition-transform"
                >
                  Crear Parámetro Dinámico
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MaterialReceptionView = ({ 
  receptions, 
  crops, 
  lots, 
  farms,
  onAddReception 
}: { 
  receptions: MaterialReception[], 
  crops: Crop[], 
  lots: Lot[], 
  farms: Farm[],
  onAddReception: (reception: MaterialReception) => void,
  key?: React.Key
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newReception, setNewReception] = useState<Partial<MaterialReception>>({
    provider: '',
    cropId: crops[0]?.id || '',
    lotId: '',
    farmId: '',
    bundleCount: 100,
    averageWeight: 5.0,
    qualityValues: {}
  });

  const selectedCrop = crops.find(c => c.id === newReception.cropId);
  const filteredLots = lots.filter(l => l.cropId === newReception.cropId && (!newReception.farmId || l.farmId === newReception.farmId));

  useEffect(() => {
    if (selectedCrop) {
      const initialValues: any = {};
      selectedCrop.parameters.forEach(p => {
        if (p.type === 'NUMERIC') initialValues[p.id] = (p.min! + p.max!) / 2;
        if (p.type === 'BOOLEAN') initialValues[p.id] = true;
        if (p.type === 'SELECTION') initialValues[p.id] = p.options?.[0] || '';
      });
      setNewReception(prev => ({ ...prev, qualityValues: initialValues }));
    }
  }, [newReception.cropId, selectedCrop]);

  const calculateHealthScore = (values: { [key: string]: any }) => {
    if (!selectedCrop || selectedCrop.parameters.length === 0) return 100;
    
    let totalScore = 0;
    selectedCrop.parameters.forEach(p => {
      const val = values[p.id];
      if (p.type === 'NUMERIC') {
        if (val >= p.min! && val <= p.max!) totalScore += 100;
      } else if (p.type === 'BOOLEAN') {
        const isOptimal = p.booleanOptimalState !== false; // Default true
        if (val === isOptimal) totalScore += 100;
      } else if (p.type === 'SELECTION') {
        const category = p.selectionCategories?.[val] || 'Bueno';
        if (category === 'Bueno') totalScore += 100;
        else if (category === 'Regular') totalScore += 50;
      }
    });
    return Math.round(totalScore / selectedCrop.parameters.length);
  };

  const getStatusFromScore = (score: number): QualityCategory => {
    if (score >= 80) return 'Bueno';
    if (score >= 50) return 'Regular';
    return 'Malo';
  };

  const handleAdd = () => {
    if (!newReception.provider || !newReception.lotId) {
      alert("Por favor complete el proveedor y seleccione un lote.");
      return;
    }

    const score = calculateHealthScore(newReception.qualityValues || {});
    const reception: MaterialReception = {
      id: `rec-${Date.now()}`,
      date: new Date().toISOString(),
      provider: newReception.provider!,
      cropId: newReception.cropId!,
      lotId: newReception.lotId!,
      farmId: newReception.farmId!,
      bundleCount: newReception.bundleCount!,
      averageWeight: newReception.averageWeight!,
      qualityValues: newReception.qualityValues!,
      healthScore: score,
      status: getStatusFromScore(score)
    };

    onAddReception(reception);
    setIsAdding(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Recepción de Material</h2>
        <button 
          onClick={() => setIsAdding(true)} 
          className="h-16 px-10 bg-black text-white rounded-2xl font-black shadow-xl active:scale-95 transition-transform flex items-center gap-3"
        >
          <Plus size={24} /> Registrar Entrada
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {receptions.map(rec => {
          const crop = crops.find(c => c.id === rec.cropId);
          const lot = lots.find(l => l.id === rec.lotId);
          return (
            <BentoCard key={rec.id} title={rec.provider} icon={Layers} className="relative">
              <div className="absolute top-8 right-8">
                <span className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest border ${
                  rec.status === 'Bueno' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                  rec.status === 'Regular' ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                  'bg-red-100 text-red-700 border-red-200'
                }`}>
                  {rec.status.toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 text-black/40 text-xs font-bold uppercase tracking-widest">
                  <Clock size={14} /> {new Date(rec.date).toLocaleDateString()} • {lot?.lotCode}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/5 p-4 rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-black/40 block mb-1">Bultos</span>
                    <span className="text-xl font-black">{rec.bundleCount}</span>
                  </div>
                  <div className="bg-black/5 p-4 rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-black/40 block mb-1">Peso Prom.</span>
                    <span className="text-xl font-black">{rec.averageWeight} Kg</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-black/5 p-5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{crop?.icon}</span>
                    <span className="font-black">{crop?.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-black/40 block">Health Score</span>
                    <span className={`text-2xl font-black ${rec.healthScore >= 80 ? 'text-emerald-500' : rec.healthScore >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                      {rec.healthScore}%
                    </span>
                  </div>
                </div>
              </div>
            </BentoCard>
          );
        })}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-10 border-b border-black/5 flex justify-between items-center bg-white sticky top-0 z-10">
                <h3 className="text-3xl font-bold tracking-tight">Recepción de Material Vegetal</h3>
                <button onClick={() => setIsAdding(false)} className="p-4 bg-black/5 rounded-2xl"><Plus className="rotate-45" /></button>
              </div>

              <div className="p-10 flex flex-col gap-10 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Left Column: Basic Info */}
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Proveedor</span>
                      <input 
                        type="text" 
                        value={newReception.provider}
                        onChange={e => setNewReception(prev => ({ ...prev, provider: e.target.value }))}
                        className="h-16 px-6 bg-black/5 rounded-2xl font-bold text-xl"
                        placeholder="Nombre del Proveedor"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Finca de Recepción</span>
                      <div className="grid grid-cols-2 gap-2">
                        {farms.map(f => (
                          <button
                            key={f.id}
                            onClick={() => setNewReception(prev => ({ ...prev, farmId: f.id, lotId: '' }))}
                            className={`h-14 px-4 rounded-xl font-bold border transition-all text-sm flex items-center justify-between ${newReception.farmId === f.id ? 'bg-[#0052CC] text-white border-[#0052CC]' : 'bg-white border-black/10 text-black/40'}`}
                          >
                            {f.name}
                            {newReception.farmId === f.id && <CheckCircle2 size={16} />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Rubro</span>
                      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {crops.map(c => (
                          <button
                            key={c.id}
                            onClick={() => setNewReception(prev => ({ ...prev, cropId: c.id, lotId: '' }))}
                            className={`px-6 py-4 rounded-2xl font-bold border transition-all flex items-center gap-2 ${newReception.cropId === c.id ? 'bg-black text-white border-black' : 'bg-white text-black/40 border-black/10'}`}
                          >
                            <span>{c.icon}</span> {c.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Lote de Destino</span>
                      <div className="grid grid-cols-2 gap-2">
                        {filteredLots.map(l => (
                          <button
                            key={l.id}
                            onClick={() => setNewReception(prev => ({ ...prev, lotId: l.id }))}
                            className={`h-14 px-4 rounded-xl font-bold border transition-all text-xs flex items-center justify-between ${newReception.lotId === l.id ? 'bg-[#0052CC] text-white border-[#0052CC]' : 'bg-white border-black/10 text-black/40'}`}
                          >
                            {l.lotCode}
                            {newReception.lotId === l.id && <CheckCircle2 size={16} />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 bg-black/5 p-8 rounded-[2rem]">
                      <Stepper 
                        label="Cantidad de Bultos" 
                        value={newReception.bundleCount || 0} 
                        onChange={v => setNewReception(prev => ({ ...prev, bundleCount: v }))} 
                        step={1}
                        min={1}
                      />
                      <PrecisionSlider 
                        label="Peso Promedio (Kg)" 
                        value={newReception.averageWeight || 0} 
                        onChange={v => setNewReception(prev => ({ ...prev, averageWeight: v }))} 
                        min={0.1} 
                        max={50} 
                        unit="Kg"
                      />
                    </div>
                  </div>

                  {/* Right Column: Dynamic Quality Parameters */}
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Control de Calidad en Tiempo Real</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-black/30">Score:</span>
                        <span className="text-xl font-black text-[#0052CC]">{calculateHealthScore(newReception.qualityValues || {})}%</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {selectedCrop?.parameters.map(param => {
                        const val = newReception.qualityValues?.[param.id];
                        let isGood = true;
                        if (param.type === 'NUMERIC') isGood = val >= param.min! && val <= param.max!;
                        else if (param.type === 'BOOLEAN') isGood = val === (param.booleanOptimalState !== false);
                        else if (param.type === 'SELECTION') isGood = (param.selectionCategories?.[val] || 'Bueno') === 'Bueno';

                        return (
                          <div key={param.id} className={`p-6 rounded-3xl border-2 transition-all ${isGood ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                            <div className="flex justify-between items-center mb-4">
                              <span className="font-bold text-black">{param.name}</span>
                              {isGood ? <CheckCircle2 className="text-emerald-500" size={20} /> : <XCircle className="text-red-500" size={20} />}
                            </div>

                            {param.type === 'NUMERIC' && (
                              <div className="flex flex-col gap-4">
                                <Stepper 
                                  label={`Valor (${param.unit})`}
                                  value={val}
                                  onChange={v => setNewReception(prev => ({ ...prev, qualityValues: { ...prev.qualityValues, [param.id]: v } }))}
                                  min={0}
                                  max={1000}
                                  step={0.1}
                                />
                                <div className="flex justify-between text-[10px] font-bold text-black/30">
                                  <span>Rango: {param.min} - {param.max}</span>
                                </div>
                              </div>
                            )}

                            {param.type === 'BOOLEAN' && (
                              <div className="flex bg-white p-1 rounded-2xl h-14 border border-black/5">
                                {[true, false].map(v => (
                                  <button
                                    key={v.toString()}
                                    onClick={() => setNewReception(prev => ({ ...prev, qualityValues: { ...prev.qualityValues, [param.id]: v } }))}
                                    className={`flex-1 rounded-xl font-bold text-xs transition-all ${val === v ? 'bg-black text-white shadow-lg' : 'text-black/40'}`}
                                  >
                                    {v ? 'SI' : 'NO'}
                                  </button>
                                ))}
                              </div>
                            )}

                            {param.type === 'SELECTION' && (
                              <div className="flex flex-wrap gap-2">
                                {param.options?.map(opt => (
                                  <button
                                    key={opt}
                                    onClick={() => setNewReception(prev => ({ ...prev, qualityValues: { ...prev.qualityValues, [param.id]: opt } }))}
                                    className={`px-4 py-2 rounded-xl font-bold text-xs border transition-all ${val === opt ? 'bg-black text-white border-black shadow-md' : 'bg-white text-black/40 border-black/10'}`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 border-t border-black/5 bg-white sticky bottom-0">
                <button 
                  onClick={handleAdd}
                  className="w-full h-20 bg-black text-white font-bold rounded-3xl shadow-2xl text-xl active:scale-95 transition-transform"
                >
                  Confirmar Recepción y Guardar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const DispatchManagementView = ({ 
  dispatches, 
  lots, 
  farms,
  onAddDispatch
}: { 
  dispatches: DispatchRecord[], 
  lots: Lot[], 
  farms: Farm[],
  onAddDispatch: (dispatch: DispatchRecord) => void,
  key?: React.Key
}) => {
  const [type, setType] = useState<'INTERNO' | 'EXTERNO'>('INTERNO');
  const [selectedLotId, setSelectedLotId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1000);
  const [providerName, setProviderName] = useState<string>('');

  const selectedLot = lots.find(l => l.id === selectedLotId);

  // Consider lots that have been sown as ready for dispatch (in a real app, this might be 'COSECHADO')
  const readyLots = lots.filter(l => l.status === 'SEMBRADO');

  const handleSave = () => {
    if (!selectedLotId) {
      alert("Seleccione un lote.");
      return;
    }
    if (type === 'EXTERNO' && !providerName) {
      alert("Ingrese el destino/cliente para el despacho externo.");
      return;
    }

    const dispatch: DispatchRecord = {
      id: `disp-${Date.now()}`,
      lotId: selectedLotId,
      date: new Date().toISOString(),
      quantity,
      status: 'PENDIENTE',
      type,
      originFarmId: selectedLot?.farmId,
      providerName: type === 'EXTERNO' ? providerName : undefined
    };

    onAddDispatch(dispatch);
    setSelectedLotId('');
    setQuantity(1000);
    setProviderName('');
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase">Despachos</h2>
          <p className="text-black/40 font-mono text-sm">LOGÍSTICA Y TRAZABILIDAD DE SALIDA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <BentoCard title="Generar Despacho" icon={Truck}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Tipo de Despacho</span>
                <div className="flex gap-4">
                  <button
                    onClick={() => setType('INTERNO')}
                    className={`flex-1 h-[60px] rounded-[20px] font-bold border-[1px] transition-all ${
                      type === 'INTERNO' ? 'bg-black text-white border-black' : 'bg-black/5 text-black/40 border-transparent'
                    }`}
                  >
                    INTERNO (A Planta)
                  </button>
                  <button
                    onClick={() => setType('EXTERNO')}
                    className={`flex-1 h-[60px] rounded-[20px] font-bold border-[1px] transition-all ${
                      type === 'EXTERNO' ? 'bg-[#0052CC] text-white border-[#0052CC]' : 'bg-black/5 text-black/40 border-transparent'
                    }`}
                  >
                    EXTERNO (Venta)
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Lote de Origen</span>
                <select 
                  value={selectedLotId} 
                  onChange={e => setSelectedLotId(e.target.value)}
                  className="h-[60px] px-6 bg-black/5 rounded-[20px] font-bold appearance-none"
                >
                  <option value="">Seleccione un lote...</option>
                  {readyLots.map(l => {
                    const farm = farms.find(f => f.id === l.farmId);
                    return (
                      <option key={l.id} value={l.id}>
                        {l.lotCode} - {farm?.name}
                      </option>
                    );
                  })}
                </select>
                {readyLots.length === 0 && (
                  <span className="text-xs text-amber-600 font-bold mt-1">No hay lotes listos para despacho.</span>
                )}
              </div>

              {type === 'EXTERNO' && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Destino / Cliente</span>
                  <input 
                    type="text" 
                    value={providerName}
                    onChange={e => setProviderName(e.target.value)}
                    placeholder="Nombre del cliente o destino"
                    className="h-[60px] px-6 bg-black/5 rounded-[20px] font-bold"
                  />
                </div>
              )}

              <div className="p-6 bg-black/5 rounded-[28px]">
                <Stepper 
                  label="Cantidad (Kg)"
                  value={quantity}
                  onChange={setQuantity}
                  min={100}
                  max={100000}
                  step={100}
                />
              </div>

              <div className="p-6 bg-white rounded-[20px] border border-black/5 flex flex-col gap-2">
                <span className="text-[10px] font-black text-black/30 uppercase tracking-widest">Resumen de Trazabilidad</span>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Lote:</span>
                  <span className="font-mono text-sm">{selectedLot?.lotCode || '---'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Finca:</span>
                  <span className="text-sm">{farms.find(f => f.id === selectedLot?.farmId)?.name || '---'}</span>
                </div>
              </div>

              <button 
                onClick={handleSave}
                disabled={!selectedLotId || (type === 'EXTERNO' && !providerName)}
                className={`h-[60px] font-black rounded-[20px] shadow-xl transition-all mt-auto ${
                  selectedLotId && (type === 'INTERNO' || providerName)
                    ? 'bg-[#0052CC] text-white hover:scale-[1.02]' 
                    : 'bg-black/10 text-black/30 cursor-not-allowed'
                }`}
              >
                REGISTRAR DESPACHO
              </button>
            </div>
          </BentoCard>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <BentoCard title="Historial de Despachos" icon={ClipboardCheck}>
            <div className="flex flex-col gap-4">
              {dispatches.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-black/5 rounded-[28px] text-black/20">
                  <Truck size={64} strokeWidth={1} className="mb-4" />
                  <p className="font-bold">No hay despachos registrados.</p>
                </div>
              ) : (
                dispatches.map(dispatch => {
                  const lot = lots.find(l => l.id === dispatch.lotId);
                  const farm = farms.find(f => f.id === dispatch.originFarmId);
                  return (
                    <div key={dispatch.id} className="bg-white p-6 rounded-[28px] border-[1px] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 industrial-btn">
                      <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-2xl text-white ${dispatch.type === 'INTERNO' ? 'bg-black' : 'bg-[#0052CC]'}`}>
                          <Truck size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-black text-xl">{dispatch.id.split('-')[1]}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest ${dispatch.type === 'INTERNO' ? 'bg-black/10 text-black' : 'bg-[#0052CC]/10 text-[#0052CC]'}`}>
                              {dispatch.type}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-black/40 uppercase tracking-widest">
                            {dispatch.type === 'EXTERNO' ? dispatch.providerName : farm?.name} • Lote {lot?.lotCode || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-8 items-center w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right">
                          <span className="text-[10px] font-black text-black/30 uppercase tracking-widest block">Cantidad</span>
                          <span className="text-xl font-black">{dispatch.quantity} Kg</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black text-black/30 uppercase tracking-widest block">Fecha</span>
                          <span className="text-sm font-bold">{new Date(dispatch.date).toLocaleDateString()}</span>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black border ${
                          dispatch.status === 'RECIBIDO' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-amber-50 border-amber-200 text-amber-600'
                        }`}>
                          {dispatch.status}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </BentoCard>
        </div>
      </div>
    </div>
  );
};
const QualityManagementView = ({ 
  barrels, 
  crops, 
  lots,
  onUpdateBarrel
}: { 
  barrels: Barrel[], 
  crops: Crop[], 
  lots: Lot[],
  onUpdateBarrel: (barrel: Barrel) => void,
  key?: React.Key
}) => {
  const [selectedBarrelId, setSelectedBarrelId] = useState<string | null>(null);
  const selectedBarrel = barrels.find(b => b.id === selectedBarrelId);
  const selectedCrop = crops.find(c => c.id === selectedBarrel?.cropId);

  const handleStatusChange = (status: BarrelStatus) => {
    if (selectedBarrel) {
      const hoursPassed = (Date.now() - new Date(selectedBarrel.date).getTime()) / (1000 * 60 * 60);
      if (status === 'LIBERADO' && hoursPassed < 72) return;
      onUpdateBarrel({ ...selectedBarrel, status });
    }
  };

  const isIncubating = (date: string) => (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60) < 72;

  const handleValueChange = (paramId: string, value: any) => {
    if (selectedBarrel) {
      onUpdateBarrel({
        ...selectedBarrel,
        analysisValues: { ...selectedBarrel.analysisValues, [paramId]: value }
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full overflow-hidden">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black tracking-tighter">CUARENTENA DE BARRILES</h2>
          <p className="text-black/40 font-mono text-sm">SISTEMA DE CONTROL MICROBIOLÓGICO</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-hidden">
        {/* Barrel List */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto no-scrollbar pr-2">
          {barrels.map(barrel => (
            <button
              key={barrel.id}
              onClick={() => setSelectedBarrelId(barrel.id)}
              className={`p-6 rounded-3xl border-2 transition-all text-left flex justify-between items-center industrial-btn ${
                selectedBarrelId === barrel.id 
                  ? 'bg-white border-[#0052CC] shadow-xl ring-4 ring-blue-50' 
                  : 'bg-white border-black/5 hover:border-black/20'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${
                  barrel.status === 'LIBERADO' ? 'bg-emerald-100 text-emerald-600' :
                  barrel.status === 'RECHAZADO' ? 'bg-red-100 text-red-600' :
                  barrel.status === 'EN ANÁLISIS' ? 'bg-blue-100 text-blue-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  <Box size={24} />
                </div>
                <div>
                  <h4 className="font-mono font-bold text-xl">{barrel.code}</h4>
                  <p className="text-xs font-bold text-black/40 uppercase tracking-widest">
                    {crops.find(c => c.id === barrel.cropId)?.name} • {new Date(barrel.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border ${
                barrel.status === 'LIBERADO' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                barrel.status === 'RECHAZADO' ? 'bg-red-50 border-red-200 text-red-600' :
                barrel.status === 'EN ANÁLISIS' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                {barrel.status}
              </span>
            </button>
          ))}
        </div>

        {/* Barrel Details & Analysis */}
        <div className="lg:col-span-7 bg-white rounded-[3rem] border border-black/10 shadow-2xl overflow-hidden flex flex-col">
          {selectedBarrel ? (
            <>
              <div className="p-10 border-b border-black/5 bg-slate-50/50 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black text-[#0052CC] uppercase tracking-[0.3em] mb-2 block">Detalles del Activo</span>
                  <h3 className="text-3xl font-black font-mono">{selectedBarrel.code}</h3>
                </div>
                <div className="flex gap-2">
                  {(['EN ESPERA', 'EN ANÁLISIS', 'LIBERADO', 'RECHAZADO'] as BarrelStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border ${
                        selectedBarrel.status === s 
                          ? 'bg-black text-white border-black shadow-lg' 
                          : 'bg-white text-black/40 border-black/5 hover:border-black/20'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-10 flex-1 overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {selectedCrop?.parameters.filter(p => p.category === 'MICROBIOLOGICO').map(param => (
                    <div key={param.id} className="p-6 bg-black/5 rounded-[2rem] border border-black/5 flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-black/40 uppercase tracking-widest">{param.name}</span>
                        <span className="text-[10px] font-black px-2 py-1 bg-white rounded-lg border border-black/5">{param.unit}</span>
                      </div>
                      
                      {param.type === 'NUMERIC' && (
                        <Stepper 
                          label="Resultado"
                          value={selectedBarrel.analysisValues[param.id] || 0}
                          onChange={v => handleValueChange(param.id, v)}
                          min={0}
                          max={1000}
                          step={0.1}
                        />
                      )}

                      {param.type === 'BOOLEAN' && (
                        <div className="flex bg-white p-1 rounded-2xl h-16 border border-black/5">
                          {[true, false].map(v => (
                            <button
                              key={v.toString()}
                              onClick={() => handleValueChange(param.id, v)}
                              className={`flex-1 rounded-xl font-bold transition-all ${selectedBarrel.analysisValues[param.id] === v ? 'bg-black text-white shadow-lg' : 'text-black/40'}`}
                            >
                              {v ? 'POSITIVO' : 'NEGATIVO'}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {selectedCrop?.parameters.filter(p => p.category === 'MICROBIOLOGICO').length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-black/20">
                    <FlaskConical size={64} strokeWidth={1} className="mb-4" />
                    <p className="font-bold">No hay parámetros microbiológicos definidos para este rubro.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
              <div className="w-24 h-24 bg-black/5 rounded-full flex items-center justify-center mb-6 text-black/20">
                <Search size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Seleccione un Barril</h3>
              <p className="text-black/40 max-w-xs">Elija un barril de la lista para ver su trazabilidad y registrar análisis de laboratorio.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CureManagementView = ({ 
  receptions,
  lots, 
  chemicals, 
  contacts,
  onAddCureRecord
}: { 
  receptions: MaterialReception[],
  lots: Lot[], 
  chemicals: Chemical[], 
  contacts: Contact[],
  onAddCureRecord: (record: Partial<CureRecord>) => void,
  key?: React.Key
}) => {
  const [selectedReceptionId, setSelectedReceptionId] = useState<string>('');
  const [newCure, setNewCure] = useState<Partial<CureRecord>>({
    chemicalId: chemicals[0]?.id || '',
    dosage: 1.0,
    responsibleId: contacts[0]?.id || '',
    date: new Date().toISOString().split('T')[0]
  });

  const selectedChemical = chemicals.find(c => c.id === newCure.chemicalId);
  const selectedReception = receptions.find(r => r.id === selectedReceptionId);

  // Consider "pending" receptions as those whose lot doesn't have a cure record yet
  const pendingReceptions = receptions.filter(r => {
    const lot = lots.find(l => l.id === r.lotId);
    return lot && (!lot.cureRecords || lot.cureRecords.length === 0);
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase">Tratamiento de Semilla (Cura)</h2>
          <p className="text-black/40 font-mono text-sm">REGISTRO DE APLICACIÓN FITOSANITARIA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <BentoCard title="Recepción Pendiente" icon={Map}>
            <div className="flex flex-col gap-4">
              {pendingReceptions.map(reception => {
                const lot = lots.find(l => l.id === reception.lotId);
                return (
                  <button
                    key={reception.id}
                    onClick={() => setSelectedReceptionId(reception.id)}
                    className={`p-6 rounded-[28px] border-[1px] transition-all text-left industrial-btn ${
                      selectedReceptionId === reception.id ? 'bg-white border-[#0052CC] shadow-[var(--shadow)]' : 'bg-black/5 border-transparent'
                    }`}
                  >
                    <span className="font-mono font-bold text-lg">{lot?.lotCode || 'Lote Desconocido'}</span>
                    <span className="block text-[10px] font-black text-black/40 uppercase tracking-widest">Prov: {reception.provider} • {new Date(reception.date).toLocaleDateString()}</span>
                  </button>
                );
              })}
              {pendingReceptions.length === 0 && (
                <span className="text-sm text-black/40 font-bold mt-2">No hay recepciones pendientes por curar.</span>
              )}
            </div>
          </BentoCard>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <BentoCard title="Detalles del Tratamiento" icon={Droplets}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Producto Químico</span>
                  <div className="grid grid-cols-1 gap-2">
                    {chemicals.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setNewCure(prev => ({ ...prev, chemicalId: c.id }))}
                        className={`h-[60px] px-6 rounded-[20px] font-bold border-[1px] transition-all text-left flex justify-between items-center ${
                          newCure.chemicalId === c.id ? 'bg-white border-[#0052CC] text-[#0052CC] shadow-sm' : 'bg-black/5 border-transparent text-black/40'
                        }`}
                      >
                        {c.name}
                        <span className="text-[10px] opacity-50">{c.type}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Fecha de Aplicación</span>
                  <input 
                    type="date" 
                    value={newCure.date}
                    onChange={e => setNewCure(prev => ({ ...prev, date: e.target.value }))}
                    className="h-[60px] px-6 bg-black/5 rounded-[20px] font-bold text-xl"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <Stepper 
                  label={`Dosis (${selectedChemical?.unit || 'ml/L'})`}
                  value={newCure.dosage || 0}
                  onChange={v => setNewCure(prev => ({ ...prev, dosage: v }))}
                  min={0.1}
                  max={50}
                  step={0.1}
                />
                
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Responsable de Aplicación</span>
                  <select 
                    value={newCure.responsibleId}
                    onChange={e => setNewCure(prev => ({ ...prev, responsibleId: e.target.value }))}
                    className="h-[60px] px-6 bg-black/5 rounded-[20px] font-bold appearance-none"
                  >
                    {contacts.filter(c => c.role === 'Operador' || c.role === 'Administrador').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={() => {
                    if (!selectedReception) return alert('Seleccione una recepción pendiente');
                    onAddCureRecord({ ...newCure, lotId: selectedReception.lotId });
                    setSelectedReceptionId('');
                    setNewCure(prev => ({ ...prev, dosage: 1.0 }));
                  }}
                  disabled={!selectedReceptionId}
                  className={`h-[60px] font-black rounded-[20px] shadow-xl transition-all mt-auto ${
                    selectedReceptionId 
                      ? 'bg-[#0052CC] text-white hover:scale-[1.02]' 
                      : 'bg-black/10 text-black/30 cursor-not-allowed'
                  }`}
                >
                  REGISTRAR CURA
                </button>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </div>
  );
};

const SowingManagementView = ({ 
  lots, 
  contacts,
  onAddSowingRecord
}: { 
  lots: Lot[], 
  contacts: Contact[],
  onAddSowingRecord: (record: Partial<SowingRecord>) => void,
  key?: React.Key
}) => {
  const [selectedLotId, setSelectedLotId] = useState<string>('');
  const [newSowing, setNewSowing] = useState<Partial<SowingRecord>>({
    density: 35000,
    responsibleId: contacts[0]?.id || '',
    date: new Date().toISOString().split('T')[0]
  });

  const selectedLot = lots.find(l => l.id === selectedLotId);

  // Lots that have cure records but are not yet sown
  const readyLots = lots.filter(l => 
    l.cureRecords && l.cureRecords.length > 0 && l.status !== 'SEMBRADO'
  );

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase">Registro de Siembra</h2>
          <p className="text-black/40 font-mono text-sm">CONTROL DE DENSIDAD Y TRAZABILIDAD</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <BentoCard title="Lotes Listos (Semilla Curada)" icon={Sprout}>
            <div className="flex flex-col gap-4">
              {readyLots.map(lot => (
                <button
                  key={lot.id}
                  onClick={() => setSelectedLotId(lot.id)}
                  className={`p-6 rounded-[28px] border-[1px] transition-all text-left industrial-btn ${
                    selectedLotId === lot.id ? 'bg-white border-[#0052CC] shadow-[var(--shadow)]' : 'bg-black/5 border-transparent'
                  }`}
                >
                  <span className="font-mono font-bold text-lg">{lot.lotCode}</span>
                  <span className="block text-[10px] font-black text-black/40 uppercase tracking-widest">{lot.soilType} • {lot.area} Ha</span>
                </button>
              ))}
              {readyLots.length === 0 && (
                <span className="text-sm text-black/40 font-bold mt-2">No hay lotes con semilla curada listos para siembra.</span>
              )}
            </div>
          </BentoCard>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <BentoCard title="Parámetros de Siembra" icon={ClipboardCheck}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Fecha de Siembra</span>
                  <input 
                    type="date" 
                    value={newSowing.date}
                    onChange={e => setNewSowing(prev => ({ ...prev, date: e.target.value }))}
                    className="h-[60px] px-6 bg-black/5 rounded-[20px] font-bold text-xl"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Cuadrilla / Responsable</span>
                  <select 
                    value={newSowing.responsibleId}
                    onChange={e => setNewSowing(prev => ({ ...prev, responsibleId: e.target.value }))}
                    className="h-[60px] px-6 bg-black/5 rounded-[20px] font-bold appearance-none"
                  >
                    {contacts.filter(c => c.role === 'Operador' || c.role === 'Administrador').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <div className="p-6 bg-black/5 rounded-[28px]">
                  <Stepper 
                    label="Densidad (Plantas/Ha)"
                    value={newSowing.density || 0}
                    onChange={v => setNewSowing(prev => ({ ...prev, density: v }))}
                    min={1000}
                    max={150000}
                    step={1000}
                  />
                </div>

                <button 
                  onClick={() => {
                    if (!selectedLotId) return alert('Seleccione un lote');
                    onAddSowingRecord({ ...newSowing, lotId: selectedLotId });
                    setSelectedLotId('');
                  }}
                  disabled={!selectedLotId}
                  className={`h-[60px] font-black rounded-[20px] shadow-xl transition-all mt-auto ${
                    selectedLotId 
                      ? 'bg-[#0052CC] text-white hover:scale-[1.02]' 
                      : 'bg-black/10 text-black/30 cursor-not-allowed'
                  }`}
                >
                  REGISTRAR SIEMBRA
                </button>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </div>
  );
};

const LotManagementView = ({ 
  lots, 
  crops, 
  farms,
  onAddLot,
  onDeleteLot,
  onAddAnalysis,
  hideAddButton
}: { 
  lots: Lot[], 
  crops: Crop[], 
  farms: Farm[],
  onAddLot: (lot: Partial<Lot>) => void,
  onDeleteLot: (id: string) => void,
  onAddAnalysis: (lotId: string, analysis: LotAnalysis) => void,
  hideAddButton?: boolean,
  key?: React.Key
}) => {
  const [analyzingLotId, setAnalyzingLotId] = useState<string | null>(null);
  const [viewingHistoryLotId, setViewingHistoryLotId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newLot, setNewLot] = useState<Partial<Lot>>({
    lotCode: '',
    area: 10,
    soilType: 'Arcilloso',
    cropId: crops[0].id,
    farmId: '', // Start empty to force selection
    status: 'VACÍO'
  });

  const analyzingLot = lots.find(l => l.id === analyzingLotId);
  const analyzingCrop = crops.find(c => c.id === analyzingLot?.cropId);
  const [analysisValues, setAnalysisValues] = useState<{ [key: string]: any }>({});

  const historyLot = lots.find(l => l.id === viewingHistoryLotId);

  const selectedFarm = farms.find(f => f.id === newLot.farmId);
  const occupiedArea = lots.filter(l => l.farmId === newLot.farmId).reduce((acc, l) => acc + l.area, 0);
  const availableArea = selectedFarm ? selectedFarm.totalHectares - occupiedArea : 0;
  const isAreaValid = (newLot.area || 0) <= availableArea;

  const handleStartAnalysis = (lot: Lot) => {
    setAnalyzingLotId(lot.id);
    const initialValues: any = {};
    const crop = crops.find(c => c.id === lot.cropId);
    crop?.parameters.forEach(p => {
      if (p.type === 'NUMERIC') initialValues[p.id] = (p.min! + p.max!) / 2;
      if (p.type === 'BOOLEAN') initialValues[p.id] = true;
      if (p.type === 'SELECTION') initialValues[p.id] = p.options?.[0] || '';
    });
    setAnalysisValues(initialValues);
  };

  const submitAnalysis = () => {
    if (!analyzingLotId) return;
    
    // Simple status logic: if any numeric value is out of range, it's RECHAZADO
    let status: 'APROBADO' | 'RECHAZADO' = 'APROBADO';
    analyzingCrop?.parameters.forEach(p => {
      if (p.type === 'NUMERIC') {
        const val = analysisValues[p.id];
        if (val < p.min! || val > p.max!) status = 'RECHAZADO';
      }
    });

    const analysis = {
      id: `an-${Date.now()}`,
      lotId: analyzingLotId,
      date: new Date().toISOString(),
      values: analysisValues,
      status
    };

    onAddAnalysis(analyzingLotId, analysis);
    setAnalyzingLotId(null);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNewLot(prev => ({
            ...prev,
            location: { lat: position.coords.latitude, lng: position.coords.longitude }
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("No se pudo obtener la ubicación automáticamente.");
        }
      );
    }
  };

  const handleCreateLot = () => {
    if (!newLot.farmId) {
      alert("Debe seleccionar una finca para el nuevo lote.");
      return;
    }
    onAddLot(newLot);
    setIsAdding(false);
    setNewLot({
      lotCode: '',
      area: 10,
      soilType: 'Arcilloso',
      cropId: crops[0].id,
      farmId: '',
      status: 'VACÍO'
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Inventario de Lotes</h2>
        {!hideAddButton && (
          <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-8 py-4 bg-[#0052CC] text-white rounded-2xl font-bold shadow-xl shadow-blue-200">
            <Plus size={20} /> Nuevo Lote
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lots.map(lot => {
          const crop = crops.find(c => c.id === lot.cropId);
          const farm = farms.find(f => f.id === lot.farmId);
          return (
            <BentoCard key={lot.id} title={lot.lotCode} icon={Map} className="relative overflow-hidden">
              <div className="absolute top-8 right-8"><StatusBadge status={lot.status} /></div>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 text-black/40 text-xs font-bold uppercase tracking-widest">
                  <Home size={14} /> {farm?.name}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/5 p-4 rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-black/40 block mb-1">Área</span>
                    <span className="text-xl font-black">{lot.area} Ha</span>
                  </div>
                  <div className="bg-black/5 p-4 rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-black/40 block mb-1">Suelo</span>
                    <span className="text-xl font-black">{lot.soilType}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{crop?.icon}</span>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-400 block">Cultivo</span>
                      <span className="font-black text-blue-900">{crop?.name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-blue-400 block">Análisis</span>
                    <span className="text-xs font-bold text-blue-900">{crop?.parameters.length} Parámetros</span>
                  </div>
                </div>
                  <button 
                    onClick={() => handleStartAnalysis(lot)}
                    className="flex-1 h-12 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                  >
                    <Beaker size={16} /> Analizar
                  </button>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-black/5">
                  <button 
                    onClick={() => onDeleteLot(lot.id)}
                    className="p-2 text-black/10 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button 
                    onClick={() => setViewingHistoryLotId(lot.id)}
                    className="text-[#0052CC] font-bold text-xs flex items-center gap-1"
                  >
                    Historial <ChevronRight size={14} />
                  </button>
                </div>
            </BentoCard>
          );
        })}
      </div>

      {/* Analysis Entry Modal */}
      <AnimatePresence>
        {analyzingLotId && analyzingLot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAnalyzingLotId(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-10 border-b border-black/5 flex justify-between items-center bg-white sticky top-0 z-10">
                <div>
                  <h3 className="text-3xl font-bold tracking-tight">Nuevo Análisis</h3>
                  <p className="text-black/40 font-bold uppercase text-xs tracking-widest mt-1">Lote: {analyzingLot.lotCode} • {analyzingCrop?.name}</p>
                </div>
                <button onClick={() => setAnalyzingLotId(null)} className="p-4 bg-black/5 rounded-2xl"><Plus className="rotate-45" /></button>
              </div>
              
              <div className="p-10 flex flex-col gap-10 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {analyzingCrop?.parameters.map(param => (
                    <div key={param.id} className="flex flex-col gap-4 p-6 bg-black/5 rounded-3xl border border-black/5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-black/40 uppercase tracking-widest">{param.name}</span>
                        <span className="text-[10px] font-black px-2 py-1 bg-white rounded-lg border border-black/5">{param.category.replace('_', ' ')}</span>
                      </div>

                      {param.type === 'NUMERIC' && (
                        <Stepper 
                          label={`Valor (${param.unit})`}
                          value={analysisValues[param.id]}
                          onChange={v => setAnalysisValues(prev => ({ ...prev, [param.id]: v }))}
                          min={0}
                          max={1000}
                          step={0.1}
                        />
                      )}

                      {param.type === 'BOOLEAN' && (
                        <div className="flex bg-white p-1 rounded-2xl h-16 border border-black/5">
                          {[true, false].map(v => (
                            <button
                              key={v.toString()}
                              onClick={() => setAnalysisValues(prev => ({ ...prev, [param.id]: v }))}
                              className={`flex-1 rounded-xl font-bold transition-all ${analysisValues[param.id] === v ? 'bg-black text-white shadow-lg' : 'text-black/40'}`}
                            >
                              {v ? 'SI' : 'NO'}
                            </button>
                          ))}
                        </div>
                      )}

                      {param.type === 'SELECTION' && (
                        <div className="flex flex-wrap gap-2">
                          {param.options?.map(opt => (
                            <button
                              key={opt}
                              onClick={() => setAnalysisValues(prev => ({ ...prev, [param.id]: opt }))}
                              className={`px-4 py-2 rounded-xl font-bold text-sm border transition-all ${analysisValues[param.id] === opt ? 'bg-[#0052CC] text-white border-[#0052CC] shadow-md' : 'bg-white text-black/40 border-black/10'}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-10 border-t border-black/5 bg-white sticky bottom-0">
                <button 
                  onClick={submitAnalysis}
                  className="w-full h-20 bg-[#0052CC] text-white font-bold rounded-3xl shadow-xl shadow-blue-200 text-xl active:scale-95 transition-transform"
                >
                  Registrar Análisis de Campo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {viewingHistoryLotId && historyLot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingHistoryLotId(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-10 border-b border-black/5 flex justify-between items-center bg-white">
                <div>
                  <h3 className="text-3xl font-bold tracking-tight">Historial de Análisis</h3>
                  <p className="text-black/40 font-bold uppercase text-xs tracking-widest mt-1">Lote: {historyLot.lotCode}</p>
                </div>
                <button onClick={() => setViewingHistoryLotId(null)} className="p-4 bg-black/5 rounded-2xl"><Plus className="rotate-45" /></button>
              </div>
              
              <div className="p-10 overflow-y-auto">
                {(!historyLot.analyses || historyLot.analyses.length === 0) ? (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6 text-black/20">
                      <ListFilter size={40} />
                    </div>
                    <p className="text-black/40 font-bold">No hay análisis registrados para este lote.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {historyLot.analyses.map(analysis => (
                      <div key={analysis.id} className="p-8 bg-black/5 rounded-[2rem] border border-black/5 flex flex-col gap-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm">
                              <Clock size={20} className="text-black/40" />
                            </div>
                            <div>
                              <span className="text-lg font-black">{new Date(analysis.date).toLocaleDateString()}</span>
                              <span className="text-[10px] block font-bold text-black/30 uppercase tracking-widest">{new Date(analysis.date).toLocaleTimeString()}</span>
                            </div>
                          </div>
                          <span className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest border ${
                            analysis.status === 'APROBADO' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200'
                          }`}>
                            {analysis.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(analysis.values).map(([paramId, value]) => {
                            const param = crops.flatMap(c => c.parameters).find(p => p.id === paramId);
                            return (
                              <div key={paramId} className="bg-white p-4 rounded-2xl shadow-sm border border-black/5">
                                <span className="text-[10px] uppercase font-bold text-black/30 block mb-1 truncate">{param?.name}</span>
                                <span className="text-lg font-black">{value.toString()} <span className="text-[10px] font-normal text-black/30">{param?.unit}</span></span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )).reverse()}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden">
              <div className="p-10 border-b border-black/5 flex justify-between items-center">
                <h3 className="text-3xl font-bold tracking-tight">Configurar Lote</h3>
                <button onClick={() => setIsAdding(false)} className="p-4 bg-black/5 rounded-2xl"><Plus className="rotate-45" /></button>
              </div>
              <div className="p-10 flex flex-col gap-10 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-2 gap-10">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Finca Destino</span>
                    <div className="grid grid-cols-1 gap-2">
                      {farms.map(f => (
                        <button
                          key={f.id}
                          onClick={() => setNewLot(prev => ({ ...prev, farmId: f.id }))}
                          className={`h-16 px-6 rounded-2xl font-bold border transition-all text-left flex items-center justify-between ${newLot.farmId === f.id ? 'bg-blue-50 border-[#0052CC] text-[#0052CC]' : 'bg-white border-black/10 text-black/40'}`}
                        >
                          {f.name}
                          {newLot.farmId === f.id && <CheckCircle2 size={20} />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Código Lote</span>
                      <input type="text" value={newLot.lotCode} onChange={e => setNewLot(prev => ({ ...prev, lotCode: e.target.value }))} className="h-16 px-6 bg-black/5 rounded-2xl font-bold" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Área (Ha)</span>
                        {selectedFarm && (
                          <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${isAreaValid ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            Disponible: {availableArea.toFixed(2)} Ha
                          </span>
                        )}
                      </div>
                      <Stepper label="" value={newLot.area || 0} onChange={v => setNewLot(prev => ({ ...prev, area: v }))} step={0.5} />
                    </div>
                  </div>
                </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Coordenadas</span>
                      <button 
                        onClick={handleGetLocation}
                        className={`h-16 px-6 rounded-2xl font-bold border flex items-center justify-center gap-3 transition-all ${newLot.location ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-black/5 border-transparent text-black/40'}`}
                      >
                        <MapPin size={20} />
                        {newLot.location ? `${newLot.location.lat.toFixed(4)}, ${newLot.location.lng.toFixed(4)}` : 'Obtener GPS'}
                      </button>
                    </div>
                    <button onClick={handleCreateLot} className="h-20 bg-[#0052CC] text-white font-bold rounded-3xl shadow-xl shadow-blue-200">Crear Lote</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Main Application ---

export default function App() {
  const [universe, setUniverse] = useState<'home' | 'campo' | 'planta'>('home');
  const [tab, setTab] = useState<'inventario' | 'operaciones' | 'calidad' | 'maestros'>('inventario');
  
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('dusa_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });
  const [farms, setFarms] = useState<Farm[]>(() => {
    const saved = localStorage.getItem('dusa_farms');
    return saved ? JSON.parse(saved) : INITIAL_FARMS;
  });
  const [crops, setCrops] = useState<Crop[]>(() => {
    const saved = localStorage.getItem('dusa_crops');
    return saved ? JSON.parse(saved) : INITIAL_CROPS;
  });
  const [lots, setLots] = useState<Lot[]>(() => {
    const saved = localStorage.getItem('dusa_lots');
    return saved ? JSON.parse(saved) : INITIAL_LOTS;
  });
  const [receptions, setReceptions] = useState<MaterialReception[]>(() => {
    const saved = localStorage.getItem('dusa_receptions');
    return saved ? JSON.parse(saved) : [];
  });
  const [chemicals, setChemicals] = useState<Chemical[]>(() => {
    const saved = localStorage.getItem('dusa_chemicals');
    return saved ? JSON.parse(saved) : INITIAL_CHEMICALS;
  });
  const [barrels, setBarrels] = useState<Barrel[]>([]);
  const [dispatches, setDispatches] = useState<DispatchRecord[]>([]);
  const [silos, setSilos] = useState<Silo[]>([]);
  const [theme, setTheme] = useState<'solar' | 'plant'>('solar');

  const handleUpdateDispatch = (id: string, updates: Partial<DispatchRecord>) => {
    setDispatches(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const handleAddBarrel = (barrel: Barrel) => {
    setBarrels(prev => [...prev, barrel]);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const [selectedCropId, setSelectedCropId] = useState<string>(INITIAL_CROPS[0].id);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    localStorage.setItem('dusa_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('dusa_farms', JSON.stringify(farms));
  }, [farms]);

  useEffect(() => {
    localStorage.setItem('dusa_crops', JSON.stringify(crops));
  }, [crops]);

  useEffect(() => {
    localStorage.setItem('dusa_lots', JSON.stringify(lots));
  }, [lots]);

  useEffect(() => {
    localStorage.setItem('dusa_receptions', JSON.stringify(receptions));
  }, [receptions]);

  useEffect(() => {
    localStorage.setItem('dusa_chemicals', JSON.stringify(chemicals));
  }, [chemicals]);

  const handleAddContact = (contactData: Partial<Contact>) => {
    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      name: contactData.name || 'Nuevo Contacto',
      role: contactData.role || 'Operador',
      phone: contactData.phone || '',
      externalId: contactData.externalId || ''
    };
    setContacts(prev => [...prev, newContact]);
  };

  const handleDeleteContact = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este contacto?')) {
      setContacts(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleAddChemical = (chemicalData: Partial<Chemical>) => {
    const newChemical: Chemical = {
      id: `chem-${Date.now()}`,
      name: chemicalData.name || 'Nuevo Insumo',
      type: chemicalData.type || 'Fungicida',
      unit: chemicalData.unit || 'ml/Kg'
    };
    setChemicals(prev => [...prev, newChemical]);
  };

  const handleDeleteChemical = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este insumo?')) {
      setChemicals(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleAddFarm = (farmData: Partial<Farm>) => {
    const newFarm: Farm = {
      id: `farm-${Date.now()}`,
      name: farmData.name || 'Nueva Finca',
      location: farmData.location || 'Ubicación no definida',
      adminId: farmData.adminId || '',
      totalHectares: farmData.totalHectares || 0,
      unitSystem: farmData.unitSystem || 'METRICO'
    };
    setFarms(prev => [...prev, newFarm]);
  };

  const handleDeleteFarm = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta finca? Se eliminarán también sus lotes asociados.')) {
      setFarms(prev => prev.filter(f => f.id !== id));
      setLots(prev => prev.filter(l => l.farmId !== id));
    }
  };

  const handleUpdateCrop = (updatedCrop: Crop) => {
    setCrops(prev => prev.map(c => c.id === updatedCrop.id ? updatedCrop : c));
  };

  const handleAddLot = (lotData: Partial<Lot>) => {
    const newLot: Lot = {
      id: `lot-${Date.now()}`,
      lotCode: lotData.lotCode || 'L-NEW',
      area: lotData.area || 0,
      soilType: lotData.soilType || 'Franco',
      cropId: lotData.cropId || crops[0].id,
      farmId: lotData.farmId || farms[0]?.id || '',
      status: lotData.status || 'VACÍO',
      analyses: []
    };
    setLots(prev => [...prev, newLot]);
  };

  const handleDeleteLot = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este lote?')) {
      setLots(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleAddAnalysis = (lotId: string, analysis: LotAnalysis) => {
    setLots(prev => prev.map(l => {
      if (l.id === lotId) {
        return {
          ...l,
          analyses: [...(l.analyses || []), analysis],
          status: analysis.status as LotStatus
        };
      }
      return l;
    }));
  };

  const handleAddReception = (reception: MaterialReception) => {
    setReceptions(prev => [reception, ...prev]);
    setLots(prev => prev.map(l => {
      if (l.id === reception.lotId) {
        return {
          ...l,
          receptions: [...(l.receptions || []), reception]
        };
      }
      return l;
    }));
  };

  const handleAddSowingRecord = (record: Partial<SowingRecord>) => {
    setLots(prev => prev.map(l => {
      if (l.id === record.lotId) {
        return {
          ...l,
          status: 'SEMBRADO',
          sowingRecords: [...(l.sowingRecords || []), { ...record, id: `sow-${Date.now()}` } as SowingRecord]
        };
      }
      return l;
    }));
  };

  const handleAddCureRecord = (record: Partial<CureRecord>) => {
    setLots(prev => prev.map(l => {
      if (l.id === record.lotId) {
        return {
          ...l,
          status: 'EN_CURA',
          cureRecords: [...(l.cureRecords || []), { ...record, id: `cure-${Date.now()}` } as CureRecord]
        };
      }
      return l;
    }));
  };

  const handleAddDispatch = (dispatch: DispatchRecord) => {
    setDispatches(prev => [...prev, dispatch]);
    
    const lot = lots.find(l => l.id === dispatch.lotId);
    if (lot) {
      setLots(prev => prev.map(l => l.id === dispatch.lotId ? { ...l, status: 'DESPACHADO' } : l));
      
      if (dispatch.type === 'INTERNO') {
        // Create a barrel for quality control
        const newBarrel: Barrel = {
          id: `bar-${Date.now()}`,
          code: `B-${lot.lotCode}-${Date.now().toString().slice(-4)}`,
          lotId: lot.id,
          cropId: lot.cropId,
          status: 'EN ESPERA',
          date: new Date().toISOString(),
          analysisValues: {}
        };
        setBarrels(prev => [...prev, newBarrel]);
      }
    }
  };



  const handleUpdateBarrel = (updatedBarrel: Barrel) => {
    setBarrels(prev => prev.map(b => b.id === updatedBarrel.id ? updatedBarrel : b));
  };

  const handleUpdateSilo = (updatedSilo: Silo) => {
    setSilos(prev => prev.map(s => s.id === updatedSilo.id ? updatedSilo : s));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      console.log('Global State Saved:', { farms, crops, lots });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      {/* Navigation Header */}
      <div className="bg-white border-b border-black/5 px-10 py-6 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-12">
          <button 
            onClick={() => setUniverse('home')}
            className="flex items-center gap-2 text-[#0052CC] font-black tracking-tighter text-2xl hover:scale-105 transition-transform"
          >
            <Leaf fill="currentColor" />
            <span>TERRASYNC</span>
          </button>
          
          {universe !== 'home' && (
            <nav className="flex bg-black/5 p-1.5 rounded-2xl">
              {universe === 'campo' && (
                <>
                  <button onClick={() => setTab('inventario')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'inventario' ? 'bg-white shadow-md text-[#0052CC]' : 'text-black/30'}`}>Inventario</button>
                  <button onClick={() => setTab('operaciones')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'operaciones' ? 'bg-white shadow-md text-[#0052CC]' : 'text-black/30'}`}>Operaciones</button>
                  <button onClick={() => setTab('calidad')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'calidad' ? 'bg-white shadow-md text-[#0052CC]' : 'text-black/30'}`}>Calidad</button>
                  <button onClick={() => setTab('maestros')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'maestros' ? 'bg-white shadow-md text-[#0052CC]' : 'text-black/30'}`}>Maestros</button>
                </>
              )}
              {universe === 'planta' && (
                <>
                  <button onClick={() => setTab('inventario')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'inventario' ? 'bg-white shadow-md text-[#0052CC]' : 'text-black/30'}`}>Inventario</button>
                  <button onClick={() => setTab('operaciones')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'operaciones' ? 'bg-white shadow-md text-[#0052CC]' : 'text-black/30'}`}>Operaciones</button>
                  <button onClick={() => setTab('calidad')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'calidad' ? 'bg-white shadow-md text-[#0052CC]' : 'text-black/30'}`}>Calidad</button>
                  <button onClick={() => setTab('maestros')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'maestros' ? 'bg-white shadow-md text-[#0052CC]' : 'text-black/30'}`}>Maestros</button>
                </>
              )}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setTheme(theme === 'solar' ? 'plant' : 'solar')}
            className="p-3 bg-black/5 rounded-xl text-black/40 hover:text-black transition-colors"
          >
            {theme === 'solar' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              isSaving ? 'bg-black/10 text-black/30' : 'bg-black text-white hover:scale-105 shadow-lg'
            }`}
          >
            {isSaving ? '...' : <><Save size={18} /> Guardar</>}
          </button>
        </div>
      </div>

      <div className="p-6 md:p-10 flex-1 bg-[#F8F9FA]">
        <main className="max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {universe === 'home' && (
              <HomeDashboardView 
                key="home" 
                onNavigate={(mod) => {
                  setUniverse(mod as any);
                  if (mod === 'maestros') setTab('inventario');
                  if (mod === 'campo') setTab('inventario');
                  if (mod === 'planta') setTab('inventario');
                  if (mod === 'calidad') setTab('calidad');
                }} 
              />
            )}
            {universe === 'campo' && tab === 'maestros' && (
              <CropMasterView 
                key="crops"
                crops={crops} 
                selectedCropId={selectedCropId} 
                setSelectedCropId={setSelectedCropId} 
                onUpdateCrop={handleUpdateCrop} 
              />
            )}
            {universe === 'campo' && tab === 'maestros' && (
              <ContactManagementView 
                key="contacts"
                contacts={contacts}
                onAddContact={handleAddContact}
                onDeleteContact={handleDeleteContact}
              />
            )}
            {universe === 'campo' && tab === 'maestros' && (
              <ChemicalManagementView 
                key="chemicals"
                chemicals={chemicals}
                onAddChemical={handleAddChemical}
                onDeleteChemical={handleDeleteChemical}
              />
            )}
            {universe === 'campo' && tab === 'maestros' && (
              <FarmManagementView 
                key="fincas" 
                farms={farms} 
                contacts={contacts}
                onAddFarm={handleAddFarm} 
                onDeleteFarm={handleDeleteFarm} 
              />
            )}
            {universe === 'campo' && tab === 'operaciones' && (
              <LotManagementView 
                key="lots"
                lots={lots} 
                crops={crops} 
                farms={farms}
                onAddLot={handleAddLot}
                onDeleteLot={handleDeleteLot}
                onAddAnalysis={handleAddAnalysis}
              />
            )}
            {universe === 'campo' && tab === 'calidad' && (
              <CureManagementView 
                key="cura"
                receptions={receptions}
                lots={lots}
                chemicals={chemicals}
                contacts={contacts}
                onAddCureRecord={handleAddCureRecord}
              />
            )}
            {universe === 'campo' && tab === 'operaciones' && (
              <SowingManagementView 
                key="siembra"
                lots={lots}
                contacts={contacts}
                onAddSowingRecord={handleAddSowingRecord}
              />
            )}
            {universe === 'campo' && tab === 'inventario' && (
              <MaterialReceptionView 
                key="recepcion"
                receptions={receptions}
                crops={crops}
                lots={lots}
                farms={farms}
                onAddReception={handleAddReception}
              />
            )}
            {universe === 'planta' && tab === 'inventario' && (
              <TruckReceptionView 
                silos={silos}
                dispatches={dispatches}
                onUpdateSilo={handleUpdateSilo}
                onUpdateDispatch={handleUpdateDispatch}
              />
            )}
            {universe === 'planta' && tab === 'operaciones' && (
              <ProductionProcessView 
                silos={silos}
                onUpdateSilo={handleUpdateSilo}
                onAddBarrel={handleAddBarrel}
              />
            )}
            {universe === 'planta' && tab === 'calidad' && (
              <QualityManagementView 
                key="cuarentena"
                barrels={barrels}
                crops={crops}
                lots={lots}
                onUpdateBarrel={handleUpdateBarrel}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
