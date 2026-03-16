import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Box, FlaskConical, Search, Plus, ArrowLeft, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Barrel, Crop, Lot, BarrelStatus } from '../types';

// Let's just copy Stepper here to avoid circular dependencies if it's not exported properly.
const Stepper = ({ value, onChange, min = 0, max = 100, step = 1, label }: any) => (
  <div className="flex flex-col gap-2">
    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{label}</span>
    <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
      <button onClick={() => onChange(Math.max(min, value - step))} className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center font-black hover:bg-white/20 transition-all">-</button>
      <div className="flex-1 text-center font-black text-xl text-white">{typeof value === 'number' ? value.toFixed(step < 1 ? 1 : 0) : value}</div>
      <button onClick={() => onChange(Math.min(max, value + step))} className="w-12 h-12 bg-[#3B82F6] rounded-xl flex items-center justify-center font-black shadow-lg shadow-blue-500/20 text-white hover:scale-105 active:scale-95 transition-all">+</button>
    </div>
  </div>
);

const Countdown = ({ date }: { date: string }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  React.useEffect(() => {
    const target = new Date(date).getTime() + (72 * 60 * 60 * 1000);
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [date]);

  if (timeLeft <= 0) return null;

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_#F59E0B]" />
      <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
        Bloqueo de Seguridad: {hours}h {minutes}m {seconds}s
      </span>
    </div>
  );
};

export const QualityManagementView = ({ 
  barrels, 
  crops, 
  lots,
  onUpdateBarrel
}: { 
  barrels: Barrel[], 
  crops: Crop[], 
  lots: Lot[],
  onUpdateBarrel: (barrel: Barrel) => void,
  key?: React.Key
}) => {
  const [selectedBarrelId, setSelectedBarrelId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredBarrels = useMemo(() => {
    return barrels.filter(b => 
      b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crops.find(c => c.id === b.cropId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [barrels, searchTerm, crops]);

  const totalPages = Math.ceil(filteredBarrels.length / itemsPerPage) || 1;
  const paginatedBarrels = filteredBarrels.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const selectedBarrel = barrels.find(b => b.id === selectedBarrelId);
  const selectedCrop = crops.find(c => c.id === selectedBarrel?.cropId);

  const isLocked = useMemo(() => {
    if (!selectedBarrel) return false;
    const target = new Date(selectedBarrel.date).getTime() + (72 * 60 * 60 * 1000);
    return new Date().getTime() < target;
  }, [selectedBarrel]);

  const handleStatusChange = (status: BarrelStatus) => {
    if (selectedBarrel) {
      if (status === 'LIBERADO' && isLocked) return;
      onUpdateBarrel({ ...selectedBarrel, status });
    }
  };

  const handleValueChange = (paramId: string, value: any) => {
    if (selectedBarrel) {
      onUpdateBarrel({
        ...selectedBarrel,
        analysisValues: { ...selectedBarrel.analysisValues, [paramId]: value }
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <AnimatePresence mode="wait">
        {!selectedBarrelId ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-amber-500 text-black rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/20">
                  <Box size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight uppercase">Control de Barriles</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white/20 font-bold uppercase text-[10px] tracking-widest">Página</span>
                    <span className="text-[#F59E0B] font-black text-xs">{currentPage} de {totalPages}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                  <input 
                    type="text" 
                    placeholder="Buscar barril..." 
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full h-14 pl-12 pr-4 bg-white/5 rounded-2xl border border-white/10 focus:border-[#F59E0B] font-bold outline-none transition-all text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center disabled:opacity-30 hover:bg-white/10 transition-colors shadow-sm"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center disabled:opacity-30 hover:bg-white/10 transition-colors shadow-sm"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedBarrels.map(barrel => (
                <button
                  key={barrel.id}
                  onClick={() => setSelectedBarrelId(barrel.id)}
                  className={`p-8 rounded-[2rem] border transition-all text-left flex flex-col gap-6 bg-[#F59E0B] text-black border-transparent hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-amber-500/10 group relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <Box size={120} />
                  </div>
                  <div className="flex justify-between items-start w-full z-10">
                    <div className="p-4 rounded-2xl bg-black/10 text-black">
                      <Box size={32} />
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest bg-black/10 text-black`}>
                      {barrel.status}
                    </span>
                  </div>
                  <div className="z-10 mt-auto">
                    <h4 className="font-black text-3xl mb-1 tracking-tight">{barrel.code}</h4>
                    <p className="text-xs font-black text-black/60 uppercase tracking-widest">
                      {crops.find(c => c.id === barrel.cropId)?.name} • {new Date(barrel.date).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))}
              {paginatedBarrels.length === 0 && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-black/20">
                  <Box size={64} className="mb-4" />
                  <p className="font-bold text-xl">No se encontraron barriles</p>
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
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setSelectedBarrelId(null)}
                  className="w-16 h-16 bg-white/5 text-white rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                >
                  <ArrowLeft size={32} />
                </button>
                <div>
                  <h2 className="text-3xl font-black tracking-tight uppercase">{selectedBarrel?.code}</h2>
                  <p className="text-white/20 font-black uppercase text-[10px] tracking-widest mt-1">Detalles del Activo</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                {selectedBarrel && <Countdown date={selectedBarrel.date} />}
                <div className="flex gap-2">
                  {(['EN ESPERA', 'EN ANÁLISIS', 'LIBERADO', 'RECHAZADO'] as BarrelStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      disabled={s === 'LIBERADO' && isLocked}
                      className={`px-6 py-3 rounded-xl text-xs font-black transition-all border ${
                        selectedBarrel?.status === s 
                          ? 'bg-[#F59E0B] text-black border-transparent shadow-lg shadow-amber-500/20' 
                          : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20 disabled:opacity-20 disabled:cursor-not-allowed'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-[3rem] border border-white/10 p-10 flex-1 overflow-y-auto backdrop-blur-md">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {selectedCrop?.parameters.filter(p => p.category === 'MICROBIOLOGICO').map(param => (
                  <div key={param.id} className="p-8 bg-white/5 rounded-[2rem] border border-white/10 flex flex-col gap-6 hover:bg-white/[0.07] transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{param.name}</span>
                      <span className="text-[10px] font-black px-3 py-1.5 bg-white/10 rounded-lg border border-white/10 text-white/60">{param.unit}</span>
                    </div>
                    
                    {param.type === 'NUMERIC' && (
                      <Stepper 
                        label="Resultado"
                        value={selectedBarrel?.analysisValues[param.id] || 0}
                        onChange={(v: number) => handleValueChange(param.id, v)}
                        min={0}
                        max={1000}
                        step={0.1}
                      />
                    )}

                    {param.type === 'BOOLEAN' && (
                      <div className="flex bg-white/5 p-2 rounded-2xl h-20 border border-white/10">
                        {[true, false].map(v => (
                          <button
                            key={v.toString()}
                            onClick={() => handleValueChange(param.id, v)}
                            className={`flex-1 rounded-xl font-bold transition-all ${selectedBarrel?.analysisValues[param.id] === v ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20' : 'text-white/20 hover:bg-white/5'}`}
                          >
                            {v ? 'POSITIVO' : 'NEGATIVO'}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {selectedCrop?.parameters.filter(p => p.category === 'MICROBIOLOGICO').length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 text-white/10">
                  <FlaskConical size={80} strokeWidth={1} className="mb-6" />
                  <p className="font-bold text-2xl uppercase tracking-tighter">No hay parámetros microbiológicos definidos</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
