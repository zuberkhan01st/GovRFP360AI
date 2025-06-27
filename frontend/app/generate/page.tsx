"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { FileText, ArrowLeft, ArrowRight, Loader2, Download, Copy, CheckCircle } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useRFPStore } from "@/lib/store"

const industries = [
  "Environmental",
  "Infrastructure",
  "Technology",
  "Healthcare",
  "Education",
  "Defense",
  "Transportation",
  "Energy",
]

const projectTypes = [
  "Development",
  "Modernization",
  "Compliance",
  "Maintenance",
  "Consulting",
  "Supply",
  "Services",
  "Research",
]

const disciplines = [
  "Environmental Engineering",
  "Civil Engineering",
  "Software Development",
  "IoT Systems",
  "Data Analytics",
  "Project Management",
  "Quality Assurance",
  "Cybersecurity",
  "Cloud Computing",
  "AI/ML",
  "Blockchain",
  "Mobile Development",
]

export default function GeneratePage() {
  const { formData, setFormData, generatedRFP, setGeneratedRFP, isGenerating, setIsGenerating } = useRFPStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>(formData.disciplines || [])
  const [requirements, setRequirements] = useState<string[]>(formData.requirements || [])
  const [newRequirement, setNewRequirement] = useState("")

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleDisciplineToggle = (discipline: string) => {
    const updated = selectedDisciplines.includes(discipline)
      ? selectedDisciplines.filter((d) => d !== discipline)
      : [...selectedDisciplines, discipline]
    setSelectedDisciplines(updated)
    setFormData({ ...formData, disciplines: updated })
  }

  const addRequirement = () => {
    if (newRequirement.trim()) {
      const updated = [...requirements, newRequirement.trim()]
      setRequirements(updated)
      setFormData({ ...formData, requirements: updated })
      setNewRequirement("")
    }
  }

  const removeRequirement = (index: number) => {
    const updated = requirements.filter((_, i) => i !== index)
    setRequirements(updated)
    setFormData({ ...formData, requirements: updated })
  }

  const generateRFP = async () => {
    setIsGenerating(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const mockRFP = {
        success: true,
        rfpText: `# निविदा सूचना / NOTICE INVITING TENDER

## NIT No: GOV/RFP/2025/ENV/001
## Date: ${new Date().toLocaleDateString("en-IN")}

---

### PROJECT: ${formData.projectName}

**Industry:** ${formData.industry}  
**Project Type:** ${formData.projectType}  
**Budget:** ${formData.budget}  
**Timeline:** ${formData.timeline}  
**Location:** ${formData.location}

---

## 1. PROJECT OVERVIEW

${formData.projectDescription}

This comprehensive ${formData.projectType.toLowerCase()} project in the ${formData.industry.toLowerCase()} sector requires specialized expertise and cutting-edge technology solutions. The project aims to deliver world-class infrastructure while maintaining strict compliance with Indian Government regulations and international standards.

## 2. SCOPE OF WORK

The selected contractor shall be responsible for:

### 2.1 Primary Deliverables
- Complete project design and implementation
- Technology integration and deployment
- Quality assurance and testing
- Documentation and training
- Maintenance and support services

### 2.2 Technical Requirements
${selectedDisciplines.map((d) => `- ${d} expertise and certification`).join("\n")}

### 2.3 Specific Requirements
${requirements.map((r) => `- ${r}`).join("\n")}

## 3. ELIGIBILITY CRITERIA

### 3.1 Technical Qualifications
- Minimum 5 years experience in ${formData.industry.toLowerCase()} projects
- ISO 9001:2015 certification mandatory
- Previous government project experience preferred
- Local content compliance as per Make in India guidelines

### 3.2 Financial Criteria
- Annual turnover of minimum ₹${Number.parseInt(formData.budget?.replace(/[^\d]/g, "") || "0") * 0.3} Crores in last 3 years
- Net worth of minimum ₹${Number.parseInt(formData.budget?.replace(/[^\d]/g, "") || "0") * 0.2} Crores
- Bank guarantee capability

## 4. COMPLIANCE REQUIREMENTS

### 4.1 Regulatory Compliance
✓ GFR 2017 Guidelines adherence  
✓ CVC Guidelines compliance  
✓ Make in India policy (${formData.localContent || 60}% local content)  
✓ Atmanirbhar Bharat initiative support  
✓ Digital India compliance  
✓ MSME preference as applicable  

### 4.2 Quality Standards
- IS/BIS certification for all materials
- International quality standards compliance
- Environmental clearance as required
- Safety protocols as per Indian standards

## 5. SUBMISSION REQUIREMENTS

### 5.1 Technical Proposal
- Company profile and experience
- Project methodology and approach
- Team composition and CVs
- Timeline and milestones
- Quality assurance plan

### 5.2 Financial Proposal
- Detailed cost breakdown
- Payment schedule proposal
- Bank guarantees and securities
- Tax compliance certificates

## 6. EVALUATION CRITERIA

### Technical Evaluation (70%)
- Experience and expertise: 25%
- Methodology and approach: 20%
- Team qualifications: 15%
- Past performance: 10%

### Financial Evaluation (30%)
- Cost competitiveness: 20%
- Value for money: 10%

## 7. TERMS AND CONDITIONS

### 7.1 Contract Duration
Project completion within ${formData.timeline} from award date.

### 7.2 Payment Terms
- Advance payment: 10% against bank guarantee
- Milestone-based payments: 80%
- Final payment: 10% after successful completion

### 7.3 Penalties and Incentives
- Delay penalty: 0.5% per week (max 10%)
- Early completion bonus: 2% for completion 1 month early

## 8. SUBMISSION DETAILS

**Last Date for Submission:** ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN")}  
**Technical Bid Opening:** ${new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN")}  
**Financial Bid Opening:** ${new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN")}

**Submission Address:**  
Chief Project Officer  
Government Procurement Division  
${formData.location}

---

## 9. CONTACT INFORMATION

**Project Officer:** Shri/Smt. [Name]  
**Email:** procurement@gov.in  
**Phone:** +91-11-XXXXXXXX  
**Office Hours:** 10:00 AM to 5:00 PM (Monday to Friday)

---

*This RFP document has been generated using AI technology and complies with Indian Government procurement standards. All terms and conditions are subject to applicable laws and regulations.*

**Generated on:** ${new Date().toLocaleString("en-IN")}  
**Document ID:** RFP-${Date.now()}  
**AI System:** GovRFP360AI v2.0`,
        metadata: {
          projectName: formData.projectName,
          industry: formData.industry,
          wordCount: 1250,
          generatedAt: new Date().toISOString(),
          aiProvider: "AI System",
        },
      }

      setGeneratedRFP(mockRFP)
      setCurrentStep(4)
    } catch (error) {
      console.error("Error generating RFP:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (generatedRFP?.rfpText) {
      navigator.clipboard.writeText(generatedRFP.rfpText)
    }
  }

  const downloadRFP = (format: string) => {
    if (!generatedRFP?.rfpText) return

    const blob = new Blob([generatedRFP.rfpText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${formData.projectName || "RFP"}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
                <p className="text-sm text-gray-600">RFP Generator</p>
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
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Generate Government RFP</h2>
            <Badge variant="secondary">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <span>
                    {currentStep === 1 && "Project Basics"}
                    {currentStep === 2 && "Project Details"}
                    {currentStep === 3 && "Compliance & Preferences"}
                    {currentStep === 4 && "Generated RFP"}
                  </span>
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && "Enter basic project information"}
                  {currentStep === 2 && "Provide detailed project requirements"}
                  {currentStep === 3 && "Configure compliance settings"}
                  {currentStep === 4 && "Review and download your RFP"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <AnimatePresence mode="wait">
                  {/* Step 1: Project Basics */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="projectName">Project Name *</Label>
                          <Input
                            id="projectName"
                            placeholder="Regional Environmental Monitoring Network"
                            value={formData.projectName || ""}
                            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location *</Label>
                          <Input
                            id="location"
                            placeholder="Metropolitan District"
                            value={formData.location || ""}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="industry">Industry *</Label>
                          <Select
                            value={formData.industry || ""}
                            onValueChange={(value) => setFormData({ ...formData, industry: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              {industries.map((industry) => (
                                <SelectItem key={industry} value={industry}>
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="projectType">Project Type *</Label>
                          <Select
                            value={formData.projectType || ""}
                            onValueChange={(value) => setFormData({ ...formData, projectType: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select project type" />
                            </SelectTrigger>
                            <SelectContent>
                              {projectTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="budget">Budget *</Label>
                          <Input
                            id="budget"
                            placeholder="₹85 Crores"
                            value={formData.budget || ""}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="timeline">Timeline *</Label>
                          <Input
                            id="timeline"
                            placeholder="36 months"
                            value={formData.timeline || ""}
                            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Project Details */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <Label htmlFor="projectDescription">Project Description *</Label>
                        <Textarea
                          id="projectDescription"
                          placeholder="Provide a detailed description of your project..."
                          rows={4}
                          value={formData.projectDescription || ""}
                          onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label>Technical Disciplines</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                          {disciplines.map((discipline) => (
                            <div key={discipline} className="flex items-center space-x-2">
                              <Checkbox
                                id={discipline}
                                checked={selectedDisciplines.includes(discipline)}
                                onCheckedChange={() => handleDisciplineToggle(discipline)}
                              />
                              <Label htmlFor={discipline} className="text-sm">
                                {discipline}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Project Requirements</Label>
                        <div className="flex space-x-2 mt-2">
                          <Input
                            placeholder="Add a requirement..."
                            value={newRequirement}
                            onChange={(e) => setNewRequirement(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addRequirement()}
                          />
                          <Button onClick={addRequirement}>Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {requirements.map((req, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="cursor-pointer"
                              onClick={() => removeRequirement(index)}
                            >
                              {req} ×
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Compliance */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg">Compliance Settings</h3>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="makeInIndia"
                              checked={formData.makeInIndia || false}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, makeInIndia: checked as boolean })
                              }
                            />
                            <Label htmlFor="makeInIndia">Make in India Compliance</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="msmePreference"
                              checked={formData.msmePreference || false}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, msmePreference: checked as boolean })
                              }
                            />
                            <Label htmlFor="msmePreference">MSME Preference</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="bilingualContent"
                              checked={formData.bilingualContent || false}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, bilingualContent: checked as boolean })
                              }
                            />
                            <Label htmlFor="bilingualContent">Bilingual Content (Hindi/English)</Label>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="localContent">Local Content Requirement (%)</Label>
                          <Input
                            id="localContent"
                            type="number"
                            placeholder="60"
                            min="0"
                            max="100"
                            value={formData.localContent || 60}
                            onChange={(e) =>
                              setFormData({ ...formData, localContent: Number.parseInt(e.target.value) })
                            }
                          />
                          <p className="text-sm text-gray-600 mt-1">
                            Minimum local content as per Make in India guidelines
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-semibold text-lg mb-4">Automatic Compliance Features</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            "GFR 2017 Guidelines",
                            "CVC Compliance",
                            "Digital India",
                            "Atmanirbhar Bharat",
                            "IS Codes Integration",
                            "BIS Certification",
                          ].map((feature) => (
                            <div key={feature} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Generated RFP */}
                  {currentStep === 4 && generatedRFP && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">RFP Generated Successfully!</h3>
                          <p className="text-gray-600">
                            {generatedRFP.metadata.wordCount} words • Generated on{" "}
                            {new Date(generatedRFP.metadata.generatedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" onClick={copyToClipboard}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button variant="outline" onClick={() => downloadRFP("txt")}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                          {generatedRFP.rfpText}
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep < 3 && (
                    <Button onClick={handleNext}>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}

                  {currentStep === 3 && (
                    <Button
                      onClick={generateRFP}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Generate RFP
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg">Generation Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className={`flex items-center space-x-3 ${currentStep >= 1 ? "text-blue-600" : "text-gray-400"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-blue-100" : "bg-gray-100"}`}
                    >
                      {currentStep > 1 ? <CheckCircle className="h-5 w-5" /> : "1"}
                    </div>
                    <span>Project Basics</span>
                  </div>
                  <div
                    className={`flex items-center space-x-3 ${currentStep >= 2 ? "text-blue-600" : "text-gray-400"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-blue-100" : "bg-gray-100"}`}
                    >
                      {currentStep > 2 ? <CheckCircle className="h-5 w-5" /> : "2"}
                    </div>
                    <span>Project Details</span>
                  </div>
                  <div
                    className={`flex items-center space-x-3 ${currentStep >= 3 ? "text-blue-600" : "text-gray-400"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-blue-100" : "bg-gray-100"}`}
                    >
                      {currentStep > 3 ? <CheckCircle className="h-5 w-5" /> : "3"}
                    </div>
                    <span>Compliance</span>
                  </div>
                  <div
                    className={`flex items-center space-x-3 ${currentStep >= 4 ? "text-blue-600" : "text-gray-400"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 4 ? "bg-blue-100" : "bg-gray-100"}`}
                    >
                      {currentStep >= 4 ? <CheckCircle className="h-5 w-5" /> : "4"}
                    </div>
                    <span>Generated RFP</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg">Compliance Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    "GFR 2017 Guidelines",
                    "CVC Compliance",
                    "Make in India",
                    "Digital India",
                    "MSME Preferences",
                    "Bilingual Support",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
