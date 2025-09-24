import { useState } from 'react'

export default function Step1Info({ state, setState, next }) {
  const [local, setLocal] = useState(state.step1 || {
    transaction_for: '',
    aircraft_id: '',
    aircraft_serial: '',
    aircraft_reg: '',
    work_completed_date: '',
    work_completed_city: '',
  })

  function onNext() {
    if (!local.transaction_for || !local.aircraft_serial || !local.work_completed_date || !local.work_completed_city) {
      alert('Please fill required fields');
      return
    }
    setState({ ...state, step1: local })
    next()
  }

  return (
    <div className="space-y-2">
      <div>
        <label className="block text-sm">Transaction Is Solely For*</label>
        <input className="border rounded px-2 py-1 w-full" value={local.transaction_for} onChange={e=>setLocal({...local, transaction_for: e.target.value})} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <label className="block text-sm">Aircraft ID*</label>
          <input className="border rounded px-2 py-1 w-full" value={local.aircraft_id} onChange={e=>setLocal({...local, aircraft_id: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm">Aircraft Serial No.*</label>
          <input className="border rounded px-2 py-1 w-full" value={local.aircraft_serial} onChange={e=>setLocal({...local, aircraft_serial: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm">Aircraft Reg No</label>
          <input className="border rounded px-2 py-1 w-full" value={local.aircraft_reg} onChange={e=>setLocal({...local, aircraft_reg: e.target.value})} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label className="block text-sm">Work Completed Date* (mm/dd/yyyy)</label>
          <input className="border rounded px-2 py-1 w-full" value={local.work_completed_date} onChange={e=>setLocal({...local, work_completed_date: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm">Work Completed City* (IATA/ICAO)</label>
          <input className="border rounded px-2 py-1 w-full" value={local.work_completed_city} onChange={e=>setLocal({...local, work_completed_city: e.target.value})} />
        </div>
      </div>
      <div className="flex justify-end">
        <button className="bg-indigo-600 text-white rounded px-3 py-1" onClick={onNext}>Next</button>
      </div>
    </div>
  )
}
