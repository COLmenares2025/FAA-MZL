import { create } from 'zustand'
import { api } from '../api/client'

export const useAuth = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const params = new URLSearchParams()
      params.append('username', email)
      params.append('password', password)
      const { data } = await api.post('/auth/login', params)
      localStorage.setItem('token', data.access_token)
      set({ token: data.access_token })
      const me = await api.get('/auth/me')
      set({ user: me.data })
      return true
    } catch (e) {
      set({ error: e.response?.data?.detail || 'Login failed' })
      return false
    } finally {
      set({ loading: false })
    }
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },
  fetchMe: async () => {
    try {
      const { data } = await api.get('/auth/me')
      set({ user: data })
    } catch {}
  },
}))
