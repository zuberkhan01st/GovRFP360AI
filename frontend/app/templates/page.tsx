"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, ArrowLeft, Search, Download, Eye, Star } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const templates = [
  {
    id: 1,
    name: "Environmental Monitoring System",
    industry: "Environmental",
    type: "Infrastructure Development",
    description:
      "Comprehensive template for environmental monitoring and data collection systems with IoT integration.",
    budget: "₹50-100 Crores",
    timeline: "24-36 months",
    features: ["Real-time Monitoring", "Data Analytics", "IoT Integration", "Compliance Reporting"],
    rating: 4.8,
    downloads: 245,
    preview:
      "Complete RFP template for environmental monitoring projects including technical specifications, compliance requirements, and evaluation criteria.",
  },
  {
    id: 2,
    name: "Smart City Infrastructure",
    industry: "Infrastructure",
    type: "Development",
    description: "Template for smart city development projects including digital infrastructure and citizen services.",
    budget: "₹200-500 Crores",
    timeline: "48-60 months",
    features: ["Digital Infrastructure", "Citizen Services", "Traffic Management", "Energy Efficiency"],
    rating: 4.9,
    downloads: 189,
    preview:
      "Comprehensive smart city RFP template covering all aspects of urban digital transformation and infrastructure development.",
  },
  {
    id: 3,
    name: "Healthcare Management System",
    industry: "Healthcare",
    type: "Technology",
    description: "Digital healthcare platform template for government hospitals and medical institutions.",
    budget: "₹25-75 Crores",
    timeline: "18-30 months",
    features: ["Patient Management", "Digital Records", "Telemedicine", "Analytics Dashboard"],
    rating: 4.7,
    downloads: 156,
    preview:
      "Healthcare digitization RFP template with focus on patient care, data security, and regulatory compliance.",
  },
  {
    id: 4,
    name: "Educational Technology Platform",
    industry: "Education",
    type: "Technology",
    description: "E-learning platform template for government educational institutions and skill development.",
    budget: "₹15-40 Crores",
    timeline: "12-24 months",
    features: ["Online Learning", "Assessment Tools", "Content Management", "Mobile Access"],
    rating: 4.6,
    downloads: 203,
    preview:
      "Educational technology RFP template for digital learning platforms with multilingual support and accessibility features.",
  },
  {
    id: 5,
    name: "Cybersecurity Framework",
    industry: "Technology",
    type: "Security",
    description: "Comprehensive cybersecurity implementation template for government agencies and departments.",
    budget: "₹30-80 Crores",
    timeline: "24-36 months",
    features: ["Threat Detection", "Incident Response", "Compliance Monitoring", "Security Training"],
    rating: 4.9,
    downloads: 134,
    preview:
      "Cybersecurity RFP template covering threat assessment, security implementation, and compliance requirements.",
  },
  {
    id: 6,
    name: "Transportation Management",
    industry: "Transportation",
    type: "Infrastructure",
    description: "Public transportation system template including fleet management and passenger services.",
    budget: "₹100-300 Crores",
    timeline: "36-48 months",
    features: ["Fleet Management", "Route Optimization", "Passenger Information", "Payment Systems"],
    rating: 4.5,
    downloads: 98,
    preview: "Transportation system RFP template for public transit modernization and smart mobility solutions.",
  },
]

const industries = ["All", "Environmental", "Infrastructure", "Technology", "Healthcare", "Education", "Transportation"]
const types = ["All", "Development", "Infrastructure", "Technology", "Security", "Modernization"]

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("All")
  const [selectedType, setSelectedType] = useState("All")
  const [selectedTemplate, setSelectedTemplate] = useState<(typeof templates)[0] | null>(null)

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesIndustry = selectedIndustry === "All" || template.industry === selectedIndustry
    const matchesType = selectedType === "All" || template.type === selectedType

    return matchesSearch && matchesIndustry && matchesType
  })

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
                <p className="text-sm text-gray-600">Template Library</p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">RFP Template Library</h2>
          <p className="text-lg text-gray-600">
            Choose from professionally crafted, government-compliant RFP templates
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow border-0 shadow-md cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{template.name}</CardTitle>
                      <div className="flex gap-2 mb-3">
                        <Badge variant="secondary">{template.industry}</Badge>
                        <Badge variant="outline">{template.type}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{template.rating}</span>
                    </div>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Budget:</span>
                      <p className="text-gray-600">{template.budget}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Timeline:</span>
                      <p className="text-gray-600">{template.timeline}</p>
                    </div>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700 text-sm">Key Features:</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.features.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {template.features.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-gray-600">{template.downloads} downloads</span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedTemplate(template)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Link href={`/generate?template=${template.id}`}>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Download className="h-4 w-4 mr-1" />
                          Use
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        )}

        {/* Template Preview Modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{selectedTemplate.name}</h3>
                  <Button variant="ghost" onClick={() => setSelectedTemplate(null)}>
                    ×
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Badge>{selectedTemplate.industry}</Badge>
                    <Badge variant="outline">{selectedTemplate.type}</Badge>
                    <div className="flex items-center space-x-1 ml-auto">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{selectedTemplate.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-600">{selectedTemplate.description}</p>

                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">Budget Range:</span>
                      <p>{selectedTemplate.budget}</p>
                    </div>
                    <div>
                      <span className="font-medium">Timeline:</span>
                      <p>{selectedTemplate.timeline}</p>
                    </div>
                  </div>

                  <div>
                    <span className="font-medium">Features Included:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTemplate.features.map((feature) => (
                        <Badge key={feature} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Template Preview:</h4>
                    <p className="text-sm text-gray-700">{selectedTemplate.preview}</p>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                      Close
                    </Button>
                    <Link href={`/generate?template=${selectedTemplate.id}`}>
                      <Button className="bg-blue-600 hover:bg-blue-700">Use This Template</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
