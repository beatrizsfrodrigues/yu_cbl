import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, addMessage } from "../../redux/messagesSlice";
import { fetchPresetMessages } from "../../redux/presetMessagesSlice";
import { X } from "react-feather";

function Messages({ onClose }) {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages.data);
  const messagesStatus = useSelector((state) => state.messages.status);
  const presetMessages = useSelector((state) => state.presetMessages.data);
  const presetMessagesStatus = useSelector(
    (state) => state.presetMessages.status
  );
  const error = useSelector((state) => state.messages.error);
  const textSpaceRef = useRef(null);
  const textOptionsRef = useRef(null);
  const [isPresetMessagesOpen, setIsPresetMessagesOpen] = useState(false);

  //* fetch text messages
  useEffect(() => {
    if (messagesStatus === "idle") {
      dispatch(fetchMessages());
    }
  }, [messagesStatus, dispatch]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      const textSpace = textSpaceRef.current;
      textSpace.scrollTop = textSpace.scrollHeight;
    }
  }, [messages]);

  //* fetch preset text messages
  useEffect(() => {
    if (presetMessagesStatus === "idle") {
      dispatch(fetchPresetMessages());
    }
  }, [presetMessagesStatus, dispatch]);

  //* open and close preset text messages
  const handleOpenPresetMessages = () => {
    setIsPresetMessagesOpen(!isPresetMessagesOpen);
  };

  function getFormattedDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  //* send a text message
  const handleAddMessage = (text) => {
    const message = {
      id: messages[0].messages.length + 1,
      senderId: 1,
      receiverId: 2,
      message: text,
      date: getFormattedDate(),
    };

    dispatch(addMessage({ message }));
  };

  //* text messages status info
  if (messagesStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (messagesStatus === "failed") {
    return <div>Error: {error}</div>;
  }

  //* text messages
  let messageContent;
  if (messages && messages.length > 0) {
    const sortedMessages = [...messages[0].messages].sort(
      (a, b) => +a.date - +b.date
    );
    console.log(sortedMessages);
    messageContent = sortedMessages.map((message, index) => {
      const year = message.date.slice(0, 4);
      const month = message.date.slice(4, 6);
      const day = message.date.slice(6, 8);
      const hours = message.date.slice(8, 10);
      const minutes = message.date.slice(10, 12);

      if (message.senderId === 1) {
        return (
          <div key={index} className="textMessage">
            <p className="bubble bubbleBlue">{message.message}</p>

            <p className="dateText textRight">{`${day}/${month}/${year} ${hours}:${minutes}`}</p>
          </div>
        );
      } else if (message.senderId === "app") {
        return (
          <div key={index} className="textMessage">
            <p className="bubble bubbleDotted">{message.message}</p>
            <p className="dateText textLeft">{`${day}/${month}/${year} ${hours}:${minutes}`}</p>
          </div>
        );
      } else {
        return (
          <div key={index} className="textMessage">
            <p className="bubble">{message.message}</p>
            <p className="dateText textLeft">{`${day}/${month}/${year} ${hours}:${minutes}`}</p>
          </div>
        );
      }
    });
  } else {
    messageContent = <div>Não existem mensagens</div>;
  }

  //* preset text messages column 1
  let presetMsgs;
  if (presetMessages && presetMessages.length > 0) {
    presetMsgs = presetMessages.map((message, index) => {
      if (index % 2 === 0) {
        return (
          <button
            key={index}
            className="optionText"
            onClick={() => handleAddMessage(message.message)}
          >
            {message.message}
          </button>
        );
      }
      return null;
    });
  } else {
    presetMsgs = <div>Não existem mensagens</div>;
  }

  //* preset text messages column 2
  let presetMsgs2;
  if (presetMessages && presetMessages.length > 0) {
    presetMsgs2 = presetMessages.map((message, index) => {
      if (index % 2 !== 0) {
        return (
          <button
            key={index}
            className="optionText"
            onClick={() => handleAddMessage(message.message)}
          >
            {message.message}
          </button>
        );
      }
      return null;
    });
  } else {
    presetMsgs2 = <div>Não existem mensagens</div>;
  }

  //* modal
  return (
    <div className="modal">
      <div className="window">
        <div className="header">
          <h3>@amigo</h3>
          <X className="closeWindow" onClick={onClose} />
        </div>
        <div className="line"></div>
        <div
          id="textSpace"
          ref={textSpaceRef}
          className={isPresetMessagesOpen ? "textSpaceSmall" : ""}
        >
          {messageContent}
        </div>
        <div className="inputMessage" onClick={handleOpenPresetMessages}>
          <p>Deixa uma mensagem</p>
        </div>
        {isPresetMessagesOpen && (
          <div id="textOptions" ref={textOptionsRef}>
            <div>{presetMsgs}</div>
            <div>{presetMsgs2}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
