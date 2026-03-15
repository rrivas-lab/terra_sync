import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, LayoutGrid, MapPin, Search, ChevronLeft, ChevronRight, ArrowLeft, Trash2, Beaker, CheckCircle2, XCircle, Info, Clock } from 'lucide-react';
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

  const selectedFarm = farms.find(f => f.id === (isAdding ? newLot.farmId : selectedLot?.farmId));
  const occupiedArea = lots.filter(l => l.farmId === (isAdding ? newLot.farmId : selectedLot?.farmId) && l.id !== selectedLot?.id).reduce((acc, l) => acc + l.area, 0);
  const availableArea = selectedFarm ? selectedFarm.totalHectares - occupiedArea : 0;
  const isAreaValid = ((isAdding ? newLot.area : selectedLot?.area) || 0) <= availableArea;

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

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNewLot(prev => ({
            ...prev,
            location: { lat: position.coords.latitude, lng: position.coords.longitude }
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("No se pudo obtener la ubicación automáticamente.");
        }
      );
    }
  };

  const handleCreateLot = () => {
    if (!newLot.farmId) {
      alert("Debe seleccionar una finca para el nuevo lote.");
      return;
    }
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
    const lotData = isEditing ? selectedLot : newLot;
    const farm = farms.find(f => f.id === lotData.farmId);
    const crop = crops.find(c => c.id === lotData.cropId);

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8">
        <div className="flex justify-between items-center bg-white p-8 rounded-[3rem] shadow-xl shadow-black/5 border border-black/5">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => { setSelectedLotId(null); setIsAdding(false); }}
              className="w-16 h-16 bg-black/5 text-black/60 rounded-2xl flex items-center justify-center hover:bg-black/10 transition-colors"
            >
              <ArrowLeft size={32} />
            </button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{isEditing ? `Lote ${lotData.lotCode}` : 'Nuevo Lote'}</h2>
              <p className="text-black/40 font-bold uppercase text-xs tracking-widest mt-1">Detalle de Lote</p>
            </div>
          </div>
          {isEditing && (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleStartAnalysis(selectedLot)}
                className="flex items-center gap-2 px-6 py-3 bg-amber-100 text-amber-700 rounded-xl font-bold hover:bg-amber-200 transition-colors"
              >
                <Beaker size={18} /> Nuevo Análisis
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-xl shadow-black/5 border border-black/5 p-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-black/40 uppercase tracking-widest">Código de Lote</label>
                <input 
                  type="text" 
                  value={lotData.lotCode || ''} 
                  onChange={e => !isEditing && setNewLot({ ...newLot, lotCode: e.target.value })} 
                  disabled={isEditing}
                  className="w-full h-16 px-6 bg-black/5 rounded-2xl border-none focus:ring-2 focus:ring-[#0052CC] font-black text-lg outline-none transition-all disabled:opacity-70" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-black/40 uppercase tracking-widest">Finca</label>
                <select 
                  value={lotData.farmId || ''} 
                  onChange={e => !isEditing && setNewLot({ ...newLot, farmId: e.target.value })} 
                  disabled={isEditing}
                  className="w-full h-16 px-6 bg-black/5 rounded-2xl border-none focus:ring-2 focus:ring-[#0052CC] font-black text-lg outline-none transition-all disabled:opacity-70"
                >
                  <option value="">Seleccione una finca</option>
                  {farms.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-black/40 uppercase tracking-widest">Cultivo</label>
                <select 
                  value={lotData.cropId || ''} 
                  onChange={e => !isEditing && setNewLot({ ...newLot, cropId: e.target.value })} 
                  disabled={isEditing}
                  className="w-full h-16 px-6 bg-black/5 rounded-2xl border-none focus:ring-2 focus:ring-[#0052CC] font-black text-lg outline-none transition-all disabled:opacity-70"
                >
                  {crops.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-black/40 uppercase tracking-widest">Área (Ha)</label>
                <input 
                  type="number" 
                  value={lotData.area || 0} 
                  onChange={e => !isEditing && setNewLot({ ...newLot, area: parseFloat(e.target.value) })} 
                  disabled={isEditing}
                  className={`w-full h-16 px-6 bg-black/5 rounded-2xl border-none focus:ring-2 focus:ring-[#0052CC] font-black text-lg outline-none transition-all disabled:opacity-70 ${!isAreaValid && !isEditing ? 'ring-2 ring-red-500' : ''}`} 
                />
                {!isEditing && selectedFarm && (
                  <span className={`text-[10px] font-black ${isAreaValid ? 'text-emerald-600' : 'text-red-500'} uppercase tracking-widest`}>
                    Disponible: {availableArea} Ha
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-black/40 uppercase tracking-widest">Tipo de Suelo</label>
                <select 
                  value={lotData.soilType || ''} 
                  onChange={e => !isEditing && setNewLot({ ...newLot, soilType: e.target.value as SoilType })} 
                  disabled={isEditing}
                  className="w-full h-16 px-6 bg-black/5 rounded-2xl border-none focus:ring-2 focus:ring-[#0052CC] font-black text-lg outline-none transition-all disabled:opacity-70"
                >
                  {(['Arcilloso', 'Arenoso', 'Franco', 'Limoso'] as SoilType[]).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-black/40 uppercase tracking-widest">Estado</label>
                <select 
                  value={lotData.status || ''} 
                  onChange={e => !isEditing && setNewLot({ ...newLot, status: e.target.value as LotStatus })} 
                  disabled={isEditing}
                  className="w-full h-16 px-6 bg-black/5 rounded-2xl border-none focus:ring-2 focus:ring-[#0052CC] font-black text-lg outline-none transition-all disabled:opacity-70"
                >
                  {(['VACÍO', 'PREPARACIÓN', 'SEMBRADO', 'COSECHA', 'DESCANSO'] as LotStatus[]).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
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
                  onClick={handleCreateLot}
                  disabled={!newLot.lotCode || !newLot.farmId || !isAreaValid}
                  className="px-8 py-4 bg-[#0052CC] text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  Guardar Lote
                </button>
              </div>
            )}
            {isEditing && (
              <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-black/5">
                <button 
                  onClick={() => {
                    if (window.confirm('¿Está seguro de eliminar este lote?')) {
                      onDeleteLot(selectedLot.id);
                      setSelectedLotId(null);
                    }
                  }}
                  className="px-8 py-4 bg-red-100 text-red-700 rounded-2xl font-bold hover:bg-red-200 transition-colors"
                >
                  Eliminar Lote
                </button>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="bg-white rounded-[3rem] shadow-xl shadow-black/5 border border-black/5 p-8 flex flex-col gap-6">
              <h3 className="text-xl font-bold tracking-tight mb-4">Historial de Análisis</h3>
              <div className="flex flex-col gap-4">
                {selectedLot.analyses && selectedLot.analyses.length > 0 ? (
                  selectedLot.analyses.map(analysis => (
                    <div key={analysis.id} className="p-4 bg-black/5 rounded-2xl flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-black/60">{new Date(analysis.date).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${analysis.status === 'APROBADO' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {analysis.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {Object.entries(analysis.values).map(([key, value]) => {
                          const param = crop?.parameters.find(p => p.id === key);
                          return (
                            <div key={key} className="text-xs">
                              <span className="text-black/40">{param?.name || key}: </span>
                              <span className="font-bold">{String(value)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 opacity-50 font-bold">No hay análisis registrados</div>
                )}
              </div>
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
            <LayoutGrid size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight uppercase">Gestión de Lotes</h2>
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
              placeholder="Buscar lote..." 
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
            <Plus size={20} /> <span className="hidden md:inline">Nuevo Lote</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-xl shadow-black/5 border border-black/5 p-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedLots.length === 0 ? (
            <div className="col-span-full text-center py-20 opacity-50 font-bold">No se encontraron lotes</div>
          ) : (
            paginatedLots.map(lot => {
              const farm = farms.find(f => f.id === lot.farmId);
              const crop = crops.find(c => c.id === lot.cropId);
              return (
                <button
                  key={lot.id}
                  onClick={() => setSelectedLotId(lot.id)}
                  className="p-8 rounded-[2rem] text-left transition-all flex flex-col gap-4 bg-[#10B981] text-white border border-transparent hover:scale-[1.02] active:scale-[0.98] shadow-xl group"
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="p-4 rounded-2xl bg-white/20 text-white flex items-center justify-center">
                      <LayoutGrid size={24} />
                    </div>
                    <ChevronRight size={24} className="text-white/50 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="font-black text-2xl text-white tracking-tight">Lote {lot.lotCode}</div>
                    <div className="text-xs font-black uppercase tracking-widest mt-2 text-white/80 flex items-center gap-2">
                      <MapPin size={14} /> {farm?.name || 'Sin Finca'}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-sm font-black">{crop?.name}</span>
                    </div>
                    <div className="text-sm font-black text-white">
                      {lot.area} Ha
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-[10px] font-black tracking-widest px-3 py-1 rounded-lg bg-white/20 text-white uppercase`}>
                      {lot.status}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Analysis Modal */}
      <AnimatePresence>
        {analyzingLotId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setAnalyzingLotId(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 border-b border-black/5 flex justify-between items-center">
                <h3 className="text-3xl font-bold tracking-tight">Análisis de Lote</h3>
                <button onClick={() => setAnalyzingLotId(null)} className="p-4 bg-black/5 rounded-2xl"><Plus className="rotate-45" /></button>
              </div>
              <div className="p-10 flex flex-col gap-8">
                <div className="grid grid-cols-2 gap-6">
                  {analyzingCrop?.parameters.map(param => (
                    <div key={param.id} className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-black/40 uppercase tracking-widest">{param.name}</span>
                      {param.type === 'NUMERIC' && (
                        <input 
                          type="number" 
                          value={analysisValues[param.id] || ''}
                          onChange={e => setAnalysisValues(prev => ({ ...prev, [param.id]: Number(e.target.value) }))}
                          className="h-16 px-6 bg-black/5 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-100"
                        />
                      )}
                      {param.type === 'BOOLEAN' && (
                        <select 
                          value={String(analysisValues[param.id])}
                          onChange={e => setAnalysisValues(prev => ({ ...prev, [param.id]: e.target.value === 'true' }))}
                          className="h-16 px-6 bg-black/5 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 appearance-none"
                        >
                          <option value="true">Sí</option>
                          <option value="false">No</option>
                        </select>
                      )}
                      {param.type === 'SELECTION' && (
                        <select 
                          value={analysisValues[param.id] || ''}
                          onChange={e => setAnalysisValues(prev => ({ ...prev, [param.id]: e.target.value }))}
                          className="h-16 px-6 bg-black/5 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 appearance-none"
                        >
                          {param.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={submitAnalysis}
                  className="h-20 bg-[#0052CC] text-white font-bold rounded-3xl shadow-xl shadow-blue-200 mt-4"
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
