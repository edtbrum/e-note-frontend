import { renderAuthorList } from "./pages/authors/author-list.js";
import { renderAuthorForm } from "./pages/authors/author-form.js";

/* BOTÕES DO MENU */
const autorBtn = document.getElementById("autor-btn");
const autorSubmenu = document.getElementById("autor-submenu");

const autorNovoBtn = document.getElementById("autor-novo");
const autorListaBtn = document.getElementById("autor-lista");

/* ABRE / FECHA SUBMENU */
autorBtn.onclick = () => {
  autorSubmenu.classList.toggle("hidden");
};

/* AÇÕES */
autorNovoBtn.onclick = () => {
  renderAuthorForm(null);
};

autorListaBtn.onclick = () => {
  renderAuthorList();
};
