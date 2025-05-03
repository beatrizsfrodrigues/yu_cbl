import React, { useState, useEffect } from "react";
import "../Definicoes/InfoPessoal.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../../redux/usersSlice";

import visibleIcon from "../../../assets/imgs/Icons/visible.png";
import notVisibleIcon from "../../../assets/imgs/Icons/notvisible.png";

const InfoPessoal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const users = useSelector((state) => state.users.data);
  const currentUserId = JSON.parse(localStorage.getItem("loggedInUser")).id;
  const activeUser = users?.find((user) => user.id === currentUserId);

  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    nomeUtilizador: "",
    email: "",
    palavraChave: "",
  });

  const [originalData, setOriginalData] = useState({
    nome: "",
    nomeUtilizador: "",
    email: "",
    palavraChave: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    nomeUtilizador: false,
    email: false,
    palavraChave: false,
  });

  useEffect(() => {
    if (activeUser) {
      const userData = {
        nomeUtilizador: activeUser.username,
        email: activeUser.email,
        palavraChave: activeUser.password,
      };
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [activeUser]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationErrors({ ...validationErrors, [name]: false });
  };

  const validatePassword = (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),._?":{}|<->]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  };

  const handleSave = (e) => {
    e.preventDefault();

    const errors = {
      nomeUtilizador: formData.nomeUtilizador.trim() === "",
      email: formData.email.trim() === "",
      palavraChave: formData.palavraChave.trim() === "",
    };

    setValidationErrors(errors);

    if (Object.values(errors).some((error) => error)) {
      setAlert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (
      users.some(
        (user) =>
          user.username === formData.nomeUtilizador && user.id !== activeUser.id
      )
    ) {
      setAlert("Nome de utilizador já existente!");
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
    if (activeUser) {
      const updatedUser = {
        ...activeUser,
        name: formData.nome,
        username: formData.nomeUtilizador,
        email: formData.email,
        password: formData.palavraChave,
      };

      dispatch(updateUser(updatedUser));
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        navigate("/definicoes"); // ✅ voltar para definições
      }, 3000);
      setAlert("");
    }
    setShowConfirmModal(false);
  };

  const cancelSave = () => {
    setShowConfirmModal(false);
  };

  const handleBack = () => {
    setFormData(originalData);
    setAlert("");
    navigate("/definicoes"); // ✅ voltar para definições
  };

  return (
    <>
      {showNotification && (
        <div className="notification">Dados alterados com sucesso!</div>
      )}

      <div className="info-pessoal-page">
        <div className="info-header">
          <button
            className="back-button"
            aria-label="Voltar"
            onClick={handleBack}
          >
            <ion-icon name="arrow-back-outline" className="icons"></ion-icon>
          </button>
          <h3>Os meus dados</h3>
        </div>
        <div className="line"></div>
        <div className="settings-section">
          <div>
            <div className="form-wrapper">
              <form onSubmit={handleSave}>
                {alert && <p className="alert">{alert}</p>}

                <div className="form-group">
                  <label htmlFor="nomeUtilizador">Nome do Utilizador</label>
                  <input
                    required
                    type="text"
                    id="nomeUtilizador"
                    name="nomeUtilizador"
                    value={formData.nomeUtilizador}
                    onChange={handleChange}
                    placeholder="nome do utilizador"
                    className={`form-input ${
                      validationErrors.nomeUtilizador ? "error" : ""
                    }`}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    required
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@gmail.com"
                    className={`form-input ${
                      validationErrors.email ? "error" : ""
                    }`}
                  />
                </div>

                <div className="info-inner">
                  <div className="form-group">
                    <label htmlFor="palavraChave">Palavra-passe</label>
                    <div className="password-input-container">
                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        id="palavraChave"
                        name="palavraChave"
                        value={formData.palavraChave}
                        onChange={handleChange}
                        placeholder="****"
                        className={`form-input ${
                          validationErrors.palavraChave ? "error" : ""
                        }`}
                      />
                      <button
                        type="button"
                        className="password-toggle-button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <img
                          src={showPassword ? notVisibleIcon : visibleIcon}
                          alt="Mostrar palavra-passe"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <button className="save-button" type="submit">
                  Guardar
                </button>
              </form>
            </div>
          </div>

          {showConfirmModal && (
            <div className="confirm-modal">
              <div className="confirm-modal-content">
                <h3>Tens a certeza que queres alterar os teus dados?</h3>
                <div className="confirm-modal-buttons">
                  <button className="confirm-button" onClick={confirmSave}>
                    Sim
                  </button>
                  <button className="cancel-button" onClick={cancelSave}>
                    Não
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default InfoPessoal;
