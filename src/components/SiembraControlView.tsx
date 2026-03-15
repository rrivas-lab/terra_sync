import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Calendar, List, AlertCircle, CheckCircle2, ChevronRight, Sprout, Clock, ArrowLeft, Search, ChevronLeft, Package, Truck, ClipboardCheck } from 'lucide-react';
import { SowingProject, Lot, ActivityLog, MaterialReception, Contact, SowingRecord } from '../types';

const Stepper = ({ value, onChange, min = 0, max = 100, step = 1, label }: any) => (
  <div className="flex flex-col gap-2">
    <span className="text-[10px] font-black text-black/40 uppercase tracking-widest">{label}</span>
    <div className="flex items-center gap-4 bg-black/5 p-2 rounded-2xl">
      <button onClick={() => onChange(Math.max(min, value - step))} className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black shadow-sm text-[#0052CC] hover:scale-105 active:scale-95 transition-all">-</button>
      <div className="flex-1 text-center font-black text-xl text-black">{typeof value === 'number' ? value.toFixed(step < 1 ? 1 : 0) : value}</div>
      <button onClick={() => onChange(Math.min(max, value + step))} className="w-12 h-12 bg-[#0052CC] rounded-xl flex items-center justify-center font-black shadow-sm text-white hover:scale-105 active:scale-95 transition-all">+</button>
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
  onAddSowingRecord: (record: Partial<SowingRecord>) => void;
  onGenerateDispatch: (lotId: string, quantity: number) => void;
  key?: React.Key;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({ name: '', lotIds: [] as string[], startDate: new Date().toISOString().split('T')[0] });
  const [newActivity, setNewActivity] = useState({ description: '', date: new Date().toISOString().split('T')[0], consumedReceptionId: '', consumedQuantity: 0 });
  
  const [newSowing, setNewSowing] = useState<Partial<SowingRecord>>({
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
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8">
        <div className="flex justify-between items-center bg-white p-8 rounded-[3rem] shadow-xl shadow-black/5 border border-black/5">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => {
                setSelectedProjectId(null);
                setActivitySearchTerm('');
                setActivityCurrentPage(1);
              }}
              className="w-16 h-16 bg-black/5 text-black/60 rounded-2xl flex items-center justify-center hover:bg-black/10 transition-colors"
            >
              <ArrowLeft size={32} />
            </button>
            <div>
              <h2 className="text-3xl font-black tracking-tight uppercase">{selectedProject.name}</h2>
              <p className="text-black/40 font-bold uppercase text-[10px] tracking-widest mt-1">Motor de Gestión de Proyecto</p>
            </div>
          </div>
          <div className="px-6 py-3 bg-[#10B981] text-white rounded-2xl font-black tracking-widest shadow-lg shadow-emerald-100">
            {selectedProject.status}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: History and Activities */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="bg-white rounded-[3rem] shadow-xl shadow-black/5 border border-black/5 p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-6 border-b border-black/5 pb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight uppercase">Historial de Actividades</h3>
                    <p className="text-black/40 font-bold uppercase text-[10px] tracking-widest mt-1">Registro cronológico completo</p>
                  </div>
                  <button 
                    onClick={() => setIsActivityModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0052CC] text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Plus size={20} /> Registrar
                  </button>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" size={18} />
                    <input 
                      type="text" 
                      placeholder="Buscar actividad..." 
                      value={activitySearchTerm}
                      onChange={(e) => { setActivitySearchTerm(e.target.value); setActivityCurrentPage(1); }}
                      className="w-full h-12 pl-12 pr-4 bg-black/5 rounded-xl border-none focus:ring-2 focus:ring-[#0052CC] font-bold outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-3 bg-black/5 p-1 rounded-xl">
                    <button 
                      onClick={() => setActivityCurrentPage(p => Math.max(1, p - 1))}
                      disabled={activityCurrentPage === 1}
                      className="w-10 h-10 rounded-lg bg-white flex items-center justify-center disabled:opacity-30 shadow-sm transition-all active:scale-90"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2">
                      {activityCurrentPage} de {totalActivityPages}
                    </span>
                    <button 
                      onClick={() => setActivityCurrentPage(p => Math.min(totalActivityPages, p + 1))}
                      disabled={activityCurrentPage === totalActivityPages}
                      className="w-10 h-10 rounded-lg bg-white flex items-center justify-center disabled:opacity-30 shadow-sm transition-all active:scale-90"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 min-h-[400px]">
                {paginatedActivities.length === 0 ? (
                  <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
                    <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center text-black/20">
                      <Clock size={40} />
                    </div>
                    <p className="text-black/40 font-bold uppercase text-xs tracking-widest">No se encontraron actividades</p>
                  </div>
                ) : (
                  paginatedActivities.map(log => (
                    <div key={log.id} className="p-6 bg-black/5 rounded-[2rem] border border-black/5 flex flex-col gap-4 hover:bg-black/[0.07] transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white rounded-2xl shadow-sm">
                            <Clock size={20} className="text-[#0052CC]" />
                          </div>
                          <div>
                            <span className="text-lg font-black block tracking-tight">{log.description}</span>
                            <div className="flex flex-wrap items-center gap-3 mt-1">
                              <span className="text-[10px] font-black text-black/40 uppercase tracking-widest flex items-center gap-1">
                                <Calendar size={10} /> {new Date(log.date).toLocaleDateString()}
                              </span>
                              {log.consumedReceptionId && (
                                <span className="text-[10px] font-black text-[#0052CC] uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                                  Consumo: {log.consumedQuantity} Kg
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
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Sowing Parameters */}
            <div className="bg-white rounded-[3rem] shadow-xl shadow-black/5 border border-black/5 p-8 flex flex-col gap-6">
              <div className="flex items-center gap-4 border-b border-black/5 pb-6">
                <div className="p-3 bg-emerald-100 text-[#10B981] rounded-xl">
                  <ClipboardCheck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight uppercase">Parámetros de Siembra</h3>
                  <p className="text-black/40 font-bold uppercase text-[10px] tracking-widest">Control de densidad</p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-black/40 uppercase tracking-widest">Fecha de Siembra</span>
                  <input 
                    type="date" 
                    value={newSowing.date}
                    onChange={e => setNewSowing(prev => ({ ...prev, date: e.target.value }))}
                    className="h-14 px-6 bg-black/5 rounded-2xl font-black text-lg outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
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

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-black/40 uppercase tracking-widest">Responsable</span>
                  <select 
                    value={newSowing.responsibleId}
                    onChange={e => setNewSowing(prev => ({ ...prev, responsibleId: e.target.value }))}
                    className="h-14 px-6 bg-black/5 rounded-2xl font-black appearance-none outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
                  >
                    {contacts.filter(c => c.role === 'Operador' || c.role === 'Administrador').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={() => {
                    if (projectLots.length === 0) return alert('No hay lotes en este proyecto');
                    onAddSowingRecord({ ...newSowing, lotId: projectLots[0].id });
                  }}
                  className="h-16 bg-[#10B981] text-white font-black rounded-2xl shadow-lg shadow-emerald-100 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-sm"
                >
                  Registrar Siembra
                </button>
              </div>
            </div>

            {/* Dispatch Section */}
            <div className="bg-[#0052CC] rounded-[3rem] shadow-xl shadow-black/5 p-8 flex flex-col gap-6 text-white">
              <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                <div className="p-3 bg-white/10 text-white rounded-xl">
                  <Truck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight uppercase">Despacho a Planta</h3>
                  <p className="text-white/40 font-bold uppercase text-[10px] tracking-widest">Generación de Romanero</p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <Stepper 
                  label="Cantidad (Kg)"
                  value={dispatchQty}
                  onChange={setDispatchQty}
                  min={100}
                  max={50000}
                  step={100}
                />

                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-3">
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Trazabilidad de Lotes</span>
                  {projectLots.map(lot => {
                    const isApproved = lot.analyses?.some(a => a.status === 'APROBADO');
                    return (
                      <div key={lot.id} className="flex justify-between items-center">
                        <span className="font-bold text-sm">{lot.lotCode}</span>
                        <span className={`text-[10px] font-black px-2 py-1 rounded ${isApproved ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-red-500/20 text-red-400'}`}>
                          {isApproved ? 'APROBADO' : 'SIN CALIDAD'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button 
                  disabled={!projectLots.some(l => l.analyses?.some(a => a.status === 'APROBADO'))}
                  onClick={() => {
                    const approvedLot = projectLots.find(l => l.analyses?.some(a => a.status === 'APROBADO'));
                    if (approvedLot) onGenerateDispatch(approvedLot.id, dispatchQty);
                  }}
                  className={`h-16 font-black rounded-2xl shadow-lg transition-all uppercase tracking-widest text-sm ${
                    projectLots.some(l => l.analyses?.some(a => a.status === 'APROBADO')) 
                      ? 'bg-white text-[#0052CC] hover:scale-[1.02] active:scale-[0.98]' 
                      : 'bg-white/10 text-white/20 cursor-not-allowed'
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsActivityModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl flex flex-col gap-8">
                <div>
                  <h3 className="text-3xl font-black tracking-tight uppercase">Registrar Actividad</h3>
                  <p className="text-black/40 font-bold uppercase text-[10px] tracking-widest mt-1">Consumo de insumos y labores</p>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-black/40 uppercase tracking-widest">Descripción</label>
                    <input type="text" value={newActivity.description} onChange={e => setNewActivity({ ...newActivity, description: e.target.value })} className="h-14 px-6 bg-black/5 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-[#0052CC]" placeholder="Ej: Fertilización foliar" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-black/40 uppercase tracking-widest">Insumo (Opcional)</label>
                    <select value={newActivity.consumedReceptionId} onChange={e => setNewActivity({ ...newActivity, consumedReceptionId: e.target.value })} className="h-14 px-6 bg-black/5 rounded-2xl font-bold outline-none appearance-none">
                      <option value="">Ninguno</option>
                      {receptions.filter(r => (r.bundleCount * r.averageWeight) - (r.usedQuantity || 0) > 0).map(r => (
                        <option key={r.id} value={r.id}>{r.provider} - {r.cropId} (Disp: {(r.bundleCount * r.averageWeight) - (r.usedQuantity || 0)} Kg)</option>
                      ))}
                    </select>
                  </div>

                  {newActivity.consumedReceptionId && (
                    <Stepper label="Cantidad a Consumir (Kg)" value={newActivity.consumedQuantity} onChange={(v: number) => setNewActivity({ ...newActivity, consumedQuantity: v })} min={0} max={10000} step={1} />
                  )}

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-black/40 uppercase tracking-widest">Fecha</label>
                    <input type="date" value={newActivity.date} onChange={e => setNewActivity({ ...newActivity, date: e.target.value })} className="h-14 px-6 bg-black/5 rounded-2xl font-bold outline-none" />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button onClick={() => setIsActivityModalOpen(false)} className="flex-1 h-14 bg-black/5 text-black/60 rounded-2xl font-black uppercase tracking-widest text-xs">Cancelar</button>
                    <button onClick={() => {
                      onAddActivity(selectedProject.id, { description: newActivity.description, date: newActivity.date, machineryIds: [], inputIds: [], laborIds: [] }, newActivity.consumedReceptionId || undefined, newActivity.consumedQuantity || undefined);
                      setIsActivityModalOpen(false);
                      setNewActivity({ description: '', date: new Date().toISOString().split('T')[0], consumedReceptionId: '', consumedQuantity: 0 });
                    }} className="flex-1 h-14 bg-[#0052CC] text-white rounded-2xl font-black shadow-lg shadow-blue-200 uppercase tracking-widest text-xs">Guardar</button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[3rem] shadow-xl shadow-black/5 border border-black/5">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-100 text-[#10B981] rounded-2xl flex items-center justify-center shadow-inner">
            <Sprout size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight uppercase">Proyectos de Siembra</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-black/40 font-bold uppercase text-[10px] tracking-widest">Página</span>
              <span className="text-[#0052CC] font-black text-xs">{currentPage} de {totalPages}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" size={20} />
            <input 
              type="text" 
              placeholder="Buscar proyecto..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full h-14 pl-12 pr-4 bg-black/5 rounded-2xl border-none focus:ring-2 focus:ring-[#0052CC] font-bold outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center disabled:opacity-30 hover:bg-black/10 transition-colors shadow-sm"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center disabled:opacity-30 hover:bg-black/10 transition-colors shadow-sm"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 h-14 px-6 bg-[#0052CC] text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus size={20} /> <span className="hidden md:inline">Nuevo Proyecto</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-xl shadow-black/5 border border-black/5 p-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProjects.length === 0 ? (
            <div className="col-span-full text-center py-20 opacity-50 font-bold">No se encontraron proyectos</div>
          ) : (
            paginatedProjects.map(project => (
              <button
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                className="p-8 rounded-[2rem] text-left transition-all flex flex-col gap-4 bg-[#10B981] text-white border border-transparent hover:scale-[1.02] active:scale-[0.98] shadow-xl group"
              >
                <div className="flex justify-between items-start w-full">
                  <div className="p-4 rounded-2xl bg-white/20 text-white flex items-center justify-center">
                    <Sprout size={24} />
                  </div>
                  <ChevronRight size={24} className="text-white/50 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <div className="font-black text-2xl text-white tracking-tight">{project.name}</div>
                  <div className="text-xs font-black uppercase tracking-widest mt-2 text-white/80 flex items-center gap-2">
                    <Calendar size={14} /> Inicio: {new Date(project.startDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-white">
                    <List size={16} />
                    <span className="text-sm font-black">{project.activityLogs.length} Actividades</span>
                  </div>
                  <div className="text-[10px] font-black tracking-widest px-3 py-1 rounded-lg bg-white/20 text-white uppercase">
                    {project.status}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* New Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl flex flex-col gap-8">
              <div>
                <h3 className="text-3xl font-black tracking-tight uppercase">Nuevo Proyecto</h3>
                <p className="text-black/40 font-bold uppercase text-[10px] tracking-widest mt-1">Configuración inicial de siembra</p>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-black/40 uppercase tracking-widest">Nombre del Proyecto</label>
                  <input type="text" value={newProject.name} onChange={e => setNewProject({ ...newProject, name: e.target.value })} className="h-14 px-6 bg-black/5 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-[#0052CC]" placeholder="Ej: Zafra 2024 - Lote 01" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-black/40 uppercase tracking-widest">Lotes Asociados</label>
                  <div className="grid grid-cols-2 gap-2">
                    {lots.map(lot => (
                      <button
                        key={lot.id}
                        onClick={() => {
                          const lotIds = newProject.lotIds.includes(lot.id)
                            ? newProject.lotIds.filter(id => id !== lot.id)
                            : [...newProject.lotIds, lot.id];
                          setNewProject({ ...newProject, lotIds });
                        }}
                        className={`p-4 rounded-xl font-bold text-sm transition-all border-2 ${
                          newProject.lotIds.includes(lot.id) ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-black/5 border-transparent text-black/40'
                        }`}
                      >
                        {lot.lotCode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-black/40 uppercase tracking-widest">Fecha de Inicio</label>
                  <input type="date" value={newProject.startDate} onChange={e => setNewProject({ ...newProject, startDate: e.target.value })} className="h-14 px-6 bg-black/5 rounded-2xl font-bold outline-none" />
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 h-14 bg-black/5 text-black/60 rounded-2xl font-black uppercase tracking-widest text-xs">Cancelar</button>
                  <button onClick={() => {
                    onAddProject({ name: newProject.name, lotIds: newProject.lotIds, startDate: newProject.startDate, status: 'PREPARACIÓN' });
                    setIsModalOpen(false);
                    setNewProject({ name: '', lotIds: [], startDate: new Date().toISOString().split('T')[0] });
                  }} className="flex-1 h-14 bg-[#0052CC] text-white rounded-2xl font-black shadow-lg shadow-blue-200 uppercase tracking-widest text-xs">Crear Proyecto</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

