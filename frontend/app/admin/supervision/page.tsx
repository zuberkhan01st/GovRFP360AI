"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, MessageCircle } from "lucide-react"

const proposals = [
  { id: "RFP-001", proposer: "Acme Corp", score: 72, issues: 2, status: "Pending Review" },
  { id: "RFP-002", proposer: "Beta Solutions", score: 90, issues: 0, status: "Reviewed" },
  { id: "RFP-003", proposer: "Gamma Pvt Ltd", score: 65, issues: 3, status: "Pending Review" },
  { id: "RFP-004", proposer: "Delta Inc", score: 88, issues: 1, status: "Awarded" },
]

export default function SupervisionPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Supervision</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {proposals.map((p) => (
          <Card key={p.id} className={p.score < 75 || p.issues > 1 ? "border-yellow-400" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {p.score < 75 || p.issues > 1 ? <AlertTriangle className="w-5 h-5 text-yellow-600" /> : <CheckCircle className="w-5 h-5 text-green-600" />}
                {p.id} - {p.proposer}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2"><span className="font-semibold">Score:</span> <span className={p.score < 75 ? "text-yellow-700 font-bold" : "text-green-700 font-bold"}>{p.score}</span></div>
              <div className="mb-2"><span className="font-semibold">Issues:</span> <span className={p.issues > 1 ? "text-yellow-700 font-bold" : "text-green-700 font-bold"}>{p.issues}</span></div>
              <div className="mb-2"><span className="font-semibold">Status:</span> {p.status}</div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline"><CheckCircle className="w-4 h-4 mr-1" /> Approve</Button>
                <Button size="sm" variant="outline"><AlertTriangle className="w-4 h-4 mr-1" /> Flag</Button>
                <Button size="sm" variant="outline"><MessageCircle className="w-4 h-4 mr-1" /> Comment</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 