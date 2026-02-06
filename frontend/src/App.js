import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import SignUp from "./pages/loginPage/SignUp";
import WelcomeBack from "./pages/loginPage/WelcomeBack";

function App(){
  return (
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/welcome-back" element={<WelcomeBack />} />
        </Routes>
      </div>
  );
}

export default App;
