import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    if (!resend) {
      return NextResponse.json(
        { exists: false, error: 'Service not configured' },
        { status: 503 }
      )
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { exists: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!audienceId) {
      return NextResponse.json({ exists: false })
    }

    // Use contacts.get() to check by email directly - single API call
    try {
      const contact = await resend.contacts.get({
        email: email,
        audienceId: audienceId,
      });

      // If contact exists, contact.data will be populated
      if (contact.data) {
        return NextResponse.json({
          exists: true,
          contactId: contact.data.id
        })
      }

      return NextResponse.json({ exists: false })

    } catch (error: unknown) {
      // Resend returns 404 when contact doesn't exist
      const resendError = error as { statusCode?: number; message?: string }
      if (resendError.statusCode === 404 || resendError.message?.includes('not found')) {
        return NextResponse.json({ exists: false })
      }

      console.error('Contact lookup error:', error);
      // Return false on error so signup can proceed
      return NextResponse.json({ exists: false })
    }

  } catch (error: unknown) {
    console.error('Email check error:', error)

    // Return false on error so signup can proceed
    return NextResponse.json({ exists: false })
  }
}