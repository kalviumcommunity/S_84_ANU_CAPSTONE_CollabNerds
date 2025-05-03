import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FrontPage from "./Components/FrontPage";  // Import the FrontPage component

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Define your routes */}
          <Route path="/" element={<FrontPage />} />
          {/* Add other routes as your app grows, like login, dashboard, etc. */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
