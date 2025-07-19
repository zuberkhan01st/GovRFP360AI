"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Download, Eye, FileDiff, Calendar, FileText, FileSpreadsheet, Plus, Tag, MessageCircle, CheckCircle, XCircle, ArrowRightCircle, FileIcon, Users, ClipboardList, Settings, Bell, Search, Menu, User, Calculator, Shield, Upload } from "lucide-react"
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
  // Supporting documents fields
  experienceCertificates?: string
  companyRegistration?: string
  qualityCertifications?: string
  financialStatements?: string
  additionalNotes?: string
  // Proposal content fields
  technicalProposal?: string
  financialProposal?: string
  projectApproach?: string
  complianceStatements?: string
  // Additional proposal fields
  projectDuration?: string
  teamSize?: string
  location?: string
  contactPerson?: string
  phoneNumber?: string
  emailAddress?: string
  website?: string
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
  { id: "RFP-001", proposer: "Acme Corp", cost: 800000, compliancePenalties: 2, deliveryDelays: 1, deliveryStatus: "On Track", issues: 2, fileUrl: "/placeholder.pdf", version: 2, prevVersion: { cost: 850000, compliancePenalties: 3, deliveryDelays: 2, issues: 3, submissionDate: "2025-05-01" }, submissionDate: "2025-05-10", type: "Technical", status: "Pending Review", stage: 1, deadline: "2025-05-25", tags: ["Needs Legal Review"], comments: ["Check compliance section."], 
    technicalProposal: "Our technical approach focuses on implementing a robust system architecture with microservices design pattern. We will use modern technologies including React for frontend, Node.js for backend, and PostgreSQL for database management. The implementation will follow agile methodology with 2-week sprints.",
    financialProposal: "Total project cost: ₹8,00,000. Breakdown includes development (₹5,00,000), testing (₹1,50,000), deployment (₹75,000), and maintenance (₹75,000). Payment schedule: 30% upfront, 40% at milestone completion, 30% upon delivery.",
    projectApproach: "We will follow a phased approach: Phase 1 - Requirements gathering and design (4 weeks), Phase 2 - Development and testing (12 weeks), Phase 3 - Deployment and training (2 weeks). Risk management includes regular stakeholder communication and contingency planning.",
    complianceStatements: "We comply with all government regulations including Make in India policy, MSME guidelines, and data protection standards. Our quality management system is ISO 9001:2015 certified. We maintain strict security protocols for data handling.",
    projectDuration: "18 weeks", teamSize: "8 members", location: "Mumbai, Maharashtra", contactPerson: "John Smith", phoneNumber: "+91-9876543210", emailAddress: "john.smith@acmecorp.com", website: "www.acmecorp.com",
    experienceCertificates: "10+ years experience in government projects, ISO 9001:2015 certified", companyRegistration: "Registered under Companies Act 2013, GST registered", qualityCertifications: "ISO 9001:2015, ISO 27001:2013", financialStatements: "Audited financial statements for last 3 years available", additionalNotes: "Previous experience with similar government projects in healthcare sector"
  },
  { id: "RFP-002", proposer: "Beta Solutions", cost: 950000, compliancePenalties: 0, deliveryDelays: 0, deliveryStatus: "On Track", issues: 0, fileUrl: "/placeholder.pdf", version: 1, submissionDate: "2025-05-12", type: "Financial", status: "Reviewed", stage: 2, deadline: "2025-05-28", tags: [], comments: [], 
    technicalProposal: "Our financial management system will be built using secure cloud infrastructure with real-time data processing capabilities. We will implement advanced analytics and reporting features for comprehensive financial oversight.",
    financialProposal: "Total investment: ₹9,50,000. Cost structure: Software licensing (₹3,00,000), infrastructure setup (₹2,50,000), customization (₹2,00,000), training and support (₹2,00,000). ROI expected within 18 months.",
    projectApproach: "Implementation will be completed in 4 phases over 6 months. Each phase includes stakeholder training and system validation. We provide 24/7 support during transition period.",
    complianceStatements: "Full compliance with RBI guidelines, SEBI regulations, and government financial reporting standards. All data encryption and security protocols as per government requirements.",
    projectDuration: "6 months", teamSize: "6 members", location: "Delhi, NCR", contactPerson: "Priya Sharma", phoneNumber: "+91-8765432109", emailAddress: "priya.sharma@betasolutions.com", website: "www.betasolutions.com",
    experienceCertificates: "15+ years in financial technology sector", companyRegistration: "Private Limited Company, PAN registered", qualityCertifications: "ISO 27001:2013, PCI DSS compliant", financialStatements: "Annual turnover ₹50+ crores, profitable for last 5 years", additionalNotes: "Specialized in government financial systems"
  },
  { id: "RFP-003", proposer: "Gamma Pvt Ltd", cost: 700000, compliancePenalties: 3, deliveryDelays: 2, deliveryStatus: "Critical", issues: 3, fileUrl: "/placeholder.pdf", version: 3, prevVersion: { cost: 720000, compliancePenalties: 2, deliveryDelays: 1, issues: 2, submissionDate: "2025-05-05" }, submissionDate: "2025-05-15", type: "Infrastructure", status: "Approved", stage: 3, deadline: "2025-06-01", tags: ["Flagged for Delay"], comments: ["High risk of delay."],
    technicalProposal: "Infrastructure design includes modern data center setup with redundant power systems, cooling infrastructure, and network connectivity. We will implement modular design for scalability and future expansion.",
    financialProposal: "Infrastructure cost: ₹7,00,000. Breakdown: Hardware (₹4,00,000), networking (₹1,50,000), installation (₹75,000), testing (₹75,000). Additional maintenance contract: ₹50,000 annually.",
    projectApproach: "Construction timeline: 8 weeks. Week 1-2: Site preparation and foundation, Week 3-4: Core infrastructure installation, Week 5-6: Network setup and testing, Week 7-8: Final testing and handover.",
    complianceStatements: "Compliance with building codes, fire safety regulations, and electrical standards. All equipment meets government specifications and safety requirements.",
    projectDuration: "8 weeks", teamSize: "12 members", location: "Bangalore, Karnataka", contactPerson: "Rajesh Kumar", phoneNumber: "+91-7654321098", emailAddress: "rajesh.kumar@gammapvt.com", website: "www.gammapvt.com",
    experienceCertificates: "20+ years in infrastructure development", companyRegistration: "Infrastructure development license, GST registered", qualityCertifications: "ISO 14001:2015, OHSAS 18001", financialStatements: "Net worth ₹10+ crores, bank guarantee available", additionalNotes: "Specialized in government infrastructure projects"
  },
  { id: "RFP-004", proposer: "Delta Inc", cost: 850000, compliancePenalties: 1, deliveryDelays: 0, deliveryStatus: "On Track", issues: 1, fileUrl: "/placeholder.pdf", version: 1, submissionDate: "2025-05-18", type: "Software", status: "Awarded", stage: 4, deadline: "2025-06-05", tags: [], comments: [],
    technicalProposal: "Software architecture based on microservices with React frontend, Spring Boot backend, and MongoDB database. We will implement CI/CD pipeline with automated testing and deployment.",
    financialProposal: "Development cost: ₹8,50,000. Includes: Development (₹5,50,000), testing (₹1,50,000), deployment (₹1,00,000), documentation (₹50,000). Annual maintenance: ₹1,00,000.",
    projectApproach: "Agile development methodology with 2-week sprints. Daily standups, weekly demos, and monthly stakeholder reviews. Quality assurance integrated throughout development cycle.",
    complianceStatements: "Compliance with data protection regulations, accessibility standards, and government security protocols. All code follows industry best practices and security guidelines.",
    projectDuration: "16 weeks", teamSize: "10 members", location: "Hyderabad, Telangana", contactPerson: "Anita Patel", phoneNumber: "+91-6543210987", emailAddress: "anita.patel@deltainc.com", website: "www.deltainc.com",
    experienceCertificates: "12+ years in software development", companyRegistration: "Software development company, STPI registered", qualityCertifications: "CMMI Level 3, ISO 9001:2015", financialStatements: "Annual revenue ₹25+ crores, debt-free company", additionalNotes: "Expertise in government software solutions"
  },
  { id: "RFP-005", proposer: "Epsilon Ltd", cost: 900000, compliancePenalties: 2, deliveryDelays: 1, deliveryStatus: "Delayed", issues: 2, fileUrl: "/placeholder.pdf", version: 1, submissionDate: "2025-05-20", type: "Consulting", status: "Pending Review", stage: 1, deadline: "2025-06-10", tags: ["Needs Legal Review"], comments: [],
    technicalProposal: "Our consulting approach includes comprehensive analysis, strategic planning, and implementation support. We will provide expert guidance on process optimization and technology adoption.",
    financialProposal: "Consulting fees: ₹9,00,000. Breakdown: Analysis phase (₹2,00,000), strategy development (₹3,00,000), implementation support (₹3,00,000), follow-up (₹1,00,000).",
    projectApproach: "Three-phase methodology: Discovery and analysis (4 weeks), strategy development (6 weeks), implementation support (8 weeks). Regular stakeholder engagement and progress reporting.",
    complianceStatements: "Adherence to professional consulting standards, confidentiality agreements, and ethical guidelines. All consultants are certified professionals with relevant expertise.",
    projectDuration: "18 weeks", teamSize: "5 members", location: "Chennai, Tamil Nadu", contactPerson: "Dr. Meera Iyer", phoneNumber: "+91-5432109876", emailAddress: "meera.iyer@epsilonltd.com", website: "www.epsilonltd.com",
    experienceCertificates: "25+ years in management consulting", companyRegistration: "Management consulting firm, professional license", qualityCertifications: "ISO 9001:2015, professional certifications", financialStatements: "Consulting revenue ₹15+ crores annually", additionalNotes: "Specialized in government sector consulting"
  },
  { id: "RFP-006", proposer: "Zeta Group", cost: 780000, compliancePenalties: 0, deliveryDelays: 0, deliveryStatus: "On Track", issues: 0, fileUrl: "/placeholder.pdf", version: 1, submissionDate: "2025-05-22", type: "Training", status: "Reviewed", stage: 2, deadline: "2025-06-12", tags: [], comments: [],
    technicalProposal: "Comprehensive training program covering technical skills, soft skills, and industry best practices. We will use modern training methodologies including e-learning, workshops, and hands-on sessions.",
    financialProposal: "Training cost: ₹7,80,000. Includes: Curriculum development (₹2,00,000), training delivery (₹4,00,000), materials and resources (₹1,00,000), assessment and certification (₹80,000).",
    projectApproach: "Training delivery over 12 weeks with flexible scheduling. Assessment at each module completion. Certification upon successful completion of all modules.",
    complianceStatements: "Compliance with educational standards, certification requirements, and government training guidelines. All trainers are certified professionals with industry experience.",
    projectDuration: "12 weeks", teamSize: "8 members", location: "Pune, Maharashtra", contactPerson: "Vikram Singh", phoneNumber: "+91-4321098765", emailAddress: "vikram.singh@zetagroup.com", website: "www.zetagroup.com",
    experienceCertificates: "18+ years in corporate training", companyRegistration: "Training and development company", qualityCertifications: "ISO 29990:2010, training certifications", financialStatements: "Training revenue ₹12+ crores annually", additionalNotes: "Specialized in government employee training"
  },
  { id: "RFP-007", proposer: "Eta Solutions", cost: 820000, compliancePenalties: 1, deliveryDelays: 1, deliveryStatus: "Delayed", issues: 1, fileUrl: "/placeholder.pdf", version: 2, prevVersion: { cost: 830000, compliancePenalties: 2, deliveryDelays: 2, issues: 2, submissionDate: "2025-05-10" }, submissionDate: "2025-05-25", type: "Maintenance", status: "Pending Review", stage: 1, deadline: "2025-06-15", tags: [], comments: ["Check delivery timeline."],
    technicalProposal: "Comprehensive maintenance services including preventive maintenance, emergency repairs, and system optimization. We will provide 24/7 support with guaranteed response times.",
    financialProposal: "Maintenance contract: ₹8,20,000 annually. Includes: Preventive maintenance (₹4,00,000), emergency support (₹2,50,000), spare parts (₹1,20,000), system upgrades (₹50,000).",
    projectApproach: "Scheduled maintenance visits, real-time monitoring, and proactive issue resolution. Monthly performance reports and quarterly system health assessments.",
    complianceStatements: "Compliance with service level agreements, safety protocols, and government maintenance standards. All technicians are certified and experienced professionals.",
    projectDuration: "12 months", teamSize: "6 members", location: "Ahmedabad, Gujarat", contactPerson: "Sanjay Mehta", phoneNumber: "+91-3210987654", emailAddress: "sanjay.mehta@etasolutions.com", website: "www.etasolutions.com",
    experienceCertificates: "15+ years in system maintenance", companyRegistration: "Maintenance services company", qualityCertifications: "ISO 9001:2015, safety certifications", financialStatements: "Maintenance contracts worth ₹20+ crores", additionalNotes: "Specialized in government system maintenance"
  },
  { id: "RFP-008", proposer: "Theta Pvt Ltd", cost: 860000, compliancePenalties: 2, deliveryDelays: 0, deliveryStatus: "On Track", issues: 2, fileUrl: "/placeholder.pdf", version: 1, submissionDate: "2025-05-27", type: "Research", status: "Reviewed", stage: 2, deadline: "2025-06-18", tags: [], comments: [],
    technicalProposal: "Research methodology includes literature review, data collection, analysis, and validation. We will use advanced research tools and statistical methods for comprehensive analysis.",
    financialProposal: "Research funding: ₹8,60,000. Breakdown: Research activities (₹4,00,000), equipment and tools (₹2,00,000), data collection (₹1,50,000), analysis and reporting (₹1,10,000).",
    projectApproach: "Research timeline: 24 weeks. Phase 1: Literature review and methodology (6 weeks), Phase 2: Data collection (8 weeks), Phase 3: Analysis and validation (6 weeks), Phase 4: Reporting (4 weeks).",
    complianceStatements: "Compliance with research ethics, intellectual property rights, and government research guidelines. All research activities follow academic and professional standards.",
    projectDuration: "24 weeks", teamSize: "7 members", location: "Kolkata, West Bengal", contactPerson: "Dr. Arjun Das", phoneNumber: "+91-2109876543", emailAddress: "arjun.das@thetapvt.com", website: "www.thetapvt.com",
    experienceCertificates: "20+ years in research and development", companyRegistration: "Research and development company", qualityCertifications: "Research ethics certification, academic credentials", financialStatements: "Research grants worth ₹30+ crores", additionalNotes: "Specialized in government research projects"
  },
  { id: "RFP-009", proposer: "Iota Corp", cost: 910000, compliancePenalties: 3, deliveryDelays: 2, deliveryStatus: "Critical", issues: 3, fileUrl: "/placeholder.pdf", version: 1, submissionDate: "2025-05-29", type: "Infrastructure", status: "Approved", stage: 3, deadline: "2025-06-22", tags: ["Flagged for Delay"], comments: [],
    technicalProposal: "Advanced infrastructure design with smart building features, energy-efficient systems, and IoT integration. We will implement sustainable construction practices and green building standards.",
    financialProposal: "Infrastructure investment: ₹9,10,000. Includes: Smart systems (₹3,50,000), construction (₹3,00,000), IoT integration (₹1,50,000), testing and commissioning (₹1,10,000).",
    projectApproach: "Construction timeline: 10 weeks with parallel work streams. Weekly progress reviews and quality checks. Final commissioning and handover with comprehensive testing.",
    complianceStatements: "Compliance with green building standards, energy efficiency regulations, and government infrastructure guidelines. All systems meet international quality standards.",
    projectDuration: "10 weeks", teamSize: "15 members", location: "Jaipur, Rajasthan", contactPerson: "Ramesh Agarwal", phoneNumber: "+91-1098765432", emailAddress: "ramesh.agarwal@iotacorp.com", website: "www.iotacorp.com",
    experienceCertificates: "25+ years in smart infrastructure", companyRegistration: "Infrastructure development company", qualityCertifications: "LEED certification, ISO 14001:2015", financialStatements: "Infrastructure projects worth ₹50+ crores", additionalNotes: "Pioneer in smart city infrastructure"
  },
  { id: "RFP-010", proposer: "Kappa Ltd", cost: 870000, compliancePenalties: 1, deliveryDelays: 0, deliveryStatus: "On Track", issues: 1, fileUrl: "/placeholder.pdf", version: 1, submissionDate: "2025-06-01", type: "Software", status: "Awarded", stage: 4, deadline: "2025-06-25", tags: [], comments: [],
    technicalProposal: "Enterprise software solution with cloud-native architecture, AI/ML integration, and advanced analytics. We will use modern development practices and microservices architecture.",
    financialProposal: "Software development: ₹8,70,000. Breakdown: Development (₹5,20,000), AI/ML integration (₹1,80,000), testing (₹1,20,000), deployment (₹50,000). Annual licensing: ₹1,50,000.",
    projectApproach: "Agile development with 3-week sprints. Continuous integration and deployment. Regular stakeholder demos and feedback incorporation. Comprehensive testing and quality assurance.",
    complianceStatements: "Compliance with data protection regulations, AI ethics guidelines, and government software standards. All AI models are transparent and auditable.",
    projectDuration: "20 weeks", teamSize: "12 members", location: "Indore, Madhya Pradesh", contactPerson: "Neha Sharma", phoneNumber: "+91-0987654321", emailAddress: "neha.sharma@kappaltd.com", website: "www.kappaltd.com",
    experienceCertificates: "15+ years in enterprise software", companyRegistration: "Software development company", qualityCertifications: "CMMI Level 5, ISO 27001:2013", financialStatements: "Software revenue ₹40+ crores annually", additionalNotes: "Expertise in AI/ML solutions"
  },
  { id: "RFP-011", proposer: "Lambda Inc", cost: 920000, compliancePenalties: 2, deliveryDelays: 1, deliveryStatus: "Delayed", issues: 2, fileUrl: "/placeholder.pdf", version: 1, submissionDate: "2025-06-03", type: "Consulting", status: "Pending Review", stage: 1, deadline: "2025-06-28", tags: ["Needs Legal Review"], comments: [],
    technicalProposal: "Strategic consulting services focusing on digital transformation, process optimization, and organizational change management. We will provide end-to-end consulting support.",
    financialProposal: "Consulting investment: ₹9,20,000. Includes: Strategy development (₹3,50,000), implementation support (₹3,50,000), change management (₹1,50,000), follow-up (₹70,000).",
    projectApproach: "Four-phase approach: Assessment (4 weeks), strategy (6 weeks), implementation (10 weeks), optimization (4 weeks). Continuous stakeholder engagement and progress monitoring.",
    complianceStatements: "Adherence to professional consulting standards, confidentiality protocols, and government consulting guidelines. All consultants are certified professionals.",
    projectDuration: "24 weeks", teamSize: "6 members", location: "Lucknow, Uttar Pradesh", contactPerson: "Amit Kumar", phoneNumber: "+91-9876543211", emailAddress: "amit.kumar@lambdainc.com", website: "www.lambdainc.com",
    experienceCertificates: "22+ years in strategic consulting", companyRegistration: "Management consulting firm", qualityCertifications: "ISO 9001:2015, professional certifications", financialStatements: "Consulting revenue ₹35+ crores annually", additionalNotes: "Specialized in government digital transformation"
  },
  { id: "RFP-012", proposer: "Mu Group", cost: 790000, compliancePenalties: 0, deliveryDelays: 0, deliveryStatus: "On Track", issues: 0, fileUrl: "/placeholder.pdf", version: 1, submissionDate: "2025-06-05", type: "Training", status: "Reviewed", stage: 2, deadline: "2025-07-01", tags: [], comments: [],
    technicalProposal: "Comprehensive training program covering technical skills, leadership development, and industry-specific knowledge. We will use blended learning approach with online and offline sessions.",
    financialProposal: "Training investment: ₹7,90,000. Includes: Program development (₹2,50,000), delivery (₹3,50,000), materials (₹1,20,000), assessment (₹80,000).",
    projectApproach: "Training delivery over 16 weeks with flexible scheduling. Continuous assessment and feedback. Certification upon successful completion with industry recognition.",
    complianceStatements: "Compliance with educational standards, certification requirements, and government training protocols. All trainers are certified professionals with industry experience.",
    projectDuration: "16 weeks", teamSize: "10 members", location: "Bhopal, Madhya Pradesh", contactPerson: "Suresh Patel", phoneNumber: "+91-8765432110", emailAddress: "suresh.patel@mugroup.com", website: "www.mugroup.com",
    experienceCertificates: "20+ years in corporate training", companyRegistration: "Training and development company", qualityCertifications: "ISO 29990:2010, training certifications", financialStatements: "Training revenue ₹18+ crores annually", additionalNotes: "Specialized in government sector training"
  },
  { id: "RFP-013", proposer: "Nu Solutions", cost: 830000, compliancePenalties: 1, deliveryDelays: 1, deliveryStatus: "Delayed", issues: 1, fileUrl: "/placeholder.pdf", version: 2, prevVersion: { cost: 840000, compliancePenalties: 2, deliveryDelays: 2, issues: 2, submissionDate: "2025-05-20" }, submissionDate: "2025-06-08", type: "Maintenance", status: "Pending Review", stage: 1, deadline: "2025-07-03", tags: [], comments: ["Check delivery timeline."],
    technicalProposal: "Advanced maintenance services with predictive analytics, remote monitoring, and automated maintenance scheduling. We will provide comprehensive system health monitoring.",
    financialProposal: "Maintenance contract: ₹8,30,000 annually. Includes: Predictive maintenance (₹3,50,000), remote monitoring (₹2,00,000), emergency support (₹1,80,000), system optimization (₹1,00,000).",
    projectApproach: "Continuous monitoring with predictive maintenance alerts. Monthly system health reports and quarterly optimization reviews. 24/7 emergency support with guaranteed response times.",
    complianceStatements: "Compliance with service level agreements, safety standards, and government maintenance protocols. All systems meet industry standards and safety requirements.",
    projectDuration: "12 months", teamSize: "8 members", location: "Chandigarh, Punjab", contactPerson: "Gurpreet Singh", phoneNumber: "+91-7654321109", emailAddress: "gurpreet.singh@nusolutions.com", website: "www.nusolutions.com",
    experienceCertificates: "18+ years in system maintenance", companyRegistration: "Maintenance services company", qualityCertifications: "ISO 9001:2015, safety certifications", financialStatements: "Maintenance contracts worth ₹25+ crores", additionalNotes: "Specialized in predictive maintenance"
  },
  { id: "RFP-014", proposer: "Xi Pvt Ltd", cost: 870000, compliancePenalties: 2, deliveryDelays: 0, deliveryStatus: "On Track", issues: 2, fileUrl: "/placeholder.pdf", version: 1, submissionDate: "2025-06-10", type: "Research", status: "Reviewed", stage: 2, deadline: "2025-07-05", tags: [], comments: [],
    technicalProposal: "Comprehensive research methodology including quantitative and qualitative analysis, field studies, and data validation. We will use advanced research tools and statistical methods.",
    financialProposal: "Research funding: ₹8,70,000. Includes: Research activities (₹4,20,000), data collection (₹2,00,000), analysis tools (₹1,50,000), reporting and validation (₹1,00,000).",
    projectApproach: "Research timeline: 28 weeks. Phase 1: Literature review (6 weeks), Phase 2: Methodology design (4 weeks), Phase 3: Data collection (10 weeks), Phase 4: Analysis (6 weeks), Phase 5: Reporting (2 weeks).",
    complianceStatements: "Compliance with research ethics, data protection regulations, and government research guidelines. All research activities follow academic and professional standards.",
    projectDuration: "28 weeks", teamSize: "9 members", location: "Vadodara, Gujarat", contactPerson: "Dr. Priya Desai", phoneNumber: "+91-6543211098", emailAddress: "priya.desai@xipvt.com", website: "www.xipvt.com",
    experienceCertificates: "22+ years in research and development", companyRegistration: "Research and development company", qualityCertifications: "Research ethics certification, academic credentials", financialStatements: "Research grants worth ₹40+ crores", additionalNotes: "Specialized in government research projects"
  },
  { id: "RFP-015", proposer: "Omicron Corp", cost: 920000, compliancePenalties: 3, deliveryDelays: 2, deliveryStatus: "Critical", issues: 3, fileUrl: "/placeholder.pdf", version: 1, submissionDate: "2025-06-12", type: "Financial", status: "Approved", stage: 3, deadline: "2025-07-08", tags: ["Flagged for Delay"], comments: [],
    technicalProposal: "Advanced financial management system with real-time analytics, risk assessment, and compliance monitoring. We will implement secure financial data handling and reporting systems.",
    financialProposal: "Financial system investment: ₹9,20,000. Includes: System development (₹5,00,000), analytics integration (₹2,00,000), security implementation (₹1,50,000), training (₹70,000).",
    projectApproach: "Implementation over 6 months with phased rollout. Each phase includes user training and system validation. Continuous monitoring and optimization throughout implementation.",
    complianceStatements: "Compliance with RBI guidelines, SEBI regulations, and government financial reporting standards. All systems meet security and audit requirements.",
    projectDuration: "6 months", teamSize: "11 members", location: "Nagpur, Maharashtra", contactPerson: "Rajiv Verma", phoneNumber: "+91-5432110987", emailAddress: "rajiv.verma@omicroncorp.com", website: "www.omicroncorp.com",
    experienceCertificates: "18+ years in financial technology", companyRegistration: "Financial technology company", qualityCertifications: "ISO 27001:2013, PCI DSS compliant", financialStatements: "Annual revenue ₹60+ crores, profitable company", additionalNotes: "Specialized in government financial systems"
  }
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

// Function to get dynamic section analysis based on proposal type
const getDynamicSectionAnalysis = (proposalType: string): SectionAnalysis[] => {
  // Helper function to generate random score between 65-95
  const getRandomScore = () => Math.floor(Math.random() * 31) + 65; // 65 to 95

  switch (proposalType) {
    case 'Infrastructure':
      return [
        { section: 'Infrastructure Design & Specifications', score: getRandomScore(), issues: [] },
        { section: 'Cost & Budget Analysis', score: getRandomScore(), issues: [] },
        { section: 'Building Codes & Safety', score: getRandomScore(), issues: [] },
        { section: 'Construction Timeline', score: getRandomScore(), issues: [] },
        { section: 'Quality Assurance', score: getRandomScore(), issues: [] },
        { section: 'Construction Experience', score: getRandomScore(), issues: [] },
      ]
    case 'Software':
      return [
        { section: 'Software Architecture & Technology', score: getRandomScore(), issues: [] },
        { section: 'Development Cost & Licensing', score: getRandomScore(), issues: [] },
        { section: 'Data Security & Privacy', score: getRandomScore(), issues: [] },
        { section: 'Development Timeline', score: getRandomScore(), issues: [] },
        { section: 'Quality Assurance & Testing', score: getRandomScore(), issues: [] },
        { section: 'Development Experience', score: getRandomScore(), issues: [] },
      ]
    case 'Consulting':
      return [
        { section: 'Consulting Approach & Expertise', score: getRandomScore(), issues: [] },
        { section: 'Consulting Fees & Deliverables', score: getRandomScore(), issues: [] },
        { section: 'Professional Standards & Ethics', score: getRandomScore(), issues: [] },
        { section: 'Project Management', score: getRandomScore(), issues: [] },
        { section: 'Knowledge Transfer Strategy', score: getRandomScore(), issues: [] },
        { section: 'Consulting Experience', score: getRandomScore(), issues: [] },
      ]
    case 'Training':
      return [
        { section: 'Training Curriculum & Delivery', score: getRandomScore(), issues: [] },
        { section: 'Training Costs & Materials', score: getRandomScore(), issues: [] },
        { section: 'Educational Standards & Certification', score: getRandomScore(), issues: [] },
        { section: 'Training Timeline', score: getRandomScore(), issues: [] },
        { section: 'Quality Assurance & Assessment', score: getRandomScore(), issues: [] },
        { section: 'Training Experience', score: getRandomScore(), issues: [] },
      ]
    case 'Maintenance':
      return [
        { section: 'Maintenance Approach & Service Levels', score: getRandomScore(), issues: [] },
        { section: 'Maintenance Contracts & Costs', score: getRandomScore(), issues: [] },
        { section: 'Service Level Agreements & Safety', score: getRandomScore(), issues: [] },
        { section: 'Response Time Strategy', score: getRandomScore(), issues: [] },
        { section: 'Preventive Maintenance', score: getRandomScore(), issues: [] },
        { section: 'Maintenance Experience', score: getRandomScore(), issues: [] },
      ]
    case 'Research':
      return [
        { section: 'Research Methodology & Innovation', score: getRandomScore(), issues: [] },
        { section: 'Research Funding & Equipment', score: getRandomScore(), issues: [] },
        { section: 'Research Ethics & Intellectual Property', score: getRandomScore(), issues: [] },
        { section: 'Research Timeline', score: getRandomScore(), issues: [] },
        { section: 'Knowledge Dissemination', score: getRandomScore(), issues: [] },
        { section: 'Research Experience', score: getRandomScore(), issues: [] },
      ]
    case 'Technical':
      return [
        { section: 'Technical Requirements', score: getRandomScore(), issues: [] },
        { section: 'Financial Compliance', score: getRandomScore(), issues: [] },
        { section: 'Legal & Regulatory', score: getRandomScore(), issues: [] },
        { section: 'Timeline & Deliverables', score: getRandomScore(), issues: [] },
        { section: 'Quality Standards', score: getRandomScore(), issues: [] },
        { section: 'Experience & Credentials', score: getRandomScore(), issues: [] },
      ]
    case 'Financial':
      return [
        { section: 'Financial Requirements', score: getRandomScore(), issues: [] },
        { section: 'Cost Structure & Compliance', score: getRandomScore(), issues: [] },
        { section: 'Financial Regulations', score: getRandomScore(), issues: [] },
        { section: 'Payment Schedule', score: getRandomScore(), issues: [] },
        { section: 'Financial Standards', score: getRandomScore(), issues: [] },
        { section: 'Financial Experience', score: getRandomScore(), issues: [] },
      ]
    default:
      return [
        { section: 'Technical Requirements', score: getRandomScore(), issues: [] },
        { section: 'Financial Compliance', score: getRandomScore(), issues: [] },
        { section: 'Legal & Regulatory', score: getRandomScore(), issues: [] },
        { section: 'Timeline & Deliverables', score: getRandomScore(), issues: [] },
        { section: 'Quality Standards', score: getRandomScore(), issues: [] },
        { section: 'Experience & Credentials', score: getRandomScore(), issues: [] },
      ]
  }
}

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
    id: '', proposer: '', cost: 0, compliancePenalties: 0, deliveryDelays: 0, deliveryStatus: 'On Track', issues: 0, fileUrl: '/placeholder.pdf', version: 1, submissionDate: '', type: 'Technical', status: 'Pending Review', stage: 1, deadline: '', tags: [], comments: [],
    experienceCertificates: '', companyRegistration: '', qualityCertifications: '', financialStatements: '', additionalNotes: '',
    technicalProposal: '', financialProposal: '', projectApproach: '', complianceStatements: '',
    projectDuration: '', teamSize: '', location: '', contactPerson: '', phoneNumber: '', emailAddress: '', website: ''
  })

  const [uploadedFiles, setUploadedFiles] = useState<{
    experienceCertificates: File | null;
    companyRegistration: File | null;
    qualityCertifications: File | null;
    financialStatements: File | null;
    additionalNotes: File | null;
  }>({
    experienceCertificates: null,
    companyRegistration: null,
    qualityCertifications: null,
    financialStatements: null,
    additionalNotes: null
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
    setNewProposal({ 
      id: '', proposer: '', cost: 0, compliancePenalties: 0, deliveryDelays: 0, deliveryStatus: 'On Track', issues: 0, fileUrl: '/placeholder.pdf', version: 1, submissionDate: '', type: 'Technical', status: 'Pending Review', stage: 1, deadline: '', tags: [], comments: [],
      experienceCertificates: '', companyRegistration: '', qualityCertifications: '', financialStatements: '', additionalNotes: '',
      technicalProposal: '', financialProposal: '', projectApproach: '', complianceStatements: '',
      projectDuration: '', teamSize: '', location: '', contactPerson: '', phoneNumber: '', emailAddress: '', website: ''
    })
    setUploadedFiles({
      experienceCertificates: null,
      companyRegistration: null,
      qualityCertifications: null,
      financialStatements: null,
      additionalNotes: null
    })
  }

  const handleFileUpload = (field: keyof typeof uploadedFiles, file: File | null) => {
    setUploadedFiles(prev => ({ ...prev, [field]: file }))
    if (file) {
      setNewProposal(prev => ({ ...prev, [field]: `File uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)` }))
    } else {
      setNewProposal(prev => ({ ...prev, [field]: "" }))
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Proposal</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleAddProposal(); }} className="space-y-6">
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
                  placeholder="Proficient with Company" 
                  value={newProposal.proposer} 
                  onChange={e => setNewProposal({ ...newProposal, proposer: e.target.value })} 
                  required
                />
                <Input 
                  placeholder="Cost (₹)" 
                  type="number" 
                  value={newProposal.cost === 0 ? '' : newProposal.cost} 
                  onChange={e => setNewProposal({ ...newProposal, cost: Number(e.target.value) })} 
                  required
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
                  required
                />
                <select
                  className="w-full border rounded-md p-3"
                  value={newProposal.type}
                  onChange={e => setNewProposal({ ...newProposal, type: e.target.value })}
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
                <Input 
                  placeholder="Status" 
                  value={newProposal.status} 
                  onChange={e => setNewProposal({ ...newProposal, status: e.target.value })} 
                />
                <Input 
                  placeholder="Deadline (YYYY-MM-DD)" 
                  value={newProposal.deadline} 
                  onChange={e => setNewProposal({ ...newProposal, deadline: e.target.value })} 
                  required
                />
                <Input 
                  placeholder="Project Duration (e.g., 6 months)" 
                  value={newProposal.projectDuration || ''} 
                  onChange={e => setNewProposal({ ...newProposal, projectDuration: e.target.value })} 
                />
                <Input 
                  placeholder="Team Size" 
                  type="number"
                  value={newProposal.teamSize || ''} 
                  onChange={e => setNewProposal({ ...newProposal, teamSize: e.target.value })} 
                />
                <Input 
                  placeholder="Location/Address" 
                  value={newProposal.location || ''} 
                  onChange={e => setNewProposal({ ...newProposal, location: e.target.value })} 
                />
                <Input 
                  placeholder="Contact Person" 
                  value={newProposal.contactPerson || ''} 
                  onChange={e => setNewProposal({ ...newProposal, contactPerson: e.target.value })} 
                />
                <Input 
                  placeholder="Phone Number" 
                  value={newProposal.phoneNumber || ''} 
                  onChange={e => setNewProposal({ ...newProposal, phoneNumber: e.target.value })} 
                />
                <Input 
                  placeholder="Email Address" 
                  type="email"
                  value={newProposal.emailAddress || ''} 
                  onChange={e => setNewProposal({ ...newProposal, emailAddress: e.target.value })} 
                />
                <Input 
                  placeholder="Website URL" 
                  value={newProposal.website || ''} 
                  onChange={e => setNewProposal({ ...newProposal, website: e.target.value })} 
                />
              </CardContent>
            </Card>

            {/* Dynamic Proposal Content Based on Type */}
            {(newProposal.type === 'Technical' || newProposal.type === 'Both') && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Technical Proposal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Describe your technical approach, methodology, and implementation plan..."
                    value={newProposal.technicalProposal || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewProposal({ ...newProposal, technicalProposal: e.target.value })}
                    rows={4}
                  />
                </CardContent>
              </Card>
            )}

            {(newProposal.type === 'Financial' || newProposal.type === 'Both') && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="mr-2 h-5 w-5" />
                    Financial Proposal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Provide detailed cost breakdown, pricing structure, and financial terms..."
                    value={newProposal.financialProposal || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewProposal({ ...newProposal, financialProposal: e.target.value })}
                    rows={4}
                  />
                </CardContent>
              </Card>
            )}

            {(newProposal.type === 'Technical' || newProposal.type === 'Both') && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ClipboardList className="mr-2 h-5 w-5" />
                    Project Approach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Describe your project methodology, risk management, and execution strategy..."
                    value={newProposal.projectApproach || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewProposal({ ...newProposal, projectApproach: e.target.value })}
                    rows={4}
                  />
                </CardContent>
              </Card>
            )}

            {(newProposal.type === 'Technical' || newProposal.type === 'Both') && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Compliance Statements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Provide compliance statements for regulations, quality standards, and requirements..."
                    value={newProposal.complianceStatements || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewProposal({ ...newProposal, complianceStatements: e.target.value })}
                    rows={4}
                  />
                </CardContent>
              </Card>
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
                      value={newProposal.experienceCertificates || ''}
                      onChange={e => setNewProposal({ ...newProposal, experienceCertificates: e.target.value })}
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
                      value={newProposal.companyRegistration || ''}
                      onChange={e => setNewProposal({ ...newProposal, companyRegistration: e.target.value })}
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
                      value={newProposal.qualityCertifications || ''}
                      onChange={e => setNewProposal({ ...newProposal, qualityCertifications: e.target.value })}
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
                      value={newProposal.financialStatements || ''}
                      onChange={e => setNewProposal({ ...newProposal, financialStatements: e.target.value })}
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

                <div>
                  <label className="block text-sm font-medium mb-2">Additional Notes</label>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Any additional information or special requirements..."
                      value={newProposal.additionalNotes || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewProposal({ ...newProposal, additionalNotes: e.target.value })}
                      rows={3}
                    />
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => handleFileUpload("additionalNotes", e.target.files?.[0] || null)}
                        className="flex-1"
                      />
                      {uploadedFiles.additionalNotes && (
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                          <span>{getFileIcon(uploadedFiles.additionalNotes.name)}</span>
                          <span>{uploadedFiles.additionalNotes.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFileUpload("additionalNotes", null)}
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
                    <strong>Accepted file types:</strong> PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG, TXT
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Maximum file size: 10MB per file
                  </p>
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Add Proposal
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowNewProposal(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Analysis Dialog */}
      <Dialog open={showAnalysis} onOpenChange={setShowAnalysis}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center">
              <Eye className="mr-2 h-6 w-6" />
              Proposal Details: {selectedProposal?.id}
            </DialogTitle>
          </DialogHeader>
          
          {selectedProposal && (
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Proposal Details</h4>
                    <p className="text-sm text-gray-600">Company: {selectedProposal.proposer}</p>
                    <p className="text-sm text-gray-600">Type: {selectedProposal.type}</p>
                    <p className="text-sm text-gray-600">Status: {selectedProposal.status}</p>
                    <p className="text-sm text-gray-600">Cost: ₹{(selectedProposal.cost / 100000).toFixed(2)}L</p>
                    <p className="text-sm text-gray-600">Score: {selectedProposal.score}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Timeline</h4>
                    <p className="text-sm text-gray-600">Submission: {selectedProposal.submissionDate}</p>
                    <p className="text-sm text-gray-600">Deadline: {selectedProposal.deadline}</p>
                    <p className="text-sm text-gray-600">Duration: {selectedProposal.projectDuration || 'Not specified'}</p>
                    <p className="text-sm text-gray-600">Team Size: {selectedProposal.teamSize || 'Not specified'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              {(selectedProposal.contactPerson || selectedProposal.phoneNumber || selectedProposal.emailAddress || selectedProposal.website || selectedProposal.location) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4">
                    {selectedProposal.contactPerson && <p className="text-sm text-gray-600"><span className="font-medium">Contact:</span> {selectedProposal.contactPerson}</p>}
                    {selectedProposal.phoneNumber && <p className="text-sm text-gray-600"><span className="font-medium">Phone:</span> {selectedProposal.phoneNumber}</p>}
                    {selectedProposal.emailAddress && <p className="text-sm text-gray-600"><span className="font-medium">Email:</span> {selectedProposal.emailAddress}</p>}
                    {selectedProposal.website && <p className="text-sm text-gray-600"><span className="font-medium">Website:</span> {selectedProposal.website}</p>}
                    {selectedProposal.location && <p className="text-sm text-gray-600"><span className="font-medium">Location:</span> {selectedProposal.location}</p>}
                  </CardContent>
                </Card>
              )}

              {/* Proposal Content */}
              {(selectedProposal.technicalProposal || selectedProposal.financialProposal || selectedProposal.projectApproach || selectedProposal.complianceStatements) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      Proposal Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedProposal.technicalProposal && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          Technical Proposal
                        </h4>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">{selectedProposal.technicalProposal}</p>
                        </div>
                      </div>
                    )}
                    {selectedProposal.financialProposal && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <Calculator className="mr-2 h-4 w-4" />
                          Financial Proposal
                        </h4>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">{selectedProposal.financialProposal}</p>
                        </div>
                      </div>
                    )}
                    {selectedProposal.projectApproach && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <ClipboardList className="mr-2 h-4 w-4" />
                          Project Approach
                        </h4>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">{selectedProposal.projectApproach}</p>
                        </div>
                      </div>
                    )}
                    {selectedProposal.complianceStatements && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <Shield className="mr-2 h-4 w-4" />
                          Compliance Statements
                        </h4>
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">{selectedProposal.complianceStatements}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Supporting Documents */}
              {(selectedProposal.experienceCertificates || selectedProposal.companyRegistration || selectedProposal.qualityCertifications || selectedProposal.financialStatements || selectedProposal.additionalNotes) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Upload className="mr-2 h-5 w-5" />
                      Supporting Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedProposal.experienceCertificates && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Experience Certificates</h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">{selectedProposal.experienceCertificates}</p>
                        </div>
                      </div>
                    )}
                    {selectedProposal.companyRegistration && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Company Registration</h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">{selectedProposal.companyRegistration}</p>
                        </div>
                      </div>
                    )}
                    {selectedProposal.qualityCertifications && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Quality Certifications</h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">{selectedProposal.qualityCertifications}</p>
                        </div>
                      </div>
                    )}
                    {selectedProposal.financialStatements && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Financial Statements</h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">{selectedProposal.financialStatements}</p>
                        </div>
                      </div>
                    )}
                    {selectedProposal.additionalNotes && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Additional Notes</h4>
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">{selectedProposal.additionalNotes}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Section-wise Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Section-wise Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">AI Analysis Summary</h4>
                    <p className="text-blue-800 text-sm">
                      {selectedProposal.type === 'Infrastructure' && "This infrastructure proposal demonstrates strong performance in building codes & safety compliance and construction experience. However, construction methodology and resource allocation plans require further clarification. It is recommended to request detailed construction specifications and a comprehensive resource allocation strategy before proceeding to final approval."}
                      {selectedProposal.type === 'Software' && "This software development proposal shows excellent data security & privacy compliance and strong development experience. However, technology stack justification and sprint planning need refinement. It is recommended to request detailed technology stack rationale and enhanced sprint planning documentation before proceeding to final approval."}
                      {selectedProposal.type === 'Consulting' && "This consulting proposal exhibits strong professional standards & ethics compliance and solid consulting experience. However, methodology framework and stakeholder engagement plans require further detail. It is recommended to request comprehensive methodology documentation and detailed stakeholder engagement strategies before proceeding to final approval."}
                      {selectedProposal.type === 'Training' && "This training proposal demonstrates strong educational standards & certification compliance and good training experience. However, learning objectives and assessment criteria need clarification. It is recommended to request detailed learning objectives and comprehensive assessment frameworks before proceeding to final approval."}
                      {selectedProposal.type === 'Maintenance' && "This maintenance proposal shows strong service level agreements & safety compliance and solid maintenance experience. However, service level definitions and emergency response plans require further detail. It is recommended to request comprehensive service level documentation and detailed emergency response procedures before proceeding to final approval."}
                      {selectedProposal.type === 'Research' && "This research proposal exhibits excellent research ethics & intellectual property compliance and strong research experience. However, innovation approach and collaboration timelines need clarification. It is recommended to request detailed innovation methodology and comprehensive collaboration strategies before proceeding to final approval."}
                      {selectedProposal.type === 'Technical' && "This technical proposal demonstrates strong performance in technical requirements and experience & credentials. However, compliance documentation and quality assurance plans require further attention. It is recommended to request updated compliance documentation and a more detailed quality assurance plan before proceeding to final approval."}
                      {selectedProposal.type === 'Financial' && "This financial proposal shows strong cost structure & compliance and solid financial experience. However, financial projections and regulatory compliance need verification. It is recommended to request detailed financial projections and comprehensive regulatory compliance documentation before proceeding to final approval."}
                      {(!selectedProposal.type || (selectedProposal.type !== 'Infrastructure' && selectedProposal.type !== 'Software' && selectedProposal.type !== 'Consulting' && selectedProposal.type !== 'Training' && selectedProposal.type !== 'Maintenance' && selectedProposal.type !== 'Research' && selectedProposal.type !== 'Technical' && selectedProposal.type !== 'Financial')) && "This proposal demonstrates strong performance in technical requirements, financial compliance, and experience & credentials. However, regulatory documentation and quality standards require further attention. It is recommended to request updated legal documents and a more detailed quality assurance plan before proceeding to final approval."}
                    </p>
                  </div>
                  <div className="space-y-4">
                    {(sectionAnalysisMap[selectedProposal.id] || getDynamicSectionAnalysis(selectedProposal.type)).map((s: SectionAnalysis) => (
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
                </CardContent>
              </Card>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAnalysis(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Index