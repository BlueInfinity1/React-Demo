import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Search from "./components/Search";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* Logos & Header */}
      <div>
        
      </div>
      <h1>Patients & Doctors Search</h1>

      {/* Search Component */}
      <Search />
    </>
  );
}

export default App;
