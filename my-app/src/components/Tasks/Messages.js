import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { getMessages, sendMessage } from "../../redux/messagesSlice";
import { fetchPresetMessages } from "../../redux/presetMessagesSlice";
import { getAuthUser } from "../../utils/cookieUtils";
import { fetchPartnerUser } from "../../redux/usersSlice";
import { X } from "react-feather";
import "./messages.css";
import Avatar from "../Avatar.jsx";  

// Memoized selectors
const selectMessages = createSelector(
  (state) => state.messages?.data,
  (messages) => (messages ? { ...messages } : { messages: [] }) // Ensure a new object is returned
);

const selectUsers = createSelector(
  (state) => state.users?.data,
  (users) => (users ? [...users] : []) // Ensure a new array is returned
);

const selectPresetMessages = createSelector(
  (state) => state.presetMessages?.data,
  (presetMessages) => (presetMessages ? [...presetMessages] : []) // Ensure a new array is returned
);

function Messages({}) {
  const dispatch = useDispatch();

  const accessories = useSelector((state) => state.accessories.data);
  // Use memoized selectors
  const messages = useSelector(selectMessages);

  const users = useSelector(selectUsers);
  const presetMessages = useSelector(selectPresetMessages);

  const authUser = getAuthUser();
  console.log(messages);
  const currentUserId = authUser?._id;

  const currentUser = useSelector((state) => state.user.authUser);
  const partnerUser = useSelector((state) => state.user.partnerUser);

  const messagesStatus = useSelector((state) => state.messages.status);
  const presetMessagesStatus = useSelector(
    (state) => state.presetMessages.status
  );
  const error = useSelector((state) => state.messages.error);
  const textSpaceRef = useRef(null);
  const textOptionsRef = useRef(null);
  const [isPresetMessagesOpen, setIsPresetMessagesOpen] = useState(false);

  //* fetch text messages

  useEffect(() => {
    if (authUser?._id) {
      dispatch(getMessages(authUser._id));
    }
  }, [dispatch, authUser?._id]); // Ensure the dependency is stable and correct

  useEffect(() => {
    if (!authUser?._id) return;

    const intervalId = setInterval(() => {
      dispatch(getMessages(authUser._id));
    }, 5000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [dispatch, authUser?._id]); // Use stable dependency for the interval

  useEffect(() => {
    if (authUser?.partnerId) {
      // só isto, sem payload
      dispatch(fetchPartnerUser(authUser.partnerId));
    }
  }, [authUser?.partnerId, dispatch]);



  

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
  console.log(messagesStatus);
  console.log(authUser);
  if (messagesStatus === "loading") {
    messageContent = <div className="loadingMessage">A carregar...</div>;
  } else if (messagesStatus === "failed") {
    messageContent = (
      <div className="errorMessage">Erro ao carregar mensagens</div>
    );
  } else if (
    authUser &&
    authUser.partnerId &&
    messagesStatus === "succeeded" &&
    messages != {}
  ) {
    console.log("ola");
    const conversation = messages;
    console.log(conversation.messages);

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

      if (message.receiverId === authUser.partnerId) {
        console.log("olaaa");
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
        {partnerUser && (
        <Avatar
            mascot={partnerUser.mascot}
            equipped={partnerUser.accessoriesEquipped || {}}
            accessoriesList={accessories}
            size={54}
          />

        )}
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
