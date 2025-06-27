import { create } from "zustand"
import { persist } from "zustand/middleware"

interface RFPFormData {
  projectName?: string
  projectDescription?: string
  industry?: string
  projectType?: string
  budget?: string
  timeline?: string
  location?: string
  disciplines?: string[]
  requirements?: string[]
  makeInIndia?: boolean
  msmePreference?: boolean
  bilingualContent?: boolean
  localContent?: number
}

interface GeneratedRFP {
  success: boolean
  rfpText: string
  metadata: {
    projectName: string
    industry: string
    wordCount: number
    generatedAt: string
    aiProvider: string
  }
}

interface RFPStore {
  formData: RFPFormData
  setFormData: (data: RFPFormData) => void
  generatedRFP: GeneratedRFP | null
  setGeneratedRFP: (rfp: GeneratedRFP | null) => void
  isGenerating: boolean
  setIsGenerating: (generating: boolean) => void
  resetForm: () => void
}

export const useRFPStore = create<RFPStore>()(
  persist(
    (set) => ({
      formData: {},
      setFormData: (data) => set({ formData: data }),
      generatedRFP: null,
      setGeneratedRFP: (rfp) => set({ generatedRFP: rfp }),
      isGenerating: false,
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      resetForm: () => set({ formData: {}, generatedRFP: null, isGenerating: false }),
    }),
    {
      name: "rfp-store",
      partialize: (state) => ({ formData: state.formData, generatedRFP: state.generatedRFP }),
    },
  ),
)
