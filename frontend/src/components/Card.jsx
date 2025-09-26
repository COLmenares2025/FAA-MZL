export default function Card({ title, children, actions }) {
  return (
    <div className="bg-gray-100 rounded-lg shadow-xl p-4 border border-blue-400">
      {title && <div className="mb-2 font-bold text-gray-800">{title}</div>}
      {actions}
      <div>{children}</div>
    </div>
  )
}
