import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../redux/messagesSlice";
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

  return (
    <div className="modal">
      <div className="window">
        <div className="header">
          <h3>@amigo</h3>
          <X className="closeWindow" onClick={onClose} />
        </div>
        <div className="line"></div>
        <div id="textSpace">
          {messages && messages.length > 0 ? (
            messages[0].messages.map((message, index) => (
              <div className="textMessage">
                <p key={index} className="bubble">
                  {message.message}
                </p>
                <p className="dateText">{message.date}</p>
              </div>
            ))
          ) : (
            <div>Não existem mensagens</div>
          )}
        </div>
        <input placeholder="Deixa uma mensagem"></input>
      </div>
    </div>
  );
}

export default Messages;
