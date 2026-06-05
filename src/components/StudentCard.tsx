/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Estudiante } from '../types';
import { ShieldCheck, RefreshCw, CreditCard, Award, QrCode } from 'lucide-react';
import { motion } from 'motion/react';

interface StudentCardProps {
  student: Estudiante;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center p-2">
      {/* 3D Flippable Credential Container */}
      <div 
        className="w-full max-w-[340px] h-[480px] cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="relative w-full h-full duration-700"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* FRONT SIDE */}
          <div 
            className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-[#0c2340] via-[#002b49] to-[#041e42] shadow-2xl border-2 border-white/10 text-white flex flex-col justify-between overflow-hidden p-6"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Glossy Overlay and Background Circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-600/15 blur-xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-cyan-500/10 blur-xl"></div>
            
            {/* Header */}
            <div className="flex justify-between items-start border-b border-white/10 pb-4 z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center font-bold text-lg text-white shadow-md shadow-blue-600/30">
                  U
                </div>
                <div>
                  <div className="text-xs font-black tracking-wider leading-none text-blue-500">UCH</div>
                  <div className="text-[9px] text-white/60 font-medium">Univ. de Ciencias y Humanidades</div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-2 py-0.5 rounded bg-emerald-500/25 border border-emerald-500/30 text-[9px] font-semibold text-emerald-300 tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5" /> {student.estadoMatricula.toUpperCase()}
                </span>
                <span className="text-[8px] text-slate-400 mt-1">2026 - II</span>
              </div>
            </div>

            {/* Student Photo and QR Section */}
            <div className="flex flex-col items-center my-4 z-10">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 blur-[3px]"></div>
                <img 
                  src={student.fotoPerfil} 
                  alt={student.nombres} 
                  className="w-24 h-24 rounded-full border-2 border-slate-900 object-cover relative z-10"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 right-0 z-20 p-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-md">
                  <QrCode className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="text-center mt-3">
                <h3 className="font-bold text-lg leading-tight tracking-tight text-white line-clamp-1">
                  {student.nombres}
                </h3>
                <p className="text-sm font-semibold text-slate-200 mt-0.5">
                  {student.apellidos}
                </p>
                <div className="mt-1 text-slate-400 font-mono text-sm font-bold tracking-widest bg-black/30 px-3 py-0.5 rounded-full inline-block border border-white/5">
                  {student.codigoUniversitario}
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-2 text-xs z-10">
              <div className="flex justify-between">
                <span className="text-slate-400">Escuela Profesional:</span>
                <span className="font-semibold text-right max-w-[150px] truncate text-slate-200">{student.carrera}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ciclo Académico:</span>
                <span className="font-semibold text-slate-200">{student.cicloAcademico}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Documento de Identidad:</span>
                <span className="font-semibold font-mono text-slate-300">DNI: {student.dni}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-white/10 pt-3 z-10">
              <span className="flex items-center gap-1 text-blue-400 font-semibold uppercase tracking-wider">
                <Award className="w-3 h-3 text-cyan-400" /> Carné Oficial Universitario
              </span>
              <span className="flex items-center gap-1 group">
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow text-cyan-400" /> Voltear Credencial
              </span>
            </div>
          </div>

          {/* BACK SIDE */}
          <div 
            className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] shadow-2xl border-2 border-slate-700/50 text-white flex flex-col justify-between overflow-hidden p-6"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            {/* Technical Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl p-6"></div>

            {/* Back Header */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 z-10">
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center font-bold text-xs">U</div>
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">SISTEMAS UCH</span>
              </div>
              <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                ID: {student.id}
              </span>
            </div>

            {/* Barcode & Security Gate authentication QR */}
            <div className="flex flex-col items-center justify-center py-6 bg-slate-900/60 rounded-xl border border-slate-800 px-4 z-10 space-y-4">
              <div className="text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Acceso Autorizado Campus UCH
                </div>
                <div className="text-[9px] text-slate-500">
                  Escanee en torniquetes de ingreso y biblioteca
                </div>
              </div>

              {/* Pseudo Barcode */}
              <div className="bg-white p-3 rounded-md flex flex-col items-center w-full">
                <div className="flex justify-between items-stretch h-14 bg-white w-full px-1" style={{ imageRendering: 'pixelated' }}>
                  {/* Generate pseudo barcode rods */}
                  {[2,3,1,4,1,2,3,2,1,1,4,1,3,2,1,2,1,2,3,1,4,1,3,2,1,1,2,4,2,3,1].map((val, idx) => (
                    <div 
                      key={idx} 
                      className={`h-full ${idx % 2 === 0 ? 'bg-black' : 'bg-white'}`}
                      style={{ width: `${val * 1.5}px` }}
                    />
                  ))}
                </div>
                <div className="text-black font-mono text-xs tracking-[0.3em] font-bold mt-2">
                  *{student.codigoUniversitario}*
                </div>
              </div>

              {/* Quick info about digital signature */}
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Firmado digitalmente por Otic-UCH</span>
              </div>
            </div>

            {/* Security Terms and conditions */}
            <div className="text-[9px] text-slate-500 space-y-1 z-10">
              <p>• Este carné es personal e intransferible para el campus UCH en Los Olivos, Lima.</p>
              <p>• Permite acceder a las becas, talleres, comedores y pasaje escolar según Ley N° 26271.</p>
              <p>• En caso de pérdida, reportarlo de inmediato en tu Billetera UCH en el módulo de Soporte.</p>
            </div>

            {/* Back Footer */}
            <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-800 pt-3 z-10">
              <span className="font-semibold text-slate-400">EMISIÓN: 2026</span>
              <span className="flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-slate-500" /> Pulse para ver frente
              </span>
            </div>
          </div>
        </motion.div>
      </div>
      
      <p className="text-[11px] text-slate-500 mt-3 font-medium text-center flex items-center gap-1 animate-pulse">
        👆 Haz clic en el carné para voltearlo y ver su código de barras
      </p>
    </div>
  );
};
