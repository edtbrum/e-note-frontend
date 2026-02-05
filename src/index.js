import { renderAuthorList } from "./pages/authors/author-list.js";
import { renderAuthorForm } from "./pages/authors/author-form.js";
import { renderTagList } from "./pages/tags/tags-list.js";
import { renderTagForm } from "./pages/tags/tags-form.js";
import { renderNotesList } from "./pages/notes/notes-list.js";

/* CARREGA LISTA DE NOTAS - MINIATURAS */
document.addEventListener("DOMContentLoaded", () => {
  renderNotesList();
});

/* BOTÕES DO MENU */
const autorBtn = document.getElementById("autor-btn");
const autorSubmenu = document.getElementById("autor-submenu");
const autorNovoBtn = document.getElementById("autor-novo");
const autorListaBtn = document.getElementById("autor-lista");

const tagBtn = document.getElementById("tag-btn");
const tagSubmenu = document.getElementById("tag-submenu");
const tagNovoBtn = document.getElementById("tag-novo");
const tagListaBtn = document.getElementById("tag-lista");

/* ABRE / FECHA SUBMENU */
autorBtn.onclick = () => {
  autorSubmenu.classList.toggle("hidden");
};

tagBtn.onclick = () => {
  tagSubmenu.classList.toggle("hidden");
};

/* AÇÕES */
autorNovoBtn.onclick = () => {
  renderAuthorForm(null);
};

autorListaBtn.onclick = () => {
  renderAuthorList();
};

tagNovoBtn.onclick = () => {
  renderTagForm();
};

tagListaBtn.onclick = () => {
  renderTagList();
};
