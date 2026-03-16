import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, LayoutGrid, MapPin, Search, ChevronLeft, ChevronRight, ArrowLeft, Trash2, Beaker, CheckCircle2, XCircle, Info, Clock, Save } from 'lucide-react';
import { Lot, Crop, Farm, LotAnalysis, SoilType, LotStatus } from '../types';

export const LotManagementView = ({
  lots,
  crops,
  farms,
  onAddLot,
  onDeleteLot,
  onAddAnalysis
}: {
  lots: Lot[];
  crops: Crop[];
  farms: Farm[];
  onAddLot: (lot: Partial<Lot>) => void;
  onDeleteLot: (id: string) => void;
  onAddAnalysis: (lotId: string, analysis: LotAnalysis) => void;
  key?: React.Key;
}) => {
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editLot, setEditLot] = useState<Partial<Lot>>({});
  const [analyzingLotId, setAnalyzingLotId] = useState<string | null>(null);
  const [analysisValues, setAnalysisValues] = useState<{ [key: string]: any }>({});
  
  const [newLot, setNewLot] = useState<Partial<Lot>>({
    lotCode: '',
    area: 10,
    soilType: 'Arcilloso',
    cropId: crops[0]?.id || '',
    farmId: '',
    status: 'VACÍO'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredLots = useMemo(() => {
    return lots.filter(l => 
      l.lotCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farms.find(f => f.id === l.farmId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [lots, farms, searchTerm]);

  const totalPages = Math.ceil(filteredLots.length / itemsPerPage) || 1;
  const paginatedLots = filteredLots.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const selectedLot = lots.find(l => l.id === selectedLotId);
  const analyzingLot = lots.find(l => l.id === analyzingLotId);
  const analyzingCrop = crops.find(c => c.id === analyzingLot?.cropId);

  const lotData = selectedLot ? editLot : newLot;
  const setLotData = selectedLot ? setEditLot : setNewLot;

  const selectedFarm = farms.find(f => f.id === lotData.farmId);
  const occupiedArea = lots.filter(l => l.farmId === lotData.farmId && l.id !== selectedLot?.id).reduce((acc, l) => acc + l.area, 0);
  const availableArea = selectedFarm ? selectedFarm.totalHectares - occupiedArea : 0;
  const isAreaValid = (lotData.area || 0) <= availableArea;

  // Dirty state detection
  const isDirty = useMemo(() => {
    if (isAdding) return newLot.lotCode !== '' || newLot.farmId !== '';
    if (selectedLot) {
      return editLot.lotCode !== selectedLot.lotCode || 
             editLot.farmId !== selectedLot.farmId || 
             editLot.cropId !== selectedLot.cropId || 
             editLot.area !== selectedLot.area || 
             editLot.soilType !== selectedLot.soilType || 
             editLot.status !== selectedLot.status;
    }
    return false;
  }, [isAdding, newLot, selectedLot, editLot]);

  const handleStartAnalysis = (lot: Lot) => {
    setAnalyzingLotId(lot.id);
    const initialValues: any = {};
    const crop = crops.find(c => c.id === lot.cropId);
    crop?.parameters.forEach(p => {
      if (p.type === 'NUMERIC') initialValues[p.id] = (p.min! + p.max!) / 2;
      if (p.type === 'BOOLEAN') initialValues[p.id] = true;
      if (p.type === 'SELECTION') initialValues[p.id] = p.options?.[0] || '';
    });
    setAnalysisValues(initialValues);
  };

  const submitAnalysis = () => {
    if (!analyzingLotId) return;
    
    let status: 'APROBADO' | 'RECHAZADO' = 'APROBADO';
    analyzingCrop?.parameters.forEach(p => {
      if (p.type === 'NUMERIC') {
        const val = analysisValues[p.id];
        if (val < p.min! || val > p.max!) status = 'RECHAZADO';
      }
    });

    const analysis: LotAnalysis = {
      id: `an-${Date.now()}`,
      lotId: analyzingLotId,
      date: new Date().toISOString(),
      values: analysisValues,
      status
    };

    onAddAnalysis(analyzingLotId, analysis);
    setAnalyzingLotId(null);
  };

  const handleCreateLot = () => {
    if (!newLot.farmId) return;
    onAddLot(newLot);
    setIsAdding(false);
    setNewLot({
      lotCode: '',
      area: 10,
      soilType: 'Arcilloso',
      cropId: crops[0]?.id || '',
      farmId: '',
      status: 'VACÍO'
    });
  };

  if (selectedLot || isAdding) {
    const isEditing = !!selectedLot;
    const crop = crops.find(c => c.id === lotData.cropId);

    if (isEditing && Object.keys(editLot).length === 0) {
      setEditLot({ ...selectedLot });
    }

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-8 min-h-[80vh]">
        <div className="flex justify-between items-center bg-black p-8 rounded-[3rem] border-2 border-white/10">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => { setSelectedLotId(null); setIsAdding(false); setEditLot({}); }}
              className="w-16 h-16 bg-white/5 text-white rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors border-2 border-white/10"
            >
              <ArrowLeft size={32} />
            </button>
            <div>
              <h2 className="text-4xl font-black tracking-tighter uppercase text-white">{isEditing ? `Lote ${selectedLot.lotCode}` : 'Nuevo Lote'}</h2>
              <p className="text-white/40 font-black uppercase text-[10px] tracking-widest mt-2">Configuración de Terreno</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isEditing && (
              <button 
                onClick={() => handleStartAnalysis(selectedLot)}
                className="flex items-center gap-3 px-8 py-4 bg-amber-500/10 text-amber-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all border-2 border-amber-500/20 hover:border-amber-500"
              >
                <Beaker size={20} /> Nuevo Análisis
              </button>
            )}
            {isDirty && (
              <button 
                onClick={() => {
                  if (isAdding) {
                    handleCreateLot();
                  } else {
                    onAddLot({ ...editLot, id: selectedLot.id });
                    setSelectedLotId(null);
                    setEditLot({});
                  }
                }}
                disabled={!isAreaValid}
                className="flex items-center gap-3 px-10 py-5 bg-[#3B82F6] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:opacity-50"
              >
                <Save size={20} /> Guardar Lote
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-black rounded-[3rem] border-2 border-white/10 p-12 flex flex-col gap-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="flex flex-col gap-4">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Código de Lote</label>
                <input 
                  type="text" 
                  value={lotData.lotCode || ''} 
                  onChange={e => setLotData({ ...lotData, lotCode: e.target.value })} 
                  className="industrial-input w-full h-20 px-8 bg-black rounded-2xl border-2 border-white/20 focus:border-[#3B82F6] font-black text-2xl outline-none transition-all text-white uppercase" 
                />
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Finca Asociada</label>
                <select 
                  value={lotData.farmId || ''} 
                  onChange={e => setLotData({ ...lotData, farmId: e.target.value })} 
                  className="industrial-input w-full h-20 px-8 bg-black rounded-2xl border-2 border-white/20 focus:border-[#3B82F6] font-black text-xl outline-none transition-all text-white appearance-none uppercase"
                >
                  <option value="" className="bg-black">SELECCIONE UNA FINCA</option>
                  {farms.map(f => (
                    <option key={f.id} value={f.id} className="bg-black uppercase">{f.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Tipo de Cultivo</label>
                <select 
                  value={lotData.cropId || ''} 
                  onChange={e => setLotData({ ...lotData, cropId: e.target.value })} 
                  className="industrial-input w-full h-20 px-8 bg-black rounded-2xl border-2 border-white/20 focus:border-[#3B82F6] font-black text-xl outline-none transition-all text-white appearance-none uppercase"
                >
                  {crops.map(c => (
                    <option key={c.id} value={c.id} className="bg-black uppercase">{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Área de Cultivo (Ha)</label>
                <div className="flex flex-col gap-2">
                  <input 
                    type="number" 
                    value={lotData.area || ''} 
                    onChange={e => setLotData({ ...lotData, area: parseFloat(e.target.value) || 0 })} 
                    className={`industrial-input w-full h-20 px-8 bg-black rounded-2xl border-2 ${!isAreaValid ? 'border-red-500 focus:border-red-500 text-red-500' : 'border-white/20 focus:border-[#3B82F6] text-white'} font-black text-2xl outline-none transition-all uppercase`} 
                  />
                  {selectedFarm && (
                    <span className={`text-[10px] font-black ${isAreaValid ? 'text-[#10B981]' : 'text-red-500'} uppercase tracking-widest`}>
                      Capacidad Disponible: {availableArea.toFixed(2)} Ha
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Tipo de Suelo</label>
                <select 
                  value={lotData.soilType || ''} 
                  onChange={e => setLotData({ ...lotData, soilType: e.target.value as SoilType })} 
                  className="industrial-input w-full h-20 px-8 bg-black rounded-2xl border-2 border-white/20 focus:border-[#3B82F6] font-black text-xl outline-none transition-all text-white appearance-none uppercase"
                >
                  {(['Arcilloso', 'Arenoso', 'Franco', 'Limoso'] as SoilType[]).map(t => (
                    <option key={t} value={t} className="bg-black uppercase">{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Estado Operativo</label>
                <select 
                  value={lotData.status || ''} 
                  onChange={e => setLotData({ ...lotData, status: e.target.value as LotStatus })} 
                  className="industrial-input w-full h-20 px-8 bg-black rounded-2xl border-2 border-white/20 focus:border-[#3B82F6] font-black text-xl outline-none transition-all text-white appearance-none uppercase"
                >
                  {(['VACÍO', 'PREPARACIÓN', 'SEMBRADO', 'COSECHA', 'DESCANSO'] as LotStatus[]).map(s => (
                    <option key={s} value={s} className="bg-black uppercase">{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-start mt-10 pt-10 border-t-2 border-white/10">
                <button 
                  onClick={() => {
                    if (confirm('¿Está seguro de eliminar este lote?')) {
                      onDeleteLot(selectedLot.id);
                      setSelectedLotId(null);
                    }
                  }}
                  className="px-10 py-5 bg-red-500/10 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border-2 border-red-500/20 hover:border-red-500"
                >
                  Eliminar Lote
                </button>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="bg-black rounded-[3rem] border-2 border-white/10 p-12 flex flex-col gap-8">
              <h3 className="text-xl font-black tracking-tighter uppercase text-white/40">Historial de Análisis</h3>
              <div className="flex flex-col gap-6">
                {selectedLot.analyses && selectedLot.analyses.length > 0 ? (
                  selectedLot.analyses.map(analysis => (
                    <div key={analysis.id} className="p-8 bg-white/5 rounded-[2rem] border-2 border-white/10 flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Clock size={16} className="text-white/40" />
                          <span className="text-xs font-black text-white/60">{new Date(analysis.date).toLocaleDateString()}</span>
                        </div>
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border-2 ${analysis.status === 'APROBADO' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}>
                          {analysis.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-3 mt-2">
                        {Object.entries(analysis.values).map(([key, value]) => {
                          const param = crop?.parameters.find(p => p.id === key);
                          return (
                            <div key={key} className="flex justify-between items-center text-xs">
                              <span className="text-white/40 font-black uppercase tracking-widest">{param?.name || key}</span>
                              <span className="font-black text-white">{String(value)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 bg-white/5 rounded-[2rem] border-2 border-white/10 border-dashed">
                    <p className="text-white/40 font-black uppercase tracking-widest text-xs">Sin registros</p>
                  </div>
                )}
              </div>
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
            <LayoutGrid size={40} />
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tighter uppercase leading-none text-white">Gestión de Lotes</h2>
            <div className="flex items-center gap-3 mt-3">
              <span className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-white/60">
                Página {currentPage} de {totalPages}
              </span>
              <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#10B981]">
                {filteredLots.length} Lotes Activos
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={24} />
            <input 
              type="text" 
              placeholder="BUSCAR LOTE..." 
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
            <Plus size={24} /> Nuevo Lote
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedLots.length === 0 ? (
          <div className="col-span-full text-center py-32 bg-black rounded-[3rem] border-2 border-white/10 border-dashed">
            <p className="text-white/40 font-black uppercase tracking-[0.3em]">No se encontraron lotes</p>
          </div>
        ) : (
          paginatedLots.map(lot => {
            const farm = farms.find(f => f.id === lot.farmId);
            const crop = crops.find(c => c.id === lot.cropId);
            return (
              <button
                key={lot.id}
                onClick={() => setSelectedLotId(lot.id)}
                className="p-10 rounded-[3rem] text-left transition-all flex flex-col gap-6 bg-[#10B981] text-black hover:-translate-y-2 active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.2)] group relative overflow-hidden h-[340px]"
              >
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
                  <LayoutGrid size={120} />
                </div>
                
                <div className="flex justify-between items-start w-full z-10">
                  <div className="p-4 rounded-2xl bg-black/10 backdrop-blur-md">
                    <LayoutGrid size={28} />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                    <ChevronRight size={24} />
                  </div>
                </div>

                <div className="z-10 mt-auto">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-black/10 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {lot.status}
                    </span>
                  </div>
                  <h3 className="font-black text-4xl tracking-tighter leading-none mb-4">Lote {lot.lotCode}</h3>
                  <div className="flex flex-wrap gap-3">
                    <div className="px-3 py-1.5 bg-black/5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <MapPin size={12} /> {farm?.name || 'SIN FINCA'}
                    </div>
                    <div className="px-3 py-1.5 bg-black/5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Beaker size={12} /> {crop?.name}
                    </div>
                    <div className="px-3 py-1.5 bg-black/5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      {lot.area} Ha
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

      {/* Analysis Modal */}
      <AnimatePresence>
        {analyzingLotId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setAnalyzingLotId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-black w-full max-w-2xl rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border-2 border-white/10"
            >
              <div className="p-10 border-b-2 border-white/10 flex justify-between items-center bg-white/5">
                <div>
                  <h3 className="text-3xl font-black tracking-tighter uppercase text-white">Análisis de Lote</h3>
                  <p className="text-white/40 font-black uppercase text-[10px] tracking-widest mt-1">Registro de Parámetros</p>
                </div>
                <button onClick={() => setAnalyzingLotId(null)} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors text-white">
                  <Plus className="rotate-45" />
                </button>
              </div>
              <div className="p-10 flex flex-col gap-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {analyzingCrop?.parameters.map(param => (
                    <div key={param.id} className="flex flex-col gap-3">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{param.name}</span>
                      {param.type === 'NUMERIC' && (
                        <input 
                          type="number" 
                          value={analysisValues[param.id] || ''}
                          onChange={e => setAnalysisValues(prev => ({ ...prev, [param.id]: Number(e.target.value) }))}
                          className="industrial-input h-16 px-6 bg-black rounded-2xl font-black text-white border-2 border-white/20 focus:border-[#3B82F6] outline-none transition-all"
                        />
                      )}
                      {param.type === 'BOOLEAN' && (
                        <select 
                          value={String(analysisValues[param.id])}
                          onChange={e => setAnalysisValues(prev => ({ ...prev, [param.id]: e.target.value === 'true' }))}
                          className="industrial-input h-16 px-6 bg-black rounded-2xl font-black text-white border-2 border-white/20 focus:border-[#3B82F6] outline-none appearance-none transition-all"
                        >
                          <option value="true" className="bg-black">SÍ</option>
                          <option value="false" className="bg-black">NO</option>
                        </select>
                      )}
                      {param.type === 'SELECTION' && (
                        <select 
                          value={analysisValues[param.id] || ''}
                          onChange={e => setAnalysisValues(prev => ({ ...prev, [param.id]: e.target.value }))}
                          className="industrial-input h-16 px-6 bg-black rounded-2xl font-black text-white border-2 border-white/20 focus:border-[#3B82F6] outline-none appearance-none transition-all"
                        >
                          {param.options?.map(opt => (
                            <option key={opt} value={opt} className="bg-black">{opt}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={submitAnalysis}
                  className="h-20 bg-[#3B82F6] text-white font-black text-xs uppercase tracking-widest rounded-3xl shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Registrar Análisis
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
