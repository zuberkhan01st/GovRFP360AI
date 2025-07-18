import Link from "next/link"
import { FileText } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Admin Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GovRFP360AI Admin</h1>
                <p className="text-sm text-gray-600">Admin Dashboard</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors font-semibold">Proposals</Link>
              <Link href="/admin/proposal-management" className="text-gray-700 hover:text-blue-600 transition-colors font-semibold">Proposal Management</Link>
              <Link href="/admin/users" className="text-gray-700 hover:text-blue-600 transition-colors font-semibold">Users</Link>
              <Link href="/admin/supervision" className="text-gray-700 hover:text-blue-600 transition-colors font-semibold">Supervision</Link>
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Main Site</Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
        {children}
      </main>
    </div>
  )
} 