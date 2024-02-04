import "./App.css";
import Navbar from "./Components/Navbar";
import Registration from "./Components/Register";
import AppRoutes from './Routes';


const App = () => {

 
  return (
    <div className="App">
      <Navbar />
      <AppRoutes /> 

    </div>
  )
}

export default App
