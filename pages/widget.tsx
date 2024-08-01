import React from 'react';
import DynamicForm from '../components/DynamicForm';
import styles from '../styles/Widget.module.css';

const WidgetPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dynamic Form Widget</h1>
      <DynamicForm />
    </div>
  );
};

export default WidgetPage;
