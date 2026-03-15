/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, Minus, Beaker, ShieldCheck, Clock, ChevronRight, Save, Leaf, 
  Map, LayoutGrid, MapPin, Layers, Info, Home, User, Settings, 
  Activity, Trash2, CheckCircle2, XCircle, ListFilter, Briefcase, Factory, Users, Search, Phone, CreditCard,
  Droplets, Sprout, Truck, Box, Sun, Moon, FlaskConical, ClipboardCheck,
  Flame, ShieldAlert, Shield, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Crop, INITIAL_CROPS, DynamicParameter, Lot, INITIAL_LOTS, 
  SoilType, LotStatus, Farm, INITIAL_FARMS, UnitSystem, 
  UNITS_MASTER, ParameterType, ParameterCategory, LotAnalysis,
  QualityCategory, MaterialReception, Contact, INITIAL_CONTACTS,
  Chemical, INITIAL_CHEMICALS, CureRecord, SowingRecord, Barrel, DispatchRecord, BarrelStatus, SowingProject, ActivityLog,
  Silo, INITIAL_SILOS
} from './types';

// --- Reusable Components ---

const HomeDashboardView = ({ onNavigate, sowingProjects, barrels, dispatches, silos }: { 
  onNavigate: (tab: string) => void,
  sowingProjects?: SowingProject[],
  barrels?: Barrel[],
  dispatches?: DispatchRecord[],
  silos?: Silo[],
  key?: React.Key 
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col gap-8"
  >
    {/* Header */}
    <div className="text-center pt-2">
      <h1 className="text-5xl font-black tracking-tighter">TERRASYNC <span className="text-[#0052CC]">OS</span></h1>
      <p className="text-black/40 font-mono text-sm tracking-widest mt-2">SISTEMA OPERATIVO AGROINDUSTRIAL — DUSA</p>
    </div>

    {/* Two Giant Module Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* CAMPO — Emerald Green */}
      <button
        onClick={() => onNavigate('campo')}
        className="group bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[28px] p-12 flex flex-col justify-between text-white text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-emerald-200 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-10 opacity-[0.12] group-hover:scale-110 transition-transform duration-500">
          <Map size={220} />
        </div>
        <div className="z-10">
          <div className="p-4 bg-white/20 rounded-2xl w-fit mb-6">
            <Map size={32} />
          </div>
          <h2 className="text-5xl font-black tracking-tighter mb-3">OPERACIONES<br/>DE CAMPO</h2>
          <p className="text-white/70 font-medium text-base">Siembra, Cura, Lotes, Inventario de insumos y Despachos</p>
        </div>
        <div className="z-10 flex items-center gap-2 font-bold text-sm uppercase tracking-widest mt-8">
          ACCEDER MÓDULO <ChevronRight size={18} />
        </div>
      </button>

      {/* PLANTA — Vibrant Blue */}
      <button
        onClick={() => onNavigate('planta')}
        className="group bg-gradient-to-br from-[#0052CC] to-[#003399] rounded-[28px] p-12 flex flex-col justify-between text-white text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-blue-300 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-10 opacity-[0.12] group-hover:scale-110 transition-transform duration-500">
          <Factory size={220} />
        </div>
        <div className="z-10">
          <div className="p-4 bg-white/20 rounded-2xl w-fit mb-6">
            <Factory size={32} />
          </div>
          <h2 className="text-5xl font-black tracking-tighter mb-3">PROCESAMIENTO<br/>EN PLANTA</h2>
          <p className="text-white/70 font-medium text-base">Romanero, Silos, Evaporador y Cuarentena Biológica</p>
        </div>
        <div className="z-10 flex items-center gap-2 font-bold text-sm uppercase tracking-widest mt-8">
          ACCEDER MÓDULO <ChevronRight size={18} />
        </div>
      </button>
    </div>

    {/* Live Stats Row */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: 'Proyectos Activos', value: sowingProjects?.filter(p => p.status === 'ACTIVO').length ?? 0, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Sprout },
        { label: 'Silos con Carga', value: silos?.filter(s => s.currentLevel > 0).length ?? 0, color: 'text-blue-600', bg: 'bg-blue-50', icon: Layers },
        { label: 'En Cuarentena', value: barrels?.filter(b => b.status === 'EN ESPERA').length ?? 0, color: 'text-amber-600', bg: 'bg-amber-50', icon: Box },
        { label: 'Despachos Pendientes', value: dispatches?.filter(d => d.status === 'EN TRÁNSITO').length ?? 0, color: 'text-slate-600', bg: 'bg-slate-100', icon: Truck },
      ].map(s => (
        <div key={s.label} className={`${s.bg} rounded-[20px] p-6 flex items-center gap-4`}>
          <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center ${s.color} shadow-sm`}>
            <s.icon size={22} />
          </div>
          <div>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] font-bold text-black/40 uppercase tracking-wider leading-tight">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const SearchBar = ({ value, onChange, placeholder = "Buscar..." }: { value: string, onChange: (v: string) => void, placeholder?: string }) => (
  <div className="relative w-full max-w-md group">
    <div className="absolute inset-y-0 left-6 flex items-center text-black/20 group-focus-within:text-[#0052CC] transition-colors">
      <Search size={20} />
    </div>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-14 pl-16 pr-6 bg-black/5 rounded-2xl font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-[#0052CC]/20 border border-transparent transition-all"
    />
  </div>
);

const Paginator = ({ current, total, onPageChange }: { current: number, total: number, onPageChange: (p: number) => void }) => (
  <div className="flex items-center gap-3 bg-black/5 p-1.5 rounded-2xl w-fit">
    <button 
      onClick={() => onPageChange(Math.max(1, current - 1))}
      disabled={current === 1}
      className="p-3 bg-white rounded-xl text-black hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black transition-all shadow-sm"
    >
      <Plus className="rotate-45" size={18} />
    </button>
    <span className="px-4 text-xs font-black uppercase tracking-widest text-black/40">
      {current} de {total || 1}
    </span>
    <button 
      onClick={() => onPageChange(Math.min(total, current + 1))}
      disabled={current === total || total === 0}
      className="p-3 bg-white rounded-xl text-black hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black transition-all shadow-sm"
    >
      <Plus className="-rotate-45" size={18} />
    </button>
  </div>
);

const ViewToggle = ({ mode, onChange }: { mode: 'grid' | 'list', onChange: (m: 'grid' | 'list') => void }) => (
  <div className="flex bg-black/5 p-1.5 rounded-2xl">
    <button 
      onClick={() => onChange('grid')}
      className={`p-2.5 rounded-xl transition-all ${mode === 'grid' ? 'bg-white shadow-md text-[#0052CC]' : 'text-black/30'}`}
    >
      <LayoutGrid size={20} />
    </button>
    <button 
      onClick={() => onChange('list')}
      className={`p-2.5 rounded-xl transition-all ${mode === 'list' ? 'bg-white shadow-md text-[#0052CC]' : 'text-black/30'}`}
    >
      <ListFilter size={20} />
    </button>
  </div>
);
const ContactManagementView = ({ 
  contacts, 
  onAddContact, 
  onEditContact,
  onDeleteContact,
  viewMode,
  setViewMode,
  selectedId,
  setSelectedId
}: { 
  contacts: Contact[], 
  onAddContact: (c: Partial<Contact>) => void, 
  onEditContact: (c: Contact) => void,
  onDeleteContact: (id: string) => void,
  viewMode: 'list' | 'detail',
  setViewMode: (v: 'list' | 'detail') => void,
  selectedId: string | null,
  setSelectedId: (id: string | null) => void,
  key?: React.Key
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<Partial<Contact>>({ name: '', role: 'Administrador', phone: '', externalId: '' });

  const selectedContact = contacts.find(c => c.id === selectedId);

  const handleSelectContact = (id: string) => {
    setSelectedId(id);
    setViewMode('detail');
    setIsCreating(false);
    const c = contacts.find(x => x.id === id);
    if (c) setForm(c);
  };

  const handleNewContact = () => {
    setIsCreating(true);
    setSelectedId(null);
    setViewMode('detail');
    setForm({ name: '', role: 'Administrador', phone: '', externalId: '' });
  };

  const handleSave = () => {
    if (!form.name) return alert('El nombre es obligatorio.');
    if (isCreating) {
      onAddContact(form);
      setIsCreating(false);
    } else if (selectedContact) {
      onEditContact({ ...selectedContact, ...form } as Contact);
    }
  };

  const roleColor: Record<string, string> = {
    Administrador: 'bg-blue-100 text-blue-700',
    Operador: 'bg-emerald-100 text-emerald-700',
    Proveedor: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase">Maestro de Contactos</h2>
          <p className="text-black/40 font-mono text-sm">GESTIÓN DEL PERSONAL OPERATIVO Y PROVEEDORES</p>
        </div>
        <button onClick={handleNewContact} className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform">
          <Plus size={20} /> Nuevo Contacto
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* List */}
        <div className="lg:col-span-4 flex flex-col gap-3 overflow-y-auto no-scrollbar">
          {contacts.map(contact => (
            <button
              key={contact.id}
              onClick={() => handleSelectContact(contact.id)}
              className={`p-6 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${selectedId === contact.id && !isCreating ? 'bg-white border-[#0052CC] shadow-lg ring-4 ring-blue-50' : 'bg-white border-black/5 hover:border-black/20'}`}
            >
              <div className="p-3 bg-black/5 rounded-2xl text-black/40">
                <User size={22} />
              </div>
              <div>
                <h4 className="font-bold text-lg leading-tight">{contact.name}</h4>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${roleColor[contact.role] || 'bg-slate-100 text-slate-600'}`}>
                  {contact.role}
                </span>
              </div>
            </button>
          ))}
          {contacts.length === 0 && (
            <div className="p-8 text-center text-black/30 font-bold rounded-2xl border border-dashed border-black/10">
              <Users size={32} className="mx-auto mb-3 opacity-40" />
              No hay contactos registrados.
            </div>
          )}
        </div>

        {/* Detail / Form Panel */}
        <div className="lg:col-span-8 bg-white rounded-[3rem] border border-black/10 shadow-2xl overflow-hidden flex flex-col">
          {(selectedContact || isCreating) ? (
            <>
              <div className="p-10 border-b border-black/5 bg-slate-50/50 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black text-[#0052CC] uppercase tracking-[0.3em] mb-2 block">
                    {isCreating ? 'Nuevo Registro' : 'Detalles del Contacto'}
                  </span>
                  <h3 className="text-3xl font-black">{isCreating ? 'Registro de Contacto' : form.name}</h3>
                </div>
                {!isCreating && selectedContact && (
                  <button
                    onClick={() => onDeleteContact(selectedContact.id)}
                    className="p-4 text-black/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={22} />
                  </button>
                )}
              </div>

              <div className="p-10 flex-1 overflow-y-auto no-scrollbar flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Nombre Completo</span>
                  <input type="text" value={form.name || ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="h-16 px-6 bg-black/5 rounded-2xl font-bold text-lg focus:outline-none focus:ring-4 focus:ring-blue-100" />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Cargo / Rol</span>
                  <div className="flex gap-3">
                    {(['Administrador', 'Operador', 'Proveedor'] as Contact['role'][]).map(r => (
                      <button
                        key={r}
                        onClick={() => setForm(p => ({ ...p, role: r }))}
                        className={`flex-1 h-14 rounded-2xl font-bold border-2 transition-all text-sm ${form.role === r ? 'bg-black text-white border-black' : 'bg-white text-black/40 border-black/10'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Teléfono</span>
                    <div className="flex items-center gap-3 h-16 px-6 bg-black/5 rounded-2xl">
                      <Phone size={18} className="text-black/30" />
                      <input type="text" value={form.phone || ''} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="bg-transparent font-bold flex-1 focus:outline-none" placeholder="+58 000-000-0000" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">ID / Cédula</span>
                    <div className="flex items-center gap-3 h-16 px-6 bg-black/5 rounded-2xl">
                      <CreditCard size={18} className="text-black/30" />
                      <input type="text" value={form.externalId || ''} onChange={e => setForm(p => ({ ...p, externalId: e.target.value }))} className="bg-transparent font-bold flex-1 focus:outline-none" placeholder="V-00.000.000" />
                    </div>
                  </div>
                </div>

                <button onClick={handleSave} className="h-20 bg-black text-white font-black rounded-3xl shadow-2xl hover:scale-[1.01] transition-transform mt-auto">
                  {isCreating ? 'GUARDAR NUEVO CONTACTO' : 'GUARDAR CAMBIOS'}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
              <div className="w-24 h-24 bg-black/5 rounded-full flex items-center justify-center mb-6 text-black/20">
                <Users size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Seleccione un Contacto</h3>
              <p className="text-black/40 max-w-xs">Elija un contacto de la lista o cree uno nuevo para ver sus detalles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BentoCard = ({ children, title, icon: Icon, className = "", noPadding = false }: { children: React.ReactNode, title: string, icon: any, className?: string, noPadding?: boolean, key?: React.Key }) => (
  <div className={`bg-white border border-black/10 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow flex flex-col ${noPadding ? '' : 'p-8'} gap-6 ${className}`}>
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

const Carousel = ({ children }: { children: React.ReactNode[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(children.length / itemsPerPage);

  const next = () => setCurrentIndex((prev) => Math.min(prev + 1, totalPages - 1));
  const prev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  return (
    <div className="relative w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {children.slice(currentIndex * itemsPerPage, (currentIndex + 1) * itemsPerPage)}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-between mt-8">
          <button onClick={prev} disabled={currentIndex === 0} className="p-4 bg-black/5 rounded-2xl disabled:opacity-50 font-bold">Anterior</button>
          <span className="flex items-center font-bold text-black/40">Página {currentIndex + 1} de {totalPages}</span>
          <button onClick={next} disabled={currentIndex === totalPages - 1} className="p-4 bg-black/5 rounded-2xl disabled:opacity-50 font-bold">Siguiente</button>
        </div>
      )}
    </div>
  );
};

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

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'PREPARACIÓN': 'bg-amber-100 text-amber-700 border-amber-200',
    'SEMBRADO': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'VACÍO': 'bg-slate-100 text-slate-700 border-slate-200',
    'APROBADO': 'bg-emerald-500 text-white border-emerald-600',
    'RECHAZADO': 'bg-rose-500 text-white border-rose-600',
    'PENDIENTE': 'bg-amber-500 text-white border-amber-600',
    'EN TRÁNSITO': 'bg-blue-100 text-blue-700 border-blue-200',
    'RECIBIDO': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'EN ESPERA': 'bg-amber-100 text-amber-700 border-amber-200',
    'EN ANÁLISIS': 'bg-blue-100 text-blue-700 border-blue-200',
    'LIBERADO': 'bg-emerald-500 text-white border-emerald-600',
    'ACTIVO': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'COSECHA': 'bg-amber-100 text-amber-700 border-amber-200',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border ${styles[status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      {status}
    </span>
  );
};

// --- Views ---

const FarmManagementView = ({ 
  farms, 
  contacts,
  onAddFarm, 
  onDeleteFarm,
  viewMode,
  setViewMode,
  selectedId,
  setSelectedId
}: { 
  farms: Farm[], 
  contacts: Contact[],
  onAddFarm: (farm: Partial<Farm>) => void, 
  onDeleteFarm: (id: string) => void,
  viewMode: 'list' | 'detail',
  setViewMode: (v: 'list' | 'detail') => void,
  selectedId: string | null,
  setSelectedId: (id: string | null) => void,
  key?: React.Key
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFarm, setNewFarm] = useState<Partial<Farm>>({
    name: '', location: '', adminId: '', totalHectares: 0, unitSystem: 'METRICO'
  });

  const selectedFarm = farms.find(f => f.id === selectedId);
  const selectedFarmAdmin = contacts.find(c => c.id === selectedFarm?.adminId);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNewFarm(prev => ({
            ...prev,
            location: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
          }));
        },
        () => alert("No se pudo obtener la ubicación automáticamente.")
      );
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase">Gestión de Fincas</h2>
          <p className="text-black/40 font-mono text-sm">REGISTRO Y ADMINISTRACIÓN DE UNIDADES PRODUCTIVAS</p>
        </div>
        <button 
          onClick={() => { setIsCreating(true); setSelectedId(null); setViewMode('detail'); }}
          className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform"
        >
          <Plus size={20} /> Registrar Finca
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Farm List */}
        <div className="lg:col-span-4 flex flex-col gap-3 overflow-y-auto no-scrollbar">
          {farms.map(farm => {
            const admin = contacts.find(c => c.id === farm.adminId);
            return (
              <button key={farm.id}
                onClick={() => { setSelectedId(farm.id); setIsCreating(false); setViewMode('detail'); }}
                className={`p-6 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${selectedId === farm.id && !isCreating ? 'bg-white border-[#0052CC] shadow-lg ring-4 ring-blue-50' : 'bg-white border-black/5 hover:border-black/20'}`}
              >
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <Home size={22} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg leading-tight">{farm.name}</h4>
                  <p className="text-xs text-black/40 font-bold">{farm.totalHectares} Ha • {admin?.name || 'Sin Admin'}</p>
                </div>
              </button>
            );
          })}
          {farms.length === 0 && (
            <div className="p-8 text-center text-black/30 font-bold rounded-2xl border border-dashed border-black/10">
              <Home size={32} className="mx-auto mb-3 opacity-40" />
              No hay fincas registradas.
            </div>
          )}
        </div>

        {/* Detail / Create Panel */}
        <div className="lg:col-span-8 bg-white rounded-[3rem] border border-black/10 shadow-2xl overflow-hidden flex flex-col">
          {isCreating ? (
            <>
              <div className="p-10 border-b border-black/5 bg-slate-50/50">
                <span className="text-[10px] font-black text-[#0052CC] uppercase tracking-[0.3em] mb-2 block">Nuevo Registro</span>
                <h3 className="text-3xl font-black">Registrar Finca</h3>
              </div>
              <div className="p-10 flex-1 overflow-y-auto no-scrollbar flex flex-col gap-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Nombre de la Finca</span>
                    <input type="text" value={newFarm.name} onChange={e => setNewFarm(p => ({ ...p, name: e.target.value }))} className="h-16 px-6 bg-black/5 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-100" placeholder="Ej: Hacienda La Palma" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Hectáreas Totales</span>
                    <input type="number" value={newFarm.totalHectares} onChange={e => setNewFarm(p => ({ ...p, totalHectares: Number(e.target.value) }))} className="h-16 px-6 bg-black/5 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-100" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Ubicación</span>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Ej: Yaracuy, Venezuela" value={newFarm.location} onChange={e => setNewFarm(p => ({ ...p, location: e.target.value }))} className="flex-1 h-16 px-6 bg-black/5 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-100" />
                    <button onClick={handleGetLocation} className="px-6 bg-black text-white rounded-2xl flex items-center justify-center" title="GPS"><MapPin size={24} /></button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Administrador</span>
                    <select value={newFarm.adminId} onChange={e => setNewFarm(p => ({ ...p, adminId: e.target.value }))} className="h-16 px-6 bg-black/5 rounded-2xl font-bold appearance-none">
                      <option value="">Seleccionar...</option>
                      {contacts.filter(c => c.role === 'Administrador').map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Sistema de Unidades</span>
                    <div className="flex bg-black/5 p-1 rounded-2xl h-16">
                      {(['METRICO', 'IMPERIAL'] as UnitSystem[]).map(u => (
                        <button key={u} onClick={() => setNewFarm(p => ({ ...p, unitSystem: u }))} className={`flex-1 rounded-xl font-bold transition-all ${newFarm.unitSystem === u ? 'bg-white shadow-sm text-[#0052CC]' : 'text-black/40'}`}>{u}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-auto">
                  <button onClick={() => setIsCreating(false)} className="flex-1 h-20 bg-black/5 text-black font-black rounded-3xl">CANCELAR</button>
                  <button onClick={() => { onAddFarm(newFarm); setIsCreating(false); }} className="flex-1 h-20 bg-emerald-600 text-white font-black rounded-3xl shadow-xl shadow-emerald-200">CONFIRMAR REGISTRO</button>
                </div>
              </div>
            </>
          ) : selectedFarm ? (
            <>
              <div className="p-10 border-b border-black/5 bg-slate-50/50 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black text-[#0052CC] uppercase tracking-[0.3em] mb-2 block">Detalles de la Finca</span>
                  <h3 className="text-3xl font-black">{selectedFarm.name}</h3>
                </div>
                <button onClick={() => onDeleteFarm(selectedFarm.id)} className="p-4 text-black/20 hover:text-red-500 transition-colors">
                  <Trash2 size={22} />
                </button>
              </div>
              <div className="p-10 flex-1 grid grid-cols-2 gap-6 content-start">
                <div className="p-6 bg-black/5 rounded-2xl flex items-start gap-4">
                  <div className="p-3 bg-white rounded-2xl text-black/40"><MapPin size={20} /></div>
                  <div><span className="text-[10px] uppercase font-bold text-black/40 block">Ubicación</span><span className="font-bold">{selectedFarm.location || '—'}</span></div>
                </div>
                <div className="p-6 bg-black/5 rounded-2xl flex items-start gap-4">
                  <div className="p-3 bg-white rounded-2xl text-black/40"><Layers size={20} /></div>
                  <div><span className="text-[10px] uppercase font-bold text-black/40 block">Área Total</span><span className="font-bold">{selectedFarm.totalHectares} Ha</span></div>
                </div>
                <div className="p-6 bg-black/5 rounded-2xl flex items-start gap-4">
                  <div className="p-3 bg-white rounded-2xl text-black/40"><User size={20} /></div>
                  <div><span className="text-[10px] uppercase font-bold text-black/40 block">Administrador</span><span className="font-bold">{selectedFarmAdmin?.name || 'Sin asignar'}</span></div>
                </div>
                <div className="p-6 bg-black/5 rounded-2xl flex items-start gap-4">
                  <div className="p-3 bg-white rounded-2xl text-black/40"><Settings size={20} /></div>
                  <div><span className="text-[10px] uppercase font-bold text-black/40 block">Sistema</span><span className="font-bold">{selectedFarm.unitSystem}</span></div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
              <div className="w-24 h-24 bg-black/5 rounded-full flex items-center justify-center mb-6 text-black/20">
                <Home size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Seleccione una Finca</h3>
              <p className="text-black/40 max-w-xs">Elija una finca de la lista o registre una nueva.</p>
            </div>
          )}
        </div>
      </div>
    </div>
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
  onAddReception,
  viewMode,
  setViewMode,
  selectedId,
  setSelectedId
}: { 
  receptions: MaterialReception[], 
  crops: Crop[], 
  lots: Lot[], 
  farms: Farm[],
  onAddReception: (reception: MaterialReception) => void,
  viewMode: 'list' | 'detail',
  setViewMode: (v: 'list' | 'detail') => void,
  selectedId: string | null,
  setSelectedId: (id: string | null) => void,
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
      availableQuantity: newReception.bundleCount! * newReception.averageWeight!,
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


const EvaporatorManagementView = ({ 
  silos, 
  crops,
  onProcessEvaporation,
  viewMode,
  setViewMode,
  selectedId,
  setSelectedId
}: { 
  silos: Silo[], 
  crops: Crop[],
  onProcessEvaporation: (siloId: string, consumedLiters: number, barrelCount: number) => void,
  viewMode: 'list' | 'detail',
  setViewMode: (v: 'list' | 'detail') => void,
  selectedId: string | null,
  setSelectedId: (id: string | null) => void,
  key?: React.Key
}) => {
  const [page, setPage] = useState(1);
  const selectedSilo = silos.find(s => s.id === selectedId);
  const [consumedLiters, setConsumedLiters] = useState(1000);
  const [barrelCount, setBarrelCount] = useState(1);

  const filtered = silos.filter(s => s.currentLevel > 0);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paged = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setViewMode('detail');
    const silo = silos.find(s => s.id === id);
    if (silo) setConsumedLiters(Math.min(1000, silo.currentLevel));
  };

  if (viewMode === 'detail' && selectedSilo) {
    const selectedCrop = crops.find(c => c.id === selectedSilo.cropId);
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-10">
        <div className="bg-white p-10 rounded-[3rem] border border-black/5 shadow-xl flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black text-[#0052CC] uppercase tracking-[0.3em] mb-2 block">Célula de Evaporación</span>
            <h2 className="text-5xl font-black tracking-tighter uppercase">{selectedSilo.name}</h2>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-black text-black/30 uppercase tracking-widest block">Disponible</span>
             <span className="text-3xl font-black">{selectedSilo.currentLevel} {selectedSilo.unit}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <BentoCard title="Parámetros de Evaporación" icon={Box}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="flex flex-col gap-8">
                    <Stepper label={`Consumo (${selectedSilo.unit})`} value={consumedLiters} onChange={setConsumedLiters} min={100} max={selectedSilo.currentLevel} step={100} />
                    <Stepper label="Barriles a Generar" value={barrelCount} onChange={setBarrelCount} min={1} max={50} step={1} />
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100">
                       <h4 className="text-xs font-black text-blue-900 uppercase mb-4 tracking-widest">Resumen de Activos</h4>
                       <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-xs text-blue-800/60">Rubro:</span>
                          <span className="font-black text-xs text-blue-900">{selectedCrop?.name || 'Varios'}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="font-bold text-xs text-blue-800/60">Estado:</span>
                          <span className="font-black text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 uppercase">En Espera</span>
                       </div>
                    </div>
                    <button 
                      onClick={() => {
                        onProcessEvaporation(selectedSilo.id, consumedLiters, barrelCount);
                        alert("Proceso iniciado. Barriles enviados a cuarentena.");
                        setViewMode('list');
                      }}
                      className="h-20 bg-[#0052CC] text-white font-black rounded-3xl shadow-xl mt-auto uppercase tracking-widest"
                    >
                      Iniciar Evaporación
                    </button>
                  </div>
               </div>
            </BentoCard>
          </div>
          <div className="lg:col-span-4">
             <BentoCard title="Info Industrial" icon={Activity}>
                <div className="flex flex-col gap-4 text-xs font-bold opacity-60">
                   <p>Operación de alta presión. Verifique válvulas antes de confirmar.</p>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0052CC]" style={{ width: `${(selectedSilo.currentLevel / selectedSilo.capacity) * 100}%` }} />
                   </div>
                </div>
             </BentoCard>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-5xl font-black tracking-tighter uppercase">Evaporador</h2>
            <p className="text-black/40 font-mono text-sm tracking-[0.2em]">SISTEMA DE CONCENTRACIÓN Y LLENADO</p>
         </div>
         <Paginator current={page} total={totalPages} onPageChange={setPage} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {paged.map(s => (
           <button key={s.id} onClick={() => handleSelect(s.id)} className="group bg-[#0052CC] p-8 rounded-[3rem] h-[300px] flex flex-col justify-between text-white text-left transition-all hover:scale-[1.03] shadow-2xl shadow-blue-200 relative overflow-hidden">
             <div className="absolute -top-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700"><Factory size={180} /></div>
             <div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6"><Layers size={28} /></div>
                <h3 className="text-3xl font-black tracking-tighter uppercase leading-tight">{s.name}</h3>
                <p className="text-white/60 font-bold text-[10px] uppercase tracking-widest">{s.currentLevel} {s.unit} Disponibles</p>
             </div>
             <div className="z-10 border-t border-white/10 pt-6 flex justify-between items-center font-black text-[10px] uppercase tracking-widest">
                <span>Extraer y Llenar</span>
                <ChevronRight size={18} />
             </div>
           </button>
         ))}
         {paged.length === 0 && (
            <div className="col-span-full py-20 text-center opacity-20 font-bold uppercase tracking-[0.2em] border-2 border-dashed rounded-[3rem]">No hay materia prima disponible en silos</div>
         )}
      </div>
    </div>
  );
};



   const DispatchManagementView = ({ 
  dispatches,
  lots,
  farms,
  silos,
  onReceiveDispatch,
  viewMode,
  setViewMode,
  selectedId,
  setSelectedId
}: { 
  dispatches: DispatchRecord[],
  lots: Lot[],
  farms: Farm[],
  silos: Silo[],
  onReceiveDispatch: (dispatchId: string, siloId: string, brix: number) => void,
  viewMode: 'list' | 'detail',
  setViewMode: (v: 'list' | 'detail') => void,
  selectedId: string | null,
  setSelectedId: (id: string | null) => void,
  key?: React.Key
}) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const selectedDispatch = dispatches.find(d => d.id === selectedId);
  const [selectedSiloId, setSelectedSiloId] = useState(silos[0]?.id || '');
  const [brixValue, setBrixValue] = useState(12.5);

  const filtered = dispatches.filter(d => d.status === 'EN TRÁNSITO');
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paged = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setViewMode('detail');
  };

  if (viewMode === 'detail' && selectedDispatch) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-10">
        <div className="bg-white p-10 rounded-[3rem] border border-black/5 shadow-xl flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black text-[#0052CC] uppercase tracking-[0.3em] mb-2 block">Recepción en Planta (Romanero)</span>
            <h2 className="text-5xl font-black tracking-tighter uppercase">Despacho {selectedDispatch.id.slice(-4)}</h2>
          </div>
          <StatusBadge status={selectedDispatch.status as any} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <BentoCard title="Asignación de Silo" icon={Flame}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="flex flex-col gap-4">
                     <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Silo Destino</span>
                     <div className="grid grid-cols-1 gap-3">
                        {silos.map(s => (
                          <button key={s.id} onClick={() => setSelectedSiloId(s.id)} className={`h-16 px-6 rounded-2xl font-bold border-2 transition-all ${selectedSiloId === s.id ? 'bg-[#0052CC] text-white border-[#0052CC]' : 'bg-black/5 border-transparent'}`}>
                            {s.name} ({s.currentLevel}%)
                          </button>
                        ))}
                     </div>
                  </div>
                  <div className="flex flex-col gap-6">
                     <Stepper label="Grados Brix (°Bx)" value={brixValue} onChange={setBrixValue} min={8} max={25} step={0.1} />
                     <button 
                        onClick={() => {
                          onReceiveDispatch(selectedDispatch.id, selectedSiloId, brixValue);
                          alert("Materia prima recibida y almacenada.");
                          setViewMode('list');
                        }}
                        className="h-20 bg-[#0052CC] text-white font-black rounded-3xl shadow-xl mt-auto uppercase tracking-widest"
                      >
                        Confirmar Versado
                      </button>
                  </div>
               </div>
            </BentoCard>
          </div>
          <div className="lg:col-span-4">
             <BentoCard title="Detalles del Origen" icon={Truck}>
                <div className="flex flex-col gap-4 text-sm font-bold">
                   <div className="flex justify-between"><span>Cantidad:</span> <span>{selectedDispatch.quantity} Kg</span></div>
                   <div className="flex justify-between"><span>Fecha:</span> <span>{selectedDispatch.date}</span></div>
                </div>
             </BentoCard>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-5xl font-black tracking-tighter uppercase">Romanero Planta</h2>
            <p className="text-black/40 font-mono text-sm tracking-[0.2em]">RECEPCIÓN Y CONTROL DE MATERIA PRIMA</p>
         </div>
         <Paginator current={page} total={totalPages} onPageChange={setPage} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {paged.map(d => (
           <button key={d.id} onClick={() => handleSelect(d.id)} className="group bg-[#0052CC] p-8 rounded-[3rem] h-[300px] flex flex-col justify-between text-white text-left transition-all hover:scale-[1.03] shadow-2xl shadow-blue-200 relative overflow-hidden">
             <div className="absolute -top-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700"><Truck size={180} /></div>
             <div className="z-10">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6"><Flame size={28} /></div>
                <h3 className="text-3xl font-black tracking-tighter uppercase leading-tight">Despacho {d.id.slice(-4)}</h3>
                <p className="text-white/60 font-bold text-[10px] uppercase tracking-widest">{d.quantity} Kg • {d.date}</p>
             </div>
             <div className="z-10 border-t border-white/10 pt-6 flex justify-between items-center font-black text-[10px] uppercase tracking-widest">
                <span>Ingresar al Silo</span>
                <ChevronRight size={18} />
             </div>
           </button>
         ))}
         {paged.length === 0 && (
            <div className="col-span-full py-20 text-center opacity-20 font-bold uppercase tracking-[0.2em] border-2 border-dashed rounded-[3rem]">No hay camiones en tránsito</div>
         )}
      </div>
    </div>
  );
};

const QualityManagementView = ({ 
  barrels, 
  crops, 
  lots,
  onUpdateBarrel,
  viewMode,
  setViewMode,
  selectedId,
  setSelectedId
}: { 
  barrels: Barrel[], 
  crops: Crop[], 
  lots: Lot[],
  onUpdateBarrel: (id: string, updates: Partial<Barrel>) => void,
  viewMode: 'list' | 'detail',
  setViewMode: (v: 'list' | 'detail') => void,
  selectedId: string | null,
  setSelectedId: (id: string | null) => void,
  key?: React.Key
}) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const selectedBarrel = barrels.find(b => b.id === selectedId);
  const [brixValue, setBrixValue] = useState(selectedBarrel?.brix || 12);

  const filtered = barrels.filter(b => b.id.toLowerCase().includes(search.toLowerCase()));
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paged = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setViewMode('detail');
  };

  const isLocked = (barrel: Barrel) => {
    const now = new Date();
    const end = new Date(barrel.incubationEndDate);
    return now < end;
  };

  const getRemainingTime = (barrel: Barrel) => {
    const diff = new Date(barrel.incubationEndDate).getTime() - new Date().getTime();
    if (diff <= 0) return 'Listo';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  if (viewMode === 'detail' && selectedBarrel) {
    const locked = isLocked(selectedBarrel);
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-10">
        <div className="bg-white p-10 rounded-[3rem] border border-black/5 shadow-xl flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black text-[#0052CC] uppercase tracking-[0.3em] mb-2 block">Laboratorio Microbiológico</span>
            <h2 className="text-5xl font-black tracking-tighter uppercase">Barril {selectedBarrel.id.slice(-6)}</h2>
          </div>
          <StatusBadge status={selectedBarrel.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <BentoCard title="Liberación Biológica" icon={ShieldAlert}>
               {locked ? (
                 <div className="p-10 bg-amber-50 rounded-[2rem] border-2 border-amber-200 text-center flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 animate-pulse">
                      <Lock size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-amber-900 uppercase">Bloqueo de Cuarentena (72h)</h3>
                    <p className="text-amber-800/60 font-bold">Tiempo restante: {getRemainingTime(selectedBarrel)}</p>
                    <button disabled className="px-10 py-5 bg-amber-200 text-amber-800 rounded-2xl font-black opacity-50 cursor-not-allowed">LIBERACIÓN RESTRINGIDA</button>
                 </div>
               ) : (
                 <div className="flex flex-col gap-10">
                    <div className="grid grid-cols-2 gap-8">
                       <Stepper label="Grados Brix Final" value={brixValue} onChange={setBrixValue} min={10} max={30} step={0.1} />
                       <div className="flex flex-col gap-4">
                          <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Análisis Microbiológico</span>
                          <div className="h-14 bg-black/5 rounded-2xl flex items-center px-6 font-bold text-emerald-600 uppercase">Libre de Patógenos</div>
                       </div>
                    </div>
                    <button 
                      onClick={() => {
                        onUpdateBarrel(selectedBarrel.id, { status: 'LIBERADO', brix: brixValue });
                        alert("Barril liberado para exportación.");
                        setViewMode('list');
                      }}
                      className="h-24 bg-[#0052CC] text-white font-black rounded-[2rem] shadow-xl uppercase tracking-widest text-lg"
                    >
                      LIBERAR BARRIL
                    </button>
                 </div>
               )}
            </BentoCard>
          </div>
          <div className="lg:col-span-4">
             <BentoCard title="Trazabilidad" icon={Activity}>
                <div className="text-xs font-bold flex flex-col gap-4">
                   <div className="flex justify-between"><span>Creado:</span> <span>{new Date(selectedBarrel.creationTimestamp).toLocaleDateString()}</span></div>
                   <div className="flex justify-between"><span>Categoría:</span> <span>ORGANIC MD2</span></div>
                </div>
             </BentoCard>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-5xl font-black tracking-tighter uppercase">Cuarentena y Calidad</h2>
            <p className="text-black/40 font-mono text-sm tracking-[0.2em]">SISTEMA DE SEGURIDAD BIOLÓGICA</p>
         </div>
         <SearchBar value={search} onChange={setSearch} placeholder="Buscar barril..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {paged.map(b => (
           <button key={b.id} onClick={() => handleSelect(b.id)} className={`group p-8 rounded-[3rem] h-[320px] flex flex-col justify-between text-left transition-all hover:scale-[1.03] shadow-2xl relative overflow-hidden ${isLocked(b) ? 'bg-amber-400 text-black shadow-amber-200' : 'bg-[#0052CC] text-white shadow-blue-200'}`}>
             <div className="absolute -top-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700"><Shield size={180} /></div>
             <div>
                <div className="flex justify-between items-start mb-6">
                   <div className={`p-4 rounded-2xl ${isLocked(b) ? 'bg-black/10' : 'bg-white/20'}`}><FlaskConical size={28} /></div>
                   <StatusBadge status={b.status} />
                </div>
                <h3 className="text-3xl font-black tracking-tighter uppercase leading-tight">Barril {b.id.slice(-6)}</h3>
                {isLocked(b) && <p className="font-black text-xs uppercase mt-2">🔒 {getRemainingTime(b)}</p>}
             </div>
             <div className="z-10 border-t border-black/10 pt-6 flex justify-between items-center font-black text-[10px] uppercase tracking-widest">
                <span>{isLocked(b) ? 'Ver Bloqueo' : 'Realizar Análisis'}</span>
                <ChevronRight size={18} />
             </div>
           </button>
         ))}
      </div>
    </div>
  );
};

const ProjectManagementView = ({ 
  projects,
  receptions,
  contacts,
  onAddActivityLog,
  onGenerateDispatch,
  onAddProject,
  lots,
  viewMode,
  setViewMode,
  selectedId,
  setSelectedId
}: { 
  projects: SowingProject[],
  receptions: MaterialReception[],
  contacts: Contact[],
  onAddActivityLog: (projectId: string, record: Omit<ActivityLog, 'id'>) => void,
  onGenerateDispatch: (projectId: string, quantity: number) => void,
  onAddProject: (project: Omit<SowingProject, 'id' | 'activityRecords'>) => void,
  lots: Lot[],
  viewMode: 'list' | 'detail',
  setViewMode: (v: 'list' | 'detail') => void,
  selectedId: string | null,
  setSelectedId: (id: string | null) => void,
  key?: React.Key
}) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showConfig, setShowConfig] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'info' | 'history' | 'trace'>('info');

  const selectedProject = projects.find(p => p.id === selectedId);
  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const pagedProjects = filteredProjects.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const [newSowing, setNewSowing] = useState<Partial<ActivityLog>>({
    type: 'Siembra',
    resource: 'Cuadrilla',
    date: new Date().toISOString().split('T')[0],
    consumedQuantity: 1000,
  });

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setViewMode('detail');
  };

  if (viewMode === 'detail' && selectedProject) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-10"
      >
        {/* Detail Header */}
        <div className="flex justify-between items-end bg-white p-10 rounded-[3rem] border border-black/5 shadow-xl">
          <div>
            <span className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.3em] mb-3 block">EXPEDIENTE DE PROYECTO</span>
            <h2 className="text-5xl font-black tracking-tighter uppercase">{selectedProject.name}</h2>
            <div className="flex gap-4 mt-6">
              <StatusBadge status={selectedProject.status as any} />
              <span className="text-xs font-bold text-black/30 bg-black/5 px-4 py-2 rounded-full uppercase tracking-wider">
                Inicio: {selectedProject.startDate}
              </span>
            </div>
          </div>
          
          <div className="flex bg-black/5 p-2 rounded-3xl">
            {(['info', 'history', 'trace'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveDetailTab(tab)}
                className={`px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${
                  activeDetailTab === tab ? 'bg-white shadow-lg text-[#10B981]' : 'text-black/30'
                }`}
              >
                {tab === 'info' ? 'General' : tab === 'history' ? 'Actividades' : 'Trazabilidad'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            {activeDetailTab === 'info' && (
              <div className="flex flex-col gap-8">
                <BentoCard title="Registro de Actividad" icon={Activity}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Tipo de Labor</span>
                        <select 
                          value={newSowing.type}
                          onChange={e => setNewSowing({...newSowing, type: e.target.value})}
                          className="h-16 px-6 bg-black/5 rounded-2xl font-bold"
                        >
                          <option value="Siembra">Siembra</option>
                          <option value="Riego">Riego</option>
                          <option value="Fertilización">Fertilización</option>
                          <option value="Cura">Mantenimiento / Cura</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                         <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Fecha</span>
                         <input type="date" value={newSowing.date} onChange={e => setNewSowing({...newSowing, date: e.target.value})} className="h-16 px-6 bg-black/5 rounded-2xl font-bold" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2">
                         <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Maquinaria / Equipo</span>
                         <input type="text" placeholder="Ej: Tractor T-45" value={newSowing.machinery || ''} onChange={e => setNewSowing({...newSowing, machinery: e.target.value})} className="h-16 px-6 bg-black/5 rounded-2xl font-bold" />
                      </div>
                      <button 
                        onClick={() => {
                          onAddActivityLog(selectedProject.id, newSowing as any);
                          alert("Actividad registrada.");
                        }}
                        className="h-20 bg-[#10B981] text-white font-black rounded-3xl shadow-xl mt-auto"
                      >
                        CONFIRMAR ACTIVIDAD
                      </button>
                    </div>
                  </div>
                </BentoCard>

                <BentoCard title="Acciones de Salida" icon={Truck}>
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                    <div>
                      <h4 className="font-bold text-emerald-900">Listo para Cosecha</h4>
                      <p className="text-xs text-emerald-700/60 font-medium">Se requiere análisis APROBADO para despachar.</p>
                    </div>
                    <button 
                      onClick={() => onGenerateDispatch(selectedProject.id, 15000)}
                      className="px-8 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg hover:scale-105 transition-all text-sm uppercase tracking-widest"
                    >
                      Generar Despacho
                    </button>
                  </div>
                </BentoCard>
              </div>
            )}

            {activeDetailTab === 'history' && (
              <BentoCard title="Bitácora Histórica" icon={Clock}>
                <div className="flex flex-col gap-4">
                  {selectedProject.activityRecords.map(act => (
                    <div key={act.id} className="p-6 bg-black/5 rounded-3xl flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#10B981] shadow-sm">
                          <Activity size={20} />
                        </div>
                        <div>
                          <p className="font-black text-lg">{act.type}</p>
                          <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">
                            {act.date} • {act.machinery || act.crew || 'General'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )).reverse()}
                </div>
              </BentoCard>
            )}
          </div>
          <div className="lg:col-span-4">
             {/* Side info */}
             <BentoCard title="Lotes Vinculados" icon={Map}>
                <div className="flex flex-col gap-3">
                   {selectedProject.lotIds.map(id => (
                     <div key={id} className="p-4 bg-black/5 rounded-2xl font-bold text-sm">{lots.find(l => l.id === id)?.lotCode || id}</div>
                   ))}
                </div>
             </BentoCard>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-5xl font-black tracking-tighter uppercase">Gestión de Proyectos</h2>
          <p className="text-black/40 font-mono text-sm tracking-[0.2em]">CONTROL INTEGRAL DEL CICLO DE VIDA AGRÍCOLA</p>
        </div>
        <button onClick={() => setShowConfig(true)} className="flex items-center gap-3 px-10 py-5 bg-[#10B981] text-white rounded-[2rem] font-black shadow-xl hover:scale-105 transition-transform uppercase tracking-widest text-sm">
          <Plus size={24} /> Nuevo Proyecto
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white p-6 rounded-[2.5rem] border border-black/5 shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar proyecto..." />
        <Paginator current={page} total={totalPages} onPageChange={setPage} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {pagedProjects.map(project => (
          <button
            key={project.id}
            onClick={() => handleSelect(project.id)}
            className="group bg-[#10B981] hover:bg-[#059669] p-8 rounded-[3rem] h-[320px] flex flex-col justify-between text-white text-left transition-all hover:scale-[1.03] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
               <Sprout size={180} />
            </div>
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-white/20 rounded-2xl">
                  <Briefcase size={28} />
                </div>
                <StatusBadge status={project.status as any} />
              </div>
              <h3 className="text-3xl font-black tracking-tighter uppercase leading-tight mb-2">{project.name}</h3>
              <p className="text-white/60 font-bold text-xs uppercase tracking-widest">{project.lotIds.length} Lotes</p>
            </div>
             <div className="z-10 flex items-center justify-between border-t border-white/10 pt-6 font-black text-[10px] uppercase tracking-widest">
               <span>Ver Expediente</span>
               <ChevronRight size={18} />
            </div>
          </button>
        ))}
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
  viewMode,
  setViewMode,
  selectedId,
  setSelectedId
}: { 
  lots: Lot[], 
  crops: Crop[], 
  farms: Farm[],
  onAddLot: (lot: Partial<Lot>) => void,
  onDeleteLot: (id: string) => void,
  onAddAnalysis: (lotId: string, analysis: LotAnalysis) => void,
  viewMode: 'list' | 'detail',
  setViewMode: (v: 'list' | 'detail') => void,
  selectedId: string | null,
  setSelectedId: (id: string | null) => void,
  key?: React.Key
}) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newLot, setNewLot] = useState<Partial<Lot>>({
    lotCode: '', area: 10, soilType: 'Arcilloso', cropId: crops[0].id, farmId: farms[0]?.id || '', status: 'VACÍO'
  });

  const [analysisValues, setAnalysisValues] = useState<{ [key: string]: any }>({});
  
  const filteredLots = lots.filter(l => l.lotCode.toLowerCase().includes(search.toLowerCase()));
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredLots.length / itemsPerPage);
  const pagedLots = filteredLots.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const selectedLot = lots.find(l => l.id === selectedId);
  const selectedCrop = crops.find(c => c.id === selectedLot?.cropId);

  useEffect(() => {
    if (selectedLot && selectedCrop) {
      const initialValues: any = {};
      selectedCrop.parameters.forEach(p => {
        if (p.type === 'NUMERIC') initialValues[p.id] = (p.min! + p.max!) / 2;
        if (p.type === 'BOOLEAN') initialValues[p.id] = true;
        if (p.type === 'SELECTION') initialValues[p.id] = p.options?.[0] || '';
      });
      setAnalysisValues(initialValues);
    }
  }, [selectedId]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setViewMode('detail');
  };

  if (viewMode === 'detail' && selectedLot) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-10">
        <div className="bg-white p-10 rounded-[3rem] border border-black/5 shadow-xl flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.3em] mb-2 block">Control de Calidad en Lote</span>
            <h2 className="text-5xl font-black tracking-tighter uppercase">{selectedLot.lotCode}</h2>
          </div>
          <StatusBadge status={selectedLot.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 flex flex-col gap-8">
            <BentoCard title="Nuevos Resultados" icon={ClipboardCheck}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {selectedCrop?.parameters.map(p => (
                    <div key={p.id} className="flex flex-col gap-4">
                      <span className="text-xs font-bold text-black/40 uppercase tracking-widest">{p.name}</span>
                      <Stepper label={p.unit || ''} value={analysisValues[p.id] || 0} onChange={v => setAnalysisValues({...analysisValues, [p.id]: v})} min={0} max={100} />
                    </div>
                  ))}
               </div>
               <button onClick={() => {
                 onAddAnalysis(selectedLot.id, { id: `an-${Date.now()}`, lotId: selectedLot.id, date: new Date().toISOString(), values: analysisValues, status: 'APROBADO' });
                 alert("Análisis registrado.");
               }} className="h-20 bg-[#10B981] text-white font-black rounded-3xl shadow-xl mt-10 uppercase tracking-widest">Guardar Resultados</button>
            </BentoCard>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-8">
             <BentoCard title="Historial" icon={Clock}>
                <div className="flex flex-col gap-4">
                  {selectedLot.analyses?.map(an => (
                    <div key={an.id} className="p-4 bg-black/5 rounded-2xl flex justify-between items-center">
                       <span className="font-bold text-xs">{new Date(an.date).toLocaleDateString()}</span>
                       <StatusBadge status={an.status} />
                    </div>
                  )).reverse()}
                </div>
             </BentoCard>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-5xl font-black tracking-tighter uppercase">Laboratorio de Lotes</h2>
          <p className="text-black/40 font-mono text-sm tracking-[0.2em]">CONTROL BIOLÓGICO Y FISICOQUÍMICO</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="flex items-center gap-3 px-10 py-5 bg-[#10B981] text-white rounded-[2rem] font-black shadow-xl hover:scale-105 transition-transform uppercase tracking-widest text-sm text-[10px]">
          <Plus size={24} /> Registrar Lote
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white p-6 rounded-[2.5rem] border border-black/5 shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar lote..." />
        <div className="flex items-center gap-8">
           <Paginator current={page} total={totalPages} onPageChange={setPage} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {pagedLots.map(lot => (
          <button key={lot.id} onClick={() => handleSelect(lot.id)} className="group bg-[#10B981] p-8 rounded-[3rem] h-[300px] flex flex-col justify-between text-white text-left transition-all hover:scale-[1.03] shadow-2xl shadow-emerald-200 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700"><Map size={180} /></div>
            <div className="z-10 flex flex-col gap-4">
               <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center"><MapPin size={28} /></div>
               <div>
                  <h3 className="text-3xl font-black tracking-tighter uppercase leading-tight">{lot.lotCode}</h3>
                  <p className="text-white/60 font-bold text-[10px] uppercase tracking-widest">{lot.area} Hectáreas • {crops.find(c => c.id === lot.cropId)?.name}</p>
               </div>
            </div>
            <div className="z-10 flex items-center justify-between border-t border-white/10 pt-6 font-black text-[10px] uppercase tracking-widest">
               <span>Análisis Disponibles</span>
               <ChevronRight size={18} />
            </div>
          </button>
        ))}
      </div>
      
      {isAdding && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-2xl rounded-[3rem] p-10">
              <h3 className="text-3xl font-black uppercase text-[#10B981] mb-6">Nuevo Lote</h3>
              <div className="flex flex-col gap-6">
                 <input type="text" placeholder="Código de Lote" className="h-16 px-6 bg-black/5 rounded-2xl font-bold" value={newLot.lotCode} onChange={e => setNewLot({...newLot, lotCode: e.target.value})} />
                 <button onClick={() => { onAddLot(newLot); setIsAdding(false); }} className="h-20 bg-[#10B981] text-white font-black rounded-3xl uppercase tracking-widest">Confirmar Registro</button>
              </div>
            </motion.div>
          </div>
      )}
    </div>
  );
};

const SiloManagementView = ({ 
  silos, 
  crops, 
  onAddSilo, 
  onDeleteSilo,
  viewMode,
  setViewMode,
  selectedId,
  setSelectedId
}: { 
  silos: Silo[], 
  crops: Crop[],
  onAddSilo: (s: Partial<Silo>) => void,
  onDeleteSilo: (id: string) => void,
  viewMode: 'list' | 'detail',
  setViewMode: (v: 'list' | 'detail') => void,
  selectedId: string | null,
  setSelectedId: (id: string | null) => void,
  key?: React.Key
}) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const filtered = silos.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paged = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const selectedSilo = silos.find(s => s.id === selectedId);

  if (viewMode === 'detail' && selectedSilo) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-10">
        <div className="bg-white p-10 rounded-[3rem] border border-black/5 shadow-xl flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black text-[#0052CC] uppercase tracking-[0.3em] mb-2 block">Detalle de Almacenamiento</span>
            <h2 className="text-5xl font-black tracking-tighter uppercase">{selectedSilo.name}</h2>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-3xl font-black text-[#0052CC]">{selectedSilo.currentLevel} Kg</span>
             <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">Capacidad: {selectedSilo.capacity} Kg</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <BentoCard title="Estado de Carga" icon={Droplets}>
              <div className="flex flex-col gap-6">
                 <div className="h-4 bg-black/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0052CC]" style={{ width: `${Math.min(100, (selectedSilo.currentLevel / selectedSilo.capacity) * 100)}%` }} />
                 </div>
                 <div className="flex justify-between text-sm font-bold uppercase tracking-widest opacity-40">
                    <span>Ocupación</span>
                    <span>{Math.round((selectedSilo.currentLevel / selectedSilo.capacity) * 100)}%</span>
                 </div>
              </div>
           </BentoCard>
           <BentoCard title="Acciones" icon={Settings}>
              <button onClick={() => { onDeleteSilo(selectedSilo.id); setViewMode('list'); }} className="w-full h-16 bg-red-50 text-red-600 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors uppercase tracking-widest text-xs">
                 <Trash2 size={18} /> Eliminar Silo
              </button>
           </BentoCard>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-5xl font-black tracking-tighter uppercase">Gestión de Silos</h2>
          <p className="text-black/40 font-mono text-sm tracking-[0.2em]">CONTROL DE INVENTARIO EN PLANTA</p>
        </div>
        <button onClick={() => onAddSilo({})} className="flex items-center gap-3 px-10 py-5 bg-[#0052CC] text-white rounded-[2rem] font-black shadow-xl hover:scale-105 transition-transform uppercase tracking-widest text-sm">
          <Plus size={24} /> Nuevo Silo
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white p-6 rounded-[2.5rem] border border-black/5 shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar silo..." />
        <Paginator current={page} total={totalPages} onPageChange={setPage} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {paged.map(silo => (
          <button
            key={silo.id}
            onClick={() => { setSelectedId(silo.id); setViewMode('detail'); }}
            className="group bg-white p-8 rounded-[3rem] h-[320px] flex flex-col justify-between border border-black/5 hover:border-[#0052CC]/40 transition-all hover:scale-[1.03] shadow-xl relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 opacity-5 group-hover:rotate-12 transition-transform duration-700 text-[#0052CC]">
               <Droplets size={180} />
            </div>
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-[#0052CC]/10 text-[#0052CC] rounded-2xl">
                  <Layers size={28} />
                </div>
                <div className="px-4 py-1.5 bg-blue-50 text-[#0052CC] rounded-full text-[10px] font-black uppercase tracking-widest">
                  {Math.round((silo.currentLevel / silo.capacity) * 100)}%
                </div>
              </div>
              <h3 className="text-3xl font-black tracking-tighter uppercase leading-tight mb-2">{silo.name}</h3>
              <p className="text-black/40 font-bold text-xs uppercase tracking-widest">{silo.currentLevel} / {silo.capacity} Kg</p>
            </div>
             <div className="z-10 flex items-center justify-between border-t border-black/5 pt-6 font-black text-[10px] uppercase tracking-widest text-[#0052CC]">
               <span>Ver Detalle</span>
               <ChevronRight size={18} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const [currentModule, setCurrentModule] = useState<'home' | 'maestros' | 'campo' | 'planta' | 'calidad'>('home');
  const [activeTab, setActiveTab] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleAddSilo = (siloData: Partial<Silo>) => {
    const newSilo: Silo = {
      id: `silo-${Date.now()}`,
      name: siloData.name || 'Nuevo Silo',
      capacity: siloData.capacity || 50000,
      currentLevel: 0,
      unit: 'Kg'
    };
    setSilos(prev => [...prev, newSilo]);
  };

  const handleDeleteSilo = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este silo?')) {
      setSilos(prev => prev.filter(s => s.id !== id));
    }
  };
  
  // Phase 4: Data Simulation
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
    const baseLots = saved ? JSON.parse(saved) : INITIAL_LOTS;
    // Phase 4: Add 3 lots to current project simulation if not present
    return baseLots;
  });

  const [receptions, setReceptions] = useState<MaterialReception[]>(() => {
    const saved = localStorage.getItem('dusa_receptions');
    return saved ? JSON.parse(saved) : [];
  });

  const [sowingProjects, setSowingProjects] = useState<SowingProject[]>(() => {
    const saved = localStorage.getItem('dusa_projects');
    if (saved) return JSON.parse(saved);
    
    // Phase 4: Simulation Initial Data
    const projectPast: SowingProject = {
      id: 'proj-past-1',
      name: 'Simulación: Cosecha 2025',
      lotIds: ['lot-1'],
      status: 'FINALIZADO',
      startDate: '2025-01-01',
      endDate: '2025-06-01',
      activityRecords: [
        { id: 'a1', date: '2025-01-05', type: 'Siembra', resource: 'Cuadrilla', crew: 'Cuadrilla Alfa', description: 'Siembra inicial' },
        { id: 'a2', date: '2025-01-20', type: 'Riego', resource: 'Maquinaria', machinery: 'Sistema Riego 01' },
        { id: 'a3', date: '2025-02-15', type: 'Fertilización', resource: 'Cuadrilla', supplyId: 'seed-1', consumedQuantity: 200 },
        { id: 'a4', date: '2025-04-10', type: 'Cura', resource: 'Maquinaria', machinery: 'Tractor T1' },
        { id: 'a5', date: '2025-05-30', type: 'Cosecha', resource: 'Cuadrilla', description: 'Cosecha finalizada con éxito' }
      ]
    };
    
    const projectCurrent: SowingProject = {
      id: 'proj-now-1',
      name: 'Siembra Actual: Piña MD2 (Demo)',
      lotIds: ['lot-1'], // En una app real serían IDs dinámicos
      status: 'ACTIVO',
      startDate: new Date().toISOString().split('T')[0],
      activityRecords: [
        { id: 'b1', date: new Date().toISOString().split('T')[0], type: 'Mantenimiento', resource: 'Cuadrilla', crew: 'Equipo Campo B' }
      ]
    };
    
    return [projectPast, projectCurrent];
  });

  const [chemicals] = useState<Chemical[]>(INITIAL_CHEMICALS);
  const [barrels, setBarrels] = useState<Barrel[]>([]);
  const [dispatches, setDispatches] = useState<DispatchRecord[]>(() => {
    // Phase 4: 2 Camiones viniendo de Campo
    return [
      { id: 'disp-sim-1', lotId: 'lot-1', cropId: 'pina', date: new Date().toISOString(), quantity: 15000, status: 'EN TRÁNSITO', type: 'INTERNO', originFarmId: 'farm-1' },
      { id: 'disp-sim-2', lotId: 'lot-1', cropId: 'pina', date: new Date().toISOString(), quantity: 12000, status: 'EN TRÁNSITO', type: 'INTERNO', originFarmId: 'farm-1' }
    ];
  });
  const [silos, setSilos] = useState<Silo[]>(INITIAL_SILOS);
  const [theme, setTheme] = useState<'solar' | 'plant'>('solar');

  const handleAddProject = (projectData: Omit<SowingProject, 'id' | 'activityRecords'>) => {
    const newProject: SowingProject = {
      id: `project-${Date.now()}`,
      ...projectData,
      activityRecords: []
    };
    setSowingProjects(prev => [...prev, newProject]);
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

  const handleEditContact = (updatedContact: Contact) => {
    setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
  };

  const handleDeleteContact = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este contacto?')) {
      setContacts(prev => prev.filter(c => c.id !== id));
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
          status: analysis.status === 'APROBADO' ? 'SEMBRADO' : l.status
        };
      }
      return l;
    }));
  };

  const clearNav = () => {
    setViewMode('list');
    setSelectedId(null);
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

  const handleAddActivityLog = (projectId: string, activity: Omit<ActivityLog, 'id'>) => {
    // 1. Add activity to SowingProject
    const newActivityId = `act-${Date.now()}`;
    setSowingProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          status: p.status === 'PREPARACIÓN' ? 'ACTIVO' : p.status,
          activityRecords: [...p.activityRecords, { ...activity, id: newActivityId }]
        };
      }
      return p;
    }));

    // 2. Subtract from Inventory (Consumption Logic)
    if (activity.supplyId && activity.consumedQuantity) {
      setReceptions(prev => prev.map(r => {
        if (r.id === activity.supplyId) {
          return {
            ...r,
            availableQuantity: Math.max(0, r.availableQuantity - activity.consumedQuantity!)
          };
        }
        return r;
      }));
    }
  };

  const handleGenerateDispatch = (projectId: string, quantity: number) => {
    const project = sowingProjects.find(p => p.id === projectId);
    if (!project || project.lotIds.length === 0) return;

    // Quality Logic check: Any lot in the project must have 'APROBADO' analysis
    const hasApprovedAnalysis = lots.some(l => 
      project.lotIds.includes(l.id) && l.analyses?.some(a => a.status === 'APROBADO')
    );

    if (!hasApprovedAnalysis) {
      alert("BLOQUEO DE CALIDAD: No se puede despachar. No hay un análisis 'APROBADO' vinculado a los lotes de este proyecto.");
      return;
    }

    const firstLotId = project.lotIds[0];
    const firstLot = lots.find(l => l.id === firstLotId);

    // Logistic Bridge: Create EN TRÁNSITO dispatch
    const dispatch: DispatchRecord = {
      id: `disp-${Date.now()}`,
      lotId: firstLotId,
      cropId: firstLot?.cropId,
      quantity,
      date: new Date().toISOString(),
      status: 'EN TRÁNSITO',
      type: 'INTERNO',
      originFarmId: firstLot?.farmId
    };

    setDispatches(prev => [...prev, dispatch]);
    setSowingProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'COSECHA' } : p));
  };

  const handleReceiveDispatch = (dispatchId: string, siloId: string, brix: number) => {
    // Update dispatch status
    setDispatches(prev => prev.map(d => {
      if (d.id === dispatchId) {
        return { ...d, status: 'RECIBIDO' };
      }
      return d;
    }));

    // Update Silo volume and average brix
    const dispatch = dispatches.find(d => d.id === dispatchId);
    if (!dispatch) return;

    setSilos(prev => prev.map(s => {
      if (s.id === siloId) {
        const currentTotalBrix = s.currentLevel * (s.averageBrix || 0);
        const newTotalBrix = currentTotalBrix + (dispatch.quantity * brix);
        const newLevel = s.currentLevel + dispatch.quantity;
        return { 
          ...s, 
          currentLevel: newLevel,
          averageBrix: Number((newTotalBrix / newLevel).toFixed(2)),
          cropId: dispatch.cropId 
        };
      }
      return s;
    }));
  };

  const handleProcessEvaporation = (siloId: string, consumedLiters: number, barrelCount: number) => {
    const silo = silos.find(s => s.id === siloId);
    if (!silo || !silo.cropId) return;

    // Deduct from silo
    setSilos(prev => prev.map(s => {
      if (s.id === siloId) {
        return { ...s, currentLevel: Math.max(0, s.currentLevel - consumedLiters) };
      }
      return s;
    }));

    const ts = Date.now();
    const newBarrels: Barrel[] = Array.from({ length: barrelCount }).map((_, i) => ({
       id: `bar-${ts}-${i}`,
       code: `B-${silo.name.substring(0,2).toUpperCase()}-${ts.toString().slice(-4)}-${i+1}`,
       cropId: silo.cropId!,
       status: 'EN ESPERA',
       date: new Date().toISOString(),
       analysisValues: {},
       creationTimestamp: ts,
       incubationEndDate: ts + (72 * 60 * 60 * 1000), // 72 hours
    }));

    setBarrels(prev => [...prev, ...newBarrels]);
  };

  const handleUpdateBarrel = (id: string, updates: Partial<Barrel>) => {
    setBarrels(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
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
            onClick={() => setCurrentModule('home')}
            className="flex items-center gap-2 text-[#0052CC] font-black tracking-tighter text-2xl hover:scale-105 transition-transform"
          >
            <Leaf fill="currentColor" />
            <span>TERRASYNC</span>
          </button>
          
          {currentModule !== 'home' && (
            <nav className="flex bg-black/5 p-1.5 rounded-2xl">
              {currentModule === 'campo' && (
                <>
                  <button onClick={() => setActiveTab('recepcion-campo')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'recepcion-campo' ? 'bg-white shadow-md text-[#0052CC]' : 'text-black/30'}`}>Inventario</button>
                  <button onClick={() => setActiveTab('siembra')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'siembra' ? 'bg-white shadow-md text-[#0052CC]' : 'text-black/30'}`}>Operaciones</button>
                  <button onClick={() => setActiveTab('lots')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'lots' ? 'bg-white shadow-md text-[#0052CC]' : 'text-black/30'}`}>Calidad</button>
                  <button onClick={() => setActiveTab('fincas')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'fincas' ? 'bg-white shadow-md text-[#0052CC]' : 'text-black/30'}`}>Maestros</button>
                </>
              )}
              {currentModule === 'planta' && (
                <>
                  <button onClick={() => setActiveTab('despacho')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'despacho' ? 'bg-white shadow-md text-[#0052CC]' : 'text-black/30'}`}>Inventario</button>
                  <button onClick={() => setActiveTab('evaporador')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'evaporador' ? 'bg-white shadow-md text-[#0052CC]' : 'text-black/30'}`}>Operaciones</button>
                  <button onClick={() => setActiveTab('cuarentena')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'cuarentena' ? 'bg-white shadow-md text-[#0052CC]' : 'text-black/30'}`}>Calidad</button>
                  <button onClick={() => setActiveTab('recepcion')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'recepcion' ? 'bg-white shadow-md text-[#0052CC]' : 'text-black/30'}`}>Maestros</button>
                </>
              )}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-6">
          {viewMode === 'detail' && (
            <button 
              onClick={() => { setViewMode('list'); setSelectedId(null); }}
              className="flex items-center gap-2 px-6 py-3 bg-black/5 text-black font-bold rounded-xl hover:bg-black/10 transition-all"
            >
              <ChevronRight className="rotate-180" size={18} /> Volver
            </button>
          )}
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
            {currentModule === 'home' && (
              <HomeDashboardView 
                key="home" 
                sowingProjects={sowingProjects}
                barrels={barrels}
                dispatches={dispatches}
                silos={silos}
                onNavigate={(mod) => {
                  setCurrentModule(mod as any);
                  if (mod === 'maestros') setActiveTab('crops');
                  if (mod === 'campo') setActiveTab('siembra');
                  if (mod === 'planta') setActiveTab('despacho');
                  if (mod === 'calidad') setActiveTab('analisis');
                }} 
              />
            )}
            {currentModule === 'maestros' && activeTab === 'crops' && (
              <CropMasterView 
                key="crops"
                crops={crops} 
                selectedCropId={selectedCropId} 
                setSelectedCropId={setSelectedCropId} 
                onUpdateCrop={handleUpdateCrop} 
              />
            )}
            {currentModule === 'maestros' && activeTab === 'contacts' && (
              <ContactManagementView 
                key="contacts"
                contacts={contacts}
                onAddContact={handleAddContact}
                onEditContact={handleEditContact}
                onDeleteContact={handleDeleteContact}
                viewMode={viewMode}
                setViewMode={setViewMode}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            )}
            {currentModule === 'maestros' && activeTab === 'fincas' && (
              <FarmManagementView 
                key="fincas" 
                farms={farms} 
                contacts={contacts}
                onAddFarm={handleAddFarm} 
                onDeleteFarm={handleDeleteFarm} 
                viewMode={viewMode}
                setViewMode={setViewMode}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            )}
            {currentModule === 'maestros' && activeTab === 'silos' && (
              <SiloManagementView
                key="silos"
                silos={silos}
                crops={crops}
                onAddSilo={handleAddSilo}
                onDeleteSilo={handleDeleteSilo}
                viewMode={viewMode}
                setViewMode={setViewMode}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            )}
            {currentModule === 'campo' && activeTab === 'recepcion-campo' && (
              <MaterialReceptionView 
                key="recepcion-campo"
                receptions={receptions}
                crops={crops}
                lots={lots}
                farms={farms}
                onAddReception={handleAddReception}
                viewMode={viewMode}
                setViewMode={setViewMode}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            )}
            {currentModule === 'campo' && activeTab === 'fincas' && (
              <FarmManagementView 
                key="fincas" 
                farms={farms} 
                contacts={contacts}
                onAddFarm={handleAddFarm} 
                onDeleteFarm={handleDeleteFarm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            )}
            {currentModule === 'campo' && activeTab === 'lots' && (
              <LotManagementView 
                key="lots"
                lots={lots} 
                crops={crops} 
                farms={farms}
                onAddLot={handleAddLot}
                onDeleteLot={handleDeleteLot}
                onAddAnalysis={handleAddAnalysis}
                viewMode={viewMode}
                setViewMode={setViewMode}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            )}
            {currentModule === 'campo' && activeTab === 'siembra' && (
              <ProjectManagementView 
                key="siembra"
                projects={sowingProjects}
                receptions={receptions}
                contacts={contacts}
                lots={lots}
                onAddActivityLog={handleAddActivityLog}
                onGenerateDispatch={handleGenerateDispatch}
                onAddProject={handleAddProject}
                viewMode={viewMode}
                setViewMode={setViewMode}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            )}
            {/* SiembraControlView removed, now part of ProjectManagementView */}
            {currentModule === 'planta' && activeTab === 'despacho' && (
              <DispatchManagementView 
                key="despacho"
                dispatches={dispatches}
                lots={lots}
                farms={farms}
                silos={silos}
                onReceiveDispatch={handleReceiveDispatch}
                viewMode={viewMode}
                setViewMode={setViewMode}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            )}
            {currentModule === 'planta' && activeTab === 'evaporador' && (
              <EvaporatorManagementView
                key="evaporador"
                silos={silos}
                crops={crops}
                onProcessEvaporation={handleProcessEvaporation}
                viewMode={viewMode}
                setViewMode={setViewMode}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            )}
            {currentModule === 'calidad' && activeTab === 'analisis' && (
              <LotManagementView 
                key="analisis"
                lots={lots} 
                crops={crops} 
                farms={farms}
                onAddLot={handleAddLot}
                onDeleteLot={handleDeleteLot}
                onAddAnalysis={handleAddAnalysis}
                viewMode={viewMode}
                setViewMode={setViewMode}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            )}
            {currentModule === 'calidad' && activeTab === 'cuarentena' && (
              <QualityManagementView 
                key="cuarentena"
                barrels={barrels}
                crops={crops}
                lots={lots}
                onUpdateBarrel={handleUpdateBarrel}
                viewMode={viewMode}
                setViewMode={setViewMode}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            )}
          </AnimatePresence>
        </main>
      </div>

      <footer className="bg-white border-t border-black/5 p-10">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center text-black/20 text-[10px] font-black uppercase tracking-[0.2em]">
          <div className="flex items-center gap-6">
            <span>TERRASYNC v2.0.0</span>
            <span className="w-1.5 h-1.5 bg-black/5 rounded-full" />
            <span>Arquitectura Modular Activa</span>
          </div>
          <div className="flex items-center gap-3">
            <Activity size={14} />
            Optimizado para Operaciones de Campo
          </div>
        </div>
      </footer>
    </div>
  );
}
