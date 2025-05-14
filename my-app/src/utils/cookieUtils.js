
export function getCookie(name) {
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[]\/+^])/g, '\\$1') + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function getAuthUser() {
  const raw = getCookie('loggedInUser');
  if (!raw) return null;
  try {
    const user = JSON.parse(raw);
    if (user._id && !user.id) user.id = user._id; 
    return user;
  } catch {
    return null;
  }
}

export function getAuthToken() {
  return getCookie('token');
}
