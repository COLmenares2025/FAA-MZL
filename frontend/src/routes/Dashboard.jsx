import Card from '../components/Card'

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card title="Aircraft Identity">Select an aircraft to begin.</Card>
      <Card title="Times & Cycles">No aircraft selected.</Card>
      <Card title="Recent MTRs">No recent items.</Card>
      <Card title="Recent Changes">None.</Card>
    </div>
  )
}
