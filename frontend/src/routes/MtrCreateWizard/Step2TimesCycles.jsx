import { useState, useEffect } from 'react'

export default function Step2TimesCycles({ state, setState, next, back }) {
  const [local, setLocal] = useState(state.step2 || {
    aircraft_hours: '', landings: '', apu_hours: '', apu_cycles: '',
    eng1_hours: '', eng1_cycles: '', eng2_hours: '', eng2_cycles: '', as_of_date: '',
  })

  function onNext() {
    if (!local.aircraft_hours || !local.landings) {
      alert('Aircraft hours and landings required')
      return
    }
    setState({ ...state, step2: local })
    next()
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {Object.keys(local).map((k) => (
          <div key={k}>
            <label className="block text-sm">{k.replaceAll('_',' ')}</label>
            <input className="border rounded px-2 py-1 w-full" value={local[k]} onChange={e=>setLocal({...local, [k]: e.target.value})} />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <button className="px-3 py-1" onClick={back}>Back</button>
        <button className="bg-indigo-600 text-white rounded px-3 py-1" onClick={onNext}>Next</button>
      </div>
    </div>
  )
}
