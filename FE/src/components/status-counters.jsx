export function StatusCounters({ pending, preparing, ready, totalActive }) {
  return (
    <div className="grid grid-cols-4 gap-6 p-6">
      <div className="text-center">
        <div className="text-3xl font-bold text-orange-500">{pending}</div>
        <div className="text-sm text-gray-600">Pendientes</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-500">{preparing}</div>
        <div className="text-sm text-gray-600">Preparando</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-green-500">{ready}</div>
        <div className="text-sm text-gray-600">Listos</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-900">{totalActive}</div>
        <div className="text-sm text-gray-600">Total Activos</div>
      </div>
    </div>
  )
}
