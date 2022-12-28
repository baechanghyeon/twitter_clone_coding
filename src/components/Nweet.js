import React from "react";

const Nweet = ({ nweetObj, isOwner }) => (
  <div>
    <h4>{nweetObj.text}</h4>
    {isOwner && (
      <>
        <button>Delete Btn</button>
        <button>Edit Btn</button>
      </>
    )}
  </div>
);

export default Nweet;
