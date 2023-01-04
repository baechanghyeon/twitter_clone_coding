import { dbServise, storageService } from "fbinstance";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ userObj }) => {
  const [attachment, setAttachment] = useState("");
  const [nweet, setNweet] = useState("");
  const fileInput = useRef();

  const onSubmit = async (event) => {
    if (nweet === "") {
      return;
    }
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
    fileInput.current.value = null;
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
    setAttachment("");
    fileInput.current.value = null;
  };

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          type="text"
          value={nweet}
          onChange={onChange}
          placeholder="what's on yout mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add Photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>

      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        ref={fileInput}
        style={{ opacity: 0 }}
      />

      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            alt="PreView Img"
            style={{ backgroundImage: attachment }}
          />

          <div className="factoryForm__clear" onClick={onClearPhotoClick}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
