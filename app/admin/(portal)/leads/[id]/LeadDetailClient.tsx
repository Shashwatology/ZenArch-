'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { LeadStatus, ActivityType } from '@prisma/client'
import { updateLeadStatusAction, assignLeadAction, addLeadActivityAction, linkLeadAction } from '../actions'

type Lead = any
type Staff = any

export function LeadDetailClient({ lead, staff }: { lead: Lead, staff: Staff[] }) {
  const [loading, setLoading] = useState(false)
  const [activityType, setActivityType] = useState<ActivityType>('NOTE')
  const [activityNote, setActivityNote] = useState('')
  const [nextActionAt, setNextActionAt] = useState('')
  const [nextActionNote, setNextActionNote] = useState('')

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true)
    await updateLeadStatusAction(lead.id, e.target.value as LeadStatus)
    setLoading(false)
  }

  const handleAssign = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true)
    await assignLeadAction(lead.id, e.target.value || null)
    setLoading(false)
  }

  const handleAddActivity = async () => {
    if (!activityNote) return
    setLoading(true)
    try {
      await addLeadActivityAction(lead.id, {
        type: activityType,
        description: activityNote,
        nextActionAt: nextActionAt ? new Date(nextActionAt) : undefined,
        nextActionNote: nextActionNote || undefined
      })
      setActivityNote('')
      setNextActionAt('')
      setNextActionNote('')
    } finally {
      setLoading(false)
    }
  }

  const handleLink = async (type: 'CUSTOMER' | 'QUOTE' | 'ORDER' | 'PROJECT' | 'BOARD') => {
    const id = prompt(`Enter ${type} ID to link:`)
    if (id) {
      setLoading(true)
      await linkLeadAction(lead.id, type, id)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Column: Details & Commercial Linkage */}
      <div className="space-y-6">
        <div className="bg-[#1E1E1E] p-6 rounded-xl border border-white/10">
          <Link href="/admin/leads" className="text-sm text-gray-500 hover:text-white mb-4 block">← Back to Pipeline</Link>
          
          <h1 className="text-2xl text-white font-light mb-1">{lead.name}</h1>
          <p className="text-sm text-gray-400 mb-6">{lead.email} {lead.phone && `| ${lead.phone}`}</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Status</label>
              <select 
                value={lead.status}
                onChange={handleStatusChange}
                disabled={loading}
                className="w-full bg-[#121212] text-white border border-white/10 p-2 rounded focus:outline-none focus:border-[#C8A97E]"
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="CONSULTATION_BOOKED">Consultation Booked</option>
                <option value="QUOTE_SENT">Quote Sent</option>
                <option value="NEGOTIATION">Negotiation</option>
                <option value="WON">Won</option>
                <option value="LOST">Lost</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Assigned To</label>
              <select 
                value={lead.assignedToId || ''}
                onChange={handleAssign}
                disabled={loading}
                className="w-full bg-[#121212] text-white border border-white/10 p-2 rounded focus:outline-none focus:border-[#C8A97E]"
              >
                <option value="">Unassigned</option>
                {staff.map(s => (
                  <option key={s.id} value={s.id}>{s.adminProfile?.firstName || s.email}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 pt-4 border-t border-white/5">
              <div>
                <span className="text-xs text-gray-500 block mb-1">Source</span>
                {lead.source || '-'}
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Type</span>
                {lead.projectType || '-'}
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Budget</span>
                {lead.budget ? `₹${Number(lead.budget).toLocaleString()}` : '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Commercial Linkage */}
        <div className="bg-[#1E1E1E] p-6 rounded-xl border border-white/10 space-y-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Commercial Links</h3>
          
          <div className="flex justify-between items-center bg-[#121212] p-3 rounded border border-white/5">
            <span className="text-sm text-gray-300">Customer</span>
            {lead.customerId ? (
              <Link href={`/admin/customers/${lead.customerId}`} className="text-xs text-[#C8A97E] hover:underline">View Profile</Link>
            ) : (
              <button onClick={() => handleLink('CUSTOMER')} className="text-xs text-gray-500 hover:text-white">Link</button>
            )}
          </div>

          <div className="flex justify-between items-center bg-[#121212] p-3 rounded border border-white/5">
            <span className="text-sm text-gray-300">Quote</span>
            {lead.quoteRequestId ? (
              <Link href={`/admin/quotes/${lead.quoteRequestId}`} className="text-xs text-[#C8A97E] hover:underline">View Quote</Link>
            ) : (
              <div className="flex gap-2">
                <Link href={`/admin/quotes/new?leadId=${lead.id}`} className="text-xs text-[#C8A97E] hover:underline">Create New</Link>
                <span className="text-gray-500">|</span>
                <button onClick={() => handleLink('QUOTE')} className="text-xs text-gray-500 hover:text-white">Link Existing</button>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center bg-[#121212] p-3 rounded border border-white/5">
            <span className="text-sm text-gray-300">Order</span>
            {lead.orderId ? (
              <Link href={`/admin/orders/${lead.orderId}`} className="text-xs text-[#C8A97E] hover:underline">View Order</Link>
            ) : (
              <button onClick={() => handleLink('ORDER')} className="text-xs text-gray-500 hover:text-white">Link</button>
            )}
          </div>

          <div className="flex justify-between items-center bg-[#121212] p-3 rounded border border-white/5">
            <span className="text-sm text-gray-300">Project</span>
            {lead.clientProjectId ? (
              <Link href={`/admin/projects/${lead.clientProjectId}`} className="text-xs text-[#C8A97E] hover:underline">View Project</Link>
            ) : (
              <button onClick={() => handleLink('PROJECT')} className="text-xs text-gray-500 hover:text-white">Link</button>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Activity Timeline */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Add Activity */}
        <div className="bg-[#1E1E1E] p-6 rounded-xl border border-[#C8A97E]/30">
          <h2 className="text-lg font-light text-white mb-4">Log Activity</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <select 
                value={activityType}
                onChange={e => setActivityType(e.target.value as ActivityType)}
                className="bg-[#121212] text-white border border-white/10 p-3 rounded-lg focus:outline-none focus:border-[#C8A97E]"
              >
                <option value="NOTE">Note</option>
                <option value="CALL">Call</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="EMAIL">Email</option>
                <option value="MEETING">Meeting</option>
              </select>
              <input 
                type="text" 
                value={activityNote}
                onChange={e => setActivityNote(e.target.value)}
                placeholder="Description of what happened..."
                className="flex-1 bg-[#121212] text-white border border-white/10 p-3 rounded-lg focus:outline-none focus:border-[#C8A97E]"
              />
            </div>
            
            <div className="pt-4 border-t border-white/5">
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Schedule Next Follow-Up (Optional)</label>
              <div className="flex gap-4">
                <input 
                  type="datetime-local" 
                  value={nextActionAt}
                  onChange={e => setNextActionAt(e.target.value)}
                  className="bg-[#121212] text-sm text-white border border-white/10 p-2 rounded focus:outline-none focus:border-[#C8A97E]"
                />
                <input 
                  type="text" 
                  value={nextActionNote}
                  onChange={e => setNextActionNote(e.target.value)}
                  placeholder="What needs to be done next?"
                  className="flex-1 bg-[#121212] text-sm text-white border border-white/10 p-2 rounded focus:outline-none focus:border-[#C8A97E]"
                />
              </div>
            </div>

            <div className="text-right">
              <button 
                onClick={handleAddActivity}
                disabled={loading || !activityNote}
                className="bg-[#C8A97E] text-black px-6 py-2 rounded font-medium hover:bg-white transition-colors disabled:opacity-50"
              >
                Save Activity
              </button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-[#1E1E1E] p-6 rounded-xl border border-white/10">
          <h2 className="text-lg font-light text-white mb-6">Activity Timeline</h2>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            {lead.activities.map((activity: any, index: number) => (
              <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-[#121212] text-gray-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow ml-0 md:ml-0 z-10 text-xs">
                  {activity.type.charAt(0)}
                </div>
                
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded border border-white/5 bg-[#121212] hover:border-white/20 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm text-white font-medium">{activity.type}</div>
                    <div className="text-xs text-gray-500">{new Date(activity.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-sm text-gray-400 mb-2">{activity.description}</div>
                  
                  {activity.nextActionAt && (
                    <div className="text-xs text-[#C8A97E] bg-[#C8A97E]/10 p-2 rounded border border-[#C8A97E]/20">
                      <strong>Scheduled:</strong> {new Date(activity.nextActionAt).toLocaleDateString()}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-2 text-right">
                    By {activity.actor?.adminProfile?.firstName || activity.actor?.email || 'System'}
                  </div>
                </div>
              </div>
            ))}
            
            {lead.activities.length === 0 && (
              <div className="text-center text-sm text-gray-500 italic py-8">
                No activity recorded yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
