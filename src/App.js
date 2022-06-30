import { useEffect } from "react";
import Component from "./components/Component";

function App() {
   return (
      <div className="App">
         <header className="py-3 px-3 bg-dark d-flex justify-content-between">
            <h3 className="text-white">First Assistant</h3>
         </header>
         <Component />
      </div>
   );
}

export default App;
