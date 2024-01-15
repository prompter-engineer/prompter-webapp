import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '@/lib/global.css'
import { init, BrowserTracing } from '@sentry/react'

if (process.env.NODE_ENV === 'production') {
  init({
    dsn: import.meta.env.SENTRY_DSN,
    integrations: [
      new BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ['localhost', /^https:\/\/prompter\.engineer\/api/]
      })
    ],
    environment: import.meta.env.NODE_ENV,
    release: import.meta.env.VITE_APP_VERSION,
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
