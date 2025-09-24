import { useEffect, useState } from 'react'
import { api } from '../api/client'
import Card from '../components/Card'
import Table from '../components/Table'
import { Link } from 'react-router-dom'

export default function Mtrs() {
  const [data, setData] = useState([])

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const { data } = await api.get('/mtrs/')
    setData(data)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">MTRs</h1>
        <Link to="/mtrs/new/step1" className="bg-indigo-600 text-white rounded px-3 py-1">Add MTR</Link>
      </div>
      <Table
        columns={[
          { key: 'id', title: 'ID' },
          { key: 'aircraft_id', title: 'Aircraft' },
          { key: 'work_completed_date', title: 'Date' },
          { key: 'work_completed_city', title: 'City' },
        ]}
        data={data}
      />
    </div>
  )
}
