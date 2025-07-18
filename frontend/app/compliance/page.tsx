"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, ArrowLeft, Upload, CheckCircle, XCircle, AlertTriangle, Loader2, Download, Eye } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface ComplianceResult {
  overallScore: number
  recommendation: "PROCEED" | "REVIEW" | "REJECT"
  sections: {
    name: string
    score: number
    status: "pass" | "warning" | "fail"
    issues: string[]
  }[]
  summary: string
}

export default function CompliancePage() {
  const [rfpFile, setRfpFile] = useState<File | null>(null)
  const [tenderFile, setTenderFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<ComplianceResult | null>(null)

  const handleFileUpload = (file: File, type: "rfp" | "tender") => {
    if (type === "rfp") {
      setRfpFile(file)
    } else {
      setTenderFile(file)
    }
  }

  const analyzeCompliance = async () => {
    if (!rfpFile || !tenderFile) return

    setIsAnalyzing(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 4000))

    const mockResult: ComplianceResult = {
      overallScore: 78,
      recommendation: "REVIEW",
      sections: [
        {
          name: "Technical Requirements",
          score: 85,
          status: "pass",
          issues: [],
        },
        {
          name: "Financial Compliance",
          score: 92,
          status: "pass",
          issues: [],
        },
        {
          name: "Legal & Regulatory",
          score: 65,
          status: "warning",
          issues: ["Missing MSME compliance certificate", "Incomplete Make in India documentation"],
        },
        {
          name: "Timeline & Deliverables",
          score: 88,
          status: "pass",
          issues: [],
        },
        {
          name: "Quality Standards",
          score: 70,
          status: "warning",
          issues: ["ISO certification validity needs verification", "Quality assurance plan lacks detail"],
        },
        {
          name: "Experience & Credentials",
          score: 95,
          status: "pass",
          issues: [],
        },
      ],
      summary:
        "This proposal demonstrates strong performance in technical requirements, financial compliance, and experience & credentials. However, regulatory documentation and quality standards require further attention. It is recommended to request updated legal documents and a more detailed quality assurance plan before proceeding to final approval.",
    }

    setResult(mockResult)
    setIsAnalyzing(false)
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "PROCEED":
        return "text-green-600 bg-green-100"
      case "REVIEW":
        return "text-yellow-600 bg-yellow-100"
      case "REJECT":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "fail":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GovRFP360AI</h1>
                <p className="text-sm text-gray-600">Compliance Checker</p>
              </div>
            </Link>
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">RFP Compliance Checker</h2>
          <p className="text-lg text-gray-600">
            Upload your RFP document and tender submission to check compliance and get AI-powered analysis
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  <span>Document Upload</span>
                </CardTitle>
                <CardDescription>
                  Upload both the original RFP document and the tender submission for compliance analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* RFP Document Upload */}
                  <div className="space-y-3">
                    <Label>Original RFP Document *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "rfp")}
                        className="hidden"
                        id="rfp-upload"
                      />
                      <label htmlFor="rfp-upload" className="cursor-pointer">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 mb-2">Click to upload RFP document</p>
                        <p className="text-sm text-gray-500">PDF, DOC, DOCX, TXT (Max 10MB)</p>
                      </label>
                    </div>
                    {rfpFile && (
                      <div className="flex items-center space-x-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>{rfpFile.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Tender Document Upload */}
                  <div className="space-y-3">
                    <Label>Tender Submission *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "tender")}
                        className="hidden"
                        id="tender-upload"
                      />
                      <label htmlFor="tender-upload" className="cursor-pointer">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 mb-2">Click to upload tender document</p>
                        <p className="text-sm text-gray-500">PDF, DOC, DOCX, TXT (Max 10MB)</p>
                      </label>
                    </div>
                    {tenderFile && (
                      <div className="flex items-center space-x-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>{tenderFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="flex justify-center">
                  <Button
                    onClick={analyzeCompliance}
                    disabled={!rfpFile || !tenderFile || isAnalyzing}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Analyzing Compliance...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Analyze Compliance
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span>Compliance Analysis Results</span>
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Report
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Overall Score */}
                    <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <div className="text-4xl font-bold text-gray-900 mb-2">{result.overallScore}%</div>
                      <div className="text-lg text-gray-600 mb-4">Overall Compliance Score</div>
                      <Badge
                        className={`px-4 py-2 text-lg font-semibold ${getRecommendationColor(result.recommendation)}`}
                      >
                        {result.recommendation}
                      </Badge>
                    </div>

                    {/* Section Breakdown */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Section-wise Analysis</h3>
                      <div className="space-y-4">
                        {result.sections.map((section, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                {getStatusIcon(section.status)}
                                <span className="font-medium">{section.name}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{section.score}%</div>
                                <Progress value={section.score} className="w-20 h-2" />
                              </div>
                            </div>
                            {section.issues.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-gray-700 mb-2">Issues Found:</p>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {section.issues.map((issue, issueIndex) => (
                                    <li key={issueIndex} className="flex items-start space-x-2">
                                      <span className="text-yellow-500 mt-0.5">•</span>
                                      <span>{issue}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">AI Analysis Summary</h3>
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-gray-700">{result.summary}</AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg">Analysis Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "Technical Requirements Check",
                    "Financial Compliance Verification",
                    "Legal & Regulatory Review",
                    "Timeline Feasibility Analysis",
                    "Quality Standards Assessment",
                    "Experience Validation",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg">Supported Formats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">PDF Documents</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Word Documents (.doc, .docx)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Text Files (.txt)</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">Maximum file size: 10MB per document</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg">How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Upload your original RFP document</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Upload the tender submission to analyze</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>AI analyzes compliance across multiple criteria</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                      4
                    </span>
                    <span>Get detailed score and recommendations</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
