import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authServise } from "fbinstance";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authServise.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: () =>
            user.updateProfile(user, { displayName: user.displayName }),
        });
        setIsLoggedIn(true);
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authServise.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: () =>
        user.updateProfile(user, { displayName: user.displayName }),
    });
  };

  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={isLoggedIn}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
