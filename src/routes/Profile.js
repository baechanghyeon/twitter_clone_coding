import { dbServise } from "fbinstance";
import { getAuth } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
const Profile = ({ userObj }) => {
  const auth = getAuth();
  const history = useHistory();
  // LogOut Event Click
  const onLogOutClick = () => {
    auth.signOut();
    history.push("/");
  };

  const getMyNweets = async () => {
    const q = query(
      collection(dbServise, "nweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  };
  useEffect(() => {
    getMyNweets();
  }, []);

  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
