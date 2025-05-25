// pages/api/vehicles/upload.js

import multer from 'multer';
import nextConnect from 'next-connect';

// Configure Multer
const upload = multer({ dest: 'uploads/' });

// Create handler with nextConnect
const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Something went wrong: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

// Middleware for single file
apiRoute.use(upload.single('file'));

// Handle POST request
apiRoute.post((req, res) => {
  res.status(200).json({ message: 'Upload successful!', file: req.file });
});

export default apiRoute;

// Important for multer to work
export const config = {
  api: {
    bodyParser: false,
  },
};
