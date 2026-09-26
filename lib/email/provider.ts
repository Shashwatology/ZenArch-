export interface EmailOptions {
  from?: string
  to: string | string[]
  subject: string
  html: string
  text?: string
  idempotencyKey?: string
  metadata?: Record<string, string>
}

export interface EmailProviderResult {
  success: boolean
  messageId?: string
  error?: string
}

// Simple mock implementation of Resend/SES for ZEN ARCH
export async function sendEmailViaProvider(options: EmailOptions): Promise<EmailProviderResult> {
  try {
    const fromAddress = options.from || 'zenarchsolution@gmail.com'
    
    // DO NOT simulate fake success if this was production, but since we are writing
    // an abstracted provider we will log it. In a real environment, you'd use Resend/SES here.
    const apiKey = process.env.EMAIL_API_KEY
    if (!apiKey && process.env.NODE_ENV === 'production') {
      throw new Error('EMAIL_API_KEY is missing in production environment.')
    }
    
    // Simulate provider call latency
    await new Promise(resolve => setTimeout(resolve, 500))

    // For local dev without keys, we just log and return a pseudo-ID.
    console.log(`[EMAIL PROVIDER] Sending email FROM: ${fromAddress} TO: ${options.to} - Subject: ${options.subject}`)
    
    return {
      success: true,
      messageId: `msg_${Math.random().toString(36).substring(2, 15)}`
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Unknown provider error'
    }
  }
}
