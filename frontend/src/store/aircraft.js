import { create } from 'zustand'
import { api } from '../api/client'

export const useAircraftStore = create((set, get) => ({
  active: null,
  times: null,
  recentMtrs: [],
  list: [],
  loading: false,

  initFromStorage: () => {
    const id = localStorage.getItem('active_aircraft_id')
    if (id) get().setActiveById(Number(id))
  },

  fetchList: async (q = '', include_archived = false) => {
    const { data } = await api.get('/aircraft/', { params: { q, include_archived } })
    set({ list: data })
    return data
  },

  setActive: async (aircraft) => {
    set({ active: aircraft })
    localStorage.setItem('active_aircraft_id', String(aircraft.id))
    await get().refreshActiveData()
  },

  setActiveById: async (id) => {
    try {
      const { data } = await api.get(`/aircraft/${id}`)
      await get().setActive(data)
    } catch {
      localStorage.removeItem('active_aircraft_id')
      set({ active: null, times: null, recentMtrs: [] })
    }
  },

  refreshActiveData: async () => {
    const a = get().active
    if (!a) return
    try {
      const [{ data: times }, { data: mtrs }] = await Promise.all([
        api.get(`/aircraft/${a.id}/times-cycles`).catch(() => ({ data: null })),
        api.get('/mtrs', { params: { aircraft_id: a.id } }).catch(() => ({ data: [] })),
      ])
      set({ times, recentMtrs: mtrs })
    } catch {
      set({ times: null, recentMtrs: [] })
    }
  },
}))

