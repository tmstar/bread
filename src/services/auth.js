const login = () => {
  localStorage.setItem("auth", true);
};

const isAuthenticated = () => {
  console.log("test: ", localStorage.getItem("auth"));
  return localStorage.getItem("auth") === "true";
};

const logout = () => {
  if (localStorage.getItem("auth")) {
    localStorage.removeItem("auth");
  }
};

const auth = { login, isAuthenticated, logout };
export default auth;
