/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Fingerprint, 
  Smartphone, 
  Trash2, 
  Clock, 
  AlertTriangle,
  Lock,
  PlusCircle,
  Eye,
  Menu,
  Activity,
  ShieldAlert
} from 'lucide-react';
import { motion } from 'motion/react';

interface SecurityViewProps {
  onBack: () => void;
}

export const SecurityView: React.FC<SecurityViewProps> = ({ onBack }) => {
  const { 
    devices, 
    isBiometricsEnabled, 
    toggleBiometrics, 
    vincularDispositivo, 
    desvincularDispositivo 
  } = useWallet();

  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceSo, setNewDeviceSo] = useState('Android 14 (OneUI 6.1)');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName.trim()) return;
    
    vincularDispositivo(newDeviceName.trim(), newDeviceSo);
    setNewDeviceName('');
    setIsAdding(false);
  };

  const sysOptions = [
    "Android 14 (OneUI 6.1)",
    "iOS 17.5 (Apple Mobile)",
    "iPadOS 17.4",
    "Windows 11 Home",
    "MacOS Sonoma 14.2"
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full transition text-slate-600"
          id="btn-back-seguridad"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Centro de Seguridad y Accesos</h2>
          <p className="text-xs text-slate-500">Administra dispositivos vinculados y configuraciones biométricas de tu cartera</p>
        </div>
      </div>

      {/* BIOMETRIC AUTH SYSTEM */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between sm:flex-row gap-4 items-start sm:items-center">
        <div className="space-y-1.5 max-w-md">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-blue-500 shrink-0" />
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-widest leading-none">Autenticación Biométrica</h3>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
            Habilita tu huella dactilar o reconocimiento facial (FaceID) para autorizar recargas, pagos de servicios o transferir saldo de manera rápida sin ingresar tu PIN académico de alumno.
          </p>
        </div>

        {/* Custom Toggle Switch */}
        <button
          type="button"
          onClick={toggleBiometrics}
          id="btn-biometrics-toggle"
          className={`w-14 h-8 rounded-full p-1 transition-all duration-300 relative inline-flex items-center cursor-pointer ${
            isBiometricsEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-200'
          }`}
        >
          <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-all duration-300 flex items-center justify-center ${
            isBiometricsEnabled ? 'translate-x-6' : 'translate-x-0'
          }`}>
            <ShieldCheck className={`w-3.5 h-3.5 ${isBiometricsEnabled ? 'text-emerald-500' : 'text-slate-300'}`} />
          </div>
        </button>
      </div>

      {/* DEVICES ROW SECTION */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-widest">Dispositivos Vinculados</h3>
            <p className="text-[10px] text-slate-500">Historial de terminales autorizados para ingresar a tu Billetera Unipay UCH</p>
          </div>

          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            id="btn-toggle-add-device"
          >
            <PlusCircle className="w-4 h-4" /> Vincular Dispositivo
          </button>
        </div>

        {/* INPUT COLLAPSIBLE COMPONENT TO ADD DISPOSITIVO */}
        {isAdding && (
          <form onSubmit={handleAddDevice} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
            <h4 className="text-[11px] font-bold text-slate-600 uppercase">Vincular nuevo terminal móvil</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase block font-bold text-slate-400">Nombre de dispositivo</label>
                <input
                  type="text"
                  placeholder="Huawei P40 Lite"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#002b49] text-xs"
                  id="input-device-new-name"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase block font-bold text-slate-400">Sistema Operativo</label>
                <select
                  value={newDeviceSo}
                  onChange={(e) => setNewDeviceSo(e.target.value)}
                  className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg outline-none text-xs"
                  id="select-device-new-so"
                >
                  {sysOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="py-1 px-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs text-slate-600 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="py-1 px-4 bg-[#002b49] hover:bg-[#001c30] text-white rounded-lg text-xs font-bold transition"
                id="btn-submit-vincular-dispositivo"
              >
                Vincular
              </button>
            </div>
          </form>
        )}

        {/* DEVICES LIST */}
        <div className="space-y-3">
          {devices.map((dev) => (
            <div 
              key={dev.id}
              className="p-4 rounded-xl border border-slate-100 flex items-center justify-between gap-3 bg-slate-50/40 hover:bg-slate-50 transition"
              id={`device-row-${dev.id}`}
            >
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                  <Smartphone className="w-5 h-5" />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800">{dev.nombreDispositivo}</span>
                    {dev.esDispositivoActual ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 font-sans text-[8px] font-bold uppercase border border-emerald-500/30">DISPOSITIVO ACTUAL</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-[#002b49]/10 text-[#002b49] font-sans text-[8px] font-bold uppercase">AUTORIZADO</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    <span>{dev.sistemaOperativo}</span>
                    <span className="mx-1">•</span>
                    <span>Acceso: {new Date(dev.ultimoAcceso).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Action delete */}
              {!dev.esDispositivoActual && (
                <button
                  type="button"
                  id={`btn-unlink-device-${dev.id}`}
                  onClick={() => desvincularDispositivo(dev.id)}
                  className="p-1.5 border border-slate-200 hover:border-blue-200 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                  title="Eliminar vinculación segura"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* MÓDULO DE AUDITORÍA Y SEGURIDAD DESCRITO EN PDF */}
      <SecurityAuditorPanel />

      {/* SECURITY METADATA POLICY TIPS */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3 text-xs justify-center max-w-lg mx-auto">
        <Lock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-[#002b49]">Regulaciones de la Oficina de Seguridad Digital:</h4>
          <p className="text-[10px] text-slate-500 leading-normal font-normal">
            La Billetera Unipay UCH implementa encriptación de extremo a extremo (E2EE) con tokens JWT dinámicos de corta duración. En caso de inactividad por más de 5 minutos, la sesión de tu billetera se cerrará de forma segura automáticamente para prevenir fraudes académicos o robos físicos en áreas de esparcimiento del campus.
          </p>
        </div>
      </div>

    </div>
  );
};

// Extracted internal auditor component aligned with UCH Page 4 report specifications
const SecurityAuditorPanel: React.FC = () => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<'none' | 'success'>('none');

  const runAuditSimulator = () => {
    setIsAuditing(true);
    setAuditResult('none');
    setTimeout(() => {
      setIsAuditing(false);
      setAuditResult('success');
    }, 1500);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
            <h3 className="font-bold text-xs text-slate-850 uppercase tracking-widest leading-none">Módulo de Auditoría y Seguridad</h3>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Control inteligente automático de prevención de movimientos sospechosos</p>
        </div>
        <span className="text-[9.5px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
          ● EN LÍNEA
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-semibold">
        {/* Compliance checklist */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Reglas vigiladas en tiempo real:</span>
          
          <div className="space-y-1.5 text-[11.5px] text-slate-700 font-sans">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Prevención de QR duplicados</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Verificación de IP institucional UCH</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Monitoreo de montos sospechosos (&gt; S/ 500)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Control de firmas JWT de carné</span>
            </div>
          </div>
        </div>

        {/* Execution console and loader */}
        <div className="flex flex-col items-center justify-center p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-3">
          <div className="space-y-1">
            <span className="font-bold text-slate-705 block text-xs">¿Deseas verificar tus saldos y credenciales?</span>
            <p className="text-[9.5px] text-slate-400 leading-normal font-normal">Ejecuta el motor inteligente para validar tokens de transacciones.</p>
          </div>

          <button
            type="button"
            disabled={isAuditing}
            onClick={runAuditSimulator}
            className={`w-full py-2 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              isAuditing 
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                : 'bg-[#002b49] hover:bg-[#001c30] text-white cursor-pointer shadow-xs'
            }`}
            id="btn-run-manual-audit"
          >
            {isAuditing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Verificando firmas y saldos UCH...</span>
              </>
            ) : (
              'Ejecutar Auditoría de Transacciones'
            )}
          </button>

          {auditResult === 'success' && (
            <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg text-[10px] font-semibold w-full leading-snug animate-fade-in font-normal">
              ✔️ ¡Dispositivo y Saldos Auditados! No se detectó ninguna actividad inusual ni duplicada en las últimas 48 horas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
