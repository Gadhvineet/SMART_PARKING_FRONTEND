import {Link} from 'react-router-dom'
function Navbar() {
    return (
        <div>
            <h2>Smart Parking</h2>

            <nav>
               <Link to="/">Home</Link> |{" "}
               <Link to="/login">Login</Link> |{" "}
               <Link to="/signup">Signup</Link> |{" "}
            </nav>
        </div>
    )
}   
export default Navbar