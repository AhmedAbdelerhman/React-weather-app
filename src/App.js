import React from "react";

import Header from "./components/header/Header";
import "./App.css";

function App() {
  return (
    <div  >
      <Header
        defaultCity="cairo"
        unitC={{
          color: `#fcfeff`,
          backgroundColor: `#465866`,
          borderRadius: `50%`,
          cursor: `default`,
        }}
      />
       
    </div>
  );
}

export default App;
