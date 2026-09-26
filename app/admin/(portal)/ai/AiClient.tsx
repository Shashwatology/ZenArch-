'use client'

import React, { useState } from 'react'
import { ZenAgent } from '@/lib/ai/agents'
import { askAgentAction } from './actions'

export function AiClient({ agents, logs, currentUserId }: { agents: ZenAgent[], logs: any[], currentUserId: string }) {
  const [selectedAgent, setSelectedAgent] = useState<ZenAgent>(agents[0])
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [chat, setChat] = useState<{role: string, content: string}[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt) return

    const userMessage = prompt
    setPrompt('')
    setChat(prev => [...prev, { role: 'USER', content: userMessage }])
    setLoading(true)

    try {
      const result = await askAgentAction(selectedAgent.role, userMessage)
      setChat(prev => [...prev, { role: selectedAgent.role, content: result.response }])
    } catch (e: any) {
      setChat(prev => [...prev, { role: 'ERROR', content: e.message }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 flex flex-col space-y-4">
        {/* Agent Selector */}
        <div className="flex space-x-2 bg-[#1E1E1E] p-2 rounded-xl border border-white/10 overflow-x-auto">
          {agents.map(agent => (
            <button
              key={agent.role}
              onClick={() => { setSelectedAgent(agent); setChat([]); }}
              className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap transition-colors ${
                selectedAgent.role === agent.role 
                ? 'bg-[#C8A97E] text-black font-medium' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {agent.role}
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-[#1E1E1E] border border-white/10 rounded-xl flex flex-col min-h-[500px]">
          <div className="p-4 border-b border-white/10 bg-white/5 rounded-t-xl">
            <h3 className="text-white font-medium">{selectedAgent.role} AGENT</h3>
            <p className="text-xs text-gray-400 mt-1 whitespace-pre-wrap">{selectedAgent.systemPrompt}</p>
            <div className="mt-2 text-xs text-[#C8A97E]">Available Tools: {selectedAgent.availableTools.join(', ')}</div>
          </div>
          
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl p-3 text-sm whitespace-pre-wrap ${
                  msg.role === 'USER' 
                  ? 'bg-[#C8A97E] text-black rounded-tr-none' 
                  : msg.role === 'ERROR'
                  ? 'bg-red-500/20 text-red-200 border border-red-500/50'
                  : 'bg-white/10 text-white rounded-tl-none font-mono text-xs'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-gray-500 text-sm italic">Agent is thinking...</div>
            )}
            {chat.length === 0 && (
              <div className="text-gray-500 text-sm text-center my-10">Start typing to interact with the {selectedAgent.role} agent.</div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
            <div className="flex space-x-4">
              <input 
                type="text" 
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder={`Ask ${selectedAgent.role} Agent...`}
                className="flex-1 bg-[#121212] text-white border border-white/10 p-3 rounded-lg focus:outline-none focus:border-[#C8A97E]"
              />
              <button 
                type="submit" 
                disabled={loading || !prompt}
                className="bg-[#C8A97E] text-black px-6 py-2 rounded-lg font-medium hover:bg-white transition-colors disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="col-span-1 space-y-4">
        <h3 className="text-xl font-light text-white">AI Audit Log</h3>
        <p className="text-xs text-gray-400">Recent AI activity (H5.9). Ephemeral contexts are discarded.</p>
        <div className="bg-[#1E1E1E] border border-white/10 rounded-xl overflow-hidden h-[500px] overflow-y-auto">
          {logs.map(log => (
            <div key={log.id} className="p-3 border-b border-white/10 text-xs hover:bg-white/5">
              <div className="flex justify-between text-gray-500 mb-1">
                <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                <span className="text-[#C8A97E]">{log.agent}</span>
              </div>
              <div className="text-white font-medium">{log.action} {log.tool && `- ${log.tool}`}</div>
              {log.action === 'USER_PROMPT' && (
                <div className="text-gray-400 mt-1 truncate">"{JSON.parse(log.outcome || '{}').prompt}"</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
