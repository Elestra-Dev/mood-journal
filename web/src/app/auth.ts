export const auth = {
  set(token: string) { localStorage.setItem("token", token); },
  clear() { localStorage.removeItem("token"); },
  isAuthed() { return !!localStorage.getItem("token"); }
};
