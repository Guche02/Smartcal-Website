import { useNavigate } from "react-router-dom"; // Import useHistory hook to handle navigation

const Navbar = () => {

  const navigate = useNavigate();

  const handleClick= () => {
    navigate('/signup')
  }

  return (
    <nav>
      <div className="nav-logo-container">
        <h1>SmartCal</h1>
      </div>
      <div className="navbar-links-container">
        <a href="/">Home</a>
        <a href="">About</a>
        <button className="primary-button" onClick={handleClick} >Register now!</button>
      </div>
      
    </nav>
  );
};


export default Navbar;
