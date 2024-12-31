import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../../redux/messagesSlice";
import { X } from "react-feather";

function Messages({ onClose }) {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages.data);
  const messagesStatus = useSelector((state) => state.messages.status);
  const error = useSelector((state) => state.messages.error);

  useEffect(() => {
    if (messagesStatus === "idle") {
      dispatch(fetchMessages());
    }
  }, [messagesStatus, dispatch]);

  if (messagesStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (messagesStatus === "failed") {
    return <div>Error: {error}</div>;
  }

  let messageContent;
  if (messages && messages.length > 0) {
    messageContent = messages[0].messages.map((message, index) => {
      if (message.senderId === 1) {
        return (
          <div key={index} className="textMessage ">
            <p className="bubble bubbleBlue">{message.message}</p>
            <p className="dateText textRight ">{message.date}</p>
          </div>
        );
      } else {
        return (
          <div key={index} className="textMessage ">
            <p className="bubble">{message.message}</p>
            <p className="dateText textLeft ">{message.date}</p>
          </div>
        );
      }
    });
  } else {
    messageContent = <div>Não existem mensagens</div>;
  }

  return (
    <div className="modal">
      <div className="window">
        <div className="header">
          <h3>@amigo</h3>
          <X className="closeWindow" onClick={onClose} />
        </div>
        <div className="line"></div>
        <div id="textSpace">{messageContent}</div>
        <div className="inputMessage">
          <p>Deixa uma mensagem</p>
        </div>
      </div>
    </div>
  );
}

export default Messages;
