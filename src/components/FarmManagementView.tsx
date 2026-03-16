import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Home, MapPin, User, Search, ChevronLeft, ChevronRight, ArrowLeft, Save } from 'lucide-react';
import { Farm, Contact } from '../types';

export const FarmManagementView = ({
  farms,
  contacts,
  onAddFarm,
  onDeleteFarm
}: {
  farms: Farm[];
  contacts: Contact[];
  onAddFarm: (farm: Partial<Farm>) => void;
  onDeleteFarm: (id: string) => void;
  key?: React.Key;
}) => {
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editFarm, setEditFarm] = useState<Partial<Farm>>({});
  const [newFarm, setNewFarm] = useState<Partial<Farm>>({
    name: '',
    location: '',
    adminId: '',
    totalHectares: 0,
    unitSystem: 'METRICO'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredFarms = useMemo(() => {
    return farms.filter(f => 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [farms, searchTerm]);

  const totalPages = Math.ceil(filteredFarms.length / itemsPerPage) || 1;
  const paginatedFarms = filteredFarms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const selectedFarm = farms.find(f => f.id === selectedFarmId);

  // Dirty state detection
  const isDirty = useMemo(() => {
    if (isAdding) return newFarm.name !== '' || newFarm.location !== '' || newFarm.adminId !== '' || newFarm.totalHectares !== 0;
    if (selectedFarm) {
      return editFarm.name !== selectedFarm.name || 
             editFarm.location !== selectedFarm.location || 
             editFarm.adminId !== selectedFarm.adminId || 
             editFarm.totalHectares !== selectedFarm.totalHectares;
    }
    return false;
  }, [isAdding, newFarm, selectedFarm, editFarm]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
          if (isAdding) {
            setNewFarm(prev => ({ ...prev, location: loc }));
          } else {
            setEditFarm(prev => ({ ...prev, location: loc }));
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  if (selectedFarm || isAdding) {
    const isEditing = !!selectedFarm;
    const farmData = isEditing ? editFarm : newFarm;
    const setFarmData = isEditing ? setEditFarm : setNewFarm;

    // Initialize edit state when selecting a farm
    if (isEditing && Object.keys(editFarm).length === 0) {
      setEditFarm({ ...selectedFarm });
    }

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-8 min-h-[80vh]">
        <div className="flex justify-between items-center bg-black p-8 rounded-[3rem] border-2 border-white/10">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => { setSelectedFarmId(null); setIsAdding(false); setEditFarm({}); }}
              className="w-16 h-16 bg-white/5 text-white rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors border-2 border-white/10"
            >
              <ArrowLeft size={32} />
            </button>
            <div>
              <h2 className="text-4xl font-black tracking-tighter uppercase text-white">{isEditing ? selectedFarm.name : 'Nueva Finca'}</h2>
              <p className="text-[#4ADE80] font-black uppercase text-lg tracking-widest mt-2">Configuración de Activo</p>
            </div>
          </div>

          {isDirty && (
            <button 
              onClick={() => {
                if (isAdding) {
                  onAddFarm(newFarm);
                  setIsAdding(false);
                  setNewFarm({ name: '', location: '', adminId: '', totalHectares: 0, unitSystem: 'METRICO' });
                } else {
                  onAddFarm({ ...editFarm, id: selectedFarm.id });
                  setSelectedFarmId(null);
                  setEditFarm({});
                }
              }}
              className="flex items-center gap-3 px-10 py-5 bg-[#3B82F6] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            >
              <Save size={20} /> Guardar Cambios
            </button>
          )}
        </div>

        <div className="bg-black rounded-[3rem] border-2 border-white/10 p-12 flex flex-col gap-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col gap-4">
              <label className="text-lg font-black text-white uppercase tracking-widest">Nombre de la Finca</label>
              <input 
                type="text" 
                value={farmData.name || ''} 
                onChange={e => setFarmData({ ...farmData, name: e.target.value })} 
                className="industrial-input w-full h-20 px-8 bg-black rounded-2xl border-2 border-white/20 focus:border-[#3B82F6] font-black text-2xl outline-none transition-all text-white placeholder:text-white/10 uppercase" 
                placeholder="EJ. HACIENDA EL SOL"
              />
            </div>
            <div className="flex flex-col gap-4">
              <label className="text-lg font-black text-white uppercase tracking-widest">Ubicación GPS</label>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={farmData.location || ''} 
                  onChange={e => setFarmData({ ...farmData, location: e.target.value })} 
                  className="industrial-input flex-1 h-20 px-8 bg-black rounded-2xl border-2 border-white/20 focus:border-[#3B82F6] font-black text-2xl outline-none transition-all text-white placeholder:text-white/10 uppercase" 
                  placeholder="COORDENADAS O DIRECCIÓN"
                />
                <button onClick={handleGetLocation} className="w-20 h-20 bg-white/5 rounded-2xl border-2 border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center text-[#3B82F6]">
                  <MapPin size={32} />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <label className="text-lg font-black text-white uppercase tracking-widest">Administrador Responsable</label>
              <select 
                value={farmData.adminId || ''} 
                onChange={e => setFarmData({ ...farmData, adminId: e.target.value })} 
                className="industrial-input w-full h-20 px-8 bg-black rounded-2xl border-2 border-white/20 focus:border-[#3B82F6] font-black text-xl outline-none transition-all text-white appearance-none uppercase"
              >
                <option value="" className="bg-black">SELECCIONE UN ADMINISTRADOR</option>
                {contacts.filter(c => c.role === 'Administrador').map(c => (
                  <option key={c.id} value={c.id} className="bg-black uppercase">{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-4">
              <label className="text-lg font-black text-white uppercase tracking-widest">Superficie Total (Ha)</label>
              <input 
                type="number" 
                value={farmData.totalHectares || ''} 
                onChange={e => setFarmData({ ...farmData, totalHectares: parseFloat(e.target.value) || 0 })} 
                className="industrial-input w-full h-20 px-8 bg-black rounded-2xl border-2 border-white/20 focus:border-[#3B82F6] font-black text-2xl outline-none transition-all text-white placeholder:text-white/10 uppercase" 
                placeholder="0.00"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-start mt-10 pt-10 border-t-2 border-white/10">
              <button 
                onClick={() => {
                  if (confirm('¿Está seguro de eliminar esta finca?')) {
                    onDeleteFarm(selectedFarm.id);
                    setSelectedFarmId(null);
                  }
                }}
                className="px-10 py-5 bg-red-500/10 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border-2 border-red-500/20 hover:border-red-500"
              >
                Eliminar Activo
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-black p-10 rounded-[3rem] border-2 border-white/10">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 bg-[#10B981] text-black rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <Home size={40} />
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tighter uppercase leading-none text-white">Gestión de Fincas</h2>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className="px-3 py-1 bg-white/10 rounded-lg text-lg font-black uppercase tracking-widest text-white">
                Página {currentPage} de {totalPages}
              </span>
              <span className="w-1.5 h-1.5 bg-white/20 rounded-full hidden sm:block" />
              <span className="text-lg font-black uppercase tracking-widest text-[#4ADE80]">
                {filteredFarms.length} Activos Registrados
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={24} />
            <input 
              type="text" 
              placeholder="BUSCAR FINCA..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="industrial-input w-full h-16 pl-16 pr-6 bg-black rounded-2xl border-2 border-white/20 focus:border-[#10B981] font-black text-sm uppercase tracking-widest outline-none transition-all text-white placeholder:text-white/20"
            />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-16 h-16 rounded-2xl bg-white/5 border-2 border-white/10 flex items-center justify-center disabled:opacity-10 hover:bg-white/10 transition-colors text-white"
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-16 h-16 rounded-2xl bg-white/5 border-2 border-white/10 flex items-center justify-center disabled:opacity-10 hover:bg-white/10 transition-colors text-white"
            >
              <ChevronRight size={28} />
            </button>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-3 h-16 px-10 bg-[#10B981] text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          >
            <Plus size={24} /> Nueva Finca
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {paginatedFarms.length === 0 ? (
          <div className="col-span-full text-center py-32 bg-black rounded-[3rem] border-2 border-white/10 border-dashed">
            <p className="text-white font-black uppercase tracking-[0.3em] text-lg">No se encontraron activos</p>
          </div>
        ) : (
          paginatedFarms.map(farm => {
            const admin = contacts.find(c => c.id === farm.adminId);
            return (
              <button
                key={farm.id}
                onClick={() => setSelectedFarmId(farm.id)}
                className="p-10 rounded-[3rem] text-left transition-all flex flex-col gap-6 bg-[#4ADE80] text-black hover:-translate-y-2 active:scale-95 shadow-[0_0_30px_rgba(74,222,128,0.2)] group relative overflow-hidden min-h-[320px]"
              >
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
                  <Home size={120} />
                </div>
                
                <div className="flex justify-between items-start w-full z-10">
                  <div className="p-4 rounded-2xl bg-black/10 backdrop-blur-md">
                    <Home size={28} />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                    <ChevronRight size={24} />
                  </div>
                </div>

                <div className="z-10 mt-auto flex flex-col gap-4">
                  <h3 className="font-black text-4xl tracking-tighter leading-none">{farm.name}</h3>
                  <div className="flex flex-col gap-3">
                    <div className="px-3 py-2 bg-black/5 rounded-lg text-lg font-black uppercase tracking-widest flex items-center gap-2">
                      <MapPin size={16} className="shrink-0" /> <span className="truncate">{farm.location}</span>
                    </div>
                    <div className="px-3 py-2 bg-black/5 rounded-lg text-lg font-black uppercase tracking-widest flex items-center gap-2">
                      <User size={16} className="shrink-0" /> <span className="truncate">{admin?.name || 'SIN ASIGNAR'}</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/10" />
                <div className="absolute bottom-0 left-0 h-2 bg-black transition-all duration-500" style={{ width: '100%' }} />
              </button>
            );
          })
        )}
      </div>
    </motion.div>
  );
};
