import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import SignIn from './pages/SignIn';
import GlobalStyles from './styles/global';

import AppProvider from './context';
import Routes from './routes';

const App: React.FC = () => {
  return (
    <Router>
      <AppProvider>
        <Routes />
      </AppProvider>

      <GlobalStyles />
    </Router>
  );
};

export default App;
