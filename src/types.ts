/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Estudiante {
  id: string;
  codigoUniversitario: string; // e.g., "U19208342"
  nombres: string;
  apellidos: string;
  dni: string;
  correoInstitucional: string;
  carrera: string;
  cicloAcademico: string;
  estadoMatricula: 'Matriculado' | 'No Matriculado' | 'Egresado';
  fotoPerfil: string;
  fechaRegistro: string;
}

export interface WalletAccount {
  id: string;
  estudianteId: string;
  saldoDisponible: number;
  saldoRetenido: number;
  fechaCreacion: string;
}

export type TransactionType = 'Recarga' | 'Pago QR' | 'Pago Servicio' | 'Devolución';

export type TransactionCategory = 'Alimentación' | 'Trámites' | 'Fotocopias' | 'Eventos' | 'Transporte' | 'Otros';

export type TransactionStatus = 'Exitoso' | 'Pendiente' | 'Rechazado';

export interface Transaction {
  id: string;
  walletId: string;
  tipo: TransactionType;
  categoria?: TransactionCategory;
  monto: number;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:MM:SS
  estado: TransactionStatus;
  descripcion: string;
  metodoUtilizado: string; // "Yape", "Plin", "Tarjeta de Crédito", "Tarjeta de Débito", "Saldo Billetera", "Transferencia"
  codigoOperacion: string;
}

export interface Recarga {
  id: string;
  estudianteId: string;
  monto: number;
  metodoPago: 'Yape' | 'Plin' | 'Tarjeta de Crédito' | 'Tarjeta de Débito' | 'Transferencia Bancaria';
  fecha: string;
  estado: TransactionStatus;
  codigoOperacion: string;
}

export interface PagoQR {
  id: string;
  estudianteId: string;
  comercioServicio: string;
  monto: number;
  fecha: string;
  estado: TransactionStatus;
  codigoQrAsociado: string;
}

export interface ServiceUniversity {
  id: string;
  nombre: string;
  categoria: 'Académico' | 'Servicios Complementarios';
  descripcion: string;
  precio: number;
  estado: 'Activo' | 'Inactivo';
}

export interface Promotion {
  id: string;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  condiciones: string;
  estado: 'Activo' | 'Expirado';
  codigoCupon: string;
  descuentoText: string;
  commerce: string; // e.g. "Cafetería Pabellón B"
}

export interface Notification {
  id: string;
  estudianteId: string;
  tipo: 'Pago' | 'Recarga' | 'Alerta' | 'Promoción';
  mensaje: string;
  fecha: string; // ISO date-time
  leido: boolean;
}

export interface LinkedDevice {
  id: string;
  estudianteId: string;
  nombreDispositivo: string;
  sistemaOperativo: string;
  ultimoAcceso: string;
  estado: 'Activo' | 'Bloqueado';
  esDispositivoActual: boolean;
}

export interface HelpTicket {
  id: string;
  estudianteId: string;
  tipo: 'Devolución' | 'Reclamo' | 'Sugerencia';
  servicioRelacionado?: string;
  descripcion: string;
  codigoTransaccion?: string;
  estado: 'Pendiente' | 'En Proceso' | 'Resuelto';
  fechaRegistro: string;
  respuesta?: string;
}
