import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2, AlertCircle, CheckCircle2, Image as ImageIcon, RefreshCcw, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const diseases = {
  Aphids: {
    name: 'Aphids',
    description: 'Small sap-sucking insects causing yellowing and distortion of leaves.',
    recommendations: [
      'Spray neem oil or insecticidal soap.',
      'Introduce natural predators like ladybugs.',
      'Remove heavily infested leaves.',
      'Avoid excessive use of nitrogen-based fertilizers.'
    ]
  },
  army_worm: {
    name: 'Army Worm',
    description: 'Caterpillars feeding on leaves, causing defoliation and crop damage.',
    recommendations: [
      'Use Bacillus thuringiensis (Bt) sprays.',
      'Apply appropriate insecticides.',
      'Implement crop rotation to break the pest cycle.',
      'Regularly monitor fields for egg masses and larvae.'
    ]
  },
  bacterial_blight: {
    name: 'Bacterial Blight',
    description: 'Angular leaf spots with dark brown margins.',
    recommendations: [
      'Apply copper-based bactericides.',
      'Improve air circulation between plants.',
      'Remove infected plant debris.',
      'Use disease-resistant varieties for future planting.'
    ]
  },
  cotton_boll_rot: {
    name: 'Cotton Boll Rot',
    description: 'Reddish-brown lesions on bolls leading to rotting.',
    recommendations: [
      'Improve field drainage to avoid waterlogging.',
      'Apply appropriate fungicides.',
      'Remove and destroy infected bolls.',
      'Avoid overhead irrigation during wet conditions.'
    ]
  },
  green_cotton_boll: {
    name: 'Green Cotton Boll',
    description: 'Underdeveloped cotton bolls with discoloration.',
    recommendations: [
      'Maintain proper fertilization schedules.',
      'Control pest populations using integrated pest management (IPM).',
      'Avoid water stress during boll development.',
      'Ensure timely harvesting to prevent damage.'
    ]
  },
  powdery_mildew: {
    name: 'Powdery Mildew',
    description: 'White powdery fungal growth on leaves and stems.',
    recommendations: [
      'Apply sulfur-based fungicides.',
      'Ensure proper air circulation in the field.',
      'Avoid overhead irrigation to reduce humidity.',
      'Plant resistant varieties if available.'
    ]
  },
  target_spot: {
    name: 'Target Spot',
    description: 'Circular lesions with concentric rings.',
    recommendations: [
      'Apply fungicides at early stages.',
      'Improve drainage in the field.',
      'Maintain proper plant spacing.',
      'Remove affected leaves.'
    ]
  },
  healthy: {
    name: 'Healthy',
    description: 'No disease detected.',
    recommendations: [
      'Continue regular monitoring.',
      'Maintain current agricultural practices.',
      'Follow preventive measures.',
      'Schedule routine inspections.'
    ]
  }
};

export function Prediction() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }
    setError(null);
    setImage(URL.createObjectURL(file));
    setImageFile(file);
    handlePrediction(file);
  }, []);

  const handlePrediction = async (file: File) => {
    setLoading(true); 
    setPrediction(null); 
    setError(null); 

    const formData = new FormData();
    formData.append('file', file); 

    try {
        const response = await fetch('http://127.0.0.1:8000/predict/', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to get prediction');
        }

        const data = await response.json();


        const { predicted_class, confidence } = data;

        setPrediction({
            predicted_class: data.predicted_class,
            confidence: (data.confidence * 100).toFixed(2) + '%',
        });
    } catch (err) {
        setError('Failed to analyze image. Please try again.'); 
        console.error('Prediction error:', err); 
    } finally {
        setLoading(false); 
    }
};


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  const resetState = () => {
    setImage(null);
    setImageFile(null);
    setPrediction(null);
    setError(null);
  };

  const currentDisease = prediction ? diseases[prediction.predicted_class as keyof typeof diseases] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Link
          to="/"
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6">
            <h2 className="text-3xl font-bold text-white text-center">Cotton Disease Detection</h2>
            <p className="text-green-100 text-center mt-2">Upload an image of your cotton plant for analysis</p>
          </div>

          <div className="p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
                    ${isDragActive 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-green-500 hover:bg-green-50'}`}
                >
                  <input {...getInputProps()} />
                  <AnimatePresence mode="wait">
                    {!image ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-2">
                          Drag and drop your image here
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports JPG, JPEG, PNG (max 5MB)
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative"
                      >
                        <img
                          src={image}
                          alt="Cotton plant"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            resetState();
                          }}
                          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        >
                          <RefreshCcw className="h-5 w-5 text-gray-600" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center"
                  >
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                  </motion.div>
                )}
              </div>

              <div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h3>
                  
                  {loading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <Loader2 className="animate-spin h-10 w-10 mx-auto text-green-600 mb-4" />
                      <p className="text-gray-600">Analyzing your image...</p>
                    </motion.div>
                  ) : currentDisease ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center mb-4">
                        <CheckCircle2 className="h-6 w-6 text-green-600 mr-2" />
                        <span className="text-lg font-medium">
                          {currentDisease.name}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {currentDisease.description}
                      </p>
                      <div className="bg-green-100 rounded-lg p-4">
                        <h4 className="font-medium text-green-800 mb-2">Recommendations:</h4>
                        <ul className="text-green-700 text-sm space-y-2">
                          {currentDisease.recommendations.map((rec, index) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <ImageIcon className="h-10 w-10 mx-auto mb-4 opacity-50" />
                      <p>Upload an image to see the analysis</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Tips for best results:</h4>
                  <ul className="text-blue-700 text-sm space-y-2">
                    <li>• Ensure good lighting conditions</li>
                    <li>• Focus on the affected area</li>
                    <li>• Include both healthy and affected parts</li>
                    <li>• Avoid blurry or dark images</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}