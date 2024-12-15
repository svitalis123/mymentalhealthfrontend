// src/store/clientStore.ts
import { create } from 'zustand'

interface Client {
  id: number
  name: string
  email: string
  phone?: string
  ai_insights?: string
}

interface ClientState {
  clients: Client[]
  selectedClient: Client | null
  setClients: (clients: Client[]) => void
  setSelectedClient: (client: Client | null) => void
  addClient: (client: Client) => void
  updateClient: (client: Client) => void
  removeClient: (id: number) => void
}

export const useClientStore = create<ClientState>((set) => ({
  clients: [],
  selectedClient: null,
  setClients: (clients) => set({ clients }),
  setSelectedClient: (client) => set({ selectedClient: client }),
  addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),
  updateClient: (client) =>
    set((state) => ({
      clients: state.clients.map((c) => (c.id === client.id ? client : c)),
    })),
  removeClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== id),
    })),
}))
