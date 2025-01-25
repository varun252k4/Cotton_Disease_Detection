// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import { Prediction } from './components/Prediction';
import { InteractiveHoverButton } from './components/ui/interactive-hover-button';
import Crop_Recommedations from './components/Crop_Recommendations';
import Fert_Recommedations from './components/Fert_Recommedations';
// import { Signup } from './components/Signup';

const features = [
  {
    title: 'Advanced Detection',
    description: 'State-of-the-art AI model trained on thousands of cotton plant images'
  },
  {
    title: 'Real-time Analysis',
    description: 'Get instant results and recommendations for your cotton crops'
  },
  {
    title: 'Expert Insights',
    description: 'Receive detailed analysis and treatment recommendations'
  }
];

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex justify-center mb-6"
          >
            <Leaf className="h-20 w-20 text-green-600" />
          </motion.div>
          
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl font-bold text-gray-800 mb-6"
          >
            Cotton Disease Detection
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            Protect your cotton crops with advanced AI technology. Get instant disease detection
            and expert recommendations to keep your harvest healthy.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/detect"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Detection
            </Link>
          </motion.div>
            <div className='flex justify-center'>
              <div className='mr-4 mt-8'>
              <InteractiveHoverButton>
                <Link
                  to="/crop_recommedation"
                >
                Crop Recommendation
                </Link> 
              </InteractiveHoverButton>
              </div>
            <div className='mt-8 ml-4'>
            <InteractiveHoverButton>
            <Link to="/fert_recommendation"> 
            Fertilizer Recommendations
            </Link>
          </InteractiveHoverButton>
            </div>
          
            </div>

        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-gray-600 mt-16"
        >
          <p>Trusted by farmers worldwide • 90% accuracy • Instant results</p>
        </motion.div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/detect" element={<Prediction />} />
        <Route path="/crop_recommedation" element={<Crop_Recommedations/>}></Route>
        <Route path="/fert_recommendation" element={<Fert_Recommedations/>}/>
      </Routes>
    </Router>
  );
}

export default App;