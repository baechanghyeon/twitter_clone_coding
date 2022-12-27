import React, { useState } from "react";
import AppRouter from "components/Router";
import { auth } from "fbinstance";

function App() {
  console.log(auth.currentUser);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
      <AppRouter isLoggedIn={isLoggedIn} />
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
