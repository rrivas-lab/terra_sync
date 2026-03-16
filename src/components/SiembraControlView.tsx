import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Calendar, List, AlertCircle, CheckCircle2, ChevronRight, Sprout, Clock, ArrowLeft, Search, ChevronLeft, Package, Truck, ClipboardCheck, Minus, X } from 'lucide-react';
import { SowingProject, Lot, ActivityLog, MaterialReception, Contact, SowingRecord } from '../types';

const Stepper = ({ value, onChange, min = 0, max = 100, step = 1, label }: any) => (
  <div className="flex flex-col gap-2">
    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{label}</span>
    <div className="flex items-center gap-4 bg-black p-2 rounded-2xl border-2 border-white/20">
      <button 
        onClick={() => onChange(Math.max(min, value - step))} 
        className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-black border-2 border-white/20 hover:bg-white/10 transition-all"
      >
        <Minus size={20} />
      </button>
      <div className="flex-1 text-center font-black text-2xl text-white">
        {typeof value === 'number' ? value.toFixed(step < 1 ? 1 : 0) : value}
      </div>
      <button 
        onClick={() => onChange(Math.min(max, value + step))} 
        className="w-12 h-12 bg-[#3B82F6] text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all"
      >
        <Plus size={20} />
      </button>
    </div>
  </div>
);

export const SiembraControlView = ({
  sowingProjects,
  lots,
  receptions,
  contacts,
  onAddProject,
  onAddActivity,
  onAddSowingRecord,
  onGenerateDispatch,
}: {
  sowingProjects: SowingProject[];
  lots: Lot[];
  receptions: MaterialReception[];
  contacts: Contact[];
  onAddProject: (project: Omit<SowingProject, 'id' | 'activityLogs'>) => void;
  onAddActivity: (projectId: string, activity: Omit<ActivityLog, 'id'>, consumedReceptionId?: string, consumedQuantity?: number) => void;
  onAddSowingRecord: (record: Partial<SowingRecord>, consumedReceptionId?: string, consumedQuantity?: number) => void;
  onGenerateDispatch: (lotId: string, quantity: number) => void;
  key?: React.Key;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({ name: '', lotIds: [] as string[], startDate: new Date().toISOString().split('T')[0] });
  const [newActivity, setNewActivity] = useState({ description: '', date: new Date().toISOString().split('T')[0], consumedReceptionId: '', consumedQuantity: 0 });
  
  const [newSowing, setNewSowing] = useState<Partial<SowingRecord> & { consumedReceptionId?: string, consumedQuantity?: number }>({
    density: 35000,
    responsibleId: contacts[0]?.id || '',
    date: new Date().toISOString().split('T')[0]
  });
  const [dispatchQty, setDispatchQty] = useState(1000);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activitySearchTerm, setActivitySearchTerm] = useState('');
  const [activityCurrentPage, setActivityCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const activitiesPerPage = 5;

  const filteredProjects = useMemo(() => {
    return sowingProjects.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sowingProjects, searchTerm]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const selectedProject = sowingProjects.find(p => p.id === selectedProjectId);
  const projectLots = lots.filter(l => selectedProject?.lotIds.includes(l.id));

  const filteredActivities = useMemo(() => {
    if (!selectedProject) return [];
    return selectedProject.activityLogs
      .filter(log => log.description.toLowerCase().includes(activitySearchTerm.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedProject, activitySearchTerm]);

  const totalActivityPages = Math.ceil(filteredActivities.length / activitiesPerPage) || 1;
  const paginatedActivities = filteredActivities.slice((activityCurrentPage - 1) * activitiesPerPage, activityCurrentPage * activitiesPerPage);

  if (selectedProject) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-black p-10 rounded-[2rem] border-2 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => {
                setSelectedProjectId(null);
                setActivitySearchTerm('');
                setActivityCurrentPage(1);
              }}
              className="w-16 h-16 md:w-20 md:h-20 shrink-0 bg-black text-white rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors border-2 border-white"
            >
              <ArrowLeft size={32} className="md:w-10 md:h-10" />
            </button>
            <div>
              <h2 className="text-4xl font-black tracking-tighter uppercase leading-none text-white">{selectedProject.name}</h2>
              <p className="text-white/40 font-black uppercase text-[10px] tracking-widest mt-3">Motor de Gestión de Proyecto</p>
            </div>
          </div>
          <div className="px-10 py-4 bg-[#10B981] text-black rounded-2xl font-black tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.4)] uppercase text-xs border-2 border-white/20">
            {selectedProject.status}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: History and Activities */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            <div className="bg-black rounded-[3rem] border-2 border-white/20 p-10 flex flex-col gap-8 shadow-[0_0_30px_rgba(255,255,255,0.02)]">
              <div className="flex flex-col gap-8 border-b border-white/10 pb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div>
                    <h3 className="text-3xl font-black tracking-tighter uppercase text-white">Historial de Actividades</h3>
                    <p className="text-white/40 font-black uppercase text-[10px] tracking-widest mt-2">Registro cronológico completo</p>
                  </div>
                  <button 
                    onClick={() => setIsActivityModalOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-3 h-16 px-10 bg-[#3B82F6] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap border-2 border-white/20"
                  >
                    <Plus size={24} /> <span>Registrar</span>
                  </button>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={24} />
                    <input 
                      type="text" 
                      placeholder="BUSCAR ACTIVIDAD..." 
                      value={activitySearchTerm}
                      onChange={(e) => { setActivitySearchTerm(e.target.value); setActivityCurrentPage(1); }}
                      className="industrial-input w-full h-16 pl-16 pr-6 bg-black rounded-2xl border-2 border-white/20 focus:border-[#3B82F6] font-black text-white outline-none transition-all uppercase text-xs tracking-widest"
                    />
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
                    <button 
                      onClick={() => setActivityCurrentPage(p => Math.max(1, p - 1))}
                      disabled={activityCurrentPage === 1}
                      className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all disabled:opacity-10 text-white"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-widest px-4 text-white/40">
                      {activityCurrentPage} DE {totalActivityPages}
                    </span>
                    <button 
                      onClick={() => setActivityCurrentPage(p => Math.min(totalActivityPages, p + 1))}
                      disabled={activityCurrentPage === totalActivityPages}
                      className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all disabled:opacity-10 text-white"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-6 min-h-[500px]">
                {paginatedActivities.length === 0 ? (
                  <div className="p-20 text-center flex flex-col items-center justify-center gap-6 bg-white/5 rounded-[2.5rem] border-2 border-dashed border-white/10">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-white/10 border-2 border-white/5">
                      <Clock size={48} />
                    </div>
                    <p className="text-white/40 font-black uppercase text-xs tracking-[0.2em]">No se encontraron actividades</p>
                  </div>
                ) : (
                  paginatedActivities.map(log => (
                    <div key={log.id} className="p-8 bg-black rounded-[2.5rem] border-2 border-white/10 flex flex-col gap-6 hover:border-[#3B82F6]/50 transition-all group shadow-[0_0_20px_rgba(255,255,255,0.02)]">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-white/5 rounded-2xl border-2 border-white/10 group-hover:border-[#3B82F6]/30 group-hover:bg-[#3B82F6]/10 flex items-center justify-center transition-all">
                            <Clock size={32} className="text-[#3B82F6]" />
                          </div>
                          <div>
                            <span className="text-2xl font-black block tracking-tight text-white uppercase leading-none">{log.description}</span>
                            <div className="flex flex-wrap items-center gap-4 mt-4">
                              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                                <Calendar size={14} /> {new Date(log.date).toLocaleDateString()}
                              </span>
                              {log.consumedReceptionId && (
                                <span className="text-[10px] font-black text-[#3B82F6] uppercase tracking-widest bg-[#3B82F6]/10 border-2 border-[#3B82F6]/20 px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                                  CONSUMO: {log.consumedQuantity} KG
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Sowing and Dispatch */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            {/* Sowing Parameters */}
            <div className="bg-black rounded-[3rem] border-2 border-[#10B981] p-10 flex flex-col gap-10 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
              <div className="flex items-center gap-6 border-b border-white/10 pb-10">
                <div className="w-16 h-16 bg-[#10B981]/10 text-[#10B981] rounded-2xl border-2 border-[#10B981]/20 flex items-center justify-center">
                  <ClipboardCheck size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tighter uppercase text-white leading-none">Parámetros de Siembra</h3>
                  <p className="text-white/40 font-black uppercase text-[10px] tracking-widest mt-3">Control de densidad</p>
                </div>
              </div>

              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-4">
                  <span className="text-xs font-black text-white/40 uppercase tracking-widest">Fecha de Siembra</span>
                  <input 
                    type="date" 
                    value={newSowing.date}
                    onChange={e => setNewSowing(prev => ({ ...prev, date: e.target.value }))}
                    className="h-20 px-8 bg-black rounded-2xl font-black text-2xl outline-none border-2 border-white/20 focus:border-[#10B981] transition-all text-white"
                  />
                </div>
                
                <Stepper 
                  label="Densidad (Plantas/Ha)"
                  value={newSowing.density || 0}
                  onChange={(v: number) => setNewSowing(prev => ({ ...prev, density: v }))}
                  min={1000}
                  max={100000}
                  step={500}
                />

                <div className="flex flex-col gap-4">
                  <span className="text-xs font-black text-white/40 uppercase tracking-widest">Responsable</span>
                  <div className="relative">
                    <select 
                      value={newSowing.responsibleId}
                      onChange={e => setNewSowing(prev => ({ ...prev, responsibleId: e.target.value }))}
                      className="w-full h-20 px-8 bg-black rounded-2xl font-black text-xl appearance-none outline-none border-2 border-white/20 focus:border-[#10B981] transition-all text-white"
                    >
                      {contacts.filter(c => c.role === 'Operador' || c.role === 'Administrador').map(c => (
                        <option key={c.id} value={c.id} className="bg-black">{c.name}</option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 rotate-90 text-white/20 pointer-events-none" size={24} />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <span className="text-xs font-black text-white/40 uppercase tracking-widest">Material a Consumir (Opcional)</span>
                  <div className="relative">
                    <select 
                      value={newSowing.consumedReceptionId || ''}
                      onChange={e => setNewSowing(prev => ({ ...prev, consumedReceptionId: e.target.value }))}
                      className="w-full h-20 px-8 bg-black rounded-2xl font-black text-xl appearance-none outline-none border-2 border-white/20 focus:border-[#10B981] transition-all text-white"
                    >
                      <option value="" className="bg-black">NO CONSUMIR MATERIAL</option>
                      {receptions.filter(r => r.status === 'APROBADO').map(r => {
                        const available = (r.bundleCount * r.averageWeight) - (r.usedQuantity || 0);
                        return (
                          <option key={r.id} value={r.id} className="bg-black">
                            {r.id} - Disp: {available.toFixed(2)} Kg
                          </option>
                        );
                      })}
                    </select>
                    <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 rotate-90 text-white/20 pointer-events-none" size={24} />
                  </div>
                </div>

                {newSowing.consumedReceptionId && (
                  <Stepper 
                    label="Cantidad a Consumir (Kg)"
                    value={newSowing.consumedQuantity || 0}
                    onChange={(v: number) => setNewSowing(prev => ({ ...prev, consumedQuantity: v }))}
                    min={0}
                    max={100000}
                    step={100}
                  />
                )}

                <button 
                  onClick={() => {
                    if (projectLots.length === 0) return alert('No hay lotes en este proyecto');
                    projectLots.forEach((lot, index) => {
                      if (index === 0) {
                        onAddSowingRecord({ ...newSowing, lotId: lot.id }, newSowing.consumedReceptionId, newSowing.consumedQuantity);
                      } else {
                        onAddSowingRecord({ ...newSowing, lotId: lot.id });
                      }
                    });
                    alert('Siembra registrada para todos los lotes del proyecto');
                  }}
                  className="h-24 bg-[#10B981] text-black font-black rounded-[2rem] shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-lg border-2 border-white/20"
                >
                  Registrar Siembra
                </button>
              </div>
            </div>

            {/* Dispatch Section */}
            <div className="bg-black rounded-[3rem] border-2 border-[#3B82F6] p-10 flex flex-col gap-10 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
              <div className="flex items-center gap-6 border-b border-white/10 pb-10">
                <div className="w-16 h-16 bg-[#3B82F6]/10 text-[#3B82F6] rounded-2xl border-2 border-[#3B82F6]/20 flex items-center justify-center">
                  <Truck size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tighter uppercase text-white leading-none">Despacho a Planta</h3>
                  <p className="text-white/40 font-black uppercase text-[10px] tracking-widest mt-3">Generación de Romanero</p>
                </div>
              </div>

              <div className="flex flex-col gap-10">
                <Stepper 
                  label="Cantidad (Kg)"
                  value={dispatchQty}
                  onChange={setDispatchQty}
                  min={100}
                  max={50000}
                  step={100}
                />

                <div className="p-10 bg-white/5 rounded-[2.5rem] border-2 border-white/10 flex flex-col gap-6">
                  <span className="text-xs font-black text-white/40 uppercase tracking-widest">Trazabilidad de Lotes</span>
                  <div className="flex flex-col gap-4">
                    {projectLots.map(lot => {
                      const isApproved = lot.analyses?.some(a => a.status === 'APROBADO');
                      return (
                        <div key={lot.id} className="flex justify-between items-center bg-black p-6 rounded-2xl border-2 border-white/10 group hover:border-[#3B82F6]/30 transition-all">
                          <span className="font-black text-2xl text-white uppercase tracking-tighter">{lot.lotCode}</span>
                          <span className={`text-[10px] font-black px-6 py-2 rounded-xl border-2 uppercase tracking-widest shadow-lg ${
                            isApproved ? 'bg-[#10B981] text-black border-white/10 shadow-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}>
                            {isApproved ? 'APROBADO' : 'SIN CALIDAD'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button 
                  disabled={!projectLots.some(l => l.analyses?.some(a => a.status === 'APROBADO'))}
                  onClick={() => {
                    const approvedLot = projectLots.find(l => l.analyses?.some(a => a.status === 'APROBADO'));
                    if (approvedLot) onGenerateDispatch(approvedLot.id, dispatchQty);
                  }}
                  className={`h-24 font-black rounded-[2rem] shadow-2xl transition-all uppercase tracking-[0.2em] text-lg border-2 ${
                    projectLots.some(l => l.analyses?.some(a => a.status === 'APROBADO')) 
                      ? 'bg-[#3B82F6] text-white border-white/20 shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]' 
                      : 'bg-white/5 text-white/20 border-white/10 cursor-not-allowed'
                  }`}
                >
                  Generar Despacho
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Modal */}
        <AnimatePresence>
          {isActivityModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                onClick={() => setIsActivityModalOpen(false)} 
                className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} 
                className="relative bg-black w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.1)] flex flex-col border-2 border-white/20"
              >
                <div className="p-10 border-b-2 border-white/10 flex justify-between items-center bg-white/5">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#3B82F6] text-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                      <Plus size={32} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black tracking-tighter uppercase text-white leading-none">Registrar Actividad</h3>
                      <p className="text-white/40 font-black uppercase text-[10px] tracking-widest mt-3">Consumo de insumos y labores</p>
                    </div>
                  </div>
                  <button onClick={() => setIsActivityModalOpen(false)} className="w-16 h-16 rounded-2xl bg-black border-2 border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors text-white">
                    <X size={32} />
                  </button>
                </div>

                <div className="p-12 flex flex-col gap-10 max-h-[70vh] overflow-y-auto">
                  <div className="flex flex-col gap-4">
                    <label className="text-xs font-black text-white/40 uppercase tracking-widest">Descripción</label>
                    <input 
                      type="text" 
                      value={newActivity.description} 
                      onChange={e => setNewActivity({ ...newActivity, description: e.target.value })} 
                      className="industrial-input h-20 px-8 bg-black rounded-2xl font-black text-2xl text-white border-2 border-white/20 focus:border-[#3B82F6] outline-none transition-all uppercase tracking-widest" 
                      placeholder="EJ: FERTILIZACIÓN FOLIAR" 
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <label className="text-xs font-black text-white/40 uppercase tracking-widest">Insumo (Opcional)</label>
                    <div className="relative">
                      <select 
                        value={newActivity.consumedReceptionId} 
                        onChange={e => setNewActivity({ ...newActivity, consumedReceptionId: e.target.value })} 
                        className="industrial-input w-full h-20 px-8 bg-black rounded-2xl font-black text-xl appearance-none outline-none border-2 border-white/20 focus:border-[#3B82F6] transition-all text-white"
                      >
                        <option value="" className="bg-black">NINGUNO</option>
                        {receptions.filter(r => (r.bundleCount * r.averageWeight) - (r.usedQuantity || 0) > 0).map(r => (
                          <option key={r.id} value={r.id} className="bg-black">{r.provider} - {r.cropId} (DISP: {(r.bundleCount * r.averageWeight) - (r.usedQuantity || 0)} KG)</option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 rotate-90 text-white/20 pointer-events-none" size={24} />
                    </div>
                  </div>

                  {newActivity.consumedReceptionId && (
                    <Stepper 
                      label="Cantidad a Consumir (Kg)" 
                      value={newActivity.consumedQuantity} 
                      onChange={(v: number) => setNewActivity({ ...newActivity, consumedQuantity: v })} 
                      min={0} 
                      max={10000} 
                      step={1} 
                    />
                  )}

                  <div className="flex flex-col gap-4">
                    <label className="text-xs font-black text-white/40 uppercase tracking-widest">Fecha</label>
                    <input 
                      type="date" 
                      value={newActivity.date} 
                      onChange={e => setNewActivity({ ...newActivity, date: e.target.value })} 
                      className="industrial-input h-20 px-8 bg-black rounded-2xl font-black text-2xl text-white border-2 border-white/20 focus:border-[#3B82F6] outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="p-10 bg-white/5 border-t-2 border-white/10 flex flex-col md:flex-row gap-6">
                  <button 
                    onClick={() => setIsActivityModalOpen(false)} 
                    className="w-full md:w-auto flex-1 h-20 bg-black text-white/40 rounded-2xl font-black uppercase tracking-widest text-xs border-2 border-white/20 hover:bg-white/10 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => {
                      onAddActivity(selectedProject.id, { description: newActivity.description, date: newActivity.date, machineryIds: [], inputIds: [], laborIds: [] }, newActivity.consumedReceptionId || undefined, newActivity.consumedQuantity || undefined);
                      setIsActivityModalOpen(false);
                      setNewActivity({ description: '', date: new Date().toISOString().split('T')[0], consumedReceptionId: '', consumedQuantity: 0 });
                    }} 
                    className="w-full md:w-auto flex-[2] h-20 bg-[#3B82F6] text-white rounded-2xl font-black shadow-[0_0_30px_rgba(59,130,246,0.4)] uppercase tracking-widest text-xs border-2 border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Guardar Actividad
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col gap-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-black p-10 rounded-[2rem] border-2 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-[#10B981] text-black rounded-3xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <Sprout size={40} />
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tighter uppercase leading-none text-white">Proyectos de Siembra</h2>
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
              placeholder="BUSCAR PROYECTO..." 
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
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-3 h-16 px-10 bg-[#3B82F6] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap border-2 border-white/20"
          >
            <Plus size={24} /> <span>Nuevo Proyecto</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {paginatedProjects.length === 0 ? (
          <div className="col-span-full bg-black border-2 border-dashed border-white/10 rounded-[3rem] py-32 text-center">
            <p className="opacity-20 font-black uppercase tracking-[0.3em] text-xl text-white">No se encontraron proyectos</p>
          </div>
        ) : (
          paginatedProjects.map(project => (
            <button
              key={project.id}
              onClick={() => setSelectedProjectId(project.id)}
              className="p-10 rounded-[3rem] text-left transition-all flex flex-col gap-8 bg-black border-2 border-white/20 hover:border-[#10B981] hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] hover:-translate-y-2 active:scale-95 group relative overflow-hidden h-[360px]"
            >
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform text-white">
                <Sprout size={160} />
              </div>
              <div className="flex justify-between items-start w-full z-10">
                <div className="p-5 rounded-2xl bg-white/5 text-white/40 group-hover:bg-[#10B981]/20 group-hover:text-[#10B981] flex items-center justify-center border-2 border-white/10 group-hover:border-[#10B981]/30 transition-all">
                  <Sprout size={32} />
                </div>
                <ChevronRight size={32} className="text-white/20 group-hover:text-[#10B981] transition-colors" />
              </div>
              <div className="z-10 mt-auto">
                <div className="font-black text-3xl text-white tracking-tighter leading-none uppercase">{project.name}</div>
                <div className="text-[10px] font-black uppercase tracking-widest mt-4 text-white/40 flex items-center gap-2">
                  <Calendar size={14} /> Inicio: {new Date(project.startDate).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center z-10">
                <div className="flex items-center gap-2 text-white/40">
                  <List size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{project.activityLogs.length} Actividades</span>
                </div>
                <div className={`text-[10px] font-black tracking-widest px-4 py-1.5 rounded-lg uppercase shadow-lg ${
                  project.status === 'FINALIZADA' ? 'bg-white/10 text-white/40' : 'bg-[#10B981] text-black shadow-emerald-500/20'
                }`}>
                  {project.status}
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* New Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-black w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.1)] flex flex-col border-2 border-white/20"
            >
              <div className="p-10 border-b-2 border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-[#3B82F6] text-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                    <Plus size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tighter uppercase text-white leading-none">Nuevo Proyecto</h3>
                    <p className="text-white/40 font-black uppercase text-[10px] tracking-widest mt-3">Configuración inicial de siembra</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-16 h-16 rounded-2xl bg-black border-2 border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors text-white">
                  <X size={32} />
                </button>
              </div>

              <div className="p-12 flex flex-col gap-10 max-h-[70vh] overflow-y-auto">
                <div className="flex flex-col gap-4">
                  <label className="text-xs font-black text-white/40 uppercase tracking-widest">Nombre del Proyecto</label>
                  <input 
                    type="text" 
                    value={newProject.name} 
                    onChange={e => setNewProject({ ...newProject, name: e.target.value })} 
                    className="industrial-input h-20 px-8 bg-black rounded-2xl font-black text-2xl text-white border-2 border-white/20 focus:border-[#3B82F6] outline-none transition-all uppercase tracking-widest" 
                    placeholder="EJ: ZAFRA 2024 - LOTE 01" 
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <label className="text-xs font-black text-white/40 uppercase tracking-widest">Lotes Asociados</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {lots.map(lot => (
                      <button
                        key={lot.id}
                        onClick={() => {
                          const lotIds = newProject.lotIds.includes(lot.id)
                            ? newProject.lotIds.filter(id => id !== lot.id)
                            : [...newProject.lotIds, lot.id];
                          setNewProject({ ...newProject, lotIds });
                        }}
                        className={`p-6 rounded-2xl font-black text-xs tracking-widest uppercase transition-all border-2 flex items-center justify-center text-center h-16 ${
                          newProject.lotIds.includes(lot.id) 
                            ? 'bg-[#10B981] text-black border-white/20 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                            : 'bg-black border-white/10 text-white/20 hover:border-white/30'
                        }`}
                      >
                        {lot.lotCode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <label className="text-xs font-black text-white/40 uppercase tracking-widest">Fecha de Inicio</label>
                  <input 
                    type="date" 
                    value={newProject.startDate} 
                    onChange={e => setNewProject({ ...newProject, startDate: e.target.value })} 
                    className="industrial-input h-20 px-8 bg-black rounded-2xl font-black text-2xl text-white border-2 border-white/20 focus:border-[#3B82F6] outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="p-10 bg-white/5 border-t-2 border-white/10 flex flex-col md:flex-row gap-6">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="w-full md:w-auto flex-1 h-20 bg-black text-white/40 rounded-2xl font-black uppercase tracking-widest text-xs border-2 border-white/20 hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    onAddProject({ name: newProject.name, lotIds: newProject.lotIds, startDate: newProject.startDate, status: 'PREPARACIÓN' });
                    setIsModalOpen(false);
                    setNewProject({ name: '', lotIds: [], startDate: new Date().toISOString().split('T')[0] });
                  }} 
                  className="w-full md:w-auto flex-[2] h-20 bg-[#3B82F6] text-white rounded-2xl font-black shadow-[0_0_30px_rgba(59,130,246,0.4)] uppercase tracking-widest text-xs border-2 border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Crear Proyecto
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

