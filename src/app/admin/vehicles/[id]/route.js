import Vehicle from '@/models/Vehicle';
import connectDB from '@/lib/mongoose';

export async function GET(req, { params }) {
  await connectDB();

  try {
    const vehicle = await Vehicle.findById(params.id);
    if (!vehicle) {
      return new Response('Vehicle not found', { status: 404 });
    }
    return new Response(JSON.stringify(vehicle), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response('Error fetching vehicle', { status: 500 });
  }
}
