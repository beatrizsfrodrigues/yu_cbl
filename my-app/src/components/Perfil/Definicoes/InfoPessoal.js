import React, { useState, useEffect } from "react";
import "../Definicoes/InfoPessoal.css";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, fetchUsers } from "../../../redux/usersSlice"; 

const InfoPessoal = ({ show, onBack }) => {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.users.data);
  const activeUser = users?.find((user) => user.ativo === 1); 


  const [formData, setFormData] = useState({
    nome: "",
    nomeUtilizador: "",
    email: "",
    palavraChave: "",
  });

  useEffect(() => {
    if (activeUser) {
      setFormData({
        nome: activeUser.name,
        nomeUtilizador: activeUser.username,
        email: activeUser.email,
        palavraChave: activeUser.password,
      });
    }
  }, [activeUser]);

  useEffect(() => {
    if (!users) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users]);


  const [showConfirmModal, setShowConfirmModal] = useState(false);

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
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
      alert("Dados atualizados com sucesso!");
    }
    setShowConfirmModal(false);
    onBack(); 
  };

  const cancelSave = () => {
    setShowConfirmModal(false); // Cancela e fecha o modal de confirmação
  };

  // Retorna null se o modal não estiver visível
  if (!show) return null;

  return (
    <div className="modal">
      <div className="info-pessoal-page">
        <div className="window" style={{ display: "block" }}>
          <div className="info-header">
            <button className="back-button" onClick={onBack}>
              <i className="bi bi-arrow-left"></i>
            </button>
            <h2>Os meus dados</h2>
          </div>
          <hr />
          <div className="settings-section">
            <form>
              <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Luísa"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="nomeUtilizador">Nome do Utilizador</label>
                <input
                  type="text"
                  id="nomeUtilizador"
                  name="nomeUtilizador"
                  value={formData.nomeUtilizador}
                  onChange={handleChange}
                  placeholder="luisaS"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="luisa@gmail.com"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="palavraChave">Palavra Chave</label>
                <input
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
              >
                Guardar
              </button>
            </form>
          </div>

          {/* Modal de confirmação */}
          {showConfirmModal && (
          <div className="info-pessoal-page confirm-modal">
            <div className="confirm-modal-content">
              <h3>Tens a certeza que queres alterar os teus dados?</h3>
              <div className="confirm-modal-buttons">
                <button
                  className="confirm-button"
                  onClick={confirmSave}
                >
                  Sim
                </button>
                <button
                  className="cancel-button"
                  onClick={cancelSave}
                >
                  Não
                </button>
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
