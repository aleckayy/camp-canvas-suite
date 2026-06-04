// Reactive camp data store with localStorage persistence.
// Single source of truth at runtime; seed values come from camp-data.ts.
import { useSyncExternalStore } from "react";
import {
  type Activity,
  type Animator,
  type Group,
  type Incident,
  type Notice,
  type Participant,
  type Resource,
  type Shift,
  initialCamp,
  initialAnimators,
  initialGroups,
  initialParticipants,
  initialActivities,
  initialShifts,
  initialNotices,
  initialIncidents,
  initialResources,
} from "./camp-data";

export interface CampInfo {
  id: string;
  name: string;
  motto: string;
  theme: string;
  startDate: string;
  endDate: string;
  location: string;
  status: "preparacion" | "activo" | "finalizado";
  primaryColor?: string;
  secondaryColor?: string;
  image?: string;
}

export interface CampState {
  camp: CampInfo;
  animators: Animator[];
  groups: Group[];
  participants: Participant[];
  activities: Activity[];
  shifts: Shift[];
  notices: Notice[];
  incidents: Incident[];
  resources: Resource[];
}

const STORAGE_KEY = "campaweb_data_v1";

function seed(): CampState {
  return {
    camp: { ...initialCamp },
    animators: [...initialAnimators] as unknown as Animator[],
    groups: [...initialGroups],
    participants: [...initialParticipants],
    activities: [...initialActivities],
    shifts: [...initialShifts],
    notices: [...initialNotices],
    incidents: [...initialIncidents],
    resources: [...initialResources],
  };
}

function load(): CampState {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw) as CampState;
    return { ...seed(), ...parsed };
  } catch {
    return seed();
  }
}

let state: CampState | null = null;
function ensureState(): CampState {
  if (state === null) state = load();
  return state;
}
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ensureState()));
  } catch {
    /* quota */
  }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function getSnapshot() {
  return ensureState();
}

function setState(updater: (s: CampState) => CampState) {
  state = updater(ensureState());
  emit();
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

// ===== Hook =====
export function useCampStore(): CampState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

// Direct snapshot read (for non-react helpers and admin actions)
export function getCampState(): CampState {
  return ensureState();
}

// ===== Actions =====
export const campActions = {
  resetAll() {
    state = seed();
    emit();
  },
  // Camp
  updateCamp(patch: Partial<CampInfo>) {
    setState((s) => ({ ...s, camp: { ...s.camp, ...patch } }));
  },
  // Animators
  addAnimator(a: Omit<Animator, "id">) {
    setState((s) => ({ ...s, animators: [...s.animators, { ...a, id: uid("an") }] }));
  },
  updateAnimator(id: string, patch: Partial<Animator>) {
    setState((s) => ({
      ...s,
      animators: s.animators.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
  },
  removeAnimator(id: string) {
    setState((s) => ({ ...s, animators: s.animators.filter((a) => a.id !== id) }));
  },
  // Groups
  addGroup(g: Omit<Group, "id">) {
    setState((s) => ({ ...s, groups: [...s.groups, { ...g, id: uid("g") }] }));
  },
  updateGroup(id: string, patch: Partial<Group>) {
    setState((s) => ({
      ...s,
      groups: s.groups.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    }));
  },
  removeGroup(id: string) {
    setState((s) => ({ ...s, groups: s.groups.filter((g) => g.id !== id) }));
  },
  // Participants
  addParticipant(p: Omit<Participant, "id">) {
    setState((s) => ({ ...s, participants: [...s.participants, { ...p, id: uid("p") }] }));
  },
  updateParticipant(id: string, patch: Partial<Participant>) {
    setState((s) => ({
      ...s,
      participants: s.participants.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  },
  removeParticipant(id: string) {
    setState((s) => ({ ...s, participants: s.participants.filter((p) => p.id !== id) }));
  },
  // Activities
  addActivity(a: Omit<Activity, "id">) {
    setState((s) => ({ ...s, activities: [...s.activities, { ...a, id: uid("a") }] }));
  },
  updateActivity(id: string, patch: Partial<Activity>) {
    setState((s) => ({
      ...s,
      activities: s.activities.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
  },
  removeActivity(id: string) {
    setState((s) => ({ ...s, activities: s.activities.filter((a) => a.id !== id) }));
  },
  duplicateActivity(id: string) {
    setState((s) => {
      const src = s.activities.find((a) => a.id === id);
      if (!src) return s;
      return { ...s, activities: [...s.activities, { ...src, id: uid("a"), title: `${src.title} (copia)` }] };
    });
  },
  // Shifts
  addShift(sh: Omit<Shift, "id">) {
    setState((s) => ({ ...s, shifts: [...s.shifts, { ...sh, id: uid("s") }] }));
  },
  updateShift(id: string, patch: Partial<Shift>) {
    setState((s) => ({ ...s, shifts: s.shifts.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));
  },
  removeShift(id: string) {
    setState((s) => ({ ...s, shifts: s.shifts.filter((x) => x.id !== id) }));
  },
  // Notices
  addNotice(n: Omit<Notice, "id">) {
    setState((s) => ({ ...s, notices: [{ ...n, id: uid("n") }, ...s.notices] }));
  },
  updateNotice(id: string, patch: Partial<Notice>) {
    setState((s) => ({ ...s, notices: s.notices.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));
  },
  removeNotice(id: string) {
    setState((s) => ({ ...s, notices: s.notices.filter((x) => x.id !== id) }));
  },
  // Incidents
  addIncident(i: Omit<Incident, "id">) {
    setState((s) => ({ ...s, incidents: [{ ...i, id: uid("i") }, ...s.incidents] }));
  },
  updateIncident(id: string, patch: Partial<Incident>) {
    setState((s) => ({ ...s, incidents: s.incidents.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));
  },
  removeIncident(id: string) {
    setState((s) => ({ ...s, incidents: s.incidents.filter((x) => x.id !== id) }));
  },
  // Resources
  addResource(r: Omit<Resource, "id">) {
    setState((s) => ({ ...s, resources: [...s.resources, { ...r, id: uid("r") }] }));
  },
  updateResource(id: string, patch: Partial<Resource>) {
    setState((s) => ({ ...s, resources: s.resources.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));
  },
  removeResource(id: string) {
    setState((s) => ({ ...s, resources: s.resources.filter((x) => x.id !== id) }));
  },
};
