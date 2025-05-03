import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import Dashboard from "./Pages/Dashboard";
// import Login from "./Pages/Login";
// import Signup from "./Pages/Signup";
// import ProjectPage from "./Pages/ProjectPage";
// import NotFound from "./Pages/NotFound";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="main-content">
          <Sidebar />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/project/:id" element={<ProjectPage />} />
              <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
