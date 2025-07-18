"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, BookOpen, LifeBuoy } from "lucide-react"

export default function HelpPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Help & Support</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2 text-gray-700">
              <li>How do I approve or reject a proposal?</li>
              <li>How can I add a new user or change permissions?</li>
              <li>Where can I find compliance guidelines?</li>
              <li>How do I export proposal data?</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2 text-blue-700"><Mail className="w-4 h-4" /> support@govrfp.com</div>
            <div className="flex items-center gap-2 text-blue-700"><LifeBuoy className="w-4 h-4" /> Live Chat (coming soon)</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-blue-700"><BookOpen className="w-4 h-4" /> <a href="#" className="underline">View Admin Guide</a></div>
        </CardContent>
      </Card>
    </div>
  )
} 