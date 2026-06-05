/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { 
  ArrowLeft, 
  TrendingUp, 
  Calendar, 
  Coins, 
  PieChart as PieIcon, 
  BarChart2, 
  Smartphone,
  ChevronRight,
  Info,
  Layers,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { TransactionCategory } from '../types';

interface StatsViewProps {
  onBack: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({ onBack }) => {
  const { transactions } = useWallet();
  const [activeTab, setActiveTab] = useState<'categorias' | 'evolucion' | 'ahorro'>('categorias');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter out recargas (only calculate expenses)
  const expenses = transactions.filter(tx => tx.tipo !== 'Recarga' && tx.estado === 'Exitoso');

  // 1. Calculate main Indicators
  // Day Expense (Today is 2026-06-05)
  const spentToday = expenses
    .filter(tx => tx.fecha === "2026-06-05")
    .reduce((sum, tx) => sum + tx.monto, 0);

  // Week Expense (any txn in last 7 days)
  const spentThisWeek = expenses
    .filter(tx => {
      const dates = ["2026-06-05", "2026-06-04", "2026-06-03", "2026-06-02", "2026-06-01", "2026-05-31", "2026-05-30"];
      return dates.includes(tx.fecha);
    })
    .reduce((sum, tx) => sum + tx.monto, 0);

  // Month Expense (Full list)
  const spentThisMonth = expenses.reduce((sum, tx) => sum + tx.monto, 0);

  // 2. Categories Distribution
  const categoriesMap: Record<TransactionCategory, number> = {
    'Alimentación': 0,
    'Trámites': 0,
    'Fotocopias': 0,
    'Eventos': 0,
    'Transporte': 0,
    'Otros': 0
  };

  expenses.forEach(tx => {
    const cat = tx.categoria || 'Otros';
    if (categoriesMap[cat] !== undefined) {
      categoriesMap[cat] += tx.monto;
    } else {
      categoriesMap['Otros'] += tx.monto;
    }
  });

  const categoryEntries = (Object.entries(categoriesMap) as [TransactionCategory, number][])
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.value > 0);

  const totalExpenseSum = categoryEntries.reduce((sum, item) => sum + item.value, 0);

  // Map category colors
  const categoryColors: Record<TransactionCategory, string> = {
    'Alimentación': '#3b82f6', // blue-500
    'Trámites': '#6366f1', // indigo-500
    'Fotocopias': '#06b6d4', // cyan-500
    'Eventos': '#f59e0b', // amber-500
    'Transporte': '#10b981', // emerald-500
    'Otros': '#64748b' // slate-500
  };

  // Evolution Monthly simulation (Last 5 Months)
  // Mar, Abr, May, Jun (Current)
  const evolutionData = [
    { month: 'Marzo', amount: 85.00 },
    { month: 'Abril', amount: 120.50 },
    { month: 'Mayo', amount: 155.00 },
    { month: 'Junio', amount: spentThisMonth > 0 ? spentThisMonth : 64.80 }
  ];

  const maxEvolutionAmount = Math.max(...evolutionData.map(d => d.amount), 50);

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full transition text-slate-600"
          id="btn-back-estadisticas"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Estadísticas y Control Financiero</h2>
          <p className="text-xs text-slate-500">Monitorea tus gastos estudiantiles y planifica tu presupuesto UCH</p>
        </div>
      </div>

      {/* CORE FINANCIAL INDICATORS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* DAY SPEND */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-1.5 relative overflow-hidden">
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[9px] font-bold">HOY</div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Gastos del Día</span>
          <div className="text-xl font-black font-mono text-slate-800">
            S/ {spentToday.toFixed(2)}
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">Consumos en cafetería y fotocopiadora hoy.</p>
        </div>

        {/* WEEK SPEND */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-1.5 relative overflow-hidden">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Gastos de la Semana</span>
          <div className="text-xl font-black font-mono text-slate-800">
            S/ {spentThisWeek.toFixed(2)}
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">Últimos 7 días de actividades universitarias.</p>
        </div>

        {/* MONTH SPEND */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-1.5 relative overflow-hidden">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Gasto Mensual Acumulado</span>
          <div className="text-xl font-black font-mono text-blue-600">
            S/ {spentThisMonth.toFixed(2)}
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">Monto total debitado en el periodo actual de junio.</p>
        </div>

      </div>

      {/* VISUALS TOGGLE PANELS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Tab headings */}
        <div className="flex border-b border-slate-100 p-2 gap-1.5 bg-slate-50">
          <button
            type="button"
            onClick={() => setActiveTab('categorias')}
            id="tab-stats-categorias"
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'categorias' 
                ? 'bg-white text-slate-800 shadow-xs border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <PieIcon className="w-4 h-4 text-blue-500" /> Distribución por Categorías
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('evolucion')}
            id="tab-stats-evolucion"
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'evolucion' 
                ? 'bg-white text-slate-800 shadow-xs border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart2 className="w-4 h-4 text-[#002b49]" /> Evolución Mensual
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ahorro')}
            id="tab-stats-ahorro"
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'ahorro' 
                ? 'bg-white text-slate-800 shadow-xs border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" /> Ahorro Inteligente y Ofertas
          </button>
        </div>

        {/* TAB WORKFLOW: CATEGORIES (DONUT SEGMENT CHART CODES) */}
        {activeTab === 'categorias' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center col-span-12">
            
            {/* SVG DONUT GRAPH (md:col-span-5) */}
            <div className="md:col-span-5 flex justify-center flex-col items-center">
              {totalExpenseSum > 0 ? (
                <div className="relative w-44 h-44">
                  {/* Outer circle layout calculated with path segments */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                    {/* Iterate and paint donut segments! */}
                    {(() => {
                      let accumulatedPercent = 0;
                      return categoryEntries.map((item) => {
                        const percent = (item.value / totalExpenseSum) * 100;
                        const strokeDasharray = `${percent} ${100 - percent}`;
                        const strokeDashoffset = -accumulatedPercent;
                        accumulatedPercent += percent;
                        
                        return (
                          <circle
                            key={item.name}
                            cx="50"
                            cy="50"
                            r="38"
                            stroke={categoryColors[item.name]}
                            strokeWidth="12"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            fill="none"
                            pathLength="100"
                            className="transition duration-500 hover:stroke-[14]"
                          />
                        );
                      });
                    })()}
                  </svg>
                  
                  {/* Central Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] font-bold uppercase text-slate-400">Total Gastado</span>
                    <span className="text-sm font-black font-mono text-slate-800">S/ {totalExpenseSum.toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <div className="w-44 h-44 rounded-full border-4 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 text-center">
                  <Coins className="w-7 h-7 text-slate-300 mb-1" />
                  <span className="text-[10px] text-slate-400 font-semibold leading-tight">Sin consumos en el mes</span>
                </div>
              )}
              
              <span className="text-[10px] text-slate-400 font-semibold mt-3">Gráfico de distribución porcentual</span>
            </div>

            {/* LEGENDS breakdown list (md:col-span-7) */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Desglose de Categorías</h4>
                <p className="text-[11px] text-slate-500">Donde estás gastando más saldo este ciclo</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Fallback to show all categories in legend if no expenses */}
                {(totalExpenseSum > 0 ? categoryEntries : (Object.keys(categoriesMap) as TransactionCategory[]).map(c => ({ name: c, value: c === 'Alimentación' ? 20 : 0 }))).map((item) => {
                  const percent = totalExpenseSum > 0 ? (item.value / totalExpenseSum) * 100 : 0;
                  const color = categoryColors[item.name];

                  return (
                    <div 
                      key={item.name}
                      className="p-3.5 rounded-xl border border-slate-100 flex items-center justify-between gap-2.5 transition hover:shadow-xs hover:border-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }}></div>
                        <span className="font-bold text-xs text-slate-700">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold font-mono text-slate-800 block">S/ {item.value.toFixed(2)}</span>
                        {totalExpenseSum > 0 && (
                          <span className="text-[9px] text-slate-400 font-mono block">{percent.toFixed(1)}%</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB WORKFLOW: EVOLUTION (BAR CHARTS CODES) */}
        {activeTab === 'evolucion' && (
          <div className="p-6 space-y-6">
            <div>
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Evolución de egresos del alumno</h4>
              <p className="text-[11px] text-slate-500">Historial de gastos acumulados mes a mes en el año 2026</p>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative">
              <div className="flex justify-between items-end h-48 pt-4 pb-2">
                {evolutionData.map((data, idx) => {
                  const percentHeight = (data.amount / maxEvolutionAmount) * 100;
                  
                  return (
                    <div key={idx} className="flex flex-col items-center flex-1 group relative">
                      {/* Interactive Tooltip code */}
                      <div className="absolute top-0 transform -translate-y-6 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[9px] font-mono font-bold py-1 px-2 rounded tracking-wide transition pointer-events-none z-10 shadow-md">
                        S/ {data.amount.toFixed(2)}
                      </div>

                      {/* The Bar */}
                      <div className="w-10 sm:w-12 bg-slate-200 rounded-t-lg overflow-hidden flex items-end h-full relative">
                        <div 
                          className="w-full bg-[#002b49] group-hover:bg-blue-500 transition-all duration-500 rounded-t-md"
                          style={{ height: `${percentHeight}%` }}
                        ></div>
                      </div>

                      {/* Label */}
                      <span className="text-[10px] font-bold text-slate-500 mt-2 block">{data.month}</span>
                    </div>
                  );
                })}
              </div>

              {/* Grid Y axis markers */}
              <div className="absolute left-3 top-4 bottom-8 flex flex-col justify-between text-[8px] font-mono text-slate-400 pointer-events-none select-none">
                <span>S/ {maxEvolutionAmount.toFixed(0)}</span>
                <span>S/ {(maxEvolutionAmount / 2).toFixed(0)}</span>
                <span>S/ 0</span>
              </div>
            </div>

            {/* Micro warning indicator info */}
            <div className="flex gap-2.5 items-center p-3.5 bg-cyan-50 border border-cyan-100 rounded-xl">
              <Info className="w-4 h-4 text-[#002b49] shrink-0" />
              <p className="text-[10px] text-cyan-800 leading-snug">
                <strong>Consejo de Bienestar UCH:</strong> Tu promedio de gasto mensual actual es de S/ 106.32. Te sugerimos aprovechar la promoción del Combo Almuerzo en el campus para reducir gastos de alimentación en un 15%.
              </p>
            </div>
          </div>
        )}

        {/* TAB WORKFLOW: AHORRO INTELIGENTE (CAMPUS FINDER & DAILY REPORTS) */}
        {activeTab === 'ahorro' && (
          <div className="p-6 space-y-6">
            {/* Header sub */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 w-4 text-amber-500 animate-bounce" /> Reporte Diario de Ahorro UCH
                </h4>
                <p className="text-[11px] text-slate-500">Detección automatizada de precios económicos y optimización de presupuesto</p>
              </div>
              <div className="bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-100 text-[10px] font-bold">
                Hoy has ahorrado aprox: <span className="font-mono text-xs text-emerald-600 block sm:inline">S/ 8.50 🎉</span>
              </div>
            </div>

            {/* Main Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 text-center space-y-1">
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Tu gasto acumulado hoy</span>
                <span className="text-sm font-bold font-mono text-slate-800">S/ {spentToday.toFixed(2)}</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 text-center space-y-1">
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Límite Diario Estudiantil</span>
                <span className="text-sm font-bold font-mono text-blue-600">S/ 40.00</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 bg-gradient-to-tr from-[#002b49] to-[#0a3556] text-white text-center space-y-1">
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-300 block">Indicador de Eficiencia</span>
                <span className="text-sm font-bold font-mono text-cyan-300">Excelente (82%)</span>
              </div>
            </div>

            {/* Campus Smart Finder section */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="font-bold text-xs text-slate-800 uppercase tracking-widest">Asistente Inteligente de Precios Campus UCH</span>
                <p className="text-[10px] text-slate-500">Encuentra los precios y ofertas más baratas evaluadas por la comunidad de Ingeniería de Sistemas</p>
              </div>

              {/* Interactive finder input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filtra ofertas universitarias (ej. 'comida', 'copias', 'tramites')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs py-2.5 pl-3.5 pr-10 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  id="campus-deal-search"
                />
                <span className="absolute right-3.5 top-2.5 text-slate-400">🔍</span>
              </div>

              {/* Deal Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    titulo: 'Menú UCH Estudiantil Completo',
                    categoria: 'comida',
                    precio: 'S/ 8.50',
                    regular: 'S/ 12.00',
                    ahorro: 'S/ 3.50',
                    descripcion: 'Disponible en Cafetería Principal Central. Incluye entrada, segundo, refresco y postre presentando el carné digital.',
                    popularidad: '🔥 97% de alumnos conformes'
                  },
                  {
                    titulo: 'Fotocopia / Impresión simple por hoja',
                    categoria: 'copias',
                    precio: 'S/ 0.10',
                    regular: 'S/ 0.20',
                    ahorro: 'S/ 0.10',
                    descripcion: 'Módulo de Impresiones Pabellón B. Aplica para copias de materiales de ingeniería en blanco y negro.',
                    popularidad: '💡 Más económico del distrito'
                  },
                  {
                    titulo: 'Combo Desayuno (Café + Pan con Pollo)',
                    categoria: 'comida',
                    precio: 'S/ 4.50',
                    regular: 'S/ 6.00',
                    ahorro: 'S/ 1.50',
                    descripcion: 'Cafetín del primer sótano. Válido de lunes a viernes desde las 7:30 AM hasta las 10:00 AM para carga energética instantánea.',
                    popularidad: '⚡ Favorito del ciclo académico'
                  },
                  {
                    titulo: 'Constancia de Estudios Institucional',
                    categoria: 'tramites',
                    precio: 'S/ 0.00',
                    regular: 'S/ 15.00',
                    ahorro: 'S/ 15.00',
                    descripcion: '¡Gratis al descargarla digitalmente desde el Portal del Alumno en formato PDF firmado digitalmente por rectoría!',
                    popularidad: '🎓 100% autogestionado'
                  }
                ]
                  .filter(deal => {
                    const term = searchQuery.toLowerCase().trim();
                    if (!term) return true;
                    return (
                      deal.titulo.toLowerCase().includes(term) ||
                      deal.categoria.toLowerCase().includes(term) ||
                      deal.descripcion.toLowerCase().includes(term)
                    );
                  })
                  .map((deal, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl border border-slate-100 bg-white hover:border-amber-300 transition hover:shadow-md space-y-2 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 px-2 py-0.5 rounded-bl bg-amber-50 text-amber-700 text-[8px] font-bold uppercase tracking-wider">
                        Ahorro {deal.ahorro}
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">{deal.categoria}</span>
                        <h5 className="font-bold text-xs text-slate-800 leading-snug">{deal.titulo}</h5>
                      </div>

                      <p className="text-[10px] text-slate-500 leading-normal">{deal.descripcion}</p>

                      <div className="flex justify-between items-center pt-2.5 border-t border-slate-50 text-[10px]">
                        <div>
                          <span className="text-slate-400 line-through mr-1 font-mono">{deal.regular}</span>
                          <span className="text-xs font-black font-mono text-emerald-600 bg-emerald-50/50 px-1.5 py-0.5 rounded">{deal.precio}</span>
                        </div>
                        <span className="text-[9.5px] italic text-slate-400 font-semibold">{deal.popularidad}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
