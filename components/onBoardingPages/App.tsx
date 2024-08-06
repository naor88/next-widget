import React, { useState } from 'react';
import PersonalInformationForm from './PersonalInformationForm';
import CountryResidenceForm from './CountryResidenceForm';

const App: React.FC = () => {
  const [step, setStep] = useState(1);

  const handleBack = () => {
    setStep(step - 1);
  }

  const handleNextStep = () => {
    setStep(step + 1);
  };

  return (
    <>
      {step === 1 && <PersonalInformationForm  onNext={handleNextStep} />}
      {step === 2 && <CountryResidenceForm onBack={handleBack} />}
    </>
  );
};

export default App;
