"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, FileDiff, Tag, MessageCircle, CheckCircle, XCircle, ArrowRightCircle, Download } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

const proposals = [
  { id: "RFP-001", proposer: "Acme Corp", status: "Pending Review", version: 2, tags: ["Needs Legal Review"], notes: ["Check compliance section."], audit: ["Created by Admin", "Edited by Reviewer"], fileUrl: "/placeholder.pdf" },
  { id: "RFP-002", proposer: "Beta Solutions", status: "Reviewed", version: 1, tags: ["Flagged for Delay"], notes: [], audit: ["Created by Admin"], fileUrl: "/placeholder.pdf" },
]

export default function ProposalManagementPage() {
  const [selected, setSelected] = useState<any>(null)
  const [showDetail, setShowDetail] = useState(false)
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Proposal Management</h1>
      <div className="overflow-x-auto rounded-lg shadow bg-white mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proposal ID</TableHead>
              <TableHead>Proposer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proposals.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.proposer}</TableCell>
                <TableCell>{p.status}</TableCell>
                <TableCell>v{p.version}</TableCell>
                <TableCell>{p.tags.map((t: string) => <span key={t} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-1 text-xs">{t}</span>)}</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => { setSelected(p); setShowDetail(true); }}><Eye className="w-5 h-5" /></Button>
                  <Button size="icon" variant="ghost"><FileDiff className="w-5 h-5" /></Button>
                  <Button size="icon" variant="ghost"><Tag className="w-5 h-5" /></Button>
                  <Button size="icon" variant="ghost"><MessageCircle className="w-5 h-5" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mb-4 flex gap-2">
        <Button variant="outline"><CheckCircle className="w-4 h-4 mr-1" /> Approve</Button>
        <Button variant="outline"><XCircle className="w-4 h-4 mr-1" /> Reject</Button>
        <Button variant="outline"><ArrowRightCircle className="w-4 h-4 mr-1" /> Move to Next Stage</Button>
        <Button variant="outline"><Download className="w-4 h-4 mr-1" /> Export Selected</Button>
      </div>
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Proposal Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-2">
              <div><strong>ID:</strong> {selected.id}</div>
              <div><strong>Proposer:</strong> {selected.proposer}</div>
              <div><strong>Status:</strong> {selected.status}</div>
              <div><strong>Version:</strong> v{selected.version}</div>
              <div><strong>Tags:</strong> {selected.tags.map((t: string) => <span key={t} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-1 text-xs">{t}</span>)}</div>
              <div><strong>Notes:</strong> {selected.notes.map((n: string, i: number) => <div key={i} className="bg-blue-50 p-2 rounded mb-1 text-xs">{n}</div>)}</div>
              <div><strong>Audit Trail:</strong> {selected.audit.map((a: string, i: number) => <div key={i} className="bg-gray-50 p-2 rounded mb-1 text-xs">{a}</div>)}</div>
              <div><strong>PDF Preview:</strong> <iframe src={selected.fileUrl} className="w-full h-40 border rounded" title="PDF Preview" /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetail(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 