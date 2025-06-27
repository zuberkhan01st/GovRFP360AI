"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  FileText, 
  ArrowLeft, 
  Loader2, 
  Download, 
  Copy, 
  CheckCircle,
  AlertTriangle,
  Wand2,
  Clock,
  FileCheck,
  Building,
  MapPin,
  IndianRupee,
  Plus,
  X,
  BookOpen,
  Target,
  Settings
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { RFPGenerationAPI, RFPGenerationRequest, RFPGenerationResponse, industryOptions, projectTypeOptions, disciplineOptions } from "@/lib/api"

interface LoadingStep {
  id: string
  title: string
  description: string
  completed: boolean
}

const GENERATION_STEPS: LoadingStep[] = [
  {
    id: 'analyzing',
    title: 'Analyzing Project Requirements',
    description: 'Processing your project details and requirements...',
    completed: false
  },
  {
    id: 'compliance',
    title: 'Applying Government Compliance',
    description: 'Integrating GFR 2017, CVC guidelines, and Make in India policies...',
    completed: false
  },
  {
    id: 'technical',
    title: 'Building Technical Specifications',
    description: 'Creating detailed technical requirements and IS codes compliance...',
    completed: false
  },
  {
    id: 'structure',
    title: 'Structuring RFP Document',
    description: 'Organizing sections with proper government formatting...',
    completed: false
  },
  {
    id: 'content',
    title: 'Generating Comprehensive Content',
    description: 'Creating 4000+ words of detailed, government-grade content...',
    completed: false
  },
  {
    id: 'validation',
    title: 'Final Validation & Quality Check',
    description: 'Ensuring compliance and professional formatting...',
    completed: false
  }
]

export default function GeneratePage() {
  // Form state
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<RFPGenerationRequest>({
    projectName: '',
    projectDescription: '',
    industry: '',
    projectType: '',
    budget: '',
    timeline: '',
    location: '',
    disciplines: [],
    requirements: [],
    technicalSpecifications: [],
    compliance: [],
    expectedOutcomes: []
  })

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationSteps, setGenerationSteps] = useState<LoadingStep[]>(GENERATION_STEPS)
  const [currentGenerationStep, setCurrentGenerationStep] = useState(0)
  const [result, setResult] = useState<RFPGenerationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Dynamic options based on industry
  const [availableDisciplines, setAvailableDisciplines] = useState<string[]>([])

  // Update disciplines when industry changes
  useEffect(() => {
    if (formData.industry && disciplineOptions[formData.industry as keyof typeof disciplineOptions]) {
      setAvailableDisciplines(disciplineOptions[formData.industry as keyof typeof disciplineOptions])
    } else {
      setAvailableDisciplines([])
    }
    setFormData(prev => ({ ...prev, disciplines: [] }))
  }, [formData.industry])

  // Array field handlers
  const addToArray = (field: keyof RFPGenerationRequest, value: string) => {
    if (!value.trim()) return
    const currentArray = formData[field] as string[] || []
    if (!currentArray.includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...currentArray, value.trim()]
      }))
    }
  }

  const removeFromArray = (field: keyof RFPGenerationRequest, index: number) => {
    const currentArray = formData[field] as string[] || []
    setFormData(prev => ({
      ...prev,
      [field]: currentArray.filter((_, i) => i !== index)
    }))
  }

  // Generation simulation
  const simulateGenerationSteps = () => {
    return new Promise<void>((resolve) => {
      let stepIndex = 0
      const interval = setInterval(() => {
        setGenerationSteps(prev => 
          prev.map((step, i) => 
            i === stepIndex ? { ...step, completed: true } : step
          )
        )
        setCurrentGenerationStep(stepIndex + 1)
        stepIndex++
        
        if (stepIndex >= GENERATION_STEPS.length) {
          clearInterval(interval)
          resolve()
        }
      }, 2000) // 2 seconds per step = 12 seconds total
    })
  }

  // Generate RFP
  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    setResult(null)
    setGenerationSteps(GENERATION_STEPS.map(step => ({ ...step, completed: false })))
    setCurrentGenerationStep(0)

    try {
      // Start the simulation
      const simulationPromise = simulateGenerationSteps()
      
      // Make the actual API call
      const apiPromise = RFPGenerationAPI.generateRFP(formData)
      
      // Wait for both to complete
      const [, apiResult] = await Promise.all([simulationPromise, apiPromise])
      
      setResult(apiResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate RFP')
    } finally {
      setIsGenerating(false)
    }
  }

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // Download as text file
  const downloadRFP = () => {
    if (!result) return
    const blob = new Blob([result.rfpText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${formData.projectName.replace(/\s+/g, '_')}_RFP.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.projectName && formData.industry && formData.projectType
      case 2:
        return formData.projectDescription && formData.projectDescription.length <= 500
      case 3:
        return formData.disciplines.length > 0 && formData.requirements.length > 0
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GovRFP360AI</h1>
                <p className="text-sm text-gray-600">AI-Powered RFP Generator</p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Generate Government RFP</h2>
          <p className="text-lg text-gray-600">
            Create comprehensive, compliant Indian Government RFP documents with AI assistance
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {!result && !isGenerating && (
              <div className="space-y-6">
                {/* Progress Indicator */}
                <Card className="shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                            currentStep === step 
                              ? 'bg-blue-600 text-white' 
                              : currentStep > step 
                                ? 'bg-green-600 text-white' 
                                : 'bg-gray-200 text-gray-600'
                          }`}>
                            {currentStep > step ? <CheckCircle className="h-4 w-4" /> : step}
                          </div>
                          {step < 3 && (
                            <div className={`w-16 h-1 mx-2 ${
                              currentStep > step ? 'bg-green-600' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className={currentStep >= 1 ? 'text-blue-600 font-semibold' : 'text-gray-500'}>
                        Project Basics
                      </span>
                      <span className={currentStep >= 2 ? 'text-blue-600 font-semibold' : 'text-gray-500'}>
                        Details & Scope
                      </span>
                      <span className={currentStep >= 3 ? 'text-blue-600 font-semibold' : 'text-gray-500'}>
                        Requirements
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Step 1: Project Basics */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Building className="h-5 w-5 text-blue-600" />
                          <span>Project Basics</span>
                        </CardTitle>
                        <CardDescription>
                          Provide the fundamental information about your project
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="projectName">Project Name *</Label>
                            <Input
                              id="projectName"
                              placeholder="e.g., Regional Environmental Monitoring Network"
                              value={formData.projectName}
                              onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="industry">Industry *</Label>
                            <Select
                              value={formData.industry}
                              onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                              <SelectContent>
                                {industryOptions.map((industry) => (
                                  <SelectItem key={industry} value={industry}>
                                    {industry}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="projectType">Project Type *</Label>
                            <Select
                              value={formData.projectType}
                              onValueChange={(value) => setFormData(prev => ({ ...prev, projectType: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select project type" />
                              </SelectTrigger>
                              <SelectContent>
                                {projectTypeOptions.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              placeholder="e.g., Metropolitan Environmental District"
                              value={formData.location}
                              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="budget">Budget</Label>
                            <div className="relative">
                              <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="budget"
                                placeholder="e.g., ₹85 Crores"
                                className="pl-10"
                                value={formData.budget}
                                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="timeline">Timeline</Label>
                            <div className="relative">
                              <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="timeline"
                                placeholder="e.g., 36 months"
                                className="pl-10"
                                value={formData.timeline}
                                onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Step 2: Project Description */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                          <span>Project Details & Scope</span>
                        </CardTitle>
                        <CardDescription>
                          Provide detailed description and scope of your project
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="projectDescription">Project Description *</Label>
                          <Textarea
                            id="projectDescription"
                            placeholder="Provide a comprehensive description of your project, including objectives, expected outcomes, and key deliverables..."
                            rows={8}
                            value={formData.projectDescription}
                            onChange={(e) => setFormData(prev => ({ ...prev, projectDescription: e.target.value }))}
                            maxLength={500}
                          />
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                              Be specific about project goals and requirements.
                            </span>
                            <span className={formData.projectDescription.length > 450 ? 'text-orange-500' : 'text-gray-500'}>
                              {formData.projectDescription.length}/500 characters
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Step 3: Requirements & Specifications */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Target className="h-5 w-5 text-blue-600" />
                          <span>Requirements & Specifications</span>
                        </CardTitle>
                        <CardDescription>
                          Define technical requirements, disciplines, and expected outcomes
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Disciplines */}
                        <div className="space-y-3">
                          <Label>Disciplines/Expertise Required *</Label>
                          <Select
                            onValueChange={(value) => addToArray('disciplines', value)}
                            disabled={!availableDisciplines.length}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={
                                availableDisciplines.length 
                                  ? "Add discipline..." 
                                  : "Select industry first"
                              } />
                            </SelectTrigger>
                            <SelectContent>
                              {availableDisciplines.map((discipline) => (
                                <SelectItem key={discipline} value={discipline}>
                                  {discipline}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex flex-wrap gap-2">
                            {formData.disciplines.map((discipline, index) => (
                              <Badge key={index} variant="secondary" className="px-3 py-1">
                                {discipline}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
                                  onClick={() => removeFromArray('disciplines', index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Requirements */}
                        <div className="space-y-3">
                          <Label>Key Requirements *</Label>
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Enter a key requirement..."
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  addToArray('requirements', e.currentTarget.value)
                                  e.currentTarget.value = ''
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement
                                addToArray('requirements', input.value)
                                input.value = ''
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {formData.requirements.map((requirement, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                <span className="text-sm">{requirement}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFromArray('requirements', index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Technical Specifications */}
                        <div className="space-y-3">
                          <Label>Technical Specifications (Optional)</Label>
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Enter technical specification..."
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  addToArray('technicalSpecifications', e.currentTarget.value)
                                  e.currentTarget.value = ''
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement
                                addToArray('technicalSpecifications', input.value)
                                input.value = ''
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {formData.technicalSpecifications.map((spec, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                <span className="text-sm">{spec}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFromArray('technicalSpecifications', index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Expected Outcomes */}
                        <div className="space-y-3">
                          <Label>Expected Outcomes (Optional)</Label>
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Enter expected outcome..."
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  addToArray('expectedOutcomes', e.currentTarget.value)
                                  e.currentTarget.value = ''
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement
                                addToArray('expectedOutcomes', input.value)
                                input.value = ''
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {formData.expectedOutcomes.map((outcome, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                <span className="text-sm">{outcome}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFromArray('expectedOutcomes', index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex space-x-2">
                    {currentStep < 3 ? (
                      <Button
                        onClick={() => setCurrentStep(currentStep + 1)}
                        disabled={!validateStep(currentStep)}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        onClick={handleGenerate}
                        disabled={!validateStep(currentStep) || isGenerating}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate RFP
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Generation Progress */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <Card className="shadow-lg border-0">
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      <span>Generating Your Government RFP</span>
                    </CardTitle>
                    <CardDescription>
                      Please wait while we create your comprehensive, compliant RFP document
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {generationSteps.map((step, index) => (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-center space-x-4 p-4 rounded-lg ${
                            step.completed 
                              ? 'bg-green-50 border border-green-200' 
                              : index === currentGenerationStep 
                                ? 'bg-blue-50 border border-blue-200' 
                                : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            step.completed 
                              ? 'bg-green-600 text-white' 
                              : index === currentGenerationStep 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-300 text-gray-600'
                          }`}>
                            {step.completed ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : index === currentGenerationStep ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <span className="text-sm font-semibold">{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-grow">
                            <h3 className={`font-semibold ${
                              step.completed ? 'text-green-800' : index === currentGenerationStep ? 'text-blue-800' : 'text-gray-600'
                            }`}>
                              {step.title}
                            </h3>
                            <p className={`text-sm ${
                              step.completed ? 'text-green-600' : index === currentGenerationStep ? 'text-blue-600' : 'text-gray-500'
                            }`}>
                              {step.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">Estimated completion time</div>
                      <div className="text-2xl font-bold text-gray-900">2-3 minutes</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Generating 4,000+ words of government-compliant content
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Results */}
            {result && !isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Success Alert */}
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>RFP Generated Successfully!</strong> Your comprehensive government RFP document is ready with {result.metadata.wordCount} words of professional content.
                  </AlertDescription>
                </Alert>

                {/* Metadata */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <FileCheck className="h-5 w-5 text-green-600" />
                        <span>RFP Document Generated</span>
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(result.rfpText)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadRFP}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{result.metadata.wordCount}</div>
                        <div className="text-sm text-blue-800">Words</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{Math.ceil(result.metadata.wordCount / 250)}</div>
                        <div className="text-sm text-green-800">Pages</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{result.metadata.industry}</div>
                        <div className="text-sm text-purple-800">Industry</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">Gov</div>
                        <div className="text-sm text-orange-800">Compliant</div>
                      </div>
                    </div>

                    {/* Document Preview */}
                    <div className="border rounded-lg p-6 bg-white max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm font-mono text-gray-700">
                        {result.rfpText.substring(0, 2000)}
                        {result.rfpText.length > 2000 && "..."}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Error State */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Generation Failed:</strong> {error}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">RFP Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "GFR 2017 Compliance",
                    "CVC Guidelines Integration",
                    "Make in India Requirements",
                    "Bilingual Headers (Hindi/English)",
                    "Technical Specifications",
                    "Evaluation Criteria",
                    "Legal & Contract Terms",
                    "Procurement Schedule",
                    "4000+ Professional Words",
                    "Government Formatting"
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
                <CardTitle className="text-lg">Document Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="font-semibold text-gray-700">✓ Executive Summary</div>
                  <div className="font-semibold text-gray-700">✓ Project Background</div>
                  <div className="font-semibold text-gray-700">✓ Scope of Work</div>
                  <div className="font-semibold text-gray-700">✓ Technical Requirements</div>
                  <div className="font-semibold text-gray-700">✓ Contractor Qualifications</div>
                  <div className="font-semibold text-gray-700">✓ Evaluation Criteria</div>
                  <div className="font-semibold text-gray-700">✓ Submission Requirements</div>
                  <div className="font-semibold text-gray-700">✓ Contract Terms</div>
                  <div className="font-semibold text-gray-700">✓ Compliance & Transparency</div>
                  <div className="font-semibold text-gray-700">✓ Procurement Schedule</div>
                  <div className="font-semibold text-gray-700">✓ Appendices & References</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
