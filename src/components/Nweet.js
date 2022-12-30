import { dbServise, storageService } from "fbinstance";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  const NweetTextRef = doc(dbServise, "nweets", `${nweetObj.id}`);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are ypu sure you want to delete this nweet?");
    const urlRef = ref(storageService, nweetObj.attachmentUrl);
    if (ok) {
      await deleteDoc(NweetTextRef);
      await deleteObject(storageService, urlRef);
    }
  };

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(NweetTextRef, {
      text: newNweet,
    });
    setEditing(false);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your nweet"
              value={newNweet}
              required
              onChange={onChange}
            />
            <input type="submit" value="Update Nweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Btn</button>
              <button onClick={toggleEditing}>Edit Btn</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
