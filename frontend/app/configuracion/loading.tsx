export default function ConfiguracionLoading() {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-gray-900 animate-pulse" />
      <div className="flex-1 flex flex-col">
        <div className="h-16 bg-white border-b animate-pulse" />
        <div className="flex-1 p-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="flex gap-6">
            <div className="w-64 h-96 bg-white rounded-lg animate-pulse" />
            <div className="flex-1 space-y-4">
              <div className="h-64 bg-white rounded-lg animate-pulse" />
              <div className="h-64 bg-white rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
