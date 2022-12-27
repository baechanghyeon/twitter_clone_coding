import { getAuth } from "firebase/auth";
import React from "react";
import { useHistory } from "react-router-dom";
const Profile = () => {
  const auth = getAuth();
  const history = useHistory();
  // LogOut Event Click
  const onLogOutClick = () => {
    auth.signOut();
    history.push("/");
  };

  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
