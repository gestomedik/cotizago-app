export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#00D4D4] border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Cargando plantillas...</p>
      </div>
    </div>
  )
}
