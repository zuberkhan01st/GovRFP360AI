"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, UserPlus, Ban, Info } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

const initialUsers = [
  { id: 1, name: "Admin User", email: "admin@govrfp.com", role: "Admin", status: "Active" },
  { id: 2, name: "Ayush Kumar", email: "ayush@example.com", role: "User", status: "Active" },
  { id: 3, name: "Priya Singh", email: "priya@vendor.com", role: "Vendor", status: "Disabled" },
  { id: 4, name: "Rohit Sharma", email: "rohit@vendor.com", role: "Vendor", status: "Active" },
  { id: 5, name: "Nisha Patel", email: "nisha@vendor.com", role: "Vendor", status: "Active" },
  { id: 6, name: "Suresh Mehta", email: "suresh@vendor.com", role: "Vendor", status: "Active" },
  { id: 7, name: "Anjali Rao", email: "anjali@vendor.com", role: "User", status: "Active" },
  { id: 8, name: "Vikas Gupta", email: "vikas@vendor.com", role: "Vendor", status: "Disabled" },
  { id: 9, name: "Meena Joshi", email: "meena@vendor.com", role: "Vendor", status: "Active" },
  { id: 10, name: "Ramesh Lal", email: "ramesh@vendor.com", role: "User", status: "Active" },
  { id: 11, name: "Sunita Verma", email: "sunita@vendor.com", role: "Vendor", status: "Active" },
  { id: 12, name: "Deepak Shah", email: "deepak@vendor.com", role: "Vendor", status: "Active" },
  { id: 13, name: "Kiran Bala", email: "kiran@vendor.com", role: "User", status: "Active" },
  { id: 14, name: "Amit Kumar", email: "amit@vendor.com", role: "Vendor", status: "Active" },
  { id: 15, name: "Pooja Singh", email: "pooja@vendor.com", role: "Vendor", status: "Active" },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState(initialUsers)
  const [showAdd, setShowAdd] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "User" })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)

  function handleAddUser() {
    setUsers([...users, { id: users.length + 1, ...newUser, status: "Active" }])
    setShowAdd(false)
    setNewUser({ name: "", email: "", role: "User" })
  }
  function handleDisable(id: number) {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Disabled" : "Active" } : u))
  }
  function handleDelete(id: number) {
    setUsers(users.filter(u => u.id !== id))
  }

  function handleSearch(query: string) {
    setSearchQuery(query)
  }

  function handleEditUser(user: any) {
    setNewUser({ name: user.name, email: user.email, role: user.role })
    setShowAdd(true)
    setSelectedUser(user)
  }

  function handleUserDetails(user: any) {
    setSelectedUser(user)
    setShowUserDetails(true)
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search users..."
          className="w-full max-w-md"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button className="ml-2" onClick={() => setShowAdd(true)}><UserPlus className="w-4 h-4 mr-1" /> Add User</Button>
      </div>
      {showAdd && (
        <div className="bg-white p-6 rounded shadow mb-6 max-w-md">
          <h2 className="text-xl font-semibold mb-2">Add New User</h2>
          <Input placeholder="Name" className="mb-2" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
          <Input placeholder="Email" className="mb-2" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
          <select className="mb-2 w-full border rounded p-2" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Vendor">Vendor</option>
          </select>
          <div className="flex gap-2">
            <Button onClick={handleAddUser}>Add</Button>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </div>
      )}
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(u => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold mr-2">{u.name.charAt(0)}</div>
                  {u.name}
                </TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${u.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"}`}>
                    {u.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${u.role === "Admin" ? "bg-purple-100 text-purple-800" : u.role === "Vendor" ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"}`}>
                    {u.role}
                  </span>
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button size="icon" variant="ghost" title="Edit" onClick={() => handleEditUser(u)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" title="Disable/Enable" onClick={() => handleDisable(u.id)}><Ban className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" title="Delete" onClick={() => handleDelete(u.id)}><Trash2 className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" title="View Details" onClick={() => handleUserDetails(u)}><Info className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4">
              <div>
                <p><span className="font-semibold">Name:</span> {selectedUser.name}</p>
                <p><span className="font-semibold">Email:</span> {selectedUser.email}</p>
                <p><span className="font-semibold">Role:</span> {selectedUser.role}</p>
                <p><span className="font-semibold">Status:</span> {selectedUser.status}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleEditUser(selectedUser)}>Edit</Button>
                <Button variant="outline" onClick={() => handleDisable(selectedUser.id)}>{selectedUser.status === "Active" ? "Disable" : "Enable"}</Button>
                <Button variant="outline" onClick={() => handleDelete(selectedUser.id)}>Delete</Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserDetails(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 