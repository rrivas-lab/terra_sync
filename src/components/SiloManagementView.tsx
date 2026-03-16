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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-black p-10 rounded-[3rem] border-2 border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.02)]">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-[#3B82F6] text-black rounded-3xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                  <Database size={40} />
                </div>
                <div>
                  <h2 className="text-4xl font-black tracking-tighter uppercase leading-none text-white">Gestión de Silos</h2>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-white/40 font-black uppercase text-[10px] tracking-widest">Página</span>
                    <span className="text-[#3B82F6] font-black text-xs uppercase tracking-widest">{currentPage} de {totalPages}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={24} />
                  <input 
                    type="text" 
                    placeholder="BUSCAR SILO..." 
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="industrial-input w-full h-16 pl-16 pr-6 bg-black rounded-2xl border-2 border-white/20 focus:border-[#3B82F6] font-black text-white outline-none transition-all uppercase text-xs tracking-widest placeholder:text-white/20"
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedSilos.map(silo => {
                const fillPercentage = (silo.currentLevel / silo.capacity) * 100;
                return (
                  <button
                    key={silo.id}
                    onClick={() => setSelectedSiloId(silo.id)}
                    className={`p-10 rounded-[3rem] border-2 transition-all text-left flex flex-col gap-8 bg-[#3B82F6] text-white border-transparent hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(59,130,246,0.2)] group relative overflow-hidden h-[360px]`}
                  >
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform text-black">
                      <Database size={160} />
                    </div>
                    <div className="flex justify-between items-start w-full z-10">
                      <div className="p-5 rounded-2xl bg-black/20 text-white backdrop-blur-md border-2 border-white/10">
                        <Database size={32} />
                      </div>
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest bg-black/20 text-white border-2 border-white/10 backdrop-blur-md`}>
                        {fillPercentage.toFixed(1)}% LLENO
                      </span>
                    </div>
                    <div className="z-10 mt-auto">
                      <h4 className="font-black text-4xl mb-2 tracking-tighter uppercase leading-none">{silo.name}</h4>
                      <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">
                        {crops.find(c => c.id === silo.cropId)?.name || 'SIN RUBRO'}
                      </p>
                    </div>
                    
                    <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden border border-white/10 z-10">
                      <div 
                        className="bg-white h-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.8)]" 
                        style={{ width: `${fillPercentage}%` }}
                      />
                    </div>
                  </button>
                );
              })}
              {paginatedSilos.length === 0 && (
                <div className="col-span-full py-32 flex flex-col items-center justify-center bg-black rounded-[3rem] border-2 border-white/10 border-dashed">
                  <Database size={64} className="mb-6 text-white/20" />
                  <p className="font-black text-xs text-white/40 uppercase tracking-[0.3em]">No se encontraron silos</p>
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
            <div className="flex justify-between items-center bg-black p-10 rounded-[3rem] border-2 border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.02)]">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setSelectedSiloId(null)}
                  className="w-20 h-20 bg-black text-white rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors border-2 border-white/20"
                >
                  <ArrowLeft size={40} />
                </button>
                <div>
                  <h2 className="text-4xl font-black tracking-tighter uppercase leading-none text-white">{selectedSilo?.name}</h2>
                  <p className="text-white/40 font-black uppercase text-[10px] tracking-widest mt-3">Detalles del Silo</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 flex flex-col gap-8">
                <div className="bg-black rounded-[3rem] border-2 border-[#3B82F6] shadow-[0_0_40px_rgba(59,130,246,0.1)] p-10 flex flex-col items-center text-center">
                  <div className="relative w-48 h-64 bg-white/5 rounded-[3rem] overflow-hidden mb-10 border-4 border-white/10 shadow-inner">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-[#3B82F6] transition-all duration-1000 shadow-[0_-10px_30px_rgba(59,130,246,0.5)]"
                      style={{ height: `${(selectedSilo!.currentLevel / selectedSilo!.capacity) * 100}%` }}
                    >
                      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
                    </div>
                  </div>
                  <h3 className="text-5xl font-black font-mono mb-3 text-white tracking-tighter">{selectedSilo?.currentLevel.toLocaleString()} <span className="text-2xl text-white/40">KG</span></h3>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                    DE {selectedSilo?.capacity.toLocaleString()} KG CAPACIDAD
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2 flex flex-col gap-8">
                <div className="bg-black rounded-[3rem] border-2 border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.02)] p-10">
                  <h3 className="text-2xl font-black mb-10 text-white uppercase tracking-tighter">Información del Material</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 bg-white/5 rounded-[2.5rem] flex items-center gap-6 border-2 border-white/10">
                      <div className="p-5 bg-white/10 rounded-2xl text-[#3B82F6] border border-[#3B82F6]/30">
                        {selectedCrop?.icon || <Droplets size={32} />}
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">Rubro Almacenado</span>
                        <span className="text-2xl font-black text-white uppercase tracking-tight">{selectedCrop?.name || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="p-8 bg-white/5 rounded-[2.5rem] flex items-center gap-6 border-2 border-white/10">
                      <div className="p-5 bg-white/10 rounded-2xl text-amber-500 border border-amber-500/30">
                        <TrendingUp size={32} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">Brix Promedio</span>
                        <span className="text-2xl font-black text-white uppercase tracking-tight">{selectedSilo?.averageBrix.toFixed(1)} °BX</span>
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
