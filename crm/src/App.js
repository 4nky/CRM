import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './loginComponent/login';
import { SalesExecutivePage } from './employee/salesExecutive';
import { AdminPage } from './employee/admin';

function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/sales-executive" element={<SalesExecutivePage />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
