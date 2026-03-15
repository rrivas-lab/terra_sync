import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, ArrowLeft, Droplets, TrendingUp, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Silo, Crop } from '../types';

export const SiloManagementView = ({ 
  silos, 
  crops 
}: { 
  silos: Silo[], 
  crops: Crop[],
  key?: React.Key
}) => {
  const [selectedSiloId, setSelectedSiloId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredSilos = useMemo(() => {
    return silos.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crops.find(c => c.id === s.cropId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [silos, searchTerm, crops]);

  const totalPages = Math.ceil(filteredSilos.length / itemsPerPage) || 1;
  const paginatedSilos = filteredSilos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const selectedSilo = silos.find(s => s.id === selectedSiloId);
  const selectedCrop = crops.find(c => c.id === selectedSilo?.cropId);

  return (
    <div className="flex flex-col gap-8 h-full">
      <AnimatePresence mode="wait">
        {!selectedSiloId ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[3rem] shadow-xl shadow-black/5 border border-black/5">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-100 text-[#0052CC] rounded-2xl flex items-center justify-center shadow-inner">
                  <Database size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight uppercase">Gestión de Silos</h2>
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
                    placeholder="Buscar silo..." 
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
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedSilos.map(silo => {
                const fillPercentage = (silo.currentLevel / silo.capacity) * 100;
                return (
                  <button
                    key={silo.id}
                    onClick={() => setSelectedSiloId(silo.id)}
                    className={`p-8 rounded-[2rem] border-2 transition-all text-left flex flex-col gap-6 bg-[#0052CC] text-white border-transparent hover:scale-[1.02] active:scale-[0.98] shadow-xl group`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <div className="p-4 rounded-2xl bg-white/20 text-white">
                        <Database size={32} />
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest bg-white/20 text-white`}>
                        {fillPercentage.toFixed(1)}% LLENO
                      </span>
                    </div>
                    <div>
                      <h4 className="font-black text-3xl mb-1 tracking-tight">{silo.name}</h4>
                      <p className="text-xs font-black text-white/80 uppercase tracking-widest">
                        {crops.find(c => c.id === silo.cropId)?.name || 'Sin Rubro'}
                      </p>
                    </div>
                    
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-white h-full transition-all duration-1000" 
                        style={{ width: `${fillPercentage}%` }}
                      />
                    </div>
                  </button>
                );
              })}
              {paginatedSilos.length === 0 && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-black/20">
                  <Database size={64} className="mb-4" />
                  <p className="font-bold text-xl">No se encontraron silos</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-8 h-full"
          >
            <div className="flex justify-between items-center bg-white p-8 rounded-[3rem] shadow-xl shadow-black/5 border border-black/5">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setSelectedSiloId(null)}
                  className="w-16 h-16 bg-black/5 text-black/60 rounded-2xl flex items-center justify-center hover:bg-black/10 transition-colors"
                >
                  <ArrowLeft size={32} />
                </button>
                <div>
                  <h2 className="text-3xl font-black tracking-tight">{selectedSilo?.name}</h2>
                  <p className="text-black/40 font-black uppercase text-[10px] tracking-widest mt-1">Detalles del Silo</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="bg-white rounded-[3rem] border border-black/5 shadow-xl p-10 flex flex-col items-center text-center">
                  <div className="relative w-48 h-64 bg-black/5 rounded-[3rem] overflow-hidden mb-8 border-4 border-white shadow-inner">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-[#0052CC] transition-all duration-1000"
                      style={{ height: `${(selectedSilo!.currentLevel / selectedSilo!.capacity) * 100}%` }}
                    >
                      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
                    </div>
                  </div>
                  <h3 className="text-4xl font-black font-mono mb-2">{selectedSilo?.currentLevel.toLocaleString()} <span className="text-xl text-black/40">Kg</span></h3>
                  <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">
                    de {selectedSilo?.capacity.toLocaleString()} Kg Capacidad
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-white rounded-[3rem] border border-black/5 shadow-xl p-10">
                  <h3 className="text-xl font-black mb-8">Información del Material</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-black/5 rounded-[2rem] flex items-center gap-6">
                      <div className="p-4 bg-white rounded-2xl shadow-sm text-[#0052CC]">
                        {selectedCrop?.icon || <Droplets size={24} />}
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-black/40 uppercase tracking-widest block mb-1">Rubro Almacenado</span>
                        <span className="text-xl font-black">{selectedCrop?.name || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="p-6 bg-black/5 rounded-[2rem] flex items-center gap-6">
                      <div className="p-4 bg-white rounded-2xl shadow-sm text-amber-500">
                        <TrendingUp size={24} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-black/40 uppercase tracking-widest block mb-1">Brix Promedio</span>
                        <span className="text-xl font-black">{selectedSilo?.averageBrix.toFixed(1)} °Bx</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
