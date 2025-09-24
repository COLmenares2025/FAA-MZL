import { useEffect, useState } from 'react'
import { api } from '../api/client'
import Card from '../components/Card'
import Table from '../components/Table'

export default function Aircraft() {
  const [data, setData] = useState([])
  const [q, setQ] = useState('')
  const [includeArchived, setIncludeArchived] = useState(false)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const params = { q, include_archived: includeArchived }
    const { data } = await api.get('/aircraft/', { params })
    setData(data)
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
        </div>
      </Card>
      <Table
        columns={[
          { key: 'model', title: 'Model' },
          { key: 'serial', title: 'Serial' },
          { key: 'tail_number', title: 'Tail' },
          { key: 'status', title: 'Status' },
        ]}
        data={data}
      />
    </div>
  )
}
