import { NextRequest, NextResponse } from 'next/server';
import { WebhookPayloadSchema } from '@/lib/types/embed.types';
import { isValidWebhookUrl } from '@/lib/utils/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { webhookUrl, ...payload } = body;
    
    // Validate webhook URL
    if (!webhookUrl || !isValidWebhookUrl(webhookUrl)) {
      return NextResponse.json(
        { error: 'Invalid Discord webhook URL' },
        { status: 400 }
      );
    }
    
    // Validate payload
    try {
      WebhookPayloadSchema.parse(payload);
    } catch (error: any) {
      return NextResponse.json(
        { error: 'Invalid embed data', details: error.errors },
        { status: 400 }
      );
    }
    
    // Send to Discord webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Failed to send webhook';
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
