import { useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './routes/Dashboard'
import Aircraft from './routes/Aircraft'
import Mtrs from './routes/Mtrs'
import Reports from './routes/Reports'
import { useAuth } from './store/auth'
import Step1Info from './routes/MtrCreateWizard/Step1Info'
import Step2TimesCycles from './routes/MtrCreateWizard/Step2TimesCycles'
import Step3Items from './routes/MtrCreateWizard/Step3Items'
import Step4Facility from './routes/MtrCreateWizard/Step4Facility'
import Step5Inspection from './routes/MtrCreateWizard/Step5Inspection'
import Step6Confirm from './routes/MtrCreateWizard/Step6Confirm'

function Protected({ children, roles }) {
  const { user, fetchMe } = useAuth()
  const [ready, setReady] = useState(false)
  useEffect(() => { (async () => { await fetchMe(); setReady(true) })() }, [])
  if (!ready) return null
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <div className="p-4">Access denied</div>
  return children
}

function Wizard() {
  const [state, setState] = useState({})
  const steps = [
    (next, back) => <Step1Info state={state} setState={setState} next={next} />,
    (next, back) => <Step2TimesCycles state={state} setState={setState} next={next} back={back} />,
    (next, back) => <Step3Items state={state} setState={setState} next={next} back={back} />,
    (next, back) => <Step4Facility state={state} setState={setState} next={next} back={back} />,
    (next, back) => <Step5Inspection state={state} setState={setState} next={next} back={back} />,
    (next, back, submit) => <Step6Confirm state={state} back={back} submit={submit} />,
  ]
  const [idx, setIdx] = useState(0)
  const next = () => setIdx(Math.min(idx+1, steps.length-1))
  const back = () => setIdx(Math.max(idx-1, 0))
  const submit = () => window.location.href = '/mtrs'
  const Current = steps[idx]
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">Step {idx+1} of {steps.length}</div>
      {Current(next, back, submit)}
    </div>
  )
}

function Layout() {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4">
        <Outlet />
      </div>
    </>
  )
}

function Login() {
  const { login, error, loading } = useAuth()
  async function onSubmit(e) {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value
    const ok = await login(email, password)
    if (ok) window.location.href = '/'
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm">Email</label>
          <input name="email" type="email" className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input name="password" type="password" className="border rounded px-2 py-1 w-full" />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button disabled={loading} className="bg-indigo-600 text-white rounded px-3 py-1">{loading ? '...' : 'Login'}</button>
      </form>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Protected><Dashboard /></Protected> },
      { path: 'aircraft', element: <Protected><Aircraft /></Protected> },
      { path: 'mtrs', element: <Protected><Mtrs /></Protected> },
      { path: 'mtrs/new/step1', element: <Protected roles={['Admin','Mechanic']}><Wizard /></Protected> },
      { path: 'reports', element: <Protected><Reports /></Protected> },
    ],
  },
  { path: '/login', element: <Login /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
