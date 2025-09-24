import { useState } from 'react'

export default function Step4Facility({ state, setState, next, back }) {
  const [local, setLocal] = useState(state.step4 || {
    facility: '', facility_certificate: '', work_order_number: '', performed_by: '', certificate_number: '', date: '',
  })

  function onNext() {
    const required = ['facility','facility_certificate','work_order_number','performed_by','certificate_number','date']
    if (required.some(k=>!local[k])) return alert('All fields required')
    setState({ ...state, step4: local })
    next()
  }

  return (
    <div className="space-y-2">
      {Object.keys(local).map((k)=> (
        <div key={k}>
          <label className="block text-sm">{k.replaceAll('_',' ')}</label>
          <input className="border rounded px-2 py-1 w-full" value={local[k]} onChange={e=>setLocal({...local, [k]: e.target.value})} />
        </div>
      ))}
      <div className="flex justify-between">
        <button className="px-3 py-1" onClick={back}>Back</button>
        <button className="bg-indigo-600 text-white rounded px-3 py-1" onClick={onNext}>Next</button>
      </div>
    </div>
  )
}
