/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { 
  ArrowLeft, 
  Search, 
  BookOpen, 
  Award, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight, 
  FileText,
  BadgeCent
} from 'lucide-react';
import { motion } from 'motion/react';
import { ServiceUniversity, Transaction } from '../types';

interface ServicesViewProps {
  onBack: () => void;
  onNavigateToRecarga: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onBack, onNavigateToRecarga }) => {
  const { services, wallet, pagarServicioAcademico } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'Todos' | 'Académico' | 'Servicios Complementarios'>('Todos');
  
  // Selected service for modal checkout
  const [selectedService, setSelectedService] = useState<ServiceUniversity | null>(null);
  const [payStep, setPayStep] = useState<'idle' | 'processing' | 'success'>('idle');
  const [checkoutTx, setCheckoutTx] = useState<Transaction | null>(null);
  const [checkoutError, setCheckoutError] = useState('');

  const currentBalance = wallet ? wallet.saldoDisponible : 0;

  // Filter services
  const filteredServices = services.filter((srv) => {
    const matchesSearch = srv.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          srv.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Todos' || srv.categoria === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handlePayClick = (srv: ServiceUniversity) => {
    setSelectedService(srv);
    setPayStep('idle');
    setCheckoutError('');
  };

  const handleConfirmPay = async () => {
    if (!selectedService) return;
    setCheckoutError('');
    setPayStep('processing');

    try {
      const tx = await pagarServicioAcademico(selectedService.id);
      setCheckoutTx(tx);
      setTimeout(() => {
        setPayStep('success');
      }, 1200);
    } catch (err: any) {
      setPayStep('idle');
      setCheckoutError(err.message || 'Error al procesar el pago del derecho.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full transition text-slate-600"
          id="btn-back-servicios"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Trámites y Servicios Académicos</h2>
          <p className="text-xs text-slate-500">Cancela tasas académicas regulares y complementarias desde tu celular</p>
        </div>
      </div>

      {/* FILTER SEARCH CONTAINER */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        {/* Search bar */}
        <div className="relative md:col-span-8">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por tasa, pensión, certificado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-[#002b49] rounded-lg text-xs outline-none transition"
            id="input-servicios-busqueda"
          />
        </div>

        {/* Tab filters */}
        <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200 md:col-span-4">
          {(['Todos', 'Académico', 'Servicios Complementarios'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition ${
                categoryFilter === cat 
                  ? 'bg-[#002b49] text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              id={`tab-srv-filter-${cat.replace(/\s+/g, '')}`}
            >
              {cat === 'Servicios Complementarios' ? 'Complementarios' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* LIST OF SERVICES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredServices.map((srv) => {
          const isAcademic = srv.categoria === 'Académico';
          
          return (
            <div 
              key={srv.id}
              className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between hover:border-slate-300 transition duration-300 gap-4"
            >
              <div className="space-y-2">
                {/* Category tag */}
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    isAcademic 
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                      : 'bg-teal-50 text-teal-700 border border-teal-100'
                  }`}>
                    {srv.categoria}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{srv.id}</span>
                </div>

                <h3 className="font-bold text-xs text-slate-800 leading-tight line-clamp-1">{srv.nombre}</h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{srv.descripcion}</p>
              </div>

              {/* Price and Action row */}
              <div className="border-t border-slate-100 pt-3 flex justify-between items-center mt-auto">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase">Costo Derecho</span>
                  <span className="text-sm font-semibold font-mono text-slate-800">S/ {srv.precio.toFixed(2)}</span>
                </div>

                <button
                  type="button"
                  id={`btn-srv-pagar-${srv.id}`}
                  onClick={() => handlePayClick(srv)}
                  className="py-1.5 px-3 bg-[#002b49] hover:bg-[#001c30] text-white font-bold text-[11px] rounded-lg transition hover:shadow-md cursor-pointer"
                >
                  Pagar Derecho
                </button>
              </div>
            </div>
          );
        })}

        {filteredServices.length === 0 && (
          <div className="text-center py-10 col-span-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2 animate-pulse" />
            <p className="text-xs text-slate-400 font-semibold">No se encontraron trámites con ese término de búsqueda.</p>
          </div>
        )}
      </div>

      {/* CHECKOUT MODAL DRAWER */}
      {selectedService && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative border border-slate-100 space-y-4"
          >
            {payStep === 'idle' && (
              <div className="space-y-5">
                <div className="text-center pb-2 border-b border-slate-100">
                  <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Checkout Académico</span>
                  <h4 className="font-bold text-slate-800 text-sm mt-3">{selectedService.nombre}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{selectedService.descripcion}</p>
                </div>

                {/* Amount Info */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Precio Tasa:</span>
                    <span className="text-lg font-mono font-bold text-slate-800">S/ {selectedService.precio.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-slate-200/60 pt-2.5">
                    <span className="text-slate-400">Tu saldo disponible:</span>
                    <span className={`font-semibold font-mono ${currentBalance >= selectedService.price ? 'text-emerald-600' : 'text-rose-600'}`}>
                      S/ {currentBalance.toFixed(2)}
                    </span>
                  </div>
                </div>

                {currentBalance < selectedService.precio ? (
                  <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-[11px]">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>¡Saldo Insuficiente en Billetera Unipay UCH!</span>
                    </div>
                    <p className="text-[10px] text-rose-600 leading-snug">
                      No tienes saldo suficiente para pagar esta tasa (Faltan S/ {(selectedService.precio - currentBalance).toFixed(2)}). Debes hacer una recarga rápida.
                    </p>
                    <button 
                      type="button"
                      onClick={() => {
                        setSelectedService(null);
                        onNavigateToRecarga();
                      }}
                      className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[9px] uppercase transition"
                      id="btn-checkout-recharge-now"
                    >
                      Hacer Recarga Rápida
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-[10px] text-slate-500 bg-slate-100/50 p-2.5 rounded-lg border border-slate-100 leading-normal">
                      * El pago de tasas académicas genera un comprobante electrónico inmediato y convalida de manera automatizada en el sistema del estudiante en 5 segundos.
                    </p>

                    {checkoutError && (
                      <span className="text-[10px] text-rose-600 block bg-rose-50 p-2 rounded">{checkoutError}</span>
                    )}

                    {/* Action buttons slider */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedService(null)}
                        className="py-2.5 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl text-xs text-slate-600 transition"
                        id="btn-srv-checkout-close"
                      >
                        Cerrar
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmPay}
                        className="py-2.5 bg-[#002b49] hover:bg-[#001c30] text-white font-bold rounded-xl text-xs shadow-xs transition"
                        id="btn-srv-checkout-confirm"
                      >
                        Confirmar Pago
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {payStep === 'processing' && (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 border-4 border-t-transparent border-[#002b49] rounded-full animate-spin mx-auto"></div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Validando Transacción</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Conectando con la base de datos de Tesorería General UCH...</p>
                </div>
              </div>
            )}

            {payStep === 'success' && checkoutTx && (
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-lg">
                  <CheckCircle className="w-6 h-6" />
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-bold text-emerald-800 text-xs uppercase">Pago Recibido con Éxito</h4>
                  <p className="text-[10px] text-slate-500">Se actualizó tu matrícula y estado financiero en el sistema.</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-left text-[10px] space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Derecho:</span>
                    <span className="font-bold text-slate-700 truncate max-w-[150px]">{checkoutTx.descripcion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Código Operación:</span>
                    <span className="font-bold text-blue-600 bg-blue-50 px-1 rounded">{checkoutTx.codigoOperacion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fecha y Hora:</span>
                    <span className="text-slate-600">{checkoutTx.fecha} • {checkoutTx.hora}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Importe pagado:</span>
                    <span className="text-slate-800 font-bold">S/ {checkoutTx.monto.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-srv-checkout-success-done"
                  onClick={() => {
                    setSelectedService(null);
                    setPayStep('idle');
                    setCheckoutTx(null);
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 font-bold text-white rounded-xl text-xs transition"
                >
                  Entendido
                </button>
              </div>
            )}

          </motion.div>
        </div>
      )}

    </div>
  );
};
