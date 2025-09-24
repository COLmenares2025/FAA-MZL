export default function Card({ title, children, actions }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
      {title && <div className="mb-2 font-semibold text-gray-800">{title}</div>}
      {actions}
      <div>{children}</div>
    </div>
  )
}
