
export function setAuthToken(token) {
  try {
    localStorage.setItem("authToken", token);
  } catch (err) {
    console.error("Não foi possível gravar o token no localStorage:", err);
  }
}


export function getAuthToken() {
  try {
    return localStorage.getItem("authToken");
  } catch (err) {
    console.error("Não foi possível ler o token do localStorage:", err);
    return null;
  }
}

export function setAuthUser(userObj) {
  try {
    localStorage.setItem("authUser", JSON.stringify(userObj));
  } catch (err) {
    console.error("Não foi possível gravar o user no localStorage:", err);
  }
}


export function getAuthUser() {
  try {
    const raw = localStorage.getItem("authUser");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("Não foi possível ler o user do localStorage:", err);
    return null;
  }
}
export function clearAuthStorage() {
  try {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  } catch (err) {
    console.error("Não foi possível limpar o localStorage:", err);
  }
}
