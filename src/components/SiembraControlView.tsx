import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Calendar, List, AlertCircle } from 'lucide-react';
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
    <div className="bg-white text-black min-h-screen p-8 border border-black">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold tracking-tighter">Control de Siembra</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-white text-black border border-black font-bold hover:bg-black hover:text-white transition-colors"
        >
          <Plus size={20} /> Nuevo Proyecto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 border border-black p-6">
          <h3 className="text-xl font-bold mb-4">Proyectos</h3>
          <div className="flex flex-col gap-2">
            {sowingProjects.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                className={`p-4 border border-black text-left ${selectedProjectId === p.id ? 'bg-black text-white' : 'bg-white'}`}
              >
                <div className="font-bold">{p.name}</div>
                <div className="text-sm opacity-70">{p.status}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 border border-black p-6">
          {selectedProject ? (
            <>
              <h3 className="text-2xl font-bold mb-6">{selectedProject.name} - Historial de Actividades</h3>
              <div className="flex flex-col gap-4">
                {selectedProject.activityLogs.length === 0 ? (
                  <div className="p-8 border border-black text-center opacity-50">No hay actividades registradas.</div>
                ) : (
                  selectedProject.activityLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(log => (
                    <div key={log.id} className="p-4 border border-black">
                      <div className="flex justify-between font-bold">
                        <span>{log.description}</span>
                        <span className="text-sm">{new Date(log.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="p-12 border border-black text-center opacity-50">Seleccione un proyecto para ver el historial.</div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white border border-black w-full max-w-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Nuevo Proyecto de Siembra</h3>
              <div className="flex flex-col gap-4 mb-6">
                <input type="text" placeholder="Nombre del Proyecto" value={newProject.name} onChange={e => setNewProject({ ...newProject, name: e.target.value })} className="p-4 border border-black" />
                <div className="border border-black p-4">
                  <span className="font-bold mb-2 block">Seleccionar Lotes:</span>
                  {lots.map(lot => (
                    <label key={lot.id} className="flex items-center gap-2 p-2">
                      <input type="checkbox" checked={newProject.lotIds.includes(lot.id)} onChange={e => {
                        const ids = e.target.checked ? [...newProject.lotIds, lot.id] : newProject.lotIds.filter(id => id !== lot.id);
                        setNewProject({ ...newProject, lotIds: ids });
                      }} />
                      {lot.lotCode}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-black">Cancelar</button>
                <button onClick={() => { onAddProject({ ...newProject, status: 'PREPARACIÓN' }); setIsModalOpen(false); }} className="px-6 py-3 bg-black text-white">Crear</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
