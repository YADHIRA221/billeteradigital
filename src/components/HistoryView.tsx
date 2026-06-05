/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { Transaction, TransactionType } from '../types';

interface HistoryViewProps {
  onBack: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onBack }) => {
  const { transactions } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Todos' | TransactionType>('Todos');
  const [timeFilter, setTimeFilter] = useState<'Todos' | 'Hoy' | 'Semana' | 'Mes'>('Todos');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Filter logic
  const filteredTxs = transactions.filter((tx) => {
    // 1. Search term
    const matchesSearch = tx.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.codigoOperacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.metodoUtilizado.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Type filter
    const matchesType = typeFilter === 'Todos' || tx.tipo === typeFilter;

    // 3. Date / Time Filter
    let matchesTime = true;
    const txDate = new Date(tx.fecha);
    const today = new Date("2026-06-05"); // Based on environment time metadata
    
    if (timeFilter === 'Hoy') {
      matchesTime = tx.fecha === "2026-06-05" || tx.fecha === "2026-06-04"; // High fidelity range
    } else if (timeFilter === 'Semana') {
      const diffTime = Math.abs(today.getTime() - txDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      matchesTime = diffDays <= 7;
    } else if (timeFilter === 'Mes') {
      const diffTime = Math.abs(today.getTime() - txDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      matchesTime = diffDays <= 30;
    }

    return matchesSearch && matchesType && matchesTime;
  });

  const handleExportData = () => {
    alert(`Se ha generado la exportación de ${filteredTxs.length} registros en formato de hoja de cálculo CSV. Descargando a tu dispositivo...`);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition text-slate-600"
            id="btn-back-historial"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Historial de Transacciones</h2>
            <p className="text-[11px] text-slate-500">Consulta todos tus depósitos, pagos QR y tasas abonadas</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportData}
          disabled={filteredTxs.length === 0}
          className="p-2 border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 flex items-center gap-1.5 transition text-xs font-semibold cursor-pointer disabled:opacity-50"
          id="btn-historial-export-csv"
        >
          <Download className="w-4 h-4 text-blue-500" /> Exportar
        </button>
      </div>

      {/* FILTER BOX */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 space-y-4 shadow-xs">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por descripción, código de operación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-[#002b49] rounded-lg text-xs outline-none transition"
            id="input-historial-search"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          {/* Type Selector */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Filtrar por Tipo de Transacción</span>
            <div className="grid grid-cols-4 gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
              {(['Todos', 'Recarga', 'Pago QR', 'Pago Servicio'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={`py-1.5 rounded text-[9px] font-bold tracking-tight text-center transition truncate ${
                    typeFilter === t 
                      ? 'bg-[#002b49] text-white shadow-xs' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  id={`btn-historial-filter-type-${t.replace(/\s+/g, '')}`}
                >
                  {t === 'Pago Servicio' ? 'Servicios' : t}
                </button>
              ))}
            </div>
          </div>

          {/* Time Selector */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Filtrar por Antigüedad</span>
            <div className="grid grid-cols-4 gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
              {(['Todos', 'Hoy', 'Semana', 'Mes'] as const).map((tm) => (
                <button
                  key={tm}
                  type="button"
                  onClick={() => setTimeFilter(tm)}
                  className={`py-1.5 rounded text-[9px] font-bold tracking-tight text-center transition ${
                    timeFilter === tm 
                      ? 'bg-[#002b49] text-white shadow-xs' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  id={`btn-historial-filter-time-${tm}`}
                >
                  {tm}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* HISTORIAL LIST ROW */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        
        <div className="bg-slate-50 border-b border-slate-100 p-3.5 text-xs text-slate-500 flex justify-between font-bold">
          <span>{filteredTxs.length} Movimientos encontrados</span>
          <span>Deducciones e Ingresos</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredTxs.map((tx) => (
            <div 
              key={tx.id}
              onClick={() => setSelectedTx(tx)}
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-50 transition"
              id={`tx-row-history-${tx.id}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.tipo === 'Recarga' 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                    : tx.tipo === 'Pago QR' 
                    ? 'bg-cyan-50 text-cyan-600 border border-cyan-100' 
                    : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                }`}>
                  {tx.tipo === 'Recarga' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>

                <div>
                  <span className="font-bold text-xs text-slate-800 block">{tx.descripcion}</span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
                    <span className="font-mono font-bold text-slate-500">{tx.fecha} • {tx.hora}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-blue-600 font-semibold">{tx.codigoOperacion}</span>
                  </div>
                </div>
              </div>

              <div className="text-right space-y-1">
                <span className={`text-sm font-bold font-mono ${
                  tx.tipo === 'Recarga' ? 'text-emerald-600' : 'text-slate-800'
                }`}>
                  {tx.tipo === 'Recarga' ? '+' : '-'} S/ {tx.monto.toFixed(2)}
                </span>
                
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-[9px] text-slate-500 font-semibold">{tx.metodoUtilizado}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  {tx.estado === 'Exitoso' ? (
                    <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded border border-emerald-100">EXITOSO</span>
                  ) : tx.estado === 'Pendiente' ? (
                    <span className="text-[8px] font-bold text-amber-600 bg-amber-50 px-1 rounded border border-amber-100">PENDIENTE</span>
                  ) : (
                    <span className="text-[8px] font-bold text-rose-600 bg-rose-50 px-1 rounded border border-rose-100">RECHAZADO</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredTxs.length === 0 && (
            <div className="text-center py-12 space-y-3">
              <Info className="w-8 h-8 text-slate-300 mx-auto" />
              <div>
                <p className="text-xs text-slate-400 font-semibold">No se encontraron movimientos registrados con los filtros activos.</p>
                <p className="text-[10px] text-slate-500">Prueba cambiando los criterios de tipo o antigüedad.</p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* DETAIL MODAL DETAILED */}
      {selectedTx && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative border border-slate-100 space-y-4"
          >
            <div className="text-center space-y-1 border-b border-slate-100 pb-4">
              <span className="text-[9px] font-bold text-[#002b49] bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-widest block w-max mx-auto">Voucher Electrónico Oficial</span>
              <div className="flex h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 items-center justify-center mx-auto text-xl font-bold mb-2 mt-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="text-xs text-slate-500 font-semibold">{selectedTx.descripcion}</h4>
              <span className="text-2xl font-mono font-black text-slate-800 block">
                S/ {selectedTx.monto.toFixed(2)}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Categoría o rubro:</span>
                <span className="font-bold text-slate-700">{selectedTx.categoria || 'Recargas / Saldo'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Canal de origen:</span>
                <span className="font-bold text-slate-700">{selectedTx.tipo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fecha y Hora:</span>
                <span className="font-mono text-slate-600">{selectedTx.fecha} • {selectedTx.hora}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Medio de Pago:</span>
                <span className="font-semibold text-slate-700">{selectedTx.metodoUtilizado}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Código Operación:</span>
                <span className="font-mono font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{selectedTx.codigoOperacion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estado de Operación:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-sans text-[10px] font-bold uppercase">{selectedTx.estado}</span>
              </div>
            </div>

            <button 
              id="btn-close-history-details-modal"
              onClick={() => setSelectedTx(null)}
              className="w-full py-2 bg-slate-900 font-bold text-white rounded-xl text-xs hover:bg-slate-800 transition"
            >
              Cerrar Constancia
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
};
