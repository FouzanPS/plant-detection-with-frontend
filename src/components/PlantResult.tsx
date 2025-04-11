import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Stethoscope } from 'lucide-react';
import { PlantIdentification } from '@/types/plant';
import ResultCard from './ResultCard';

interface PlantResultProps {
  plant: PlantIdentification;
  onBack: () => void;
}

interface DiseaseResult {
  result: string;
  confidence: number;
}

const PlantResult: React.FC<PlantResultProps> = ({ plant, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [diseaseResult, setDiseaseResult] = useState<DiseaseResult | null>(null);

  const handleDiseaseAnalysis = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:4050/api/analyze-disease', {
        method: 'POST',
      });

      const data = await res.json();

      if (res.ok) {
        setDiseaseResult(data); // data has { result, confidence }
      } else {
        alert(data.error || 'Failed to analyze disease.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft size={16} />
          Back to Upload
        </Button>
        <h2 className="text-2xl font-bold mb-4">Plant Identification Result</h2>

        <ResultCard plant={plant} />

        <div className="mt-6 text-center">
          <Button 
            onClick={handleDiseaseAnalysis}
            disabled={loading}
            className="flex items-center gap-2 mx-auto"
          >
            <Stethoscope size={18} />
            {loading ? 'Analyzing...' : 'Analyze the Disease of the Plant'}
          </Button>

          {diseaseResult && (
            <div className="mt-4 text-green-600 font-medium">
              <p>Disease: {diseaseResult.result}</p>
              <p>Confidence: {diseaseResult.confidence}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantResult;
