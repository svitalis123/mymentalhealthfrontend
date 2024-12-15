// src/store/materialStore.ts
import { create } from 'zustand'

interface Material {
  id: number
  title: string
  content: string
  category?: string
  difficulty_level?: string
  ai_enhancements?: string
}

interface MaterialState {
  materials: Material[]
  selectedMaterial: Material | null
  setMaterials: (materials: Material[]) => void
  setSelectedMaterial: (material: Material | null) => void
  addMaterial: (material: Material) => void
  updateMaterial: (material: Material) => void
  removeMaterial: (id: number) => void
}

export const useMaterialStore = create<MaterialState>((set) => ({
  materials: [],
  selectedMaterial: null,
  setMaterials: (materials) => set({ materials }),
  setSelectedMaterial: (material) => set({ selectedMaterial: material }),
  addMaterial: (material) =>
    set((state) => ({ materials: [...state.materials, material] })),
  updateMaterial: (material) =>
    set((state) => ({
      materials: state.materials.map((m) => (m.id === material.id ? material : m)),
    })),
  removeMaterial: (id) =>
    set((state) => ({
      materials: state.materials.filter((m) => m.id !== id),
    })),
}))