import React, { useState, useEffect } from "react";
import "../Definicoes/InfoPessoal.css";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, fetchUsers } from "../../../redux/usersSlice"; 

const InfoPessoal = ({ show, onBack }) => {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.users.data);

  const currentUserId = JSON.parse(localStorage.getItem("loggedInUser")).id;

  const activeUser = users?.find((user) => user.id === currentUserId); 


   
const [showNotification, setShowNotification] = useState(false); 
const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    nomeUtilizador: "",
    email: "",
    palavraChave: "",
  });

  useEffect(() => {
    if (activeUser) {
      setFormData({
        //nome: activeUser.name,
        //nomeUtilizador: activeUser.username,
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
    
      // Mostra a notificação de sucesso
      setShowNotification(true);
      setTimeout(() => {
      setShowNotification(false);
      onBack(); 
    }, 3000); // Oculta após 3 segundos
  }
    setShowConfirmModal(false);
    //onBack(); 
  };

  const cancelSave = () => {
    setShowConfirmModal(false); // Cancela e fecha o modal de confirmação
  };

  // Retorna null se o modal não estiver visível
  if (!show) return null;

  return (
    <>
    {showNotification && (
      <div className={`notification 
         ${!showNotification ? "hidden" : ""}`}>
        Dados alterados com sucesso!
      </div>
    )}


    <div className="modal">
      
        <div className="window" style={{ display: "block" }}>
          <div className="info-header info-pessoal-page">
            <button className="back-button" style={{ marginTop: "5%" }}onClick={onBack}>
              <i className="bi bi-arrow-left"></i>
            </button>
            <h3>Os meus dados</h3>
          </div>
          <div className="line"></div>
          <div className="settings-section">
            <form>
             {/*  <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="nome"
                  className="form-input"
                />
              </div>*/}
              <div className="form-group">
                <label htmlFor="nomeUtilizador">Nome do Utilizador</label>
                <input
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
              <h3>Tens a certeza que queres alterar os teus dados?</h3> <br></br>
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
    </>
  );
};

export default InfoPessoal;
