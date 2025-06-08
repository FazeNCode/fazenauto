import { NextResponse } from 'next/server';
import CSVExportHandler from '@/lib/syndication/platforms/csv-export';
import { connectToDatabase } from '@/lib/dbConnect';
import Vehicle from '@/models/Vehicle';

/**
 * GET /api/export/csv - Export vehicles to CSV
 */
export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'standard';
    const vehicleIds = searchParams.get('vehicleIds')?.split(',');
    const status = searchParams.get('status') || 'active';
    const make = searchParams.get('make');
    const year = searchParams.get('year');

    // Build filter for vehicles
    let filter = {};
    
    if (vehicleIds && vehicleIds.length > 0) {
      filter._id = { $in: vehicleIds };
    } else {
      // Apply other filters if no specific vehicle IDs
      if (status && status !== 'all') {
        filter.status = status;
      }
      if (make) {
        filter.make = { $regex: make, $options: 'i' };
      }
      if (year) {
        filter.year = parseInt(year);
      }
    }

    // Get vehicles
    const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });
    
    if (vehicles.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No vehicles found matching criteria'
      }, { status: 404 });
    }

    // Generate CSV
    const csvHandler = new CSVExportHandler();
    const csvResult = await csvHandler.generateCSVFile(
      vehicles.map(v => v._id),
      format
    );

    // Return CSV file
    return new NextResponse(csvResult.content, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${csvResult.filename}"`,
        'X-Vehicle-Count': csvResult.vehicleCount.toString(),
        'X-Export-Format': csvResult.format
      }
    });

  } catch (error) {
    console.error('❌ CSV export error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

/**
 * POST /api/export/csv - Generate CSV export with custom settings
 */
export async function POST(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { 
      vehicleIds, 
      format = 'standard', 
      includeFields = [], 
      excludeFields = [],
      customMapping = {}
    } = body;

    if (!vehicleIds || !Array.isArray(vehicleIds) || vehicleIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Vehicle IDs array required'
      }, { status: 400 });
    }

    // Validate format
    const validFormats = ['standard', 'facebook', 'autotrader', 'craigslist'];
    if (!validFormats.includes(format)) {
      return NextResponse.json({
        success: false,
        error: `Invalid format. Valid formats: ${validFormats.join(', ')}`
      }, { status: 400 });
    }

    // Get vehicles
    const vehicles = await Vehicle.find({
      _id: { $in: vehicleIds }
    });

    if (vehicles.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No vehicles found'
      }, { status: 404 });
    }

    // Generate CSV with custom settings
    const csvHandler = new CSVExportHandler();
    const csvData = vehicles.map(vehicle => {
      let data = csvHandler.formatVehicleForCSV(vehicle, { format });
      
      // Apply custom field filtering
      if (includeFields.length > 0) {
        const filteredData = {};
        includeFields.forEach(field => {
          if (data[field] !== undefined) {
            filteredData[field] = data[field];
          }
        });
        data = filteredData;
      }
      
      if (excludeFields.length > 0) {
        excludeFields.forEach(field => {
          delete data[field];
        });
      }
      
      // Apply custom field mapping
      if (Object.keys(customMapping).length > 0) {
        const mappedData = {};
        Object.keys(data).forEach(key => {
          const newKey = customMapping[key] || key;
          mappedData[newKey] = data[key];
        });
        data = mappedData;
      }
      
      return data;
    });

    // Generate CSV content
    if (csvData.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No data to export after filtering'
      }, { status: 400 });
    }

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','), // Header row
      ...csvData.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // Escape commas and quotes
          return typeof value === 'string' && (value.includes(',') || value.includes('"'))
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const filename = `fazenauto_custom_export_${format}_${new Date().toISOString().split('T')[0]}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Vehicle-Count': vehicles.length.toString(),
        'X-Export-Format': format,
        'X-Custom-Export': 'true'
      }
    });

  } catch (error) {
    console.error('❌ Custom CSV export error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

/**
 * GET /api/export/csv/formats - Get available export formats
 */
export async function OPTIONS(request) {
  const formats = {
    standard: {
      name: 'Standard Format',
      description: 'Basic vehicle information in standard format',
      fields: [
        'vin', 'year', 'make', 'model', 'price', 'mileage', 'color',
        'engine', 'transmission', 'drivetrain', 'status', 'primary_image',
        'all_images', 'video_url', 'created_date', 'updated_date'
      ]
    },
    facebook: {
      name: 'Facebook Marketplace',
      description: 'Optimized for Facebook Marketplace import',
      fields: [
        'title', 'description', 'price', 'currency', 'condition', 'year',
        'make', 'model', 'mileage', 'fuel_type', 'transmission',
        'exterior_color', 'body_style', 'image_urls', 'vin'
      ]
    },
    autotrader: {
      name: 'AutoTrader',
      description: 'Compatible with AutoTrader bulk import',
      fields: [
        'stock_number', 'year', 'make', 'model', 'trim', 'body_style',
        'exterior_color', 'interior_color', 'mileage', 'engine',
        'transmission', 'drivetrain', 'fuel_type', 'price', 'description',
        'features', 'image_1', 'image_2', 'image_3', 'image_4', 'image_5', 'vin'
      ]
    },
    craigslist: {
      name: 'Craigslist',
      description: 'Formatted for Craigslist posting templates',
      fields: [
        'posting_title', 'posting_body', 'price', 'year', 'make', 'model',
        'condition', 'cylinders', 'fuel', 'odometer', 'title_status',
        'transmission', 'drive', 'size', 'type', 'paint_color',
        'image_1', 'image_2', 'image_3', 'image_4'
      ]
    }
  };

  return NextResponse.json({
    success: true,
    formats
  });
}
