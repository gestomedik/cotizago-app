export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#00D4D4] mx-auto mb-4" />
        <p className="text-gray-600">Cargando comisiones...</p>
      </div>
    </div>
  )
}
