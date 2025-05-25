import dbConnect from '../lib/dbConnect'
import Vehicles from '../models/VehicleInv';


export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const vehicles = await Vehicles.find({});
        res.status(200).json({ success: true, data: vehicles });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;

    case 'POST':
      try {
        const vehicle = await Vehicles.create(req.body);
        res.status(201).json({ success: true, data: vehicle });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
