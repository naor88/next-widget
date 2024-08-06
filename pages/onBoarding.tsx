import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import App from '../components/onBoardingPages/App';

const IframeComponent: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [contentRef, setContentRef] = useState<Document | null>(null);

  useEffect(() => {
    if (iframeRef.current) {
      setContentRef(iframeRef.current.contentDocument);
    }
  }, []);

  return (
    <iframe
      ref={iframeRef}
      style={{ width: '100%', height: '100%', border: 'none' }}
      title="App in iframe"
    >
      {contentRef &&
        ReactDOM.createPortal(
          <div style={{ width: '100%', height: '100%' }}>
            <App />
          </div>,
          contentRef.body
        )}
    </iframe>
  );
};


const onBoardingWidget = () => {
  return <App />
  // return (
  //   <IframeComponent />
  // );
};

export default onBoardingWidget;
