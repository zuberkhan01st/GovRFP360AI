export interface RFPData {
  title: string
  projectName: string
  organization: string
  industry: string
  discipline: string
  description: string
  scope: string
  timeline: string
  budget: string
  requirements: string[]
  deliverables: string[]
  evaluation: string[]
}

export class RFPContentGenerator {
  static generateSampleContent(data: RFPData): string {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return `
<div style="font-family: 'Times New Roman', serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 40px;">
  
  <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #1e40af; padding-bottom: 20px;">
    <h1 style="color: #1e40af; margin: 0; font-size: 28px; font-weight: bold;">
      REQUEST FOR PROPOSAL (RFP)
    </h1>
    <h2 style="color: #374151; margin: 10px 0; font-size: 22px; font-weight: normal;">
      ${data.title}
    </h2>
    <p style="color: #6b7280; margin: 5px 0; font-size: 16px;">
      ${data.organization || 'Government of India'}
    </p>
    <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">
      Issue Date: ${currentDate}
    </p>
  </div>

  <div style="margin-bottom: 30px;">
    <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">
      1. PROJECT OVERVIEW
    </h3>
    <div style="background: #f8fafc; padding: 20px; border-left: 4px solid #1e40af; margin-bottom: 20px;">
      <p><strong>Project Name:</strong> ${data.projectName}</p>
      <p><strong>Industry:</strong> ${data.industry}</p>
      <p><strong>Discipline:</strong> ${data.discipline}</p>
      <p><strong>Estimated Timeline:</strong> ${data.timeline}</p>
      <p><strong>Budget Range:</strong> ${data.budget}</p>
    </div>
    <p style="text-align: justify; margin-bottom: 15px;">
      ${data.description}
    </p>
  </div>

  <div style="margin-bottom: 30px;">
    <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">
      2. SCOPE OF WORK
    </h3>
    <p style="text-align: justify; margin-bottom: 15px;">
      ${data.scope}
    </p>
  </div>

  <div style="margin-bottom: 30px;">
    <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">
      3. TECHNICAL REQUIREMENTS
    </h3>
    <ul style="padding-left: 25px;">
      ${data.requirements.map(req => `<li style="margin-bottom: 8px;">${req}</li>`).join('')}
    </ul>
  </div>

  <div style="margin-bottom: 30px;">
    <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">
      4. DELIVERABLES
    </h3>
    <ol style="padding-left: 25px;">
      ${data.deliverables.map(deliverable => `<li style="margin-bottom: 8px;">${deliverable}</li>`).join('')}
    </ol>
  </div>

  <div style="margin-bottom: 30px;">
    <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">
      5. PROPOSAL SUBMISSION REQUIREMENTS
    </h3>
    <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
      <p style="margin: 0; font-weight: bold; color: #92400e;">
        Submission Deadline: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US')}
      </p>
    </div>
    <p>All proposals must include:</p>
    <ul style="padding-left: 25px;">
      <li style="margin-bottom: 8px;">Technical approach and methodology</li>
      <li style="margin-bottom: 8px;">Detailed project timeline with milestones</li>
      <li style="margin-bottom: 8px;">Comprehensive cost breakdown</li>
      <li style="margin-bottom: 8px;">Team qualifications and experience</li>
      <li style="margin-bottom: 8px;">References from similar projects</li>
      <li style="margin-bottom: 8px;">Risk management plan</li>
    </ul>
  </div>

  <div style="margin-bottom: 30px;">
    <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">
      6. EVALUATION CRITERIA
    </h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
      <thead>
        <tr style="background: #f3f4f6;">
          <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left;">Criteria</th>
          <th style="border: 1px solid #d1d5db; padding: 12px; text-align: center;">Weight</th>
        </tr>
      </thead>
      <tbody>
        ${data.evaluation.map((criteria, index) => {
          const weights = ['30%', '25%', '20%', '15%', '10%']
          return `
            <tr>
              <td style="border: 1px solid #d1d5db; padding: 12px;">${criteria}</td>
              <td style="border: 1px solid #d1d5db; padding: 12px; text-align: center;">${weights[index] || '5%'}</td>
            </tr>
          `
        }).join('')}
      </tbody>
    </table>
  </div>

  <div style="margin-bottom: 30px;">
    <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">
      7. TERMS AND CONDITIONS
    </h3>
    <div style="font-size: 14px; line-height: 1.5;">
      <p style="margin-bottom: 10px;">• This RFP does not constitute a commitment to purchase or contract for services.</p>
      <p style="margin-bottom: 10px;">• The government reserves the right to reject any or all proposals.</p>
      <p style="margin-bottom: 10px;">• Proposals become the property of the issuing organization.</p>
      <p style="margin-bottom: 10px;">• All costs for proposal preparation are at the proposer's expense.</p>
      <p style="margin-bottom: 10px;">• The selected vendor will be required to comply with all applicable laws and regulations.</p>
    </div>
  </div>

  <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
    <div style="text-align: center;">
      <p style="margin: 5px 0; font-weight: bold;">${data.organization || 'Government of India'}</p>
      <p style="margin: 5px 0; color: #6b7280;">${data.industry} Department</p>
      <p style="margin: 5px 0; color: #6b7280;">Procurement Division</p>
    </div>
  </div>

</div>
    `.trim()
  }

  static createRFPFromForm(formData: any): RFPData {
    return {
      title: formData.projectTitle || 'Government Project RFP',
      projectName: formData.projectName || 'Unnamed Project',
      organization: formData.organization || 'Government of India',
      industry: formData.industry || 'General',
      discipline: formData.discipline || 'General',
      description: formData.description || 'Project description to be provided.',
      scope: formData.scope || 'Project scope to be defined.',
      timeline: formData.timeline || 'To be determined',
      budget: formData.budget || 'To be determined',
      requirements: formData.requirements || [
        'Compliance with government standards',
        'Experience in similar projects',
        'Qualified technical team',
        'Appropriate certifications'
      ],
      deliverables: formData.deliverables || [
        'Project implementation plan',
        'Regular progress reports',
        'Final project documentation',
        'Training and knowledge transfer'
      ],
      evaluation: formData.evaluation || [
        'Technical expertise and approach',
        'Past performance and experience',
        'Cost effectiveness',
        'Project timeline feasibility',
        'Team qualifications'
      ]
    }
  }
}

export default RFPContentGenerator
