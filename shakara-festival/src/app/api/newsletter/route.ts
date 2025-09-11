import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, interests } = await request.json()

    if (!email || !firstName) {
      return NextResponse.json(
        { success: false, error: 'Email and first name are required' },
        { status: 400 }
      )
    }

    // Check if already subscribed and add to Resend contacts
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (audienceId) {
      try {
        await resend.contacts.create({
          email: email,
          firstName: firstName,
          unsubscribed: false,
          audienceId: audienceId,
        });
      } catch (contactError: unknown) {
        // If contact already exists, return friendly error
        const errorMessage = contactError instanceof Error ? contactError.message : String(contactError)
        const errorName = contactError instanceof Error && 'name' in contactError ? contactError.name : ''
        if (errorMessage.includes('already exists') || errorName === 'validation_error') {
          return NextResponse.json({
            success: false,
            error: 'You are already subscribed to our newsletter!',
          }, { status: 409 });
        }
        console.log('Error adding to audience:', contactError);
        // For other errors, continue with email sending
      }
    } else {
      console.log('RESEND_AUDIENCE_ID not configured - skipping contact creation');
    }

    // Send welcome email with Resend's built-in unsubscribe
    const { data, error } = await resend.emails.send({
      from: 'Shakara Festival <contact@shakarafestival.com>',
      to: [email],
      subject: 'Welcome to Shakara Festival! 🎵',
      // Resend automatically adds unsubscribe headers when using audiences
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 20px; border-radius: 12px;">
          <h1 style="color: #feca57; text-align: center;">Welcome ${firstName}! 🎉</h1>
          
          <p>Thanks for joining the Shakara family! You&apos;re now part of Africa&apos;s most electric music movement.</p>
          
          <h3 style="color: #ff6b9d;">You&apos;ll be the first to know about:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="padding: 8px 0;">🎤 Exclusive lineup announcements</li>
            <li style="padding: 8px 0;">🎫 Early bird ticket access</li>
            <li style="padding: 8px 0;">🎉 VIP experiences and behind-the-scenes content</li>
            <li style="padding: 8px 0;">📱 Festival updates and Lagos vibes</li>
          </ul>
          
          ${interests && interests.length > 0 ? `
            <p><strong style="color: #48dbfb;">Your interests:</strong> ${interests.join(', ')}</p>
          ` : ''}
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://shakarafestival.com" style="background: linear-gradient(135deg, #ff9a56, #ff6b9d); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
              Explore the Festival
            </a>
          </div>
          
          <p style="text-align: center; color: #888; margin-top: 30px;">
            See you in Lagos! 🇳🇬<br>
            December 18-21, 2025 • Victoria Island
          </p>
          
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to send welcome email',
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Welcome to Shakara Festival! Check your email for confirmation.',
      emailId: data?.id,
    })

  } catch (error: unknown) {
    console.error('Newsletter signup error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json({
      success: false,
      error: 'Failed to subscribe. Please try again later.',
      details: errorMessage,
    }, { status: 500 })
  }
}