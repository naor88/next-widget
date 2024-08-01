import { useState } from 'react';
import styles from '../styles/Widget.module.css';

const DynamicForm = () => {
  const [subForm, setSubForm] = useState<string | null>(null);

  async function fetchCSS() {
    const response = await fetch('/api/styles');
    const css = await response.text();
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  const handleRadioChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;
    try {
      const response = await fetch('/api/get-subform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedValue }),
      });
      const data = await response.json();
      setSubForm(data.data);
      fetchCSS();
    } catch (error) {
      console.error('Error fetching subform:', error);
    }
  };

  return (
    <div>
      <form className={styles.form}>
        <div>
          <label className={styles.label}>
            <input type="radio" value="option1" name="options" onChange={handleRadioChange} />
            Option 1
          </label>
        </div>
        <div>
          <label className={styles.label}>
            <input type="radio" value="option2" name="options" onChange={handleRadioChange} />
            Option 2
          </label>
        </div>
        {/* Render the subform dynamically */}
        {subForm && <div dangerouslySetInnerHTML={{ __html: subForm }} />}
      </form>
    </div>
  );
};

export default DynamicForm;
