import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../../redux/messagesSlice";
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

  useEffect(() => {
    if (messagesStatus === "idle") {
      dispatch(fetchMessages());
    }
  }, [messagesStatus, dispatch]);

  useEffect(() => {
    if (presetMessagesStatus === "idle") {
      dispatch(fetchPresetMessages());
    }
  }, [presetMessagesStatus, dispatch]);

  const handleOpenPresetMessages = () => {
    setIsPresetMessagesOpen(!isPresetMessagesOpen);
  };

  const addDragScrolling = (element) => {
    if (!element) return; // Ensure the element is not null

    let isDown = false;
    let startY;
    let scrollTop;

    const handleMouseDown = (e) => {
      isDown = true;
      startY = e.pageY - element.offsetTop;
      scrollTop = element.scrollTop;
    };

    const handleMouseLeave = () => {
      isDown = false;
    };

    const handleMouseUp = () => {
      isDown = false;
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const y = e.pageY - element.offsetTop;
      const walk = (y - startY) * 2; // Adjust scroll speed
      element.scrollTop = scrollTop - walk;
    };

    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mouseup", handleMouseUp);
    element.addEventListener("mousemove", handleMouseMove);

    return () => {
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mouseup", handleMouseUp);
      element.removeEventListener("mousemove", handleMouseMove);
    };
  };

  useEffect(() => {
    const textSpace = textSpaceRef.current;
    const textOptions = textOptionsRef.current;

    const removeTextSpaceListeners = addDragScrolling(textSpace);
    const removeTextOptionsListeners = addDragScrolling(textOptions);

    return () => {
      if (removeTextSpaceListeners) removeTextSpaceListeners();
      if (removeTextOptionsListeners) removeTextOptionsListeners();
    };
  }, [isPresetMessagesOpen]);

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
          <div key={index} className="textMessage">
            <p className="bubble bubbleBlue">{message.message}</p>
            <p className="dateText textRight">{message.date}</p>
          </div>
        );
      } else if (message.senderId === "app") {
        return (
          <div key={index} className="textMessage">
            <p className="bubble bubbleDotted">{message.message}</p>
            <p className="dateText textLeft">{message.date}</p>
          </div>
        );
      } else {
        return (
          <div key={index} className="textMessage">
            <p className="bubble">{message.message}</p>
            <p className="dateText textLeft">{message.date}</p>
          </div>
        );
      }
    });
  } else {
    messageContent = <div>Não existem mensagens</div>;
  }

  let presetMsgs;
  if (presetMessages && presetMessages.length > 0) {
    presetMsgs = presetMessages.map((message, index) => {
      if (index % 2 === 0) {
        return (
          <button key={index} className="optionText">
            {message.message}
          </button>
        );
      }
      return null;
    });
  } else {
    presetMsgs = <div>Não existem mensagens</div>;
  }

  let presetMsgs2;
  if (presetMessages && presetMessages.length > 0) {
    presetMsgs2 = presetMessages.map((message, index) => {
      if (index % 2 !== 0) {
        return (
          <button key={index} className="optionText">
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
