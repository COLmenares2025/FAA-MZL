import { useEffect, useState } from 'react'
import Card from '../components/Card'
import Table from '../components/Table'
import { useAircraftStore } from '../store/aircraft'

export default function Dashboard() {
  const { active, times, recentMtrs, initFromStorage, refreshActiveData, fetchList, setActive } = useAircraftStore()
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [q, setQ] = useState('')
  const [options, setOptions] = useState([])

  useEffect(() => { initFromStorage() }, [])
  useEffect(() => { if (active) refreshActiveData() }, [active])

  async function openSelector() {
    const list = await fetchList(q)
    setOptions(list)
    setSelectorOpen(true)
  }

  async function search() {
    const list = await fetchList(q)
    setOptions(list)
  }

  function SelectorModal() {
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-20" onClick={() => setSelectorOpen(false)}>
        <div className="bg-white rounded-lg shadow p-4 w-full max-w-3xl" onClick={e=>e.stopPropagation()}>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Select Aircraft</h2>
            <button onClick={()=>setSelectorOpen(false)}>✕</button>
          </div>
          <div className="flex gap-2 mb-3">
            <input className="border rounded px-2 py-1 flex-1" placeholder="Search model/serial/tail" value={q} onChange={e=>setQ(e.target.value)} />
            <button className="bg-indigo-600 text-white rounded px-3 py-1" onClick={search}>Search</button>
          </div>
          <div className="max-h-80 overflow-auto border rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Model</th>
                  <th className="px-3 py-2 text-left">Serial</th>
                  <th className="px-3 py-2 text-left">Tail</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {options.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="px-3 py-2">{o.model}</td>
                    <td className="px-3 py-2">{o.serial}</td>
                    <td className="px-3 py-2">{o.tail_number}</td>
                    <td className="px-3 py-2 text-right">
                      <button className="text-indigo-600" onClick={() => { setActive(o); setSelectorOpen(false) }}>Select</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card title="Aircraft Identity" actions={<div className="mb-2"><button className="bg-indigo-600 text-white rounded px-3 py-1" onClick={openSelector}>{active ? 'Change Aircraft' : 'Select Aircraft'}</button></div>}>
        {active ? (
          <div className="text-sm text-gray-700">
            <div><span className="font-medium">Model:</span> {active.model}</div>
            <div><span className="font-medium">Serial:</span> {active.serial}</div>
            <div><span className="font-medium">Tail:</span> {active.tail_number}</div>
            <div><span className="font-medium">Status:</span> {active.status}</div>
          </div>
        ) : (
          'Select an aircraft to begin.'
        )}
      </Card>
      <Card title="Times & Cycles">
        {active ? (
          times ? (
            <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
              <div>Aircraft Hours: <span className="font-medium">{times.aircraft_hours}</span></div>
              <div>Landings: <span className="font-medium">{times.landings}</span></div>
              <div>APU Hours: {times.apu_hours}</div>
              <div>APU Cycles: {times.apu_cycles}</div>
              <div>Eng1 Hours: {times.eng1_hours}</div>
              <div>Eng1 Cycles: {times.eng1_cycles}</div>
              <div>Eng2 Hours: {times.eng2_hours}</div>
              <div>Eng2 Cycles: {times.eng2_cycles}</div>
              {times.as_of_date && <div className="col-span-2">As of: {times.as_of_date}</div>}
            </div>
          ) : (
            'No Times & Cycles found for this aircraft.'
          )
        ) : (
          'No aircraft selected.'
        )}
      </Card>
      <Card title="Recent MTRs">
        {active ? (
          recentMtrs && recentMtrs.length > 0 ? (
            <Table columns={[
              { key: 'id', title: 'ID' },
              { key: 'work_completed_date', title: 'Date' },
              { key: 'work_completed_city', title: 'City' },
            ]} data={recentMtrs.slice(0,5)} />
          ) : (
            'No recent items.'
          )
        ) : (
          'No aircraft selected.'
        )}
      </Card>
      <Card title="Recent Changes">None.</Card>
      {selectorOpen && <SelectorModal />}
    </div>
  )
}
