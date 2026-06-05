/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { StudentCard } from './StudentCard';
import { 
  ArrowLeft, 
  Settings, 
  User, 
  BookOpen, 
  Camera, 
  ShieldAlert, 
  RefreshCw, 
  QrCode,
  Image as ImageIcon
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileViewProps {
  onBack: () => void;
}

const CAREERS_LIST_UCH = [
  "Ingeniería de Sistemas e Informática",
  "Ingeniería Industrial",
  "Contabilidad con mención en Tributación",
  "Administración de Empresas",
  "Enfermería",
  "Educación Inicial",
  "Psicología"
];

const CYCLES_LIST_UCH = [
  "I Ciclo",
  "II Ciclo",
  "III Ciclo",
  "IV Ciclo",
  "V Ciclo",
  "VI Ciclo",
  "VII Ciclo",
  "VIII Ciclo",
  "IX Ciclo",
  "X Ciclo"
];

const AVATAR_PRESETS = [
  { name: "Sistemas / Casual", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" },
  { name: "Administración", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" },
  { name: "Ingeniería / Lentes", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" },
  { name: "Psicología / Sonrisa", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" }
];

export const ProfileView: React.FC<ProfileViewProps> = ({ onBack }) => {
  const { student, updateProfilePhoto, resetAppState, login } = useWallet();

  const [carrera, setCarrera] = useState(student?.carrera || "Ingeniería de Sistemas e Informática");
  const [ciclo, setCiclo] = useState(student?.cicloAcademico || "VIII Ciclo");
  
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!student) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-xs">
        <p className="text-sm text-slate-500">Cargando credenciales del alumno...</p>
      </div>
    );
  }

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);

    // Simulate update in context / localStorage
    student.carrera = carrera;
    student.cicloAcademico = ciclo;
    localStorage.setItem('uch_wallet_student', JSON.stringify(student));

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  const handleSelectPresetPhoto = (url: string) => {
    updateProfilePhoto(url);
  };

  const handleCustomPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPhotoUrl.trim()) return;
    updateProfilePhoto(customPhotoUrl.trim());
    setCustomPhotoUrl('');
  };

  const handleResetData = () => {
    const confirmation = window.confirm("¿Seguro(a) que deseas reiniciar los datos de tu Billetera UCH a sus valores de fábrica de demostración?");
    if (confirmation) {
      resetAppState();
      alert("La aplicación ha sido reestablecida al estado demo con S/ 83.20 de saldo y movimientos por defecto.");
      onBack();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition text-slate-600"
            id="btn-back-perfil"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Identidad y Perfil UCH</h2>
            <p className="text-[11px] text-slate-500">Carné virtual de alumno y configuración de matrícula escolar</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetData}
          className="px-2.5 py-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-lg transition uppercase cursor-pointer"
          id="btn-profile-reset-app"
        >
          Resetear Demo 💀
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* CARNÉ VIRTUAL COLUMN (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <StudentCard student={student} />
        </div>

        {/* PROFILE CREDENTIAL SETTINGS (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* PROFILE DATA FORM */}
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 space-y-4">
            <div className="flex gap-2 items-center pb-2 border-b border-slate-100">
              <Settings className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-widest">Ajustes Académicos</h3>
            </div>

            <form onSubmit={handleSaveChanges} className="space-y-4 text-xs font-semibold">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Carrera Dropdown */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Escuela Profesional / Carrera</label>
                  <select
                    value={carrera}
                    onChange={(e) => setCarrera(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer focus:bg-white"
                    id="select-profile-carrera"
                  >
                    {CAREERS_LIST_UCH.map((car) => (
                      <option key={car} value={car}>{car}</option>
                    ))}
                  </select>
                </div>

                {/* Ciclo Dropdown */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Ciclo Académico Actual</label>
                  <select
                    value={ciclo}
                    onChange={(e) => setCiclo(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer focus:bg-white"
                    id="select-profile-ciclo"
                  >
                    {CYCLES_LIST_UCH.map((cy) => (
                      <option key={cy} value={cy}>{cy}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Static Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-[10px]">
                <div>
                  <span className="text-slate-400 block uppercase">Código Alumno:</span>
                  <span className="font-bold text-slate-700">{student.codigoUniversitario}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase">Correo UCH:</span>
                  <span className="font-bold text-slate-700 truncate block">{student.correoInstitucional}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase">Estado Registro:</span>
                  <span className="font-bold text-emerald-600 block uppercase">{student.estadoMatricula}</span>
                </div>
              </div>

              {saveSuccess && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border border-emerald-100">
                  <span>✓ Datos de matrícula actualizados. Revisa tu carné interactivo al lado izquierdo para ver los cambios instantáneamente.</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition uppercase tracking-wider"
                id="btn-profile-save-details"
              >
                Actualizar Carnet Virtual
              </button>

            </form>
          </div>

          {/* AVATAR PHOTO EDITOR */}
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 space-y-4">
            <div className="flex gap-2 items-center pb-2 border-b border-slate-100">
              <Camera className="w-4 h-4 text-cyan-500" />
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-widest">Fotografía de Perfil</h3>
            </div>

            {/* Presets Gallery Grid */}
            <div className="space-y-3 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Seleccionar de retratos demostrativos</span>
              <div className="grid grid-cols-4 gap-3">
                {AVATAR_PRESETS.map((preset, idx) => {
                  const isActive = student.fotoPerfil === preset.url;
                  
                  return (
                    <div 
                      key={idx}
                      onClick={() => handleSelectPresetPhoto(preset.url)}
                      className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition ${
                        isActive ? 'border-blue-500 scale-105 shadow-md' : 'border-slate-100 filter grayscale-[40%] hover:grayscale-0'
                      }`}
                      id={`preset-avatar-${idx}`}
                    >
                      <img 
                        src={preset.url} 
                        alt={preset.name} 
                        className="w-full h-14 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[7.5px] text-center w-full block bg-slate-900/70 text-white truncate px-0.5 py-0.5 absolute bottom-0">
                        {preset.name.split('/')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Custom Image URL paste option */}
              <form onSubmit={handleCustomPhotoSubmit} className="space-y-1.5 pt-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" /> O pega una URL de imagen personalizada (Unsplash/Imgur)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#002b49] rounded-lg text-xs outline-none"
                    id="input-custom-avatar-url"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#002b49] text-white hover:bg-[#001c30] text-xs font-bold rounded-lg transition"
                    id="btn-submit-custom-avatar"
                  >
                    Establecer
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
