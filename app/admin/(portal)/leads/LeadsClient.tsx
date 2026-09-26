'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { LeadStatus } from '@prisma/client'
import { updateLeadStatusAction, createLeadAction } from './actions'

type Lead = any
type Staff = any

export function LeadsClient({ leads, staff }: { leads: Lead[], staff: Staff[] }) {
  const [filterAssignee, setFilterAssignee] = useState<string>('ALL')

  const columns: { title: string, status: LeadStatus, color: string }[] = [
    { title: 'New', status: 'NEW', color: 'border-blue-500/30' },
    { title: 'Contacted', status: 'CONTACTED', color: 'border-purple-500/30' },
    { title: 'Qualified', status: 'QUALIFIED', color: 'border-indigo-500/30' },
    { title: 'Consultation', status: 'CONSULTATION_BOOKED', color: 'border-pink-500/30' },
    { title: 'Quote Sent', status: 'QUOTE_SENT', color: 'border-yellow-500/30' },
    { title: 'Negotiation', status: 'NEGOTIATION', color: 'border-orange-500/30' },
    { title: 'Won', status: 'WON', color: 'border-green-500/30' },
    { title: 'Lost/Hold', status: 'LOST', color: 'border-red-500/30' } // Combines Lost & On Hold for simplicity in Kanban if needed, but let's keep exact maps
  ]

  const getFilteredLeads = (status: LeadStatus) => {
    let filtered = leads.filter(l => {
      if (status === 'LOST') return l.status === 'LOST' || l.status === 'ON_HOLD'
      return l.status === status
    })

    if (filterAssignee !== 'ALL') {
      if (filterAssignee === 'UNASSIGNED') {
        filtered = filtered.filter(l => !l.assignedToId)
      } else {
        filtered = filtered.filter(l => l.assignedToId === filterAssignee)
      }
    }

    return filtered
  }

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    await updateLeadStatusAction(leadId, newStatus)
  }

  const [showNewModal, setShowNewModal] = useState(false)
  const [newLeadData, setNewLeadData] = useState({ name: '', email: '', phone: '', source: '', projectType: '' })
  
  const handleCreate = async () => {
    if (!newLeadData.name) return
    const lead = await createLeadAction(newLeadData)
    setShowNewModal(false)
    window.location.href = `/admin/leads/${lead.id}`
  }

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col relative">
      {/* New Lead Modal */}
      {showNewModal && (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E1E1E] p-6 rounded-xl border border-white/10 w-full max-w-md">
            <h3 className="text-xl font-light text-white mb-4">New Lead</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Name *" value={newLeadData.name} onChange={e => setNewLeadData({...newLeadData, name: e.target.value})} className="w-full bg-[#121212] text-white border border-white/10 p-3 rounded-lg focus:border-[#C8A97E]" />
              <input type="email" placeholder="Email" value={newLeadData.email} onChange={e => setNewLeadData({...newLeadData, email: e.target.value})} className="w-full bg-[#121212] text-white border border-white/10 p-3 rounded-lg focus:border-[#C8A97E]" />
              <input type="tel" placeholder="Phone" value={newLeadData.phone} onChange={e => setNewLeadData({...newLeadData, phone: e.target.value})} className="w-full bg-[#121212] text-white border border-white/10 p-3 rounded-lg focus:border-[#C8A97E]" />
              <select value={newLeadData.source} onChange={e => setNewLeadData({...newLeadData, source: e.target.value})} className="w-full bg-[#121212] text-white border border-white/10 p-3 rounded-lg focus:border-[#C8A97E]">
                <option value="">-- Source --</option>
                <option value="WEBSITE">Website</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="AI_LAB">Experience Lab</option>
                <option value="REFERRAL">Referral</option>
              </select>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowNewModal(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-white p-3 rounded-lg">Cancel</button>
                <button onClick={handleCreate} disabled={!newLeadData.name} className="flex-1 bg-[#C8A97E] hover:bg-white text-black font-medium p-3 rounded-lg disabled:opacity-50">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-light tracking-wider text-white mb-2">Sales Pipeline</h2>
          <p className="text-sm text-gray-400">Manage incoming leads and follow-ups.</p>
        </div>
        <div className="flex gap-4">
          <select 
            value={filterAssignee} 
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="bg-[#121212] text-white border border-white/10 p-2 rounded-lg text-sm focus:outline-none focus:border-[#C8A97E]"
          >
            <option value="ALL">All Leads</option>
            <option value="UNASSIGNED">Unassigned</option>
            {staff.map(s => (
              <option key={s.id} value={s.id}>
                {s.adminProfile?.firstName || s.email}
              </option>
            ))}
          </select>
          <button onClick={() => setShowNewModal(true)} className="bg-[#C8A97E] hover:bg-[#b5956a] text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            + New Lead
          </button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
        {columns.map(col => {
          const colLeads = getFilteredLeads(col.status)
          return (
            <div key={col.status} className={`w-80 shrink-0 flex flex-col bg-[#1E1E1E] rounded-xl border-t-4 ${col.color}`}>
              <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-white font-medium text-sm tracking-wide">{col.title}</h3>
                <span className="bg-white/10 text-xs text-gray-400 px-2 py-0.5 rounded-full">{colLeads.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {colLeads.map(lead => (
                  <div key={lead.id} className="bg-[#121212] border border-white/5 p-4 rounded-lg hover:border-white/20 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <Link href={`/admin/leads/${lead.id}`} className="text-white font-medium hover:text-[#C8A97E]">
                        {lead.name}
                      </Link>
                      <select 
                        className="opacity-0 group-hover:opacity-100 bg-transparent text-xs text-gray-500 hover:text-white focus:outline-none"
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                      >
                        {columns.map(c => (
                          <option key={c.status} value={c.status}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="text-xs text-gray-400 mb-3 space-y-1">
                      {lead.projectType && <div>Type: {lead.projectType}</div>}
                      {lead.budget && <div>Budget: ₹{Number(lead.budget).toLocaleString()}</div>}
                      {lead.source && <div>Source: {lead.source}</div>}
                    </div>

                    <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        {lead.assignedTo ? (lead.assignedTo.adminProfile?.firstName || 'Assigned') : 'Unassigned'}
                      </div>
                      {lead.nextFollowUpAt && (
                        <div className={`text-xs ${new Date(lead.nextFollowUpAt) < new Date() ? 'text-red-400' : 'text-green-400'}`}>
                          Due: {new Date(lead.nextFollowUpAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
