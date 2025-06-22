// src/components/Definicoes/InfoPessoal.js
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "../Definicoes/InfoPessoal.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../../utils/storageUtils";
// ícones para mostrar/esconder password
import visibleIcon from "../../../assets/imgs/Icons/visible.png";
import notVisibleIcon from "../../../assets/imgs/Icons/notvisible.png";

const API_URL = process.env.REACT_APP_API_URL;

const InfoPessoal = ({ show = false, onClose = () => {} }) => {
  const navigate = useNavigate();
  const rawUser = useSelector((state) => state.user.authUser);
  const currentUser = useMemo(() => rawUser || {}, [rawUser]);
  const token = getAuthToken();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState("");
  const [notification, setNotification] = useState("");
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const [formData, setFormData] = useState({
    nomeUtilizador: currentUser.username || "",
    email: currentUser.email || "",
    senhaAtual: "",
  });

  // Keep a snapshot to detect changes
  const originalData = useMemo(
    () => ({ username: currentUser.username, email: currentUser.email }),
    [currentUser]
  );

  useEffect(() => {
    setFormData({
      nomeUtilizador: currentUser.username || "",
      email: currentUser.email || "",
      senhaAtual: "",
    });
    setStep(1);
    setAlert("");
    setNotification("");
    setShowDiscardConfirm(false);
  }, [currentUser, show]);

  // Click on overlay
  const handleOverlayClick = () => {
    const changed =
      formData.nomeUtilizador !== originalData.username ||
      formData.email !== originalData.email;
    if (step !== 1 || changed) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  // Back arrow click just close without confirm
  const handleBackArrow = () => onClose();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
    setAlert("");
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.nomeUtilizador.trim() || !formData.email.trim()) {
      setAlert("Nome de utilizador e email são obrigatórios.");
      return;
    }
    setAlert("");
    setStep(2);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!formData.senhaAtual.trim()) {
      setAlert("Introduza a sua palavra-passe atual para confirmar.");
      return;
    }
    if (
      formData.nomeUtilizador === originalData.username &&
      formData.email === originalData.email
    ) {
      setAlert("Nenhuma alteração detectada nos dados pessoais.");
      return;
    }
    try {
      await axios.post(
        `${API_URL}/users/login`,
        { emailOrUsername: originalData.email, password: formData.senhaAtual },
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (verifyErr) {
      setAlert(
        verifyErr.response?.status === 401
          ? "Palavra-passe atual incorreta."
          : "Erro ao verificar palavra-passe."
      );
      return;
    }
    try {
      await axios.put(
        `${API_URL}/users/${currentUser._id}`,
        {
          username: formData.nomeUtilizador,
          email: formData.email,
          password: formData.senhaAtual,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotification("Dados alterados com sucesso!");
      setTimeout(() => {
        setNotification("");
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setAlert(err.response?.data?.message || "Erro ao atualizar dados.");
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal modal-info" onClick={handleOverlayClick}>
        <div className="window" onClick={(e) => e.stopPropagation()}>
          <div className="grafico-header">
            <ion-icon
              name="chevron-back-outline"
              onClick={handleBackArrow}
              className="icons"
              style={{ fontSize: "28px" }}
            />
            <h3>Os meus dados</h3>
          </div>
          <div className="line" />

          {notification && <div className="notification">{notification}</div>}

          <div className="grafico-content">
            {step === 1 ? (
              <p className="info-text">
                Altera o teu nome de utilizador e email abaixo. Clica em
                "Próximo" para confirmar.
              </p>
            ) : (
              <p className="info-text">
                Para concluires, introduz a tua palavra-passe atual.
              </p>
            )}

            <form
              className="form-wrapper"
              onSubmit={step === 1 ? handleNext : handleConfirm}
            >
              {alert && <p className="alert">{alert}</p>}

              {step === 1 ? (
                <>
                  <div className="form-group">
                    <label htmlFor="nomeUtilizador">Nome de Utilizador</label>
                    <input
                      id="nomeUtilizador"
                      name="nomeUtilizador"
                      type="text"
                      value={formData.nomeUtilizador}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <button type="submit" className="settings-button">
                    Próximo
                  </button>
                </>
              ) : (
                <>
                  <div className="form-group password-group">
                    <label htmlFor="senhaAtual">Palavra-passe Atual</label>
                    <div className="password-input-container">
                      <input
                        id="senhaAtual"
                        name="senhaAtual"
                        type={showPassword ? "text" : "password"}
                        value={formData.senhaAtual}
                        onChange={handleChange}
                        className="form-input"
                      />
                      <button
                        type="button"
                        className="password-toggle-button"
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        <img
                          src={showPassword ? notVisibleIcon : visibleIcon}
                          alt="Mostrar/esconder"
                        />
                      </button>
                    </div>
                  </div>
                  <div className="confirm-buttons" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", width: "100%" }}>
                    <button type="submit" className="confirm-button">
                      Confirmar
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => setStep(1)}
                    >
                      Voltar
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Discard confirmation modal */}
      {showDiscardConfirm && (
        <div className="modal modal-confirm" onClick={() => setShowDiscardConfirm(false)}>
          <div className="window small" onClick={(e) => e.stopPropagation()}>
            <p style={{ textAlign: "center" }}>Tens a certeza que queres sair sem guardar as alterações?</p>
            <div className="confirm-buttons" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", width: "100%" }}>
              <button
                className="confirm-button"
                style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                onClick={() => { setShowDiscardConfirm(false); onClose(); }}
              >Sim</button>
              <button
                className="cancel-button"
                style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                onClick={() => setShowDiscardConfirm(false)}
              >Não</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoPessoal;
