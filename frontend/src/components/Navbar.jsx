import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-indigo-600 font-semibold">MTR Tracker</Link>
            {user && (
              <div className="flex gap-4 text-sm">
                <NavLink to="/" end className={({isActive}) => isActive ? 'text-indigo-600' : 'text-gray-600' }>Dashboard</NavLink>
                <NavLink to="/aircraft" className={({isActive}) => isActive ? 'text-indigo-600' : 'text-gray-600' }>Aircraft</NavLink>
                <div className="relative group">
                  <span className="text-gray-600 cursor-default">Tracking ▾</span>
                  <div className="absolute hidden group-hover:block bg-white border rounded shadow mt-2 p-2">
                    <NavLink to="/mtrs" className="block px-2 py-1 hover:bg-gray-50">MTRs</NavLink>
                    <NavLink to="/reports" className="block px-2 py-1 hover:bg-gray-50">Reports</NavLink>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div>
            {user ? (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">{user.name} ({user.role})</span>
                <button className="text-red-600" onClick={logout}>Logout</button>
              </div>
            ) : (
              <Link to="/login" className="text-indigo-600">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
