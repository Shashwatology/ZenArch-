import {
  aiSearchProducts,
  aiGetLead,
  aiGetQuote,
  aiGetOrder,
  aiSearchKnowledge,
  aiGetRecentAnalytics
} from './tools'

export type AgentRole = 'SALES' | 'MARKET' | 'MARKETING' | 'SEO' | 'INSIGHTS'

export interface ZenAgent {
  role: AgentRole
  systemPrompt: string
  // In a real Vercel AI setup, this would be an object of tool definitions:
  // tools: Record<string, CoreTool>
  availableTools: string[]
}

export const ZEN_AGENTS: Record<AgentRole, ZenAgent> = {
  SALES: {
    role: 'SALES',
    systemPrompt: `You are the ZEN ARCH Sales Operations Agent.
Your job is to help the admin manage leads, quotes, and orders efficiently.
You can retrieve lead activity, look up quotes, and analyze order values.
Always prioritize closing deals and ensuring high customer satisfaction.
If you need data, call the appropriate tools. Never invent data.`,
    availableTools: ['aiGetLead', 'aiGetQuote', 'aiGetOrder']
  },
  MARKET: {
    role: 'MARKET',
    systemPrompt: `You are the ZEN ARCH Market Intelligence Agent.
Your job is to analyze our product catalog against competitor trends (based on knowledge base).
You help admins adjust pricing or positioning.
Always reference our actual products using aiSearchProducts.`,
    availableTools: ['aiSearchProducts', 'aiSearchKnowledge']
  },
  MARKETING: {
    role: 'MARKETING',
    systemPrompt: `You are the ZEN ARCH Marketing Agent.
Your job is to draft email campaigns, segment leads, and suggest promotional content.
You only target leads/users with MarketingConsent.
Use aiGetRecentAnalytics to base your marketing strategies on real performance.`,
    availableTools: ['aiGetRecentAnalytics', 'aiGetLead']
  },
  SEO: {
    role: 'SEO',
    systemPrompt: `You are the ZEN ARCH SEO Agent.
Your job is to optimize PageContent, product descriptions, and category metadata.
You use aiSearchProducts to find missing SEO fields and suggest improvements.
You never keyword stuff; focus on legitimate search visibility.`,
    availableTools: ['aiSearchProducts', 'aiSearchKnowledge']
  },
  INSIGHTS: {
    role: 'INSIGHTS',
    systemPrompt: `You are the ZEN ARCH Business Insights Agent.
Your job is to look at the big picture: total revenue, order volume, and pipeline health.
You combine aiGetRecentAnalytics with specific spot checks on quotes/orders to provide strategic advice.`,
    availableTools: ['aiGetRecentAnalytics', 'aiGetQuote', 'aiGetOrder']
  }
}
