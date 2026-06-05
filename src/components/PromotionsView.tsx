/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { 
  ArrowLeft, 
  Gift, 
  Copy, 
  Check, 
  Clock, 
  Tag, 
  Heart, 
  ShieldAlert,
  Ticket
} from 'lucide-react';
import { motion } from 'motion/react';
import { Promotion } from '../types';

interface PromotionsViewProps {
  onBack: () => void;
}

export const PromotionsView: React.FC<PromotionsViewProps> = ({ onBack }) => {
  const { promotions } = useWallet();
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const handleCopyCoupon = (code: string) => {
    setCopiedCoupon(code);
    navigator.clipboard?.writeText?.(code);
    
    // reset after delay
    setTimeout(() => {
      setCopiedCoupon(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full transition text-slate-600"
          id="btn-back-promociones"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Campaña de Beneficios y Descuentos</h2>
          <p className="text-xs text-slate-500">Beneficios exclusivos pagando con tu Billetera Universitaria UCH en el campus</p>
        </div>
      </div>

      {/* DISCOUNTS GRID LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {promotions.map((promo) => {
          const isCopied = copiedCoupon === promo.codigoCupon;
          
          return (
            <div 
              key={promo.id}
              className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden relative flex flex-col justify-between group hover:border-blue-200 transition duration-300"
            >
              {/* Highlight ribbon design */}
              <div className="absolute top-4 right-4 bg-[#002b49] text-white font-mono font-black text-[10px] px-2.5 py-1 rounded-full shadow-md z-1">
                {promo.descuentoText}
              </div>

              {/* Promo Context */}
              <div className="p-5 space-y-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500">
                  <Gift className="w-5 h-5" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-bold text-xs text-slate-800 tracking-tight group-hover:text-blue-600 transition leading-tight">
                    {promo.titulo}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                    {promo.descripcion}
                  </p>
                </div>

                {/* Conditions dropdown simulation */}
                <div className="border-t border-slate-100/70 pt-2.5 text-[10px] text-slate-400 space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Establecimiento:</span>
                    <span className="text-[#002b49]">{promo.commerce}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vigencia:</span>
                    <span className="font-mono text-slate-500">Hasta {promo.fechaFin}</span>
                  </div>
                </div>
              </div>

              {/* Coupon code copy footer section */}
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Código de cupón</span>
                  <span className="font-mono text-xs font-black text-[#002b49]">{promo.codigoCupon}</span>
                </div>

                <button
                  type="button"
                  id={`btn-copy-coupon-${promo.codigoCupon}`}
                  onClick={() => handleCopyCoupon(promo.codigoCupon)}
                  className={`py-1.5 px-3 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                    isCopied 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-blue-500" /> Copiar código
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER NOTICE ON CONDITIONS */}
      <div className="p-4 bg-[#002b49]/5 border border-[#002b49]/15 rounded-xl flex gap-3 items-start max-w-xl mx-auto">
        <Ticket className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-xs text-slate-800">Términos del Fondo de Bienestar Estudiantil:</h4>
          <p className="text-[10px] text-slate-500 leading-relaxed font-normal">
            Todos los cupones y descuentos son subsidiados por la Oficina de Dirección Universitaria para incentivar la alfabetización digital mediante la Billetera Unipay UCH. En caso de discrepancias en los precios facturados por los concesionarios autorizados, puedes radicar un reclamo inmediato con tu boleta digital en el módulo de Soporte.
          </p>
        </div>
      </div>

    </div>
  );
};
