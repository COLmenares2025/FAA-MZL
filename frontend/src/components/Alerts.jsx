export function Alert({ type = 'info', children }) {
  const colors = {
    info: 'bg-blue-50 text-blue-700',
    success: 'bg-green-50 text-green-700',
    error: 'bg-red-50 text-red-700',
    warning: 'bg-yellow-50 text-yellow-700',
  }
  return <div className={`p-3 rounded ${colors[type]}`}>{children}</div>
}
