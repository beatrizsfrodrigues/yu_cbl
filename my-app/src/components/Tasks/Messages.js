import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, addMessage } from "../../redux/messagesSlice";
import { fetchPresetMessages } from "../../redux/presetMessagesSlice";
import { fetchUsers } from "../../redux/usersSlice.js";
import { X } from "react-feather";
import "./messages.css";

function Messages({}) {
  const dispatch = useDispatch();
  const currentUserId = JSON.parse(localStorage.getItem("loggedInUser")).id;
  const [currentUser, setCurrentUser] = useState(null);
  const users = useSelector((state) => state.users.data);
  const usersStatus = useSelector((state) => state.users.status);
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
    const user =
      users && users.length > 0
        ? users.find((user) => user.id === currentUserId)
        : null;
    setCurrentUser(user);
  }, [users, currentUserId]);

  useEffect(() => {
    if (textSpaceRef.current && messages && messages.length > 0) {
      textSpaceRef.current.scrollTop = textSpaceRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (usersStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [usersStatus, dispatch]);

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

  //* close preset text messages
  const closePresetMessages = () => {
    setIsPresetMessagesOpen(false);
  };

  //* send a text message
  const handleAddMessage = (text) => {
    const senderId = currentUser.id;
    const receiverId = currentUser.partnerId;

    dispatch(addMessage({ senderId, receiverId, text }));
  };

  //* text messages status info
  if (messagesStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (messagesStatus === "failed") {
    return <div>Error: {error}</div>;
  }

  const partnerUser =
    currentUser && currentUser.partnerId
      ? users.find((user) => user.id === currentUser.partnerId)
      : null;

  //* text messages
  let messageContent;
  if (currentUser && currentUser.partnerId && messages && messages.length > 0) {
    const conversation = messages.find(
      (msg) =>
        msg.usersId.includes(currentUser.id) &&
        msg.usersId.includes(currentUser.partnerId)
    );
    const sortedMessages = [...conversation.messages].sort(
      (a, b) => +a.date - +b.date
    );
    messageContent = sortedMessages.map((message, index) => {
      const year = message.date.slice(0, 4);
      const month = message.date.slice(4, 6);
      const day = message.date.slice(6, 8);
      const hours = message.date.slice(8, 10);
      const minutes = message.date.slice(10, 12);

      if (message.receiverId === currentUser.partnerId) {
        if (message.senderId === "app") {
          return (
            <div key={index} className="textMessage">
              <p
                className="bubble bubbleDotted textRight"
                dangerouslySetInnerHTML={{ __html: message.message }}
              ></p>
              <p className="dateText textRight">{`${day}/${month}/${year} ${hours}:${minutes}`}</p>
            </div>
          );
        } else {
          return (
            <div key={index} className="textMessage">
              <p className="bubble bubbleBlue">{message.message}</p>

              <p className="dateText textRight">{`${day}/${month}/${year} ${hours}:${minutes}`}</p>
            </div>
          );
        }
      } else {
        if (message.senderId === "app") {
          return (
            <div key={index} className="textMessage">
              <p
                className="bubble bubbleDotted"
                dangerouslySetInnerHTML={{ __html: message.message }}
              ></p>
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
            onClick={
              partnerUser ? () => handleAddMessage(message.message) : null
            }
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
            aria-label={`Enviar mensagem: ${message.message}`}
            onClick={
              partnerUser ? () => handleAddMessage(message.message) : null
            }
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

  return (
    <div className="mainBody mainBodyMessages">
      <div className="backgroundDiv"></div>

      <header className="header headerMessages">
        {partnerUser && <div className="profilePic"></div>}
        {partnerUser ? <h3>@{partnerUser.username}</h3> : <h3>parceiro</h3>}
      </header>

      <div className="line"></div>

      <div
        id="textSpace"
        ref={textSpaceRef}
        className="windowBody"
        onClick={closePresetMessages}
      >
        {partnerUser ? (
          messageContent
        ) : (
          <p>
            Não tens parceiro para trocar mensagens! Cria uma ligação no perfil.
          </p>
        )}
      </div>

      {/* Aqui o WRAPPER com opções acima do input */}
      <div className="inputMessageWrapper">
        {isPresetMessagesOpen && (
          <div id="textOptions" ref={textOptionsRef}>
            {presetMessages &&
              presetMessages.map((message, index) => (
                <button
                  key={index}
                  className="optionText"
                  onClick={
                    partnerUser ? () => handleAddMessage(message.message) : null
                  }
                >
                  {message.message}
                </button>
              ))}
          </div>
        )}

        {/* {isPresetMessagesOpen && (
          <div id="textOptions" ref={textOptionsRef}>
            <div>{presetMsgs}</div>
            <div>{presetMsgs2}</div>
          </div>
        )} */}

        {/* Input vira botão ou textarea */}
        <div
          className="inputMessage"
          onClick={handleOpenPresetMessages}
          aria-label="Abrir opções de mensagens predefinidas"
        >
          <p>Deixa uma mensagem</p>
        </div>
      </div>
    </div>
  );
}

export default Messages;
