import { useState } from 'react'

export default function Step3Items({ state, setState, next, back }) {
  const [items, setItems] = useState(state.step3 || [])
  const [entry, setEntry] = useState({ item_code: '', description: '', quantity: 1 })

  function add() {
    if (!entry.description) return alert('Description required')
    setItems([...items, entry])
    setEntry({ item_code: '', description: '', quantity: 1 })
  }

  function remove(idx) {
    setItems(items.filter((_, i) => i !== idx))
  }

  function onNext() {
    setState({ ...state, step3: items })
    next()
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <input placeholder="Item code" className="border rounded px-2 py-1" value={entry.item_code} onChange={e=>setEntry({...entry, item_code: e.target.value})} />
        <input placeholder="Description*" className="border rounded px-2 py-1" value={entry.description} onChange={e=>setEntry({...entry, description: e.target.value})} />
        <input placeholder="Qty" type="number" className="border rounded px-2 py-1" value={entry.quantity} onChange={e=>setEntry({...entry, quantity: Number(e.target.value)})} />
      </div>
      <button className="bg-gray-800 text-white rounded px-3 py-1" onClick={add}>Add</button>
      <ul className="list-disc pl-5">
        {items.map((it, idx) => (
          <li key={idx}>{it.item_code} - {it.description} x{it.quantity} <button className="text-red-600" onClick={()=>remove(idx)}>remove</button></li>
        ))}
      </ul>
      <div className="flex justify-between">
        <button className="px-3 py-1" onClick={back}>Back</button>
        <button className="bg-indigo-600 text-white rounded px-3 py-1" onClick={onNext}>Next</button>
      </div>
    </div>
  )
}
