/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { 
  ArrowLeft, 
  HelpCircle, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  AlertTriangle,
  History,
  FileQuestion,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';

interface SupportViewProps {
  onBack: () => void;
}

export const SupportView: React.FC<SupportViewProps> = ({ onBack }) => {
  const { transactions, services, tickets, registrarBoletoSoporte } = useWallet();

  const [tipo, setTipo] = useState<'Devolución' | 'Reclamo' | 'Sugerencia'>('Reclamo');
  const [descripcion, setDescripcion] = useState('');
  const [relatedTx, setRelatedTx] = useState('');
  const [relatedService, setRelatedService] = useState('');
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Get active lists
  const expenseTxs = transactions.filter(tx => tx.tipo !== 'Recarga');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (descripcion.trim().length < 15) {
      setErrorMessage('Por favor, describe tu problema detalladamente (mínimo 15 caracteres).');
      return;
    }

    // Call Context registrar
    registrarBoletoSoporte(
      tipo, 
      descripcion.trim(), 
      relatedTx || undefined, 
      relatedService || undefined
    );

    setSuccessMessage(`Tu ${tipo.toLowerCase()} ha sido enviado con éxito. Un asesor de Bienestar del alumno UCH revisará tu caso en las próximas 48 horas.`);
    setDescripcion('');
    setRelatedTx('');
    setRelatedService('');

    // Clear alert
    setTimeout(() => {
      setSuccessMessage('');
    }, 4500);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full transition text-slate-600"
          id="btn-back-soporte"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Servicio de Atención y Reclamaciones</h2>
          <p className="text-xs text-slate-500">Radica quejas, solicita devoluciones de saldo o deja sugerencias en el campus UCH</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* TICKET FORM COLUMN (md:col-span-7) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs md:col-span-7 space-y-4">
          <div className="flex gap-2 items-center pb-2 border-b border-slate-100">
            <MessageSquare className="w-4 h-4 text-blue-500 shrink-0" />
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-widest">Registrar Nueva Solicitud</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Typology */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Tipo de Solicitud</label>
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                {(['Devolución', 'Reclamo', 'Sugerencia'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTipo(t)}
                    className={`py-1 rounded text-[10px] font-bold tracking-tight text-center transition ${
                      tipo === t 
                        ? 'bg-[#002b49] text-white shadow-xs' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    id={`btn-ticket-type-${t}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* If Devolucion/Reclamo, let them link a specific payment transaction */}
            {tipo !== 'Sugerencia' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Vincular Transacción Relacionada (Opcional)</label>
                <select
                  value={relatedTx}
                  onChange={(e) => setRelatedTx(e.target.value)}
                  className="w-full px-2.5 py-2 border border-slate-200 rounded-lg bg-white outline-none"
                  id="select-ticket-related-tx"
                >
                  <option value="">-- Seleccionar un pago de tu historial --</option>
                  {expenseTxs.map((tx) => (
                    <option key={tx.id} value={tx.id}>
                      {tx.fecha} • {tx.descripcion} (S/ {tx.monto.toFixed(2)})
                    </option>
                  ))}
                </select>
                <span className="text-[9px] text-slate-400 block">Vincular un pago ayuda a agilizar la auditoría de cajeros del campus.</span>
              </div>
            )}

            {/* Related Academic service category */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase px-0.5">Área o Concesionario Implicado</label>
              <input
                type="text"
                placeholder="Ejemplo: Cafetería Pabellón B, Biblioteca, Tesorería..."
                value={relatedService}
                onChange={(e) => setRelatedService(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#002b49] bg-white text-xs"
                id="input-ticket-related-service"
              />
            </div>

            {/* Case Details DESCRIPTION */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Detalle del caso / Reclamación</label>
              <textarea
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Escribe de manera clara las condiciones del cobro erróneo, horario y evidencias de la transacción..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#002b49] bg-white resize-none text-xs"
                id="input-ticket-description"
                required
              />
            </div>

            {/* Success and Error messages */}
            {successMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-[10px] flex items-center gap-2 border border-emerald-100">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-[10px] flex items-center gap-2 border border-rose-100">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit ticket */}
            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition uppercase tracking-wider"
              id="btn-ticket-submit"
            >
              Radicar Solicitud Segura
            </button>

          </form>
        </div>

        {/* TICKET HISTORY TRACKING (md:col-span-5) */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3.5">
            <div className="flex gap-2 items-center pb-1">
              <History className="w-4 h-4 text-[#002b49] shrink-0" />
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-widest">Mis Solicitudes</h3>
            </div>

            {/* List tickets */}
            <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
              {tickets.map((t) => (
                <div 
                  key={t.id}
                  className="p-3 bg-slate-50 border border-slate-150 rounded-xl relative space-y-1.5"
                  id={`ticket-row-historical-${t.id}`}
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-mono font-bold text-blue-600 bg-blue-50 px-1 rounded">{t.id}</span>
                    {t.estado === 'Pendiente' ? (
                      <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-100">PENDIENTE</span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">RESUELTO</span>
                    )}
                  </div>
                  
                  <span className="font-bold text-[11px] text-slate-800 block">{t.tipo} en campus</span>
                  <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">{t.descripcion}</p>
                  
                  <div className="text-[9px] text-slate-400 flex justify-between pt-1 border-t border-slate-200/50">
                    <span>Área: {t.servicioRelacionado || 'Académico'}</span>
                    <span>Fecha: {t.fechaRegistro}</span>
                  </div>
                </div>
              ))}

              {tickets.length === 0 && (
                <div className="text-center py-10 space-y-2">
                  <FileQuestion className="w-7 h-7 text-slate-300 mx-auto animate-bounce" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Sin Solicitudes Radicadas</span>
                    <p className="text-[9px] text-slate-500 p-2">Si tienes problemas con tus pagos o vueltas en el campus, radica tu reporte aquí de inmediato.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
