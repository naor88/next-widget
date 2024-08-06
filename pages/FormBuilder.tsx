import { useState, useEffect } from 'react';
import { NextPage } from 'next';

type Condition = {
  elementLabel: string;
  operator: 'equals' | 'not equals' | 'greater than' | 'less than' | 'greater than or equals' | 'less than or equals';
  value: string;
};

type FormElement = {
  type: string;
  label: string;
  options?: string[];
  navigateToFormId?: string;
  condition?: Condition;
};

type Form = {
  formId: string;
  formElements: FormElement[];
};

const Home: NextPage = () => {
  const [formId, setFormId] = useState<string>('');
  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const [forms, setForms] = useState<string[]>([]);
  const [editingConditionIndex, setEditingConditionIndex] = useState<number | null>(null);
  const [conditionElementLabel, setConditionElementLabel] = useState<string>('');
  const [conditionOperator, setConditionOperator] = useState<Condition['operator']>('equals');
  const [conditionValue, setConditionValue] = useState<string>('');
  const [navigateToFormId, setNavigateToFormId] = useState<string>('');

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await fetch('/api/getForms');
      const data = await response.json();
      setForms(data.forms);
    } catch (error) {
      console.error('Error fetching forms', error);
    }
  };

  const loadForm = async (id: string) => {
    try {
      const response = await fetch(`/api/getForm?id=${id}`);
      const data: Form = await response.json();
      setFormId(data.formId);
      setFormElements(data.formElements || []);  // Ensure formElements is always an array
    } catch (error) {
      console.error('Error loading form', error);
    }
  };

  const handleFormIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormId(event.target.value);
  };

  const addElement = (type: string) => {
    const label = prompt(`Enter label for ${type}:`);
    if (!label) return;

    let options: string[] | undefined;
    if (type === 'select' || type === 'radio' || type === 'checkbox') {
      const opts = prompt('Enter options separated by commas:');
      options = opts?.split(',');
    }

    const navigateToFormId = prompt('Enter the form ID to navigate to (if any):');
    let condition: Condition | undefined = undefined;

    if (navigateToFormId) {
      const elementLabel = prompt('Enter the label of the element that triggers navigation:') as string;
      const operator = prompt('Enter the condition operator (equals, not equals, greater than, less than, greater than or equals, less than or equals):') as Condition['operator'];
      const value = prompt('Enter the value that triggers navigation:') as string;
      condition = { elementLabel, operator, value };
    }

    const newElement = { type, label, options, navigateToFormId, condition } as FormElement;
    setFormElements([...formElements, newElement]);
  };

  const removeElement = (index: number) => {
    const updatedElements = formElements.filter((_, i) => i !== index);
    setFormElements(updatedElements);
  };

  const saveForm = async () => {
    if (!formId) {
      alert('Please enter a form ID');
      return;
    }

    try {
      const response = await fetch('/api/saveForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formId, formElements }),
      });

      if (response.ok) {
        alert('Form saved successfully');
        fetchForms(); // Refresh the list of forms
      } else {
        alert('Error saving form');
      }
    } catch (error) {
      console.error('Error saving form', error);
      alert('Error saving form');
    }
  };

  const evaluateCondition = (condition: Condition, value: string): boolean => {
    const conditionValue = condition.value;
    switch (condition.operator) {
      case 'equals':
        return value === conditionValue;
      case 'not equals':
        return value !== conditionValue;
      case 'greater than':
        return parseFloat(value) > parseFloat(conditionValue);
      case 'less than':
        return parseFloat(value) < parseFloat(conditionValue);
      case 'greater than or equals':
        return parseFloat(value) >= parseFloat(conditionValue);
      case 'less than or equals':
        return parseFloat(value) <= parseFloat(conditionValue);
      default:
        return false;
    }
  };

  const handleInputChange = (element: FormElement, value: string) => {
    if (element.condition && evaluateCondition(element.condition, value)) {
      loadForm(element.navigateToFormId!);
    }
  };

  const editCondition = (index: number) => {
    const element = formElements[index];
    setEditingConditionIndex(index);
    setConditionElementLabel(element.condition?.elementLabel || '');
    setConditionOperator(element.condition?.operator || 'equals');
    setConditionValue(element.condition?.value || '');
    setNavigateToFormId(element.navigateToFormId || '');
  };

  const saveCondition = () => {
    if (editingConditionIndex === null) return;

    const updatedElements = [...formElements];
    const element = updatedElements[editingConditionIndex];
    element.condition = {
      elementLabel: conditionElementLabel,
      operator: conditionOperator,
      value: conditionValue,
    };
    element.navigateToFormId = navigateToFormId;

    setFormElements(updatedElements);
    setEditingConditionIndex(null);
    setConditionElementLabel('');
    setConditionOperator('equals');
    setConditionValue('');
    setNavigateToFormId('');
  };

  const renderFormElement = (element: FormElement, index: number) => (
    <div key={index}>
      <label>{element.label}</label>
      {element.type === 'text' && (
        <input type="text" onChange={(e) => handleInputChange(element, e.target.value)} />
      )}
      {element.type === 'textarea' && <textarea onChange={(e) => handleInputChange(element, e.target.value)} />}
      {element.type === 'select' && (
        <select onChange={(e) => handleInputChange(element, e.target.value)}>
          {element.options?.map((option, idx) => (
            <option key={idx} value={option}>{option}</option>
          ))}
        </select>
      )}
      {element.type === 'radio' && element.options?.map((option, idx) => (
        <div key={idx}>
          <input type="radio" name={element.label} value={option} onChange={(e) => handleInputChange(element, option)} />
          <label>{option}</label>
        </div>
      ))}
      {element.type === 'checkbox' && element.options?.map((option, idx) => (
        <div key={idx}>
          <input type="checkbox" value={option} onChange={(e) => handleInputChange(element, option)} />
          <label>{option}</label>
        </div>
      ))}
      {element.type === 'button' && <button onClick={(e) => handleInputChange(element, 'clicked')}>{element.label}</button>}
      {element.type === 'color' && <input type="color" onChange={(e) => handleInputChange(element, e.target.value)} />}
      {element.type === 'range' && <input type="range" onChange={(e) => handleInputChange(element, e.target.value)} />}
      {element.type === 'date' && <input type="date" onChange={(e) => handleInputChange(element, e.target.value)} />}
      {element.type === 'time' && <input type="time" onChange={(e) => handleInputChange(element, e.target.value)} />}
      {element.type === 'datetime-local' && <input type="datetime-local" onChange={(e) => handleInputChange(element, e.target.value)} />}
      {element.type === 'month' && <input type="month" onChange={(e) => handleInputChange(element, e.target.value)} />}
      {element.type === 'week' && <input type="week" onChange={(e) => handleInputChange(element, e.target.value)} />}
      {element.type === 'file' && <input type="file" onChange={(e) => handleInputChange(element, 'file_selected')} />}
      {element.condition && (
        <div>
          <p>Condition: {element.condition.elementLabel} {element.condition.operator} {element.condition.value}</p>
          <button onClick={() => editCondition(index)}>Edit Condition</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="container">
      <div className="form-list">
        <h2>Forms</h2>
        <ul>
          {forms.map((id) => (
            <li key={id} onClick={() => loadForm(id)}>{id}</li>
          ))}
        </ul>
      </div>
      <div className="builder-preview">
        <div className="builder">
          <h2>Form Builder</h2>
          <div className="form-id">
            <label htmlFor="formId">Form ID: </label>
            <input
              type="text"
              id="formId"
              value={formId}
              onChange={handleFormIdChange}
            />
          </div>
          <div className="buttons">
            <button onClick={() => addElement('text')}>Add Text Input</button>
            <button onClick={() => addElement('textarea')}>Add Textarea</button>
            <button onClick={() => addElement('select')}>Add Select</button>
            <button onClick={() => addElement('radio')}>Add Radio</button>
            <button onClick={() => addElement('checkbox')}>Add Checkbox</button>
            <button onClick={() => addElement('button')}>Add Button</button>
            <button onClick={() => addElement('color')}>Add Color Picker</button>
            <button onClick={() => addElement('range')}>Add Slider</button>
            <button onClick={() => addElement('date')}>Add Date</button>
            <button onClick={() => addElement('time')}>Add Time</button>
            <button onClick={() => addElement('datetime-local')}>Add Datetime</button>
            <button onClick={() => addElement('month')}>Add Month</button>
            <button onClick={() => addElement('week')}>Add Week</button>
            <button onClick={() => addElement('file')}>Add File Upload</button>
            <button onClick={saveForm}>Save Form</button>
          </div>
          <div className="elements">
            {formElements.map((element, index) => (
              <div key={index} className="element">
                <p>{element.label} ({element.type})</p>
                {element.options && <p>Options: {element.options.join(', ')}</p>}
                <button onClick={() => removeElement(index)}>Remove</button>
                {renderFormElement(element, index)}
              </div>
            ))}
          </div>
        </div>
        <div className="preview">
          <h2>Form Preview</h2>
          <div className="preview-elements">
            {formElements.map((element, index) => renderFormElement(element, index))}
          </div>
        </div>
      </div>

      {editingConditionIndex !== null && (
        <div className="condition-editor">
          <h2>Edit Condition</h2>
          <label>
            Element Label:
            <input type="text" value={conditionElementLabel} onChange={(e) => setConditionElementLabel(e.target.value)} />
          </label>
          <label>
            Operator:
            <select value={conditionOperator} onChange={(e) => setConditionOperator(e.target.value as Condition['operator'])}>
              <option value="equals">Equals</option>
              <option value="not equals">Not Equals</option>
              <option value="greater than">Greater Than</option>
              <option value="less than">Less Than</option>
              <option value="greater than or equals">Greater Than or Equals</option>
              <option value="less than or equals">Less Than or Equals</option>
            </select>
          </label>
          <label>
            Value:
            <input type="text" value={conditionValue} onChange={(e) => setConditionValue(e.target.value)} />
          </label>
          <label>
            Navigate to Form ID:
            <input type="text" value={navigateToFormId} onChange={(e) => setNavigateToFormId(e.target.value)} />
          </label>
          <button onClick={saveCondition}>Save Condition</button>
        </div>
      )}

      <style jsx>{`
        .container {
          display: flex;
          padding: 20px;
        }
        .form-list {
          width: 20%;
          border-right: 1px solid #ccc;
          padding-right: 20px;
        }
        .form-list ul {
          list-style: none;
          padding: 0;
        }
        .form-list li {
          cursor: pointer;
          margin-bottom: 10px;
        }
        .builder-preview {
          width: 80%;
          display: flex;
          justify-content: space-between;
        }
        .builder, .preview {
          width: 45%;
        }
        .form-id {
          margin-bottom: 10px;
        }
        .form-id input {
          margin-left: 10px;
        }
        .buttons {
          margin-bottom: 10px;
        }
        .buttons button {
          margin-right: 10px;
        }
        .elements, .preview-elements {
          border: 1px solid #ccc;
          padding: 10px;
          border-radius: 5px;
        }
        .element {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        .element button {
          margin-top: 5px;
        }
        h2 {
          margin-bottom: 10px;
        }
        .condition-editor {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
          z-index: 1000;
        }
        .condition-editor label {
          display: block;
          margin-bottom: 10px;
        }
        .condition-editor input, .condition-editor select {
          margin-left: 10px;
        }
      `}</style>
    </div>
  );
};

export default Home;
