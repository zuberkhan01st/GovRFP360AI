"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Shield, Zap, CheckCircle, Globe, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const features = [
  {
    icon: <FileText className="h-8 w-8" />,
    title: "AI-Powered Generation",
    description: "Generate comprehensive, government-compliant RFP documents in minutes using advanced AI technology.",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Full Compliance",
    description: "Adheres to Indian Government Financial Rules (GFR) 2017, CVC guidelines, and regulatory standards.",
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Lightning Fast",
    description: "Generate 4,000-6,000 word professional RFPs in under 15 seconds with perfect formatting.",
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: "Bilingual Support",
    description: "Supports both English and Hindi content with proper government formatting and terminology.",
  },
]

const complianceFeatures = [
  "GFR 2017 Guidelines",
  "CVC Compliance",
  "Make in India",
  "Atmanirbhar Bharat",
  "Digital India",
  "MSME Preferences",
  "IS Codes Integration",
  "BIS Certification",
]

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

export default function HomePage() {
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
              <Link href="/generate" className="text-gray-700 hover:text-blue-600 transition-colors">
                Generate RFP
              </Link>
              <Link href="/compliance" className="text-gray-700 hover:text-blue-600 transition-colors">
                Compliance Check
              </Link>
              <Link href="/templates" className="text-gray-700 hover:text-blue-600 transition-colors">
                Templates
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered Government Solutions
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Generate Professional
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}
                Government RFPs
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Create comprehensive, compliant Indian Government Request for Proposal documents in minutes. Powered by
              advanced AI technology with full regulatory compliance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/generate">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg"
                >
                  Generate RFP Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/compliance">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-2 bg-transparent">
                  Check Compliance
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose GovRFP360AI?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for Indian Government procurement standards with cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardHeader className="text-center">
                    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">100% Government Compliance</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our AI system ensures complete adherence to all Indian Government procurement regulations, policies, and
                standards. Every generated RFP meets official requirements.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {complianceFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Supported Industries</h3>
              <div className="grid grid-cols-2 gap-3">
                {industries.map((industry, index) => (
                  <Badge key={index} variant="secondary" className="justify-center py-2 text-sm">
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">4,000+</div>
              <div className="text-gray-600">Words Generated</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">{"<15s"}</div>
              <div className="text-gray-600">Generation Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-gray-600">Compliance Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">8+</div>
              <div className="text-gray-600">Industries Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Generate Your First RFP?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join government agencies and contractors who trust GovRFP360AI for professional, compliant procurement
            documents.
          </p>
          <Link href="/generate">
            <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
              Start Generating Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">GovRFP360AI</span>
              </div>
              <p className="text-gray-400">
                AI-powered government RFP generation platform for Indian procurement standards.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>RFP Generation</li>
                <li>Compliance Check</li>
                <li>Document Templates</li>
                <li>Export Options</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Compliance</h4>
              <ul className="space-y-2 text-gray-400">
                <li>GFR 2017</li>
                <li>CVC Guidelines</li>
                <li>Make in India</li>
                <li>Digital India</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Training</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} GovRFP360AI. All rights reserved. Built for Indian Government Procurement.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
