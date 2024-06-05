import logo from './logo.svg';
import './App.css';
import SignIn from './components/signIn';
import SignUp from './components/signUp';
import DynamicForm from "./components/DynamicForm";
import Home from './components/home';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


function App() {
  return (
    <Router>
            <Routes>
             
            <Route path="/" element={<SignIn />} />
            <Route path="/signUp" element={<SignUp/>} />
            <Route path="/getForm/:owner_id/:formId" element={<DynamicForm/>} />
            <Route path="/home" element={<Home />} />
           
        
            </Routes>
     
     
    </Router>
  );
}

export default App;
