// import React from 'react';

// const AboutUs = () => {
//   return (
//     <section className="py-16 px-8 bg-gray-600 text-black">
//       <div className="container mx-auto">
//         <h2 className="text-4xl font-bold text-center mb-8 text-primary">About Us</h2>
//         <div className="flex flex-col md:flex-row gap-12">
//           {/* Personal Information */}
//           <div className="md:w-1/2">
//             <h3 className="text-2xl font-semibold mb-4">Meet Faisal</h3>
//             <p className="text-lg leading-relaxed">
//               Faisal, the founder of FazeNAuto. With years of experience in the automotive industry, my goal is to provide customers with reliable vehicles and an outstanding buying experience. My journey in the automotive world began with a passion for quality vehicles and a commitment to customer satisfaction. Each vehicle at FazeNAuto is carefully selected to meet high standards, and I’m here to guide you every step of the way.
//             </p>
//           </div>

//           {/* Dealership Information */}
//           <div className="md:w-1/2">
//             <h3 className="text-2xl font-semibold mb-4">About FazeNAuto</h3>
//             <p className="text-lg leading-relaxed">
//               FazeNAuto is dedicated to offering top-quality vehicles and exceptional service. Our inventory is sourced with attention to detail, ensuring each car meets our standards for quality and reliability. Whether you’re looking for a first car, a family vehicle, or a luxury ride, we have a diverse range to meet your needs. Trust, transparency, and commitment to excellence are the values that define us.
//             </p>
//           </div>
//         </div>

//         {/* Additional Info */}
//         <div className="text-center mt-12">
//           <p className="text-lg text-gray-700">
//             At FazeNAuto, we believe in building lasting relationships with our customers. Visit us to explore our inventory and experience service that goes beyond the ordinary.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AboutUs;



import React from 'react';
import './AboutUs.css'; // You should create this CSS file next to this component

const AboutUs = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        <h2 className="about-title">About Us</h2>
        <div className="about-content">
          {/* Personal Information */}
          <div className="about-half">
            <h3 className="about-subtitle">Meet Faisal</h3>
            <p className="about-text">
              Faisal, the founder of FazeNAuto. With years of experience in the automotive industry, my goal is to provide customers with reliable vehicles and an outstanding buying experience. My journey in the automotive world began with a passion for quality vehicles and a commitment to customer satisfaction. Each vehicle at FazeNAuto is carefully selected to meet high standards, and I’m here to guide you every step of the way.
            </p>
          </div>

          {/* Dealership Information */}
          <div className="about-half">
            <h3 className="about-subtitle">About FazeNAuto</h3>
            <p className="about-text">
              FazeNAuto is dedicated to offering top-quality vehicles and exceptional service. Our inventory is sourced with attention to detail, ensuring each car meets our standards for quality and reliability. Whether you’re looking for a first car, a family vehicle, or a luxury ride, we have a diverse range to meet your needs. Trust, transparency, and commitment to excellence are the values that define us.
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="about-footer">
          <p className="about-text-light">
            At FazeNAuto, we believe in building lasting relationships with our customers. Visit us to explore our inventory and experience service that goes beyond the ordinary.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;