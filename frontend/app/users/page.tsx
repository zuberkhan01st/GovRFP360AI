"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, FileCheck, GraduationCap, Calculator, ClipboardList, Shield, Building, Award, User, Mail, Phone, Upload, Send } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

const submissionTypes = [
  {
    icon: <FileText className="h-8 w-8" />,
    title: "Technical Proposals",
    description: "Detailed technical specifications, methodologies, and implementation plans for the proposed solution.",
    items: [
      "Technical specifications and requirements",
      "Implementation methodology",
      "Project timeline and milestones",
      "Technical team structure",
      "Quality assurance procedures"
    ]
  },
  {
    icon: <Calculator className="h-8 w-8" />,
    title: "Financial Proposals",
    description: "Comprehensive cost breakdown, pricing structure, and financial terms of the proposal.",
    items: [
      "Detailed cost breakdown",
      "Pricing structure and terms",
      "Payment schedule",
      "Financial projections",
      "Budget allocation"
    ]
  },
  {
    icon: <ClipboardList className="h-8 w-8" />,
    title: "Project Approach",
    description: "Strategic approach, methodology, and execution plan for delivering the project successfully.",
    items: [
      "Project methodology",
      "Risk management strategy",
      "Resource allocation plan",
      "Communication protocols",
      "Change management approach"
    ]
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Compliance Statements",
    description: "Statements ensuring adherence to all applicable regulations, standards, and requirements.",
    items: [
      "Regulatory compliance statements",
      "Quality standards adherence",
      "Environmental compliance",
      "Safety and security protocols",
      "Legal and ethical commitments"
    ]
  }
]

const supportingDocuments = [
  {
    icon: <GraduationCap className="h-8 w-8" />,
    title: "Experience Certificates",
    description: "Certificates and documentation proving relevant experience in similar projects."
  },
  {
    icon: <Building className="h-8 w-8" />,
    title: "Company Registration",
    description: "Legal registration documents and business licenses."
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: "Quality Certifications",
    description: "ISO certifications, quality management system documents."
  },
  {
    icon: <FileCheck className="h-8 w-8" />,
    title: "Financial Statements",
    description: "Audited financial statements, bank references, and financial stability proof."
  }
]

export default function UsersPage() {
  const [showForm, setShowForm] = useState(false)
  const [showSubmissions, setShowSubmissions] = useState(false)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    proposalType: "",
    technicalProposal: "",
    financialProposal: "",
    projectApproach: "",
    complianceStatements: "",
    experienceCertificates: "",
    companyRegistration: "",
    qualityCertifications: "",
    financialStatements: "",
    additionalNotes: ""
  })

    // Dynamic placeholders and headings based on proposal type
  const getDynamicContent = (proposalType?: string) => {
    const type = proposalType || formData.proposalType
    switch (type) {
      case 'Infrastructure':
        return {
          technicalProposal: {
            heading: "Infrastructure Design & Specifications",
            placeholder: "Describe your infrastructure design, construction methodology, and technical specifications..."
          },
          financialProposal: {
            heading: "Cost Breakdown & Budget",
            placeholder: "Provide detailed cost breakdown for materials, labor, and infrastructure components..."
          },
          projectApproach: {
            heading: "Construction & Project Management",
            placeholder: "Describe your construction timeline, resource allocation, and project management strategy..."
          },
          complianceStatements: {
            heading: "Building Codes & Safety Compliance",
            placeholder: "Provide compliance statements for building codes, safety standards, and environmental regulations..."
          }
        }
      case 'Software':
        return {
          technicalProposal: {
            heading: "Software Architecture & Technology",
            placeholder: "Describe your software architecture, technology stack, and development methodology..."
          },
          financialProposal: {
            heading: "Development Cost & Licensing",
            placeholder: "Provide detailed cost breakdown for development phases, licensing, and maintenance..."
          },
          projectApproach: {
            heading: "Agile Development & QA Strategy",
            placeholder: "Describe your agile methodology, sprint planning, and quality assurance strategy..."
          },
          complianceStatements: {
            heading: "Data Security & Privacy Compliance",
            placeholder: "Provide compliance statements for data security, privacy regulations, and industry standards..."
          }
        }
      case 'Consulting':
        return {
          technicalProposal: {
            heading: "Consulting Approach & Expertise",
            placeholder: "Describe your consulting approach, expertise areas, and service delivery methodology..."
          },
          financialProposal: {
            heading: "Consulting Fees & Deliverables",
            placeholder: "Provide detailed cost breakdown for consulting hours, deliverables, and project phases..."
          },
          projectApproach: {
            heading: "Consulting Methodology & Engagement",
            placeholder: "Describe your consulting methodology, stakeholder engagement, and knowledge transfer strategy..."
          },
          complianceStatements: {
            heading: "Professional Standards & Ethics",
            placeholder: "Provide compliance statements for professional standards, confidentiality, and ethical guidelines..."
          }
        }
      case 'Training':
        return {
          technicalProposal: {
            heading: "Training Curriculum & Delivery",
            placeholder: "Describe your training curriculum, delivery methods, and learning objectives..."
          },
          financialProposal: {
            heading: "Training Costs & Materials",
            placeholder: "Provide detailed cost breakdown for training materials, instructor costs, and venue expenses..."
          },
          projectApproach: {
            heading: "Training Methodology & Assessment",
            placeholder: "Describe your training methodology, assessment strategy, and capacity building approach..."
          },
          complianceStatements: {
            heading: "Educational Standards & Certification",
            placeholder: "Provide compliance statements for educational standards, certification requirements, and quality assurance..."
          }
        }
      case 'Maintenance':
        return {
          technicalProposal: {
            heading: "Maintenance Approach & Service Levels",
            placeholder: "Describe your maintenance approach, service levels, and technical support methodology..."
          },
          financialProposal: {
            heading: "Maintenance Contracts & Costs",
            placeholder: "Provide detailed cost breakdown for maintenance contracts, spare parts, and service hours..."
          },
          projectApproach: {
            heading: "Maintenance Strategy & Response",
            placeholder: "Describe your maintenance methodology, response time strategy, and preventive maintenance approach..."
          },
          complianceStatements: {
            heading: "Service Level Agreements & Safety",
            placeholder: "Provide compliance statements for service level agreements, safety protocols, and regulatory requirements..."
          }
        }
      case 'Research':
        return {
          technicalProposal: {
            heading: "Research Methodology & Innovation",
            placeholder: "Describe your research methodology, innovation approach, and technical feasibility..."
          },
          financialProposal: {
            heading: "Research Funding & Equipment",
            placeholder: "Provide detailed cost breakdown for research phases, equipment, and personnel costs..."
          },
          projectApproach: {
            heading: "Research Strategy & Collaboration",
            placeholder: "Describe your research methodology, collaboration strategy, and knowledge dissemination approach..."
          },
          complianceStatements: {
            heading: "Research Ethics & Intellectual Property",
            placeholder: "Provide compliance statements for research ethics, intellectual property, and academic standards..."
          }
        }
      case 'Technical':
        return {
          technicalProposal: {
            heading: "Technical Approach & Implementation",
            placeholder: "Describe your technical approach, methodology, and implementation plan..."
          },
          financialProposal: {
            heading: "Cost Structure & Financial Terms",
            placeholder: "Provide detailed cost breakdown, pricing structure, and financial terms..."
          },
          projectApproach: {
            heading: "Project Methodology & Risk Management",
            placeholder: "Describe your project methodology, risk management, and execution strategy..."
          },
          complianceStatements: {
            heading: "Regulatory Compliance & Standards",
            placeholder: "Provide compliance statements for regulations, quality standards, and requirements..."
          }
        }
      case 'Financial':
        return {
          technicalProposal: {
            heading: "Technical Approach & Implementation",
            placeholder: "Describe your technical approach, methodology, and implementation plan..."
          },
          financialProposal: {
            heading: "Cost Structure & Financial Terms",
            placeholder: "Provide detailed cost breakdown, pricing structure, and financial terms..."
          },
          projectApproach: {
            heading: "Project Methodology & Risk Management",
            placeholder: "Describe your project methodology, risk management, and execution strategy..."
          },
          complianceStatements: {
            heading: "Regulatory Compliance & Standards",
            placeholder: "Provide compliance statements for regulations, quality standards, and requirements..."
          }
        }
      default:
        return {
          technicalProposal: {
            heading: "Technical Approach & Implementation",
            placeholder: "Describe your technical approach, methodology, and implementation plan..."
          },
          financialProposal: {
            heading: "Cost Structure & Financial Terms",
            placeholder: "Provide detailed cost breakdown, pricing structure, and financial terms..."
          },
          projectApproach: {
            heading: "Project Methodology & Risk Management",
            placeholder: "Describe your project methodology, risk management, and execution strategy..."
          },
          complianceStatements: {
            heading: "Regulatory Compliance & Standards",
            placeholder: "Provide compliance statements for regulations, quality standards, and requirements..."
          }
        }
    }
  }

  const [uploadedFiles, setUploadedFiles] = useState<{
    experienceCertificates: File | null;
    companyRegistration: File | null;
    qualityCertifications: File | null;
    financialStatements: File | null;
  }>({
    experienceCertificates: null,
    companyRegistration: null,
    qualityCertifications: null,
    financialStatements: null
  })

  // Load submissions from localStorage on component mount
  useEffect(() => {
    const savedSubmissions = localStorage.getItem('userSubmissions')
    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions))
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create new submission with timestamp and ID
    const newSubmission = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: "Submitted",
      ...formData
    }
    
    // Add to submissions array
    const updatedSubmissions = [newSubmission, ...submissions]
    setSubmissions(updatedSubmissions)
    
    // Save to localStorage
    localStorage.setItem('userSubmissions', JSON.stringify(updatedSubmissions))
    
    // Reset form and close dialog
    setShowForm(false)
    setFormData({
      name: "", email: "", phone: "", company: "", proposalType: "",
      technicalProposal: "", financialProposal: "", projectApproach: "",
      complianceStatements: "", experienceCertificates: "", companyRegistration: "",
      qualityCertifications: "", financialStatements: "", additionalNotes: ""
    })
    setUploadedFiles({
      experienceCertificates: null,
      companyRegistration: null,
      qualityCertifications: null,
      financialStatements: null
    })
    
    // Show submissions view
    setShowSubmissions(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (field: keyof typeof uploadedFiles, file: File | null) => {
    setUploadedFiles(prev => ({ ...prev, [field]: file }))
    if (file) {
      setFormData(prev => ({ ...prev, [field]: `File uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)` }))
    } else {
      setFormData(prev => ({ ...prev, [field]: "" }))
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf': return '📄'
      case 'doc': case 'docx': return '📝'
      case 'xls': case 'xlsx': return '📊'
      case 'jpg': case 'jpeg': case 'png': return '🖼️'
      default: return '📎'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GovRFP360AI</h1>
                <p className="text-sm text-gray-600">Government RFP Solutions</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/generate" className="text-gray-700 hover:text-blue-600 transition-colors">
                Generate RFP
              </a>
              <a href="/compliance" className="text-gray-700 hover:text-blue-600 transition-colors">
                Compliance Check
              </a>
              <a href="/templates" className="text-gray-700 hover:text-blue-600 transition-colors">
                Templates
              </a>
              <a href="/users" className="text-gray-700 hover:text-blue-600 transition-colors font-semibold">
                Users
              </a>
              <a href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors">
                Admin
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
            User Submissions
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Submit Your Proposal
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Submissions generally include technical and financial proposals, project approach, compliance statements, 
            and supporting documents such as experience certificates and financials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setShowForm(true)} 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg"
            >
              <Send className="mr-2 h-5 w-5" />
              Submit Your Proposal
            </Button>
            {submissions.length > 0 && (
              <Button 
                onClick={() => setShowSubmissions(true)} 
                size="lg" 
                variant="outline"
                className="px-8 py-3 text-lg border-2"
              >
                <FileText className="mr-2 h-5 w-5" />
                View My Submissions ({submissions.length})
              </Button>
            )}
          </div>
        </div>

        {/* Main Submission Components */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Required Submission Components</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {submissionTypes.map((type, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-3 rounded-lg text-blue-600">
                      {type.icon}
                    </div>
                    <CardTitle className="text-xl text-gray-900">{type.title}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600 text-base">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {type.items.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Supporting Documents */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Supporting Documents Required</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportingDocuments.map((doc, index) => (
              <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow border-0 text-center">
                <CardHeader>
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 text-green-600">
                    {doc.icon}
                  </div>
                  <CardTitle className="text-lg text-gray-900">{doc.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {doc.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Submission Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Submit Your Proposal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Full Name *"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Email Address *"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Company Registration Number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                  <Input
                    placeholder="Company/Organization Name *"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    required
                  />
                  <select
                    className="w-full border rounded-md p-3"
                    value={formData.proposalType}
                    onChange={(e) => handleInputChange("proposalType", e.target.value)}
                    required
                  >
                    <option value="">Select Proposal Type *</option>
                    <option value="Infrastructure">Infrastructure Development</option>
                    <option value="Software">Software Development</option>
                    <option value="Consulting">Consulting Services</option>
                    <option value="Training">Training & Capacity Building</option>
                    <option value="Maintenance">Maintenance & Support</option>
                    <option value="Research">Research & Development</option>
                    <option value="Technical">Technical Proposal</option>
                    <option value="Financial">Financial Proposal</option>
                  </select>
                </CardContent>
              </Card>

              {/* Dynamic Proposal Fields Based on Type */}
              {formData.proposalType && (
                <>
                  {/* Technical Proposal - Show for all types except pure Financial */}
                  {formData.proposalType !== 'Financial' && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <FileText className="mr-2 h-5 w-5" />
                          {getDynamicContent().technicalProposal.heading}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder={getDynamicContent().technicalProposal.placeholder}
                          value={formData.technicalProposal}
                          onChange={(e) => handleInputChange("technicalProposal", e.target.value)}
                          rows={4}
                        />
                      </CardContent>
                    </Card>
                  )}

                  {/* Financial Proposal - Show for all types except pure Technical */}
                  {formData.proposalType !== 'Technical' && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Calculator className="mr-2 h-5 w-5" />
                          {getDynamicContent().financialProposal.heading}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder={getDynamicContent().financialProposal.placeholder}
                          value={formData.financialProposal}
                          onChange={(e) => handleInputChange("financialProposal", e.target.value)}
                          rows={4}
                        />
                      </CardContent>
                    </Card>
                  )}

                  {/* Project Approach - Show for all types */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <ClipboardList className="mr-2 h-5 w-5" />
                        {getDynamicContent().projectApproach.heading}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder={getDynamicContent().projectApproach.placeholder}
                        value={formData.projectApproach}
                        onChange={(e) => handleInputChange("projectApproach", e.target.value)}
                        rows={4}
                      />
                    </CardContent>
                  </Card>

                  {/* Compliance Statements - Show for all types */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="mr-2 h-5 w-5" />
                        {getDynamicContent().complianceStatements.heading}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder={getDynamicContent().complianceStatements.placeholder}
                        value={formData.complianceStatements}
                        onChange={(e) => handleInputChange("complianceStatements", e.target.value)}
                        rows={4}
                      />
                    </CardContent>
                  </Card>
                </>
              )}

                             {/* Supporting Documents */}
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center">
                     <Upload className="mr-2 h-5 w-5" />
                     Supporting Documents
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-6">
                   <div>
                     <label className="block text-sm font-medium mb-2">Experience Certificates</label>
                     <div className="space-y-2">
                       <Input
                         placeholder="Describe your experience certificates (optional)"
                         value={formData.experienceCertificates}
                         onChange={(e) => handleInputChange("experienceCertificates", e.target.value)}
                       />
                       <div className="flex items-center space-x-2">
                         <Input
                           type="file"
                           accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                           onChange={(e) => handleFileUpload("experienceCertificates", e.target.files?.[0] || null)}
                           className="flex-1"
                         />
                         {uploadedFiles.experienceCertificates && (
                           <div className="flex items-center space-x-2 text-sm text-green-600">
                             <span>{getFileIcon(uploadedFiles.experienceCertificates.name)}</span>
                             <span>{uploadedFiles.experienceCertificates.name}</span>
                             <Button
                               type="button"
                               variant="ghost"
                               size="sm"
                               onClick={() => handleFileUpload("experienceCertificates", null)}
                               className="text-red-600 hover:text-red-700"
                             >
                               ✕
                             </Button>
                           </div>
                         )}
                       </div>
                     </div>
                   </div>

                   <div>
                     <label className="block text-sm font-medium mb-2">Company Registration</label>
                     <div className="space-y-2">
                       <Input
                         placeholder="Describe your company registration (optional)"
                         value={formData.companyRegistration}
                         onChange={(e) => handleInputChange("companyRegistration", e.target.value)}
                       />
                       <div className="flex items-center space-x-2">
                         <Input
                           type="file"
                           accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                           onChange={(e) => handleFileUpload("companyRegistration", e.target.files?.[0] || null)}
                           className="flex-1"
                         />
                         {uploadedFiles.companyRegistration && (
                           <div className="flex items-center space-x-2 text-sm text-green-600">
                             <span>{getFileIcon(uploadedFiles.companyRegistration.name)}</span>
                             <span>{uploadedFiles.companyRegistration.name}</span>
                             <Button
                               type="button"
                               variant="ghost"
                               size="sm"
                               onClick={() => handleFileUpload("companyRegistration", null)}
                               className="text-red-600 hover:text-red-700"
                             >
                               ✕
                             </Button>
                           </div>
                         )}
                       </div>
                     </div>
                   </div>

                   <div>
                     <label className="block text-sm font-medium mb-2">Quality Certifications</label>
                     <div className="space-y-2">
                       <Input
                         placeholder="Describe your quality certifications (ISO, etc.) (optional)"
                         value={formData.qualityCertifications}
                         onChange={(e) => handleInputChange("qualityCertifications", e.target.value)}
                       />
                       <div className="flex items-center space-x-2">
                         <Input
                           type="file"
                           accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                           onChange={(e) => handleFileUpload("qualityCertifications", e.target.files?.[0] || null)}
                           className="flex-1"
                         />
                         {uploadedFiles.qualityCertifications && (
                           <div className="flex items-center space-x-2 text-sm text-green-600">
                             <span>{getFileIcon(uploadedFiles.qualityCertifications.name)}</span>
                             <span>{uploadedFiles.qualityCertifications.name}</span>
                             <Button
                               type="button"
                               variant="ghost"
                               size="sm"
                               onClick={() => handleFileUpload("qualityCertifications", null)}
                               className="text-red-600 hover:text-red-700"
                             >
                               ✕
                             </Button>
                           </div>
                         )}
                       </div>
                     </div>
                   </div>

                   <div>
                     <label className="block text-sm font-medium mb-2">Financial Statements</label>
                     <div className="space-y-2">
                       <Input
                         placeholder="Describe your financial statements (optional)"
                         value={formData.financialStatements}
                         onChange={(e) => handleInputChange("financialStatements", e.target.value)}
                       />
                       <div className="flex items-center space-x-2">
                         <Input
                           type="file"
                           accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                           onChange={(e) => handleFileUpload("financialStatements", e.target.files?.[0] || null)}
                           className="flex-1"
                         />
                         {uploadedFiles.financialStatements && (
                           <div className="flex items-center space-x-2 text-sm text-green-600">
                             <span>{getFileIcon(uploadedFiles.financialStatements.name)}</span>
                             <span>{uploadedFiles.financialStatements.name}</span>
                             <Button
                               type="button"
                               variant="ghost"
                               size="sm"
                               onClick={() => handleFileUpload("financialStatements", null)}
                               className="text-red-600 hover:text-red-700"
                             >
                               ✕
                             </Button>
                           </div>
                         )}
                       </div>
                     </div>
                   </div>

                   <div className="bg-blue-50 p-3 rounded-lg">
                     <p className="text-sm text-blue-800">
                       <strong>Accepted file types:</strong> PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG
                     </p>
                     <p className="text-sm text-blue-700 mt-1">
                       Maximum file size: 10MB per file
                     </p>
                   </div>
                 </CardContent>
               </Card>

              {/* Additional Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Any additional information or special requirements..."
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                    rows={3}
                  />
                </CardContent>
              </Card>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Send className="mr-2 h-4 w-4" />
                  Submit Proposal
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
                 </Dialog>

         {/* Submissions Display Dialog */}
         <Dialog open={showSubmissions} onOpenChange={setShowSubmissions}>
           <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
             <DialogHeader>
               <DialogTitle className="text-2xl font-bold flex items-center">
                 <FileText className="mr-2 h-6 w-6" />
                 My Submissions ({submissions.length})
               </DialogTitle>
             </DialogHeader>
             
             {submissions.length === 0 ? (
               <div className="text-center py-12">
                 <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                 <h3 className="text-lg font-semibold text-gray-900 mb-2">No Submissions Yet</h3>
                 <p className="text-gray-600 mb-4">Submit your first proposal to see it here.</p>
                 <Button onClick={() => { setShowSubmissions(false); setShowForm(true); }}>
                   Submit Your First Proposal
                 </Button>
               </div>
             ) : (
               <div className="space-y-6">
                 {submissions.map((submission, index) => (
                   <Card key={submission.id} className="bg-white shadow-md hover:shadow-lg transition-shadow">
                     <CardHeader>
                       <div className="flex items-center justify-between">
                         <div>
                           <CardTitle className="text-xl text-gray-900">
                             {submission.company} - {submission.proposalType} Proposal
                           </CardTitle>
                           <CardDescription className="text-gray-600">
                             Submitted by {submission.name} on {new Date(submission.timestamp).toLocaleDateString()}
                           </CardDescription>
                         </div>
                         <div className="flex items-center space-x-2">
                           <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                             {submission.status}
                           </Badge>
                           <span className="text-sm text-gray-500">#{submission.id}</span>
                         </div>
                       </div>
                     </CardHeader>
                     <CardContent className="space-y-4">
                       {/* Basic Info */}
                       <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                         <div>
                           <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                           <p className="text-sm text-gray-600">Name: {submission.name}</p>
                           <p className="text-sm text-gray-600">Email: {submission.email}</p>
                           <p className="text-sm text-gray-600">Company Registration Number: {submission.phone || 'Not provided'}</p>
                           <p className="text-sm text-gray-600">Company: {submission.company}</p>
                         </div>
                         <div>
                           <h4 className="font-semibold text-gray-900 mb-2">Proposal Details</h4>
                           <p className="text-sm text-gray-600">Type: {submission.proposalType}</p>
                           <p className="text-sm text-gray-600">Status: {submission.status}</p>
                           <p className="text-sm text-gray-600">Submitted: {new Date(submission.timestamp).toLocaleString()}</p>
                         </div>
                       </div>

                       {/* Proposal Content */}
                       <div className="space-y-4">
                         {submission.technicalProposal && (
                           <div>
                             <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                               <FileText className="mr-2 h-4 w-4" />
                               {getDynamicContent(submission.proposalType).technicalProposal.heading}
                             </h4>
                             <div className="bg-blue-50 p-3 rounded-lg">
                               <p className="text-sm text-gray-700">{submission.technicalProposal}</p>
                             </div>
                           </div>
                         )}

                         {submission.financialProposal && (
                           <div>
                             <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                               <Calculator className="mr-2 h-4 w-4" />
                               {getDynamicContent(submission.proposalType).financialProposal.heading}
                             </h4>
                             <div className="bg-green-50 p-3 rounded-lg">
                               <p className="text-sm text-gray-700">{submission.financialProposal}</p>
                             </div>
                           </div>
                         )}

                         {submission.projectApproach && (
                           <div>
                             <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                               <ClipboardList className="mr-2 h-4 w-4" />
                               {getDynamicContent(submission.proposalType).projectApproach.heading}
                             </h4>
                             <div className="bg-purple-50 p-3 rounded-lg">
                               <p className="text-sm text-gray-700">{submission.projectApproach}</p>
                             </div>
                           </div>
                         )}

                         {submission.complianceStatements && (
                           <div>
                             <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                               <Shield className="mr-2 h-4 w-4" />
                               {getDynamicContent(submission.proposalType).complianceStatements.heading}
                             </h4>
                             <div className="bg-orange-50 p-3 rounded-lg">
                               <p className="text-sm text-gray-700">{submission.complianceStatements}</p>
                             </div>
                           </div>
                         )}

                         {/* Supporting Documents */}
                         {(submission.experienceCertificates || submission.companyRegistration || 
                           submission.qualityCertifications || submission.financialStatements) && (
                           <div>
                             <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                               <Upload className="mr-2 h-4 w-4" />
                               Supporting Documents
                             </h4>
                             <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                               {submission.experienceCertificates && (
                                 <p className="text-sm text-gray-700">
                                   <span className="font-medium">Experience Certificates:</span> {submission.experienceCertificates}
                                 </p>
                               )}
                               {submission.companyRegistration && (
                                 <p className="text-sm text-gray-700">
                                   <span className="font-medium">Company Registration:</span> {submission.companyRegistration}
                                 </p>
                               )}
                               {submission.qualityCertifications && (
                                 <p className="text-sm text-gray-700">
                                   <span className="font-medium">Quality Certifications:</span> {submission.qualityCertifications}
                                 </p>
                               )}
                               {submission.financialStatements && (
                                 <p className="text-sm text-gray-700">
                                   <span className="font-medium">Financial Statements:</span> {submission.financialStatements}
                                 </p>
                               )}
                             </div>
                           </div>
                         )}

                         {submission.additionalNotes && (
                           <div>
                             <h4 className="font-semibold text-gray-900 mb-2">Additional Notes</h4>
                             <div className="bg-yellow-50 p-3 rounded-lg">
                               <p className="text-sm text-gray-700">{submission.additionalNotes}</p>
                             </div>
                           </div>
                         )}
                       </div>
                     </CardContent>
                   </Card>
                 ))}
               </div>
             )}
             
             <DialogFooter>
               <Button variant="outline" onClick={() => setShowSubmissions(false)}>
                 Close
               </Button>
               {submissions.length > 0 && (
                 <Button 
                   onClick={() => {
                     setShowSubmissions(false)
                     setShowForm(true)
                   }}
                   className="bg-blue-600 hover:bg-blue-700"
                 >
                   <Send className="mr-2 h-4 w-4" />
                   Submit Another Proposal
                 </Button>
               )}
             </DialogFooter>
           </DialogContent>
         </Dialog>
       </div>
     </div>
   )
 }
