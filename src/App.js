import logo from './logo.svg';
import './App.css';
import Employee from './screens/Employee';
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import DisplayAllEmployee from './screens/DisplayAllEmployee';
import DashBoard from './screens/DashBoard';
import AdminLogin from './screens/AdminLogin';
import Delivery from './screens/Delivery';
import DisplayAllProduct from './screens/DisplayAllProduct';

function App() {
  return (
    <div className="App">
     <Router>
        <Routes>
        <Route element={<Employee/>} path="/" />
        <Route element={<DisplayAllEmployee/>} path="/displayallemployee" />

        <Route element={<Delivery/>} path="/product" />
        <Route element={<DisplayAllProduct/>} path="/displayallproduct" />

      <Route element={<DashBoard/>} path="/dashboard/*" />
      <Route element={<AdminLogin/>} path="/adminlogin" />
        </Routes>
        </Router>
    </div>
  );
}

export default App;
