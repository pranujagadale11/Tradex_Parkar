import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";
import "../CSS/Signup.css";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    name: "",
    password: "",
  });
  const navigate = useNavigate();

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameEmptyError, setNameEmptyError] = useState("");

  const [openeye, setopeneye] = useState(false);

  function Openeye() {
    setopeneye(!openeye);
  }

  // const handleChange = (event) => {
  //   const { target } = event;
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
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    // Prevent empty name field
    if (name === "name" && value.trim() === "") {
      setNameEmptyError("Name field cannot be empty."); // Set an error message
    } else {
      setNameEmptyError(""); // Clear the error message if the name is not empty
    }

    // Existing email and password validation logic
    if (name === "email") {
      if (validateEmail(value)) {
        setFormData({ ...formData, [name]: value });
        setEmailError(""); // Clear the error message if the email is valid
      } else {
        setEmailError("Please enter a valid email address.");
      }
    }  else if (name === 'password') {
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

  const validateEmail = (email) => {
    // This regex pattern ensures the email:
    // - Starts with alphanumeric characters (a-z, A-Z, 0-9).
    // - Is followed by any number of alphanumeric characters, underscores, or hyphens.
    // - Ends with @gmail.com, where:
    //   - The @ symbol is followed by exactly "gmail.com".
    // - No dots or spaces are allowed before the @ symbol.
    const regex = /^[a-zA-Z0-9]+[a-zA-Z0-9_-]*@gmail\.com$/;
    return regex.test(String(email).toLowerCase());
  };
  const validatePassword = (password) => {
    // Check for length, uppercase, lowercase, number, and special character
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(String(password));
   };

  const handleSignup = async (event) => {
    event.preventDefault();
    const { email, username, name, password } = formData;
    const signupEndpoint = `${process.env.REACT_APP_API_URL}/register_user`;

    try {
      const response = await fetch(signupEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, name, password }),
      });

      if (response.ok && emailError === "") {
        const data = await response.json();
        console.log("User registration successful:", data);
        navigate("/");
      } else {
        const errorData = await response.json();
        console.error("User registration failed:", errorData.message);
      }
    } catch (error) {
      console.error("An error occurred during user registration:", error);
    }

    console.log("The form was submitted with the following data:");
    console.log(formData);
  };

  return (
    <div className="backImg">
      <div className="container1 mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h1 className="text-center mb-2">SIGN UP</h1>
            <form className="form" onSubmit={handleSignup}>
              <div className="form-group">
                <label htmlFor="username" style={{ color: "azure" }}>
                  UserName
                </label>
                <input
                  type="text"
                  id="username"
                  className="formFieldInput"
                  style={{ color: "azure" }}
                  placeholder="Enter your username"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" style={{ color: "azure" }}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="formFieldInput"
                  style={{ color: "azure" }}
                  placeholder="Enter your email"
                  name="email"
                  required
                  onChange={handleChange}
                />
                {emailError && <p style={{ color: "red" }}>{emailError}</p>}{" "}
                {/* Display the error message if there is one */}
              </div>
              <div className="form-group">
                <label htmlFor="name" style={{ color: "azure" }}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="formFieldInput"
                  style={{ color: "azure" }}
                  placeholder="Enter your name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
                {nameEmptyError && (
                  <p style={{ color: "red" }}>{nameEmptyError}</p>
                )}{" "}
                {/* Display the name empty error message */}
              </div>
              {/* <input
 type={openeye ? "text" : "password"}
 id="password"
 className="formFieldInput"
 style={{ color: "azure" }}
 placeholder="Enter your password"
 name="password"
 required
 value={formData.password}
 onChange={handleChange}
/>
 */}
              <div className="form-group">
                <label htmlFor="password" style={{ color: "azure" }}>
                  Password
                </label>
                <div style={{ display: "flex" }}>
                  <input
                    type={openeye ? "text" : "password"}
                    id="password"
                    className="formFieldInput"
                    style={{ color: "azure" }}
                    placeholder="Enter your password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <p className="icon" onClick={Openeye}>
                    {!openeye ? <FaEye></FaEye> : <FaRegEyeSlash />}
                  </p>
                </div>
                {passwordError && (
                  <p style={{ color: "red" }}>{passwordError}</p>
                )}{" "}
                {/* Display the password error message */}
              </div>

              <div className="form-group">
                <button type="submit" className="btn btn-primary">
                  REGISTER
                </button>{" "}
                <Link to="/">Existing User?</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
