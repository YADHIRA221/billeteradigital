/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { 
  ArrowLeft, 
  QrCode, 
  CheckCircle, 
  AlertCircle, 
  Coins, 
  Sparkles, 
  Lock, 
  Info,
  ChevronRight,
  Calculator
} from 'lucide-react';
import { motion } from 'motion/react';
import { Transaction, TransactionCategory } from '../types';

interface QrPaymentViewProps {
  onBack: () => void;
  onNavigateToRecarga: () => void;
}

interface CampusMerchant {
  id: string;
  name: string;
  item: string;
  price: number;
  category: TransactionCategory;
  code: string;
}

const MEMORIZED_MERCHANTS: CampusMerchant[] = [
  { id: "mer-01", name: "Cafetería Principal Pabellón A", item: "Menú Ejecutivo Estudiantil", price: 11.50, category: "Alimentación", code: "QR-UCH-CAFEPVA" },
  { id: "mer-02", name: "Fotocopiadora Pabellón B", item: "Anillado Impreso Sílabos CICLO VIII", price: 4.80, category: "Fotocopias", code: "QR-UCH-COPYPVB" },
  { id: "mer-03", name: "Librería Central Universitaria", item: "Balotario de Ejercicios de Física III", price: 15.00, category: "Fotocopias", code: "QR-UCH-LIBBOOKS" },
  { id: "mer-04", name: "Catering y Café Pabellón C", item: "Combo Desayuno (Café + Sándwich de Pavo)", price: 7.50, category: "Alimentación", code: "QR-UCH-CATERC" },
  { id: "mer-05", name: "Feria Tecnológica - Auditorio UCH", item: "Entrada General Ponencias IA", price: 20.00, category: "Eventos", code: "QR-UCH-FERIATEC" }
];

export const QrPaymentView: React.FC<QrPaymentViewProps> = ({ onBack, onNavigateToRecarga }) => {
  const { wallet, pagarConQR } = useWallet();
  const [step, setStep] = useState<'scan' | 'confirm' | 'processing' | 'success'>('scan');
  
  // States of Scan info
  const [selectedMerchant, setSelectedMerchant] = useState<CampusMerchant | null>(null);
  const [customQrCodeString, setCustomQrCodeString] = useState('');
  const [isLaserMoving, setIsLaserMoving] = useState(true);
  const [errorText, setErrorText] = useState('');
  const [processedTx, setProcessedTx] = useState<Transaction | null>(null);

  // Coupon States for Qr Payment
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccessMsg, setCouponSuccessMsg] = useState('');

  // For visual scanning simulation loader
  useEffect(() => {
    let timer: any;
    if (step === 'scan' && selectedMerchant) {
      // Simulate scan recognition delay
      timer = setTimeout(() => {
        setStep('confirm');
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [selectedMerchant, step]);

  const handleSelectMerchant = (merchant: CampusMerchant) => {
    setErrorText('');
    setPromoCodeInput('');
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponError('');
    setCouponSuccessMsg('');
    setSelectedMerchant(merchant);
  };

  const handleCustomQrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setPromoCodeInput('');
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponError('');
    setCouponSuccessMsg('');
    
    if (!customQrCodeString.trim()) return;

    // Parse mock qr e.g. UCH-STORE:15.50
    const str = customQrCodeString.trim();
    if (str.includes(':')) {
      const parts = str.split(':');
      const name = parts[0].replace(/-/g, ' ');
      const price = parseFloat(parts[1]);
      if (!isNaN(price) && price > 0) {
        setSelectedMerchant({
          id: "custom",
          name: name || "Comercio Asociado UCH",
          item: "Consumo General QR",
          price,
          category: "Otros",
          code: "QR-CUSTOM-" + Math.floor(Math.random() * 1000)
        });
        setStep('confirm');
        return;
      }
    }
    setErrorText('Formato QR no reconocido. Intenta con un formato válido, p. ej., "CAFETERIA-UCH:12.50"');
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    setCouponSuccessMsg('');
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) {
      setCouponError('Por favor ingresa un código.');
      return;
    }
    if (!selectedMerchant) return;

    if (code === 'UCHMENU15') {
      const isFood = selectedMerchant.category === 'Alimentación' || 
                      selectedMerchant.name.toLowerCase().includes('cafetería') || 
                      selectedMerchant.name.toLowerCase().includes('catering') ||
                      selectedMerchant.name.toLowerCase().includes('cafe');
      if (!isFood) {
        setCouponError('Este cupón solo es aplicable en consumo de alimentos/bebidas (Cafeterías).');
        return;
      }
      const disc = parseFloat((selectedMerchant.price * 0.15).toFixed(2));
      setDiscountAmount(disc);
      setAppliedCoupon(code);
      setCouponSuccessMsg('¡Cupón UCHMENU15 aplicado con éxito! (15% de descuento)');
    } else if (code === 'UCHCOPIA10') {
      const isCopy = selectedMerchant.category === 'Fotocopias' || 
                      selectedMerchant.name.toLowerCase().includes('fotocopiadora') || 
                      selectedMerchant.name.toLowerCase().includes('librería');
      if (!isCopy) {
        setCouponError('Este cupón solo es aplicable para fotocopias, impresiones o útiles.');
        return;
      }
      const disc = parseFloat((selectedMerchant.price * 0.10).toFixed(2));
      setDiscountAmount(disc);
      setAppliedCoupon(code);
      setCouponSuccessMsg('¡Cupón UCHCOPIA10 aplicado con éxito! (10% de descuento)');
    } else if (code === 'UCHLIBROS20') {
      const isBooks = selectedMerchant.name.toLowerCase().includes('librería') || 
                      selectedMerchant.name.toLowerCase().includes('libros') || 
                      selectedMerchant.name.toLowerCase().includes('feria');
      if (!isBooks) {
        setCouponError('Este cupón solo es aplicable en la Librería Universitaria y Eventos de libros.');
        return;
      }
      const disc = parseFloat((selectedMerchant.price * 0.20).toFixed(2));
      setDiscountAmount(disc);
      setAppliedCoupon(code);
      setCouponSuccessMsg('¡Cupón UCHLIBROS20 aplicado con éxito! (20% de descuento)');
    } else if (code === 'UCHARTE10') {
      const disc = Math.min(selectedMerchant.price, 10.00);
      setDiscountAmount(disc);
      setAppliedCoupon(code);
      setCouponSuccessMsg('¡Cupón UCHARTE10 aplicado con éxito! (S/ 10.00 de descuento)');
    } else {
      setCouponError('Código de cupón inválido o inexistente. Revisa la pestaña de "Promociones" para copiar códigos vigentes.');
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedMerchant) return;
    setErrorText('');
    setStep('processing');

    const finalPrice = parseFloat((selectedMerchant.price - discountAmount).toFixed(2));

    try {
      const tx = await pagarConQR(
        selectedMerchant.name, 
        finalPrice, 
        selectedMerchant.category
      );
      setProcessedTx(tx);
      setTimeout(() => {
        setStep('success');
      }, 1300);
    } catch (err: any) {
      setStep('confirm');
      setErrorText(err.message || 'Error al procesar el pago QR.');
    }
  };

  const currentBalance = wallet ? wallet.saldoDisponible : 0;
  const finalPriceToPay = selectedMerchant ? parseFloat((selectedMerchant.price - discountAmount).toFixed(2)) : 0;
  const isBalanceSufficient = selectedMerchant ? currentBalance >= finalPriceToPay : false;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => {
            if (step === 'confirm') {
              setStep('scan');
              setSelectedMerchant(null);
            } else {
              onBack();
            }
          }}
          className="p-2 hover:bg-slate-100 rounded-full transition text-slate-600"
          id="btn-back-qr"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Escaneo y Pago QR</h2>
          <p className="text-xs text-slate-500">Paga al instante en establecimientos oficiales de la UCH</p>
        </div>
      </div>

      {step === 'scan' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* VISUAL SCANNER SIMULATION PORT */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden h-[340px] text-white">
            {/* Ambient grid background */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
            
            {/* Scan Box Target */}
            <div className="relative w-52 h-52 border-2 border-slate-700 rounded-xl flex items-center justify-center bg-black/40 z-10 p-4">
              {/* Corner indicators */}
              <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-4 border-l-4 border-cyan-500 rounded-tl-md"></div>
              <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-4 border-r-4 border-cyan-500 rounded-tr-md"></div>
              <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-4 border-l-4 border-cyan-500 rounded-bl-md"></div>
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-4 border-r-4 border-cyan-500 rounded-br-md"></div>
              
              {/* Spinning / sweeping scan line */}
              {isLaserMoving && (
                <motion.div 
                  initial={{ y: -90 }}
                  animate={{ y: 90 }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 2, ease: "easeInOut" }}
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                ></motion.div>
              )}

              {/* Central Code Icon */}
              <QrCode className="w-24 h-24 text-slate-500 opacity-60 animate-pulse" />
            </div>

            {/* Instruction Labels */}
            <div className="text-center mt-4 space-y-1 z-10">
              <span className="text-[10px] font-bold text-cyan-550 text-cyan-500 uppercase tracking-widest block">Lectura Activa</span>
              <p className="text-xs text-slate-300">Apunta tu cámara al código QR impreso en el mostrador</p>
            </div>
            
            {/* Quick simulate alert if commerce is selected */}
            {selectedMerchant && (
              <div className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 rounded-full border-4 border-t-transparent border-cyan-500 animate-spin"></div>
                <div className="text-center">
                  <span className="text-xs font-bold text-cyan-400 block uppercase">Código QR Detectado</span>
                  <p className="text-[11px] text-slate-400">{selectedMerchant.name}</p>
                </div>
              </div>
            )}
          </div>

          {/* SIMULATE MERCHANT ROW */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-3 shadow-xs">
              <div className="flex gap-2 items-center">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Simulador de Códigos QR Unipay UCH</h3>
              </div>
              <p className="text-xs text-slate-500">
                Selecciona uno de los comercios más comunes del campus para simular que escaneas su código de barra o QR QR-code:
              </p>

              {/* Merchant buttons */}
              <div className="divide-y divide-slate-100 max-h-[190px] overflow-y-auto pr-1">
                {MEMORIZED_MERCHANTS.map((m) => (
                  <div 
                    key={m.id}
                    onClick={() => handleSelectMerchant(m)}
                    className="flex justify-between items-center py-2.5 cursor-pointer hover:bg-slate-50 rounded px-1.5 transition"
                    id={`simulate-qr-${m.id}`}
                  >
                    <div>
                      <span className="font-semibold text-xs text-slate-800 block">{m.name}</span>
                      <span className="text-[10px] text-slate-400 block italic">{m.item}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-800 font-mono font-bold text-xs">S/ {m.price.toFixed(2)}</span>
                      <span className="text-[9px] text-cyan-600 block font-semibold">{m.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MANUAL MOCK TEXT SCANNER INPUT */}
            <form onSubmit={handleCustomQrSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
              <div className="flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-slate-500" />
                <label className="text-[10px] font-bold text-slate-400 uppercase">¿Quieres probar ingresando URL o texto manual?</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="CAFETERIA-PABELLON-B:12.50"
                  value={customQrCodeString}
                  onChange={(e) => setCustomQrCodeString(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-[#002b49] font-mono"
                  id="input-manual-qr"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold transition"
                  id="btn-submit-manual-qr"
                >
                  Procesar
                </button>
              </div>
              {errorText && (
                <span className="text-[9px] text-rose-500 block font-medium">{errorText}</span>
              )}
            </form>
          </div>

        </div>
      )}

      {/* STEP CONFIRM TRANSACTION */}
      {step === 'confirm' && selectedMerchant && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md max-w-md mx-auto space-y-5">
          <div className="text-center space-y-1.5">
            <span className="text-[10px] bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Confirmación de Pago QR</span>
            <h3 className="font-bold text-base text-slate-800 mt-2">{selectedMerchant.name}</h3>
            <p className="text-xs text-slate-500">{selectedMerchant.item}</p>
          </div>

          {/* Pricing Summary */}
          <div className="p-4 bg-slate-50 rounded-xl space-y-2.5 border border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Monto original:</span>
              <span className="font-mono text-slate-600">S/ {selectedMerchant.price.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded">
                <span>Descuento aplicado ({appliedCoupon}):</span>
                <span className="font-mono">- S/ {discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-xs text-slate-700 font-bold">Total a pagar:</span>
              <span className="text-xl font-mono font-black text-blue-600">S/ {finalPriceToPay.toFixed(2)}</span>
            </div>

            <div className="border-t border-slate-200/55 pt-2.5 flex justify-between items-center text-xs">
              <span className="text-slate-400">Tu saldo disponible:</span>
              <span className={`font-bold font-mono ${isBalanceSufficient ? 'text-emerald-600' : 'text-rose-600'}`}>
                S/ {currentBalance.toFixed(2)}
              </span>
            </div>
          </div>

          {/* COUPON INPUT COMPONENT */}
          <div className="p-3.5 bg-blue-50/30 border border-blue-100 rounded-xl space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">¿Tienes un código de descuento?</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ej: UCHMENU15"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                disabled={!!appliedCoupon}
                className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#002b49] font-mono uppercase"
                id="input-confirm-promo-code"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={!!appliedCoupon}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  appliedCoupon 
                    ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed' 
                    : 'bg-[#002b49] hover:bg-[#001c30] text-white cursor-pointer'
                }`}
                id="btn-apply-promo-code"
              >
                {appliedCoupon ? 'Aplicado' : 'Aplicar'}
              </button>
            </div>
            {couponError && (
              <span className="text-[10px] text-rose-500 block font-medium mt-1">{couponError}</span>
            )}
            {couponSuccessMsg && (
              <span className="text-[10px] text-emerald-600 block font-medium mt-1">{couponSuccessMsg}</span>
            )}
            {!appliedCoupon && (
              <span className="text-[9px] text-slate-400 block leading-tight">
                * Puedes copiar códigos de cupón activos (ej: UCHMENU15, UCHCOPIA10, UCHLIBROS20) de la pestaña de Promociones.
              </span>
            )}
          </div>

          {!isBalanceSufficient ? (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl space-y-2.5 border border-rose-100/60">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>¡Saldo Insuficiente en Billetera!</span>
              </div>
              <p className="text-[11px] text-rose-600 leading-normal">
                No tienes saldo suficiente para pagar esta compra (S/ {finalPriceToPay.toFixed(2)}). Realiza una recarga segura por Yape o Tarjeta de inmediato para continuar.
              </p>
              <button 
                type="button"
                onClick={onNavigateToRecarga}
                className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider transition"
                id="btn-navigate-to-recarga-from-qr"
              >
                Recargar Saldo Ahora
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2 items-center text-[10px] text-slate-500 bg-slate-100/55 p-3 rounded-xl border border-slate-100">
                <Info className="w-4 h-4 text-[#002b49] shrink-0" />
                <p>Al confirmar, se descontará de manera inmediata de tu saldo disponible. Recibirás un comprobante digital.</p>
              </div>

              {errorText && (
                <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg text-xs flex items-center gap-1 border border-rose-100">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorText}</span>
                </div>
              )}

              {/* Action grid button confirmation */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep('scan');
                    setSelectedMerchant(null);
                    setAppliedCoupon(null);
                    setDiscountAmount(0);
                    setPromoCodeInput('');
                    setCouponError('');
                    setCouponSuccessMsg('');
                  }}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 font-bold text-xs transition"
                  id="btn-qr-confirm-cancelar"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="py-2.5 bg-[#002b49] hover:bg-[#001c30] text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                  id="btn-qr-confirm-autorizar"
                >
                  <Lock className="w-3.5 h-3.5" /> Confirmar Pago
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* STEP PROCESSING PAYMENT */}
      {step === 'processing' && (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="w-16 h-16 border-4 border-[#002b49] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h3 className="font-bold text-slate-800">Transfiriendo Fondos</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Por favor, espera. Estamos comunicándonos de forma segura con el terminal del comercio y acreditando la transacción.
          </p>
        </div>
      )}

      {/* STEP SUCCESS VOUCHER DISPLAY */}
      {step === 'success' && processedTx && selectedMerchant && (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden max-w-md mx-auto"
        >
          {/* Header check */}
          <div className="bg-gradient-to-tr from-[#002b49] to-[#041e42] text-white p-6 text-center space-y-2 relative">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-xl font-bold text-white shadow-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg font-sans">¡Pago por QR Exitoso!</h3>
            <p className="text-xs text-slate-300">Comprobante de transacción electrónica interna UCH</p>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Big Amount details */}
            <div className="text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monto Descontado</span>
              <div className="text-3xl font-black font-mono text-slate-850 font-semibold text-blue-600">
                - S/ {processedTx.monto.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Billetera Unipay UCH</div>
            </div>

            {/* Receipt Parameters Grid */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Establecimiento:</span>
                <span className="font-bold text-slate-700">{processedTx.descripcion.replace(' (Pago QR)', '')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Producto / Servicio:</span>
                <span className="font-semibold text-slate-600 text-right max-w-[170px] truncate">{selectedMerchant.item}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Código Operación:</span>
                <span className="font-mono font-bold text-blue-600 bg-blue-50 px-1 rounded">{processedTx.codigoOperacion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fecha y Hora:</span>
                <span className="font-mono text-slate-600">{processedTx.fecha} • {processedTx.hora}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Canal de cobro:</span>
                <span className="font-semibold text-slate-600">Billetera Unipay QR</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 leading-snug text-center">
              * El comercio ha recibido tu confirmación en su pantalla de cobros. Puedes retirar tu producto sin colas ni firma adicional.
            </p>

            {/* Action buttons */}
            <button
              type="button"
              id="btn-qr-success-entendido"
              onClick={() => {
                setStep('scan');
                setSelectedMerchant(null);
                onBack();
              }}
              className="w-full py-3 bg-[#002b49] hover:bg-[#001c30] text-white font-bold rounded-xl text-xs transition"
            >
              Entendido
            </button>

          </div>
        </motion.div>
      )}

    </div>
  );
};
