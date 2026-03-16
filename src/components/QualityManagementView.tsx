import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Box, FlaskConical, Search, Plus, ArrowLeft, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Barrel, Crop, Lot, BarrelStatus } from '../types';

// Let's just copy Stepper here to avoid circular dependencies if it's not exported properly.
const Stepper = ({ value, onChange, min = 0, max = 100, step = 1, label }: any) => (
  <div className="flex flex-col gap-2">
    <span className="text-[10px] font-black text-white uppercase tracking-widest">{label}</span>
    <div className="flex items-center gap-4 bg-black p-2 rounded-2xl border-2 border-white/20">
      <button 
        onClick={() => onChange(Math.max(min, value - step))} 
        className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center font-black hover:bg-white/20 transition-all border border-white/20"
      >
        -
      </button>
      <div className="flex-1 text-center font-black text-2xl text-white">
        {typeof value === 'number' ? value.toFixed(step < 1 ? 1 : 0) : value}
      </div>
      <button 
        onClick={() => onChange(Math.min(max, value + step))} 
        className="w-12 h-12 bg-[#3B82F6] rounded-xl flex items-center justify-center font-black shadow-[0_0_15px_rgba(59,130,246,0.5)] text-white hover:scale-105 active:scale-95 transition-all border-2 border-white/30"
      >
        +
      </button>
    </div>
  </div>
);

const Countdown = ({ date }: { date: string }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  React.useEffect(() => {
    const target = new Date(date).getTime() + (72 * 60 * 60 * 1000);
    const update = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft(0);
      } else {
        setTimeLeft(diff);
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [date]);

  if (timeLeft <= 0) {
    return (
      <div className="flex items-center gap-3 px-6 py-3 bg-black border-2 border-[#10B981] rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)]">
        <div className="w-3 h-3 bg-[#10B981] rounded-full shadow-[0_0_15px_#10B981]" />
        <span className="text-xs font-black text-[#10B981] uppercase tracking-widest">
          Candado Liberado
        </span>
      </div>
    );
  }

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div className="flex items-center gap-3 px-6 py-3 bg-black border-2 border-amber-500 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.2)]">
      <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-[0_0_15px_#F59E0B]" />
      <span className="text-xs font-black text-amber-500 uppercase tracking-widest">
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

  const [isLocked, setIsLocked] = useState(false);

  React.useEffect(() => {
    if (!selectedBarrel) {
      setIsLocked(false);
      return;
    }
    const target = new Date(selectedBarrel.date).getTime() + (72 * 60 * 60 * 1000);
    const checkLock = () => {
      setIsLocked(new Date().getTime() < target);
    };
    checkLock();
    const interval = setInterval(checkLock, 1000);
    return () => clearInterval(interval);
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
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-black p-10 rounded-[2rem] border-2 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-amber-500 text-black rounded-3xl flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                  <Box size={40} />
                </div>
                <div>
                  <h2 className="text-4xl font-black tracking-tighter uppercase leading-none text-white">Control de Barriles</h2>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-white/40 font-black uppercase text-[10px] tracking-widest">Página</span>
                    <span className="text-amber-500 font-black text-xs uppercase tracking-widest">{currentPage} de {totalPages}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={24} />
                  <input 
                    type="text" 
                    placeholder="BUSCAR BARRIL..." 
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="industrial-input w-full h-16 pl-16 pr-6 bg-black rounded-2xl border-2 border-white/20 focus:border-amber-500 font-black text-white outline-none transition-all uppercase text-xs tracking-widest"
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
              {paginatedBarrels.map(barrel => {
                const statusColors = {
                  'EN ESPERA': 'border-amber-500 text-amber-500 shadow-amber-500/10',
                  'EN ANÁLISIS': 'border-blue-500 text-blue-500 shadow-blue-500/10',
                  'LIBERADO': 'border-emerald-500 text-emerald-500 shadow-emerald-500/10',
                  'RECHAZADO': 'border-red-500 text-red-500 shadow-red-500/10'
                };
                const colorClass = statusColors[barrel.status as keyof typeof statusColors] || 'border-white/20 text-white';

                return (
                  <button
                    key={barrel.id}
                    onClick={() => setSelectedBarrelId(barrel.id)}
                    className={`p-10 rounded-[3rem] border-2 transition-all text-left flex flex-col gap-8 bg-black ${colorClass.split(' ')[0]} hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(0,0,0,0.5)] group relative overflow-hidden h-[360px]`}
                  >
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform text-white">
                      <Box size={160} />
                    </div>
                    <div className="flex justify-between items-start w-full z-10">
                      <div className={`p-5 rounded-2xl bg-white/5 border-2 ${colorClass.split(' ')[0]} flex items-center justify-center transition-all group-hover:bg-white/10`}>
                        <Box size={32} />
                      </div>
                      <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest border-2 uppercase ${colorClass}`}>
                        {barrel.status}
                      </span>
                    </div>
                    <div className="z-10 mt-auto">
                      <h4 className="font-black text-4xl mb-2 tracking-tighter text-white leading-none uppercase">{barrel.code}</h4>
                      <div className="flex flex-col gap-2">
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                          <FlaskConical size={14} /> {crops.find(c => c.id === barrel.cropId)?.name}
                        </p>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                          <Calendar size={14} /> {new Date(barrel.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
              {paginatedBarrels.length === 0 && (
                <div className="col-span-full bg-black border-2 border-dashed border-white/10 rounded-[3rem] py-32 text-center flex flex-col items-center justify-center text-white/20">
                  <Box size={80} className="mb-6 opacity-10" />
                  <p className="font-black text-xl uppercase tracking-[0.3em]">No se encontraron barriles</p>
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
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 bg-black p-10 rounded-[2rem] border-2 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-8">
                <button 
                  onClick={() => setSelectedBarrelId(null)}
                  className="w-20 h-20 bg-black text-white rounded-3xl flex items-center justify-center hover:bg-white/10 transition-all border-2 border-white/20 active:scale-90"
                >
                  <ArrowLeft size={40} />
                </button>
                <div>
                  <h2 className="text-5xl font-black tracking-tighter uppercase leading-none text-white">{selectedBarrel?.code}</h2>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-white/40 font-black uppercase text-[10px] tracking-widest">Activo Crítico</span>
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:items-end gap-6 w-full lg:w-auto mt-6 lg:mt-0">
                {selectedBarrel && <Countdown date={selectedBarrel.date} />}
                <div className="flex flex-col sm:flex-row flex-wrap lg:justify-end gap-3 w-full">
                  {(['EN ESPERA', 'EN ANÁLISIS', 'LIBERADO', 'RECHAZADO'] as BarrelStatus[]).map(s => {
                    const isActive = selectedBarrel?.status === s;
                    const isRelease = s === 'LIBERADO';
                    const releaseDisabled = isRelease && isLocked;

                    const statusStyles = {
                      'EN ESPERA': 'border-amber-500/50 text-amber-500 hover:bg-amber-500/10',
                      'EN ANÁLISIS': 'border-blue-500/50 text-blue-500 hover:bg-blue-500/10',
                      'LIBERADO': 'border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10',
                      'RECHAZADO': 'border-red-500/50 text-red-500 hover:bg-red-500/10'
                    };

                    return (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(s)}
                        disabled={releaseDisabled}
                        className={`w-full sm:w-auto px-8 py-4 rounded-2xl text-[10px] font-black transition-all border-2 uppercase tracking-widest ${
                          isActive 
                            ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.3)] scale-105' 
                            : releaseDisabled
                              ? 'bg-black text-white/5 border-white/5 cursor-not-allowed opacity-30'
                              : `bg-black ${statusStyles[s]}`
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-black rounded-[3rem] border-2 border-white/20 p-12 flex-1 overflow-y-auto shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-4 mb-10">
                <FlaskConical className="text-amber-500" size={32} />
                <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Análisis Microbiológico</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {selectedCrop?.parameters.filter(p => p.category === 'MICROBIOLOGICO').map(param => (
                  <div key={param.id} className="p-10 bg-black rounded-[2rem] border-2 border-white/10 flex flex-col gap-8 hover:border-white/30 transition-all group">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{param.name}</span>
                      <span className="text-[10px] font-black px-4 py-2 bg-white/5 rounded-xl border border-white/20 text-white/40 uppercase tracking-widest">{param.unit}</span>
                    </div>
                    
                    {param.type === 'NUMERIC' && (
                      <Stepper 
                        label="Resultado de Laboratorio"
                        value={selectedBarrel?.analysisValues[param.id] || 0}
                        onChange={(v: number) => handleValueChange(param.id, v)}
                        min={0}
                        max={1000}
                        step={0.1}
                      />
                    )}

                    {param.type === 'BOOLEAN' && (
                      <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Presencia / Ausencia</span>
                        <div className="flex bg-black p-2 rounded-2xl h-24 border-2 border-white/20">
                          {[true, false].map(v => (
                            <button
                              key={v.toString()}
                              onClick={() => handleValueChange(param.id, v)}
                              className={`flex-1 rounded-xl font-black transition-all border-2 uppercase text-xs tracking-widest ${
                                selectedBarrel?.analysisValues[param.id] === v 
                                  ? 'bg-[#3B82F6] text-white border-white/30 shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
                                  : 'text-white/20 border-transparent hover:bg-white/5'
                              }`}
                            >
                              {v ? 'POSITIVO' : 'NEGATIVO'}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {selectedCrop?.parameters.filter(p => p.category === 'MICROBIOLOGICO').length === 0 && (
                <div className="flex flex-col items-center justify-center py-40 text-white/5">
                  <FlaskConical size={120} strokeWidth={1} className="mb-8 opacity-10" />
                  <p className="font-black text-2xl uppercase tracking-[0.4em]">Sin Parámetros Críticos</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
