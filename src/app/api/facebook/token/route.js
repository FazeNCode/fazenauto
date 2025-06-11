import { NextResponse } from 'next/server';

/**
 * POST /api/facebook/token - Exchange short-lived token for long-lived token
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, shortLivedToken, pageId } = body;

    if (action === 'exchange-token') {
      const appId = process.env.FACEBOOK_APP_ID;
      const appSecret = process.env.FACEBOOK_APP_SECRET;

      if (!appId || !appSecret) {
        return NextResponse.json({
          success: false,
          error: 'Facebook app credentials not configured. Please add FACEBOOK_APP_ID and FACEBOOK_APP_SECRET to your .env.local file.'
        }, { status: 400 });
      }

      if (!shortLivedToken) {
        return NextResponse.json({
          success: false,
          error: 'Short-lived token required'
        }, { status: 400 });
      }

      try {
        // Step 1: Exchange short-lived token for long-lived user token
        const userTokenResponse = await fetch(
          `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`
        );

        const userTokenData = await userTokenResponse.json();

        if (userTokenData.error) {
          return NextResponse.json({
            success: false,
            error: `Facebook API Error: ${userTokenData.error.message}`,
            details: userTokenData.error
          }, { status: 400 });
        }

        const longLivedUserToken = userTokenData.access_token;

        // Step 2: Get page access token (if pageId provided)
        let pageAccessToken = null;
        let pageInfo = null;

        if (pageId) {
          const pageTokenResponse = await fetch(
            `https://graph.facebook.com/${pageId}?fields=access_token,name,id&access_token=${longLivedUserToken}`
          );

          const pageTokenData = await pageTokenResponse.json();

          if (pageTokenData.error) {
            return NextResponse.json({
              success: false,
              error: `Failed to get page token: ${pageTokenData.error.message}`,
              userToken: longLivedUserToken,
              userTokenExpires: userTokenData.expires_in
            }, { status: 400 });
          }

          pageAccessToken = pageTokenData.access_token;
          pageInfo = {
            id: pageTokenData.id,
            name: pageTokenData.name
          };
        }

        return NextResponse.json({
          success: true,
          userToken: longLivedUserToken,
          userTokenExpires: userTokenData.expires_in || 5184000, // 60 days default
          pageToken: pageAccessToken,
          pageInfo: pageInfo,
          message: 'Tokens exchanged successfully! Save these tokens securely in your environment variables.'
        });

      } catch (fetchError) {
        console.error('❌ Facebook API request failed:', fetchError);
        return NextResponse.json({
          success: false,
          error: 'Failed to communicate with Facebook API',
          details: fetchError.message
        }, { status: 500 });
      }
    }

    if (action === 'get-pages') {
      if (!shortLivedToken) {
        return NextResponse.json({
          success: false,
          error: 'Access token required'
        }, { status: 400 });
      }

      try {
        // Get user's pages
        const pagesResponse = await fetch(
          `https://graph.facebook.com/me/accounts?access_token=${shortLivedToken}`
        );

        const pagesData = await pagesResponse.json();

        if (pagesData.error) {
          return NextResponse.json({
            success: false,
            error: `Facebook API Error: ${pagesData.error.message}`,
            details: pagesData.error
          }, { status: 400 });
        }

        return NextResponse.json({
          success: true,
          pages: pagesData.data || []
        });

      } catch (fetchError) {
        console.error('❌ Facebook pages request failed:', fetchError);
        return NextResponse.json({
          success: false,
          error: 'Failed to get pages from Facebook API',
          details: fetchError.message
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action. Use: exchange-token or get-pages'
    }, { status: 400 });

  } catch (error) {
    console.error('❌ Facebook token API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

/**
 * GET /api/facebook/token - Test current token validity
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Token parameter required'
      }, { status: 400 });
    }

    // Test token validity
    const response = await fetch(
      `https://graph.facebook.com/me?access_token=${token}`
    );

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({
        success: false,
        error: 'Token is invalid or expired',
        details: data.error
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      tokenValid: true,
      userInfo: data
    });

  } catch (error) {
    console.error('❌ Token validation error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
