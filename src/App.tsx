/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WalletProvider, useWallet, isValidStudentCode, generateStudentEmail } from './context/WalletContext';
import { 
  PlusCircle, 
  QrCode, 
  FileText, 
  Home, 
  History, 
  BarChart2, 
  Gift, 
  ShieldCheck, 
  HelpCircle, 
  LogOut, 
  User, 
  Bell, 
  Clock as ClockIcon, 
  Unlock, 
  AlertCircle,
  Menu,
  X,
  Sparkles,
  BookOpen,
  Mail,
  Fingerprint,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Views
import { DashboardView } from './components/DashboardView';
import { RecargaView } from './components/RecargaView';
import { QrPaymentView } from './components/QrPaymentView';
import { ServicesView } from './components/ServicesView';
import { HistoryView } from './components/HistoryView';
import { StatsView } from './components/StatsView';
import { PromotionsView } from './components/PromotionsView';
import { SecurityView } from './components/SecurityView';
import { SupportView } from './components/SupportView';
import { ProfileView } from './components/ProfileView';
import { GrupalesView } from './components/GrupalesView';

// Subcomponents
function CampusWalletApp() {
  const { 
    student, 
    wallet, 
    notifications, 
    marcarNotificacionLeida, 
    marcarTodasNoticacionesLeidas, 
    isLoggedIn, 
    login, 
    registerStudent, 
    logout, 
    isLoading 
  } = useWallet();

  // Active View Switcher state
  const [activeView, setActiveView] = useState<'dashboard' | 'recarga' | 'qr' | 'servicios' | 'historial' | 'estadisticas' | 'grupales' | 'beneficios' | 'seguridad' | 'soporte' | 'perfil'>('dashboard');

  // Interactive controls
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  
  // Real-time ticking Lima clock
  const [currentTime, setCurrentTime] = useState(new Date());

  // Login variables
  const [uniCode, setUniCode] = useState('25204598'); // Milagros default code
  const [uniEmail, setUniEmail] = useState('milvaldiviesoala@uch.pe');
  const [authError, setAuthError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Register variables
  const [regCode, setRegCode] = useState('2520');
  const [regNombres, setRegNombres] = useState('');
  const [regApellidos, setRegApellidos] = useState('');
  const [regDni, setRegDni] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCarrera, setRegCarrera] = useState('Ingeniería de Sistemas e Informática');
  const [regCiclo, setRegCiclo] = useState('I Ciclo');

  useEffect(() => {
    const timer = setInterval(() => {
      // Ticking Peru clock
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync automatic official UCH institutional email as nombres/apellidos change
  useEffect(() => {
    if (regNombres.trim() && regApellidos.trim()) {
      const generated = generateStudentEmail(regNombres, regApellidos);
      setRegEmail(generated);
    } else {
      setRegEmail('');
    }
  }, [regNombres, regApellidos]);

  // Format digital clock
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-PE', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    if (!uniCode.trim() || !uniEmail.trim()) {
      setAuthError('Por favor redacta tus credenciales completas.');
      return;
    }

    const result = await login(uniCode, uniEmail);
    if (!result.success) {
      setAuthError(result.error || 'Código universitario o correo institucional incorrecto.');
    } else {
      setActiveView('dashboard');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!isValidStudentCode(regCode)) {
      setAuthError('Código universitario inválido. Debe empezar con 2520 y tener 8 dígitos (ejemplo: 25201234).');
      return;
    }
    if (regDni.length !== 8) {
      setAuthError('Tu DNI debe de constar de exactamente 8 dígitos numéricos.');
      return;
    }
    if (!regNombres.trim() || !regApellidos.trim()) {
      setAuthError('Todos los campos son obligatorios para validar tu matrícula UCH.');
      return;
    }

    // Official email is automatically calculated and enforced
    const calculatedEmail = generateStudentEmail(regNombres, regApellidos);

    const success = await registerStudent(
      regCode, 
      regNombres, 
      regApellidos, 
      regDni, 
      calculatedEmail, 
      regCarrera, 
      regCiclo
    );
    if (success) {
      setActiveView('dashboard');
      setIsRegisterMode(false);
    }
  };

  // Navigations switcher array
  const navigationItems = [
    { id: 'dashboard', label: 'Inicio', icon: Home, color: 'text-[#002b49]' },
    { id: 'recarga', label: 'Recargar Saldo', icon: PlusCircle, color: 'text-emerald-500' },
    { id: 'qr', label: 'Pagar QR Campus', icon: QrCode, color: 'text-cyan-500' },
    { id: 'servicios', label: 'Trámites y Tasas', icon: FileText, color: 'text-indigo-500' },
    { id: 'historial', label: 'Movimientos', icon: History, color: 'text-slate-500' },
    { id: 'estadisticas', label: 'Estadísticas', icon: BarChart2, color: 'text-blue-500' },
    { id: 'grupales', label: 'Dividir Gasto', icon: Users, color: 'text-violet-500' },
    { id: 'beneficios', label: 'Cupones UCH', icon: Gift, color: 'text-amber-500' },
    { id: 'seguridad', label: 'Seguridad', icon: ShieldCheck, color: 'text-emerald-600' },
    { id: 'soporte', label: 'Ayuda y Reclamos', icon: HelpCircle, color: 'text-indigo-600' },
    { id: 'perfil', label: 'Mi Carné', icon: User, color: 'text-blue-600' },
  ] as const;

  const activeNotifsCount = notifications.filter(n => !n.leido).length;

  // Render Loader if initial fetch
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center">
          <h2 className="text-lg font-bold font-sans tracking-wide">Billetera Unipay UCH</h2>
          <p className="text-xs text-slate-400">Verificando encriptación y base de datos...</p>
        </div>
      </div>
    );
  }

  // RENDER LOGIN / REGISTER PORTAL
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#002b49] to-[#041e42] flex items-center justify-center p-4">
        {/* Glow blur layout */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl p-6"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl p-6"></div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white/95 backdrop-blur-md rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 border border-white/20 select-none"
        >
          {/* Branded Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center items-center gap-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-600/30">
                U
              </div>
              <div className="text-left leading-none">
                <span className="text-slate-900 font-extrabold text-xl tracking-tight block">BILLETERA</span>
                <span className="text-blue-600 font-black text-xs tracking-widest block font-sans">UNIPAY UCH</span>
              </div>
            </div>
            
            <p className="text-xs text-slate-500 font-normal max-w-xs mx-auto">
              {isRegisterMode 
                ? "Registra tu código académico y DNI oficial para vincular tu nueva billetera" 
                : "Ingresa con tus credenciales de alumno para gestionar pagos de cuotas y saldos en campus"
              }
            </p>
          </div>

          {!isRegisterMode ? (
            /* LOGIN FLOW FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-semibold">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Código Universitario</label>
                <input
                  type="text"
                  placeholder="25204598"
                  value={uniCode}
                  onChange={(e) => setUniCode(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 outline-none rounded-xl focus:border-[#002b49] focus:bg-white text-slate-800 text-sm font-mono tracking-widest font-bold"
                  id="login-input-code"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Correo Institucional UCH</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="milvaldiviesoala@uch.pe"
                    value={uniEmail}
                    onChange={(e) => setUniEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 outline-none rounded-xl focus:border-[#002b49] focus:bg-white text-slate-805 text-xs font-mono"
                    id="login-input-email"
                    required
                  />
                </div>
              </div>

              {authError && (
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl flex items-center gap-2 border border-rose-100/60 font-sans">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#002b49] hover:bg-[#00192b] text-white font-bold rounded-xl text-sm transition shadow-md shadow-[#002b49]/20"
                id="btn-login-submit"
              >
                Ingresar a Billetera
              </button>

              <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsRegisterMode(true)}
                  className="text-blue-600 font-bold hover:underline"
                  id="btn-go-to-register"
                >
                  Registrar nueva cuenta
                </button>
                <span>Soporte: otic@uch.pe</span>
              </div>
            </form>
          ) : (
            /* REGISTER FLOW FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-[11px] font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Código Alumno</label>
                  <input
                    type="text"
                    placeholder="25201234"
                    value={regCode}
                    onChange={(e) => setRegCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 outline-none rounded-lg text-xs font-mono tracking-wider font-bold focus:bg-white"
                    id="reg-input-code"
                    required
                  />
                </div>

                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Número DNI</label>
                  <input
                    type="text"
                    maxLength={8}
                    placeholder="74895612"
                    value={regDni}
                    onChange={(e) => setRegDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 outline-none rounded-lg text-xs font-mono focus:bg-white"
                    id="reg-input-dni"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Nombres</label>
                  <input
                    type="text"
                    placeholder="Milagros Vanessa"
                    value={regNombres}
                    onChange={(e) => setRegNombres(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 outline-none rounded-lg text-xs focus:bg-white"
                    id="reg-input-nombres"
                    required
                  />
                </div>

                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Apellidos</label>
                  <input
                    type="text"
                    placeholder="Valdivieso Alarcón"
                    value={regApellidos}
                    onChange={(e) => setRegApellidos(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 outline-none rounded-lg text-xs focus:bg-white"
                    id="reg-input-apellidos"
                    required
                  />
                </div>
              </div>

              <div className="space-y-0.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase flex justify-between items-center">
                  <span>Correo Institucional</span>
                  <span className="text-[8px] font-bold text-blue-600 font-sans tracking-wide">AUTO-GENERADO</span>
                </label>
                <input
                  type="email"
                  placeholder="milvaldiviesoala@uch.pe"
                  value={regEmail}
                  readOnly
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 outline-none rounded-lg text-xs font-mono text-slate-500 cursor-not-allowed"
                  id="reg-input-email"
                  title="Calculado automáticamente en base a tus nombres y apellidos"
                  required
                />
                <p className="text-[8px] text-slate-400 leading-tight">
                  Formato oficial: 3 letras de nombre + primer apellido completo + 3 letras de segundo apellido + @uch.pe.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase block">Carrera UCH</label>
                  <select
                    value={regCarrera}
                    onChange={(e) => setRegCarrera(e.target.value)}
                    className="w-full px-2 py-2 border border-slate-200 outline-none rounded-lg text-xs bg-white text-slate-700"
                    id="reg-select-carrera"
                  >
                    <option value="Ingeniería de Sistemas e Informática">Sistemas</option>
                    <option value="Ingeniería Industrial">Industrial</option>
                    <option value="Contabilidad con mención en Tributación">Contabilidad</option>
                    <option value="Administración de Empresas">Administración</option>
                    <option value="Enfermería">Enfermería</option>
                    <option value="Psicología">Psicología</option>
                  </select>
                </div>

                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase block">Ciclo</label>
                  <select
                    value={regCiclo}
                    onChange={(e) => setRegCiclo(e.target.value)}
                    className="w-full px-2 py-2 border border-slate-200 outline-none rounded-lg text-xs bg-white text-slate-700"
                    id="reg-select-ciclo"
                  >
                    <option value="I Ciclo">I Ciclo</option>
                    <option value="IV Ciclo">IV Ciclo</option>
                    <option value="VIII Ciclo">VIII Ciclo</option>
                    <option value="X Ciclo">X Ciclo</option>
                  </select>
                </div>
              </div>

              {authError && (
                <div className="p-2 bg-rose-50 text-rose-700 rounded-lg flex items-center gap-1.5 text-[10px]">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition uppercase tracking-wider"
                id="btn-register-submit"
              >
                Crear Mi Billetera Unipay
              </button>

              <button
                type="button"
                onClick={() => setIsRegisterMode(false)}
                className="w-full py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 text-xs font-bold transition"
              >
                Atrás al inicio de sesión
              </button>
            </form>
          )}

          {/* Secure and academic seals */}
          <div className="flex justify-center items-center gap-4 text-[9px] text-slate-400 pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> SUNEDU Conforme
            </span>
            <span className="flex items-center gap-1">
              <Unlock className="w-3 h-3 text-cyan-500" /> SSL Encriptado
            </span>
          </div>

        </motion.div>
      </div>
    );
  }

  // RENDER COMPLETE APP CORE
  return (
    <div className="min-h-screen bg-slate-100/50 flex flex-col justify-between text-slate-700 font-sans select-none relative">
      
      {/* TOP HEADER NAVIGATION BAR */}
      <header className="bg-slate-900 text-white shadow-md z-45 relative sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex justify-between items-center">
          
          {/* Logo brand */}
          <div 
            onClick={() => setActiveView('dashboard')} 
            className="flex items-center gap-2 cursor-pointer"
            id="brand-logo-home-nav"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center font-bold text-lg text-white">
              U
            </div>
            <div className="leading-none text-left">
              <span className="text-xs uppercase tracking-wider font-extrabold text-white block">Unipay UCH</span>
              <span className="text-[8.5px] tracking-widest font-bold uppercase text-slate-400 block">Sede Los Olivos</span>
            </div>
          </div>

          {/* Dynamic ticking clock & notifications */}
          <div className="flex items-center gap-4 text-xs font-semibold z-10">
            {/* Clock Widget */}
            <div className="hidden sm:flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-full border border-slate-800 text-slate-300 font-mono">
              <ClockIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>{formatTime(currentTime)}</span>
            </div>

            {/* Notifications panel bell toggler */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen(!notifOpen)}
                className={`p-2 rounded-full hover:bg-slate-800 transition relative flex items-center justify-center cursor-pointer ${
                  notifOpen ? 'bg-slate-800' : ''
                }`}
                id="btn-header-bell"
              >
                <Bell className="w-5 h-5 text-slate-200" />
                {activeNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-blue-600 border border-slate-905 rounded-full text-[8.5px] font-black text-white flex items-center justify-center animate-bounce">
                    {activeNotifsCount}
                  </span>
                )}
              </button>

              {/* NOTIFICATION FLOATING CONTAINER */}
              {notifOpen && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white text-slate-850 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                  <div className="bg-slate-900 text-white p-3.5 flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider">Alertas y Notificaciones</span>
                    {activeNotifsCount > 0 && (
                      <button
                        type="button"
                        onClick={marcarTodasNoticacionesLeidas}
                        className="text-[10px] text-blue-400 hover:text-white font-bold uppercase"
                        id="btn-notif-mark-all-read"
                      >
                        Leer todo
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => {
                          marcarNotificacionLeida(n.id);
                        }}
                        className={`p-3.5 cursor-pointer hover:bg-slate-50 transition space-y-1 ${
                          !n.leido ? 'bg-indigo-50/20' : ''
                        }`}
                        id={`notif-item-${n.id}`}
                      >
                        <div className="flex justify-between items-start text-[9.5px]">
                          <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                            n.tipo === 'Recarga' ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'
                          }`}>{n.tipo}</span>
                          <span className="text-slate-400 font-mono">{new Date(n.fecha).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[11px] text-slate-700 leading-snug">{n.mensaje}</p>
                      </div>
                    ))}

                    {notifications.length === 0 && (
                      <div className="text-center py-10 space-y-2">
                        <Bell className="w-7 h-7 text-slate-300 mx-auto" />
                        <p className="text-xs text-slate-400">No registras notificaciones actualmente.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggler */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 hover:bg-slate-800 rounded-lg text-slate-200"
              id="btn-mobile-menu-toggle"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* DYNAMIC TWO COLUMN WORKSPACE LAYER */}
      <div className="max-w-7xl mx-auto px-4 py-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SIDEBAR NAVIGATION COLUMN (lg:col-span-3) */}
        <aside className={`lg:col-span-3 space-y-4 ${
          menuOpen ? 'fixed inset-0 bg-slate-900/90 z-40 p-6 flex flex-col justify-center max-w-xs' : 'hidden lg:block'
        }`}>
          {menuOpen && (
            <div className="flex justify-between items-center mb-6">
              <span className="text-white font-extrabold text-sm uppercase tracking-wider">Menú de Navegación</span>
              <button 
                onClick={() => setMenuOpen(false)}
                className="text-white hover:text-blue-500 bg-white/10 p-1.5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Nav buttons stack card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-150/40 lg:border-slate-100 shadow-sm space-y-1">
            {navigationItems.map((item) => {
              const isActive = activeView === item.id;
              
              return (
                <button
                  key={item.id}
                  type="button"
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    setActiveView(item.id);
                    setMenuOpen(false);
                    setNotifOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-xl font-bold text-xs transition cursor-pointer justify-start ${
                    isActive 
                      ? 'bg-[#002b49] text-white shadow-xs' 
                      : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : item.color}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Stats sidebar footer card */}
          <div className="bg-gradient-to-tr from-[#020617] to-[#0f172a] text-white p-4 rounded-xl border border-slate-800 shadow-md flex justify-between items-center text-xs">
            <div className="space-y-1">
              <span className="text-blue-400 font-bold block tracking-wider text-[10px] uppercase">Código Alumno</span>
              <span className="font-mono text-xs font-bold font-semibold block">{student?.codigoUniversitario}</span>
              <span className="text-[9.5px] block text-slate-400 leading-none">{student?.nombres.split(' ')[0]} {student?.apellidos.split(' ')[0]}</span>
            </div>
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="p-2 border border-slate-700 hover:border-blue-500 hover:text-blue-500 rounded-lg transition"
              title="Cerrar Billetera segura"
              id="btn-sidebar-logout"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </aside>

        {/* ACTIVE MODULE CONTAINER VIEWPORT (lg:col-span-9) */}
        <main className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="focus:outline-none"
            >
              {activeView === 'dashboard' && <DashboardView onNavigate={(view) => {
                setActiveView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} />}
              {activeView === 'recarga' && <RecargaView onBack={() => setActiveView('dashboard')} />}
              {activeView === 'qr' && <QrPaymentView onBack={() => setActiveView('dashboard')} onNavigateToRecarga={() => setActiveView('recarga')} />}
              {activeView === 'servicios' && <ServicesView onBack={() => setActiveView('dashboard')} onNavigateToRecarga={() => setActiveView('recarga')} />}
              {activeView === 'historial' && <HistoryView onBack={() => setActiveView('dashboard')} />}
              {activeView === 'estadisticas' && <StatsView onBack={() => setActiveView('dashboard')} />}
              {activeView === 'grupales' && <GrupalesView onBack={() => setActiveView('dashboard')} />}
              {activeView === 'beneficios' && <PromotionsView onBack={() => setActiveView('dashboard')} />}
              {activeView === 'seguridad' && <SecurityView onBack={() => setActiveView('dashboard')} />}
              {activeView === 'soporte' && <SupportView onBack={() => setActiveView('dashboard')} />}
              {activeView === 'perfil' && <ProfileView onBack={() => setActiveView('dashboard')} />}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

      {/* COLLEGIATE FOOTER POLICY CODES */}
      <footer className="bg-slate-900 text-slate-400 text-center py-5 border-t border-slate-800 text-[10px] mt-6 select-none relative z-10 font-normal">
        <div className="max-w-4xl mx-auto px-4 space-y-1">
          <p>© 2026 Oficina de Registro Académico y Tecnologías de la Información (OTIC) - UCH.</p>
          <p>Universidad de Ciencias y Humanidades. Av. Universitaria N° 5175, Los Olivos, Lima, Perú.</p>
          <div className="flex justify-center gap-3.5 pt-1.5 font-bold">
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Enlace a términos de uso de la Billetera Unipay UCH."); }} className="hover:text-blue-400 transition" id="footer-terms-lnk">Términos de Servicio</a>
            <span>•</span>
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Enlace a la política de privacidad de datos de alumnos (Ley 29733 de Protección de Datos Personales)."); }} className="hover:text-blue-400 transition" id="footer-privacy-lnk">Protección de Datos Personales</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Wrapper wrapping WalletProvider safely
export default function App() {
  return (
    <WalletProvider>
      <CampusWalletApp />
    </WalletProvider>
  );
}
