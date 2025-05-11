import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import IndexPage from './pages';
import AboutPage from './pages/About';
import ParameterChart from './components/ParameterChart';
import ParameterList from './components/ParameterList';
import { useState } from 'react';

function App() {
  const [parameters , setParameters] = useState([])
  const addParameter = (param) => {
    const newParam = {
      ...param,
      id: Date.now(),
      records: [],
    };
    setParameters([...parameters, newParam]);
  };

  const addRecord = (paramId, record) => {
    setParameters(prev => prev.map(p => {
      if (p.id === paramId) {
        return { ...p, records: [...p.records, record] };
      }
      return p;
    }));
  };
  
  
  return (
    <Router>
      <Routes>
        <Route 
          path="/"
          element={
            <IndexPage
            parameters={parameters}
            onAddParameter={addParameter}
            />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route 
          path="/parameter-chart/:paramId"
          element={
            <ParameterChart
              parameters={parameters}
              onAddRecord={addRecord}
            />
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
