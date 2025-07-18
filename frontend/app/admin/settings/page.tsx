"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Shield, Info, Clock } from "lucide-react"

export default function AdminSettingsPage() {
  const [org, setOrg] = useState("GovRFP360AI")
  const [contact, setContact] = useState("contact@govrfp.com")
  const [address, setAddress] = useState("123, Main Street, New Delhi")
  const [phone, setPhone] = useState("+91-9876543210")
  const [timezone, setTimezone] = useState("Asia/Kolkata")
  const [scoreWeight, setScoreWeight] = useState(70)
  const [compliancePenalty, setCompliancePenalty] = useState(5)
  const [inviteLink] = useState("https://govrfp.com/invite/abc123")
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifySlack, setNotifySlack] = useState(false)
  const [passwordPolicy, setPasswordPolicy] = useState("Min 8 chars, 1 uppercase, 1 number")
  const auditLog = [
    { time: "2025-05-10 10:00", action: "Changed compliance penalty to 5" },
    { time: "2025-05-09 16:30", action: "Added new user: Pooja Singh" },
    { time: "2025-05-08 09:15", action: "Updated organization address" },
    { time: "2025-05-07 14:45", action: "Enabled Slack notifications" },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">General Settings</h2>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Organization Name</label>
          <Input value={org} onChange={e => setOrg(e.target.value)} />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Contact Email</label>
          <Input value={contact} onChange={e => setContact(e.target.value)} />
        </div>
        <Button className="mt-2">Save General Settings</Button>
      </div>
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Proposal Settings</h2>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Score Weight (%)</label>
          <Input type="number" value={scoreWeight} onChange={e => setScoreWeight(Number(e.target.value))} />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Compliance Penalty (per issue)</label>
          <Input type="number" value={compliancePenalty} onChange={e => setCompliancePenalty(Number(e.target.value))} />
        </div>
        <Button className="mt-2">Save Proposal Settings</Button>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Invite Link</label>
          <Input value={inviteLink} readOnly />
        </div>
        <Button className="mt-2">Send Password Reset Email</Button>
      </div>
    </div>
  )
} 