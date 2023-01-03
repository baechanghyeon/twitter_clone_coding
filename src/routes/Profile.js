import { authServise } from "fbinstance";
import { getAuth, updateProfile } from "firebase/auth";
// import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Profile = ({ refreshUser, userObj }) => {
  const auth = getAuth();
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  // LogOut Event Click
  const onLogOutClick = () => {
    auth.signOut();
    history.push("/");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  // const getMyNweets = async () => {
  //   const q = query(
  //     collection(dbServise, "nweets"),
  //     where("creatorId", "==", userObj.uid)
  // where: 필터링 하는 방법을 알려줌
  //   );
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     console.log(doc.id, "=>", doc.data());
  //   });
  // };
  // useEffect(() => {
  //   getMyNweets();
  // }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authServise.currentUser, {
        displayName: newDisplayName,
      });
    }
    refreshUser();
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Display name"
          value={newDisplayName}
          onChange={onChange}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
