"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Download, Eye, FileDiff, Calendar, FileText, FileSpreadsheet, Plus, Tag, MessageCircle, CheckCircle, XCircle, ArrowRightCircle, FileIcon, Users, ClipboardList, Settings, Bell, Search, Menu } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts'
import * as XLSX from 'xlsx'
import ReactCalendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Types
interface Proposal {
  id: string
  proposer: string
  cost: number
  compliancePenalties: number
  deliveryDelays: number
  deliveryStatus: string
  issues: number
  fileUrl: string
  version: number
  prevVersion?: {
    cost: number
    compliancePenalties: number
    deliveryDelays: number
    issues: number
    submissionDate: string
  }
  submissionDate: string
  type: string
  status: string
  stage: number
  deadline: string
  tags: string[]
  comments: string[]
  score?: number
}

interface SectionAnalysis {
  section: string
  score: number
  issues: string[]
}

// --- Dashboard summary data ---
const summary = [
  { label: "Total Proposals", value: 15, icon: FileIcon, color: "bg-blue-500" },
  { label: "Pending Review", value: 5, icon: ClipboardList, color: "bg-yellow-500" },
  { label: "Active Vendors", value: 12, icon: Users, color: "bg-green-500" },
  { label: "Compliance Issues", value: 8, icon: XCircle, color: "bg-red-500" },
]

// --- Expanded static proposal data ---
const proposals: Proposal[] = [
  { id: "RFP-001", proposer: "Acme Corp", cost: 800000, compliancePenalties: 2, deliveryDelays: 1, deliveryStatus: "On Track", issues: 2, fileUrl: "/placeholder.pdf", version: 2, prevVersion: { cost: 850000, compliancePenalties: 3, deliveryDelays: 2, issues: 3, submissionDate: "2025-05-01" }, submissionDate: "2025-05-10", type: "Technical", status: "Pending Review", stage: 1, deadline: "2025-05-25", tags: ["Needs Legal Review"], comments: ["Check compliance section."], },
  { id: "RFP-002", proposer: "Beta Solutions", cost: 950000, compliancePenalties: 0, deliveryDelays: 0, deliveryStatus: "On Track", issues: 0, fileUrl: "/placeholder.pdf", version: 1, submissionDate: "2025-05-12", type: "Financial", status: "Reviewed", stage: 2, deadline: "2025-05-28", tags: [], comments: [], },
  { id: "RFP-003", proposer: "Gamma Pvt Ltd", cost: 700000, compliancePenalties: 3, deliveryDelays: 2, deliveryStatus: "Critical", issues: 3, fileUrl: "/placeholder.pdf", version: 3, prevVersion: { cost: 720000, compliancePenalties: 2, deliveryDelays: 1, issues: 2, submissionDate: "2025-05-05" }, submissionDate: "2025-05-15", type: "Technical", status: "Approved", stage: 3, deadline: "2025-06-01", tags: ["Flagged for Delay"], comments: ["High risk of delay."] },
  { id: "RFP-004", proposer: "Delta Inc", cost: 850000, compliancePenalties: 1, deliveryDelays: 0, deliveryStatus: "On Track", issues: 1, fileUrl: "/placeholder.pdf", version: 1, submissionDate: "2025-05-18", type: "Technical", status: "Awarded", stage: 4, deadline: "2025-06-05", tags: [], comments: [] },
  { id: "RFP-005", proposer: "Epsilon Ltd", cost: 900000, compliancePenalties: 2, deliveryDelays: 1, deliveryStatus: "Delayed", issues: 2, fileUrl: "/placeholder.pdf", version: 1, submissionDate: "2025-05-20", type: "Financial", status: "Pending Review", stage: 1, deadline: "2025-06-10", tags: ["Needs Legal Review"], comments: [] },
  { id: "RFP-006", proposer: "Zeta Group", cost: 780000, compliancePenalties: 0, deliveryDelays: 0, deliveryStatus: "On Track", issues: 0, fileUrl: "/placeholder.pdf", version: 1, submissionDate: "2025-05-22", type: "Technical", status: "Reviewed", stage: 2, deadline: "2025-06-12", tags: [], comments: [] },
  { id: "RFP-007", proposer: "Eta Solutions", cost: 820000, compliancePenalties: 1, deliveryDelays: 1, deliveryStatus: "Delayed", issues: 1, fileUrl: "/placeholder.pdf", version: 2, prevVersion: { cost: 830000, compliancePenalties: 2, deliveryDelays: 2, issues: 2, submissionDate: "2025-05-10" }, submissionDate: "2025-05-25", type: "Technical", status: "Pending Review", stage: 1, deadline: "2025-06-15", tags: [], comments: ["Check delivery timeline."] },
  { id: "RFP-008", proposer: "Theta Pvt Ltd", cost: 860000, compliancePenalties: 2, deliveryDelays: 0, deliveryStatus: "On Track", issues: 2, fileUrl: "/placeholder.pdf", version: 1, submissionDate: "2025-05-27", type: "Financial", status: "Reviewed", stage: 2, deadline: "2025-06-18", tags: [], comments: [] },
  { id: "RFP-009", proposer: "Iota Corp", cost: 910000, compliancePenalties: 3, deliveryDelays: 2, deliveryStatus: "Critical", issues: 3, fileUrl: "/placeholder.pdf", version: 1, submissionDate: "2025-05-29", type: "Technical", status: "Approved", stage: 3, deadline: "2025-06-22", tags: ["Flagged for Delay"], comments: [] },
  { id: "RFP-010", proposer: "Kappa Ltd", cost: 870000, compliancePenalties: 1, deliveryDelays: 0, deliveryStatus: "On Track", issues: 1, fileUrl: "/placeholder.pdf", version: 1, submissionDate: "2025-06-01", type: "Technical", status: "Awarded", stage: 4, deadline: "2025-06-25", tags: [], comments: [] },
  { id: "RFP-011", proposer: "Lambda Inc", cost: 920000, compliancePenalties: 2, deliveryDelays: 1, deliveryStatus: "Delayed", issues: 2, fileUrl: "/placeholder.pdf", version: 1, submissionDate: "2025-06-03", type: "Financial", status: "Pending Review", stage: 1, deadline: "2025-06-28", tags: ["Needs Legal Review"], comments: [] },
  { id: "RFP-012", proposer: "Mu Group", cost: 790000, compliancePenalties: 0, deliveryDelays: 0, deliveryStatus: "On Track", issues: 0, fileUrl: "/placeholder.pdf", version: 1, submissionDate: "2025-06-05", type: "Technical", status: "Reviewed", stage: 2, deadline: "2025-07-01", tags: [], comments: [] },
  { id: "RFP-013", proposer: "Nu Solutions", cost: 830000, compliancePenalties: 1, deliveryDelays: 1, deliveryStatus: "Delayed", issues: 1, fileUrl: "/placeholder.pdf", version: 2, prevVersion: { cost: 840000, compliancePenalties: 2, deliveryDelays: 2, issues: 2, submissionDate: "2025-05-20" }, submissionDate: "2025-06-08", type: "Technical", status: "Pending Review", stage: 1, deadline: "2025-07-03", tags: [], comments: ["Check delivery timeline."] },
  { id: "RFP-014", proposer: "Xi Pvt Ltd", cost: 870000, compliancePenalties: 2, deliveryDelays: 0, deliveryStatus: "On Track", issues: 2, fileUrl: "/placeholder.pdf", version: 1, submissionDate: "2025-06-10", type: "Financial", status: "Reviewed", stage: 2, deadline: "2025-07-05", tags: [], comments: [] },
  { id: "RFP-015", proposer: "Omicron Corp", cost: 920000, compliancePenalties: 3, deliveryDelays: 2, deliveryStatus: "Critical", issues: 3, fileUrl: "/placeholder.pdf", version: 1, submissionDate: "2025-06-12", type: "Technical", status: "Approved", stage: 3, deadline: "2025-07-08", tags: ["Flagged for Delay"], comments: [] },
]

const statusColors = {
  "Pending Review": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "Reviewed": "bg-blue-100 text-blue-800 border-blue-300",
  "Approved": "bg-green-100 text-green-800 border-green-300",
  "Awarded": "bg-purple-100 text-purple-800 border-purple-300",
}

const deliveryStatusColors = {
  "On Track": "bg-green-100 text-green-800",
  "Delayed": "bg-yellow-100 text-yellow-800", 
  "Critical": "bg-red-100 text-red-800",
}

const stages = ["Pending Review", "Reviewed", "Approved", "Awarded"]

// Section analysis data per proposal
const sectionAnalysisMap: Record<string, SectionAnalysis[]> = {
  'RFP-001': [
    { section: 'Technical Requirements', score: 85, issues: ['Missing MSME compliance certificate', 'Incomplete Make in India documentation'] },
    { section: 'Financial Compliance', score: 92, issues: [] },
    { section: 'Legal & Regulatory', score: 65, issues: ['Legal review pending'] },
    { section: 'Timeline & Deliverables', score: 88, issues: ['Timeline for phase 2 unclear'] },
    { section: 'Quality Standards', score: 70, issues: ['ISO certification validity needs verification', 'Quality assurance plan lacks detail'] },
    { section: 'Experience & Credentials', score: 95, issues: [] },
  ],
  'RFP-002': [
    { section: 'Technical Requirements', score: 90, issues: [] },
    { section: 'Financial Compliance', score: 80, issues: ['Budget breakdown missing'] },
    { section: 'Legal & Regulatory', score: 75, issues: [] },
    { section: 'Timeline & Deliverables', score: 92, issues: [] },
    { section: 'Quality Standards', score: 85, issues: [] },
    { section: 'Experience & Credentials', score: 88, issues: [] },
  ],
  'RFP-003': [
    { section: 'Technical Requirements', score: 78, issues: ['Specs unclear'] },
    { section: 'Financial Compliance', score: 95, issues: [] },
    { section: 'Legal & Regulatory', score: 80, issues: [] },
    { section: 'Timeline & Deliverables', score: 85, issues: ['Late milestone'] },
    { section: 'Quality Standards', score: 90, issues: [] },
    { section: 'Experience & Credentials', score: 99, issues: [] },
  ],
}

const defaultAnalysis: SectionAnalysis[] = [
  { section: 'Technical Requirements', score: 80, issues: [] },
  { section: 'Financial Compliance', score: 80, issues: [] },
  { section: 'Legal & Regulatory', score: 80, issues: [] },
  { section: 'Timeline & Deliverables', score: 80, issues: [] },
  { section: 'Quality Standards', score: 80, issues: [] },
  { section: 'Experience & Credentials', score: 80, issues: [] },
]

const pieColors = ['#22c55e', '#f59e42', '#ef4444']

// Score calculation logic
function calculateScore(cost: number, compliancePenalties: number, deliveryDelays: number): number {
  const base = 100
  const costPenalty = Math.round((cost - 700000) / 10000)
  const compliancePenalty = compliancePenalties * 5
  const delayPenalty = deliveryDelays * 7
  return Math.max(0, base - costPenalty - compliancePenalty - delayPenalty)
}

function exportToCSV() {
  const worksheet = XLSX.utils.json_to_sheet(proposals);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Proposals");
  XLSX.writeFile(workbook, "rfp_proposals.csv");
}

function exportToExcel() {
  const worksheet = XLSX.utils.json_to_sheet(proposals);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Proposals");
  XLSX.writeFile(workbook, "rfp_proposals.xlsx");
}

function exportToPDF() {
  alert("PDF export functionality would be implemented with a PDF library like jsPDF or react-pdf");
}

const Index = () => {
  const [calendarDate, setCalendarDate] = useState<Date | null>(null)
  const [filter, setFilter] = useState("")
  const [sortBy, setSortBy] = useState<"score" | "cost" | "issues">("score")
  const [showNewProposal, setShowNewProposal] = useState(false)
  const [proposalsState, setProposalsState] = useState(proposals)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [newProposal, setNewProposal] = useState<Proposal>({
    id: '', proposer: '', cost: 0, compliancePenalties: 0, deliveryDelays: 0, deliveryStatus: 'On Track', issues: 0, fileUrl: '/placeholder.pdf', version: 1, submissionDate: '', type: 'Technical', status: 'Pending Review', stage: 1, deadline: '', tags: [], comments: []
  })

  // Filter proposals by calendar date if selected
  const filteredProposals = useMemo(() => {
    let filtered = proposalsState.map((p) => ({
      ...p,
      score: calculateScore(p.cost, p.compliancePenalties, p.deliveryDelays),
    }))
    if (calendarDate) {
      const dateStr = calendarDate.toISOString().slice(0, 10)
      filtered = filtered.filter((p) => p.deadline === dateStr)
    }
    if (filter) {
      filtered = filtered.filter(
        (p) =>
          p.proposer.toLowerCase().includes(filter.toLowerCase()) ||
          p.id.toLowerCase().includes(filter.toLowerCase())
      )
    }
    filtered.sort((a, b) => {
      if (sortBy === "score") return (b.score || 0) - (a.score || 0)
      if (sortBy === "cost") return a.cost - b.cost
      if (sortBy === "issues") return b.issues - a.issues
      return 0
    })
    return filtered
  }, [calendarDate, filter, sortBy, proposalsState])

  // Chart data
  const costVsScoreData = proposalsState.map((p) => ({
    vendor: p.proposer,
    cost: Number((p.cost / 100000).toFixed(2)),
    score: calculateScore(p.cost, p.compliancePenalties, p.deliveryDelays),
  }))

  const pieChartData = [
    { name: 'No Issues', value: proposalsState.filter(p => p.issues === 0 && p.deliveryDelays === 0).length },
    { name: 'With Issues', value: proposalsState.filter(p => p.issues > 0).length },
    { name: 'Delayed', value: proposalsState.filter(p => p.deliveryDelays > 0).length },
  ]

  const dateToScores: Record<string, number[]> = {};
  proposalsState.forEach(p => {
    if (!dateToScores[p.submissionDate]) dateToScores[p.submissionDate] = [];
    dateToScores[p.submissionDate].push(calculateScore(p.cost, p.compliancePenalties, p.deliveryDelays));
  });
  const lineChartData = Object.entries(dateToScores)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, scores]) => ({ date, score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) }));

  function handleAddProposal() {
    setProposalsState([...proposalsState, { ...newProposal, id: `RFP-${(proposalsState.length+1).toString().padStart(3,'0')}` }])
    setShowNewProposal(false)
    setNewProposal({ id: '', proposer: '', cost: 0, compliancePenalties: 0, deliveryDelays: 0, deliveryStatus: 'On Track', issues: 0, fileUrl: '/placeholder.pdf', version: 1, submissionDate: '', type: 'Technical', status: 'Pending Review', stage: 1, deadline: '', tags: [], comments: [] })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-500 p-2 rounded-full">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <span className="ml-2 text-blue-200 text-sm font-medium">AI-Powered Government Solutions</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Proposal Management <span className="text-blue-300">Dashboard</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Comprehensive, compliant Indian Government Request for Proposal management system. 
              Powered by advanced AI technology with full regulatory compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summary.map((item, index) => (
            <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{item.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  </div>
                  <div className={`${item.color} rounded-full p-3`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">RFP Scores Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Cost vs Score Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={costVsScoreData.slice(0, 6)} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="vendor" angle={-45} textAnchor="end" interval={0} height={80} />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="cost" fill="#f59e42" name="Cost (LPA)" />
                  <Bar yAxisId="right" dataKey="score" fill="#2563eb" name="Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Proposal Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {pieChartData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Proposal Deadlines</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ReactCalendar
                value={calendarDate}
                onChange={(value) => setCalendarDate(value as Date)}
                tileContent={({ date }) => {
                  const dateStr = date.toISOString().slice(0, 10)
                  const hasDeadline = proposalsState.some((p) => p.deadline === dateStr)
                  return hasDeadline ? <span className="block w-2 h-2 bg-blue-600 rounded-full mx-auto mt-1" /> : null
                }}
                className="react-calendar"
              />
              {calendarDate && (
                <Button className="mt-4" variant="outline" onClick={() => setCalendarDate(null)}>
                  Reset Filter
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Proposals Section */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Proposal Management</CardTitle>
            <CardDescription>
              Comprehensive proposal tracking and analysis system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Table Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Filter by Proposer or ID..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full lg:w-80"
                />
              </div>
              <div className="flex gap-2">
                <Button variant={sortBy === "score" ? "default" : "outline"} onClick={() => setSortBy("score")}>
                  Sort by Score
                </Button>
                <Button variant={sortBy === "cost" ? "default" : "outline"} onClick={() => setSortBy("cost")}>
                  Sort by Cost
                </Button>
                <Button variant={sortBy === "issues" ? "default" : "outline"} onClick={() => setSortBy("issues")}>
                  Sort by Issues
                </Button>
              </div>
            </div>

            {/* Score Calculation Info */}
            <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="font-semibold text-blue-900">Score Calculation Formula</span>
              </div>
              <p className="text-blue-800 text-sm">
                Score = 100 - (Cost Penalty) - (Compliance Penalties × 5) - (Delivery Delays × 7). 
                Lower cost, fewer penalties, and fewer delays result in higher scores.
              </p>
            </div>

            {/* Proposals Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Proposal ID</TableHead>
                    <TableHead className="font-semibold">Proposer</TableHead>
                    <TableHead className="font-semibold">Cost</TableHead>
                    <TableHead className="font-semibold">Score</TableHead>
                    <TableHead className="font-semibold">Issues</TableHead>
                    <TableHead className="font-semibold">Delivery</TableHead>
                    <TableHead className="font-semibold">Version</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Stage</TableHead>
                    <TableHead className="font-semibold">Deadline</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProposals.map((p) => (
                    <TableRow key={p.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{p.id}</TableCell>
                      <TableCell>{p.proposer}</TableCell>
                      <TableCell className="font-semibold">₹{(p.cost / 100000).toFixed(2)}L</TableCell>
                      <TableCell>
                        <Badge variant={p.score && p.score >= 80 ? "default" : "secondary"} className="font-semibold">
                          {p.score}
                        </Badge>
                      </TableCell>
                      <TableCell>{p.issues}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${deliveryStatusColors[p.deliveryStatus as keyof typeof deliveryStatusColors]} font-medium`}>
                          {p.deliveryStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>v{p.version}</span>
                          {p.prevVersion && (
                            <Button size="sm" variant="ghost" title="Show Diff">
                              <FileDiff className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${statusColors[p.status as keyof typeof statusColors]} font-medium`}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {stages.map((stage, idx) => (
                            <span 
                              key={stage} 
                              className={`w-2 h-2 rounded-full ${idx < p.stage ? 'bg-green-500' : 'bg-gray-300'}`}
                              title={stage}
                            ></span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{p.deadline}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => { setSelectedProposal(p); setShowAnalysis(true); }}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" asChild>
                            <a href={p.fileUrl} download>
                              <Download className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Table Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-6 gap-4">
              <div className="flex gap-2">
                <Button variant="outline" onClick={exportToCSV}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" onClick={exportToExcel}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>
                <Button variant="outline" onClick={exportToPDF}>
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
              <Button onClick={() => setShowNewProposal(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Proposal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Proposal Dialog */}
      <Dialog open={showNewProposal} onOpenChange={setShowNewProposal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Proposal</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              placeholder="Proposer Name" 
              value={newProposal.proposer} 
              onChange={e => setNewProposal({ ...newProposal, proposer: e.target.value })} 
            />
            <Input 
              placeholder="Cost (₹)" 
              type="number" 
              value={newProposal.cost === 0 ? '' : newProposal.cost} 
              onChange={e => setNewProposal({ ...newProposal, cost: Number(e.target.value) })} 
            />
            <Input 
              placeholder="Compliance Penalties" 
              type="number" 
              value={newProposal.compliancePenalties === 0 ? '' : newProposal.compliancePenalties} 
              onChange={e => setNewProposal({ ...newProposal, compliancePenalties: Number(e.target.value) })} 
            />
            <Input 
              placeholder="Delivery Delays" 
              type="number" 
              value={newProposal.deliveryDelays === 0 ? '' : newProposal.deliveryDelays} 
              onChange={e => setNewProposal({ ...newProposal, deliveryDelays: Number(e.target.value) })} 
            />
            <Input 
              placeholder="Delivery Status" 
              value={newProposal.deliveryStatus} 
              onChange={e => setNewProposal({ ...newProposal, deliveryStatus: e.target.value })} 
            />
            <Input 
              placeholder="Issues Count" 
              type="number" 
              value={newProposal.issues === 0 ? '' : newProposal.issues} 
              onChange={e => setNewProposal({ ...newProposal, issues: Number(e.target.value) })} 
            />
            <Input 
              placeholder="Submission Date (YYYY-MM-DD)" 
              value={newProposal.submissionDate} 
              onChange={e => setNewProposal({ ...newProposal, submissionDate: e.target.value })} 
            />
            <Input 
              placeholder="Type" 
              value={newProposal.type} 
              onChange={e => setNewProposal({ ...newProposal, type: e.target.value })} 
            />
            <Input 
              placeholder="Status" 
              value={newProposal.status} 
              onChange={e => setNewProposal({ ...newProposal, status: e.target.value })} 
            />
            <Input 
              placeholder="Deadline (YYYY-MM-DD)" 
              value={newProposal.deadline} 
              onChange={e => setNewProposal({ ...newProposal, deadline: e.target.value })} 
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddProposal} className="bg-blue-600 hover:bg-blue-700">
              Add Proposal
            </Button>
            <Button variant="outline" onClick={() => setShowNewProposal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analysis Dialog */}
      <Dialog open={showAnalysis} onOpenChange={setShowAnalysis}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Section-wise Analysis: {selectedProposal?.id}</DialogTitle>
          </DialogHeader>
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">AI Analysis Summary</h4>
            <p className="text-blue-800 text-sm">
              This proposal demonstrates strong performance in technical requirements, financial compliance, and experience & credentials. 
              However, regulatory documentation and quality standards require further attention. It is recommended to request updated 
              legal documents and a more detailed quality assurance plan before proceeding to final approval.
            </p>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {(selectedProposal ? (sectionAnalysisMap[selectedProposal.id] || defaultAnalysis) : []).map((s: SectionAnalysis) => (
              <div key={s.section} className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">{s.section}</span>
                  <Badge variant={s.score >= 80 ? "default" : "secondary"} className="font-semibold">
                    {s.score}%
                  </Badge>
                </div>
                {s.issues.length > 0 && (
                  <div className="text-sm text-red-700 mt-2">
                    <div className="font-medium mb-1">Issues Found:</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {s.issues.map((issue: string, idx: number) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAnalysis(false)}>
              Close Analysis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Index