/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Minus, Beaker, ShieldCheck, Clock, ChevronRight, ChevronLeft, Save, Leaf, 
  Map, LayoutGrid, MapPin, Layers, Info, Home, User, Settings, 
  Activity, Trash2, CheckCircle2, XCircle, ListFilter, Briefcase, Factory, Users, Search, Phone, CreditCard,
  Droplets, Sprout, Truck, Box, Sun, Moon, FlaskConical, ClipboardCheck, ArrowLeft, Target, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SiembraControlView } from './components/SiembraControlView';
import { FarmManagementView } from './components/FarmManagementView';
import { LotManagementView } from './components/LotManagementView';
import { QualityManagementView } from './components/QualityManagementView';
import { SiloManagementView } from './components/SiloManagementView';
import { 
  Crop, INITIAL_CROPS, DynamicParameter, Lot, INITIAL_LOTS, 
  SoilType, LotStatus, Farm, INITIAL_FARMS, UnitSystem, 
  UNITS_MASTER, ParameterType, ParameterCategory, LotAnalysis,
  QualityCategory, MaterialReception, Contact, INITIAL_CONTACTS,
  Chemical, INITIAL_CHEMICALS, CureRecord, SowingRecord, Barrel, DispatchRecord, BarrelStatus, SowingProject, Silo, ActivityLog
} from './types';

// --- Reusable Components ---

const HomeDashboardView = ({ onNavigate }: { onNavigate: (tab: string) => void, key?: React.Key }) => {
  const modules = [
    { id: 'maestros', label: 'MAESTROS', icon: Briefcase, color: 'bg-black text-white border-2 border-white/10', description: 'Configuración base y contactos' },
    { id: 'campo', label: 'CAMPO', icon: Map, color: 'bg-[#10B981] text-black shadow-[0_0_30px_rgba(16,185,129,0.3)]', description: 'Cura, Siembra y Lotes' },
    { id: 'planta', label: 'PLANTA', icon: Factory, color: 'bg-[#3B82F6] text-white shadow-[0_0_30px_rgba(59,130,246,0.3)]', description: 'Recepción y Despacho' },
    { id: 'calidad', label: 'CALIDAD', icon: ShieldCheck, color: 'bg-[#F59E0B] text-black shadow-[0_0_30px_rgba(245,158,11,0.3)]', description: 'Microbiología y Barriles' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {modules.map((m) => (
        <button
          key={m.id}
          onClick={() => onNavigate(m.id)}
          className={`${m.color} rounded-[3rem] p-10 flex flex-col justify-between text-left transition-all hover:-translate-y-2 group relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <m.icon size={200} />
          </div>
          <div className="z-10">
            <div className="p-4 rounded-2xl w-fit mb-8 bg-black/10 backdrop-blur-md">
              <m.icon size={32} />
            </div>
            <h2 className="text-5xl font-black tracking-tighter mb-4 leading-none">{m.label}</h2>
            <p className="opacity-60 font-black uppercase text-[10px] tracking-widest">{m.description}</p>
          </div>
          <div className="z-10 flex items-center gap-3 font-black text-xs uppercase tracking-widest mt-12 group-hover:gap-5 transition-all">
            Acceder Módulo <ChevronRight size={20} />
          </div>
        </button>
      ))}
    </motion.div>
  );
};

const ContactManagementView = ({ 
  contacts, 
  onAddContact, 
  onEditContact,
  onDeleteContact 
}: { 
  contacts: Contact[], 
  onAddContact: (c: Partial<Contact>) => void, 
  onEditContact: (c: Contact) => void,
  onDeleteContact: (id: string) => void,
  key?: React.Key
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [contactForm, setContactForm] = useState<Partial<Contact>>({
    name: '',
    role: 'Administrador',
    phone: '',
    externalId: ''
  });

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.externalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contacts, searchTerm]);

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const paginatedContacts = filteredContacts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openModal = (contact: Contact | null = null) => {
    setEditingContact(contact);
    setContactForm(contact || {
      name: '',
      role: 'Administrador',
      phone: '',
      externalId: ''
    });
    setIsModalOpen(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-black p-10 rounded-[2rem] border-2 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-[#3B82F6] text-black rounded-3xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            <Users size={40} />
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tighter uppercase leading-none text-white">Maestro de Contactos</h2>
            <p className="text-white/40 font-black uppercase text-[10px] tracking-widest mt-3">Gestión de Personal y Proveedores</p>
          </div>
        </div>
        <button 
          onClick={() => openModal()}
          className="w-full lg:w-auto flex items-center justify-center gap-3 h-16 px-10 bg-[#3B82F6] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap border-2 border-white/20"
        >
          <Plus size={24} /> <span>Nuevo Contacto</span>
        </button>
      </div>

      <div className="bg-black p-10 rounded-[2rem] border-2 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between mb-10">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={24} />
            <input
              type="text"
              placeholder="BUSCAR CONTACTO..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="industrial-input w-full h-16 pl-16 pr-6 bg-black rounded-2xl border-2 border-white/20 focus:border-[#3B82F6] font-black text-white outline-none transition-all uppercase text-xs tracking-widest"
            />
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all disabled:opacity-10 text-white"
            >
              <ChevronLeft size={24} />
            </button>
            <span className="text-xs font-black tracking-widest px-4 text-white">
              {currentPage} DE {totalPages || 1}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all disabled:opacity-10 text-white"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {paginatedContacts.map(contact => (
            <div 
              key={contact.id} 
              className="bg-black border-2 border-white/20 rounded-[2rem] p-8 flex flex-col gap-8 hover:border-[#3B82F6] transition-all group shadow-[0_0_30px_rgba(255,255,255,0.02)]"
            >
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 group-hover:bg-[#3B82F6]/20 group-hover:text-[#3B82F6] transition-all border border-white/10">
                  <Users size={32} />
                </div>
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest border ${
                  contact.role === 'Administrador' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' : 
                  contact.role === 'Operador' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                }`}>
                  {contact.role.toUpperCase()}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black tracking-tighter text-white mb-2 uppercase">{contact.name}</h3>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">ID: {contact.externalId}</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 text-white/60">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[#3B82F6]">
                    <Phone size={20} />
                  </div>
                  <span className="font-black text-lg tracking-tight">{contact.phone}</span>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 flex justify-between items-center gap-4">
                <button 
                  onClick={() => openModal(contact)}
                  className="flex-1 h-14 bg-white/5 hover:bg-white text-white hover:text-black rounded-xl font-black text-xs tracking-widest transition-all uppercase border border-white/10"
                >
                  Editar
                </button>
                <button 
                  onClick={() => { if(confirm('¿Eliminar contacto?')) onDeleteContact(contact.id); }}
                  className="w-14 h-14 flex items-center justify-center text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-white/10"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
          ))}
          {paginatedContacts.length === 0 && (
            <div className="col-span-full py-32 text-center text-white/10 font-black text-4xl uppercase tracking-tighter">
              No se encontraron contactos
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-black w-full max-w-2xl rounded-[3rem] border-2 border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="p-10 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="text-3xl font-black tracking-tighter uppercase text-white">{editingContact ? 'Editar Contacto' : 'Registrar Contacto'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="w-14 h-14 flex items-center justify-center bg-white/10 rounded-2xl hover:bg-white/20 transition-all text-white">
                  <Plus className="rotate-45" size={32} />
                </button>
              </div>
              
              <div className="p-10 flex flex-col gap-10">
                <div className="flex flex-col gap-4">
                  <span className="text-xs font-black text-white/40 uppercase tracking-widest">Nombre Completo</span>
                  <input 
                    type="text" 
                    value={contactForm.name} 
                    onChange={e => setContactForm(prev => ({ ...prev, name: e.target.value }))} 
                    className="industrial-input h-20 px-8 bg-black rounded-2xl border-2 border-white/20 focus:border-[#3B82F6] font-black text-2xl text-white outline-none transition-all uppercase" 
                  />
                </div>
                
                <div className="flex flex-col gap-4">
                  <span className="text-xs font-black text-white/40 uppercase tracking-widest">Cargo / Rol</span>
                  <div className="relative">
                    <select 
                      value={contactForm.role} 
                      onChange={e => setContactForm(prev => ({ ...prev, role: e.target.value as any }))}
                      className="industrial-input w-full h-20 px-8 bg-black rounded-2xl border-2 border-white/20 focus:border-[#3B82F6] font-black text-xl text-white outline-none transition-all appearance-none uppercase"
                    >
                      <option value="Administrador">ADMINISTRADOR</option>
                      <option value="Operador">OPERADOR</option>
                      <option value="Agrónomo">AGRÓNOMO</option>
                      <option value="Logística">LOGÍSTICA</option>
                    </select>
                    <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 rotate-90 text-white/40 pointer-events-none" size={24} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-black text-white/40 uppercase tracking-widest">Teléfono</span>
                    <input 
                      type="text" 
                      value={contactForm.phone} 
                      onChange={e => setContactForm(prev => ({ ...prev, phone: e.target.value }))} 
                      className="industrial-input h-20 px-8 bg-black rounded-2xl border-2 border-white/20 focus:border-[#3B82F6] font-black text-2xl text-white outline-none transition-all uppercase" 
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-black text-white/40 uppercase tracking-widest">ID / Cédula</span>
                    <input 
                      type="text" 
                      value={contactForm.externalId} 
                      onChange={e => setContactForm(prev => ({ ...prev, externalId: e.target.value }))} 
                      className="industrial-input h-20 px-8 bg-black rounded-2xl border-2 border-white/20 focus:border-[#3B82F6] font-black text-2xl text-white outline-none transition-all uppercase" 
                    />
                  </div>
                </div>
                
                <button 
                  onClick={() => { 
                    if (editingContact) {
                      onEditContact({ ...editingContact, ...contactForm } as Contact);
                    } else {
                      onAddContact(contactForm);
                    }
                    setIsModalOpen(false); 
                  }}
                  className="h-20 bg-[#3B82F6] text-white rounded-2xl font-black uppercase tracking-widest text-lg shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all mt-6 border-2 border-white/20"
                >
                  {editingContact ? 'Guardar Cambios' : 'Guardar Contacto'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const BentoCard = ({ children, title, icon: Icon, className = "", noPadding = false }: { children: React.Key | React.ReactNode, title: string, icon: any, className?: string, noPadding?: boolean, key?: React.Key }) => (
  <div className={`bg-black border-2 border-[#3B82F6] rounded-[2.5rem] shadow-[0_0_30px_rgba(59,130,246,0.1)] flex flex-col ${noPadding ? '' : 'p-10'} gap-8 ${className}`}>
    <div className={`flex items-center gap-4 ${noPadding ? 'p-10 pb-0' : ''}`}>
      <div className="p-4 bg-[#3B82F6]/10 rounded-2xl text-[#3B82F6]">
        <Icon size={32} />
      </div>
      <h3 className="text-3xl font-black tracking-tighter uppercase text-white">{title}</h3>
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
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-end">
        <span className="text-xs font-black text-white uppercase tracking-widest">{label}</span>
        <span className="text-3xl font-black text-[#3B82F6]">
          {value} <span className="text-sm font-normal text-white">{unit}</span>
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={decrement}
          className="flex-1 h-20 bg-black border-2 border-white/20 active:bg-white/10 rounded-2xl flex items-center justify-center transition-colors"
        >
          <Minus size={32} className="text-white" />
        </button>
        <button 
          onClick={increment}
          className="flex-1 h-20 bg-[#3B82F6] active:bg-[#2563EB] text-white rounded-2xl flex items-center justify-center transition-colors shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        >
          <Plus size={32} />
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
      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{label}</span>
      <span className="text-xl font-black text-white">
        {value} <span className="text-xs font-normal text-white/20">{unit}</span>
      </span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step} 
      value={value} 
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#3B82F6] hover:bg-white/10 transition-all"
    />
  </div>
);

const StatusBadge = ({ status }: { status: LotStatus }) => {
  const styles = {
    'PREPARACIÓN': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    'SEMBRADO': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    'VACÍO': 'bg-slate-500/10 text-slate-400 border-slate-500/30'
  };
  return (
    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border uppercase ${styles[status]}`}>
      {status}
    </span>
  );
};

// --- Views ---



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
    <div className="flex flex-col gap-10">
      {/* Crop Selector */}
      <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
        {crops.map(crop => (
          <button
            key={crop.id}
            onClick={() => setSelectedCropId(crop.id)}
            className={`flex items-center gap-6 px-10 py-8 rounded-[2.5rem] border-2 transition-all whitespace-nowrap ${
              selectedCropId === crop.id 
                ? 'bg-[#3B82F6] border-white/20 shadow-[0_0_30px_rgba(59,130,246,0.4)] text-white scale-105' 
                : 'bg-black border-white/10 text-white/40 hover:border-white/40 hover:text-white'
            }`}
          >
            <span className="text-5xl">{crop.icon}</span>
            <span className="font-black text-3xl tracking-tighter uppercase">{crop.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Physical-Chemical Section */}
        <div className="lg:col-span-12 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-black p-10 rounded-[2.5rem] border-2 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-[#3B82F6] text-black rounded-3xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                <Target size={40} />
              </div>
              <div>
                <h3 className="text-4xl font-black tracking-tighter uppercase leading-none text-white">Constructor de Análisis</h3>
                <p className="text-white/40 font-black uppercase text-[10px] tracking-widest mt-3">Define los parámetros dinámicos para el control de calidad.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsAddingParam(true)}
              className="w-full md:w-auto h-20 px-6 md:px-12 bg-[#3B82F6] text-white rounded-2xl font-black text-sm md:text-lg uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(59,130,246,0.4)] border-2 border-white/20 flex items-center justify-center gap-4"
            >
              <Plus size={28} /> AGREGAR PARÁMETRO
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {currentCrop.parameters.map(param => (
              <div 
                key={param.id} 
                className="relative group p-10 bg-black rounded-[2.5rem] border-2 border-white/10 hover:border-[#3B82F6] transition-all shadow-[0_0_30px_rgba(255,255,255,0.02)]"
              >
                <button 
                  onClick={() => removeParameter(param.id)}
                  className="absolute top-10 right-10 w-12 h-12 flex items-center justify-center text-white/20 hover:text-red-500 transition-colors bg-white/5 rounded-2xl border border-white/10"
                >
                  <Trash2 size={24} />
                </button>
                
                <div className="flex flex-col gap-10">
                  <div className="flex items-center gap-6">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${param.category === 'FISICO_QUIMICO' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {param.category === 'FISICO_QUIMICO' ? <Beaker size={40} /> : <ShieldCheck size={40} />}
                    </div>
                    <div>
                      <h4 className="text-3xl font-black tracking-tighter uppercase text-white leading-tight">{param.name}</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border ${
                          param.category === 'FISICO_QUIMICO' ? 'bg-[#3B82F6]/5 text-[#3B82F6] border-[#3B82F6]/20' : 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {param.category.replace('_', ' ')}
                        </span>
                        <span className="px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase bg-white/5 text-white/40 border border-white/10">
                          {param.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {param.type === 'NUMERIC' && (
                    <div className="flex flex-col gap-6 pt-8 border-t border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-white/40 uppercase tracking-widest">Rango de Aceptación</span>
                        <span className="text-xl font-black text-[#3B82F6] uppercase">{param.unit}</span>
                      </div>
                      <div className="flex items-center gap-8 bg-white/5 p-8 rounded-3xl border-2 border-white/5">
                        <div className="flex-1 text-center">
                          <span className="text-[10px] block text-white/20 font-black uppercase tracking-widest mb-2">MÍNIMO</span>
                          <span className="text-4xl font-black text-white">{param.min}</span>
                        </div>
                        <div className="w-px h-16 bg-white/10" />
                        <div className="flex-1 text-center">
                          <span className="text-[10px] block text-white/20 font-black uppercase tracking-widest mb-2">MÁXIMO</span>
                          <span className="text-4xl font-black text-white">{param.max}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {param.type === 'SELECTION' && (
                    <div className="flex flex-col gap-6 pt-8 border-t border-white/10">
                      <span className="text-xs font-black text-white/40 uppercase tracking-widest">Opciones de Selección</span>
                      <div className="flex flex-wrap gap-3">
                        {param.options?.map((opt, idx) => (
                          <span key={idx} className="px-5 py-3 bg-white/5 rounded-2xl text-sm font-black text-white border-2 border-white/10 uppercase tracking-tight">
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {param.type === 'BOOLEAN' && (
                    <div className="flex flex-col gap-6 pt-8 border-t border-white/10">
                      <span className="text-xs font-black text-white/40 uppercase tracking-widest">Estado Óptimo</span>
                      <div className="h-20 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl font-black text-emerald-400 uppercase tracking-widest">SÍ (ACTIVO)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-black w-full max-w-3xl rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border-2 border-white/20"
            >
              <div className="p-10 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div>
                  <h3 className="text-4xl font-black tracking-tighter uppercase text-white">Nuevo Parámetro</h3>
                  <p className="text-white/40 font-black uppercase text-[10px] tracking-widest mt-2">Configuración técnica del análisis</p>
                </div>
                <button onClick={() => setIsAddingParam(false)} className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all border border-white/10">
                  <Plus className="rotate-45" size={32} />
                </button>
              </div>
              <div className="p-10 flex flex-col gap-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-black text-white/40 uppercase tracking-widest">Nombre del Análisis</span>
                    <input 
                      type="text" 
                      placeholder="EJ: GRADOS BRIX"
                      value={newParam.name}
                      onChange={e => setNewParam(prev => ({ ...prev, name: e.target.value }))}
                      className="industrial-input h-20 px-8 bg-black rounded-2xl border-2 border-white/20 focus:border-[#3B82F6] font-black text-2xl text-white outline-none transition-all uppercase placeholder:text-white/10"
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-black text-white/40 uppercase tracking-widest">Categoría</span>
                    <div className="flex bg-white/5 p-2 rounded-2xl h-20 border-2 border-white/10">
                      {(['FISICO_QUIMICO', 'MICROBIOLOGICO'] as ParameterCategory[]).map(c => (
                        <button
                          key={c}
                          onClick={() => setNewParam(prev => ({ ...prev, category: c }))}
                          className={`flex-1 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${newParam.category === c ? 'bg-[#3B82F6] text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'text-white/20 hover:bg-white/5'}`}
                        >
                          {c.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-black text-white/40 uppercase tracking-widest">Tipo de Valor</span>
                    <div className="grid grid-cols-3 gap-3">
                      {(['NUMERIC', 'BOOLEAN', 'SELECTION'] as ParameterType[]).map(t => (
                        <button
                          key={t}
                          onClick={() => setNewParam(prev => ({ ...prev, type: t }))}
                          className={`h-16 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${newParam.type === t ? 'bg-[#3B82F6] text-white border-white/20 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-black text-white/20 border-white/10 hover:border-white/40'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-black text-white/40 uppercase tracking-widest">Unidad de Medida</span>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                      {UNITS_MASTER.map(u => (
                        <button
                          key={u}
                          onClick={() => setNewParam(prev => ({ ...prev, unit: u }))}
                          className={`h-16 px-6 rounded-xl font-black text-xs border-2 transition-all whitespace-nowrap ${newParam.unit === u ? 'bg-[#3B82F6] text-white border-white/20 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-black text-white/20 border-white/10 hover:border-white/40'}`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {newParam.type === 'NUMERIC' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white/5 p-10 rounded-[2.5rem] border-2 border-white/10">
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
                  <div className="flex flex-col gap-6 bg-white/5 p-10 rounded-[2.5rem] border-2 border-white/10">
                    <span className="text-xs font-black text-white/40 uppercase tracking-widest">Lógica de Calidad (Boolean)</span>
                    <div className="flex flex-col md:flex-row items-center justify-between bg-black p-8 rounded-2xl border-2 border-white/10 gap-6">
                      <span className="font-black text-xl text-white uppercase tracking-tight">Estado 'ACTIVO' significa:</span>
                      <div className="flex bg-white/5 p-2 rounded-2xl w-full md:w-auto">
                        <button 
                          onClick={() => setNewParam(prev => ({ ...prev, booleanOptimalState: true }))}
                          className={`flex-1 md:px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${newParam.booleanOptimalState !== false ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'text-white/20 hover:bg-white/5'}`}
                        >
                          ÓPTIMO
                        </button>
                        <button 
                          onClick={() => setNewParam(prev => ({ ...prev, booleanOptimalState: false }))}
                          className={`flex-1 md:px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${newParam.booleanOptimalState === false ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'text-white/20 hover:bg-white/5'}`}
                        >
                          ALERTA
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {newParam.type === 'SELECTION' && (
                  <div className="flex flex-col gap-4 bg-white/5 p-8 rounded-[2rem] border border-white/10">
                    <span className="text-xs font-bold text-white/20 uppercase tracking-widest">Opciones y Categorías</span>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Nueva opción..."
                        value={optionInput}
                        onChange={e => setOptionInput(e.target.value)}
                        className="flex-1 h-14 px-6 bg-white/5 rounded-xl font-bold border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-[#3B82F6]/50"
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
                        className="px-6 bg-[#3B82F6] text-white rounded-xl font-bold shadow-lg shadow-blue-500/20"
                      >
                        Agregar
                      </button>
                    </div>
                    <div className="flex flex-col gap-3">
                      {newParam.options?.map((opt, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                          <span className="font-bold text-white">{opt}</span>
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
                                    ? cat === 'Bueno' ? 'bg-emerald-500 text-white border-transparent' : 
                                      cat === 'Regular' ? 'bg-amber-500 text-white border-transparent' : 
                                      'bg-red-500 text-white border-transparent'
                                    : 'bg-white/5 text-white/20 border-white/10 hover:bg-white/10'
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
                              className="ml-2 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col md:flex-row flex-wrap gap-6 pt-10 border-t border-white/5">
                  <button 
                    onClick={() => setIsAddingParam(false)}
                    className="w-full md:w-auto flex-1 h-16 bg-white/5 text-white/40 rounded-2xl font-black uppercase tracking-widest text-xs border border-white/10"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={addParameter}
                    className="w-full md:w-auto flex-1 h-16 bg-[#3B82F6] text-white rounded-2xl font-black shadow-2xl shadow-blue-500/20 uppercase tracking-widest text-xs"
                  >
                    Guardar Parámetro
                  </button>
                </div>
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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [newReception, setNewReception] = useState<Partial<MaterialReception>>({
    provider: '',
    cropId: crops[0]?.id || '',
    lotId: '',
    farmId: '',
    bundleCount: 100,
    averageWeight: 5.0,
    qualityValues: {}
  });

  const filteredReceptions = useMemo(() => {
    return receptions.filter(r => 
      r.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crops.find(c => c.id === r.cropId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lots.find(l => l.id === r.lotId)?.lotCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [receptions, searchTerm, crops, lots]);

  const totalPages = Math.ceil(filteredReceptions.length / itemsPerPage) || 1;
  const paginatedReceptions = filteredReceptions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 bg-black p-10 rounded-[2rem] border-2 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 bg-blue-500 text-black rounded-3xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            <Layers size={40} />
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tighter uppercase leading-none text-white">Recepción de Material</h2>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-white/40 font-black uppercase text-[10px] tracking-widest">Página</span>
              <span className="text-[#3B82F6] font-black text-xs uppercase tracking-widest">{currentPage} de {totalPages}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={24} />
            <input 
              type="text" 
              placeholder="BUSCAR RECEPCIÓN..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="industrial-input w-full h-16 pl-16 pr-6 bg-black rounded-2xl border-2 border-white/20 focus:border-[#3B82F6] font-black text-white outline-none transition-all uppercase text-xs tracking-widest"
            />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-16 h-16 rounded-2xl bg-black border-2 border-white/20 flex items-center justify-center disabled:opacity-10 hover:bg-white/10 transition-colors text-white"
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-16 h-16 rounded-2xl bg-black border-2 border-white/20 flex items-center justify-center disabled:opacity-10 hover:bg-white/10 transition-colors text-white"
            >
              <ChevronRight size={28} />
            </button>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-4 h-16 px-10 bg-[#3B82F6] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap border-2 border-white/30"
          >
            <Plus size={24} /> <span>Registrar Entrada</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {paginatedReceptions.length === 0 ? (
          <div className="col-span-full bg-black border-2 border-dashed border-white/10 rounded-[3rem] py-32 text-center flex flex-col items-center justify-center text-white/20">
            <Layers size={80} className="mb-6 opacity-10" />
            <p className="font-black text-xl uppercase tracking-[0.3em]">No se encontraron recepciones</p>
          </div>
        ) : (
          paginatedReceptions.map(rec => {
            const crop = crops.find(c => c.id === rec.cropId);
            const lot = lots.find(l => l.id === rec.lotId);
            const statusColors = {
              'Bueno': 'border-emerald-500 text-emerald-500 shadow-emerald-500/10',
              'Regular': 'border-amber-500 text-amber-500 shadow-amber-500/10',
              'Malo': 'border-red-500 text-red-500 shadow-red-500/10'
            };
            const colorClass = statusColors[rec.status as keyof typeof statusColors] || 'border-white/20 text-white';

            return (
              <button
                key={rec.id}
                className="p-10 rounded-[3rem] text-left transition-all flex flex-col gap-8 bg-black border-2 border-white/10 hover:border-[#3B82F6] hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(0,0,0,0.5)] group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform text-white">
                  <Layers size={160} />
                </div>
                <div className="flex justify-between items-start w-full z-10">
                  <div className="p-5 rounded-2xl bg-white/5 text-[#3B82F6] border-2 border-white/10 transition-all group-hover:bg-white/10">
                    <Layers size={32} />
                  </div>
                  <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest border-2 uppercase ${colorClass}`}>
                    {rec.status}
                  </span>
                </div>
                <div className="z-10">
                  <h4 className="font-black text-3xl mb-2 tracking-tighter text-white leading-tight uppercase">{rec.provider}</h4>
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={14} /> {new Date(rec.date).toLocaleDateString()}
                    </p>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                      <Box size={14} /> {lot?.lotCode}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 z-10">
                  <div className="bg-white/5 p-5 rounded-2xl border-2 border-white/5">
                    <span className="text-[10px] uppercase font-black text-white/20 block mb-1 tracking-widest">Bultos</span>
                    <span className="text-2xl font-black text-white">{rec.bundleCount}</span>
                  </div>
                  <div className="bg-white/5 p-5 rounded-2xl border-2 border-white/5">
                    <span className="text-[10px] uppercase font-black text-white/20 block mb-1 tracking-widest">Peso Prom.</span>
                    <span className="text-2xl font-black text-white">{rec.averageWeight} <span className="text-xs font-normal opacity-40">Kg</span></span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white/5 p-6 rounded-[2rem] border-2 border-white/5 z-10 mt-2">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl grayscale group-hover:grayscale-0 transition-all">{crop?.icon}</span>
                    <span className="font-black text-white uppercase text-sm tracking-tight">{crop?.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-black text-white/20 block tracking-widest">Health Score</span>
                    <span className={`text-3xl font-black ${rec.healthScore >= 80 ? 'text-emerald-500' : rec.healthScore >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                      {rec.healthScore}%
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-black w-full max-w-6xl rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh] border-2 border-white/20">
              <div className="p-12 border-b-2 border-white/10 flex justify-between items-center bg-white/5 sticky top-0 z-10">
                <div>
                  <h3 className="text-4xl font-black tracking-tighter uppercase text-white">Recepción de Material</h3>
                  <p className="text-white/40 font-black uppercase text-[10px] tracking-widest mt-2">Ingreso técnico de material vegetal</p>
                </div>
                <button onClick={() => setIsAdding(false)} className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"><Plus className="rotate-45" size={32} /></button>
              </div>

              <div className="p-12 flex flex-col gap-12 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  {/* Left Column: Basic Info */}
                  <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-4">
                      <span className="text-xs font-black text-white/40 uppercase tracking-widest">Proveedor / Origen</span>
                      <input 
                        type="text" 
                        value={newReception.provider}
                        onChange={e => setNewReception(prev => ({ ...prev, provider: e.target.value }))}
                        className="industrial-input h-20 px-8 bg-black rounded-2xl font-black text-2xl text-white border-2 border-white/20 focus:border-[#3B82F6] outline-none transition-all uppercase placeholder:text-white/10"
                        placeholder="NOMBRE DEL PROVEEDOR"
                      />
                    </div>

                    <div className="flex flex-col gap-4">
                      <span className="text-xs font-black text-white/40 uppercase tracking-widest">Finca de Recepción</span>
                      <div className="grid grid-cols-2 gap-4">
                        {farms.map(f => (
                          <button
                            key={f.id}
                            onClick={() => setNewReception(prev => ({ ...prev, farmId: f.id, lotId: '' }))}
                            className={`h-20 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-2 ${newReception.farmId === f.id ? 'bg-[#3B82F6] text-white border-white/30 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-black text-white/20 border-white/10 hover:border-white/40'}`}
                          >
                            {f.name}
                            {newReception.farmId === f.id && <CheckCircle2 size={16} />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-10">
                      <div className="flex flex-col gap-4">
                        <span className="text-xs font-black text-white/40 uppercase tracking-widest">Cultivo</span>
                        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                          {crops.map(c => (
                            <button
                              key={c.id}
                              onClick={() => setNewReception(prev => ({ ...prev, cropId: c.id, lotId: '' }))}
                              className={`h-20 px-8 rounded-2xl font-black text-xs border-2 transition-all whitespace-nowrap flex items-center gap-3 ${newReception.cropId === c.id ? 'bg-[#3B82F6] text-white border-white/30 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-black text-white/20 border-white/10 hover:border-white/40'}`}
                            >
                              <span className="text-2xl">{c.icon}</span>
                              <span className="uppercase tracking-widest">{c.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <span className="text-xs font-black text-white/40 uppercase tracking-widest">Lote Destino</span>
                        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                          {filteredLots.map(l => (
                            <button
                              key={l.id}
                              onClick={() => setNewReception(prev => ({ ...prev, lotId: l.id }))}
                              className={`h-20 px-8 rounded-2xl font-black text-xs border-2 transition-all whitespace-nowrap flex items-center gap-2 ${newReception.lotId === l.id ? 'bg-[#3B82F6] text-white border-white/30 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-black text-white/20 border-white/10 hover:border-white/40'}`}
                            >
                              {l.lotCode}
                              {newReception.lotId === l.id && <CheckCircle2 size={16} />}
                            </button>
                          ))}
                          {filteredLots.length === 0 && (
                            <div className="h-20 px-8 rounded-2xl border-2 border-dashed border-white/10 flex items-center text-white/20 text-[10px] font-black uppercase tracking-widest">
                              Sin lotes disponibles
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white/5 p-10 rounded-[2.5rem] border-2 border-white/10">
                      <Stepper 
                        label="Cantidad de Bultos" 
                        value={newReception.bundleCount || 0} 
                        onChange={v => setNewReception(prev => ({ ...prev, bundleCount: v }))} 
                        step={1}
                        min={1}
                        max={5000}
                      />
                      <Stepper 
                        label="Peso Promedio (Kg)" 
                        value={newReception.averageWeight || 0} 
                        onChange={v => setNewReception(prev => ({ ...prev, averageWeight: v }))} 
                        step={0.1}
                        min={0.1}
                        max={100}
                        unit="Kg"
                      />
                    </div>
                  </div>

                  {/* Right Column: Quality Parameters */}
                  <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-4 mb-2">
                      <ShieldCheck className="text-[#3B82F6]" size={32} />
                      <h4 className="text-2xl font-black uppercase tracking-tighter text-white">Control de Calidad</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                      {selectedCrop?.parameters.map(param => (
                        <div key={param.id} className="p-8 bg-white/5 rounded-[2rem] border-2 border-white/5 flex flex-col gap-6 hover:border-white/20 transition-all">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{param.name}</span>
                            <span className="text-[10px] font-black px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-white/40 uppercase tracking-widest">{param.unit}</span>
                          </div>

                          {param.type === 'NUMERIC' && (
                            <PrecisionSlider 
                              label="Valor Detectado"
                              min={param.min || 0}
                              max={param.max || 100}
                              value={newReception.qualityValues?.[param.id] || 0}
                              onChange={v => setNewReception(prev => ({ 
                                ...prev, 
                                qualityValues: { ...prev.qualityValues, [param.id]: v } 
                              }))}
                              unit={param.unit}
                            />
                          )}

                          {param.type === 'BOOLEAN' && (
                            <div className="flex bg-black p-2 rounded-2xl h-16 border-2 border-white/10">
                              {[true, false].map(v => (
                                <button
                                  key={v.toString()}
                                  onClick={() => setNewReception(prev => ({ 
                                    ...prev, 
                                    qualityValues: { ...prev.qualityValues, [param.id]: v } 
                                  }))}
                                  className={`flex-1 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${newReception.qualityValues?.[param.id] === v ? 'bg-[#3B82F6] text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'text-white/20 hover:bg-white/5'}`}
                                >
                                  {v ? 'ÓPTIMO' : 'ALERTA'}
                                </button>
                              ))}
                            </div>
                          )}

                          {param.type === 'SELECTION' && (
                            <div className="flex flex-wrap gap-2">
                              {param.options?.map(opt => (
                                <button
                                  key={opt}
                                  onClick={() => setNewReception(prev => ({ 
                                    ...prev, 
                                    qualityValues: { ...prev.qualityValues, [param.id]: opt } 
                                  }))}
                                  className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${newReception.qualityValues?.[param.id] === opt ? 'bg-[#3B82F6] text-white border-white/20 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-black text-white/20 border-white/10 hover:border-white/40'}`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      {(!selectedCrop || selectedCrop.parameters.length === 0) && (
                        <div className="py-10 text-center text-white/10 font-black uppercase tracking-widest text-xs">
                          Sin parámetros de calidad definidos para este cultivo
                        </div>
                      )}
                    </div>

                    <div className="mt-auto pt-8 border-t-2 border-white/10">
                      <div className="flex justify-between items-center mb-8">
                        <div>
                          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block">Índice de Salud Proyectado</span>
                          <span className="text-5xl font-black text-white tracking-tighter">
                            {calculateHealthScore(newReception.qualityValues || {})}%
                          </span>
                        </div>
                        <div className={`px-6 py-3 rounded-2xl border-2 font-black uppercase tracking-widest text-xs ${
                          calculateHealthScore(newReception.qualityValues || {}) >= 80 ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10' :
                          calculateHealthScore(newReception.qualityValues || {}) >= 50 ? 'border-amber-500 text-amber-500 bg-amber-500/10' :
                          'border-red-500 text-red-500 bg-red-500/10'
                        }`}>
                          {getStatusFromScore(calculateHealthScore(newReception.qualityValues || {}))}
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row flex-wrap gap-4">
                        <button 
                          onClick={() => setIsAdding(false)}
                          className="w-full md:w-auto flex-1 h-20 bg-black text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs border-2 border-white/20 hover:bg-white/5 transition-all"
                        >
                          Cancelar
                        </button>
                        <button 
                          onClick={handleAdd}
                          className="w-full md:w-auto flex-[2] h-20 bg-white text-black rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        >
                          Confirmar Recepción
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
  onReceiveDispatch
}: { 
  dispatches: DispatchRecord[], 
  lots: Lot[], 
  farms: Farm[],
  onReceiveDispatch: (dispatchId: string) => void,
  key?: React.Key
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredDispatches = useMemo(() => {
    return dispatches.filter(d => 
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lots.find(l => l.id === d.lotId)?.lotCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farms.find(f => f.id === d.originFarmId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [dispatches, searchTerm, lots, farms]);

  const totalPages = Math.ceil(filteredDispatches.length / itemsPerPage) || 1;
  const paginatedDispatches = filteredDispatches.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-black p-10 rounded-[2rem] border-2 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-[#3B82F6] text-white rounded-3xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            <Truck size={40} />
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tighter uppercase leading-none text-white">Despachos a Planta</h2>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-white/40 font-black uppercase text-[10px] tracking-widest">Página</span>
              <span className="text-[#3B82F6] font-black text-xs uppercase tracking-widest">{currentPage} de {totalPages}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={24} />
            <input 
              type="text" 
              placeholder="BUSCAR DESPACHO..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="industrial-input w-full h-16 pl-16 pr-6 bg-black rounded-2xl border-2 border-white/20 focus:border-[#3B82F6] font-black text-white outline-none transition-all uppercase text-xs tracking-widest"
            />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-16 h-16 rounded-2xl bg-black border-2 border-white/20 flex items-center justify-center disabled:opacity-10 hover:bg-white/10 transition-colors text-white"
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-16 h-16 rounded-2xl bg-black border-2 border-white/20 flex items-center justify-center disabled:opacity-10 hover:bg-white/10 transition-colors text-white"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {paginatedDispatches.length === 0 ? (
          <div className="col-span-full text-center py-20 text-white/20 font-black uppercase tracking-widest text-2xl">No hay despachos registrados</div>
        ) : (
          paginatedDispatches.map(dispatch => {
            const lot = lots.find(l => l.id === dispatch.lotId);
            const farm = farms.find(f => f.id === dispatch.originFarmId);

            return (
              <div
                key={dispatch.id}
                className="p-8 rounded-[2rem] text-left transition-all flex flex-col gap-6 bg-black border-2 border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.5)] group relative"
              >
                <div className="absolute top-8 right-8">
                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest border-2 ${
                    dispatch.status === 'RECIBIDO' ? 'border-[#10B981] text-[#10B981]' : 'border-[#3B82F6] text-[#3B82F6]'
                  }`}>
                    {dispatch.status}
                  </span>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 text-[#3B82F6] border-2 border-white/20">
                      <Truck size={32} />
                    </div>
                    <div>
                      <h4 className="font-black text-2xl tracking-tight text-white uppercase">{dispatch.id.split('-')[1]}</h4>
                      <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest">
                        <Clock size={12} /> {new Date(dispatch.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4 bg-white/5 p-6 rounded-2xl border-2 border-white/10">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-black text-white/40">Origen</span>
                      <span className="text-sm font-black text-white">{farm?.name || 'Proveedor Externo'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-black text-white/40">Lote</span>
                      <span className="text-sm font-black text-white">{lot?.lotCode || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border-2 border-white/10">
                      <span className="text-[10px] uppercase font-black text-white/40 block mb-1">Tipo</span>
                      <span className="text-xs font-black text-white uppercase">{dispatch.type}</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border-2 border-white/10">
                      <span className="text-[10px] uppercase font-black text-white/40 block mb-1">Cantidad</span>
                      <span className="text-xl font-black text-white">{dispatch.quantity} Kg</span>
                    </div>
                  </div>

                  {dispatch.status === 'PENDIENTE' && (
                    <button
                      onClick={() => onReceiveDispatch(dispatch.id)}
                      className="w-full h-16 bg-white text-black font-black rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-xs border-2 border-black"
                    >
                      <CheckCircle2 size={20} /> RECIBIR
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

const CureManagementView = ({ 
  lots, 
  chemicals, 
  contacts,
  onAddCureRecord
}: { 
  lots: Lot[], 
  chemicals: Chemical[], 
  contacts: Contact[],
  onAddCureRecord: (record: Partial<CureRecord>) => void,
  key?: React.Key
}) => {
  const [selectedLotId, setSelectedLotId] = useState<string>('');
  const [newCure, setNewCure] = useState<Partial<CureRecord>>({
    chemicalId: chemicals[0]?.id || '',
    dosage: 1.0,
    responsibleId: contacts[0]?.id || '',
    date: new Date().toISOString().split('T')[0]
  });

  const selectedChemical = chemicals.find(c => c.id === newCure.chemicalId);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-black p-10 rounded-[2rem] border-2 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-[#3B82F6] text-white rounded-3xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            <Droplets size={40} />
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tighter uppercase leading-none text-white">Tratamiento de Semilla</h2>
            <p className="text-white/40 font-black uppercase text-[10px] tracking-widest mt-3">Registro de Aplicación Fitosanitaria (Cura)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-black p-10 rounded-[2rem] border-2 border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#3B82F6] border-2 border-white/10">
                <Map size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Selección de Lote</h3>
            </div>
            <div className="flex flex-col gap-4">
              {lots.filter(l => l.status === 'VACÍO' || l.status === 'PREPARACIÓN').map(lot => (
                <button
                  key={lot.id}
                  onClick={() => setSelectedLotId(lot.id)}
                  className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 ${
                    selectedLotId === lot.id ? 'bg-white border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-[1.02]' : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100 hover:border-white/20'
                  }`}
                >
                  <span className={`font-black text-2xl ${selectedLotId === lot.id ? 'text-black' : 'text-white'}`}>{lot.lotCode}</span>
                  <span className={`block text-[10px] font-black uppercase tracking-widest ${selectedLotId === lot.id ? 'text-black/60' : 'text-white/40'}`}>
                    {lot.soilType} • {lot.area} Ha
                  </span>
                </button>
              ))}
              {lots.filter(l => l.status === 'VACÍO' || l.status === 'PREPARACIÓN').length === 0 && (
                <div className="text-center py-10 text-white/20 font-black uppercase tracking-widest">No hay lotes disponibles</div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="bg-black p-10 rounded-[2rem] border-2 border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#3B82F6] border-2 border-white/10">
                <Droplets size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Detalles del Tratamiento</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-4">
                  <span className="text-xs font-black text-white/40 uppercase tracking-widest">Producto Químico</span>
                  <div className="grid grid-cols-1 gap-3">
                    {chemicals.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setNewCure(prev => ({ ...prev, chemicalId: c.id }))}
                        className={`h-16 px-6 rounded-2xl font-black border-2 transition-all text-left flex justify-between items-center ${
                          newCure.chemicalId === c.id ? 'bg-white border-white text-black shadow-lg' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        {c.name}
                        <span className={`text-[10px] font-black uppercase tracking-widest ${newCure.chemicalId === c.id ? 'text-black/60' : 'text-white/20'}`}>{c.type}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <span className="text-xs font-black text-white/40 uppercase tracking-widest">Fecha de Aplicación</span>
                  <input 
                    type="date" 
                    value={newCure.date}
                    onChange={e => setNewCure(prev => ({ ...prev, date: e.target.value }))}
                    className="industrial-input w-full h-16 px-6 bg-black rounded-2xl border-2 border-white/20 font-black text-xl text-white outline-none focus:border-[#3B82F6] transition-all uppercase"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-12">
                <Stepper 
                  label={`Dosis (${selectedChemical?.unit || 'ml/L'})`}
                  value={newCure.dosage || 0}
                  onChange={v => setNewCure(prev => ({ ...prev, dosage: v }))}
                  min={0.1}
                  max={50}
                  step={0.1}
                />
                
                <div className="flex flex-col gap-4">
                  <span className="text-xs font-black text-white/40 uppercase tracking-widest">Responsable de Aplicación</span>
                  <div className="relative">
                    <select 
                      value={newCure.responsibleId}
                      onChange={e => setNewCure(prev => ({ ...prev, responsibleId: e.target.value }))}
                      className="industrial-input w-full h-16 px-6 bg-black rounded-2xl border-2 border-white/20 font-black text-white appearance-none outline-none focus:border-[#3B82F6] transition-all uppercase"
                    >
                      {contacts.filter(c => c.role === 'Operador' || c.role === 'Administrador').map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                      <ChevronRight className="rotate-90" size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-10 border-t-2 border-white/10 flex flex-col md:flex-row flex-wrap gap-4">
              <button
                onClick={() => {
                  if (!selectedLotId) {
                    alert("Seleccione un lote primero");
                    return;
                  }
                  onAddCureRecord({ ...newCure, lotId: selectedLotId });
                  alert("Tratamiento registrado con éxito");
                }}
                className="w-full md:w-auto flex-1 h-20 bg-[#3B82F6] text-white rounded-2xl font-black text-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest border-2 border-white/20"
              >
                Registrar Tratamiento (Cura)
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};



// --- Main Application ---

export default function App() {
  const [currentModule, setCurrentModule] = useState<'home' | 'maestros' | 'campo' | 'planta' | 'calidad'>('home');
  const [activeTab, setActiveTab] = useState<string>('');
  
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
  const [sowingProjects, setSowingProjects] = useState<SowingProject[]>(() => {
    const saved = localStorage.getItem('dusa_projects');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'proj-1',
        name: 'Siembra Invierno 2025',
        lotIds: ['lot-1'],
        status: 'FINALIZADA',
        startDate: '2025-06-01',
        endDate: '2025-12-01',
        activityLogs: [
          { id: 'log-1', date: '2025-06-01', description: 'Preparación de terreno', machineryIds: [], inputIds: [], laborIds: [] },
          { id: 'log-2', date: '2025-06-15', description: 'Siembra inicial', machineryIds: [], inputIds: [], laborIds: [] },
          { id: 'log-3', date: '2025-08-10', description: 'Aplicación de fertilizante', machineryIds: [], inputIds: [], laborIds: [] },
          { id: 'log-4', date: '2025-11-20', description: 'Cosecha', machineryIds: [], inputIds: [], laborIds: [] }
        ]
      },
      {
        id: 'proj-2',
        name: 'Siembra Primavera 2026',
        lotIds: ['lot-1'],
        status: 'CRECIMIENTO',
        startDate: '2026-02-01',
        activityLogs: [
          { id: 'log-5', date: '2026-02-01', description: 'Arado profundo', machineryIds: [], inputIds: [], laborIds: [] },
          { id: 'log-6', date: '2026-02-15', description: 'Siembra', machineryIds: [], inputIds: [], laborIds: [] },
          { id: 'log-7', date: '2026-03-01', description: 'Control de maleza', machineryIds: [], inputIds: [], laborIds: [] }
        ]
      }
    ];
  });

  const handleAddProject = (projectData: Omit<SowingProject, 'id' | 'activityLogs'>) => {
    const newProject: SowingProject = {
      id: `project-${Date.now()}`,
      ...projectData,
      activityLogs: []
    };
    setSowingProjects(prev => [...prev, newProject]);
  };

  const handleAddActivity = (projectId: string, activity: Omit<ActivityLog, 'id'>, consumedReceptionId?: string, consumedQuantity?: number) => {
    const newActivity: ActivityLog = {
      ...activity,
      id: `act-${Date.now()}`
    };

    setSowingProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, activityLogs: [...p.activityLogs, newActivity] };
      }
      return p;
    }));

    if (consumedReceptionId && consumedQuantity) {
      setReceptions(prev => prev.map(r => {
        if (r.id === consumedReceptionId) {
          return { ...r, usedQuantity: (r.usedQuantity || 0) + consumedQuantity };
        }
        return r;
      }));
    }
  };

  const [chemicals] = useState<Chemical[]>(INITIAL_CHEMICALS);
  const [barrels, setBarrels] = useState<Barrel[]>(() => {
    const saved = localStorage.getItem('dusa_barrels');
    if (saved) return JSON.parse(saved);
    return Array.from({ length: 5 }).map((_, i) => ({
      id: `barrel-${i + 1}`,
      code: `BRL-2026-${(i + 1).toString().padStart(3, '0')}`,
      cropId: 'pina',
      status: 'EN CUARENTENA' as BarrelStatus,
      analysisValues: {},
      date: new Date().toISOString()
    }));
  });
  const [dispatches, setDispatches] = useState<DispatchRecord[]>(() => {
    const saved = localStorage.getItem('dusa_dispatches');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'disp-1', lotId: 'lot-1', date: '2026-03-14', quantity: 5000, status: 'PENDIENTE', type: 'INTERNO' },
      { id: 'disp-2', lotId: 'lot-1', date: '2026-03-15', quantity: 4500, status: 'PENDIENTE', type: 'INTERNO' }
    ];
  });
  const [silos, setSilos] = useState<Silo[]>(() => {
    const saved = localStorage.getItem('dusa_silos');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'silo-1', name: 'Silo A', capacity: 50000, currentLevel: 15000, cropId: 'pina', averageBrix: 13.5 },
      { id: 'silo-2', name: 'Silo B', capacity: 50000, currentLevel: 0, cropId: 'naranja', averageBrix: 0 }
    ];
  });
  const [theme, setTheme] = useState<'solar' | 'plant'>('solar');

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
          status: analysis.status === 'APROBADO' ? 'SEMBRADO' : l.status // Example logic
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

  const handleAddSowingRecord = (record: Partial<SowingRecord>, consumedReceptionId?: string, consumedQuantity?: number) => {
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

    if (consumedReceptionId && consumedQuantity) {
      setReceptions(prev => prev.map(r => {
        if (r.id === consumedReceptionId) {
          return { ...r, usedQuantity: (r.usedQuantity || 0) + consumedQuantity };
        }
        return r;
      }));
    }
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

  const handleGenerateDispatch = (lotId: string, quantity: number) => {
    const lot = lots.find(l => l.id === lotId);
    if (!lot) return;

    const dispatch: DispatchRecord = {
      id: `disp-${Date.now()}`,
      lotId,
      quantity,
      date: new Date().toISOString(),
      status: 'PENDIENTE',
      type: 'INTERNO',
      originFarmId: lot.farmId
    };

    setDispatches(prev => [...prev, dispatch]);
    setLots(prev => prev.map(l => l.id === lotId ? { ...l, status: 'DESPACHADO' } : l));

    // Create a barrel for quality control
    const newBarrel: Barrel = {
      id: `bar-${Date.now()}`,
      code: `B-${lot.lotCode}-${Date.now().toString().slice(-4)}`,
      lotId,
      cropId: lot.cropId,
      status: 'EN ESPERA',
      date: new Date().toISOString(),
      analysisValues: {}
    };
    setBarrels(prev => [...prev, newBarrel]);
  };

  const handleUpdateBarrel = (updatedBarrel: Barrel) => {
    setBarrels(prev => prev.map(b => b.id === updatedBarrel.id ? updatedBarrel : b));
  };

  const handleReceiveDispatch = (dispatchId: string) => {
    const dispatch = dispatches.find(d => d.id === dispatchId);
    if (!dispatch) return;

    const lot = lots.find(l => l.id === dispatch.lotId);
    if (!lot) return;

    // Find a compatible silo
    const compatibleSilo = silos.find(s => s.cropId === lot.cropId && (s.capacity - s.currentLevel) >= dispatch.quantity);
    
    if (!compatibleSilo) {
      alert('No hay silos disponibles con capacidad suficiente para este rubro.');
      return;
    }

    // Update dispatch status
    setDispatches(prev => prev.map(d => d.id === dispatchId ? { ...d, status: 'RECIBIDO' } : d));

    // Update silo level and brix (simulated brix for now)
    setSilos(prev => prev.map(s => {
      if (s.id === compatibleSilo.id) {
        const newLevel = s.currentLevel + dispatch.quantity;
        // Simple weighted average for Brix (assuming incoming has ~12 Brix)
        const incomingBrix = 12.0;
        const newBrix = ((s.currentLevel * s.averageBrix) + (dispatch.quantity * incomingBrix)) / newLevel;
        return { ...s, currentLevel: newLevel, averageBrix: newBrix };
      }
      return s;
    }));

    alert(`Despacho recibido y asignado al ${compatibleSilo.name}`);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      console.log('Global State Saved:', { farms, crops, lots });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans flex flex-col">
      {/* Navigation Header */}
      <div className="px-4 md:px-10 py-6 md:py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0 sticky top-0 z-40 bg-black border-b-2 border-white/20">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 w-full md:w-auto">
          {currentModule === 'home' ? (
            <button 
              onClick={() => setCurrentModule('home')}
              className="flex items-center gap-2 text-[#3B82F6] font-black tracking-tighter text-4xl hover:scale-105 transition-transform"
            >
              <Leaf fill="currentColor" size={40} />
              <span>TERRASYNC</span>
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  setCurrentModule('home');
                  setActiveTab('');
                }}
                className="w-16 h-16 md:w-20 md:h-20 bg-black text-white rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors border-2 border-white shrink-0"
              >
                <ArrowLeft size={32} className="md:w-10 md:h-10" />
              </button>
              <span className="text-2xl font-black uppercase tracking-widest text-white md:hidden">
                {currentModule}
              </span>
            </div>
          )}
          
          {currentModule !== 'home' && (
            <nav className="flex gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-0 w-full md:w-auto">
              {currentModule === 'maestros' && (
                <>
                  <button onClick={() => setActiveTab('crops')} className={`px-6 md:px-10 py-3 md:py-4 rounded-2xl font-black text-sm md:text-lg uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'crops' ? 'bg-[#3B82F6] text-white shadow-[0_0_30px_rgba(59,130,246,0.6)]' : 'text-white hover:bg-white/5'}`}>Rubros</button>
                  <button onClick={() => setActiveTab('contacts')} className={`px-6 md:px-10 py-3 md:py-4 rounded-2xl font-black text-sm md:text-lg uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'contacts' ? 'bg-[#3B82F6] text-white shadow-[0_0_30px_rgba(59,130,246,0.6)]' : 'text-white hover:bg-white/5'}`}>Contactos</button>
                </>
              )}
              {currentModule === 'campo' && (
                <>
                  <button onClick={() => setActiveTab('fincas')} className={`px-6 md:px-10 py-3 md:py-4 rounded-2xl font-black text-sm md:text-lg uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'fincas' ? 'bg-[#10B981] text-white shadow-[0_0_30px_rgba(16,185,129,0.6)]' : 'text-white hover:bg-white/5'}`}>Fincas</button>
                  <button onClick={() => setActiveTab('lots')} className={`px-6 md:px-10 py-3 md:py-4 rounded-2xl font-black text-sm md:text-lg uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'lots' ? 'bg-[#10B981] text-white shadow-[0_0_30px_rgba(16,185,129,0.6)]' : 'text-white hover:bg-white/5'}`}>Lotes</button>
                  <button onClick={() => setActiveTab('cura')} className={`px-6 md:px-10 py-3 md:py-4 rounded-2xl font-black text-sm md:text-lg uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'cura' ? 'bg-[#10B981] text-white shadow-[0_0_30px_rgba(16,185,129,0.6)]' : 'text-white hover:bg-white/5'}`}>Cura</button>
                  <button onClick={() => setActiveTab('control-siembra')} className={`px-6 md:px-10 py-3 md:py-4 rounded-2xl font-black text-sm md:text-lg uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'control-siembra' ? 'bg-[#10B981] text-white shadow-[0_0_30px_rgba(16,185,129,0.6)]' : 'text-white hover:bg-white/5'}`}>Proyectos</button>
                </>
              )}
              {currentModule === 'planta' && (
                <>
                  <button onClick={() => setActiveTab('recepcion')} className={`px-6 md:px-10 py-3 md:py-4 rounded-2xl font-black text-sm md:text-lg uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'recepcion' ? 'bg-[#3B82F6] text-white shadow-[0_0_30px_rgba(59,130,246,0.6)]' : 'text-white hover:bg-white/5'}`}>Recepción</button>
                  <button onClick={() => setActiveTab('despacho')} className={`px-6 md:px-10 py-3 md:py-4 rounded-2xl font-black text-sm md:text-lg uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'despacho' ? 'bg-[#3B82F6] text-white shadow-[0_0_30px_rgba(59,130,246,0.6)]' : 'text-white hover:bg-white/5'}`}>Despacho</button>
                  <button onClick={() => setActiveTab('silos')} className={`px-6 md:px-10 py-3 md:py-4 rounded-2xl font-black text-sm md:text-lg uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'silos' ? 'bg-[#3B82F6] text-white shadow-[0_0_30px_rgba(59,130,246,0.6)]' : 'text-white hover:bg-white/5'}`}>Silos</button>
                </>
              )}
              {currentModule === 'calidad' && (
                <>
                  <button onClick={() => setActiveTab('analisis')} className={`px-6 md:px-10 py-3 md:py-4 rounded-2xl font-black text-sm md:text-lg uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'analisis' ? 'bg-[#F59E0B] text-white shadow-[0_0_30px_rgba(245,158,11,0.6)]' : 'text-white hover:bg-white/5'}`}>Calidad</button>
                  <button onClick={() => setActiveTab('cuarentena')} className={`px-6 md:px-10 py-3 md:py-4 rounded-2xl font-black text-sm md:text-lg uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'cuarentena' ? 'bg-[#F59E0B] text-white shadow-[0_0_30px_rgba(245,158,11,0.6)]' : 'text-white hover:bg-white/5'}`}>Cuarentena</button>
                </>
              )}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-6 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 px-6 py-3 bg-black rounded-2xl border-2 border-[#10B981]">
            <div className="w-4 h-4 bg-[#10B981] rounded-full animate-pulse shadow-[0_0_15px_#10B981]" />
            <span className="text-xs md:text-sm font-black tracking-widest uppercase text-white">Sistema Online</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-[#000000] py-6 md:py-10">
        <main className="w-full px-4 md:px-10 mx-auto">
          <AnimatePresence mode="wait">
            {currentModule === 'home' && (
              <HomeDashboardView 
                key="home" 
                onNavigate={(mod) => {
                  setCurrentModule(mod as any);
                  if (mod === 'maestros') setActiveTab('crops');
                  if (mod === 'campo') setActiveTab('fincas');
                  if (mod === 'planta') setActiveTab('recepcion');
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
              />
            )}
            {currentModule === 'campo' && activeTab === 'fincas' && (
              <FarmManagementView 
                key="fincas" 
                farms={farms} 
                contacts={contacts}
                onAddFarm={handleAddFarm} 
                onDeleteFarm={handleDeleteFarm} 
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
              />
            )}
            {currentModule === 'campo' && activeTab === 'cura' && (
              <CureManagementView 
                key="cura"
                lots={lots}
                chemicals={chemicals}
                contacts={contacts}
                onAddCureRecord={handleAddCureRecord}
              />
            )}
            {currentModule === 'campo' && activeTab === 'control-siembra' && (
              <SiembraControlView 
                key="control-siembra"
                sowingProjects={sowingProjects}
                lots={lots}
                receptions={receptions}
                contacts={contacts}
                onAddProject={handleAddProject}
                onAddActivity={handleAddActivity}
                onAddSowingRecord={handleAddSowingRecord}
                onGenerateDispatch={handleGenerateDispatch}
              />
            )}
            {currentModule === 'planta' && activeTab === 'recepcion' && (
              <MaterialReceptionView 
                key="recepcion"
                receptions={receptions}
                crops={crops}
                lots={lots}
                farms={farms}
                onAddReception={handleAddReception}
              />
            )}
            {currentModule === 'planta' && activeTab === 'despacho' && (
              <DispatchManagementView 
                key="despacho"
                dispatches={dispatches}
                lots={lots}
                farms={farms}
                onReceiveDispatch={handleReceiveDispatch}
              />
            )}
            {currentModule === 'planta' && activeTab === 'silos' && (
              <SiloManagementView 
                key="silos"
                silos={silos}
                crops={crops}
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
              />
            )}
            {currentModule === 'calidad' && activeTab === 'cuarentena' && (
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
