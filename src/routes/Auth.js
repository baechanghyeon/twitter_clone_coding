import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";

import React, { useState } from "react";

const Auth = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const [newAccount, setNewAccount] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const { email, password } = inputs;

  const onChange = (event) => {
    const { name, value } = event.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      const auth = getAuth();
      if (newAccount) {
        data = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        data = await signInWithEmailAndPassword(auth, email, password);
      }
      console.log(data);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const toggleAccout = () => {
    setNewAccount((prev) => !prev);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
        {errorMsg}
      </form>
      <span onClick={toggleAccout}>
        {newAccount ? "Log In" : "Create Account"}
      </span>
      <div>
        <button>Continue with Google</button>
        <button>Continue with Github</button>
      </div>
    </div>
  );
};

export default Auth;
