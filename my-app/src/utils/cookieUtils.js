export function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

export function getAuthUser() {
  const raw = getCookie("loggedInUser");
  if (!raw) return null;
  try {
    const user = JSON.parse(raw);
    if (user._id && !user.id) user.id = user._id;
    return user;
  } catch {
    return null;
  }
}

// Deprecated: token is httpOnly and not accessible by JS
// export function getAuthToken() {
//   return getCookie('token');
// }
