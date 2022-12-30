import Nweet from "components/Nweet";
import { dbServise, storageService } from "fbinstance";
import {
  addDoc,
  query,
  collection,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useRef, useState } from "react";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  // 사친 첨부 없이 텍스트만 트윗하고 싶을 때도 있으므로 기본 값 "" 설정
  // 트윗할 때 텍스트만 입력시 이미지 url "" 로 비워두기
  const [attachment, setAttachment] = useState("");

  const fileInput = useRef();

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

  const onSubmit = async (event) => {
    event.preventDefault();
    /** 이미지 첨부하지 않고 텍스트만 올리고 싶을때도 있기 때문에 attachment가 있을 때만 아래 코드 실행
     * 이미지 첨부하지 않은 경우에는 attachmentUrl= " " 이 된다.
     */
    let attachmentUrl = "";
    if (attachment !== "") {
      // 파일 경로 참조 만들기
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      // storage 참조 경로로 파일 업로드 하기
      const response = await uploadString(fileRef, attachment, "data_url");
      // storage 참조 경로에 있는 파일의 URL을 다운로드해서 attachmentURL 변수에 넣어서 업데이트
      attachmentUrl = await getDownloadURL(response.ref);
    }

    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    await addDoc(collection(dbServise, "nweets"), nweetObj);
    setNweet("");
    setAttachment("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;

    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    // 파일 선택 누르고 이미지 한개 선택하고 다시 파일선택 누르고 취소 누르면 오류 => 해결
    if (theFile) {
      reader.readAsDataURL(theFile);
    }
  };

  const onClearPhotoClick = () => {
    setAttachment(null);
    fileInput.current.value = null;
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
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />
        <input type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img
              src={attachment}
              alt="PreView Img"
              width="50px"
              height="50px"
            />
            <button onClick={onClearPhotoClick}>Clear</button>
          </div>
        )}
      </form>
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
