const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export interface RFPGenerationRequest {
  projectName: string
  projectDescription: string
  industry: string
  projectType: string
  budget?: string
  timeline?: string
  location?: string
  disciplines?: string[]
  requirements?: string[]
  technicalSpecifications?: string[]
  compliance?: string[]
  expectedOutcomes?: string[]
}

export interface RFPGenerationResponse {
  success: boolean
  rfpText: string
  relevantDocuments: any[]
  metadata: {
    projectName: string
    industry: string
    projectType: string
    generatedAt: string
    aiProvider: string
    promptLength: number
    responseLength: number
    wordCount: number
  }
}

export class RFPGenerationAPI {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  static async generateRFP(data: RFPGenerationRequest): Promise<RFPGenerationResponse> {
    return this.request<RFPGenerationResponse>('/rfp/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  static async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health')
  }
}

export const industryOptions = [
  'Environmental',
  'Infrastructure',
  'Technology',
  'Healthcare',
  'Education',
  'Transportation',
  'Energy',
  'Defense',
  'Agriculture',
  'Construction'
]

export const projectTypeOptions = [
  'Infrastructure Development',
  'System Modernization',
  'Software Development',
  'Consulting Services',
  'Equipment Procurement',
  'Maintenance Services',
  'Research & Development',
  'Training & Capacity Building',
  'Safety & Compliance',
  'Digital Transformation'
]

export const disciplineOptions = {
  Environmental: [
    'Environmental Engineering',
    'Air Quality Management',
    'Water Quality Management',
    'Waste Management',
    'Pollution Control',
    'Environmental Monitoring',
    'Climate Change Mitigation',
    'Renewable Energy'
  ],
  Infrastructure: [
    'Civil Engineering',
    'Structural Engineering',
    'Transportation Engineering',
    'Urban Planning',
    'Geotechnical Engineering',
    'Project Management',
    'Construction Management',
    'Quality Assurance'
  ],
  Technology: [
    'Software Development',
    'System Architecture',
    'Database Management',
    'Cybersecurity',
    'Cloud Computing',
    'IoT Systems',
    'AI/ML Development',
    'DevOps Engineering'
  ],
  Healthcare: [
    'Medical Equipment',
    'Healthcare IT',
    'Hospital Management',
    'Telemedicine',
    'Medical Devices',
    'Pharmaceutical',
    'Clinical Research',
    'Health Information Systems'
  ],
  Education: [
    'Educational Technology',
    'Curriculum Development',
    'Learning Management Systems',
    'Teacher Training',
    'Educational Infrastructure',
    'Digital Learning',
    'Assessment Systems',
    'Educational Research'
  ],
  Transportation: [
    'Transportation Planning',
    'Traffic Management',
    'Public Transit Systems',
    'Railway Engineering',
    'Aviation Systems',
    'Maritime Engineering',
    'Logistics Management',
    'Smart Transportation'
  ],
  Energy: [
    'Power Generation',
    'Renewable Energy Systems',
    'Grid Management',
    'Energy Efficiency',
    'Solar Engineering',
    'Wind Energy',
    'Hydroelectric Systems',
    'Energy Storage'
  ],
  Defense: [
    'Defense Systems',
    'Cybersecurity',
    'Military Engineering',
    'Communications Systems',
    'Surveillance Technology',
    'Logistics Support',
    'Training Systems',
    'Strategic Planning'
  ],
  Agriculture: [
    'Agricultural Engineering',
    'Irrigation Systems',
    'Crop Management',
    'Food Processing',
    'Farm Automation',
    'Soil Management',
    'Agricultural Technology',
    'Supply Chain Management'
  ],
  Construction: [
    'Project Management',
    'Structural Engineering',
    'Construction Technology',
    'Building Materials',
    'Safety Management',
    'Quality Control',
    'Green Building',
    'Construction Planning'
  ]
}
