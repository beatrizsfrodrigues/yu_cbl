import React, { useState, useEffect } from "react";
import "../Definicoes/InfoPessoal.css";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, fetchUsers } from "../../../redux/usersSlice";

const InfoPessoal = ({ show, onBack }) => {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.users.data);

  const currentUserId = JSON.parse(localStorage.getItem("loggedInUser")).id;

  const activeUser = users?.find((user) => user.id === currentUserId);

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

  useEffect(() => {
    if (!users) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleSave = () => {
    // Verifica se o nome de utilizador já existe
    if (
      users.some(
        (user) =>
          user.username === formData.nomeUtilizador && user.id !== activeUser.id
      )
    ) {
      setAlert("Nome de utilizador já existente!");
      return;
    }

    // Verifica se a palavra-passe atende aos requisitos mínimos
    if (!validatePassword(formData.palavraChave)) {
      setAlert("A palavra-passe não atende aos requisitos mínimos!");
      return;
    }

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

      // Atualiza os dados no Redux
      dispatch(updateUser(updatedUser));

      // Mostra a notificação de sucesso
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        onBack();
      }, 3000); // Oculta após 3 segundos

      // Limpa as mensagens de erro
      setAlert("");
    }
    setShowConfirmModal(false);
  };

  const cancelSave = () => {
    setShowConfirmModal(false); // Cancela e fecha o modal de confirmação
  };

  const handleBack = () => {
    setFormData(originalData); // Restaura os dados originais
    setAlert(""); // Limpa as mensagens de erro
    onBack();
  };

  // Retorna null se o modal não estiver visível
  if (!show) return null;

  const isFormComplete =
    formData.nomeUtilizador.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.palavraChave.trim() !== "";

  return (
    <>
      {showNotification && (
        <div
          className={`notification 
         ${!showNotification ? "hidden" : ""}`}
        >
          Dados alterados com sucesso!
        </div>
      )}

      <div className="modal">
        <div
          id="window-infopessoal"
          className="window"
          style={{ display: "block" }}
        >
          <div className="info-header info-pessoal-page">
            <button className="back-button" onClick={handleBack}>
              <i className="bi bi-arrow-left"></i>
            </button>
            <h3>Os meus dados</h3>
          </div>
          <div className="line"></div>
          <div className="settings-section">
            <form>
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
                  className="form-input"
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
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="palavraChave">Palavra-passe</label>
                <input
                  required
                  type="password"
                  id="palavraChave"
                  name="palavraChave"
                  value={formData.palavraChave}
                  onChange={handleChange}
                  placeholder="****"
                  className="form-input"
                />
              </div>
              <button
                type="button"
                className="settings-button save-button"
                onClick={handleSave}
                disabled={!isFormComplete}
              >
                Guardar
              </button>
            </form>
          </div>

          {/* Modal de confirmação */}
          {showConfirmModal && (
            <div className="info-pessoal-page confirm-modal">
              <div className="confirm-modal-content">
                <h3>Tens a certeza que queres alterar os teus dados?</h3>{" "}
                <br></br>
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
