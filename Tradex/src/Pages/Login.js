import React, { useState ,useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";
import   './Login.css';
const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const[openeye,setopeneye]=useState(false);

  function Openeye() {
    setopeneye(!openeye);
  }


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
  if(user!=null){
   navigate("/dash")
  }
  }, []);
 
  const navigate = useNavigate();
 
  // const handleChange = (event) => {
  //   const target = event.target;
  //   const value = target.type === "checkbox" ? target.checked : target.value;
  //   const name = target.name;
    
  //   if (name === 'email') {
  //     if (validateEmail(value)) {
  //       setFormData({ ...formData, [name]: value });
  //       setEmailError(""); // Clear the error message if the email is valid
  //     } else {
  //       setEmailError("Please enter a valid email address.");
  //     }
  //   } else {
  //     setFormData({ ...formData, [name]: value });
  //   }  
  // };
  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
   
    if (name === 'email') {
       if (validateEmail(value)) {
         setFormData({ ...formData, [name]: value });
         setEmailError(""); // Clear the error message if the email is valid
       } else {
         setEmailError("Please enter a valid email address without spaces.");
       }
    } else if (name === 'password') {
      if (validatePassword(value)) {
         setFormData({ ...formData, [name]: value });
         setPasswordError(""); // Clear the password error message if the password is valid
      } else {
         setFormData({ ...formData, [name]: value }); // Still set the value, but show an error
         setPasswordError("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
      }
     
     
    } else {
       setFormData({ ...formData, [name]: value });
    }
   };
   
  // const validateEmail = (email) => {
  // const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // return regex.test(String(email).toLowerCase());}
  const validateEmail = (email) => {
    // Check for spaces
    if (email.includes(' ')) {
       return false;
    }
    // Add your existing email validation logic here
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(String(email).toLowerCase());
   };
   
   const validatePassword = (password) => {
    // Check for length, uppercase, lowercase, number, and special character
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(String(password));
   };
   
 
  const handleLogin = async (event) => {
    event.preventDefault();
    const { email, password } = formData;
 
    const loginEndpoint = `${process.env.REACT_APP_API_URL}/login`;
 
    try {
      const response = await fetch(loginEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email, // Assuming username is the email
          password: password,
        }),
      });
 
      if (response.ok && emailError === "" ) {
        const data = await response.json();
        console.log("Login successful:", data);
        localStorage.setItem('user', JSON.stringify(data));
        // Use navigate instead of history.push
       
        navigate("/dash");
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData.error);
        // Handle login failure, show error message, etc.
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      // Handle network errors or other issues
    }
 
    if(emailError === ""){
    console.log("The form was submitted with the following data:");
    console.log(formData);}
    else{
      console.log("The form was not sent.")
    }
  };
 
 
  return (
    <div className="backImg">
    <div className="login-container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="text-center mb-4">LOGIN</h1>
          <form className="form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email" style={{color: 'azure'}}>Email</label>
              <div className="inp">
              <input
                type="email"
                id="email"
                className="formFieldInput" style={{color:"azure"}}
                placeholder="Enter your email"
                name="email"
                required
                onChange={handleChange}
              />
              <div></div>
              </div>
              {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
            </div>
            <div className="form-group">
 <label htmlFor="password" style={{color: 'azure'}}>Password</label>
 <div className="inp">
    <input
      type={openeye ? "text" : "password"}
      id="password"
      className="formFieldInput" style={{color:"azure"}}
      placeholder="Enter your password"
      name="password"
      required
      value={formData.password}
      onChange={handleChange}
    />
    <p className="icon" onClick={Openeye}>{!openeye?<FaEye></FaEye>:<FaRegEyeSlash />}</p>
 </div>
 {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
</div>

         
            <div className="form-group">
              <button type="submit" className="btn btn-primary">
                LOGIN
              </button>{" "}
              <Link to="/signup" >
                New User?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};
 
export default LoginForm;