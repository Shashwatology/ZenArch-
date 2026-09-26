'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type EmailLog = any

export function EmailsClient({ logs }: { logs: EmailLog[] }) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('ALL')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (status !== 'ALL') params.set('status', status)
    router.push(`/admin/emails?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light tracking-wider text-white mb-2">Email Log</h2>
          <p className="text-sm text-gray-400">View and audit transactional emails sent by the system.</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-4 bg-[#1E1E1E] p-4 rounded-xl border border-white/10">
        <input 
          type="text" 
          placeholder="Search by recipient, subject, or event..." 
          value={q} 
          onChange={e => setQ(e.target.value)}
          className="flex-1 bg-[#121212] text-white border border-white/10 p-2 rounded focus:outline-none focus:border-[#C8A97E]"
        />
        <select 
          value={status} 
          onChange={e => setStatus(e.target.value)}
          className="bg-[#121212] text-white border border-white/10 p-2 rounded focus:outline-none focus:border-[#C8A97E]"
        >
          <option value="ALL">All Statuses</option>
          <option value="SENT">Sent</option>
          <option value="DELIVERED">Delivered</option>
          <option value="BOUNCED">Bounced</option>
          <option value="FAILED">Failed</option>
        </select>
        <button type="submit" className="bg-[#C8A97E] text-black px-6 py-2 rounded font-medium hover:bg-white transition-colors">
          Filter
        </button>
      </form>

      <div className="bg-[#1E1E1E] rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-[#121212] text-xs uppercase font-medium text-gray-500 border-b border-white/10">
            <tr>
              <th className="px-6 py-4">Recipient</th>
              <th className="px-6 py-4">Event Type</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4 text-right">Links</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-white">{log.recipientEmail}</div>
                  {log.user && <div className="text-xs text-gray-500">User: {log.user.email}</div>}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-white/10 text-white px-2 py-1 rounded text-xs">{log.eventType}</span>
                </td>
                <td className="px-6 py-4">{log.subject || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    log.status === 'SENT' || log.status === 'DELIVERED' ? 'bg-green-500/20 text-green-400' :
                    log.status === 'FAILED' || log.status === 'BOUNCED' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {log.status}
                  </span>
                  {log.failureReason && <div className="text-xs text-red-400 mt-1">{log.failureReason}</div>}
                </td>
                <td className="px-6 py-4 text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  {log.leadId && (
                    <Link href={`/admin/leads/${log.leadId}`} className="text-[#C8A97E] hover:underline text-xs">Lead</Link>
                  )}
                  {log.quoteRequestId && (
                    <Link href={`/admin/quotes/${log.quoteRequestId}`} className="text-[#C8A97E] hover:underline text-xs">Quote</Link>
                  )}
                  {log.orderId && (
                    <Link href={`/admin/orders/${log.orderId}`} className="text-[#C8A97E] hover:underline text-xs">Order</Link>
                  )}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No emails found matching criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
