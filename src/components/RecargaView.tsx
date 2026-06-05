/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  DollarSign, 
  Lock,
  Wallet,
  Coins
} from 'lucide-react';
import { motion } from 'motion/react';
import { Transaction } from '../types';

interface RecargaViewProps {
  onBack: () => void;
}

export const RecargaView: React.FC<RecargaViewProps> = ({ onBack }) => {
  const { recargarSaldo } = useWallet();
  const [monto, setMonto] = useState<number>(20);
  const [customMonto, setCustomMonto] = useState<string>('');
  const [metodo, setMetodo] = useState<'Yape' | 'Plin' | 'Tarjeta de Crédito' | 'Tarjeta de Débito' | 'Transferencia Bancaria'>('Yape');
  
  // Step workflow: 'input' -> 'processing' -> 'success'
  const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');
  const [receiptTx, setReceiptTx] = useState<Transaction | null>(null);

  // Form Fields
  const [celular, setCelular] = useState('999888777');
  const [codigoYape, setCodigoYape] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardDate, setCardDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fastAmounts = [10, 20, 50, 100, 200];

  const handleAmountSelect = (val: number) => {
    setMonto(val);
    setCustomMonto('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomMonto(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      setMonto(parsed);
    }
  };

  const validateAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (monto <= 0) {
      setErrorMessage('Por favor, ingresa un monto válido mayor a S/ 0.');
      return;
    }

    if (monto > 500) {
      setErrorMessage('El límite de recarga diaria es de S/ 500.00 por seguridad.');
      return;
    }

    // Interactive custom simulator validation
    if (metodo === 'Yape' || metodo === 'Plin') {
      if (!celular || celular.length !== 9 || !celular.startsWith('9')) {
        setErrorMessage('Ingresa un número de celular peruano válido (9 dígitos).');
        return;
      }
      if (metodo === 'Yape' && (!codigoYape || codigoYape.length !== 6)) {
        setErrorMessage('El código de aprobación de Yape debe tener 6 dígitos.');
        return;
      }
    } else if (metodo === 'Tarjeta de Crédito' || metodo === 'Tarjeta de Débito') {
      if (cardNumber.replace(/\s+/g, '').length < 16) {
        setErrorMessage('Número de tarjeta incompleto (se requieren 16 dígitos).');
        return;
      }
      if (!cardName) {
        setErrorMessage('Escribe el nombre del titular de la tarjeta.');
        return;
      }
      if (!cvv || cvv.length !== 3) {
        setErrorMessage('Código de seguridad CVV inválido.');
        return;
      }
    }

    // Proceed to loading processing
    setStep('processing');
    
    try {
      const tx = await recargarSaldo(monto, metodo);
      setReceiptTx(tx);
      setTimeout(() => {
        setStep('success');
      }, 1500); // extra realistic delay
    } catch (err: any) {
      setStep('input');
      setErrorMessage(err.message || 'Error al procesar la recarga.');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header with back */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full transition text-slate-600"
          id="btn-back-recarga"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Recarga de Saldo</h2>
          <p className="text-xs text-slate-500">Transfiere fondos de manera instantánea y segura</p>
        </div>
      </div>

      {step === 'input' && (
        <form onSubmit={validateAndSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          
          {/* MONTOS PRESET */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Selecciona el monto a recargar</label>
            <div className="grid grid-cols-5 gap-2">
              {fastAmounts.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleAmountSelect(val)}
                  id={`btn-preset-monto-${val}`}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition font-mono ${
                    monto === val && !customMonto 
                      ? 'bg-[#002b49] text-white shadow-xs' 
                      : 'bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  S/ {val}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="relative mt-2">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 font-mono">S/</span>
              <input
                type="number"
                step="0.01"
                placeholder="Ingresar otro monto"
                value={customMonto}
                onChange={handleCustomAmountChange}
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#002b49] focus:bg-white rounded-xl text-sm font-mono font-bold font-semibold outline-none transition"
                id="input-monto-personalizado"
              />
            </div>
          </div>

          {/* METODOS DE PAGO */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Método de recarga</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* YAPE */}
              <div 
                onClick={() => setMetodo('Yape')}
                className={`p-4 rounded-xl border cursor-pointer hover:border-[#833ab4]/40 transition relative flex items-center justify-between ${
                  metodo === 'Yape' ? 'border-purple-500 bg-purple-50/20' : 'border-slate-100 bg-slate-50/50'
                }`}
                id="method-select-yape"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white text-sm font-sans">
                    Y
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Yape Bancos</span>
                    <span className="text-[10px] text-slate-400 block">Aprobación de 6 dígitos</span>
                  </div>
                </div>
                {metodo === 'Yape' && <div className="w-2 h-2 rounded-full bg-purple-600"></div>}
              </div>

              {/* PLIN */}
              <div 
                onClick={() => setMetodo('Plin')}
                className={`p-4 rounded-xl border cursor-pointer hover:border-cyan-400/40 transition relative flex items-center justify-between ${
                  metodo === 'Plin' ? 'border-cyan-500 bg-cyan-50/25' : 'border-slate-100 bg-slate-50/50'
                }`}
                id="method-select-plin"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                    P
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Plin Digital</span>
                    <span className="text-[10px] text-slate-400 block">Transferencia instantánea</span>
                  </div>
                </div>
                {metodo === 'Plin' && <div className="w-2 h-2 rounded-full bg-cyan-500"></div>}
              </div>

              {/* TARJETA DE DEBITO */}
              <div 
                onClick={() => setMetodo('Tarjeta de Débito')}
                className={`p-4 rounded-xl border cursor-pointer hover:border-blue-300 transition relative flex items-center justify-between ${
                  metodo === 'Tarjeta de Débito' ? 'border-[#002b49] bg-blue-50/20' : 'border-slate-100 bg-slate-50/50'
                }`}
                id="method-select-debito"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#002b49]/10 text-[#002b49] flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Tarjeta de Débito</span>
                    <span className="text-[10px] text-slate-400 block">Visa, Mastercard, Amex, BCP</span>
                  </div>
                </div>
                {metodo === 'Tarjeta de Débito' && <div className="w-2 h-2 rounded-full bg-[#002b49]"></div>}
              </div>

              {/* TARJETA DE CREDITO */}
              <div 
                onClick={() => setMetodo('Tarjeta de Crédito')}
                className={`p-4 rounded-xl border cursor-pointer hover:border-indigo-300 transition relative flex items-center justify-between ${
                  metodo === 'Tarjeta de Crédito' ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-100 bg-slate-50/50'
                }`}
                id="method-select-credito"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Tarjeta de Crédito</span>
                    <span className="text-[10px] text-slate-400 block">Hasta 12 cuotas sin interés</span>
                  </div>
                </div>
                {metodo === 'Tarjeta de Crédito' && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
              </div>

            </div>
          </div>

          {/* DYNAMIC SUBFLOW INPUTS BASED ON METHOD */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
            
            {/* PHONE BASED METRICS */}
            {(metodo === 'Yape' || metodo === 'Plin') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Número Celular</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">+51</span>
                    <input
                      type="tel"
                      value={celular}
                      onChange={(e) => setCelular(e.target.value.replace(/\D/g, '').slice(0, 9))}
                      placeholder="999888777"
                      className="w-full pl-11 pr-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#002b49] bg-white font-mono"
                      id="input-recarga-celular"
                    />
                  </div>
                </div>

                {metodo === 'Yape' && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Código de aprobación Yape</label>
                    <input
                      type="text"
                      placeholder="6 dígitos de tu app Yape"
                      value={codigoYape}
                      onChange={(e) => setCodigoYape(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#002b49] bg-white font-mono"
                      id="input-recarga-codigo-yape"
                    />
                    <span className="text-[9px] text-slate-400 block">Abre Yape, entra al menú lateral y pulsa "Código de aprobación".</span>
                  </div>
                )}
              </div>
            )}

            {/* CARD BASED DETAILS */}
            {(metodo === 'Tarjeta de Crédito' || metodo === 'Tarjeta de Débito') && (
              <div className="space-y-4 text-xs">
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase block font-bold text-slate-400">Número de Tarjeta</label>
                  <input
                    type="text"
                    placeholder="4152 •••• •••• ••••"
                    value={cardNumber}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                      const formatted = v.replace(/(.{4})/g, '$1 ').trim();
                      setCardNumber(formatted);
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-white font-mono text-xs"
                    id="input-card-number"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] uppercase block font-bold text-slate-400">Titular de Tarjeta</label>
                    <input
                      type="text"
                      placeholder="MILAGROS V. VALDIVIESO ALARCON"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-white uppercase text-xs"
                      id="input-card-name"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase block font-bold text-slate-400">CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={3}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-white font-mono text-center text-xs"
                      id="input-card-cvv"
                    />
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Secure indicator */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-100 p-2.5 rounded-lg justify-center border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encriptación SSL de 256 bits directa con pasarela bancaria</span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2 border border-rose-100 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ACTION SUBMIT */}
          <button
            type="submit"
            className="w-full py-3.5 bg-[#002b49] hover:bg-[#001c30] text-white font-bold rounded-xl text-sm transition shadow-md shadow-[#002b49]/20"
            id="btn-submit-recarga"
          >
            Confirmar Recarga de S/ {monto.toFixed(2)}
          </button>

        </form>
      )}

      {/* STEP PROCESSING */}
      {step === 'processing' && (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h3 className="font-bold text-slate-800">Procesando Recarga</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Por favor, no cierres la aplicación ni actualices el navegador. Estamos validando la transferencia con la red nacional interbancaria.
          </p>
        </div>
      )}

      {/* STEP SUCCESS VOUCHER DISPLAY */}
      {step === 'success' && receiptTx && (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden max-w-md mx-auto"
        >
          {/* Header check */}
          <div className="bg-emerald-600 text-white p-6 text-center space-y-2 relative">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg font-sans">¡Recarga Completada!</h3>
            <p className="text-xs text-emerald-100">Fondos acreditados instantáneamente a tu cuenta UCH</p>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Big Amount details */}
            <div className="text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monto Recargado</span>
              <div className="text-3xl font-black font-mono text-slate-800 font-semibold">
                S/ {receiptTx.monto.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Billetera Unipay UCH</div>
            </div>

            {/* Receipt Parameters Grid */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Código Operación:</span>
                <span className="font-mono font-bold text-blue-600 bg-blue-50 px-1 rounded">{receiptTx.codigoOperacion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Método de origen:</span>
                <span className="font-bold text-slate-700">{receiptTx.metodoUtilizado}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fecha de proceso:</span>
                <span className="font-mono text-slate-600">{receiptTx.fecha}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hora de proceso:</span>
                <span className="font-mono text-slate-600">{receiptTx.hora}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estado de cuenta:</span>
                <span className="text-emerald-600 font-bold">ACTIVO</span>
              </div>
            </div>

            {/* Note */}
            <p className="text-[10px] text-slate-500 leading-snug text-center">
              * Se ha enviado una constancia digital en PDF a tu correo institucional de alumno UCH. Guarda el código de operación para cualquier consulta.
            </p>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                id="btn-recarga-voucher-back"
                onClick={onBack}
                className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition text-center"
              >
                Volver al inicio
              </button>
              
              <button
                type="button"
                id="btn-recarga-voucher-print"
                onClick={() => {
                  alert(`Comprobante ${receiptTx.codigoOperacion} listo para imprimir en campus.`);
                }}
                className="py-2.5 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Descargar PDF
              </button>
            </div>

          </div>
        </motion.div>
      )}

    </div>
  );
};
