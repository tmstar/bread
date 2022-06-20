import Auth0Provider from './hooks/Auth0Provider';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import serviceWorker from './serviceWorkerRegistration';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  // <React.StrictMode> // remove StrictMode for beautiful-dnd
  <BrowserRouter>
    <Auth0Provider>
      <App />
    </Auth0Provider>
  </BrowserRouter>
  // </React.StrictMode>
);

const config = {
  onUpdate: (registration) => {
    const waitingWorker = registration.waiting;
    if (waitingWorker) {
      waitingWorker.addEventListener('statechange', (event) => {
        if (event.target.state === 'activated') {
          window.location.reload();
        }
      });
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  },
};

serviceWorker.register(config);
