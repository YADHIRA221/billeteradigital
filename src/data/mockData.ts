/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Estudiante, ServiceUniversity, Promotion, Transaction, LinkedDevice, Notification } from '../types';

export const INITIAL_STUDENT: Estudiante = {
  id: "est-001",
  codigoUniversitario: "25204598",
  nombres: "Milagros Vanessa",
  apellidos: "Valdivieso Alarcón",
  dni: "74895612",
  correoInstitucional: "milvaldiviesoala@uch.pe",
  carrera: "Ingeniería de Sistemas e Informática",
  cicloAcademico: "VIII Ciclo",
  estadoMatricula: "Matriculado",
  fotoPerfil: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200", // Soft portrait
  fechaRegistro: "2024-03-12"
};

export const INITIAL_SERVICES: ServiceUniversity[] = [
  {
    id: "srv-001",
    nombre: "Matrícula Ordinaria 2026-II",
    categoria: "Académico",
    descripcion: "Pago por derecho de matrícula regular para el ciclo académico correspondiente.",
    precio: 150.00,
    estado: "Activo"
  },
  {
    id: "srv-002",
    nombre: "Pensión de Estudios - Cuota 1",
    categoria: "Académico",
    descripcion: "Primera armada mensual por servicios de enseñanza académica regular.",
    precio: 380.00,
    estado: "Activo"
  },
  {
    id: "srv-003",
    nombre: "Constancia de Estudios Digital",
    categoria: "Académico",
    descripcion: "Documento oficial digital que acredita la condición de matrícula del estudiante.",
    precio: 25.00,
    estado: "Activo"
  },
  {
    id: "srv-004",
    nombre: "Certificado Parcial de Estudios",
    categoria: "Académico",
    descripcion: "Historial de notas visado por Secretaría Académica por ciclos concluidos.",
    precio: 60.00,
    estado: "Activo"
  },
  {
    id: "srv-005",
    nombre: "Derecho de Carné Universitario UCH",
    categoria: "Servicios Complementarios",
    descripcion: "Trámite de expedición y entrega de carné de medio pasaje de la SUNEDU.",
    precio: 16.00,
    estado: "Activo"
  },
  {
    id: "srv-006",
    nombre: "Curso Extracurricular - Python Avanzado",
    categoria: "Servicios Complementarios",
    descripcion: "Taller teórico-práctico de especialización en analítica de datos con Python.",
    precio: 120.00,
    estado: "Activo"
  },
  {
    id: "srv-007",
    nombre: "Alquiler Cubículo de Estudio (Sesión 4h)",
    categoria: "Servicios Complementarios",
    descripcion: "Reserva de espacio acústico y pantalla inteligente para trabajo grupal en Biblioteca.",
    precio: 5.00,
    estado: "Activo"
  },
  {
    id: "srv-008",
    nombre: "Taller Deportivo: Futsal Selectivo",
    categoria: "Servicios Complementarios",
    descripcion: "Inscripción en el programa deportivo y uso de campos y vestuarios.",
    precio: 45.00,
    estado: "Activo"
  }
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: "prom-001",
    titulo: "Combo Almuerzo UCH",
    descripcion: "15% de descuento en el menú del día pagando con tu Billetera Unipay.",
    fechaInicio: "2026-06-01",
    fechaFin: "2026-06-30",
    condiciones: "Válido de lunes a viernes de 12:00 PM a 3:00 PM. No acumulable con otras promociones.",
    estado: "Activo",
    codigoCupon: "UCHMENU15",
    descuentoText: "15% DSCTO",
    commerce: "Cafetería Principal Pabellón A"
  },
  {
    id: "prom-002",
    titulo: "Descuento en Útiles e Impresiones",
    descripcion: "10% de descuento en cuadernos oficiales, fotocopias y útiles escolares.",
    fechaInicio: "2026-06-01",
    fechaFin: "2026-07-15",
    condiciones: "Consumo mínimo de S/ 10.00 aplicando tu billetera móvil.",
    estado: "Activo",
    codigoCupon: "UCHCOPIA10",
    descuentoText: "10% DSCTO",
    commerce: "Fotocopiadora y Librería Central"
  },
  {
    id: "prom-003",
    titulo: "Semana del Libro Universitario",
    descripcion: "20% directo de descuento en textos de investigación editados por el Fondo Editorial UCH.",
    fechaInicio: "2026-06-03",
    fechaFin: "2026-06-10",
    condiciones: "Sujeto a stock disponible en la librería institucional. Válido un ejemplar por código de alumno.",
    estado: "Activo",
    codigoCupon: "UCHLIBROS20",
    descuentoText: "20% DSCTO",
    commerce: "Librería Universitaria - Sede Central"
  },
  {
    id: "prom-004",
    titulo: "Matrícula Anticipada Taller",
    descripcion: "S/ 10 de ahorro en la matrícula de cualquier taller de danza o expresión artística.",
    fechaInicio: "2026-05-15",
    fechaFin: "2026-06-15",
    condiciones: "Promoción exclusiva para alumnos regulares de pregrado con ciclo activo.",
    estado: "Activo",
    codigoCupon: "UCHARTE10",
    descuentoText: "S/ 10 MENOS",
    commerce: "Oficina de Bienestar Universitario"
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1001",
    walletId: "wal-001",
    tipo: "Recarga",
    monto: 110.00,
    fecha: "2026-06-01",
    hora: "09:12:44",
    estado: "Exitoso",
    descripcion: "Recarga de saldo por Yape",
    metodoUtilizado: "Yape",
    codigoOperacion: "OP-983174921"
  },
  {
    id: "tx-1002",
    walletId: "wal-001",
    tipo: "Pago QR",
    categoria: "Alimentación",
    monto: 12.50,
    fecha: "2026-06-01",
    hora: "13:04:12",
    estado: "Exitoso",
    descripcion: "Almuerzo Ejecutivo - Cafetería Pabellón B",
    metodoUtilizado: "Saldo Billetera",
    codigoOperacion: "OP-482019483"
  },
  {
    id: "tx-1003",
    walletId: "wal-001",
    tipo: "Pago QR",
    categoria: "Fotocopias",
    monto: 4.80,
    fecha: "2026-06-02",
    hora: "10:35:50",
    estado: "Exitoso",
    descripcion: "Fotocopias Sílabo - Pabellón A",
    metodoUtilizado: "Saldo Billetera",
    codigoOperacion: "OP-184920485"
  },
  {
    id: "tx-1004",
    walletId: "wal-001",
    tipo: "Pago Servicio",
    categoria: "Trámites",
    monto: 25.00,
    fecha: "2026-06-03",
    hora: "16:20:00",
    estado: "Exitoso",
    descripcion: "Constancia de Estudios Digital",
    metodoUtilizado: "Saldo Billetera",
    codigoOperacion: "OP-332904812"
  },
  {
    id: "tx-10005",
    walletId: "wal-001",
    tipo: "Recarga",
    monto: 50.00,
    fecha: "2026-06-04",
    hora: "08:15:30",
    estado: "Exitoso",
    descripcion: "Recarga por Tarjeta Visa Débito BCP",
    metodoUtilizado: "Tarjeta de Débito",
    codigoOperacion: "OP-773491204"
  },
  {
    id: "tx-1006",
    walletId: "wal-001",
    tipo: "Pago QR",
    categoria: "Otros",
    monto: 15.00,
    fecha: "2026-06-04",
    hora: "14:45:10",
    estado: "Exitoso",
    descripcion: "Inscripción en Feria Tecnológica UCH 2026",
    metodoUtilizado: "Saldo Billetera",
    codigoOperacion: "OP-549102945"
  },
  {
    id: "tx-1007",
    walletId: "wal-001",
    tipo: "Pago QR",
    categoria: "Alimentación",
    monto: 7.50,
    fecha: "2026-06-05",
    hora: "11:20:15",
    estado: "Exitoso",
    descripcion: "Café + Sandwich - Concesionario Central Pav A",
    metodoUtilizado: "Saldo Billetera",
    codigoOperacion: "OP-449102381"
  }
];

export const INITIAL_DEVICES: LinkedDevice[] = [
  {
    id: "dev-01",
    estudianteId: "est-001",
    nombreDispositivo: "Samsung Galaxy S23 Ultra",
    sistemaOperativo: "Android 14 (OneUI 6.1)",
    ultimoAcceso: "2026-06-05T00:39:05Z",
    estado: "Activo",
    esDispositivoActual: true
  },
  {
    id: "dev-02",
    estudianteId: "est-001",
    nombreDispositivo: "Apple iPad Pro 11\"",
    sistemaOperativo: "iPadOS 17.4",
    ultimoAcceso: "2026-06-03T18:42:15Z",
    estado: "Activo",
    esDispositivoActual: false
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "not-01",
    estudianteId: "est-001",
    tipo: "Recarga",
    mensaje: "¡Recarga exitosa! Se han acreditado S/ 50.00 a tu saldo disponible mediante Tarjeta de Débito.",
    fecha: "2026-06-04T08:15:35Z",
    leido: false
  },
  {
    id: "not-02",
    estudianteId: "est-001",
    tipo: "Pago",
    mensaje: "Pago realizado con éxito por S/ 25.00 para el servicio: Constancia de Estudios Digital.",
    fecha: "2026-06-03T16:20:05Z",
    leido: true
  },
  {
    id: "not-03",
    estudianteId: "est-001",
    tipo: "Promoción",
    mensaje: "¡Aprovecha el 15% de descuento en el Combo Almuerzo UCH Pabellón B usando tu código de carnet!",
    fecha: "2026-06-01T11:00:00Z",
    leido: true
  }
];
