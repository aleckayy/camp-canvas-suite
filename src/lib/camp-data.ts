// Camp domain types, seed data and read helpers.
// Mutable state lives in camp-store.ts. The exports prefixed `initial*` are
// the seeds the store uses on first load; runtime helpers read from the store.

import { getCampState } from "./camp-store";

export type Role = "coordinacion" | "animador" | "admin";

export type ActivityCategory =
  | "oracion"
  | "buenos-dias"
  | "taller"
  | "tiempo"
  | "actividad"
  | "velada"
  | "noches";

export interface Animator {
  id: string;
  name: string;
  initials: string;
  role: Role;
  groupId?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  hometown?: string;
  responsibilities?: string;
  active?: boolean;
  photoUrl?: string;
}

export interface Participant {
  id: string;
  name: string;
  lastName: string;
  birthdate: string;
  age: number;
  hometown: string;
  groupId: string;
  allergies?: string;
  intolerances?: string;
  medication?: string;
  notes?: string;
  responsibleAnimatorId?: string;
}

export interface Group {
  id: string;
  name: string;
  color: string;
  description: string;
  animatorId: string;
}

export interface Activity {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  category: ActivityCategory;
  title: string;
  location: string;
  responsibleIds: string[];
  objective?: string;
  description?: string;
  steps?: string[];
  materials?: string[];
  notes?: string;
  status?: "pendiente" | "preparada" | "en-curso" | "finalizada";
}

export interface Shift {
  id: string;
  date: string;
  type:
    | "dormitorios"
    | "duchas"
    | "comedor"
    | "desayuno"
    | "merienda"
    | "oficios"
    | "limpieza"
    | "musica"
    | "material"
    | "botiquin"
    | "video";
  animatorIds: string[];
}

export interface Notice {
  id: string;
  createdAt: string;
  title: string;
  body: string;
  urgent: boolean;
  authorId: string;
  targetAnimatorIds?: string[]; // empty/undefined = all
}

export interface Incident {
  id: string;
  date: string;
  participantId: string;
  type: "salud" | "convivencia" | "comportamiento" | "material" | "otro";
  description: string;
  severity: "baja" | "media" | "alta";
  status: "abierta" | "seguimiento" | "resuelta";
  reporterId: string;
  internalNote?: string;
}

export interface Resource {
  id: string;
  category:
    | "oraciones"
    | "celebraciones"
    | "buenas-noches"
    | "temas"
    | "dinamicas"
    | "juegos"
    | "gymkanas"
    | "talleres"
    | "cancioneros"
    | "imprimible"
    | "documentos";
  title: string;
  summary: string;
  favorite?: boolean;
  fileUrl?: string;
}

// ===== Seeds =====
export const initialCamp = {
  id: "nh-2024",
  name: "Campamento NH",
  motto: "Un mundo por conocer",
  theme: "Viajes",
  startDate: "2024-07-07",
  endDate: "2024-07-14",
  location: "Casa de Convivencias Los Pinares",
  status: "activo" as const,
  primaryColor: "#FF5A1F",
  secondaryColor: "#0F172A",
};

export const initialAnimators = [
{
id: "anim-ana",
name: "Ana Míguez",
initials: "AM",
role: "Animadora",
hometown: "Utrera",
groupId: null,
responsibilities: ["Coordinación"],
active: true,
phone: "",
email: "",
},
{
id: "anim-manu",
name: "Manuel Ruiz",
initials: "MR",
role: "Animador",
hometown: "Cádiz",
groupId: "group-fly-ding-dong",
responsibilities: [],
active: true,
phone: "",
email: "",
},
{
id: "anim-javi",
name: "Javi Alba",
initials: "JA",
role: "Animador",
hometown: "Jerez",
groupId: "group-lion-air",
responsibilities: [],
active: true,
phone: "",
email: "",
},
{
id: "anim-manuela",
name: "Manuela Vázquez",
initials: "MV",
role: "Animadora",
hometown: "Jerez",
groupId: "group-vayana-airlines",
responsibilities: [],
active: true,
phone: "",
email: "",
},
{
id: "anim-rocio",
name: "Rocío Montero",
initials: "RM",
role: "Animadora",
hometown: "San Vicente",
groupId: "group-wendy-airlines",
responsibilities: [],
active: true,
phone: "",
email: "",
},
{
id: "anim-constanza",
name: "Constanza Benítez",
initials: "CB",
role: "Animadora",
hometown: "San Vicente",
groupId: "group-chip-airlines",
responsibilities: [],
active: true,
phone: "",
email: "",
},
{
id: "anim-alejandro",
name: "Alejandro Miranda",
initials: "AM",
role: "Animador",
hometown: "Marbella",
groupId: "group-sky-scar",
responsibilities: ["Vídeos"],
active: true,
phone: "",
email: "",
},
{
id: "anim-gonzalo",
name: "Gonzalo García",
initials: "GG",
role: "Animador",
hometown: "Nervión",
groupId: "group-air-flandes",
responsibilities: [],
active: true,
phone: "",
email: "",
},
{
id: "anim-auxi",
name: "Sor Auxi Herrera",
initials: "AH",
role: "Religiosa",
hometown: "Écija",
groupId: null,
responsibilities: ["Acompañamiento"],
active: true,
phone: "",
email: "",
},
{
id: "anim-bosco",
name: "Bosco Piña",
initials: "BP",
role: "Animador",
hometown: "Utrera",
groupId: "group-coco-airways",
responsibilities: [],
active: true,
phone: "",
email: "",
},
];


export const initialGroups = [
{
id: "group-wendy-airlines",
name: "Wendy Airlines",
description: "Grupo de Rocío",
animatorId: "anim-rocio",
color: "#ef4444",
},
{
id: "group-lion-air",
name: "Lion Air",
description: "Grupo de Javi",
animatorId: "anim-javi",
color: "#f59e0b",
},
{
id: "group-coco-airways",
name: "Coco Airways",
description: "Grupo de Bosco",
animatorId: "anim-bosco",
color: "#10b981",
},
{
id: "group-vayana-airlines",
name: "Vayana Airlines",
description: "Grupo de Manuela",
animatorId: "anim-manuela",
color: "#3b82f6",
},
{
id: "group-air-flandes",
name: "Air Flandes",
description: "Grupo de Gonzalo",
animatorId: "anim-gonzalo",
color: "#8b5cf6",
},
{
id: "group-fly-ding-dong",
name: "Fly Ding Dong",
description: "Grupo de Manu",
animatorId: "anim-manu",
color: "#ec4899",
},
{
id: "group-sky-scar",
name: "Sky Scar",
description: "Grupo de Alejandro",
animatorId: "anim-alejandro",
color: "#06b6d4",
},
{
id: "group-chip-airlines",
name: "Chip Airlines",
description: "Grupo de Constanza",
animatorId: "anim-constanza",
color: "#84cc16",
},
];

export const initialParticipants: Participant[] = [
  // GRUPO 1 - Wendy Airlines
  { id: "p-wendy-1", name: "Paola", lastName: "Bartolomé Bergilio", birthdate: "", age: 0, hometown: "Cádiz", groupId: "group-wendy-airlines" },
  { id: "p-wendy-2", name: "Román", lastName: "Caro Marín", birthdate: "", age: 0, hometown: "Écija", groupId: "group-wendy-airlines" },
  { id: "p-wendy-3", name: "Marta", lastName: "Matas Martín", birthdate: "", age: 0, hometown: "Écija", groupId: "group-wendy-airlines" },
  { id: "p-wendy-4", name: "Alejandro", lastName: "Padilla Ramos", birthdate: "", age: 0, hometown: "Jerez-María Auxiliadora", groupId: "group-wendy-airlines" },
  { id: "p-wendy-5", name: "Lucía", lastName: "García de la Haba", birthdate: "", age: 0, hometown: "Marbella", groupId: "group-wendy-airlines" },
  { id: "p-wendy-6", name: "Ana", lastName: "Núñez Giraldez", birthdate: "", age: 0, hometown: "Marbella", groupId: "group-wendy-airlines" },
  { id: "p-wendy-7", name: "Sofía", lastName: "Contreras Villanueva", birthdate: "", age: 0, hometown: "Sevilla-Nervión", groupId: "group-wendy-airlines" },
  { id: "p-wendy-8", name: "Carlota", lastName: "Baena Segura", birthdate: "", age: 0, hometown: "Sevilla-Nervión", groupId: "group-wendy-airlines" },
  { id: "p-wendy-9", name: "Sofía", lastName: "Tirado Prieto", birthdate: "", age: 0, hometown: "Sevilla-Torneo", groupId: "group-wendy-airlines" },
  { id: "p-wendy-10", name: "Jaime", lastName: "Rodríguez Díaz", birthdate: "", age: 0, hometown: "Sevilla-Torneo", groupId: "group-wendy-airlines" },
  { id: "p-wendy-11", name: "Marta", lastName: "Rodríguez Martínez", birthdate: "", age: 0, hometown: "Utrera", groupId: "group-wendy-airlines" },

  // GRUPO 2 - Lion Air
  { id: "p-lion-1", name: "María", lastName: "Aranda Ramírez", birthdate: "", age: 0, hometown: "Cádiz", groupId: "group-lion-air" },
  { id: "p-lion-2", name: "Sofía", lastName: "Díaz Muñoz", birthdate: "", age: 0, hometown: "Écija", groupId: "group-lion-air" },
  { id: "p-lion-3", name: "Rocío", lastName: "Osuna López", birthdate: "", age: 0, hometown: "Écija", groupId: "group-lion-air" },
  { id: "p-lion-4", name: "Pablo", lastName: "Morales Galán", birthdate: "", age: 0, hometown: "Jerez-María Auxiliadora", groupId: "group-lion-air" },
  { id: "p-lion-5", name: "Águeda", lastName: "Zumaquero García", birthdate: "", age: 0, hometown: "Marbella", groupId: "group-lion-air" },
  { id: "p-lion-6", name: "Sofía", lastName: "Lluyot García", birthdate: "", age: 0, hometown: "Rota", groupId: "group-lion-air" },
  { id: "p-lion-7", name: "Carla", lastName: "Sánchez Blanco", birthdate: "", age: 0, hometown: "Sevilla-Nervión", groupId: "group-lion-air" },
  { id: "p-lion-8", name: "Carlota", lastName: "Picón Manzano", birthdate: "", age: 0, hometown: "Sevilla-Nervión", groupId: "group-lion-air" },
  { id: "p-lion-9", name: "Margarita", lastName: "Díaz Olivares", birthdate: "", age: 0, hometown: "Sevilla-Torneo", groupId: "group-lion-air" },
  { id: "p-lion-10", name: "Antonio", lastName: "Moreno González", birthdate: "", age: 0, hometown: "Utrera", groupId: "group-lion-air" },

  // GRUPO 3 - Coco Airways
  { id: "p-coco-1", name: "María", lastName: "Cruz Cordón", birthdate: "", age: 0, hometown: "Cádiz", groupId: "group-coco-airways" },
  { id: "p-coco-2", name: "María del Carmen", lastName: "Varela Heredia", birthdate: "", age: 0, hometown: "Écija", groupId: "group-coco-airways" },
  { id: "p-coco-3", name: "Reyes", lastName: "Del Marco Álvarez-Ossorio", birthdate: "", age: 0, hometown: "Écija", groupId: "group-coco-airways" },
  { id: "p-coco-4", name: "Claudia", lastName: "Racero Rosado", birthdate: "", age: 0, hometown: "Jerez-María Auxiliadora", groupId: "group-coco-airways" },
  { id: "p-coco-5", name: "Ana", lastName: "García Valdenebro", birthdate: "", age: 0, hometown: "Marbella", groupId: "group-coco-airways" },
  { id: "p-coco-6", name: "María", lastName: "Domínguez Ramos", birthdate: "", age: 0, hometown: "Rota", groupId: "group-coco-airways" },
  { id: "p-coco-7", name: "Carla", lastName: "Mesa Estevez", birthdate: "", age: 0, hometown: "Sevilla-Nervión", groupId: "group-coco-airways" },
  { id: "p-coco-8", name: "Candela", lastName: "Ortiz Valdenebro", birthdate: "", age: 0, hometown: "Sevilla-Nervión", groupId: "group-coco-airways" },
  { id: "p-coco-9", name: "Víctor", lastName: "Hidalgo de la Torre", birthdate: "", age: 0, hometown: "Sevilla-Torneo", groupId: "group-coco-airways" },
  { id: "p-coco-10", name: "Daniela", lastName: "González Quintana", birthdate: "", age: 0, hometown: "Utrera", groupId: "group-coco-airways" },

  // GRUPO 4 - Vayana Airlines
  { id: "p-vayana-1", name: "Lucía", lastName: "Gómez Noya", birthdate: "", age: 0, hometown: "Cádiz", groupId: "group-vayana-airlines" },
  { id: "p-vayana-2", name: "Rafael", lastName: "Castilla Díaz", birthdate: "", age: 0, hometown: "Écija", groupId: "group-vayana-airlines" },
  { id: "p-vayana-3", name: "Miguel", lastName: "Rivera Dugo", birthdate: "", age: 0, hometown: "Écija", groupId: "group-vayana-airlines" },
  { id: "p-vayana-4", name: "Sofía", lastName: "Maraver Díaz", birthdate: "", age: 0, hometown: "Jerez-María Auxiliadora", groupId: "group-vayana-airlines" },
  { id: "p-vayana-5", name: "Claudia", lastName: "Giraldez Villarrubia", birthdate: "", age: 0, hometown: "Marbella", groupId: "group-vayana-airlines" },
  { id: "p-vayana-6", name: "Valeria", lastName: "García González", birthdate: "", age: 0, hometown: "Rota", groupId: "group-vayana-airlines" },
  { id: "p-vayana-7", name: "Joaquín", lastName: "Recio del Estad", birthdate: "", age: 0, hometown: "Sevilla-Nervión", groupId: "group-vayana-airlines" },
  { id: "p-vayana-8", name: "Paz", lastName: "Benítez Olmedo", birthdate: "", age: 0, hometown: "Sevilla-Nervión", groupId: "group-vayana-airlines" },
  { id: "p-vayana-9", name: "Valeria", lastName: "Yebra Calderón", birthdate: "", age: 0, hometown: "Sevilla-Torneo", groupId: "group-vayana-airlines" },
  { id: "p-vayana-10", name: "Natividad", lastName: "Ruiz Piña", birthdate: "", age: 0, hometown: "Utrera", groupId: "group-vayana-airlines" },

  // GRUPO 5 - Air Flandes
  { id: "p-air-1", name: "Mar", lastName: "Torres Urbano", birthdate: "", age: 0, hometown: "Cádiz", groupId: "group-air-flandes" },
  { id: "p-air-2", name: "Manuela", lastName: "Capitán Carrasco", birthdate: "", age: 0, hometown: "Écija", groupId: "group-air-flandes" },
  { id: "p-air-3", name: "Alfonso", lastName: "Baena Díaz", birthdate: "", age: 0, hometown: "Écija", groupId: "group-air-flandes" },
  { id: "p-air-4", name: "Sara", lastName: "Vázquez Romeral", birthdate: "", age: 0, hometown: "Jerez-San Juan Bosco", groupId: "group-air-flandes" },
  { id: "p-air-5", name: "Paula", lastName: "Martín Alarcón", birthdate: "", age: 0, hometown: "Marbella", groupId: "group-air-flandes" },
  { id: "p-air-6", name: "Ana", lastName: "García Sánchez", birthdate: "", age: 0, hometown: "Rota", groupId: "group-air-flandes" },
  { id: "p-air-7", name: "Gonzalo", lastName: "Castilla Mayor", birthdate: "", age: 0, hometown: "Sevilla-Nervión", groupId: "group-air-flandes" },
  { id: "p-air-8", name: "Lola", lastName: "González Domínguez", birthdate: "", age: 0, hometown: "Sevilla-Torneo", groupId: "group-air-flandes" },
  { id: "p-air-9", name: "Candela", lastName: "Flores Aunion", birthdate: "", age: 0, hometown: "Sevilla-Torneo", groupId: "group-air-flandes" },
  { id: "p-air-10", name: "Celia", lastName: "Barea Sánchez", birthdate: "", age: 0, hometown: "Utrera", groupId: "group-air-flandes" },

  // GRUPO 6 - Fly Ding Dong
  { id: "p-fly-1", name: "Lucía", lastName: "Cardoso Braza", birthdate: "", age: 0, hometown: "Cádiz", groupId: "group-fly-ding-dong" },
  { id: "p-fly-2", name: "Inma", lastName: "Fernández Núñez", birthdate: "", age: 0, hometown: "Écija", groupId: "group-fly-ding-dong" },
  { id: "p-fly-3", name: "Manuel", lastName: "García Gómez", birthdate: "", age: 0, hometown: "Écija", groupId: "group-fly-ding-dong" },
  { id: "p-fly-4", name: "Ángela", lastName: "Palomino Berrocal", birthdate: "", age: 0, hometown: "Jerez-San Juan Bosco", groupId: "group-fly-ding-dong" },
  { id: "p-fly-5", name: "Álvaro", lastName: "Ortiz Marín", birthdate: "", age: 0, hometown: "Marbella", groupId: "group-fly-ding-dong" },
  { id: "p-fly-6", name: "Julia", lastName: "Vidal Pérez", birthdate: "", age: 0, hometown: "Sevilla-Nervión", groupId: "group-fly-ding-dong" },
  { id: "p-fly-7", name: "Ángela", lastName: "Cáceres Tormos", birthdate: "", age: 0, hometown: "Sevilla-Nervión", groupId: "group-fly-ding-dong" },
  { id: "p-fly-8", name: "Irene", lastName: "García Cortada", birthdate: "", age: 0, hometown: "Sevilla-Torneo", groupId: "group-fly-ding-dong" },
  { id: "p-fly-9", name: "Claudia", lastName: "García Ruiz", birthdate: "", age: 0, hometown: "Sevilla-Torneo", groupId: "group-fly-ding-dong" },
  { id: "p-fly-10", name: "Carmen", lastName: "González Blanco", birthdate: "", age: 0, hometown: "Utrera", groupId: "group-fly-ding-dong" },

  // GRUPO 7 - Sky Scar
  { id: "p-sky-1", name: "Rocío", lastName: "Cepillo Lucero", birthdate: "", age: 0, hometown: "Cádiz", groupId: "group-sky-scar" },
  { id: "p-sky-2", name: "María José", lastName: "Sarmiento Flores", birthdate: "", age: 0, hometown: "Écija", groupId: "group-sky-scar" },
  { id: "p-sky-3", name: "Rocío", lastName: "Piña Moya", birthdate: "", age: 0, hometown: "Écija", groupId: "group-sky-scar" },
  { id: "p-sky-4", name: "Nuria", lastName: "Gil González", birthdate: "", age: 0, hometown: "Marbella", groupId: "group-sky-scar" },
  { id: "p-sky-5", name: "Julia", lastName: "Rodríguez Espada", birthdate: "", age: 0, hometown: "Marbella", groupId: "group-sky-scar" },
  { id: "p-sky-6", name: "Carmen", lastName: "Gutiérrez Díaz", birthdate: "", age: 0, hometown: "Sevilla-Nervión", groupId: "group-sky-scar" },
  { id: "p-sky-7", name: "Iker", lastName: "Estevez Calderón", birthdate: "", age: 0, hometown: "Sevilla-Nervión", groupId: "group-sky-scar" },
  { id: "p-sky-8", name: "Lola", lastName: "Vega Sánchez", birthdate: "", age: 0, hometown: "Sevilla-Torneo", groupId: "group-sky-scar" },
  { id: "p-sky-9", name: "Jose", lastName: "Orellana López", birthdate: "", age: 0, hometown: "Utrera", groupId: "group-sky-scar" },
  { id: "p-sky-10", name: "Lola", lastName: "Miras Pérez", birthdate: "", age: 0, hometown: "Sevilla-Torneo", groupId: "group-sky-scar" },

  // GRUPO 8 - Chip Airlines
  { id: "p-chip-1", name: "Raquel", lastName: "Armarioi Peña", birthdate: "", age: 0, hometown: "Cádiz", groupId: "group-chip-airlines" },
  { id: "p-chip-2", name: "Blanca", lastName: "Sánchez Guisado", birthdate: "", age: 0, hometown: "Écija", groupId: "group-chip-airlines" },
  { id: "p-chip-3", name: "Óscar", lastName: "Márquez Sánchez", birthdate: "", age: 0, hometown: "Jerez-María Auxiliadora", groupId: "group-chip-airlines" },
  { id: "p-chip-4", name: "Lía", lastName: "Gallego Cuadrado", birthdate: "", age: 0, hometown: "Marbella", groupId: "group-chip-airlines" },
  { id: "p-chip-5", name: "Adriana", lastName: "Blázquez Álvarez", birthdate: "", age: 0, hometown: "Marbella", groupId: "group-chip-airlines" },
  { id: "p-chip-6", name: "Cristina", lastName: "Vázquez Acilona", birthdate: "", age: 0, hometown: "Sevilla-Nervión", groupId: "group-chip-airlines" },
  { id: "p-chip-7", name: "Carmen", lastName: "Ñudi Veira", birthdate: "", age: 0, hometown: "Sevilla-Torneo", groupId: "group-chip-airlines" },
  { id: "p-chip-8", name: "Álvaro", lastName: "Dávila-Armero Fornovi", birthdate: "", age: 0, hometown: "Sevilla-Torneo", groupId: "group-chip-airlines" },
  { id: "p-chip-9", name: "Jose Carlos", lastName: "Limones Fernández", birthdate: "", age: 0, hometown: "Utrera", groupId: "group-chip-airlines" },
  { id: "p-chip-10", name: "Gonzalo", lastName: "Sánchez Cardona", birthdate: "", age: 0, hometown: "Sevilla-Torneo", groupId: "group-chip-airlines" },
];

export const campDays = [
  { date: "2024-07-07", label: "Vie 7", weekday: "Viernes" },
  { date: "2024-07-08", label: "Sáb 8", weekday: "Sábado" },
  { date: "2024-07-09", label: "Dom 9", weekday: "Domingo" },
  { date: "2024-07-10", label: "Lun 10", weekday: "Lunes" },
  { date: "2024-07-11", label: "Mar 11", weekday: "Martes" },
  { date: "2024-07-12", label: "Mié 12", weekday: "Miércoles" },
  { date: "2024-07-13", label: "Jue 13", weekday: "Jueves" },
  { date: "2024-07-14", label: "Vie 14", weekday: "Viernes" },
];

export const TODAY = "2024-07-11";
export const NOW_HHMM = "11:45";

function mk(
  id: string, date: string, st: string, et: string, cat: ActivityCategory,
  title: string, loc: string, resp: string[], extra: Partial<Activity> = {}
): Activity {
  return { id, date, startTime: st, endTime: et, category: cat, title, location: loc, responsibleIds: resp, ...extra };
}

export const initialActivities: Activity[] = [
  mk("a-7-velada", "2024-07-07", "21:30", "23:00", "velada", "Chicos vs Chicas", "Sala polivalente", ["an-marc", "an-laura"], { objective: "Romper el hielo con una gymkana por equipos." }),
  mk("a-7-noches", "2024-07-07", "23:15", "23:45", "noches", "Buenas noches: Mercedes", "Patio", ["an-ana"], { description: "Reflexión corta sobre el inicio del viaje." }),
  mk("a-8-oracion", "2024-07-08", "08:45", "09:00", "oracion", "Oración animadores", "Capilla", ["an-ana"]),
  mk("a-8-bd", "2024-07-08", "10:00", "10:30", "buenos-dias", "Yo mi yo · La Bella y la Bestia", "Salón grande", ["an-laura"], { objective: "Presentar el tema del día: Francia." }),
  mk("a-8-taller", "2024-07-08", "11:00", "13:00", "taller", "Taller de camisetas", "Patio cubierto", ["an-marc", "an-pablo"], { materials: ["Camisetas blancas", "Pinturas textiles", "Plantillas"] }),
  mk("a-8-tiempo", "2024-07-08", "17:00", "18:30", "tiempo", "Tu tiempo", "Libre", []),
  mk("a-8-velada", "2024-07-08", "22:00", "23:30", "velada", "Gymkana de bienvenida", "Campo de fútbol", ["an-dani", "an-irene"]),
  mk("a-8-noches", "2024-07-08", "23:45", "00:15", "noches", "Buenas noches: Cádiz", "Patio", ["an-marc"]),
  mk("a-9-oracion", "2024-07-09", "08:45", "09:00", "oracion", "Oración animadores", "Capilla", ["an-ana"]),
  mk("a-9-bd", "2024-07-09", "10:00", "10:30", "buenos-dias", "Eucaristía", "Capilla grande", ["co-jorge"]),
  mk("a-9-taller", "2024-07-09", "11:00", "13:00", "taller", "Videoclip / Risoterapia / Juegos de agua", "Varias zonas", ["an-laura", "an-sara", "an-dani"]),
  mk("a-9-tiempo", "2024-07-09", "17:00", "18:30", "tiempo", "Tu tiempo", "Libre", []),
  mk("a-9-velada", "2024-07-09", "22:00", "23:30", "velada", "Paseo y helado", "Pueblo", ["an-marc", "an-pablo"]),
  mk("a-9-noches", "2024-07-09", "23:45", "00:15", "noches", "Buenas noches: Marbella", "Patio", ["an-laura"]),
  mk("a-10-oracion", "2024-07-10", "08:45", "09:00", "oracion", "Oración animadores", "Capilla", ["an-ana"]),
  mk("a-10-bd", "2024-07-10", "10:00", "10:30", "buenos-dias", "Creación · Vayana · Hawai", "Salón grande", ["an-irene"]),
  mk("a-10-taller", "2024-07-10", "11:00", "13:00", "taller", "Catamarán", "Puerto", ["an-marc", "an-dani"], { materials: ["Bañadores", "Crema solar", "Toallas"] }),
  mk("a-10-tiempo", "2024-07-10", "17:00", "18:00", "tiempo", "Duchas", "Dormitorios", []),
  mk("a-10-velada", "2024-07-10", "22:00", "23:30", "velada", "Velada por WhatsApp", "Sala polivalente", ["an-sara"]),
  mk("a-10-noches", "2024-07-10", "23:45", "00:15", "noches", "Buenas noches: Nervión", "Patio", ["an-dani"]),
  mk("a-11-oracion", "2024-07-11", "08:45", "09:00", "oracion", "Oración animadores", "Capilla", ["an-ana"], { objective: "Empezar el día con calma y centrar al equipo." }),
  mk("a-11-bd", "2024-07-11", "10:00", "10:30", "buenos-dias", "Reconciliación · El Rey León · África", "Salón grande", ["an-ana"], { description: "Dinámica de presentación del tema del día con la canción del Rey León." }),
  mk("a-11-taller", "2024-07-11", "11:30", "13:00", "taller", "Taller de cocina", "Cocina principal", ["an-ana"], {
    objective: "Que cada grupo prepare un plato típico africano.",
    description: "Repartiremos a los chavales por grupos. Cada grupo tendrá una receta sencilla y un animador de apoyo.",
    steps: ["Lavado de manos y delantales (10 min)", "Reparto de recetas e ingredientes por grupo (10 min)", "Elaboración (45 min)", "Cata conjunta y limpieza (25 min)"],
    materials: ["Delantales", "Ingredientes (ver hoja)", "Recetas impresas", "Cámara para fotos"],
    notes: "Cuidado con David (alergia a frutos secos).",
  }),
  mk("a-11-comida", "2024-07-11", "14:15", "15:30", "tiempo", "Comida y tiempo libre", "Comedor", []),
  mk("a-11-tiempo", "2024-07-11", "17:00", "17:45", "tiempo", "Celebración del perdón", "Capilla", ["co-jorge"]),
  mk("a-11-velada", "2024-07-11", "22:00", "23:30", "velada", "Burguer", "Comedor", ["an-pablo", "an-sara"]),
  mk("a-11-noches", "2024-07-11", "23:45", "00:15", "noches", "Buenas noches: San Vicente", "Patio", ["an-irene"]),
  mk("a-12-oracion", "2024-07-12", "08:45", "09:00", "oracion", "Oración animadores", "Capilla", ["an-ana"]),
  mk("a-12-bd", "2024-07-12", "10:00", "10:30", "buenos-dias", "Aqualand", "Autobús", ["co-jorge"]),
  mk("a-12-taller", "2024-07-12", "11:00", "18:00", "actividad", "Aqualand", "Aqualand", ["an-marc", "an-laura", "an-dani", "an-irene"]),
  mk("a-12-velada", "2024-07-12", "22:00", "23:30", "velada", "Cine", "Sala polivalente", ["an-sara"]),
  mk("a-12-noches", "2024-07-12", "23:45", "00:15", "noches", "Buenas noches: Écija", "Patio", ["an-pablo"]),
  mk("a-13-oracion", "2024-07-13", "08:45", "09:00", "oracion", "Oración animadores", "Capilla", ["an-ana"]),
  mk("a-13-bd", "2024-07-13", "10:00", "10:30", "buenos-dias", "La familia · Coco · México", "Salón grande", ["an-laura"]),
  mk("a-13-taller", "2024-07-13", "11:00", "13:00", "taller", "Taller de pulseras", "Patio cubierto", ["an-sara", "an-marc"], { materials: ["Hilos", "Cuentas", "Tijeras"] }),
  mk("a-13-tiempo", "2024-07-13", "17:00", "18:30", "tiempo", "Tu tiempo", "Libre", []),
  mk("a-13-velada", "2024-07-13", "22:00", "23:59", "velada", "Fiesta gala final · Discoteca", "Sala polivalente", ["an-marc", "an-pablo", "an-laura"]),
  mk("a-13-noches", "2024-07-13", "00:15", "00:45", "noches", "Buenas noches: Virginia", "Patio", ["an-sara"]),
  mk("a-14-oracion", "2024-07-14", "08:45", "09:00", "oracion", "Oración animadores", "Capilla", ["an-ana"]),
  mk("a-14-bd", "2024-07-14", "10:00", "10:30", "buenos-dias", "Buenos días final", "Salón grande", ["an-ana"]),
  mk("a-14-cierre", "2024-07-14", "11:00", "13:00", "actividad", "Recogida y despedida", "Todo el recinto", ["co-jorge"]),
];

export const initialShifts: Shift[] = [
  { id: "s1", date: TODAY, type: "dormitorios", animatorIds: ["an-ana", "an-marc"] },
  { id: "s2", date: TODAY, type: "musica", animatorIds: ["an-ana"] },
  { id: "s3", date: TODAY, type: "botiquin", animatorIds: ["an-ana"] },
  { id: "s4", date: TODAY, type: "comedor", animatorIds: ["an-laura", "an-irene"] },
  { id: "s5", date: TODAY, type: "duchas", animatorIds: ["an-dani"] },
  { id: "s6", date: TODAY, type: "material", animatorIds: ["an-pablo"] },
  { id: "s7", date: TODAY, type: "video", animatorIds: ["an-sara"] },
];

export const initialNotices: Notice[] = [
  { id: "n1", createdAt: "2024-07-11T09:30", title: "Reunión de animadores tras la cena", body: "Nos vemos en el porche a las 23:30 para revisar la gymkana de mañana y el reparto de pruebas.", urgent: true, authorId: "co-jorge" },
  { id: "n2", createdAt: "2024-07-11T08:00", title: "Cambio de hora del taller", body: "El taller de cocina empieza a las 11:30 (no a las 11:00 como aparecía en el primer planning).", urgent: false, authorId: "co-jorge" },
  { id: "n3", createdAt: "2024-07-10T22:10", title: "Material para Aqualand", body: "Recordad a los chavales: bañador puesto, gorra, crema solar y toalla. Salida puntual a las 09:30.", urgent: false, authorId: "co-jorge" },
];

export const initialIncidents: Incident[] = [
  { id: "i1", date: "2024-07-10", participantId: "p2", type: "salud", description: "Episodio leve de asma tras la actividad. Se le administró el inhalador y mejoró en 10 min.", severity: "media", status: "seguimiento", reporterId: "an-ana" },
  { id: "i2", date: "2024-07-09", participantId: "p7", type: "convivencia", description: "Discusión con compañero en el dormitorio. Hablamos con los dos por separado.", severity: "baja", status: "resuelta", reporterId: "an-dani" },
  { id: "i3", date: "2024-07-11", participantId: "p6", type: "salud", description: "Picadura en el brazo, posible reacción alérgica leve.", severity: "baja", status: "abierta", reporterId: "an-laura" },
];

export const initialResources: Resource[] = [
  { id: "r1", category: "oraciones", title: "Oración del viajero", summary: "Para empezar la mañana con la temática del campamento.", favorite: true },
  { id: "r2", category: "buenas-noches", title: "Cuento: El elefante encadenado", summary: "Bucay. Buenas noches sobre las creencias limitantes." },
  { id: "r3", category: "dinamicas", title: "Dinámica de presentación: la telaraña", summary: "Ovillo de lana, en círculo. 15 min." },
  { id: "r4", category: "juegos", title: "El pañuelo (versión equipos)", summary: "Clásico del campamento, adaptado por grupos.", favorite: true },
  { id: "r5", category: "gymkanas", title: "Gymkana 'Vuelta al mundo'", summary: "8 pruebas, una por continente. 90 min." },
  { id: "r6", category: "talleres", title: "Taller de camisetas tie-dye", summary: "Material, pasos y consejos." },
  { id: "r7", category: "cancioneros", title: "Cancionero del campamento 2024", summary: "PDF con 30 canciones y acordes." },
  { id: "r8", category: "celebraciones", title: "Celebración del perdón", summary: "Esquema completo de la celebración." },
  { id: "r9", category: "temas", title: "Tema del día: África", summary: "Power point y guion del animador." },
];

// ===== Category & shift metadata =====
export const categoryMeta: Record<ActivityCategory, { label: string; color: string; ring: string; soft: string; text: string }> = {
  oracion: { label: "Oración", color: "bg-cat-oracion", ring: "border-cat-oracion", soft: "bg-cat-oracion/10", text: "text-cat-oracion" },
  "buenos-dias": { label: "Buenos días", color: "bg-cat-buenos-dias", ring: "border-cat-buenos-dias", soft: "bg-cat-buenos-dias/15", text: "text-cat-buenos-dias" },
  taller: { label: "Taller", color: "bg-cat-taller", ring: "border-cat-taller", soft: "bg-cat-taller/15", text: "text-cat-taller" },
  tiempo: { label: "Tu tiempo", color: "bg-cat-tiempo", ring: "border-cat-tiempo", soft: "bg-cat-tiempo/10", text: "text-cat-tiempo" },
  actividad: { label: "Actividad", color: "bg-cat-actividad", ring: "border-cat-actividad", soft: "bg-cat-actividad/10", text: "text-cat-actividad" },
  velada: { label: "Velada", color: "bg-cat-velada", ring: "border-cat-velada", soft: "bg-cat-velada/10", text: "text-cat-velada" },
  noches: { label: "Buenas noches", color: "bg-cat-noches", ring: "border-cat-noches", soft: "bg-cat-noches/10", text: "text-cat-noches" },
};

export const shiftMeta: Record<Shift["type"], { label: string; icon: string; tone: string }> = {
  dormitorios: { label: "Dormitorios", icon: "🛏️", tone: "bg-sky-100 text-sky-700" },
  duchas: { label: "Duchas", icon: "🚿", tone: "bg-cyan-100 text-cyan-700" },
  comedor: { label: "Comedor", icon: "🍽️", tone: "bg-orange-100 text-orange-700" },
  desayuno: { label: "Desayuno", icon: "🥐", tone: "bg-yellow-100 text-yellow-700" },
  merienda: { label: "Merienda", icon: "🥪", tone: "bg-lime-100 text-lime-700" },
  oficios: { label: "Oficios", icon: "🧰", tone: "bg-stone-100 text-stone-700" },
  limpieza: { label: "Limpieza", icon: "🧹", tone: "bg-teal-100 text-teal-700" },
  musica: { label: "Música", icon: "🎵", tone: "bg-violet-100 text-violet-700" },
  material: { label: "Material", icon: "📦", tone: "bg-amber-100 text-amber-700" },
  botiquin: { label: "Botiquín", icon: "🩹", tone: "bg-red-100 text-red-700" },
  video: { label: "Vídeo", icon: "🎥", tone: "bg-emerald-100 text-emerald-700" },
};

// ===== Live (read from store) =====
function liveArray<K extends "animators" | "groups" | "participants" | "activities" | "shifts" | "notices" | "incidents" | "resources">(key: K) {
  return new Proxy([] as unknown[], {
    get(_t, prop) {
      const arr = getCampState()[key] as unknown[];
      const v = (arr as unknown as Record<string | symbol, unknown>)[prop as string];
      return typeof v === "function" ? (v as (...a: unknown[]) => unknown).bind(arr) : v;
    },
    has(_t, prop) {
      return prop in (getCampState()[key] as unknown[]);
    },
  });
}

export const camp = new Proxy({} as ReturnType<typeof getCampState>["camp"], {
  get: (_t, p) => (getCampState().camp as unknown as Record<string | symbol, unknown>)[p as string],
});
export const animators = liveArray("animators") as Animator[];
export const groups = liveArray("groups") as Group[];
export const participants = liveArray("participants") as Participant[];
export const activities = liveArray("activities") as Activity[];
export const shifts = liveArray("shifts") as Shift[];
export const notices = liveArray("notices") as Notice[];
export const incidents = liveArray("incidents") as Incident[];
export const resources = liveArray("resources") as Resource[];

// Current user — legacy alias kept for back-compat with existing UI.
// The auth provider is the real source; here we return the first animador.
export const currentUser: Animator = new Proxy({} as Animator, {
  get(_t, p) {
    const a = getCampState().animators.find((x) => x.role === "animador") ?? getCampState().animators[0];
    return (a as unknown as Record<string | symbol, unknown>)[p as string];
  },
});


export function getAnimator(id: string): Animator | undefined {
  return getCampState().animators.find((a) => a.id === id);
}
export function getActivity(id: string): Activity | undefined {
  return getCampState().activities.find((a) => a.id === id);
}
export function getActivitiesByDate(date: string): Activity[] {
  return getCampState().activities.filter((a) => a.date === date).sort((a, b) => a.startTime.localeCompare(b.startTime));
}
export function getActivityByDayAndCategory(date: string, category: ActivityCategory): Activity | undefined {
  return getCampState().activities.find((a) => a.date === date && a.category === category);
}
export function getCurrentAndNext(date: string, now: string) {
  const list = getActivitiesByDate(date);
  const current = list.find((a) => a.startTime <= now && a.endTime > now);
  const next = list.find((a) => a.startTime > now);
  return { current, next };
}
export function getMyShifts(date: string, animatorId: string): Shift[] {
  return getCampState().shifts.filter((s) => s.date === date && s.animatorIds.includes(animatorId));
}
export function getMyActivitiesToday(date: string, animatorId: string): Activity[] {
  return getActivitiesByDate(date).filter((a) => a.responsibleIds.includes(animatorId));
}
export function getGroup(id: string): Group | undefined {
  return getCampState().groups.find((g) => g.id === id);
}
export function getGroupParticipants(groupId: string): Participant[] {
  return getCampState().participants.filter((p) => p.groupId === groupId);
}

export const PLANNER_ROWS: { category: ActivityCategory; label: string }[] = [
  { category: "oracion", label: "Oración" },
  { category: "buenos-dias", label: "Buenos días" },
  { category: "taller", label: "Taller" },
  { category: "tiempo", label: "Tu tiempo" },
  { category: "velada", label: "Velada" },
  { category: "noches", label: "Buenas noches" },
];
