import React from "react";
import "./myStyles.css";
import { useDispatch, useSelector } from "react-redux";
import { color } from "framer-motion";

function MessageOthers({ props }) {
  const dispatch = useDispatch();
  return (
    <div className={"other-message-container"}>
      <div className={"other-text-content"}>
        <p className={"con-title"} style={{ color: "white" }}>
          {props.sender.name}
        </p>
        <p className={"con-lastMessage"} style={{ color: "white" }}>
          {props.content}
        </p>
      </div>
    </div>
  );
}

export default MessageOthers;
