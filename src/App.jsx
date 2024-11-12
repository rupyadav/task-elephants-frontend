import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Navigation } from "./components/navigation";
import SmoothScroll from "smooth-scroll";
import "./App.css";
import { PrimeReactProvider } from 'primereact/api';
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
        

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {

  return (
    <Router>
      <PrimeReactProvider>
      <Navigation />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PrimeReactProvider>
    </Router>
  );
};

export default App;
