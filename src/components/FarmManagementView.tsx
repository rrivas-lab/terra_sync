import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Home, MapPin, User, Search, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
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

  if (selectedFarm || isAdding) {
    const isEditing = !!selectedFarm;
    const farmData = isEditing ? selectedFarm : newFarm;

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8">
        <div className="flex justify-between items-center bg-white p-8 rounded-[3rem] shadow-xl shadow-black/5 border border-black/5">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => { setSelectedFarmId(null); setIsAdding(false); }}
              className="w-16 h-16 bg-black/5 text-black/60 rounded-2xl flex items-center justify-center hover:bg-black/10 transition-colors"
            >
              <ArrowLeft size={32} />
            </button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{isEditing ? farmData.name : 'Nueva Finca'}</h2>
              <p className="text-black/40 font-bold uppercase text-xs tracking-widest mt-1">Detalle de Finca</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-xl shadow-black/5 border border-black/5 p-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-black/40 uppercase tracking-widest">Nombre de la Finca</label>
              <input 
                type="text" 
                value={farmData.name || ''} 
                onChange={e => !isEditing && setNewFarm({ ...newFarm, name: e.target.value })} 
                disabled={isEditing}
                className="w-full h-16 px-6 bg-black/5 rounded-2xl border-none focus:ring-2 focus:ring-[#0052CC] font-black text-lg outline-none transition-all disabled:opacity-70" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-black/40 uppercase tracking-widest">Ubicación</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={farmData.location || ''} 
                  onChange={e => !isEditing && setNewFarm({ ...newFarm, location: e.target.value })} 
                  disabled={isEditing}
                  className="flex-1 h-16 px-6 bg-black/5 rounded-2xl border-none focus:ring-2 focus:ring-[#0052CC] font-black text-lg outline-none transition-all disabled:opacity-70" 
                />
                {!isEditing && (
                  <button onClick={handleGetLocation} className="h-16 px-6 bg-black/5 rounded-2xl hover:bg-black/10 transition-colors flex items-center justify-center text-black/60">
                    <MapPin size={24} />
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-black/40 uppercase tracking-widest">Administrador</label>
              <select 
                value={farmData.adminId || ''} 
                onChange={e => !isEditing && setNewFarm({ ...newFarm, adminId: e.target.value })} 
                disabled={isEditing}
                className="w-full h-16 px-6 bg-black/5 rounded-2xl border-none focus:ring-2 focus:ring-[#0052CC] font-black text-lg outline-none transition-all disabled:opacity-70"
              >
                <option value="">Seleccione un administrador</option>
                {contacts.filter(c => c.role === 'Administrador').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-black/40 uppercase tracking-widest">Hectáreas Totales</label>
              <input 
                type="number" 
                value={farmData.totalHectares || 0} 
                onChange={e => !isEditing && setNewFarm({ ...newFarm, totalHectares: parseFloat(e.target.value) })} 
                disabled={isEditing}
                className="w-full h-16 px-6 bg-black/5 rounded-2xl border-none focus:ring-2 focus:ring-[#0052CC] font-black text-lg outline-none transition-all disabled:opacity-70" 
              />
            </div>
          </div>

          {!isEditing && (
            <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-black/5">
              <button 
                onClick={() => setIsAdding(false)} 
                className="px-8 py-4 rounded-2xl font-bold text-black/50 hover:bg-black/5 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  if (newFarm.name && newFarm.location && newFarm.adminId && newFarm.totalHectares) {
                    onAddFarm(newFarm);
                    setIsAdding(false);
                    setNewFarm({ name: '', location: '', adminId: '', totalHectares: 0, unitSystem: 'METRICO' });
                  }
                }}
                disabled={!newFarm.name || !newFarm.location || !newFarm.adminId || !newFarm.totalHectares}
                className="px-8 py-4 bg-[#0052CC] text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                Guardar Finca
              </button>
            </div>
          )}
          {isEditing && (
            <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-black/5">
              <button 
                onClick={() => {
                  if (window.confirm('¿Está seguro de eliminar esta finca?')) {
                    onDeleteFarm(selectedFarm.id);
                    setSelectedFarmId(null);
                  }
                }}
                className="px-8 py-4 bg-red-100 text-red-700 rounded-2xl font-bold hover:bg-red-200 transition-colors"
              >
                Eliminar Finca
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[3rem] shadow-xl shadow-black/5 border border-black/5">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-100 text-[#10B981] rounded-2xl flex items-center justify-center shadow-inner">
            <Home size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight uppercase">Gestión de Fincas</h2>
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
              placeholder="Buscar finca..." 
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
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-2 h-14 px-6 bg-[#0052CC] text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus size={20} /> <span className="hidden md:inline">Nueva Finca</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-xl shadow-black/5 border border-black/5 p-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedFarms.length === 0 ? (
            <div className="col-span-full text-center py-20 opacity-50 font-bold">No se encontraron fincas</div>
          ) : (
            paginatedFarms.map(farm => {
              const admin = contacts.find(c => c.id === farm.adminId);
              return (
                <button
                  key={farm.id}
                  onClick={() => setSelectedFarmId(farm.id)}
                  className="p-8 rounded-[2rem] text-left transition-all flex flex-col gap-4 bg-[#10B981] text-white border border-transparent hover:scale-[1.02] active:scale-[0.98] shadow-xl group"
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="p-4 rounded-2xl bg-white/20 text-white flex items-center justify-center">
                      <Home size={24} />
                    </div>
                    <ChevronRight size={24} className="text-white/50 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="font-black text-2xl text-white tracking-tight">{farm.name}</div>
                    <div className="text-xs font-black uppercase tracking-widest mt-2 text-white/80 flex items-center gap-2">
                      <MapPin size={14} /> {farm.location}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-white">
                      <User size={16} />
                      <span className="text-sm font-black">{admin?.name || 'Sin asignar'}</span>
                    </div>
                    <div className="text-sm font-black text-white">
                      {farm.totalHectares} Ha
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
};
