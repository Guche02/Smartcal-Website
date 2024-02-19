import { BrowserRouter as Router} from "react-router-dom";
import "./App.css";
import AppRoutes from './Routes';


const App = () => {
  return (
      <div className="App">
        <AppRoutes />
      </div>
  );
};

export default App
