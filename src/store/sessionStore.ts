// src/store/sessionStore.ts
import { create } from 'zustand'

interface Session {
  id: number
  client_id: number
  therapist_id: number
  session_date: string
  duration: number
  notes?: string
  status: string
  ai_summary?: string
}

interface SessionState {
  sessions: Session[]
  selectedSession: Session | null
  setSessions: (sessions: Session[]) => void
  setSelectedSession: (session: Session | null) => void
  addSession: (session: Session) => void
  updateSession: (session: Session) => void
  removeSession: (id: number) => void
}

export const useSessionStore = create<SessionState>((set) => ({
  sessions: [],
  selectedSession: null,
  setSessions: (sessions) => set({ sessions }),
  setSelectedSession: (session) => set({ selectedSession: session }),
  addSession: (session) =>
    set((state) => ({ sessions: [...state.sessions, session] })),
  updateSession: (session) =>
    set((state) => ({
      sessions: state.clients.map((s) => (s.id === session.id ? session : s)),
    })),
  removeSession: (id) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
    })),
}))
