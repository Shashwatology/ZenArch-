'use server'

import { requireAdmin } from '@/lib/admin/auth'
import prisma from '@/lib/prisma'
import { AgentRole, ZEN_AGENTS } from '@/lib/ai/agents'
import * as tools from '@/lib/ai/tools'

export async function askAgentAction(agentRole: AgentRole, prompt: string) {
  const { dbUser } = await requireAdmin()
  const agent = ZEN_AGENTS[agentRole]

  if (!agent) throw new Error('Agent not found')

  const promptId = `pr_${Date.now()}`

  // 1. Log the prompt
  await prisma.aIAuditLog.create({
    data: {
      userId: dbUser.id,
      agent: agentRole,
      action: 'USER_PROMPT',
      outcome: JSON.stringify({ prompt }),
      promptId
    }
  })

  // 2. Simulate AI parsing the prompt and deciding to call a tool
  let toolCalled: string | null = null
  let toolResult: any = null

  // Extremely basic simulated routing for demo purposes
  if (prompt.toLowerCase().includes('lead') && agent.availableTools.includes('aiGetLead')) {
    toolCalled = 'aiGetLead'
    // Extract a uuid-like string if present, else fallback
    const match = prompt.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)
    if (match) {
      toolResult = await tools.aiGetLead(match[0])
    }
  } else if (prompt.toLowerCase().includes('analytics') && agent.availableTools.includes('aiGetRecentAnalytics')) {
    toolCalled = 'aiGetRecentAnalytics'
    toolResult = await tools.aiGetRecentAnalytics()
  } else if (prompt.toLowerCase().includes('product') && agent.availableTools.includes('aiSearchProducts')) {
    toolCalled = 'aiSearchProducts'
    toolResult = await tools.aiSearchProducts('zen') // hardcoded query for demo
  }

  // 3. Log the tool call
  if (toolCalled) {
    await prisma.aIAuditLog.create({
      data: {
        userId: dbUser.id,
        agent: agentRole,
        action: 'TOOL_CALL',
        tool: toolCalled,
        outcome: JSON.stringify(toolResult || { error: 'No result found' }),
        promptId
      }
    })
  }

  // 4. Return the simulated response
  const responseText = toolCalled 
    ? `I used my tool ${toolCalled} to find some data for you. Here is what I found:\n${JSON.stringify(toolResult, null, 2)}`
    : `As the ${agentRole} agent, I couldn't identify a specific tool to use for that request based on my available tools (${agent.availableTools.join(', ')}). Could you be more specific?`

  await prisma.aIAuditLog.create({
    data: {
      userId: dbUser.id,
      agent: agentRole,
      action: 'AGENT_RESPONSE',
      outcome: JSON.stringify({ response: responseText }),
      promptId
    }
  })

  return { response: responseText, toolCalled, toolResult }
}
