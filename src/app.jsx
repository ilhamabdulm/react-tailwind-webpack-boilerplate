import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

function Home() {
  return <h1>Home Ground</h1>;
}

function About() {
  return <h1 className="bg-red-200">About Me 2</h1>;
}

function Contact() {
  return <h1>Contact</h1>;
}

function App() {
  return (
    <>
      <h1>My React App</h1>
      <nav className="mb-2 bg-gray-800 text-white p-4">
        <ul className='flex items-center gap-12'>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

export default App;
