/**
 * VIN Decoder Utility using NHTSA API
 * Free government API for vehicle identification number decoding
 */

const NHTSA_API_BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles';

/**
 * Validates VIN format (17 characters, alphanumeric, no I, O, Q)
 * @param {string} vin - Vehicle Identification Number
 * @returns {boolean} - True if VIN format is valid
 */
export const validateVIN = (vin) => {
  if (!vin || typeof vin !== 'string') return false;
  
  // Remove spaces and convert to uppercase
  const cleanVIN = vin.replace(/\s/g, '').toUpperCase();
  
  // Check length
  if (cleanVIN.length !== 17) return false;
  
  // Check for invalid characters (I, O, Q are not allowed in VINs)
  const invalidChars = /[IOQ]/;
  if (invalidChars.test(cleanVIN)) return false;
  
  // Check if all characters are alphanumeric
  const validChars = /^[A-HJ-NPR-Z0-9]+$/;
  return validChars.test(cleanVIN);
};

/**
 * Decodes VIN using NHTSA API
 * @param {string} vin - Vehicle Identification Number
 * @returns {Promise<Object>} - Decoded vehicle information
 */
export const decodeVIN = async (vin) => {
  try {
    // Validate VIN first
    if (!validateVIN(vin)) {
      throw new Error('Invalid VIN format. VIN must be 17 characters long and contain only letters and numbers (no I, O, or Q).');
    }

    const cleanVIN = vin.replace(/\s/g, '').toUpperCase();
    
    // NHTSA API endpoint for VIN decoding
    const url = `${NHTSA_API_BASE}/DecodeVin/${cleanVIN}?format=json`;
    
    console.log('Fetching VIN data from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`NHTSA API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.Results || data.Results.length === 0) {
      throw new Error('No vehicle data found for this VIN');
    }
    
    // Parse the results into a more usable format
    const vehicleData = parseNHTSAResponse(data.Results);
    
    return {
      success: true,
      data: vehicleData,
      raw: data.Results // Keep raw data for debugging
    };
    
  } catch (error) {
    console.error('VIN Decoder Error:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

/**
 * Parses NHTSA API response into structured vehicle data
 * @param {Array} results - Raw NHTSA API results
 * @returns {Object} - Structured vehicle data
 */
const parseNHTSAResponse = (results) => {
  const vehicleData = {};
  
  // Create a map for easy lookup
  const dataMap = {};
  results.forEach(item => {
    if (item.Value && item.Value !== 'Not Applicable' && item.Value !== '') {
      dataMap[item.Variable] = item.Value;
    }
  });
  
  // Map NHTSA fields to our vehicle schema
  return {
    // Basic Information
    make: dataMap['Make'] || '',
    model: dataMap['Model'] || '',
    year: parseInt(dataMap['Model Year']) || new Date().getFullYear(),
    
    // Engine Information
    engine: dataMap['Engine Model'] || '',
    engineCylinders: dataMap['Engine Number of Cylinders'] || '',
    engineHP: dataMap['Engine Brake Horsepower (BHP)'] || '',
    engineLiters: dataMap['Displacement (L)'] || '',
    
    // Transmission & Drivetrain
    transmission: dataMap['Transmission Style'] || '',
    driveType: dataMap['Drive Type'] || '',
    
    // Fuel Information
    fuelType: dataMap['Fuel Type - Primary'] || '',
    
    // Physical Characteristics
    doors: dataMap['Doors'] || '',
    bodyClass: dataMap['Body Class'] || '',
    vehicleType: dataMap['Vehicle Type'] || '',
    
    // Additional Details
    plantCity: dataMap['Plant City'] || '',
    plantState: dataMap['Plant State'] || '',
    plantCountry: dataMap['Plant Country'] || '',
    manufacturer: dataMap['Manufacturer Name'] || '',
    
    // Safety & Ratings
    ncapOverallRating: dataMap['NCAP Overall Rating'] || '',
    
    // Raw VIN for reference
    vin: dataMap['VIN'] || ''
  };
};

/**
 * Maps decoded VIN data to vehicle upload form fields
 * @param {Object} decodedData - Parsed vehicle data from VIN decoder
 * @returns {Object} - Form data object
 */
export const mapVINToFormData = (decodedData) => {
  return {
    // Basic vehicle information
    make: decodedData.make || '',
    model: decodedData.model || '',
    year: decodedData.year || new Date().getFullYear(),
    
    // Engine details
    engine: decodedData.engine || '',
    
    // Transmission
    transmission: decodedData.transmission || '',
    
    // Fuel type
    fuelType: decodedData.fuelType || '',
    
    // Drivetrain
    driveline: decodedData.driveType || '',
    
    // Physical characteristics
    doors: decodedData.doors || '',
    
    // Body style mapping
    bodyStyle: mapBodyClass(decodedData.bodyClass),
    
    // Additional information that can be used for description
    additionalInfo: {
      engineCylinders: decodedData.engineCylinders,
      engineHP: decodedData.engineHP,
      engineLiters: decodedData.engineLiters,
      vehicleType: decodedData.vehicleType,
      manufacturer: decodedData.manufacturer,
      plantInfo: `${decodedData.plantCity}, ${decodedData.plantState}`.replace(', ', '').trim()
    }
  };
};

/**
 * Maps NHTSA body class to our form options
 * @param {string} bodyClass - NHTSA body class
 * @returns {string} - Mapped body style
 */
const mapBodyClass = (bodyClass) => {
  if (!bodyClass) return '';
  
  const bodyClassLower = bodyClass.toLowerCase();
  
  // Map NHTSA body classes to our form options
  const bodyStyleMap = {
    'sedan': 'Sedan',
    'saloon': 'Sedan',
    'coupe': 'Coupe',
    'convertible': 'Convertible',
    'wagon': 'Wagon',
    'hatchback': 'Hatchback',
    'suv': 'SUV',
    'pickup': 'Truck',
    'truck': 'Truck',
    'van': 'Van',
    'minivan': 'Minivan'
  };
  
  // Find matching body style
  for (const [key, value] of Object.entries(bodyStyleMap)) {
    if (bodyClassLower.includes(key)) {
      return value;
    }
  }
  
  // Return original if no mapping found
  return bodyClass;
};

/**
 * Example usage and testing function
 */
export const testVINDecoder = async () => {
  // Test VINs (these are example VINs for testing)
  const testVINs = [
    '1HGBH41JXMN109186', // Honda Civic
    '1FTFW1ET5DFC10312', // Ford F-150
    'JM1BK32F261220174'  // Mazda
  ];
  
  console.log('Testing VIN Decoder...');
  
  for (const vin of testVINs) {
    console.log(`\nTesting VIN: ${vin}`);
    const result = await decodeVIN(vin);
    
    if (result.success) {
      console.log('✅ Success:', result.data);
      const formData = mapVINToFormData(result.data);
      console.log('📝 Form Data:', formData);
    } else {
      console.log('❌ Error:', result.error);
    }
  }
};
