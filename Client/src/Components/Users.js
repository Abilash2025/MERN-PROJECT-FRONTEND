import React, { useContext, useEffect, useState } from "react";
import "./myStyles.css";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import logo from "../Images/Logo.png";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { refreshSidebarFun } from "../Features/refreshSidebar";
import { myContext } from "./MainContainer";

function Users() {
  const { refresh, setRefresh } = useContext(myContext);
  const [users, setUsers] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const nav = useNavigate();
  const dispatch = useDispatch();

  if (!userData) {
    console.log("User not Authenticated");
    nav(-1);
  }

  useEffect(() => {
    console.log("Users refreshed");
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
    axios
      .get("https://mernproj-uh8p.onrender.com/user/fetchUsers", config)
      .then((data) => {
        setUsers(data.data);
      });
  }, [refresh]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{
          duration: "0.3",
        }}
        className="list-container"
      >
        <div className={"ug-header"}>
          <img
            src={logo}
            style={{ height: "2rem", width: "2rem", marginLeft: "10px" }}
          />
          <p className={"ug-title"}>Available Users</p>
          <IconButton
            onClick={() => {
              setRefresh(!refresh);
            }}
          >
            <RefreshIcon className={"icon"} />
          </IconButton>
        </div>
        <div className={"sb-search"}>
          <IconButton>
            <SearchIcon className={"icon"} />
          </IconButton>
          <input placeholder="Search" className={"search-box"} />
        </div>
        <div className="ug-list">
          {users.map((user, index) => {
            return (
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={"list-tem"}
                key={index}
                onClick={() => {
                  const config = {
                    headers: {
                      Authorization: `Bearer ${userData.data.token}`,
                    },
                  };
                  axios.post(
                    "https://mernproj-uh8p.onrender.com/chat",
                    {
                      userId: user._id,
                    },
                    config
                  );
                  dispatch(refreshSidebarFun());
                }}
              >
                <p className={"con-icon"}>{user.name[0]}</p>
                <p className={"con-title"}>{user.name}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Users;
