import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { getMessages, sendMessage } from "../../redux/messagesSlice";
import { fetchPresetMessages } from "../../redux/presetMessagesSlice";
import { getAuthUser } from "../../utils/storageUtils";
import { fetchPartnerUser } from "../../redux/usersSlice";
import LoadingScreen from "../LoadingScreen";

import "./messages.css";
import Avatar from "../Avatar.jsx";

const selectMessages = createSelector(
  (state) => state.messages?.data,
  (messages) => messages || { messages: [] }
);

const selectPresetMessages = createSelector(
  (state) => state.presetMessages?.data,
  (presetMessages) => (presetMessages ? [...presetMessages] : [])
);

function Messages() {
  const dispatch = useDispatch();

  const accessories = useSelector((state) => state.accessories.data);
  // Use memoized selectors
  const messages = useSelector(selectMessages);

  const presetMessages = useSelector(selectPresetMessages);

  const authUser = getAuthUser();

  const partnerUser = useSelector((state) => state.user.partnerUser);

  const messagesStatus = useSelector((state) => state.messages.fetchStatus);

  const presetMessagesStatus = useSelector(
    (state) => state.presetMessages.status
  );

  const textSpaceRef = useRef(null);
  const textOptionsRef = useRef(null);
  const [isPresetMessagesOpen, setIsPresetMessagesOpen] = useState(false);
  const [hasPolled, setHasPolled] = useState(false);

  const [myMessages, setMyMessages] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const limit = 5;

  const prevMyMessagesRef = React.useRef([]);

  //* fetch text messages

  useEffect(() => {
    if (!authUser?._id) return;

    const fetchMessages = async () => {
      try {
        const myResult = await dispatch(
          getMessages({ userId: authUser._id, page: currentPage, limit })
        ).unwrap();

        if (myResult.messages) {
          setMyMessages((prev) => {
            const prevMessages = prev.messages || [];
            const combined = [...prevMessages, ...myResult.messages];
            return {
              ...myResult,
              messages: [...new Map(combined.map((m) => [m._id, m])).values()],
            };
          });

          if (myResult.messages.length < limit) {
            setHasMoreMessages(false);
          }
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();
  }, [authUser?._id, currentPage, dispatch]);

  useEffect(() => {
    let isMounted = true;
    const POLL_INTERVAL = 5000;
    const pollMessages = async () => {
      try {
        if (authUser?._id) {
          const myResult = await dispatch(
            getMessages({ userId: authUser._id, page: currentPage, limit })
          ).unwrap();

          if (
            JSON.stringify(myResult.messages) !==
            JSON.stringify(prevMyMessagesRef.current)
          ) {
            setMyMessages((prev) => {
              const prevMessages = prev.messages || [];
              const combined = [...prevMessages, ...myResult.messages];
              return {
                ...myResult,
                messages: [
                  ...new Map(combined.map((m) => [m._id, m])).values(),
                ],
              };
            });
            prevMyMessagesRef.current = myResult.messages;
          }
        }

        if (isMounted && !hasPolled) setHasPolled(true);
      } catch (err) {
        console.error("Failed to poll messages:", err);
      }
    };
    pollMessages();
    const intervalId = setInterval(pollMessages, POLL_INTERVAL);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [authUser?._id, partnerUser?._id, dispatch, hasPolled]);

  useEffect(() => {
    if (authUser?.partnerId) {
      // só isto, sem payload
      dispatch(fetchPartnerUser(authUser.partnerId));
    }
  }, [authUser?.partnerId, dispatch]);

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
  const handleAddMessage = async (text) => {
    try {
      console.log("add", messages);
      console.log("text", text);
      if (!messages || !messages.chatId) {
        console.error(
          "Thread de mensagens não encontrada. messages._id está undefined."
        );
        return;
      }
      await dispatch(
        sendMessage({ message: text, id: messages.chatId })
      ).unwrap();

      // Poll immediately after sending
      const myResult = await dispatch(
        getMessages({ userId: authUser._id, page: currentPage, limit })
      ).unwrap();
      if (
        JSON.stringify(myResult.messages) !==
        JSON.stringify(prevMyMessagesRef.current)
      ) {
        setMyMessages((prev) => ({
          ...prev,
          messages: myResult.messages || [],
        }));
        prevMyMessagesRef.current = myResult.messages || [];
      }
    } catch (error) {
      console.error("Failed to send or fetch messages:", error);
    }
  };

  const MessageBubble = React.memo(({ message, authUser }) => {
    const dateString = String(message.date);
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    const hours = dateString.slice(8, 10);
    const minutes = dateString.slice(10, 12);

    const time = `${day}/${month}/${year} ${hours}:${minutes}`;

    const isSent = message.receiverId === authUser.partnerId;
    const isFromApp =
      message.senderType === "app" || message.senderId === "app";

    let bubbleClass = "bubble";
    if (isFromApp) bubbleClass += " bubbleDotted";
    if (isSent && !isFromApp) bubbleClass += " bubbleBlue";

    const alignmentClass = isSent ? "textRight" : "textLeft";

    return (
      <div className="textMessage">
        <p
          className={`${bubbleClass} ${alignmentClass}`}
          dangerouslySetInnerHTML={{ __html: message.message }}
        ></p>
        <p className={`dateText ${alignmentClass}`}>{time}</p>
      </div>
    );
  });

  //* text messages
  let messageContent;

  if (messagesStatus === "loading" && !hasPolled) {
    messageContent = <LoadingScreen isOverlay />;
  } else if (messagesStatus === "failed") {
    messageContent = (
      <div className="errorMessage">Erro ao carregar mensagens</div>
    );
  } else if (
    authUser &&
    authUser.partnerId &&
    Array.isArray(myMessages.messages) &&
    myMessages.messages.length > 0
  ) {
    const sortedMessages = [...myMessages.messages].sort(
      (a, b) => +b.date - +a.date
    );
    messageContent = (
      <>
        {sortedMessages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message}
            authUser={authUser}
          />
        ))}
        {hasMoreMessages && (
          <div className="load-more-container-messages">
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="loadMoreBtn submitBtn"
            >
              Carregar mais mensagens
            </button>
          </div>
        )}
      </>
    );
  } else {
    messageContent = <div>Não existem mensagens</div>;
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
      <div
        className={`inputMessage ${!partnerUser ? "disabled-input" : ""}`}
        onClick={handleOpenPresetMessages}
        aria-label="Abrir opções de mensagens predefinidas"
      >
        <p>Deixa uma mensagem</p>
      </div>

      <div className="inputMessageWrapper">
        {partnerUser && isPresetMessagesOpen && (
          <div id="textOptions" ref={textOptionsRef}>
            {presetMessages &&
              presetMessages.map((message, index) => (
                <button
                  key={index}
                  className="optionText"
                  onClick={() => handleAddMessage(message.message)}
                >
                  {message.message}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
