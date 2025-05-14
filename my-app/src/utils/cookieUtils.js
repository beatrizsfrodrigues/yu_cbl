
export function getCookie(name) {
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[]\/+^])/g, '\\$1') + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function getAuthUser() {
  const userJson = getCookie('loggedInUser');
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch (err) {
    console.error('Erro a fazer parse do cookie loggedInUser:', err, userJson);
    return null;
  }
}

export function getAuthToken() {
  return getCookie('token');
}
