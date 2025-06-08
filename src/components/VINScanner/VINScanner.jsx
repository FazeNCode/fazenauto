'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './VINScanner.module.css';

const VINScanner = ({ onVINDetected, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [detectedText, setDetectedText] = useState('');
  const [stream, setStream] = useState(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please ensure camera permissions are granted.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const processImage = async (imageData) => {
    try {
      // Create a simple OCR-like text detection
      // In a real implementation, you'd use a proper OCR library like Tesseract.js
      const response = await fetch('/api/ocr/detect-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (response.ok) {
        const result = await response.json();
        return result.text || '';
      }
    } catch (error) {
      console.error('OCR processing error:', error);
    }
    return '';
  };

  const extractVIN = (text) => {
    // VIN pattern: 17 characters, alphanumeric, no I, O, Q
    const vinPattern = /[A-HJ-NPR-Z0-9]{17}/g;
    const matches = text.match(vinPattern);
    return matches ? matches[0] : null;
  };

  const scanForVIN = async () => {
    if (isScanning) return;
    
    setIsScanning(true);
    setError('');
    
    try {
      const imageData = captureFrame();
      if (!imageData) {
        throw new Error('Failed to capture image');
      }

      // For demo purposes, we'll simulate VIN detection
      // In production, you'd integrate with a proper OCR service
      const simulatedText = await simulateVINDetection(imageData);
      setDetectedText(simulatedText);
      
      const detectedVIN = extractVIN(simulatedText);
      if (detectedVIN) {
        onVINDetected(detectedVIN);
        stopCamera();
        onClose();
      } else {
        setError('No VIN detected. Please ensure the VIN is clearly visible and try again.');
      }
    } catch (err) {
      setError('Failed to scan VIN. Please try again.');
      console.error('VIN scanning error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Simulate VIN detection for demo purposes
  const simulateVINDetection = async (imageData) => {
    // In a real implementation, this would call an OCR service
    // For demo, we'll return a sample VIN
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
    
    // Return a sample VIN for testing
    return 'Sample text 1HGBH41JXMN109186 more text';
  };

  const handleManualInput = () => {
    const manualVIN = prompt('Enter VIN manually:');
    if (manualVIN && manualVIN.length === 17) {
      onVINDetected(manualVIN.toUpperCase());
      stopCamera();
      onClose();
    }
  };

  return (
    <div className={styles.scannerOverlay}>
      <div className={styles.scannerContainer}>
        <div className={styles.header}>
          <h3>Scan VIN Barcode</h3>
          <button onClick={onClose} className={styles.closeBtn}>×</button>
        </div>
        
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={styles.video}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          
          {/* Scanning overlay */}
          <div className={styles.scanningOverlay}>
            <div className={styles.scanFrame}>
              <div className={styles.corner}></div>
              <div className={styles.corner}></div>
              <div className={styles.corner}></div>
              <div className={styles.corner}></div>
            </div>
            <p className={styles.instruction}>
              Position the VIN barcode within the frame
            </p>
          </div>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {detectedText && (
          <div className={styles.detectedText}>
            <strong>Detected:</strong> {detectedText}
          </div>
        )}

        <div className={styles.controls}>
          <button
            onClick={scanForVIN}
            disabled={isScanning}
            className={styles.scanBtn}
          >
            {isScanning ? 'Scanning...' : 'Scan VIN'}
          </button>
          
          <button
            onClick={handleManualInput}
            className={styles.manualBtn}
          >
            Enter Manually
          </button>
        </div>

        <div className={styles.tips}>
          <h4>Tips for better scanning:</h4>
          <ul>
            <li>Ensure good lighting</li>
            <li>Hold camera steady</li>
            <li>Keep VIN clearly visible</li>
            <li>Avoid glare and shadows</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VINScanner;
