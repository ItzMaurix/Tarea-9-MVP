const USERS_KEY = "mvp_users_v1";
const CURRENT_USER_KEY = "mvp_current_user";
const RESERVATIONS_KEY = "mvp_reservations_v1";
const VISITS_KEY = "mvp_visits_v1";
const NEWS_KEY = "mvp_news_v1";

export const Storage = {
  init() {
    if (!localStorage.getItem(USERS_KEY)) {
      const defaultUsers = [{ id: 1, name: "Javiera Soto", email: "usuario@example.com", password: "123456" }];
      localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    }
    if (!localStorage.getItem(NEWS_KEY)) {
      const news = [{ id:1, title:"Servicio Piscina rehabilitado", excerpt:"El servicio de piscina queda habilitado..." }];
      localStorage.setItem(NEWS_KEY, JSON.stringify(news));
    }
    if (!localStorage.getItem(RESERVATIONS_KEY)) localStorage.setItem(RESERVATIONS_KEY, JSON.stringify([]));
    if (!localStorage.getItem(VISITS_KEY)) localStorage.setItem(VISITS_KEY, JSON.stringify([]));
  },

  getUsers() { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); },
  saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); },

  register(user) {
    const users = this.getUsers();
    user.id = Date.now();
    users.push(user);
    this.saveUsers(users);
  },

  login(email, password) {
    const user = this.getUsers().find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  getCurrentUser() { return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null"); },
  setCurrentUser(user) { localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user)); },
  logout() { localStorage.removeItem(CURRENT_USER_KEY); },

  getReservations() { return JSON.parse(localStorage.getItem(RESERVATIONS_KEY) || "[]"); },
  saveReservation(res) {
    const arr = this.getReservations();
    arr.push({ ...res, id: Date.now() });
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(arr));
  },

  getVisits() { return JSON.parse(localStorage.getItem(VISITS_KEY) || "[]"); },
  saveVisit(v) {
    const arr = this.getVisits();
    arr.push({ ...v, id: Date.now() });
    localStorage.setItem(VISITS_KEY, JSON.stringify(arr));
  },

  getNews() { return JSON.parse(localStorage.getItem(NEWS_KEY) || "[]"); }
};
