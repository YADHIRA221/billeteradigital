/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Estudiante, 
  WalletAccount, 
  Transaction, 
  ServiceUniversity, 
  Promotion, 
  Notification, 
  LinkedDevice, 
  HelpTicket,
  TransactionCategory
} from '../types';
import { 
  INITIAL_STUDENT, 
  INITIAL_SERVICES, 
  INITIAL_PROMOTIONS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_DEVICES, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';

export const normalizeText = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-zñ\s]/g, '');
};

export const generateStudentEmail = (nombres: string, apellidos: string): string => {
  const cleanNombres = normalizeText(nombres.trim()).split(/\s+/);
  const cleanApellidos = normalizeText(apellidos.trim()).split(/\s+/);

  const firstName = cleanNombres[0] || '';
  const firstApellido = cleanApellidos[0] || '';
  const secondApellido = cleanApellidos[1] || '';

  const namePart = firstName.substring(0, 3);
  const primerApellidoPart = firstApellido;
  const segundoApellidoPart = secondApellido.substring(0, 3);

  return `${namePart}${primerApellidoPart}${segundoApellidoPart}@uch.pe`;
};

export const isValidStudentCode = (code: string): boolean => {
  return /^2520\d{4}$/.test(code.trim());
};

interface WalletContextType {
  student: Estudiante | null;
  wallet: WalletAccount | null;
  transactions: Transaction[];
  services: ServiceUniversity[];
  promotions: Promotion[];
  notifications: Notification[];
  devices: LinkedDevice[];
  tickets: HelpTicket[];
  isBiometricsEnabled: boolean;
  isLoggedIn: boolean;
  isLoading: boolean;
  
  // Actions
  login: (codigo: string, correo: string) => Promise<{ success: boolean; error?: string }>;
  registerStudent: (
    codigo: string, 
    nombres: string, 
    apellidos: string, 
    dni: string, 
    correo: string, 
    carrera: string, 
    ciclo: string
  ) => Promise<boolean>;
  logout: () => void;
  toggleBiometrics: () => void;
  
  // Financial Actions
  recargarSaldo: (monto: number, metodo: 'Yape' | 'Plin' | 'Tarjeta de Crédito' | 'Tarjeta de Débito' | 'Transferencia Bancaria') => Promise<Transaction>;
  pagarConQR: (comercio: string, monto: number, categoria: TransactionCategory) => Promise<Transaction>;
  pagarServicioAcademico: (servicioId: string) => Promise<Transaction>;
  
  // Utility & User Management
  updateProfilePhoto: (url: string) => void;
  vincularDispositivo: (nombre: string, so: string) => void;
  desvincularDispositivo: (id: string) => void;
  registrarBoletoSoporte: (tipo: 'Devolución' | 'Reclamo' | 'Sugerencia', descripcion: string, relatedTx?: string, relatedService?: string) => void;
  marcarNotificacionLeida: (id: string) => void;
  marcarTodasNoticacionesLeidas: () => void;
  resetAppState: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<Estudiante | null>(null);
  const [wallet, setWallet] = useState<WalletAccount | null>(null);
  const [studentsRegistry, setStudentsRegistry] = useState<Estudiante[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [services] = useState<ServiceUniversity[]>(INITIAL_SERVICES);
  const [promotions] = useState<Promotion[]>(INITIAL_PROMOTIONS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [devices, setDevices] = useState<LinkedDevice[]>([]);
  const [tickets, setTickets] = useState<HelpTicket[]>([]);
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize and load from LocalStorage
  useEffect(() => {
    try {
      const storedLoginStatus = localStorage.getItem('uch_wallet_logged_in');
      const storedStudent = localStorage.getItem('uch_wallet_student');
      const storedWallet = localStorage.getItem('uch_wallet_account');
      const storedTransactions = localStorage.getItem('uch_wallet_transactions');
      const storedNotifications = localStorage.getItem('uch_wallet_notifications');
      const storedDevices = localStorage.getItem('uch_wallet_devices');
      const storedBiometrics = localStorage.getItem('uch_wallet_biometrics');
      const storedTickets = localStorage.getItem('uch_wallet_tickets');

      // Load or set students registry
      const storedRegistry = localStorage.getItem('uch_wallet_students_registry');
      if (storedRegistry) {
        setStudentsRegistry(JSON.parse(storedRegistry));
      } else {
        const defaultRegistry = [INITIAL_STUDENT];
        localStorage.setItem('uch_wallet_students_registry', JSON.stringify(defaultRegistry));
        setStudentsRegistry(defaultRegistry);
      }

      if (storedLoginStatus === 'true' && storedStudent && storedWallet) {
        setStudent(JSON.parse(storedStudent));
        setWallet(JSON.parse(storedWallet));
        setIsLoggedIn(true);
      } else {
        // Default to state of pre-login or pre-loaded student for high fidelity demo
        const demoStudent = INITIAL_STUDENT;
        localStorage.setItem('uch_wallet_student', JSON.stringify(demoStudent));
        setStudent(demoStudent);
        
        const demoWallet: WalletAccount = {
          id: "wal-001",
          estudianteId: demoStudent.id,
          saldoDisponible: 83.20,
          saldoRetenido: 0.00,
          fechaCreacion: "2024-03-12"
        };
        localStorage.setItem('uch_wallet_account', JSON.stringify(demoWallet));
        setWallet(demoWallet);
      }

      // Load or set transactions
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      } else {
        localStorage.setItem('uch_wallet_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
        setTransactions(INITIAL_TRANSACTIONS);
      }

      // Load or set notifications
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      } else {
        localStorage.setItem('uch_wallet_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
        setNotifications(INITIAL_NOTIFICATIONS);
      }

      // Load or set devices
      if (storedDevices) {
        setDevices(JSON.parse(storedDevices));
      } else {
        localStorage.setItem('uch_wallet_devices', JSON.stringify(INITIAL_DEVICES));
        setDevices(INITIAL_DEVICES);
      }

      // Biometrics
      if (storedBiometrics) {
        setIsBiometricsEnabled(storedBiometrics === 'true');
      }

      // Support tickets
      if (storedTickets) {
        setTickets(JSON.parse(storedTickets));
      } else {
        setTickets([]);
      }
    } catch (e) {
      console.error("Error initializes storage:", e);
    } finally {
      // Small simulated delay for realistic feel
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, []);

  // Helper helper to generate random OP code
  const generateOpCode = () => {
    return "OP-" + Math.floor(100000000 + Math.random() * 900000000).toString();
  };

  const login = async (codigo: string, correo: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    // Real-world validation simulator: student must exist or match pattern
    // For high fidelity, code starting with U and followed by numbers is validated
    return new Promise((resolve) => {
      setTimeout(() => {
        const cleanCodigo = codigo.trim().toUpperCase();
        const cleanCorreo = correo.trim().toLowerCase();

        // 1. Strict validation of UCH student code (starts with 2520, 8 digits)
        if (!isValidStudentCode(cleanCodigo)) {
          setIsLoading(false);
          resolve({
            success: false,
            error: 'Código universitario inválido. Debe comenzar con "2520" y contener exactamente 8 dígitos (ejemplo: 25204598).'
          });
          return;
        }

        // 2. Strict validation of email domain (@uch.pe ONLY, no gmail etc.)
        if (!cleanCorreo.endsWith('@uch.pe')) {
          setIsLoading(false);
          resolve({
            success: false,
            error: 'Acceso denegado. Solo se permiten correos institucionales oficiales terminados en "@uch.pe". Su correo no puede contener @gmail.com u otro dominio.'
          });
          return;
        }

        // 3. Search in matching registry
        const storedRegistry = localStorage.getItem('uch_wallet_students_registry');
        const registry: Estudiante[] = storedRegistry ? JSON.parse(storedRegistry) : [INITIAL_STUDENT];
        
        const foundStudent = registry.find(s => s.codigoUniversitario === cleanCodigo);

        if (foundStudent) {
          // Re-compute expected structural email based on official formula:
          // 3 first letters of name + full first apellido + 3 first letters of second apellido + @uch.pe
          const expectedEmail = generateStudentEmail(foundStudent.nombres, foundStudent.apellidos);

          if (cleanCorreo !== expectedEmail.toLowerCase()) {
            setIsLoading(false);
            resolve({
              success: false,
              error: `El correo de inicio de sesión no coincide con la nomenclatura oficial asignada para este alumno.\nFormato requerido: [primeras 3 letras de tu nombre][primer apellido completo][primeras 3 letras del segundo apellido]@uch.pe\n(Tu correo oficial es: ${expectedEmail})`
            });
            return;
          }

          // Successfully authenticated! Load student and wallet profile
          setStudent(foundStudent);
          localStorage.setItem('uch_wallet_student', JSON.stringify(foundStudent));

          const storedWalletsRegistry = localStorage.getItem('uch_wallet_accounts_registry');
          let walletsRegistry: Record<string, WalletAccount> = storedWalletsRegistry ? JSON.parse(storedWalletsRegistry) : {};
          let matchedWallet = walletsRegistry[cleanCodigo];
          if (!matchedWallet) {
            matchedWallet = {
              id: "wal-" + Math.floor(Math.random() * 1000),
              estudianteId: foundStudent.id,
              saldoDisponible: cleanCodigo === "25204598" ? 83.20 : 125.50,
              saldoRetenido: 0.00,
              fechaCreacion: new Date().toISOString().split('T')[0]
            };
            walletsRegistry[cleanCodigo] = matchedWallet;
            localStorage.setItem('uch_wallet_accounts_registry', JSON.stringify(walletsRegistry));
          }
          setWallet(matchedWallet);
          localStorage.setItem('uch_wallet_account', JSON.stringify(matchedWallet));
        } else {
          // Special fallback case: if they enter the exact expected email structure for "Estudiante UCH Ecosistema Digital"
          // under a new code, we auto-create them for convenience, but only if it matches exactly
          const dNombres = "Estudiante UCH";
          const dApellidos = "Ecosistema Digital";
          const expectedFallbackEmail = generateStudentEmail(dNombres, dApellidos);

          if (cleanCorreo !== expectedFallbackEmail.toLowerCase()) {
            setIsLoading(false);
            resolve({
              success: false,
              error: `Este código de alumno aún no está registrado. Dirígete a la pestaña "Registrarse" o, si deseas iniciar sesión ficticio con este código, el correo debe ser estrictamente "${expectedFallbackEmail}".`
            });
            return;
          }

          // Otherwise, auto-create student record
          const fallbackStudent: Estudiante = {
            ...INITIAL_STUDENT,
            codigoUniversitario: cleanCodigo,
            correoInstitucional: expectedFallbackEmail,
            nombres: dNombres,
            apellidos: dApellidos,
          };
          setStudent(fallbackStudent);
          localStorage.setItem('uch_wallet_student', JSON.stringify(fallbackStudent));

          const newWallet: WalletAccount = {
            id: "wal-" + Math.floor(Math.random() * 1000),
            estudianteId: fallbackStudent.id,
            saldoDisponible: 125.50,
            saldoRetenido: 0.00,
            fechaCreacion: new Date().toISOString().split('T')[0]
          };
          setWallet(newWallet);
          localStorage.setItem('uch_wallet_account', JSON.stringify(newWallet));

          // Save to registry too
          const updatedRegistry = [...registry, fallbackStudent];
          localStorage.setItem('uch_wallet_students_registry', JSON.stringify(updatedRegistry));
          
          const storedWalletsRegistry = localStorage.getItem('uch_wallet_accounts_registry');
          let walletsRegistry: Record<string, WalletAccount> = storedWalletsRegistry ? JSON.parse(storedWalletsRegistry) : {};
          walletsRegistry[cleanCodigo] = newWallet;
          localStorage.setItem('uch_wallet_accounts_registry', JSON.stringify(walletsRegistry));
        }

        setIsLoggedIn(true);
        localStorage.setItem('uch_wallet_logged_in', 'true');
        setIsLoading(false);
        resolve({ success: true });
      }, 600);
    });
  };

  const registerStudent = async (
    codigo: string, 
    nombres: string, 
    apellidos: string, 
    dni: string, 
    correo: string, 
    carrera: string, 
    ciclo: string
  ): Promise<boolean> => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const cleanCodigo = codigo.trim().toUpperCase();
        
        // Calculate the official structured email strictly
        const officialEmail = generateStudentEmail(nombres, apellidos);

        const newStudent: Estudiante = {
          id: "est-" + Math.floor(Math.random() * 1000),
          codigoUniversitario: cleanCodigo,
          nombres: nombres.trim(),
          apellidos: apellidos.trim(),
          dni: dni.trim(),
          correoInstitucional: officialEmail,
          carrera,
          cicloAcademico: ciclo,
          estadoMatricula: 'Matriculado',
          fotoPerfil: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
          fechaRegistro: new Date().toISOString().split('T')[0]
        };

        const newWallet: WalletAccount = {
          id: "wal-" + Math.floor(Math.random() * 1000),
          estudianteId: newStudent.id,
          saldoDisponible: 40.00, // Give some starter balance for demo high fidelity
          saldoRetenido: 0.00,
          fechaCreacion: new Date().toISOString().split('T')[0]
        };

        // Welcome notification
        const welcomeNotif: Notification = {
          id: "not-" + Math.random().toString(36).substr(2, 9),
          estudianteId: newStudent.id,
          tipo: 'Alerta',
          mensaje: `¡Bienvenido(a) a la Billetera Unipay UCH, ${nombres}! Tu billetera ha sido validada y activada correctamente. Tu correo oficial creado es ${officialEmail}`,
          fecha: new Date().toISOString(),
          leido: false
        };

        setStudent(newStudent);
        setWallet(newWallet);
        setTransactions([]);
        setNotifications([welcomeNotif]);
        
        localStorage.setItem('uch_wallet_student', JSON.stringify(newStudent));
        localStorage.setItem('uch_wallet_account', JSON.stringify(newWallet));
        localStorage.setItem('uch_wallet_transactions', JSON.stringify([]));
        localStorage.setItem('uch_wallet_notifications', JSON.stringify([welcomeNotif]));
        localStorage.setItem('uch_wallet_logged_in', 'true');

        // Persist in studentsRegistry state and localStorage registry
        const storedRegistry = localStorage.getItem('uch_wallet_students_registry');
        const studentsList: Estudiante[] = storedRegistry ? JSON.parse(storedRegistry) : [INITIAL_STUDENT];
        const filteredList = studentsList.filter(s => s.codigoUniversitario !== cleanCodigo);
        const updatedRegistry = [...filteredList, newStudent];
        setStudentsRegistry(updatedRegistry);
        localStorage.setItem('uch_wallet_students_registry', JSON.stringify(updatedRegistry));

        // Persist in wallets registry
        const storedWalletsRegistry = localStorage.getItem('uch_wallet_accounts_registry');
        let walletsList: Record<string, WalletAccount> = storedWalletsRegistry ? JSON.parse(storedWalletsRegistry) : {};
        walletsList[cleanCodigo] = newWallet;
        localStorage.setItem('uch_wallet_accounts_registry', JSON.stringify(walletsList));
        
        setIsLoggedIn(true);
        setIsLoading(false);
        resolve(true);
      }, 700);
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('uch_wallet_logged_in', 'false');
  };

  const toggleBiometrics = () => {
    const nextVal = !isBiometricsEnabled;
    setIsBiometricsEnabled(nextVal);
    localStorage.setItem('uch_wallet_biometrics', nextVal ? 'true' : 'false');
    
    // Notify
    const newNotif: Notification = {
      id: "not-" + Math.random().toString(36).substr(2, 9),
      estudianteId: student?.id || "",
      tipo: 'Alerta',
      mensaje: nextVal 
        ? "Autenticación biométrica habilitada correctamente para este dispositivo."
        : "Autenticación biométrica deshabilitada de forma segura.",
      fecha: new Date().toISOString(),
      leido: false
    };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    localStorage.setItem('uch_wallet_notifications', JSON.stringify(updated));
  };

  // FINANCIALS
  const recargarSaldo = async (
    monto: number, 
    metodo: 'Yape' | 'Plin' | 'Tarjeta de Crédito' | 'Tarjeta de Débito' | 'Transferencia Bancaria'
  ): Promise<Transaction> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const code = generateOpCode();
        const dateObj = new Date();
        const pDate = dateObj.toISOString().split('T')[0];
        const pTime = dateObj.toTimeString().split(' ')[0];

        const newTx: Transaction = {
          id: "tx-" + Math.floor(1000 + Math.random() * 9000),
          walletId: wallet?.id || "wal-001",
          tipo: 'Recarga',
          monto: monto,
          fecha: pDate,
          hora: pTime,
          estado: 'Exitoso',
          descripcion: `Recarga de saldo por ${metodo} UCH`,
          metodoUtilizado: metodo,
          codigoOperacion: code
        };

        // Update balance
        if (wallet) {
          const updatedWallet = {
            ...wallet,
            saldoDisponible: parseFloat((wallet.saldoDisponible + monto).toFixed(2))
          };
          setWallet(updatedWallet);
          localStorage.setItem('uch_wallet_account', JSON.stringify(updatedWallet));
        }

        // Add transaction
        const updatedTxs = [newTx, ...transactions];
        setTransactions(updatedTxs);
        localStorage.setItem('uch_wallet_transactions', JSON.stringify(updatedTxs));

        // Create notification
        const newNotif: Notification = {
          id: "not-" + Math.random().toString(36).substr(2, 9),
          estudianteId: student?.id || "est-001",
          tipo: 'Recarga',
          mensaje: `¡Recarga exitosa! Se han acreditado S/ ${monto.toFixed(2)} a tu saldo disponible por medio de ${metodo}. Código de Operación: ${code}.`,
          fecha: dateObj.toISOString(),
          leido: false
        };
        const updatedNotifs = [newNotif, ...notifications];
        setNotifications(updatedNotifs);
        localStorage.setItem('uch_wallet_notifications', JSON.stringify(updatedNotifs));

        resolve(newTx);
      }, 500);
    });
  };

  const pagarConQR = async (
    comercio: string, 
    monto: number, 
    categoria: TransactionCategory
  ): Promise<Transaction> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!wallet || wallet.saldoDisponible < monto) {
          reject(new Error("Saldo insuficiente en tu Billetera UCH para realizar este pago. Por favor, recarga saldo."));
          return;
        }

        const code = generateOpCode();
        const dateObj = new Date();
        const pDate = dateObj.toISOString().split('T')[0];
        const pTime = dateObj.toTimeString().split(' ')[0];

        const newTx: Transaction = {
          id: "tx-" + Math.floor(1000 + Math.random() * 9000),
          walletId: wallet.id,
          tipo: 'Pago QR',
          categoria: categoria,
          monto: monto,
          fecha: pDate,
          hora: pTime,
          estado: 'Exitoso',
          descripcion: `${comercio} (Pago QR)`,
          metodoUtilizado: 'Saldo Billetera',
          codigoOperacion: code
        };

        // Update balance
        const updatedWallet = {
          ...wallet,
          saldoDisponible: parseFloat((wallet.saldoDisponible - monto).toFixed(2))
        };
        setWallet(updatedWallet);
        localStorage.setItem('uch_wallet_account', JSON.stringify(updatedWallet));

        // Add transaction
        const updatedTxs = [newTx, ...transactions];
        setTransactions(updatedTxs);
        localStorage.setItem('uch_wallet_transactions', JSON.stringify(updatedTxs));

        // Create notification
        const newNotif: Notification = {
          id: "not-" + Math.random().toString(36).substr(2, 9),
          estudianteId: student?.id || "est-001",
          tipo: 'Pago',
          mensaje: `Pago QR exitoso de S/ ${monto.toFixed(2)} en ${comercio}. Código: ${code}.`,
          fecha: dateObj.toISOString(),
          leido: false
        };
        const updatedNotifs = [newNotif, ...notifications];
        setNotifications(updatedNotifs);
        localStorage.setItem('uch_wallet_notifications', JSON.stringify(updatedNotifs));

        resolve(newTx);
      }, 600);
    });
  };

  const pagarServicioAcademico = async (servicioId: string): Promise<Transaction> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const item = services.find(s => s.id === servicioId);
        if (!item) {
          reject(new Error("El servicio seleccionado no está disponible en este momento."));
          return;
        }

        if (!wallet || wallet.saldoDisponible < item.precio) {
          reject(new Error(`Saldo insuficiente (S/ ${wallet ? wallet.saldoDisponible.toFixed(2) : '0.00'}) para pagar el servicio "${item.nombre}" que cuesta S/ ${item.precio.toFixed(2)}. Realiza una recarga rápida por Yape o Plin.`));
          return;
        }

        const code = generateOpCode();
        const dateObj = new Date();
        const pDate = dateObj.toISOString().split('T')[0];
        const pTime = dateObj.toTimeString().split(' ')[0];

        // Deduce category based on name
        let cat: TransactionCategory = 'Trámites';
        if (item.nombre.includes('Pensión') || item.nombre.includes('Matrícula')) {
          cat = 'Trámites';
        } else if (item.nombre.includes('Cubículo') || item.nombre.includes('Taller')) {
          cat = 'Eventos';
        } else {
          cat = 'Otros';
        }

        const newTx: Transaction = {
          id: "tx-" + Math.floor(1000 + Math.random() * 9000),
          walletId: wallet.id,
          tipo: 'Pago Servicio',
          categoria: cat,
          monto: item.precio,
          fecha: pDate,
          hora: pTime,
          estado: 'Exitoso',
          descripcion: item.nombre,
          metodoUtilizado: 'Saldo Billetera',
          codigoOperacion: code
        };

        // Update balance
        const updatedWallet = {
          ...wallet,
          saldoDisponible: parseFloat((wallet.saldoDisponible - item.precio).toFixed(2))
        };
        setWallet(updatedWallet);
        localStorage.setItem('uch_wallet_account', JSON.stringify(updatedWallet));

        // Add txn
        const updatedTxs = [newTx, ...transactions];
        setTransactions(updatedTxs);
        localStorage.setItem('uch_wallet_transactions', JSON.stringify(updatedTxs));

        // Info Notification
        const newNotif: Notification = {
          id: "not-" + Math.random().toString(36).substr(2, 9),
          estudianteId: student?.id || "est-001",
          tipo: 'Pago',
          mensaje: `Pago exitoso de S/ ${item.precio.toFixed(2)} por: ${item.nombre}. Comprobante generado con código de operación ${code}.`,
          fecha: dateObj.toISOString(),
          leido: false
        };
        const updatedNotifs = [newNotif, ...notifications];
        setNotifications(updatedNotifs);
        localStorage.setItem('uch_wallet_notifications', JSON.stringify(updatedNotifs));

        resolve(newTx);
      }, 500);
    });
  };

  // PROFILE UPDATES
  const updateProfilePhoto = (url: string) => {
    if (!student) return;
    const updated = {
      ...student,
      fotoPerfil: url
    };
    setStudent(updated);
    localStorage.setItem('uch_wallet_student', JSON.stringify(updated));
  };

  // DEVICES MANAGEMENT
  const vincularDispositivo = (nombre: string, so: string) => {
    if (!student) return;
    const newDevice: LinkedDevice = {
      id: "dev-" + Math.floor(Math.random() * 10000),
      estudianteId: student.id,
      nombreDispositivo: nombre,
      sistemaOperativo: so,
      ultimoAcceso: new Date().toISOString(),
      estado: 'Activo',
      esDispositivoActual: false
    };

    const updated = [...devices, newDevice];
    setDevices(updated);
    localStorage.setItem('uch_wallet_devices', JSON.stringify(updated));

    // notification
    const alertNotif: Notification = {
      id: "not-" + Math.random().toString(36).substr(2, 9),
      estudianteId: student.id,
      tipo: 'Alerta',
      mensaje: `Nuevo dispositivo vinculado de forma segura a tu cuenta: ${nombre} (${so}).`,
      fecha: new Date().toISOString(),
      leido: false
    };
    const updatedNotifs = [alertNotif, ...notifications];
    setNotifications(updatedNotifs);
    localStorage.setItem('uch_wallet_notifications', JSON.stringify(updatedNotifs));
  };

  const desvincularDispositivo = (id: string) => {
    const updated = devices.filter(d => d.id !== id);
    setDevices(updated);
    localStorage.setItem('uch_wallet_devices', JSON.stringify(updated));

    // notification
    if (student) {
      const alertNotif: Notification = {
        id: "not-" + Math.random().toString(36).substr(2, 9),
        estudianteId: student.id,
        tipo: 'Alerta',
        mensaje: "Un dispositivo vinculado ha sido eliminado de tu lista de accesos autorizados.",
        fecha: new Date().toISOString(),
        leido: false
      };
      const updatedNotifs = [alertNotif, ...notifications];
      setNotifications(updatedNotifs);
      localStorage.setItem('uch_wallet_notifications', JSON.stringify(updatedNotifs));
    }
  };

  // HELP/CLAIMS TICKETS
  const registrarBoletoSoporte = (
    tipo: 'Devolución' | 'Reclamo' | 'Sugerencia', 
    descripcion: string, 
    relatedTx?: string, 
    relatedService?: string
  ) => {
    if (!student) return;
    const newTicket: HelpTicket = {
      id: "TK-" + Math.floor(10000 + Math.random() * 90000),
      estudianteId: student.id,
      tipo,
      descripcion,
      codigoTransaccion: relatedTx,
      servicioRelacionado: relatedService,
      estado: 'Pendiente',
      fechaRegistro: new Date().toISOString().split('T')[0]
    };

    const updated = [newTicket, ...tickets];
    setTickets(updated);
    localStorage.setItem('uch_wallet_tickets', JSON.stringify(updated));

    // Add alert
    const welcomeNotif: Notification = {
      id: "not-" + Math.random().toString(36).substr(2, 9),
      estudianteId: student.id,
      tipo: 'Alerta',
      mensaje: `Tu solicitud de ${tipo.toLowerCase()} ha sido ingresada con el código de ticket ${newTicket.id}. Nos comunicaremos a tu correo institucional.`,
      fecha: new Date().toISOString(),
      leido: false
    };
    const updatedNotifs = [welcomeNotif, ...notifications];
    setNotifications(updatedNotifs);
    localStorage.setItem('uch_wallet_notifications', JSON.stringify(updatedNotifs));
  };

  // NOTIFICATION UTILITIES
  const marcarNotificacionLeida = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, leido: true } : n);
    setNotifications(updated);
    localStorage.setItem('uch_wallet_notifications', JSON.stringify(updated));
  };

  const marcarTodasNoticacionesLeidas = () => {
    const updated = notifications.map(n => ({ ...n, leido: true }));
    setNotifications(updated);
    localStorage.setItem('uch_wallet_notifications', JSON.stringify(updated));
  };

  // RESET
  const resetAppState = () => {
    localStorage.removeItem('uch_wallet_logged_in');
    localStorage.removeItem('uch_wallet_student');
    localStorage.removeItem('uch_wallet_account');
    localStorage.removeItem('uch_wallet_transactions');
    localStorage.removeItem('uch_wallet_notifications');
    localStorage.removeItem('uch_wallet_devices');
    localStorage.removeItem('uch_wallet_biometrics');
    localStorage.removeItem('uch_wallet_tickets');

    // Reload with initial defaults
    const demoStudent = INITIAL_STUDENT;
    setStudent(demoStudent);
    
    const demoWallet = {
      id: "wal-001",
      estudianteId: demoStudent.id,
      saldoDisponible: 83.20,
      saldoRetenido: 0.00,
      fechaCreacion: "2024-03-12"
    };
    setWallet(demoWallet);
    setTransactions(INITIAL_TRANSACTIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setDevices(INITIAL_DEVICES);
    setTickets([]);
    setIsBiometricsEnabled(false);
    setIsLoggedIn(true); // stay logged in as demo
    
    localStorage.setItem('uch_wallet_student', JSON.stringify(demoStudent));
    localStorage.setItem('uch_wallet_account', JSON.stringify(demoWallet));
    localStorage.setItem('uch_wallet_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem('uch_wallet_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem('uch_wallet_devices', JSON.stringify(INITIAL_DEVICES));
    localStorage.setItem('uch_wallet_logged_in', 'true');
  };

  return (
    <WalletContext.Provider value={{
      student,
      wallet,
      transactions,
      services,
      promotions,
      notifications,
      devices,
      tickets,
      isBiometricsEnabled,
      isLoggedIn,
      isLoading,
      login,
      registerStudent,
      logout,
      toggleBiometrics,
      recargarSaldo,
      pagarConQR,
      pagarServicioAcademico,
      updateProfilePhoto,
      vincularDispositivo,
      desvincularDispositivo,
      registrarBoletoSoporte,
      marcarNotificacionLeida,
      marcarTodasNoticacionesLeidas,
      resetAppState
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
