import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Calendar, List, AlertCircle, CheckCircle2, ChevronRight, Sprout, Clock } from 'lucide-react';
import { SowingProject, Lot, ActivityLog } from '../types';

export const SiembraControlView = ({
  sowingProjects,
  lots,
  onAddProject,
}: {
  sowingProjects: SowingProject[];
  lots: Lot[];
  onAddProject: (project: Omit<SowingProject, 'id' | 'activityLogs'>) => void;
  key?: React.Key;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(sowingProjects[0]?.id || null);
  const [newProject, setNewProject] = useState({ name: '', lotIds: [] as string[], startDate: new Date().toISOString().split('T')[0] });

  const selectedProject = sowingProjects.find(p => p.id === selectedProjectId);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center bg-white p-8 rounded-[3rem] shadow-xl shadow-black/5 border border-black/5">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center shadow-inner">
            <Sprout size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Control de Siembra</h2>
            <p className="text-black/40 font-bold uppercase text-xs tracking-widest mt-1">Gestión de Proyectos y Actividades</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-4 bg-[#0052CC] text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={20} /> Nuevo Proyecto
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-[3rem] shadow-xl shadow-black/5 border border-black/5 p-8 flex flex-col gap-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <List className="text-[#0052CC]" /> Proyectos Activos
          </h3>
          <div className="flex flex-col gap-3">
            {sowingProjects.length === 0 ? (
              <div className="text-center py-10 opacity-50 font-bold">No hay proyectos</div>
            ) : (
              sowingProjects.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`p-5 rounded-2xl text-left transition-all flex justify-between items-center ${
                    selectedProjectId === p.id 
                      ? 'bg-[#0052CC] text-white shadow-lg shadow-blue-200' 
                      : 'bg-black/5 hover:bg-black/10 text-black'
                  }`}
                >
                  <div>
                    <div className="font-bold text-lg">{p.name}</div>
                    <div className={`text-xs font-bold uppercase tracking-widest mt-1 ${selectedProjectId === p.id ? 'text-white/70' : 'text-black/40'}`}>
                      {p.status}
                    </div>
                  </div>
                  <ChevronRight size={20} className={selectedProjectId === p.id ? 'opacity-100' : 'opacity-30'} />
                </button>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-xl shadow-black/5 border border-black/5 p-8 flex flex-col gap-6">
          {selectedProject ? (
            <>
              <div className="flex justify-between items-center border-b border-black/5 pb-6">
                <div>
                  <h3 className="text-2xl font-bold">{selectedProject.name}</h3>
                  <p className="text-black/40 font-bold uppercase text-xs tracking-widest mt-1">Historial de Actividades</p>
                </div>
                <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-xs font-black tracking-widest border border-emerald-200">
                  {selectedProject.status}
                </div>
              </div>
              
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-2">
                {selectedProject.activityLogs.length === 0 ? (
                  <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
                    <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center text-black/20">
                      <Clock size={40} />
                    </div>
                    <p className="text-black/40 font-bold">No hay actividades registradas en este proyecto.</p>
                  </div>
                ) : (
                  selectedProject.activityLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(log => (
                    <div key={log.id} className="p-6 bg-black/5 rounded-[2rem] border border-black/5 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white rounded-2xl shadow-sm">
                            <Clock size={20} className="text-[#0052CC]" />
                          </div>
                          <div>
                            <span className="text-lg font-black block">{log.description}</span>
                            <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
                              {new Date(log.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-4 h-full">
              <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center text-black/20">
                <List size={40} />
              </div>
              <p className="text-black/40 font-bold">Seleccione un proyecto para ver sus detalles.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden">
              <div className="p-10 border-b border-black/5 flex justify-between items-center bg-white">
                <div>
                  <h3 className="text-3xl font-bold tracking-tight">Nuevo Proyecto</h3>
                  <p className="text-black/40 font-bold uppercase text-xs tracking-widest mt-1">Configurar siembra</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-4 bg-black/5 rounded-2xl hover:bg-black/10 transition-colors"><Plus className="rotate-45" /></button>
              </div>
              
              <div className="p-10 flex flex-col gap-8 overflow-y-auto max-h-[70vh]">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Nombre del Proyecto</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Siembra Primavera 2026" 
                    value={newProject.name} 
                    onChange={e => setNewProject({ ...newProject, name: e.target.value })} 
                    className="w-full h-16 px-6 bg-black/5 rounded-2xl border-none focus:ring-2 focus:ring-[#0052CC] font-bold text-lg outline-none transition-all" 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Seleccionar Lotes</label>
                  <div className="grid grid-cols-2 gap-3">
                    {lots.map(lot => {
                      const isSelected = newProject.lotIds.includes(lot.id);
                      return (
                        <button
                          key={lot.id}
                          onClick={() => {
                            const ids = isSelected 
                              ? newProject.lotIds.filter(id => id !== lot.id)
                              : [...newProject.lotIds, lot.id];
                            setNewProject({ ...newProject, lotIds: ids });
                          }}
                          className={`h-16 px-6 rounded-2xl font-bold border transition-all text-left flex items-center justify-between ${
                            isSelected 
                              ? 'bg-blue-50 border-[#0052CC] text-[#0052CC]' 
                              : 'bg-white border-black/10 text-black/40 hover:border-black/30'
                          }`}
                        >
                          {lot.lotCode}
                          {isSelected && <CheckCircle2 size={20} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-10 border-t border-black/5 bg-black/[0.02] flex justify-end gap-4">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-8 py-4 rounded-2xl font-bold text-black/50 hover:bg-black/5 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => { 
                    if (newProject.name && newProject.lotIds.length > 0) {
                      onAddProject({ ...newProject, status: 'PREPARACIÓN' }); 
                      setIsModalOpen(false); 
                      setNewProject({ name: '', lotIds: [], startDate: new Date().toISOString().split('T')[0] });
                    }
                  }} 
                  disabled={!newProject.name || newProject.lotIds.length === 0}
                  className="px-8 py-4 bg-[#0052CC] text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  Crear Proyecto
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

