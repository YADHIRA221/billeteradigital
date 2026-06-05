/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { 
  PlusCircle, 
  QrCode, 
  FileText, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  ChevronRight, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Gift,
  Bell,
  ArrowDownLeft,
  ArrowUpRight,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';
import { Transaction } from '../types';

interface DashboardViewProps {
  onNavigate: (view: 'dashboard' | 'recarga' | 'qr' | 'servicios' | 'historial' | 'estadisticas' | 'grupales' | 'beneficios' | 'seguridad' | 'soporte' | 'perfil') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { student, wallet, transactions, promotions, notifications } = useWallet();
  const [hideBalance, setHideBalance] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const formatCurrency = (amount: number) => {
    return `S/ ${amount.toFixed(2)}`;
  };

  // Safe checks
  const balance = wallet ? wallet.saldoDisponible : 0;
  const retained = wallet ? wallet.saldoRetenido : 0;

  // Recent transactions (last 4)
  const recentTxs = transactions.slice(0, 4);

  // Unread notifications count
  const unreadCount = notifications.filter(n => !n.leido).length;

  // Active promotions (take top 2)
  const topPromos = promotions.slice(0, 2);

  // Quick stats calculations
  const totalSpentThisMonth = transactions
    .filter(tx => tx.tipo !== 'Recarga' && tx.estado === 'Exitoso')
    .reduce((sum, tx) => sum + tx.monto, 0);

  const totalRechargedThisMonth = transactions
    .filter(tx => tx.tipo === 'Recarga' && tx.estado === 'Exitoso')
    .reduce((sum, tx) => sum + tx.monto, 0);

  return (
    <div className="space-y-6">
      
      {/* Banner / SALUDO */}
      <div className="flex justify-between items-center bg-gradient-to-r from-slate-900 to-[#0c2340] p-6 rounded-2xl text-white shadow-lg relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/15 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-12 w-24 h-24 bg-cyan-400/10 rounded-full blur-xl"></div>
        
        <div className="space-y-1 relative z-10">
          <p className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Billetera Oficial Unipay</p>
          <h2 className="text-xl md:text-2xl font-bold font-sans">
            ¡Hola, {student ? student.nombres : 'Estudiante'}! 👋
          </h2>
          <p className="text-xs text-slate-300 max-w-sm">
            {student ? student.carrera : 'Ingeniería de Sistemas e Informática'} • {student ? student.cicloAcademico : 'Ciclo'}
          </p>
        </div>

        {/* Small avatar link */}
        <button 
          onClick={() => onNavigate('perfil')} 
          className="flex flex-col items-center gap-1 group focus:outline-none transition z-10"
          id="btn-nav-perfil-quick"
        >
          <div className="relative">
            <img 
              src={student?.fotoPerfil} 
              alt="Avatar" 
              className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
          </div>
          <span className="text-[10px] text-slate-300 group-hover:text-cyan-400 transition font-medium">Ver Carné</span>
        </button>
      </div>

      {/* WALLET CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* DISPONIBLE CARD */}
        <div className="bg-gradient-to-tr from-[#002b49] to-[#041e42] text-white p-6 rounded-2xl shadow-md border border-white/10 relative overflow-hidden flex flex-col justify-between h-48">
          <div className="absolute top-0 right-0 p-8 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-300">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Saldo Disponible</span>
            </div>
            <button 
              onClick={() => setHideBalance(!hideBalance)} 
              className="text-slate-300 hover:text-white transition p-1 bg-white/5 rounded-lg border border-white/5"
              title={hideBalance ? "Mostrar Saldo" : "Ocultar Saldo"}
              id="btn-toggle-privacidad-saldo"
            >
              {hideBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>

          <div className="my-2">
            <span className="text-3xl font-black font-mono tracking-tight text-white block">
              {hideBalance ? "S/ •••.••" : formatCurrency(balance)}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span>Billetera activa para consumos UCH</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-slate-400">
            <span>Matrícula activa en campus</span>
            <span className="font-mono text-cyan-300 font-semibold">{student?.codigoUniversitario}</span>
          </div>
        </div>

        {/* METRICS & SALDO RETENIDO */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-48">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Saldo Retenido</span>
              <span className="text-lg font-bold font-mono text-slate-700 mt-1 block">
                {formatCurrency(retained)}
              </span>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Utilizado para trámites académicos en procesamiento.
              </p>
            </div>
            <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-[9px] font-bold">
              ESTADO OK
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 mt-3">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase">Recargas del Mes</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-900 font-bold text-sm font-mono">{formatCurrency(totalRechargedThisMonth)}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase">Gastos del Mes</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-900 font-bold text-sm font-mono">{formatCurrency(totalSpentThisMonth)}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS ROW */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-5 tracking-wider uppercase">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <button 
            id="btn-fast-recarga" 
            onClick={() => onNavigate('recarga')}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-xs border border-slate-100 hover:border-cyan-300 hover:shadow-md transition text-slate-800 text-center cursor-pointer group animate-fade-in"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <PlusCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold block max-w-[80px] break-words">Recargar Saldo</span>
          </button>

          <button 
            id="btn-fast-qr" 
            onClick={() => onNavigate('qr')}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-xs border border-slate-100 hover:border-cyan-300 hover:shadow-md transition text-slate-800 text-center cursor-pointer group animate-fade-in"
          >
            <div className="w-12 h-12 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <QrCode className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold block max-w-[80px] break-words">Pagar QR Campus</span>
          </button>

          <button 
            id="btn-fast-servicios" 
            onClick={() => onNavigate('servicios')}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-xs border border-slate-100 hover:border-cyan-300 hover:shadow-md transition text-slate-800 text-center cursor-pointer group animate-fade-in"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold block max-w-[80px] break-words">Trámites y Tasas</span>
          </button>

          <button 
            id="btn-fast-grupales" 
            onClick={() => onNavigate('grupales')}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-xs border border-slate-100 hover:border-cyan-300 hover:shadow-md transition text-slate-800 text-center cursor-pointer group animate-fade-in"
          >
            <div className="w-12 h-12 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <Users className="w-6 h-6 text-violet-500" />
            </div>
            <span className="text-xs font-bold block max-w-[80px] break-words font-sans">Dividir Cuenta</span>
          </button>

        </div>
      </div>

      {/* RECENT MOVEMENTS AND PROMOS TWO-COLUMN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* RECENT TRANSACTIONS (lg:col-span-7) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800">Últimos Movimientos</h3>
              <p className="text-[11px] text-slate-500">Tus transacciones recientes dentro y fuera de aulas</p>
            </div>
            <button 
              id="btn-dashboard-vertot-historial"
              onClick={() => onNavigate('historial')} 
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              Ver todo <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentTxs.map((tx) => (
              <div 
                key={tx.id} 
                onClick={() => setSelectedTx(tx)}
                className="flex justify-between items-center py-3 cursor-pointer hover:bg-slate-50 rounded-lg px-2 -mx-2 transition"
                id={`tx-row-dashboard-${tx.id}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.tipo === 'Recarga' 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : tx.tipo === 'Pago QR' 
                      ? 'bg-cyan-50 text-cyan-600' 
                      : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {tx.tipo === 'Recarga' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>

                  <div>
                    <span className="font-semibold text-xs text-slate-800 block line-clamp-1">{tx.descripcion}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-slate-400 font-mono">{tx.fecha} • {tx.hora}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="text-[10px] text-slate-500">{tx.metodoUtilizado}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold font-mono ${
                    tx.tipo === 'Recarga' ? 'text-emerald-600' : 'text-slate-800'
                  }`}>
                    {tx.tipo === 'Recarga' ? '+' : '-'} S/ {tx.monto.toFixed(2)}
                  </span>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    {tx.estado === 'Exitoso' ? (
                      <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">EXITOSO</span>
                    ) : tx.estado === 'Pendiente' ? (
                      <span className="text-[8px] font-bold text-amber-600 bg-amber-50 px-1 rounded">PENDIENTE</span>
                    ) : (
                      <span className="text-[8px] font-bold text-rose-600 bg-rose-50 px-1 rounded">RECHAZADO</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {recentTxs.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-slate-400">Aún no registras movimientos financieros.</p>
              </div>
            )}
          </div>
        </div>

        {/* ACTIVE PROMOTIONS PREVIEW (lg:col-span-5) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800">Promociones Estudiantiles</h3>
              <p className="text-[11px] text-slate-500">Beneficios y cupones de locales del campus</p>
            </div>
            <button 
              id="btn-dashboard-ver-beneficios"
              onClick={() => onNavigate('beneficios')} 
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              Ver todos <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topPromos.map((promo) => (
              <div 
                key={promo.id}
                className="p-3 bg-gradient-to-r from-blue-50/75 to-transparent rounded-xl border border-blue-100/50 flex gap-3 relative overflow-hidden"
              >
                {/* Diagonal badge */}
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                  {promo.descuentoText}
                </div>

                <div className="w-10 h-10 rounded-full bg-blue-100/30 flex-shrink-0 flex items-center justify-center text-blue-600">
                  <Gift className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-xs text-slate-800 block leading-tight">{promo.titulo}</span>
                  <p className="text-[10px] text-slate-500 leading-snug">{promo.descripcion}</p>
                  <span className="text-[9px] text-slate-400 block font-semibold">{promo.commerce}</span>
                </div>
              </div>
            ))}
          </div>

          {/* QUICK NOTICE */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex gap-2.5 items-center">
            <Bell className="w-4 h-4 text-blue-500 shrink-0" />
            <p className="text-[10px] text-slate-500 leading-tight">
              Recuerda pagar tus pensiones de forma segura para evitar recargos por mora.
            </p>
          </div>
        </div>

      </div>

      {/* TRANSACTION DETAIL MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative border border-slate-100 space-y-4"
          >
            <div className="text-center space-y-1 border-b border-slate-100 pb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Comprobante de Operación</span>
              <div className="flex h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 items-center justify-center mx-auto text-xl font-bold mb-2">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="text-sm text-slate-500 font-semibold">{selectedTx.descripcion}</h4>
              <span className="text-2xl font-mono font-black text-slate-800 block">
                S/ {selectedTx.monto.toFixed(2)}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Tipo de operación:</span>
                <span className="font-bold text-slate-700">{selectedTx.tipo}</span>
              </div>
              {selectedTx.categoria && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Categoría:</span>
                  <span className="font-bold text-slate-700">{selectedTx.categoria}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Fecha y Hora:</span>
                <span className="font-mono text-slate-600">{selectedTx.fecha} • {selectedTx.hora}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Método de pago:</span>
                <span className="font-semibold text-slate-700">{selectedTx.metodoUtilizado}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Código de operación:</span>
                <span className="font-mono font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{selectedTx.codigoOperacion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estado:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-sans text-[10px] font-bold uppercase">{selectedTx.estado}</span>
              </div>
            </div>

            <button 
              id="btn-close-tx-details"
              onClick={() => setSelectedTx(null)}
              className="w-full py-2 bg-slate-900 font-bold text-white rounded-xl text-xs hover:bg-slate-800 transition"
            >
              Entendido
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
};
