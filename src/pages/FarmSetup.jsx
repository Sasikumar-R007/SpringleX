import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFarm } from '../contexts/FarmContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const FarmSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    landSize: '',
    landUnit: 'acres',
    cropType: '',
    soilType: '',
    cropCount: ''
  });

  const { saveFarmData } = useFarm();
  const navigate = useNavigate();

  const cropOptions = [
    'Rice', 'Wheat', 'Sugarcane', 'Corn', 'Tomato', 'Potato', 
    'Cotton', 'Soybean', 'Groundnut', 'Onion', 'Other'
  ];

  const soilOptions = [
    'Clay', 'Loam', 'Sandy', 'Silt', 'Rocky', 'Mixed'
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Save farm data to localStorage and context
    const farmDataToSave = {
      landSize: parseFloat(formData.landSize),
      landUnit: formData.landUnit,
      cropType: formData.cropType,
      soilType: formData.soilType,
      cropCount: parseInt(formData.cropCount),
      setupDate: new Date().toISOString()
    };
    
    saveFarmData(farmDataToSave);
    navigate('/dashboard');
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.landSize && parseFloat(formData.landSize) > 0;
      case 2:
        return formData.cropType;
      case 3:
        return formData.soilType;
      case 4:
        return formData.cropCount && parseInt(formData.cropCount) > 0;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-sprinkle-dark mb-2">
                Land Size
              </h2>
              <p className="text-gray-600 mb-6">
                How much land do you want to irrigate?
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <input
                  type="number"
                  value={formData.landSize}
                  onChange={(e) => updateFormData('landSize', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sprinkle-green focus:border-sprinkle-green"
                  placeholder="Enter size"
                  min="0.1"
                  step="0.1"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  value={formData.landUnit}
                  onChange={(e) => updateFormData('landUnit', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sprinkle-green focus:border-sprinkle-green"
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                </select>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-sprinkle-dark mb-2">
                Crop Type
              </h2>
              <p className="text-gray-600 mb-6">
                What type of crop are you growing?
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {cropOptions.map((crop) => (
                <button
                  key={crop}
                  onClick={() => updateFormData('cropType', crop)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.cropType === crop
                      ? 'border-sprinkle-green bg-green-50 text-sprinkle-green'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-sprinkle-dark mb-2">
                Soil Type
              </h2>
              <p className="text-gray-600 mb-6">
                What type of soil do you have?
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {soilOptions.map((soil) => (
                <button
                  key={soil}
                  onClick={() => updateFormData('soilType', soil)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.soilType === soil
                      ? 'border-sprinkle-green bg-green-50 text-sprinkle-green'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {soil}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-sprinkle-dark mb-2">
                Crop Count
              </h2>
              <p className="text-gray-600 mb-6">
                How many crops/plants are you growing?
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Crops
              </label>
              <input
                type="number"
                value={formData.cropCount}
                onChange={(e) => updateFormData('cropCount', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sprinkle-green focus:border-sprinkle-green"
                placeholder="Enter number of crops"
                min="1"
              />
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sprinkle-dark mb-2">
            Farm Setup
          </h1>
          <p className="text-gray-600">
            Let's set up your farm details for optimal irrigation
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of 4
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round((currentStep / 4) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: '25%' }}
              animate={{ width: `${(currentStep / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
              className="bg-sprinkle-green h-2 rounded-full"
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[300px] mb-8">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-sprinkle-green'
            }`}
          >
            <ArrowLeft size={20} className="mr-2" />
            Previous
          </button>

          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                isStepValid()
                  ? 'bg-sprinkle-green hover:bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
              <ArrowRight size={20} className="ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStepValid()}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                isStepValid()
                  ? 'bg-sprinkle-green hover:bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Complete Setup
              <Check size={20} className="ml-2" />
            </button>
          )}
        </div>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/auth')}
            className="text-sm text-gray-500 hover:text-sprinkle-green transition-colors"
          >
            Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FarmSetup;