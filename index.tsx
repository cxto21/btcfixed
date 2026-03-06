
import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import App from './App';

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID as string | undefined;

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element");

const root = ReactDOM.createRoot(rootElement);

const appContent = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

root.render(
  PRIVY_APP_ID ? (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#F7931A',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1280px-Bitcoin.svg.png',
        },
        loginMethods: ['email', 'google', 'twitter', 'github', 'apple'],
      }}
    >
      {appContent}
    </PrivyProvider>
  ) : (
    appContent
  ),
);
