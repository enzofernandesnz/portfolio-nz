import { createRoot } from 'react-dom/client';
import { LanguageProvider } from './language.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <LanguageProvider><App /></LanguageProvider>
);
