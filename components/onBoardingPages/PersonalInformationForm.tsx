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
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
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

interface PersonalInformationFormProps {
  onNext: () => void;
}

const PersonalInformationForm: React.FC<PersonalInformationFormProps> = ({ onNext }) => {
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');

  const isFormValid = fullName !== '' && dob !== '';

  const handleSubmit = () => {
    if (isFormValid) {
      onNext();
    }
  };

  return (
    <FormContainer>
      <Title>Let's Get to Know You Better</Title>
      <FormField>
        <label>Full Name</label>
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
        />
      </FormField>
      <FormField>
        <label>Date of Birth</label>
        <Input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          placeholder="Date of Birth"
        />
      </FormField>
      <Button disabled={!isFormValid} onClick={handleSubmit}>
        Next
      </Button>
      <Link href="#">Why do we ask?</Link>
    </FormContainer>
  );
};

export default PersonalInformationForm;
