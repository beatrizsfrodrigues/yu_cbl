
import React, { useEffect, useState, useMemo } from "react";
import "../Definicoes/Definicoes.css";
import "../Definicoes/InfoPessoal.css";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../../redux/usersSlice";
import visibleIcon from "../../../assets/imgs/Icons/visible.png";
import notVisibleIcon from "../../../assets/imgs/Icons/notvisible.png";

const InfoPessoal = ({ show = false, onClose = () => {} }) => {
  const dispatch = useDispatch();
  const rawUser = useSelector((state) => state.user.authUser);
  const currentUser = useMemo(() => rawUser || {}, [rawUser]);

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const [formData, setFormData] = useState({
    nomeUtilizador: currentUser.username || "",
    email: currentUser.email || "",
    senhaAtual: "",
  });
  const [originalData, setOriginalData] = useState(formData);
  const [validationErrors, setValidationErrors] = useState({
    nomeUtilizador: false,
    email: false,
    senhaAtual: false,
  });

  useEffect(() => {
    setFormData({
      nomeUtilizador: currentUser.username || "",
      email: currentUser.email || "",
      senhaAtual: "",
    });
    setOriginalData({
      nomeUtilizador: currentUser.username || "",
      email: currentUser.email || "",
      senhaAtual: "",
    });
    setStep(1);
    setAlert("");
    setValidationErrors({ nomeUtilizador: false, email: false, senhaAtual: false });
  }, [currentUser, show]);

  const handleBack = () => {
    setFormData(originalData);
    setAlert("");
    setStep(1);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
    setValidationErrors((ve) => ({ ...ve, [name]: false }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    const errs = {
      nomeUtilizador: formData.nomeUtilizador.trim() === "",
      email: formData.email.trim() === "",
    };
    setValidationErrors((ve) => ({ ...ve, ...errs }));
    if (Object.values(errs).some(Boolean)) {
      setAlert("Por favor, preencha nome e email.");
      return;
    }
    setAlert("");
    setStep(2);
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (formData.senhaAtual.trim() === "") {
      setValidationErrors({ senhaAtual: true });
      setAlert("Por favor, introduza a sua palavra-passe atual para concluir a alteração de dados !");
      return;
    }
    setAlert("");
    const updated = {
      ...currentUser,
      username: formData.nomeUtilizador,
      email: formData.email,
      password: formData.senhaAtual,
    };
    dispatch(updateUser(updated));
    setOriginalData({ nomeUtilizador: formData.nomeUtilizador, email: formData.email, senhaAtual: "" });
    setFormData((fd) => ({ ...fd, senhaAtual: "" }));
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      onClose();
      setStep(1);
    }, 3000);
  };

  if (!show) return null;

  return (
    <div className="modal modal-info" onClick={handleBack}>
      <div className="window" onClick={(e) => e.stopPropagation()}>
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

        <div className="grafico-content">
          {showNotification && (
            <div className="notification">
              Dados alterados com sucesso!
            </div>
          )}

          
          {step === 1 ? (
            <p className="info-text">
              Pode alterar o seu nome de utilizador e email.
            </p>
          ) : (
            <p className="info-text">
              Para confirmar a alteração, introduza a sua palavra-passe atual.
            </p>
          )}

          <form className="form-wrapper" onSubmit={step === 1 ? handleNext : handleConfirm}>
            {alert && <p className="alert">{alert}</p>}

            {step === 1 ? (
              <>  
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

                <button type="submit" className="settings-button next-button">
                  Próximo
                </button>
              </>
            ) : (
              <>  
                <div className="form-group password-group">
                  <label htmlFor="senhaAtual">Palavra-passe atual</label>
                  <div className="password-input-container">
                    <input
                      id="senhaAtual"
                      name="senhaAtual"
                      type={showPassword ? "text" : "password"}
                      value={formData.senhaAtual}
                      onChange={handleChange}
                      className={`form-input ${validationErrors.senhaAtual ? "error" : ""}`}
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

                <div className="confirm-buttons">
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
  );
};

export default InfoPessoal;
