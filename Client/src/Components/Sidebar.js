import React, { useContext, useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IconButton } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../Features/themeSlice";
import axios from "axios";
import { refreshSidebarFun } from "../Features/refreshSidebar";
import { myContext } from "./MainContainer";

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { refresh, setRefresh } = useContext(myContext);
  const [conversations, setConversations] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const nav = useNavigate();
  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }

  const user = userData.data;
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios
      .get("https://mernproj-uh8p.onrender.com/chat/", config)
      .then((response) => {
        setConversations(response.data);
        setRefresh(!refresh);
      });
  }, [refresh]);

  return (
    <div className="sidebar-container">
      <div className={"sb-header"}>
        <div className="other-icons">
          <IconButton
            onClick={() => {
              nav("/app/welcome");
            }}
          >
            <AccountCircleIcon className={"icon"} />
          </IconButton>

          <IconButton
            onClick={() => {
              navigate("users");
            }}
          >
            <PersonAddIcon className={"icon"} />
          </IconButton>
          <IconButton
            onClick={() => {
              navigate("groups");
            }}
          >
            <GroupAddIcon className={"icon"} />
          </IconButton>
          <IconButton
            onClick={() => {
              navigate("create-groups");
            }}
          >
            <AddCircleIcon className={"icon"} />
          </IconButton>

          <IconButton
            onClick={() => {
              localStorage.removeItem("userData");
              navigate("/");
            }}
          >
            <ExitToAppIcon className={"icon"} />
          </IconButton>
        </div>
      </div>
      <div className={"sb-search"}>
        <IconButton className={"search-icon"}>
          <SearchIcon />
        </IconButton>
        <input placeholder="Search" className={"search-box"} />
      </div>
      <div className={"sb-conversations"}>
        {conversations.map((conversation, index) => {
          var chatName = "";
          if (conversation.isGroupChat) {
            chatName = conversation.chatName;
          } else {
            conversation.users.map((user) => {
              if (user._id != userData.data._id) {
                chatName = user.name;
              }
            });
          }
          if (conversation.users.length === 1) {
            return <div key={index}></div>;
          }
          if (conversation.latestMessage === undefined) {
            return (
              <div
                key={index}
                onClick={() => {
                  dispatch(refreshSidebarFun());
                  setRefresh(!refresh);
                }}
              >
                <div
                  key={index}
                  className="conversation-container"
                  onClick={() => {
                    navigate("chat/" + conversation._id + "&" + chatName);
                  }}
                >
                  <p className={"con-icon"}>{chatName[0]}</p>
                  <p className={"con-title"}>{chatName}</p>

                  <p className="con-lastMessage">
                    No previous Messages, click here to start a new chat
                  </p>
                  <p className={"con-timeStamp"}>{conversation.timeStamp}</p>
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={index}
                className="conversation-container"
                onClick={() => {
                  navigate("chat/" + conversation._id + "&" + chatName);
                }}
              >
                <p className={"con-icon"}>{chatName[0]}</p>
                <p className={"con-title"}>{chatName}</p>

                <p className="con-lastMessage">
                  {conversation.latestMessage.content}
                </p>
                <p className={"con-timeStamp"}>{conversation.timeStamp}</p>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default Sidebar;
