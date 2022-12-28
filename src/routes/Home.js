import { dbServise } from "fbinstance";
import { addDoc, getDocs, query, collection, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Home = () => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const getNweets = async () => {
    const q = query(collection(dbServise, "nweets"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const newwtObj = {
        ...doc.data(),
        id: doc.id,
      };
      setNweets((prev) => [newwtObj, ...prev]);
    });
  };

  useEffect(() => {
    getNweets();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await addDoc(collection(dbServise, "nweets"), {
        nweet,
        createdAt: Date.now(),
      });
      setNweet("");
    } catch (err) {
      console.log(err);
    }
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={nweet}
          onChange={onChange}
          placeholder="what's on yout mind?"
          maxLength={120}
        />
        <input type="submit" value="Nweet" />
      </form>
      <div>
        {console.log(nweets)}
        {nweets.map((nweet) => (
          <div>
            <h4>{nweet.nweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
