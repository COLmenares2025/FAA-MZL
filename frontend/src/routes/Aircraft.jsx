import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../store/auth'
import Card from '../components/Card'
import Table from '../components/Table'

export default function Aircraft() {
  const { user } = useAuth()
  const [data, setData] = useState([])
  const [q, setQ] = useState('')
  const [includeArchived, setIncludeArchived] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const params = { q, include_archived: includeArchived }
    const { data } = await api.get('/aircraft/', { params })
    setData(data)
  }

  async function toggleArchive(row) {
    if (row.status === 'ACTIVE') {
      await api.post(`/aircraft/${row.id}/archive`)
    } else {
      await api.post(`/aircraft/${row.id}/unarchive`)
    }
    fetchData()
  }

  function AddAircraftModal({ onClose, onCreated }) {
    const [f, setF] = useState({
      model: '', serial: '', tail_number: '',
      aircraft_hours: '', landings: '', apu_hours: '', apu_cycles: '',
      eng1_hours: '', eng1_cycles: '', eng2_hours: '', eng2_cycles: '', as_of_date: '',
    })

    async function submit() {
      if (!f.model || !f.serial || !f.tail_number || !f.aircraft_hours || !f.landings) {
        alert('Model, Serial, Tail, Aircraft Hours y Landings son obligatorios')
        return
      }
      const { data: ac } = await api.post('/aircraft/', {
        model: f.model,
        serial: f.serial,
        tail_number: f.tail_number,
      })
      await api.put(`/aircraft/${ac.id}/times-cycles`, {
        aircraft_hours: Number(f.aircraft_hours),
        landings: Number(f.landings),
        apu_hours: f.apu_hours ? Number(f.apu_hours) : 0,
        apu_cycles: f.apu_cycles ? Number(f.apu_cycles) : 0,
        eng1_hours: f.eng1_hours ? Number(f.eng1_hours) : 0,
        eng1_cycles: f.eng1_cycles ? Number(f.eng1_cycles) : 0,
        eng2_hours: f.eng2_hours ? Number(f.eng2_hours) : 0,
        eng2_cycles: f.eng2_cycles ? Number(f.eng2_cycles) : 0,
        as_of_date: f.as_of_date || null,
      })
      onCreated()
      onClose()
    }

    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-20" onClick={onClose}>
        <div className="bg-white rounded-lg shadow p-4 w-full max-w-2xl" onClick={e=>e.stopPropagation()}>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Add Aircraft</h2>
            <button onClick={onClose}>✕</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
            <div>
              <label className="block text-sm">Model*</label>
              <input className="border rounded px-2 py-1 w-full" value={f.model} onChange={e=>setF({...f, model: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm">Serial* (unique)</label>
              <input className="border rounded px-2 py-1 w-full" value={f.serial} onChange={e=>setF({...f, serial: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm">Tail Number* (unique)</label>
              <input className="border rounded px-2 py-1 w-full" value={f.tail_number} onChange={e=>setF({...f, tail_number: e.target.value})} />
            </div>
          </div>
          <div className="mb-2 font-semibold text-gray-700">Times & Cycles</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              ['aircraft_hours','Aircraft Hours*'],
              ['landings','Landings*'],
              ['apu_hours','APU Hours'],
              ['apu_cycles','APU Cycles'],
              ['eng1_hours','Engine 1 Hours'],
              ['eng1_cycles','Engine 1 Cycles'],
              ['eng2_hours','Engine 2 Hours'],
              ['eng2_cycles','Engine 2 Cycles'],
              ['as_of_date','As of Date (mm/dd/yyyy)'],
            ].map(([k,label]) => (
              <div key={k}>
                <label className="block text-sm">{label}</label>
                <input className="border rounded px-2 py-1 w-full" value={f[k]} onChange={e=>setF({...f, [k]: e.target.value})} />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button className="px-3 py-1" onClick={onClose}>Cancel</button>
            <button className="bg-indigo-600 text-white rounded px-3 py-1" onClick={submit}>Create</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card title="Search">
        <div className="flex gap-2 items-center">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." className="border rounded px-2 py-1" />
          <label className="text-sm flex items-center gap-2">
            <input type="checkbox" checked={includeArchived} onChange={e=>setIncludeArchived(e.target.checked)} /> Include archived
          </label>
          <button className="bg-indigo-600 text-white rounded px-3 py-1" onClick={fetchData}>Search</button>
          <div className="flex-1" />
          {(user?.role === 'Admin' || user?.role === 'Mechanic') && (
            <button className="bg-green-600 text-white rounded px-3 py-1" onClick={()=>setModalOpen(true)}>Add Aircraft</button>
          )}
        </div>
      </Card>
      <Table
        columns={[
          { key: 'model', title: 'Model' },
          { key: 'serial', title: 'Serial' },
          { key: 'tail_number', title: 'Tail' },
          { key: 'status', title: 'Status' },
          { key: 'actions', title: 'Actions', render: (v, row) => (
            <div className="flex gap-2">
              {(user?.role === 'Admin' || user?.role === 'Mechanic') && (
                row.status === 'ACTIVE' ? (
                  <button className="text-yellow-700" onClick={()=>toggleArchive(row)}>Archive</button>
                ) : (
                  <button className="text-green-700" onClick={()=>toggleArchive(row)}>Unarchive</button>
                )
              )}
            </div>
          )}
        ]}
        data={data}
      />
      {modalOpen && (
        <AddAircraftModal onClose={()=>setModalOpen(false)} onCreated={fetchData} />
      )}
    </div>
  )
}
