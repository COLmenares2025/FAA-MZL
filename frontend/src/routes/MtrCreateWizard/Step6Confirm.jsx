import Card from '../../components/Card'
import { api } from '../../api/client'

export default function Step6Confirm({ state, back, submit }) {
  const s1 = state.step1 || {}
  const s2 = state.step2 || {}
  const items = state.step3 || []
  const s4 = state.step4 || {}
  const s5 = state.step5 || {}

  async function onSubmit() {
    // Create MTR then post items, facility, inspection
    const { data: mtr } = await api.post('/mtrs/', {
      aircraft_id: Number(s1.aircraft_id),
      transaction_for: s1.transaction_for,
      aircraft_serial: s1.aircraft_serial,
      aircraft_reg: s1.aircraft_reg,
      work_completed_date: s1.work_completed_date,
      work_completed_city: s1.work_completed_city,
    })
    for (const it of items) {
      await api.post(`/mtrs/${mtr.id}/items`, { ...it, mtr_id: mtr.id })
    }
    await api.post(`/mtrs/${mtr.id}/repair-facility`, { ...s4, mtr_id: mtr.id })
    await api.post(`/mtrs/${mtr.id}/inspection`, { ...s5, mtr_id: mtr.id })
    submit()
  }

  return (
    <div className="space-y-4">
      <Card title="Aircraft & MTR Info">
        <pre className="text-xs">{JSON.stringify(s1, null, 2)}</pre>
      </Card>
      <Card title="Times & Cycles">
        <pre className="text-xs">{JSON.stringify(s2, null, 2)}</pre>
      </Card>
      <Card title="MTR ITEMS">
        <pre className="text-xs">{JSON.stringify(items, null, 2)}</pre>
      </Card>
      <Card title="Repair Facility">
        <pre className="text-xs">{JSON.stringify(s4, null, 2)}</pre>
      </Card>
      <Card title="Inspection">
        <pre className="text-xs">{JSON.stringify(s5, null, 2)}</pre>
      </Card>
      <div className="flex justify-between">
        <button className="px-3 py-1" onClick={back}>Back</button>
        <button className="bg-green-600 text-white rounded px-3 py-1" onClick={onSubmit}>Submit MTR</button>
      </div>
    </div>
  )
}
