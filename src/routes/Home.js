import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { dbServise } from "fbinstance";
import { query, collection, onSnapshot, orderBy } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);
  // 사친 첨부 없이 텍스트만 트윗하고 싶을 때도 있으므로 기본 값 "" 설정
  // 트윗할 때 텍스트만 입력시 이미지 url "" 로 비워두기

  useEffect(() => {
    const q = query(
      collection(dbServise, "nweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArr);
    });
  }, []);

  return (
    <div>
      <NweetFactory userObj={userObj} />
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
