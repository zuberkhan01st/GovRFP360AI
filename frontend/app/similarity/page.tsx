"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"

export default function SimilarityPage() {
  const [rfpFile, setRfpFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [similarityScore, setSimilarityScore] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (file: File) => {
    setRfpFile(file)
    setSimilarityScore(null)
    setError(null)
  }

  const analyzeSimilarity = async () => {
    if (!rfpFile) return

    setIsAnalyzing(true)
    setError(null)
    setSimilarityScore(null)

    const formData = new FormData()
    formData.append("rfp", rfpFile)

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || "Analysis failed")
      }

      setSimilarityScore(data.similarity_score)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>RFP Similarity Checker</span>
            </CardTitle>
            <CardDescription>
              Upload your RFP to check similarity with the default template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>RFP Document *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                  id="rfp-upload"
                />
                <label htmlFor="rfp-upload" className="cursor-pointer">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">Click to upload RFP document</p>
                  <p className="text-sm text-gray-500">PDF only (Max 10MB)</p>
                </label>
              </div>
              {rfpFile && (
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>{rfpFile.name}</span>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <Button
                onClick={analyzeSimilarity}
                disabled={!rfpFile || isAnalyzing}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Analyze Similarity
                  </>
                )}
              </Button>
            </div>

            {similarityScore !== null && (
              <div className="text-center mt-8 space-y-4">
                <div className="text-4xl font-bold text-gray-900">{similarityScore}%</div>
                <div className="text-gray-600">Similarity with Template</div>
                <Progress value={similarityScore} className="h-4" />
                <Badge variant="outline" className="mt-2">
                  {similarityScore > 85
                    ? "PROCEED"
                    : similarityScore > 60
                    ? "REVIEW"
                    : "REJECT"}
                </Badge>
              </div>
            )}

            {error && (
              <div className="flex items-center text-red-600 text-sm mt-4 justify-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
