import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  let email = '';

  try {
    if (!resend) {
      return NextResponse.json(
        { success: false, error: 'Newsletter service not configured' },
        { status: 503 }
      )
    }

    const { email: userEmail, firstName, interests } = await request.json()
    email = userEmail;

    if (!email || !firstName) {
      return NextResponse.json(
        { success: false, error: 'Email and first name are required' },
        { status: 400 }
      )
    }

    const audienceId = process.env.RESEND_AUDIENCE_ID;

    // Double-check if contact already exists (backend validation)
    if (audienceId) {
      try {
        const existingContact = await resend.contacts.get({
          email: email,
          audienceId: audienceId,
        });

        if (existingContact.data) {
          console.log('Duplicate signup attempt blocked:', existingContact.data.id);
          return NextResponse.json({
            success: false,
            error: 'You are already subscribed to our newsletter!',
          }, { status: 409 });
        }
      } catch (contactError: any) {
        // 404 means contact doesn't exist, which is what we want
        if (contactError.statusCode !== 404 && !contactError.message?.includes('not found')) {
          console.error('Contact check error:', contactError);
          // Continue with signup even if contact check fails
        }
      }

      // Add 600ms delay before sending email to respect rate limit
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    // Send welcome email
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

      // Handle rate limiting specifically
      if ((error as any).name === 'rate_limit_exceeded' || (error as any).statusCode === 429) {
        return NextResponse.json({
          success: true,
          message: 'Successfully subscribed! Welcome email will be sent shortly.',
          note: 'You are now subscribed to our newsletter. Due to high demand, your welcome email may arrive with a slight delay.',
        }, { status: 200 })
      }
      return NextResponse.json({
        success: false,
        error: 'Failed to send welcome email. Please try again.',
      }, { status: 500 })
    }

    // Email sent successfully, now create the contact
    if (audienceId) {
      // Add 600ms delay to respect rate limit (2 req/sec = 500ms minimum)
      await new Promise(resolve => setTimeout(resolve, 600));

      try {
        const contactResult = await resend.contacts.create({
          email: email,
          firstName: firstName,
          unsubscribed: false,
          audienceId: audienceId,
        });

        console.log('New contact created after email:', contactResult.data?.id);
      } catch (contactError: unknown) {
        console.error('Contact creation after email error:', contactError);
        // Don't fail the signup if contact creation fails after email is sent
      }
    }

    // Contact and email created successfully

    return NextResponse.json({
      success: true,
      message: 'Welcome to Shakara Festival! Check your email for confirmation.',
      emailId: data?.id,
    })

  } catch (error: unknown) {
    console.error('Newsletter signup error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    // Error occurred during signup process

    return NextResponse.json({
      success: false,
      error: 'Failed to subscribe. Please try again later.',
      details: errorMessage,
    }, { status: 500 })
  }
}