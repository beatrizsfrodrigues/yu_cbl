// InfoPessoal.js
import React, { useEffect, useState, useMemo } from "react";
import "../Definicoes/Definicoes.css";
import "../Definicoes/InfoPessoal.css";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../../redux/usersSlice";
import visibleIcon from "../../../assets/imgs/Icons/visible.png";
import notVisibleIcon from "../../../assets/imgs/Icons/notvisible.png";

const InfoPessoal = ({ show = false, onClose = () => {} }) => {
  const dispatch = useDispatch();
  const rawUser = useSelector(state => state.user.authUser);
  const currentUser = useMemo(() => rawUser || {}, [rawUser]);

  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [formData, setFormData] = useState({
    nomeUtilizador: currentUser.username || "",
    email: currentUser.email || "",
    palavraChave: "",
  });
  const [originalData, setOriginalData] = useState(formData);
  const [validationErrors, setValidationErrors] = useState({
    nomeUtilizador: false,
    email: false,
    palavraChave: false,
  });

  useEffect(() => {
    setFormData({
      nomeUtilizador: currentUser.username || "",
      email: currentUser.email || "",
      palavraChave: "",
    });
    setOriginalData({
      nomeUtilizador: currentUser.username || "",
      email: currentUser.email || "",
      palavraChave: "",
    });
  }, [currentUser]);

  const handleBack = () => {
    setFormData(originalData);
    setAlert("");
    onClose();
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
    setValidationErrors(ve => ({ ...ve, [name]: false }));
  };

  const validatePassword = pw =>
    pw.length >= 6 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw) && /[!@#$%^&*(),._?":{}|<>-]/.test(pw);

  const handleSave = e => {
    e.preventDefault();
    const errs = {
      nomeUtilizador: formData.nomeUtilizador.trim() === "",
      email: formData.email.trim() === "",
      palavraChave: formData.palavraChave.trim() === "",
    };
    setValidationErrors(errs);
    if (Object.values(errs).some(Boolean)) {
      setAlert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    if (!validatePassword(formData.palavraChave)) {
      setAlert("A palavra-passe não atende aos requisitos mínimos!");
      return;
    }
    setAlert("");
    setShowConfirmModal(true);
  };

  const confirmSave = () => {
    const updated = {
      ...currentUser,
      username: formData.nomeUtilizador,
      email: formData.email,
      password: formData.palavraChave,
    };
    dispatch(updateUser(updated));
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      onClose();
    }, 3000);
    setShowConfirmModal(false);
  };

  const cancelSave = () => setShowConfirmModal(false);

  if (!show) return null;

  return (
    <div className="modal modal-info" onClick={handleBack}>
      <div className="window" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="grafico-header">
          <ion-icon
            name="chevron-back-outline"
            onClick={handleBack}
            className="icons"
            style={{ fontSize: "28px" }}
          />
          <h3>Os meus dados</h3>
        </div>
        <div className="line" />

        {/* Content */}
        <div className="grafico-content" style={{ textAlign: "justify", textJustify: "inter-word" }}>
          {showNotification && <div className="notification">Dados alterados com sucesso!</div>}

          <div className="grafico-section">
            <form className="form-wrapper" onSubmit={handleSave}>
              {alert && <p className="alert">{alert}</p>}

              <div className="form-group">
                <label htmlFor="nomeUtilizador">Nome do Utilizador</label>
                <input
                  id="nomeUtilizador"
                  name="nomeUtilizador"
                  type="text"
                  value={formData.nomeUtilizador}
                  onChange={handleChange}
                  className={`form-input ${validationErrors.nomeUtilizador ? "error" : ""}`}
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
                  className={`form-input ${validationErrors.email ? "error" : ""}`}
                />
              </div>

              <div className="form-group password-group">
                <label htmlFor="palavraChave">Palavra-passe</label>
                <div className="password-input-container">
                  <input
                    id="palavraChave"
                    name="palavraChave"
                    type={showPassword ? "text" : "password"}
                    value={formData.palavraChave}
                    onChange={handleChange}
                    className={`form-input ${validationErrors.palavraChave ? "error" : ""}`}
                  />
                  <button type="button" className="password-toggle-button" onClick={() => setShowPassword(v => !v)}>
                    <img src={showPassword ? notVisibleIcon : visibleIcon} alt="Mostrar/esconder" />
                  </button>
                </div>
              </div>

              <div className="form-buttons">
                <button type="submit" className="save-button">Guardar</button>
              </div>
            </form>
          </div>

          {showConfirmModal && (
            <div className="modal modal-confirm" onClick={cancelSave}>
              <div className="window" onClick={e => e.stopPropagation()}>
                <div className="grafico-section">
                  <h3>Tens a certeza que queres alterar os teus dados?</h3>
                  <div className="confirm-modal-buttons">
                    <button onClick={confirmSave} className="confirm-button">Sim</button>
                    <button onClick={cancelSave} className="cancel-button">Não</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoPessoal;
