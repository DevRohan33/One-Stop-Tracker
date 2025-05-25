import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import IndexPage from './pages';
import AboutPage from './pages/About';
import ParameterChart from './components/ParameterChart';


const ProtectedRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [parameters, setParameters] = useState([]);

  const addParameter = (param) => {
    const newParam = {
      ...param,
      id: Date.now(),
      records: [],
    };
    setParameters([...parameters, newParam]);
  };

  const addRecord = (paramId, record) => {
    setParameters((prev) =>
      prev.map((p) => {
        if (p.id === paramId) {
          return { ...p, records: [...p.records, record] };
        }
        return p;
      })
    );
  };

  return (
    <Router>
      <Routes>
        {/* Redirect to /register if not authenticated */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/register" />
            )
          }
        />

        {/* Auth Pages */}
        <Route
          path="/login"
          element={<LoginPage onLogin={() => setIsAuthenticated(true)} />}
        />
        <Route
          path="/register"
          element={<RegisterPage onRegister={() => setIsAuthenticated(true)} />}
        />

        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <IndexPage parameters={parameters} onAddParameter={addParameter} />
            </ProtectedRoute>
          }
        />

        {/* Protected Parameter Chart */}
        <Route
          path="/parameter-chart/:paramId"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ParameterChart parameters={parameters} onAddRecord={addRecord} />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
