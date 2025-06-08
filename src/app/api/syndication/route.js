import { NextResponse } from 'next/server';
import SyndicationService from '@/lib/syndication';
import { connectToDatabase } from '@/lib/dbConnect';

/**
 * GET /api/syndication - Get available platforms and stats
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const vehicleId = searchParams.get('vehicleId');
    const platform = searchParams.get('platform');

    switch (action) {
      case 'platforms':
        const platforms = SyndicationService.getAvailablePlatforms();
        return NextResponse.json({
          success: true,
          platforms
        });

      case 'status':
        if (!vehicleId) {
          return NextResponse.json({
            success: false,
            error: 'Vehicle ID required for status check'
          }, { status: 400 });
        }
        
        const status = await SyndicationService.getVehicleStatus(vehicleId);
        return NextResponse.json(status);

      case 'stats':
        if (!platform) {
          return NextResponse.json({
            success: false,
            error: 'Platform required for stats'
          }, { status: 400 });
        }
        
        const days = parseInt(searchParams.get('days')) || 30;
        const stats = await SyndicationService.getPlatformStats(platform, days);
        return NextResponse.json(stats);

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: platforms, status, or stats'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Syndication GET error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

/**
 * POST /api/syndication - Syndicate vehicles to platforms
 */
export async function POST(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { vehicleIds, platforms, settings = {} } = body;

    // Validation
    if (!vehicleIds || !Array.isArray(vehicleIds) || vehicleIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Vehicle IDs array required'
      }, { status: 400 });
    }

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Platforms array required'
      }, { status: 400 });
    }

    // Validate platforms
    const availablePlatforms = SyndicationService.getAvailablePlatforms();
    const validPlatforms = availablePlatforms.map(p => p.id);
    const invalidPlatforms = platforms.filter(p => !validPlatforms.includes(p));
    
    if (invalidPlatforms.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Invalid platforms: ${invalidPlatforms.join(', ')}`,
        availablePlatforms: validPlatforms
      }, { status: 400 });
    }

    // Process syndication for each vehicle
    const results = [];
    
    for (const vehicleId of vehicleIds) {
      try {
        const result = await SyndicationService.syndicateVehicle(
          vehicleId, 
          platforms, 
          {
            userId: settings.userId,
            platformSettings: settings.platformSettings || {}
          }
        );
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          vehicleId,
          error: error.message
        });
      }
    }

    // Calculate summary
    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;

    return NextResponse.json({
      success: true,
      summary: {
        total: results.length,
        successful,
        failed,
        platforms: platforms.length
      },
      results
    });

  } catch (error) {
    console.error('❌ Syndication POST error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

/**
 * DELETE /api/syndication - Remove vehicles from platforms
 */
export async function DELETE(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const vehicleIds = searchParams.get('vehicleIds')?.split(',');
    const platforms = searchParams.get('platforms')?.split(',');

    if (!vehicleIds || vehicleIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Vehicle IDs required'
      }, { status: 400 });
    }

    const results = [];
    
    for (const vehicleId of vehicleIds) {
      try {
        const result = await SyndicationService.removeVehicle(vehicleId, platforms);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          vehicleId,
          error: error.message
        });
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;

    return NextResponse.json({
      success: true,
      summary: {
        total: results.length,
        successful,
        failed
      },
      results
    });

  } catch (error) {
    console.error('❌ Syndication DELETE error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
