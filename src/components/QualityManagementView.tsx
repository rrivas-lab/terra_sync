import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Box, FlaskConical, Search, Plus, ArrowLeft, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Barrel, Crop, Lot, BarrelStatus } from '../types';

// Let's just copy Stepper here to avoid circular dependencies if it's not exported properly.
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

  const handleStatusChange = (status: BarrelStatus) => {
    if (selectedBarrel) {
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[3rem] shadow-xl shadow-black/5 border border-black/5">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center shadow-inner">
                  <Box size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight uppercase">Control de Barriles</h2>
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
                    placeholder="Buscar barril..." 
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
              {paginatedBarrels.map(barrel => (
                <button
                  key={barrel.id}
                  onClick={() => setSelectedBarrelId(barrel.id)}
                  className={`p-8 rounded-[2rem] border-2 transition-all text-left flex flex-col gap-6 bg-[#0052CC] text-white border-transparent hover:scale-[1.02] active:scale-[0.98] shadow-xl group`}
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="p-4 rounded-2xl bg-white/20 text-white">
                      <Box size={32} />
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest bg-white/20 text-white`}>
                      {barrel.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-black text-3xl mb-1 tracking-tight">{barrel.code}</h4>
                    <p className="text-xs font-black text-white/80 uppercase tracking-widest">
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
            <div className="flex justify-between items-center bg-white p-8 rounded-[3rem] shadow-xl shadow-black/5 border border-black/5">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setSelectedBarrelId(null)}
                  className="w-16 h-16 bg-black/5 text-black/60 rounded-2xl flex items-center justify-center hover:bg-black/10 transition-colors"
                >
                  <ArrowLeft size={32} />
                </button>
                <div>
                  <h2 className="text-3xl font-black tracking-tight">{selectedBarrel?.code}</h2>
                  <p className="text-black/40 font-black uppercase text-[10px] tracking-widest mt-1">Detalles del Activo</p>
                </div>
              </div>
              <div className="flex gap-2">
                {(['EN ESPERA', 'EN ANÁLISIS', 'LIBERADO', 'RECHAZADO'] as BarrelStatus[]).map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`px-6 py-3 rounded-xl text-xs font-black transition-all border ${
                      selectedBarrel?.status === s 
                        ? 'bg-black text-white border-black shadow-lg' 
                        : 'bg-white text-black/40 border-black/5 hover:border-black/20'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-black/5 shadow-xl p-10 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {selectedCrop?.parameters.filter(p => p.category === 'MICROBIOLOGICO').map(param => (
                  <div key={param.id} className="p-8 bg-black/5 rounded-[2rem] border border-black/5 flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-black/60 uppercase tracking-widest">{param.name}</span>
                      <span className="text-[10px] font-black px-3 py-1.5 bg-white rounded-lg border border-black/5 shadow-sm">{param.unit}</span>
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
                      <div className="flex bg-white p-2 rounded-2xl h-20 border border-black/5 shadow-sm">
                        {[true, false].map(v => (
                          <button
                            key={v.toString()}
                            onClick={() => handleValueChange(param.id, v)}
                            className={`flex-1 rounded-xl font-bold transition-all ${selectedBarrel?.analysisValues[param.id] === v ? 'bg-black text-white shadow-lg' : 'text-black/40 hover:bg-black/5'}`}
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
                <div className="flex flex-col items-center justify-center py-32 text-black/20">
                  <FlaskConical size={80} strokeWidth={1} className="mb-6" />
                  <p className="font-bold text-2xl">No hay parámetros microbiológicos definidos para este rubro.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
