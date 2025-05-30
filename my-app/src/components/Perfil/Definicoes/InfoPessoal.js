// src/components/Definicoes/InfoPessoal.js
import React, { useEffect, useState, useMemo } from "react";
import "../Definicoes/InfoPessoal.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../../redux/usersSlice";

import visibleIcon from "../../../assets/imgs/Icons/visible.png";
import notVisibleIcon from "../../../assets/imgs/Icons/notvisible.png";

const InfoPessoal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // current user from redux
  const rawUser = useSelector((state) => state.user.authUser);
  const currentUser = useMemo(() => rawUser || {}, [rawUser]);

  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [formData, setFormData] = useState({
    nomeUtilizador: currentUser.username || "",
    email: currentUser.email || "",
    palavraChave: "", // blank for security
  });

  const [originalData, setOriginalData] = useState(formData);

  const [validationErrors, setValidationErrors] = useState({
    nomeUtilizador: false,
    email: false,
    palavraChave: false,
  });

  // populate form when currentUser arrives
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
    setValidationErrors((ve) => ({ ...ve, [name]: false }));
  };

  const validatePassword = (pw) => {
    return (
      pw.length >= 6 &&
      /[A-Z]/.test(pw) &&
      /[a-z]/.test(pw) &&
      /[0-9]/.test(pw) &&
      /[!@#$%^&*(),._?":{}|<>-]/.test(pw)
    );
  };

  const handleSave = (e) => {
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
      navigate("/definicoes");
    }, 3000);
    setShowConfirmModal(false);
  };

  const cancelSave = () => setShowConfirmModal(false);

  const handleBack = () => {
    setFormData(originalData);
    setAlert("");
    navigate("/definicoes");
  };

  return (
    <div className="info-pessoal-page">
      {showNotification && (
        <div className="notification">Dados alterados com sucesso!</div>
      )}

      <div className="info-header">
        <button className="back-button" onClick={handleBack}>
          <ion-icon name="arrow-back-outline" className="icons"></ion-icon>
        </button>
        <h3>Os meus dados</h3>
      </div>
      <div className="line" />

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
            className={`form-input ${
              validationErrors.nomeUtilizador ? "error" : ""
            }`}
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
              className={`form-input ${
                validationErrors.palavraChave ? "error" : ""
              }`}
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

        <div className="form-buttons">
          <button type="submit" className="save-button">
            Guardar
          </button>
        </div>
      </form>

      {showConfirmModal && (
        <div className="confirm-modal">
          <div className="confirm-modal-content">
            <h3>Tens a certeza que queres alterar os teus dados?</h3>
            <div className="confirm-modal-buttons">
              <button onClick={confirmSave} className="confirm-button">
                Sim
              </button>
              <button onClick={cancelSave} className="cancel-button">
                Não
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoPessoal;
