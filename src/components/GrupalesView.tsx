/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { 
  ArrowLeft, 
  Users, 
  PlusCircle, 
  Coins, 
  Clock, 
  CheckCircle, 
  Send, 
  Award, 
  ShieldCheck, 
  Info, 
  Sparkles, 
  UserPlus, 
  UserMinus,
  Trash2,
  Receipt,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GrupalesViewProps {
  onBack: () => void;
}

interface SplitMember {
  codigo: string;
  nombreCompleto: string;
  montoShare: number;
  estado: 'Pendiente' | 'Pagado';
}

interface GroupSplitBill {
  id: string;
  titulo: string;
  tipoGasto: 'Alimentación' | 'Fotocopias' | 'Trámites' | 'Librería/Útiles' | 'Otros';
  montoTotal: number;
  creadorCodigo: string;
  miembros: SplitMember[];
  fechaCreacion: string;
  estado: 'Pendiente' | 'Liquidado';
}

export const GrupalesView: React.FC<GrupalesViewProps> = ({ onBack }) => {
  const { student, wallet, recargarConMetodo, pagarConQR } = useWallet();
  const [splits, setSplits] = useState<GroupSplitBill[]>([]);

  // Form states for creating a new split
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTipo, setNewTipo] = useState<'Alimentación' | 'Fotocopias' | 'Trámites' | 'Librería/Útiles' | 'Otros'>('Alimentación');
  const [newMonto, setNewMonto] = useState('');
  
  // Custom classmates select list (persisted in localStorage)
  const [classmates, setClassmates] = useState<{ codigo: string; nombre: string }[]>([]);
  const [selectedClassmates, setSelectedClassmates] = useState<string[]>([]);
  const [customNombre, setCustomNombre] = useState('');
  const [customCodigo, setCustomCodigo] = useState('');
  const [customError, setCustomError] = useState('');

  // Internal notification feedbacks
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Agenda search and forms
  const [searchClassmateKey, setSearchClassmateKey] = useState('');
  const [dirNombre, setDirNombre] = useState('');
  const [dirCodigo, setDirCodigo] = useState('');
  const [dirError, setDirError] = useState('');

  useEffect(() => {
    // Load classmates
    const storedClassmates = localStorage.getItem('uch_wallet_classmates');
    let loadedClassmates = [];
    if (storedClassmates) {
      const parsed = JSON.parse(storedClassmates);
      // Auto-filter out Eduardo Paredes, Andrea Rosas, and Fernando Fajardo if present in localStorage
      loadedClassmates = parsed.filter((c: any) => {
        const nameLower = c.nombre.toLowerCase();
        return !nameLower.includes('fernando fajardo') && 
               !nameLower.includes('eduardo paredes') && 
               !nameLower.includes('andrea rosas') &&
               c.codigo !== '25204481' && 
               c.codigo !== '25203390';
      });
      
      // If we filtered out existing records, update localStorage to stay in sync
      if (loadedClassmates.length !== parsed.length) {
        localStorage.setItem('uch_wallet_classmates', JSON.stringify(loadedClassmates));
      }
    } else {
      loadedClassmates = [
        { codigo: '25201245', nombre: 'Yadhira Ludeña' },
        { codigo: '25201389', nombre: 'Melanie Vargas' }
      ];
      localStorage.setItem('uch_wallet_classmates', JSON.stringify(loadedClassmates));
    }
    setClassmates(loadedClassmates);

    // Default pre-select two classmates if available
    if (loadedClassmates.length > 0) {
      setSelectedClassmates(loadedClassmates.slice(0, 2).map((c: any) => c.codigo));
    }

    const storedSplits = localStorage.getItem('uch_wallet_group_splits');
    if (storedSplits) {
      setSplits(JSON.parse(storedSplits));
    } else {
      // Create interesting initial mock splits for demo
      const initialSplits: GroupSplitBill[] = [
        {
          id: 'split-1',
          titulo: 'Almuerzo Integración Sistemas UCH',
          tipoGasto: 'Alimentación',
          montoTotal: 45.00,
          creadorCodigo: student?.codigoUniversitario || '25204598',
          miembros: [
            { codigo: student?.codigoUniversitario || '25204598', nombreCompleto: student ? `${student.nombres} ${student.apellidos.split(' ')[0]}` : 'Milagros Valdivieso', montoShare: 15.00, estado: 'Pagado' },
            { codigo: '25201245', nombreCompleto: 'Yadhira Ludeña', montoShare: 15.00, estado: 'Pagado' },
            { codigo: '25201389', nombreCompleto: 'Melanie Vargas', montoShare: 15.00, estado: 'Pendiente' }
          ],
          fechaCreacion: '2026-06-04',
          estado: 'Pendiente'
        },
        {
          id: 'split-2',
          titulo: 'Impresión Guía Proyecto UCH-001',
          tipoGasto: 'Fotocopias',
          montoTotal: 12.00,
          creadorCodigo: student?.codigoUniversitario || '25204598',
          miembros: [
            { codigo: student?.codigoUniversitario || '25204598', nombreCompleto: student ? `${student.nombres} ${student.apellidos.split(' ')[0]}` : 'Milagros Valdivieso', montoShare: 4.00, estado: 'Pagado' },
            { codigo: '25201245', nombreCompleto: 'Yadhira Ludeña', montoShare: 4.00, estado: 'Pagado' },
            { codigo: '25201389', nombreCompleto: 'Melanie Vargas', montoShare: 4.00, estado: 'Pagado' }
          ],
          fechaCreacion: '2026-06-03',
          estado: 'Liquidado'
        }
      ];
      localStorage.setItem('uch_wallet_group_splits', JSON.stringify(initialSplits));
      setSplits(initialSplits);
    }
  }, [student]);

  const saveSplits = (updated: GroupSplitBill[]) => {
    setSplits(updated);
    localStorage.setItem('uch_wallet_group_splits', JSON.stringify(updated));
  };

  const saveClassmates = (updated: { codigo: string; nombre: string }[]) => {
    setClassmates(updated);
    localStorage.setItem('uch_wallet_classmates', JSON.stringify(updated));
  };

  const handleCreateSplit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMonto.trim()) return;

    const totalVal = parseFloat(newMonto);
    if (isNaN(totalVal) || totalVal <= 0) return;

    // Build the list of all participating members
    // 1. Creador (Current Student)
    const creatorName = student ? `${student.nombres} ${student.apellidos.split(' ')[0]}` : 'Milagros Valdivieso';
    const creatorCode = student?.codigoUniversitario || '25204598';

    // 2. Classmates chosen
    const selectedMembersList = selectedClassmates.map(code => {
      const match = classmates.find(c => c.codigo === code);
      return {
        codigo: code,
        nombreCompleto: match ? match.nombre : 'Compañero UCH',
        montoShare: 0,
        estado: 'Pendiente' as const
      };
    });

    const allParticipants = [
      { codigo: creatorCode, nombreCompleto: creatorName, montoShare: 0, estado: 'Pagado' as const },
      ...selectedMembersList
    ];

    // Calculate equal share
    const count = allParticipants.length;
    const shareAmount = parseFloat((totalVal / count).toFixed(2));

    const finalMembers = allParticipants.map((m, idx) => {
      // Adjust last element for accurate rounding sums
      let share = shareAmount;
      if (idx === count - 1) {
        const precedingSum = shareAmount * (count - 1);
        share = parseFloat((totalVal - precedingSum).toFixed(2));
      }
      return {
        ...m,
        montoShare: share
      };
    });

    const newSplit: GroupSplitBill = {
      id: 'split-' + Math.floor(Math.random() * 10000),
      titulo: newTitle.trim(),
      tipoGasto: newTipo,
      montoTotal: totalVal,
      creadorCodigo: creatorCode,
      miembros: finalMembers,
      fechaCreacion: new Date().toISOString().split('T')[0],
      estado: 'Pendiente'
    };

    const updated = [newSplit, ...splits];
    saveSplits(updated);

    // Reset fields
    setNewTitle('');
    setNewMonto('');
    // Default pre-select two classmates if available
    setSelectedClassmates(classmates.slice(0, 2).map(c => c.codigo));
    setShowCreateModal(false);
    showFeedback('¡Gestor de grupo creado! El monto se dividió equitativamente entre los estudiantes.');
  };

  const handleAddCustomClassmate = () => {
    setCustomError('');
    if (!customNombre.trim()) {
      setCustomError('Asigna un nombre válido.');
      return;
    }
    const cleanCode = customCodigo.trim();
    if (cleanCode.length !== 8 || !cleanCode.startsWith('2520')) {
      setCustomError('Código debe iniciar con 2520 y poseer 8 dígitos.');
      return;
    }

    // Check if duplicate
    const isDup = classmates.some(c => c.codigo === cleanCode);
    if (isDup) {
      setCustomError('Este alumno ya se encuentra en la base.');
      return;
    }

    const updated = [...classmates, { codigo: cleanCode, nombre: customNombre.trim() }];
    saveClassmates(updated);
    setSelectedClassmates([...selectedClassmates, cleanCode]);
    setCustomNombre('');
    setCustomCodigo('');
    showFeedback(`Compañero ${customNombre} agregado a la agenda e incluido en el split.`);
  };

  const handleAddDirectClassmate = (e: React.FormEvent) => {
    e.preventDefault();
    setDirError('');
    if (!dirNombre.trim()) {
      setDirError('Asigna un nombre válido.');
      return;
    }
    const cleanCode = dirCodigo.trim();
    if (cleanCode.length !== 8 || !cleanCode.startsWith('2520')) {
      setDirError('Código debe iniciar con 2520 y poseer 8 dígitos.');
      return;
    }

    const isDup = classmates.some(c => c.codigo === cleanCode);
    if (isDup) {
      setDirError('Este compañero ya está registrado.');
      return;
    }

    const updated = [...classmates, { codigo: cleanCode, nombre: dirNombre.trim() }];
    saveClassmates(updated);
    setDirNombre('');
    setDirCodigo('');
    showFeedback(`Compañero ${dirNombre.trim()} guardado en la agenda.`);
  };

  const handleDeleteClassmate = (codigo: string) => {
    const target = classmates.find(c => c.codigo === codigo);
    if (!target) return;
    if (confirm(`¿Estás seguro(a) de eliminar a ${target.nombre} (${codigo}) de la agenda?`)) {
      const updated = classmates.filter(c => c.codigo !== codigo);
      saveClassmates(updated);
      setSelectedClassmates(selectedClassmates.filter(c => c !== codigo));
      showFeedback(`Se ha removido a ${target.nombre} de tu agenda.`);
    }
  };

  const handleRemoveMemberFromSplit = (billId: string, memberCodigo: string) => {
    const parentBill = splits.find(s => s.id === billId);
    if (!parentBill) return;

    if (memberCodigo === parentBill.creadorCodigo) {
      alert("No puedes eliminar al creador de la cuenta compartida.");
      return;
    }

    const targetMember = parentBill.miembros.find(m => m.codigo === memberCodigo);
    if (!targetMember) return;

    if (confirm(`¿Estás seguro(a) de retirar a ${targetMember.nombreCompleto} de esta cuenta compartida? El monto total se redistribuirá equitativamente entre los demás.`)) {
      const remainingMiembros = parentBill.miembros.filter(m => m.codigo !== memberCodigo);
      const newCount = remainingMiembros.length;

      let updatedMiembros = remainingMiembros;
      if (newCount > 0) {
        updatedMiembros = remainingMiembros.map(m => ({
          ...m,
          montoShare: parseFloat((parentBill.montoTotal / newCount).toFixed(2))
        }));
      }

      const allPaid = updatedMiembros.every(m => m.estado === 'Pagado');
      const updatedBill: GroupSplitBill = {
        ...parentBill,
        miembros: updatedMiembros,
        estado: allPaid ? 'Liquidado' as const : 'Pendiente' as const
      };

      // Refund the classmate earnings back to the creator's wallet if all have paid now
      if (allPaid && parentBill.estado !== 'Liquidado') {
        const classmateEarningsWithRound = updatedMiembros
          .filter(m => m.codigo !== parentBill.creadorCodigo)
          .reduce((sum, m) => sum + m.montoShare, 0);

        const netAmount = parseFloat(classmateEarningsWithRound.toFixed(2));
        
        if (wallet && netAmount > 0) {
          const updatedWallet = {
            ...wallet,
            saldoDisponible: parseFloat((wallet.saldoDisponible + netAmount).toFixed(2))
          };
          localStorage.setItem('uch_wallet_account', JSON.stringify(updatedWallet));
          
          const storedTx = localStorage.getItem('uch_wallet_transactions');
          const txList = storedTx ? JSON.parse(storedTx) : [];
          const newTx = {
            id: "TX-" + Math.floor(100000 + Math.random() * 900000),
            walletId: wallet.id,
            tipo: 'Devolución' as const,
            categoria: 'Otros' as const,
            monto: netAmount,
            fecha: new Date().toISOString().split('T')[0],
            hora: new Date().toTimeString().split(' ')[0],
            estado: 'Exitoso' as const,
            descripcion: `Consolidación de cuenta compartida: ${parentBill.titulo}`,
            metodoUtilizado: 'Unipay Split',
            codigoOperacion: "OP-" + Math.floor(100000000 + Math.random() * 900000000)
          };
          localStorage.setItem('uch_wallet_transactions', JSON.stringify([newTx, ...txList]));
        }
        showFeedback(`Se retiró a ${targetMember.nombreCompleto}. ¡Todos pagaron! S/ ${netAmount.toFixed(2)} reembolsados.`);
      } else {
        showFeedback(`Se retiró a ${targetMember.nombreCompleto} del split. Dinero redistribuido equitativamente.`);
      }

      const updatedSplits = splits.map(s => s.id === billId ? updatedBill : s);
      saveSplits(updatedSplits);
    }
  };

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => {
      setFeedbackMsg('');
    }, 4500);
  };

  const handleSendReminder = (billId: string, member: SplitMember) => {
    // Simulates emailing / notification triggering
    showFeedback(`Recordatorio enviado a ${member.nombreCompleto} (${member.codigo}@uch.pe) mediante correo institucional de la UCH.`);
    
    // Inject fake notification if current logged-in user wants feedback
    const storedNotifs = localStorage.getItem('uch_wallet_notifications');
    const list = storedNotifs ? JSON.parse(storedNotifs) : [];
    
    const newNotif = {
      id: "not-" + Math.random().toString(36).substring(2, 9),
      estudianteId: student?.id || 'est-001',
      tipo: 'Alerta',
      mensaje: `Símbolo de cobro: Se despachó correo electrónico de cobro a ${member.nombreCompleto} por S/ ${member.montoShare.toFixed(2)}.`,
      fecha: new Date().toISOString(),
      leido: false
    };
    localStorage.setItem('uch_wallet_notifications', JSON.stringify([newNotif, ...list]));
  };

  const handleSimulatePayment = (billId: string, memberCodigo: string) => {
    const parentBill = splits.find(s => s.id === billId);
    if (!parentBill) return;

    const targetMember = parentBill.miembros.find(m => m.codigo === memberCodigo);
    if (!targetMember || targetMember.estado === 'Pagado') return;

    // Simulate classmates paying
    const updatedMiembros = parentBill.miembros.map(m => {
      if (m.codigo === memberCodigo) {
        return { ...m, estado: 'Pagado' as const };
      }
      return m;
    });

    const allPaid = updatedMiembros.every(m => m.estado === 'Pagado');
    const updatedBill: GroupSplitBill = {
      ...parentBill,
      miembros: updatedMiembros,
      estado: allPaid ? 'Liquidado' as const : 'Pendiente' as const
    };

    // If all paid, current owner gets the money refunded back in full to their balance! High-fidelity simulation!
    if (allPaid) {
      // Sum classmate contributions (creador is already marked paid and paid the bill upfront, so classmate shares are added)
      const classmateEarningsWithRound = updatedMiembros
        .filter(m => m.codigo !== parentBill.creadorCodigo)
        .reduce((sum, m) => sum + m.montoShare, 0);

      const netAmount = parseFloat(classmateEarningsWithRound.toFixed(2));
      
      // Update local storage wallet
      if (wallet) {
        const updatedWallet = {
          ...wallet,
          saldoDisponible: parseFloat((wallet.saldoDisponible + netAmount).toFixed(2))
        };
        localStorage.setItem('uch_wallet_account', JSON.stringify(updatedWallet));
        
        // Save matching transaction
        const storedTx = localStorage.getItem('uch_wallet_transactions');
        const txList = storedTx ? JSON.parse(storedTx) : [];
        const newTx = {
          id: "TX-" + Math.floor(100000 + Math.random() * 900000),
          walletId: wallet.id,
          tipo: 'Devolución' as const,
          categoria: 'Otros' as const,
          monto: netAmount,
          fecha: new Date().toISOString().split('T')[0],
          hora: new Date().toTimeString().split(' ')[0],
          estado: 'Exitoso' as const,
          descripcion: `Consolidación de cuenta compartida: ${parentBill.titulo}`,
          metodoUtilizado: 'Unipay Split',
          codigoOperacion: "OP-" + Math.floor(100000000 + Math.random() * 900000000)
        };
        localStorage.setItem('uch_wallet_transactions', JSON.stringify([newTx, ...txList]));
      }

      showFeedback(`¡Perfecto! Todos han pagado. S/ ${netAmount.toFixed(2)} reembolsados a tu saldo.`);
    } else {
      showFeedback(`¡Transacción Simulada! ${targetMember.nombreCompleto} canceló su parte de S/ ${targetMember.montoShare.toFixed(2)} mediante saldo Unipay.`);
    }

    const updatedSplits = splits.map(s => s.id === billId ? updatedBill : s);
    saveSplits(updatedSplits);
  };

  const handleDeleteSplit = (id: string) => {
    if (confirm('¿Deseas eliminar este registro de cuenta compartida?')) {
      const filtered = splits.filter(s => s.id !== id);
      saveSplits(filtered);
      showFeedback('Cuenta compartida eliminada de la memoria local.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition text-slate-600 cursor-pointer"
            id="btn-back-grupales"
            type="button"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-500" />
              <h2 className="text-lg font-extrabold text-slate-800">Dividir Cuentas UCH</h2>
            </div>
            <p className="text-xs text-slate-500">Gestor de pagos grupales programado para compartir egresos en campus ordinarios</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md shadow-violet-500/20"
          id="btn-new-split-trigger"
        >
          <PlusCircle className="w-4 h-4" /> Nueva Cuenta Compartida
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs font-semibold animate-pulse flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* CORE FUNCTIONAL CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* BILLS TIMELINE (col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-100 relative flex justify-between items-center text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-widest text-[10px]">Cuentas en Curso y Cierres</span>
            <span className="text-[10px] font-mono font-bold text-slate-400">Total: {splits.length} registros</span>
          </div>

          <div className="space-y-4">
            {splits.map(bill => {
              const creatorIsCurrent = bill.creadorCodigo === (student?.codigoUniversitario || '25204598');
              const progressCount = bill.miembros.filter(m => m.estado === 'Pagado').length;
              const totalCount = bill.miembros.length;
              const percentage = (progressCount / totalCount) * 100;

              return (
                <div 
                  key={bill.id} 
                  className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden"
                  id={`split-bill-card-${bill.id}`}
                >
                  {/* Top Bar Header of Split */}
                  <div className="px-5 py-4 flex justify-between items-start border-b border-slate-100 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wide text-[8.5px] ${
                          bill.tipoGasto === 'Alimentación' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                          bill.tipoGasto === 'Fotocopias' ? 'bg-cyan-50 text-cyan-700 border border-cyan-100' :
                          'bg-violet-50 text-violet-700 border border-violet-100'
                        }`}>{bill.tipoGasto}</span>
                        <span className="text-[10px] text-slate-400 font-mono tracking-wide">{bill.fechaCreacion}</span>
                      </div>
                      <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">{bill.titulo}</h3>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Monto Total</span>
                      <span className="text-base font-black font-mono text-[#002b49]">S/ {bill.montoTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Body: classmate status list */}
                  <div className="p-5 space-y-4">
                    
                    {/* Share progress visualization */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-slate-400" /> Estado de Recaudación:
                        </span>
                        <span className="font-mono text-violet-700">
                          {progressCount} de {totalCount} Pagado ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      
                      {/* Bar indicator */}
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-violet-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Member rows */}
                    <div className="divide-y divide-slate-100">
                      {bill.miembros.map((m, mIdx) => (
                        <div 
                          key={mIdx} 
                          className="py-3 flex justify-between items-center text-xs gap-4"
                          id={`member-row-${bill.id}-${m.codigo}`}
                        >
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-800">{m.nombreCompleto}</span>
                            <span className="font-mono text-[10px] text-slate-400 block tracking-wide">Ref: {m.codigo}@uch.pe</span>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Individual Split Share quota */}
                            <span className="font-mono font-bold text-slate-700">S/ {m.montoShare.toFixed(2)}</span>
                            
                            {/* Active pill status */}
                            {m.estado === 'Pagado' ? (
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-extrabold rounded-lg flex items-center gap-1 font-sans">
                                <CheckCircle className="w-3 h-3 text-emerald-600" /> Cancelado
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-extrabold rounded-lg flex items-center gap-1 font-sans">
                                <Clock className="w-3 h-3 text-amber-500" /> Pendiente
                              </span>
                            )}

                            {/* If classmate is not the creator, let them be removed from active split */}
                            {m.codigo !== bill.creadorCodigo && (
                              <button
                                type="button"
                                onClick={() => handleRemoveMemberFromSplit(bill.id, m.codigo)}
                                className="p-1 border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition shrink-0 cursor-pointer"
                                title="Retirar de esta cuenta compartida"
                                id={`btn-remove-member-${bill.id}-${m.codigo}`}
                              >
                                <UserMinus className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Simulation Actions */}
                            {m.estado === 'Pendiente' && (
                              <div className="flex items-center gap-1.5">
                                {/* Send email reminder */}
                                <button
                                  type="button"
                                  onClick={() => handleSendReminder(bill.id, m)}
                                  className="p-1 px-1.5 border border-slate-200 hover:border-blue-300 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition shrink-0 cursor-pointer"
                                  title="Enviar recordatorio institucional"
                                  id={`btn-remind-${bill.id}-${m.codigo}`}
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </button>
                                
                                {/* Simulate payment click */}
                                <button
                                  type="button"
                                  onClick={() => handleSimulatePayment(bill.id, m.codigo)}
                                  className="px-2 py-1 bg-violet-600 hover:bg-violet-700 text-white text-[9.5px] font-bold rounded-lg transition shadow-xs cursor-pointer"
                                  title="Simular pago del alumno"
                                  id={`btn-pay-simulate-${bill.id}-${m.codigo}`}
                                >
                                  Pagar por Yape/Plin
                                </button>
                              </div>
                            )}

                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer buttons of card */}
                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400">
                        {bill.estado === 'Liquidado' ? '✅ Liquidado por todos los aportantes' : '⏳ Aún en curso'}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDeleteSplit(bill.id)}
                        className="text-slate-400 hover:text-red-500 font-bold text-[10px] flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Borrar registro
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}

            {splits.length === 0 && (
              <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-200 max-w-md mx-auto space-y-4">
                <Users className="w-10 h-10 text-slate-350 mx-auto" />
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-700">Sin cuentas compartidas aún</h4>
                  <p className="text-xs text-slate-400">Comienza haciendo click en el botón superior derecho para dividir un gasto universitario regular.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SIDE BAR PRESENTATION & DOCUMENT DATA RESEARCH CODES (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* UCH PROJECT OFFICIAL CREDITS TABLE CARD */}
          <div className="bg-gradient-to-br from-[#0c182a] to-[#040e1b] text-white p-5 rounded-2xl border border-[#1b3457] shadow-lg relative overflow-hidden">
            <div className="absolute top-[-30px] right-[-30px] w-48 h-48 bg-blue-500/5 rounded-full blur-2xl"></div>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-1.5 pb-3 border-b border-white/10">
                <Award className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h3 className="font-extrabold text-[11px] tracking-widest text-slate-300 uppercase font-mono">Créditos de Investigación</h3>
                  <span className="text-[9.5px] text-blue-400 block font-bold">Universidad de Ciencias y Humanidades</span>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                
                <div className="space-y-1">
                  <span className="text-[9px] text-[#71cfeb] block font-bold font-mono uppercase tracking-widest">Nombre del Proyecto</span>
                  <p className="font-black text-slate-100 tracking-wide">UNIPAY - Billetera Digital Universitaria</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-[#71cfeb] block font-bold font-mono uppercase tracking-widest">Código Oficial</span>
                  <p className="font-mono text-slate-200">UCH-001</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-[#71cfeb] block font-bold font-mono uppercase tracking-widest">Carrera y Facultad</span>
                  <p className="text-slate-200 font-semibold leading-relaxed">Ingeniería de Sistemas e Informática
                    <span className="block text-[10px] text-slate-400 font-normal">X Ciclo - Tesis de Validación</span>
                  </p>
                </div>

                {/* Team breakdown based strictly on Page 1 of PDF */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="text-[9.5px] text-[#71cfeb] font-bold font-mono uppercase tracking-widest block">Responsables y Diseñadoras</span>
                  
                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-slate-200 flex items-center gap-1.5 leading-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Milagros Valdivieso
                      </span>
                      <span className="text-[9.5px] text-slate-500 font-mono">Cód: 25204598</span>
                    </div>

                    <div className="flex justify-between items-center font-bold">
                      <span className="text-slate-200 flex items-center gap-1.5 leading-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Yadhira Ludeña
                      </span>
                      <span className="text-[9.5px] text-slate-500 font-mono">Cód: 25201245</span>
                    </div>

                    <div className="flex justify-between items-center font-bold">
                      <span className="text-slate-200 flex items-center gap-1.5 leading-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Melanie Vargas
                      </span>
                      <span className="text-[9.5px] text-slate-500 font-mono">Cód: 25201389</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2 text-[9px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Validación Técnica e Informe emitido el 10/05/2026.</span>
                </div>

              </div>
            </div>
          </div>

          {/* COMPAÑEROS REGISTRADOS (AGENDA) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-xs text-slate-800 uppercase tracking-widest leading-none flex items-center gap-1.5 font-sans animate-fade-in">
                  <Users className="w-4 h-4 text-violet-500" /> Agenda de Compañeros
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Administra tu círculo de amigos universitarios</p>
              </div>
              <span className="text-[9.5px] font-mono font-bold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-100">
                {classmates.length} Alumnos
              </span>
            </div>

            {/* Form to add directly */}
            <form onSubmit={handleAddDirectClassmate} className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Nombre y Apellido"
                  value={dirNombre}
                  onChange={(e) => setDirNombre(e.target.value)}
                  className="w-full text-[11px] px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-violet-500 outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Código: 2520xxxx"
                  maxLength={8}
                  value={dirCodigo}
                  onChange={(e) => setDirCodigo(e.target.value)}
                  className="w-full text-[11px] px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-violet-500 outline-none font-mono uppercase"
                  required
                />
              </div>
              
              {dirError && (
                <p className="text-[9px] text-rose-500 font-semibold">{dirError}</p>
              )}

              <button
                type="submit"
                className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-[10px] transition cursor-pointer flex items-center justify-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Registrar en Agenda
              </button>
            </form>

            {/* Search and list scroll */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <input
                type="text"
                placeholder="Buscar compañero por nombre o código..."
                value={searchClassmateKey}
                onChange={(e) => setSearchClassmateKey(e.target.value)}
                className="w-full text-[10.5px] px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-violet-500 bg-slate-50"
              />

              <div className="max-h-52 overflow-y-auto divide-y divide-slate-150 pr-1 space-y-1">
                {classmates
                  .filter(c => {
                    const key = searchClassmateKey.toLowerCase();
                    return c.nombre.toLowerCase().includes(key) || c.codigo.includes(key);
                  })
                  .map(c => (
                    <div key={c.codigo} className="flex justify-between items-center py-1.5 text-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 block text-[11px] leading-tight">{c.nombre}</span>
                        <span className="font-mono text-[9.5px] text-slate-400 block tracking-wider">Cód: {c.codigo}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-slate-500 bg-slate-50 border border-slate-100 px-1 py-0.5 rounded font-semibold font-mono hidden sm:inline">
                          {c.codigo}@uch.pe
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => handleDeleteClassmate(c.codigo)}
                          className="p-1 text-slate-350 hover:text-rose-500 hover:bg-rose-50 rounded-md transition cursor-pointer shrink-0"
                          title="Eliminar de agenda"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                {classmates.filter(c => {
                  const key = searchClassmateKey.toLowerCase();
                  return c.nombre.toLowerCase().includes(key) || c.codigo.includes(key);
                }).length === 0 && (
                  <p className="text-[10px] text-slate-400 text-center py-3">No se encontraron compañeros en la agenda.</p>
                )}
              </div>
            </div>
          </div>

          {/* EDUCATIONAL ASSISTANCE BLOCK */}
          <div className="bg-[#f0f4f8] p-5 rounded-2xl border border-slate-200/60 shadow-xs space-y-3">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-widest">¿Cómo funciona Split Unipay?</h4>
                <p className="text-[11px] text-slate-500 leading-normal font-normal">
                  Esta pantalla te permite consolidar una compra en conjunto de manera rápida. Como creador, tú eres quien liquida la compra inicial en el campus (p. ej., un almuerzo grupal de S/ 45.00 con tres compañeros). 
                </p>
              </div>
            </div>
            
            <p className="text-[11px] text-slate-500 leading-normal font-normal">
              Al constituirse la cuenta, tú eres el dueño legal. Tus compañeros recibirán notificaciones en sus cuentas de Unipay para que autoricen el pago. Puedes clickear <strong>"Pagar por Yape/Plin"</strong> para simular el ingreso rápido de estas cuotas de regreso a tu cuenta.
            </p>
          </div>

        </div>

      </div>

      {/* MODAL COLLAPSIBLE FOR CREATING A NEW SPLIT */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-slate-100 select-none text-xs"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4.5 h-4.5 text-violet-600" />
                  <h3 className="font-extrabold text-[#002b49] text-base">Dividir Nueva Cuenta</h3>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700"
                  type="button"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateSplit} className="space-y-4 font-semibold">
                
                {/* Concept Title Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Concepto o Destino</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Almuerzo del grupo Sistemas"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-600 outline-none text-slate-800"
                    id="input-new-split-title"
                  />
                </div>

                {/* Grid amount / type */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Monto Total (S/)</label>
                    <input
                      type="number"
                      step="0.10"
                      min="1"
                      required
                      placeholder="Ej. 60.00"
                      value={newMonto}
                      onChange={(e) => setNewMonto(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-600 outline-none text-slate-800 font-mono text-sm tracking-wider"
                      id="input-new-split-monto"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Categoría</label>
                    <select
                      value={newTipo}
                      onChange={(e: any) => setNewTipo(e.target.value)}
                      className="w-full px-2.5 py-2.5 border border-slate-200 outline-none rounded-xl bg-white text-slate-700 font-bold"
                      id="select-new-split-tipo"
                    >
                      <option value="Alimentación">Alimentación</option>
                      <option value="Fotocopias">Fotocopias</option>
                      <option value="Trámites">Trámites</option>
                      <option value="Librería/Útiles">Librería y Útiles</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                </div>

                {/* Classmate multi-check selectors */}
                <div className="space-y-2 pt-1 border-t border-slate-100 select-none">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                    <label>Seleccionar Aportantes</label>
                    <span>{selectedClassmates.length} Seleccionados</span>
                  </div>
                  
                  {/* Select checkboxes mapping */}
                  <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-150 py-2.5 max-h-36 overflow-y-auto">
                    {classmates.map(classmate => {
                      const isChecked = selectedClassmates.includes(classmate.codigo);
                      
                      return (
                        <div 
                          key={classmate.codigo} 
                          className="flex justify-between items-center py-0.5 hover:bg-slate-100/60 rounded-lg px-2 group transition select-none"
                        >
                          <label className="flex items-center gap-2 cursor-pointer select-none flex-1 py-0.5 text-slate-700">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSelectedClassmates(selectedClassmates.filter(c => c !== classmate.codigo));
                                } else {
                                  setSelectedClassmates([...selectedClassmates, classmate.codigo]);
                                }
                              }}
                              className="rounded text-violet-600 accent-violet-600 w-4 h-4 cursor-pointer"
                            />
                            <span className="text-[11.5px] font-bold">{classmate.nombre} <span className="text-[9.5px] font-mono text-slate-400 font-normal">({classmate.codigo})</span></span>
                          </label>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteClassmate(classmate.codigo);
                            }}
                            className="p-1 text-slate-300 hover:text-rose-500 rounded-md transition duration-150 shrink-0 cursor-pointer"
                            title="Eliminar de la agenda"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}

                    {classmates.length === 0 && (
                      <p className="text-[10px] text-slate-400 text-center py-2">Registra compañeros primero en tu agenda para delegar cuentas.</p>
                    )}
                  </div>
                </div>

                {/* Classmate Dynamic add form */}
                <div className="p-3 bg-violet-50/20 border border-violet-100 rounded-xl space-y-2 text-[11px] font-semibold">
                  <span className="text-[9.5px] text-violet-700 font-bold uppercase tracking-wider block">¿Aportante Externo no listado?</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <input
                      type="text"
                      placeholder="Nombre de compañero"
                      value={customNombre}
                      onChange={(e) => setCustomNombre(e.target.value)}
                      className="bg-white border border-slate-200 rounded px-2 py-1 outline-none text-slate-800"
                      id="input-custom-member-name"
                    />
                    <input
                      type="text"
                      maxLength={8}
                      placeholder="Cód: 25201234"
                      value={customCodigo}
                      onChange={(e) => setCustomCodigo(e.target.value)}
                      className="bg-white border border-slate-200 rounded px-2 py-1 outline-none text-slate-800 font-mono uppercase"
                      id="input-custom-member-code"
                    />
                  </div>

                  <div className="flex justify-between items-center gap-2.5">
                    <span className="text-[9px] text-red-500 font-medium block">{customError}</span>
                    <button
                      type="button"
                      onClick={handleAddCustomClassmate}
                      className="px-2.5 py-1 bg-[#002b49] text-white font-bold rounded hover:bg-[#001c30] transition text-[10px]"
                      id="btn-add-custom-member-plus"
                    >
                      Incluir compañero
                    </button>
                  </div>
                </div>

                {/* Dynamic division estimation helper */}
                <div className="p-3 bg-[#002b49]/5 border border-[#002b49]/10 rounded-xl text-[10.5px] font-normal leading-normal text-slate-650">
                  <span className="text-[9px] text-[#002b49] font-bold uppercase tracking-wider block mb-0.5">ESTIMACIÓN DE DIVISIÓN:</span>
                  El total de S/ {parseFloat(newMonto || '0').toFixed(2)} se dividirá entre <strong>{selectedClassmates.length + 1} alumnos</strong> (tú + aportantes elegidos). Cada uno aportará aproximadamente <strong>S/ {((parseFloat(newMonto || '0')) / (selectedClassmates.length + 1) || 0).toFixed(2)}</strong>.
                </div>

                {/* Modal actions */}
                <div className="flex gap-2.5 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 font-bold transition"
                  >
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    disabled={!newTitle.trim() || !newMonto.trim()}
                    className="py-2.5 px-6 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition"
                    id="btn-confirm-grupales-create"
                  >
                    Crear Split Unipay
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
