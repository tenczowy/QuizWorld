export default function resetSession() {
  sessionStorage.removeItem('sessionToken');
  sessionStorage.removeItem('currentCategory');
  window.location.reload();
}
