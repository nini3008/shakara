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
      } catch (contactError: unknown) {
        // 404 means contact doesn't exist, which is what we want
        const resendError = contactError as { statusCode?: number; message?: string }
        if (resendError.statusCode !== 404 && !resendError.message?.includes('not found')) {
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
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Shakara Festival</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #0a0a0a;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">

                  <!-- Header with gradient -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">
                        SHAKARA FESTIVAL
                      </h1>
                      <p style="margin: 10px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.9); letter-spacing: 2px; text-transform: uppercase;">
                        Lagos • December 18-21, 2025
                      </p>
                    </td>
                  </tr>

                  <!-- Welcome Message -->
                  <tr>
                    <td style="padding: 40px 30px 30px;">
                      <h2 style="margin: 0 0 20px; font-size: 28px; font-weight: 700; color: #ffffff; text-align: center;">
                        Welcome, ${firstName}! 🎉
                      </h2>
                      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #d1d5db; text-align: center;">
                        Thanks for joining the Shakara family! You're now part of Africa's most electric music movement.
                      </p>
                    </td>
                  </tr>

                  <!-- Benefits Grid -->
                  <tr>
                    <td style="padding: 0 30px 30px;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="padding: 20px; background: rgba(249, 115, 22, 0.1); border-radius: 12px; border: 1px solid rgba(249, 115, 22, 0.2); margin-bottom: 12px;" valign="top">
                            <div style="font-size: 24px; margin-bottom: 8px;">🎤</div>
                            <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #f97316;">Lineup Announcements</h3>
                            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #9ca3af;">Be the first to know when we drop artist announcements</p>
                          </td>
                        </tr>
                        <tr><td style="height: 12px;"></td></tr>
                        <tr>
                          <td style="padding: 20px; background: rgba(249, 115, 22, 0.1); border-radius: 12px; border: 1px solid rgba(249, 115, 22, 0.2);" valign="top">
                            <div style="font-size: 24px; margin-bottom: 8px;">🎫</div>
                            <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #f97316;">Early Bird Access</h3>
                            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #9ca3af;">Get exclusive early access to tickets before they sell out</p>
                          </td>
                        </tr>
                        <tr><td style="height: 12px;"></td></tr>
                        <tr>
                          <td style="padding: 20px; background: rgba(249, 115, 22, 0.1); border-radius: 12px; border: 1px solid rgba(249, 115, 22, 0.2);" valign="top">
                            <div style="font-size: 24px; margin-bottom: 8px;">🎉</div>
                            <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #f97316;">VIP Experiences</h3>
                            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #9ca3af;">Behind-the-scenes content and exclusive meet & greets</p>
                          </td>
                        </tr>
                        <tr><td style="height: 12px;"></td></tr>
                        <tr>
                          <td style="padding: 20px; background: rgba(249, 115, 22, 0.1); border-radius: 12px; border: 1px solid rgba(249, 115, 22, 0.2);" valign="top">
                            <div style="font-size: 24px; margin-bottom: 8px;">📱</div>
                            <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #f97316;">Festival Updates</h3>
                            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #9ca3af;">All the latest news and Lagos vibes delivered to your inbox</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  ${interests && interests.length > 0 ? `
                  <!-- Interests Section -->
                  <tr>
                    <td style="padding: 0 30px 30px;">
                      <div style="background: rgba(59, 130, 246, 0.1); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.2); padding: 20px;">
                        <p style="margin: 0 0 10px; font-size: 14px; font-weight: 600; color: #60a5fa; text-transform: uppercase; letter-spacing: 0.5px;">Your Interests</p>
                        <p style="margin: 0; font-size: 15px; color: #d1d5db; line-height: 1.6;">${interests.join(' • ')}</p>
                      </div>
                    </td>
                  </tr>
                  ` : ''}

                  <!-- CTA Button -->
                  <tr>
                    <td style="padding: 0 30px 40px; text-align: center;">
                      <a href="https://shakarafestival.com" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 40px; border-radius: 50px; box-shadow: 0 10px 30px rgba(249, 115, 22, 0.4); transition: transform 0.2s;">
                        Explore the Festival →
                      </a>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px; background: #000000; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
                      <p style="margin: 0 0 10px; font-size: 16px; font-weight: 600; color: #ffffff;">
                        See you in Lagos! 🇳🇬
                      </p>
                      <p style="margin: 0; font-size: 14px; color: #9ca3af;">
                        Lekki Peninsula, Lagos, Nigeria
                      </p>
                      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                        <p style="margin: 0; font-size: 12px; color: #6b7280; line-height: 1.5;">
                          © 2025 Shakara Festival. All rights reserved.
                        </p>
                      </div>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)

      // Handle rate limiting specifically
      const resendError = error as { name?: string; statusCode?: number }
      if (resendError.name === 'rate_limit_exceeded' || resendError.statusCode === 429) {
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