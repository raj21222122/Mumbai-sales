import React from 'react';
import { ChevronRight, Check } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const steps = [
  { id: 1, title: 'Overview', description: 'Dataset & Cleaning' },
  { id: 2, title: 'Trends', description: 'Sales Over Time' },
  { id: 3, title: 'Stores', description: 'Performance Analysis' },
  { id: 4, title: 'Products', description: 'Category Insights' },
  { id: 5, title: 'Profitability', description: 'Margin Analysis' },
  { id: 6, title: 'Simulator', description: 'Business Investment' },
  { id: 7, title: 'Insights', description: 'Recommendations & Evidence' },
  { id: 8, title: 'Summary', description: 'Conclusion' }
];

export const Stepper: React.FC<StepperProps> = ({ currentStep, onStepClick }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between overflow-x-auto">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div 
              className={`flex items-center cursor-pointer transition-all duration-300 ${
                currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
              }`}
              onClick={() => onStepClick(step.id)}
            >
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  currentStep > step.id 
                    ? 'bg-green-500 text-white' 
                    : currentStep === step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {currentStep > step.id ? <Check size={16} /> : step.id}
              </div>
              <div className="ml-3">
                <div className="text-sm font-semibold">{step.title}</div>
                <div className="text-xs opacity-70">{step.description}</div>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <ChevronRight 
                size={20} 
                className={`mx-4 transition-colors duration-300 ${
                  currentStep > step.id ? 'text-green-500' : 'text-gray-300'
                }`} 
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
};