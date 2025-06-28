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
  Settings,
  ChevronLeft,
  ChevronRight,
  Loader
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { RFPGenerationAPI, RFPGenerationRequest, RFPGenerationResponse, industryOptions, projectTypeOptions, disciplineOptions } from "@/lib/api"
import DocumentPreview from "@/components/DocumentPreview"
import SuccessNotification from "@/components/SuccessNotification"
import RFPContentGenerator, { RFPData } from "@/lib/rfpContentGenerator"

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
    expectedOutcomes: [],
    // New structured fields
    introduction: '',
    generalTermsConditions: '',
    contactInfo: {
      primaryContact: '',
      email: '',
      phone: '',
      address: ''
    },
    rfpTimeline: {
      issueDate: '',
      clarificationDeadline: '',
      submissionDeadline: '',
      validityPeriod: ''
    },
    scopeOfWork: {
      functionalRequirements: [],
      nonFunctionalRequirements: {
        userExperience: [],
        performance: [],
        devops: [],
        security: []
      },
      activitiesInScope: []
    },
    budgetBreakdown: {
      totalBudget: '',
      categories: []
    },
    complianceTerms: [],
    responseFormat: '',
    expectations: '',
    presentationRequirements: []
  })

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationSteps, setGenerationSteps] = useState<LoadingStep[]>(GENERATION_STEPS)
  const [currentGenerationStep, setCurrentGenerationStep] = useState(0)
  const [result, setResult] = useState<RFPGenerationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Document preview state
  const [showPreview, setShowPreview] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)

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
  const addToArray = (field: string, value: string) => {
    if (!value.trim()) return
    
    // Handle nested fields
    if (field.includes('.')) {
      const parts = field.split('.')
      setFormData(prev => {
        let newData = { ...prev }
        let current: any = newData
        
        // Navigate to the nested object
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {}
          }
          current = current[parts[i]]
        }
        
        const lastKey = parts[parts.length - 1]
        const currentArray = current[lastKey] || []
        
        if (!currentArray.includes(value.trim())) {
          current[lastKey] = [...currentArray, value.trim()]
        }
        
        return newData
      })
    } else {
      // Handle direct fields
      const currentArray = (formData as any)[field] as string[] || []
      if (!currentArray.includes(value.trim())) {
        setFormData(prev => ({
          ...prev,
          [field]: [...currentArray, value.trim()]
        }))
      }
    }
  }

  const removeFromArray = (field: string, index: number) => {
    // Handle nested fields
    if (field.includes('.')) {
      const parts = field.split('.')
      setFormData(prev => {
        let newData = { ...prev }
        let current: any = newData
        
        // Navigate to the nested object
        for (let i = 0; i < parts.length - 1; i++) {
          current = current[parts[i]]
        }
        
        const lastKey = parts[parts.length - 1]
        const currentArray = current[lastKey] || []
        current[lastKey] = currentArray.filter((_: any, i: number) => i !== index)
        
        return newData
      })
    } else {
      // Handle direct fields
      const currentArray = (formData as any)[field] as string[] || []
      setFormData(prev => ({
        ...prev,
        [field]: currentArray.filter((_, i) => i !== index)
      }))
    }
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
      setShowSuccessNotification(true)
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

  // Show document preview - only works after generation
  const showDocumentPreview = () => {
    if (!result) return // Only show preview when we have generated content
    setShowPreview(true)
  }

  // Download as text file
  const downloadRFP = () => {
    if (!result) return
    const blob = new Blob([result.rfpText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${formData.projectName?.replace(/\s+/g, '_') || 'RFP'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Prepare document data for preview
  const getDocumentData = () => {
    if (!result) {
      // Generate sample content from form data when no API result is available
      const rfpData = RFPContentGenerator.createRFPFromForm(formData)
      const sampleContent = RFPContentGenerator.generateSampleContent(rfpData)
      
      return {
        title: `Request for Proposal - ${formData.projectName}`,
        content: sampleContent,
        metadata: {
          projectName: formData.projectName || 'Unnamed Project',
          industry: formData.industry || 'General',
          wordCount: sampleContent.split(/\s+/).length,
          generatedAt: new Date().toISOString()
        }
      }
    }
    
    return {
      title: `Request for Proposal - ${formData.projectName}`,
      content: result.rfpText,
      metadata: {
        projectName: formData.projectName || 'Unnamed Project',
        industry: formData.industry || 'General',
        wordCount: result.rfpText.split(/\s+/).length,
        generatedAt: new Date().toISOString()
      }
    }
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.projectName && formData.industry && formData.projectType
      case 2:
        return formData.projectDescription && formData.projectDescription.length <= 500 && 
               formData.introduction && formData.generalTermsConditions
      case 3:
        return formData.contactInfo?.primaryContact && formData.contactInfo?.email && 
               formData.rfpTimeline?.issueDate && formData.rfpTimeline?.submissionDeadline
      case 4:
        const hasNonFunctionalReqs = formData.scopeOfWork?.nonFunctionalRequirements && (
          (formData.scopeOfWork.nonFunctionalRequirements.userExperience?.length || 0) > 0 ||
          (formData.scopeOfWork.nonFunctionalRequirements.performance?.length || 0) > 0 ||
          (formData.scopeOfWork.nonFunctionalRequirements.security?.length || 0) > 0 ||
          (formData.scopeOfWork.nonFunctionalRequirements.devops?.length || 0) > 0
        )
        return formData.scopeOfWork?.functionalRequirements && formData.scopeOfWork.functionalRequirements.length > 0 && 
               formData.scopeOfWork?.activitiesInScope && formData.scopeOfWork.activitiesInScope.length > 0
      case 5:
        return formData.disciplines && formData.disciplines.length > 0 && 
               formData.requirements && formData.requirements.length > 0
      case 6:
        return formData.budgetBreakdown?.totalBudget && 
               formData.complianceTerms && formData.complianceTerms.length > 0
      default:
        return true
    }
  }

  const canProceedToGenerate = () => {
    // Comprehensive validation for final generation
    const hasBasicInfo = formData.projectName && 
                        formData.industry && 
                        formData.projectType && 
                        formData.projectDescription
    
    const hasContactInfo = formData.contactInfo?.primaryContact &&
                          formData.contactInfo?.email
    
    const hasTimeline = formData.rfpTimeline?.issueDate &&
                       formData.rfpTimeline?.submissionDeadline
    
    const hasScopeOfWork = formData.scopeOfWork?.functionalRequirements && 
                          formData.scopeOfWork.functionalRequirements.length > 0 &&
                          formData.scopeOfWork?.activitiesInScope && 
                          formData.scopeOfWork.activitiesInScope.length > 0
    
    const hasRequirements = formData.disciplines && formData.disciplines.length > 0 &&
                           formData.requirements && formData.requirements.length > 0
    
    const hasBudgetCompliance = formData.budgetBreakdown?.totalBudget &&
                               formData.complianceTerms && formData.complianceTerms.length > 0

    return hasBasicInfo && hasContactInfo && hasTimeline && hasScopeOfWork && hasRequirements && hasBudgetCompliance
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
                    <div className="relative">
                      {/* Steps Container */}
                      <div className="flex items-start justify-between relative overflow-x-auto">
                        {[
                          { num: 1, label: 'Project Basics' },
                          { num: 2, label: 'Description & Terms' },
                          { num: 3, label: 'Timeline & Contact' },
                          { num: 4, label: 'Scope of Work' },
                          { num: 5, label: 'Requirements' },
                          { num: 6, label: 'Budget & Compliance' }
                        ].map((step, index) => {
                          const isCompleted = validateStep(step.num) && currentStep > step.num
                          const isCurrent = currentStep === step.num
                          
                          return (
                            <div key={step.num} className="flex flex-col items-center flex-1 min-w-0">
                              {/* Step Circle */}
                              <button
                                onClick={() => setCurrentStep(step.num)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors mb-2 relative z-10 border-2 border-white shadow-md ${
                                  isCurrent
                                    ? 'bg-blue-600 text-white' 
                                    : isCompleted
                                      ? 'bg-green-600 text-white' 
                                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                              >
                                {isCompleted ? <CheckCircle className="h-4 w-4" /> : step.num}
                              </button>
                              
                              {/* Step Label */}
                              <button
                                onClick={() => setCurrentStep(step.num)}
                                className={`text-xs text-center transition-colors px-1 ${
                                  isCurrent ? 'text-blue-600 font-semibold' : 
                                  isCompleted ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-gray-800'
                                }`}
                              >
                                {step.label}
                              </button>
                            </div>
                          )
                        })}
                        
                        {/* Connecting Lines Behind Circles */}
                        <div className="absolute top-4 left-0 right-0 flex items-center z-0">
                          <div className="flex items-center w-full px-4">
                            {[1, 2, 3, 4, 5].map((stepNum) => (
                              <div key={stepNum} className="flex items-center flex-1">
                                <div className="w-4" /> {/* Space for circle */}
                                <div className={`h-0.5 flex-1 transition-all duration-300 ${
                                  validateStep(stepNum) && currentStep > stepNum ? 'bg-green-600' : 'bg-gray-200'
                                }`} />
                              </div>
                            ))}
                            <div className="w-4" /> {/* Space for last circle */}
                          </div>
                        </div>
                      </div>
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

                {/* Step 2: Project Description & Terms */}
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
                          <span>Project Description & General Terms</span>
                        </CardTitle>
                        <CardDescription>
                          Provide detailed description, introduction, and general terms
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="projectDescription">Project Description *</Label>
                          <Textarea
                            id="projectDescription"
                            placeholder="Provide a comprehensive description of your project, including objectives, expected outcomes, and key deliverables..."
                            rows={6}
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

                        <Separator />

                        <div className="space-y-2">
                          <Label htmlFor="introduction">RFP Introduction *</Label>
                          <Textarea
                            id="introduction"
                            placeholder="Write a formal introduction for the RFP document, including background context and purpose..."
                            rows={4}
                            value={formData.introduction}
                            onChange={(e) => setFormData(prev => ({ ...prev, introduction: e.target.value }))}
                          />
                          <p className="text-sm text-gray-500">
                            This will appear as the opening section of your RFP document.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="generalTermsConditions">General Terms & Conditions *</Label>
                          <Textarea
                            id="generalTermsConditions"
                            placeholder="Specify general terms and conditions that apply to this RFP..."
                            rows={4}
                            value={formData.generalTermsConditions}
                            onChange={(e) => setFormData(prev => ({ ...prev, generalTermsConditions: e.target.value }))}
                          />
                          <p className="text-sm text-gray-500">
                            Include standard clauses, legal requirements, and general conditions.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="responseFormat">Response Format & Instructions</Label>
                          <Textarea
                            id="responseFormat"
                            placeholder="Specify how respondents should format their proposals, required sections, file formats, etc..."
                            rows={3}
                            value={formData.responseFormat}
                            onChange={(e) => setFormData(prev => ({ ...prev, responseFormat: e.target.value }))}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Step 3: Timeline & Contact Information */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <span>Timeline & Contact Information</span>
                        </CardTitle>
                        <CardDescription>
                          Set RFP timeline and provide contact details for inquiries
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Contact Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900">Contact Information *</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="primaryContact">Primary Contact *</Label>
                              <Input
                                id="primaryContact"
                                placeholder="Name of the contact person"
                                value={formData.contactInfo?.primaryContact || ''}
                                onChange={(e) => setFormData(prev => ({ 
                                  ...prev, 
                                  contactInfo: { ...prev.contactInfo!, primaryContact: e.target.value }
                                }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="contactEmail">Email *</Label>
                              <Input
                                id="contactEmail"
                                type="email"
                                placeholder="contact@organization.gov.in"
                                value={formData.contactInfo?.email || ''}
                                onChange={(e) => setFormData(prev => ({ 
                                  ...prev, 
                                  contactInfo: { ...prev.contactInfo!, email: e.target.value }
                                }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="contactPhone">Phone Number</Label>
                              <Input
                                id="contactPhone"
                                placeholder="+91-XXXXXXXXXX"
                                value={formData.contactInfo?.phone || ''}
                                onChange={(e) => setFormData(prev => ({ 
                                  ...prev, 
                                  contactInfo: { ...prev.contactInfo!, phone: e.target.value }
                                }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="contactAddress">Address</Label>
                              <Input
                                id="contactAddress"
                                placeholder="Official address"
                                value={formData.contactInfo?.address || ''}
                                onChange={(e) => setFormData(prev => ({ 
                                  ...prev, 
                                  contactInfo: { ...prev.contactInfo!, address: e.target.value }
                                }))}
                              />
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* RFP Timeline */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900">RFP Timeline *</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="issueDate">RFP Issue Date *</Label>
                              <Input
                                id="issueDate"
                                type="date"
                                value={formData.rfpTimeline?.issueDate || ''}
                                onChange={(e) => setFormData(prev => ({ 
                                  ...prev, 
                                  rfpTimeline: { ...prev.rfpTimeline!, issueDate: e.target.value }
                                }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="clarificationDeadline">Clarification Deadline</Label>
                              <Input
                                id="clarificationDeadline"
                                type="date"
                                value={formData.rfpTimeline?.clarificationDeadline || ''}
                                onChange={(e) => setFormData(prev => ({ 
                                  ...prev, 
                                  rfpTimeline: { ...prev.rfpTimeline!, clarificationDeadline: e.target.value }
                                }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="submissionDeadline">Final Submission Deadline *</Label>
                              <Input
                                id="submissionDeadline"
                                type="date"
                                value={formData.rfpTimeline?.submissionDeadline || ''}
                                onChange={(e) => setFormData(prev => ({ 
                                  ...prev, 
                                  rfpTimeline: { ...prev.rfpTimeline!, submissionDeadline: e.target.value }
                                }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="validityPeriod">RFP Validity Period</Label>
                              <Input
                                id="validityPeriod"
                                placeholder="e.g., 90 days"
                                value={formData.rfpTimeline?.validityPeriod || ''}
                                onChange={(e) => setFormData(prev => ({ 
                                  ...prev, 
                                  rfpTimeline: { ...prev.rfpTimeline!, validityPeriod: e.target.value }
                                }))}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Step 4: Scope of Work */}
                {currentStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Target className="h-5 w-5 text-blue-600" />
                          <span>Scope of Work</span>
                        </CardTitle>
                        <CardDescription>
                          Define functional requirements, non-functional requirements, and activities
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Functional Requirements */}
                        <div className="space-y-3">
                          <Label>Functional Requirements *</Label>
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Enter a functional requirement..."
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  addToArray('scopeOfWork.functionalRequirements', e.currentTarget.value)
                                  e.currentTarget.value = ''
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement
                                addToArray('scopeOfWork.functionalRequirements', input.value)
                                input.value = ''
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {(formData.scopeOfWork?.functionalRequirements || []).map((req, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                <span className="text-sm">{req}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFromArray('scopeOfWork.functionalRequirements', index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Non-Functional Requirements */}
                        <div className="space-y-4">
                          <div>
                            <Label className="text-lg font-semibold">Non-Functional Requirements</Label>
                            <p className="text-sm text-gray-600 mt-1">
                              Define quality attributes, performance standards, and operational requirements that specify how the system should behave.
                            </p>
                          </div>
                          
                          {/* User Experience */}
                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-gray-700">User Experience</Label>
                            <div className="flex space-x-2">
                              <Input
                                placeholder="Enter user experience requirement (e.g., intuitive interface, accessibility compliance)..."
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    addToArray('scopeOfWork.nonFunctionalRequirements.userExperience', e.currentTarget.value)
                                    e.currentTarget.value = ''
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={(e) => {
                                  const input = e.currentTarget.previousElementSibling as HTMLInputElement
                                  addToArray('scopeOfWork.nonFunctionalRequirements.userExperience', input.value)
                                  input.value = ''
                                }}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {(formData.scopeOfWork?.nonFunctionalRequirements?.userExperience || []).map((req, index) => (
                                <div key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                                  <span className="text-sm">{req}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFromArray('scopeOfWork.nonFunctionalRequirements.userExperience', index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Performance */}
                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-gray-700">Performance Requirements</Label>
                            <div className="flex space-x-2">
                              <Input
                                placeholder="Enter performance requirement (e.g., response time < 2 seconds, 99.9% uptime)..."
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    addToArray('scopeOfWork.nonFunctionalRequirements.performance', e.currentTarget.value)
                                    e.currentTarget.value = ''
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={(e) => {
                                  const input = e.currentTarget.previousElementSibling as HTMLInputElement
                                  addToArray('scopeOfWork.nonFunctionalRequirements.performance', input.value)
                                  input.value = ''
                                }}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {(formData.scopeOfWork?.nonFunctionalRequirements?.performance || []).map((req, index) => (
                                <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                                  <span className="text-sm">{req}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFromArray('scopeOfWork.nonFunctionalRequirements.performance', index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Security */}
                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-gray-700">Security Requirements</Label>
                            <div className="flex space-x-2">
                              <Input
                                placeholder="Enter security requirement (e.g., SSL encryption, data backup, authentication)..."
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    addToArray('scopeOfWork.nonFunctionalRequirements.security', e.currentTarget.value)
                                    e.currentTarget.value = ''
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={(e) => {
                                  const input = e.currentTarget.previousElementSibling as HTMLInputElement
                                  addToArray('scopeOfWork.nonFunctionalRequirements.security', input.value)
                                  input.value = ''
                                }}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {(formData.scopeOfWork?.nonFunctionalRequirements?.security || []).map((req, index) => (
                                <div key={index} className="flex items-center justify-between bg-red-50 p-3 rounded-lg">
                                  <span className="text-sm">{req}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFromArray('scopeOfWork.nonFunctionalRequirements.security', index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* DevOps */}
                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-gray-700">Operational & Maintenance Requirements</Label>
                            <div className="flex space-x-2">
                              <Input
                                placeholder="Enter operational requirement (e.g., 24/7 support, maintenance schedule, backup procedures)..."
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    addToArray('scopeOfWork.nonFunctionalRequirements.devops', e.currentTarget.value)
                                    e.currentTarget.value = ''
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={(e) => {
                                  const input = e.currentTarget.previousElementSibling as HTMLInputElement
                                  addToArray('scopeOfWork.nonFunctionalRequirements.devops', input.value)
                                  input.value = ''
                                }}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {(formData.scopeOfWork?.nonFunctionalRequirements?.devops || []).map((req, index) => (
                                <div key={index} className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
                                  <span className="text-sm">{req}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFromArray('scopeOfWork.nonFunctionalRequirements.devops', index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Activities in Scope */}
                        <div className="space-y-3">
                          <Label>Activities in Scope *</Label>
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Enter activity to be performed..."
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  addToArray('scopeOfWork.activitiesInScope', e.currentTarget.value)
                                  e.currentTarget.value = ''
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement
                                addToArray('scopeOfWork.activitiesInScope', input.value)
                                input.value = ''
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {(formData.scopeOfWork?.activitiesInScope || []).map((activity, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                <span className="text-sm">{activity}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFromArray('scopeOfWork.activitiesInScope', index)}
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

                {/* Step 5: Requirements & Specifications */}
                {currentStep === 5 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Settings className="h-5 w-5 text-blue-600" />
                          <span>Technical Requirements & Disciplines</span>
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
                            {(formData.disciplines || []).map((discipline, index) => (
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

                        {/* Key Requirements */}
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
                            {(formData.requirements || []).map((requirement, index) => (
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
                            {(formData.technicalSpecifications || []).map((spec, index) => (
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
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Step 6: Budget & Compliance */}
                {currentStep === 6 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <IndianRupee className="h-5 w-5 text-blue-600" />
                          <span>Budget Breakdown & Compliance</span>
                        </CardTitle>
                        <CardDescription>
                          Define budget structure, compliance terms, and final expectations
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Budget Breakdown */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900">Budget Breakdown</h3>
                          <div className="space-y-2">
                            <Label htmlFor="totalBudget">Total Budget *</Label>
                            <div className="relative">
                              <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="totalBudget"
                                placeholder="e.g., ₹85 Crores"
                                className="pl-10"
                                value={formData.budgetBreakdown?.totalBudget || ''}
                                onChange={(e) => setFormData(prev => ({ 
                                  ...prev, 
                                  budgetBreakdown: { ...prev.budgetBreakdown!, totalBudget: e.target.value }
                                }))}
                              />
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Compliance Terms */}
                        <div className="space-y-3">
                          <Label>Compliance Terms & Rules *</Label>
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Enter compliance requirement (e.g., GFR 2017 compliance, CVC guidelines, etc.)..."
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  addToArray('complianceTerms', e.currentTarget.value)
                                  e.currentTarget.value = ''
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement
                                addToArray('complianceTerms', input.value)
                                input.value = ''
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {(formData.complianceTerms || []).map((term, index) => (
                              <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                                <span className="text-sm font-medium text-green-900">{term}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFromArray('complianceTerms', index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Expectations */}
                        <div className="space-y-2">
                          <Label htmlFor="expectations">Vendor Expectations & Evaluation Criteria</Label>
                          <Textarea
                            id="expectations"
                            placeholder="Describe what you expect from vendors, evaluation criteria, selection process, etc..."
                            rows={4}
                            value={formData.expectations}
                            onChange={(e) => setFormData(prev => ({ ...prev, expectations: e.target.value }))}
                          />
                          <p className="text-sm text-gray-500">
                            This will help vendors understand how they will be evaluated and what is expected.
                          </p>
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
                    {currentStep < 6 ? (
                      <Button
                        onClick={() => setCurrentStep(currentStep + 1)}
                        disabled={!validateStep(currentStep)}
                      >
                        Next
                      </Button>
                    ) : (
                      <div className="flex flex-col items-end space-y-2">
                        {!canProceedToGenerate() && (
                          <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded border max-w-md">
                            <div className="font-semibold mb-1">Missing Required Fields:</div>
                            {!formData.projectName && <div>• Project name required</div>}
                            {!formData.industry && <div>• Industry selection required</div>}
                            {!formData.projectType && <div>• Project type required</div>}
                            {!formData.projectDescription && <div>• Project description required</div>}
                            {!formData.introduction && <div>• RFP introduction required</div>}
                            {!formData.generalTermsConditions && <div>• General terms & conditions required</div>}
                            {!formData.contactInfo?.primaryContact && <div>• Primary contact required</div>}
                            {!formData.contactInfo?.email && <div>• Contact email required</div>}
                            {!formData.rfpTimeline?.issueDate && <div>• Issue date required</div>}
                            {!formData.rfpTimeline?.submissionDeadline && <div>• Submission deadline required</div>}
                            {(!formData.scopeOfWork?.functionalRequirements || formData.scopeOfWork.functionalRequirements.length === 0) && <div>• Functional requirements required</div>}
                            {(!formData.scopeOfWork?.activitiesInScope || formData.scopeOfWork.activitiesInScope.length === 0) && <div>• Activities in scope required</div>}
                            {(!formData.disciplines || formData.disciplines.length === 0) && <div>• At least one discipline required</div>}
                            {(!formData.requirements || formData.requirements.length === 0) && <div>• At least one key requirement needed</div>}
                            {!formData.budgetBreakdown?.totalBudget && <div>• Total budget required</div>}
                            {(!formData.complianceTerms || formData.complianceTerms.length === 0) && <div>• Compliance terms required</div>}
                          </div>
                        )}
                        <Button
                          onClick={handleGenerate}
                          disabled={!canProceedToGenerate() || isGenerating}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full"
                        >
                          <Wand2 className="h-4 w-4 mr-2" />
                          Generate Government RFP
                        </Button>
                      </div>
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
                          onClick={showDocumentPreview}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
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

      {/* Document Preview Modal - Only show when there's generated content */}
      {result && (
        <DocumentPreview
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          rfpData={getDocumentData()!}
          formData={formData}
        />
      )}

      {/* Success Notification */}
      {result && (
        <SuccessNotification
          isVisible={showSuccessNotification}
          onClose={() => setShowSuccessNotification(false)}
          onPreview={showDocumentPreview}
          onDownload={downloadRFP}
          onCopy={() => copyToClipboard(result.rfpText)}
          metadata={{
            projectName: formData.projectName || 'Unnamed Project',
            wordCount: result.rfpText.split(/\s+/).length,
            industry: formData.industry || 'General'
          }}
        />
      )}
    </div>
  )
}
