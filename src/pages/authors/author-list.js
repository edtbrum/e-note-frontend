import { listAuthors } from "../../api/authors.js";
import { renderAuthorForm } from "./author-form.js";

export async function renderAuthorList() {
  const actionContainer = document.getElementById("action");

  actionContainer.innerHTML = "<p>Carregando autores...</p>";

  try {
    const result = await listAuthors();
    const authors = result.data;

    if (authors.length === 0) {
      actionContainer.innerHTML = "<p>Nenhum autor cadastrado.</p>";
      return;
    }

    actionContainer.innerHTML = "<h2>Autores</h2><ul id='authorUl'></ul>";

    const ul = document.getElementById("authorUl");

    authors.forEach(author => {
      const li = document.createElement("li");
      li.textContent = `${author.nome} (${author.email})`;
      li.style.cursor = "pointer";

      li.onclick = () => {
        renderAuthorForm(author);
      };

      ul.appendChild(li);
    });

  } catch (error) {
    actionContainer.innerHTML = `<p style="color:red">${error.message}</p>`;
  }
}
