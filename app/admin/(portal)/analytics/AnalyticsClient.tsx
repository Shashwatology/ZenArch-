'use client'

import { useState } from 'react'

export function AnalyticsClient({ initialData }: { initialData: any }) {
  const [dateRange, setDateRange] = useState('30D')
  
  const tabs = [
    { id: 'OVERVIEW', label: 'Overview' },
    { id: 'SALES', label: 'Sales' },
    { id: 'ATTRIBUTION', label: 'Attribution' },
    { id: 'FUNNEL', label: 'Business Funnel' },
    { id: 'AI', label: 'AI Hooks' },
  ]
  const [activeTab, setActiveTab] = useState('OVERVIEW')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-1 border border-white/10 rounded-lg p-1 bg-[#121212]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-white/10 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <select 
          value={dateRange} 
          onChange={(e) => setDateRange(e.target.value)}
          className="bg-[#1A1A1A] text-white border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#C8A97E]"
        >
          <option value="TODAY">Today</option>
          <option value="7D">Last 7 Days</option>
          <option value="30D">Last 30 Days</option>
          <option value="90D">Last 90 Days</option>
          <option value="CUSTOM">Custom Range</option>
        </select>
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#121212] p-6 rounded-xl border border-white/5">
              <h3 className="text-sm text-gray-400 mb-2">Total Events</h3>
              <p className="text-3xl font-light text-white">{initialData.totalEvents}</p>
            </div>
            <div className="bg-[#121212] p-6 rounded-xl border border-white/5">
              <h3 className="text-sm text-gray-400 mb-2">Page Views</h3>
              <p className="text-3xl font-light text-white">{initialData.pageViews}</p>
            </div>
            <div className="bg-[#121212] p-6 rounded-xl border border-white/5">
              <h3 className="text-sm text-gray-400 mb-2">Product Views</h3>
              <p className="text-3xl font-light text-white">{initialData.productViews}</p>
            </div>
            <div className="bg-[#121212] p-6 rounded-xl border border-white/5">
              <h3 className="text-sm text-gray-400 mb-2">Quotes Created</h3>
              <p className="text-3xl font-light text-white">{initialData.quotesCreated}</p>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'FUNNEL' && (
        <div className="bg-[#121212] p-6 rounded-xl border border-white/5 animate-in fade-in space-y-8">
          <h3 className="text-lg font-medium text-white">Business Funnel</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-[#1A1A1A] p-4 rounded-lg">
              <div>
                <span className="text-[#C8A97E] font-medium">1. Visit</span>
                <p className="text-xs text-gray-400">Total unique sessions</p>
              </div>
              <span className="text-xl">100%</span>
            </div>
            <div className="flex justify-between items-center bg-[#1A1A1A] p-4 rounded-lg ml-4">
              <div>
                <span className="text-[#C8A97E] font-medium">2. Interest</span>
                <p className="text-xs text-gray-400">Viewed product or collection</p>
              </div>
              <span className="text-xl text-gray-300">--</span>
            </div>
            <div className="flex justify-between items-center bg-[#1A1A1A] p-4 rounded-lg ml-8">
              <div>
                <span className="text-[#C8A97E] font-medium">3. Enquiry</span>
                <p className="text-xs text-gray-400">Added to wishlist / started quote</p>
              </div>
              <span className="text-xl text-gray-300">--</span>
            </div>
            <div className="flex justify-between items-center bg-[#1A1A1A] p-4 rounded-lg ml-12">
              <div>
                <span className="text-[#C8A97E] font-medium">4. Lead</span>
                <p className="text-xs text-gray-400">Lead profile created</p>
              </div>
              <span className="text-xl text-gray-300">--</span>
            </div>
            <div className="flex justify-between items-center bg-[#1A1A1A] p-4 rounded-lg ml-16">
              <div>
                <span className="text-[#C8A97E] font-medium">5. Quote</span>
                <p className="text-xs text-gray-400">Formal quote sent</p>
              </div>
              <span className="text-xl text-gray-300">--</span>
            </div>
            <div className="flex justify-between items-center bg-[#1A1A1A] p-4 rounded-lg ml-20">
              <div>
                <span className="text-[#C8A97E] font-medium">6. Order</span>
                <p className="text-xs text-gray-400">Converted to authoritative Order</p>
              </div>
              <span className="text-xl text-gray-300">--</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'AI' && (
        <div className="bg-[#121212] p-6 rounded-xl border border-white/5 animate-in fade-in space-y-6">
          <h3 className="text-lg font-medium text-white">AI Hooks & Aggregates</h3>
          <p className="text-sm text-gray-400">
            These metrics are securely exposed to the AI Specialist agents for analysis.
          </p>
          <div className="bg-[#1A1A1A] rounded-lg p-4 font-mono text-xs text-gray-300">
            {`{
  "status": "OBSERVED",
  "timeframe": "${dateRange}",
  "metrics": {
    "page_views": ${initialData.pageViews},
    "quotes_generated": ${initialData.quotesCreated}
  }
}`}
          </div>
        </div>
      )}
    </div>
  )
}
