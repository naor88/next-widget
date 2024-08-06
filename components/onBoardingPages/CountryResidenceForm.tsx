import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f7f8fc;
  height: 100vh;
`;

const Title = styled.h2`
  color: #1f3f96;
`;

const FormField = styled.div`
  margin: 10px 0;
  width: 100%;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const Button = styled.button<{ disabled: boolean }>`
  background-color: ${(props) => (props.disabled ? '#ccc' : '#1f3f96')};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  margin-top: 20px;
`;

const Link = styled.a`
  color: #1f3f96;
  margin-top: 10px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

interface CountryResidenceFormProps {
    onBack: () => void;
}


const CountryResidenceForm: React.FC<CountryResidenceFormProps> = ({ onBack }) => {
    const [country, setCountry] = useState('');
    const [isUSCitizen, setIsUSCitizen] = useState(false);
    const [paysTaxes, setPaysTaxes] = useState(true);

    const isFormValid = country !== '';

    const handleSubmit = () => {
        if (isFormValid) {
            // Handle next steps or form submission
        }
    };

    return (
        <FormContainer>
            <div>
                <Button disabled={false} onClick={onBack}>
                    Back
                </Button>
            </div>
            <Title>What Is Your Current Country of Living?</Title>
            <FormField>
                <label>Country of Residence</label>
                <Input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country of Residence"
                />
            </FormField>
            <CheckboxLabel>
                <Checkbox
                    type="checkbox"
                    checked={isUSCitizen}
                    onChange={(e) => setIsUSCitizen(e.target.checked)}
                />
                I'm a US citizen.
            </CheckboxLabel>
            <CheckboxLabel>
                <Checkbox
                    type="checkbox"
                    checked={paysTaxes}
                    onChange={(e) => setPaysTaxes(e.target.checked)}
                />
                I pay taxes in my country of residence
            </CheckboxLabel>
            <Button disabled={!isFormValid} onClick={handleSubmit}>
                Next
            </Button>
            <Link href="#">Why do we ask?</Link>
        </FormContainer>
    );
};

export default CountryResidenceForm;
