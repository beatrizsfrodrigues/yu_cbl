import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages, sendMessage } from "../../redux/messagesSlice";
import { fetchPresetMessages } from "../../redux/presetMessagesSlice";
import { fetchUsers } from "../../redux/usersSlice.js";
import { getAuthUser } from "../../utils/cookieUtils";
import { X } from "react-feather";
import "./messages.css";

function Messages({}) {
  const dispatch = useDispatch();
  const { data: messages, status } = useSelector((state) => state.messages);

  const authUser = getAuthUser();
  const currentUserId = authUser?._id;

  const [currentUser, setCurrentUser] = useState(null);
  const users = useSelector((state) => state.users.data);
  const usersStatus = useSelector((state) => state.users.status);
  const [partnerUser, setPartnerUser] = useState(null);

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
    if (currentUserId) {
      dispatch(getMessages(currentUserId));
    }
  }, [dispatch, currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;

    const intervalId = setInterval(() => {
      dispatch(getMessages(currentUserId));
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, currentUserId]);

  useEffect(() => {
    if (usersStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [usersStatus, dispatch]);

  useEffect(() => {
    const user =
      users && users.length > 0
        ? users.find((user) => user.id === currentUserId)
        : null;
    setCurrentUser(authUser);

    // ! getPartner
    const partner =
      users && users.length > 0
        ? users.find((u) => u.id === user.partnerId)
        : null;

    if (partner) {
      setPartnerUser(partner);
    }
  }, [users, currentUserId]);

  useEffect(() => {
    if (textSpaceRef.current && messages) {
      textSpaceRef.current.scrollTop = textSpaceRef.current.scrollHeight;
      textSpaceRef.current.style.scrollBehavior = "auto"; // This disables smooth scrolling
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

  //* close preset text messages
  const closePresetMessages = () => {
    setIsPresetMessagesOpen(false);
  };

  //* send a text message
  const handleAddMessage = (text) => {
    console.log(messages);
    dispatch(sendMessage({ message: text, id: messages._id }));
  };

  //* text messages
  let messageContent;

  if (messagesStatus === "loading") {
    messageContent = <div className="loadingMessage">A carregar...</div>;
  } else if (messagesStatus === "failed") {
    messageContent = (
      <div className="errorMessage">Erro ao carregar mensagens</div>
    );
  } else if (
    currentUser &&
    currentUser.partnerId &&
    messagesStatus === "succeeded" &&
    messages != {}
  ) {
    const conversation = messages;

    const sortedMessages = [...conversation.messages].sort(
      (a, b) => +a.date - +b.date
    );
    messageContent = sortedMessages.map((message, index) => {
      const dateString = String(message.date);
      const year = dateString.slice(0, 4);
      const month = dateString.slice(4, 6);
      const day = dateString.slice(6, 8);
      const hours = dateString.slice(8, 10);
      const minutes = dateString.slice(10, 12);

      if (message.receiverId === currentUser.partnerId) {
        if (message.senderType === "app") {
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
              <p
                className="bubble bubbleBlue"
                dangerouslySetInnerHTML={{ __html: message.message }}
              ></p>

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
              <p
                className="bubble"
                dangerouslySetInnerHTML={{ __html: message.message }}
              ></p>
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

      <div id="textSpace" ref={textSpaceRef} onClick={closePresetMessages}>
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
