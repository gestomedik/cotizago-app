export default function ReportesLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D4D4] mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando reportes...</p>
      </div>
    </div>
  )
}
