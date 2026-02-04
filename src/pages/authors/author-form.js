import { createAuthor, updateAuthor, deleteAuthor } from "../../api/authors.js";
import { renderAuthorList } from "./author-list.js";

export function renderAuthorForm(author) {
  const actionContainer = document.getElementById("action");
  const isEdit = author !== null;

  // monta o HTML primeiro
  actionContainer.innerHTML = `
    <h2>${isEdit ? "Editar Autor" : "Novo Autor"}</h2>

    <label>
      Nome:<br>
      <input id="authorName" value="${isEdit ? author.nome : ""}">
    </label><br><br>

    <label>
      Email:<br>
      <input id="authorEmail" value="${isEdit ? author.email : ""}">
    </label><br><br>

    <button id="saveAuthorBtn">
      ${isEdit ? "Salvar Alterações" : "Criar Autor"}
    </button>

    ${
      isEdit
        ? `<button id="deleteAuthorBtn" class="danger">Apagar</button>`
        : ""
    }
  `;

  // agora os elementos EXISTEM
  const saveBtn = document.getElementById("saveAuthorBtn");
  const deleteBtn = document.getElementById("deleteAuthorBtn");

  // -------- SALVAR (POST / PUT) --------
  saveBtn.onclick = async () => {
    const nome = document.getElementById("authorName").value;
    const email = document.getElementById("authorEmail").value;

    if (!nome || !email) {
      alert("Nome e email são obrigatórios");
      return;
    }

    try {
      if (isEdit) {
        await updateAuthor(author.id, { nome, email });
        alert("Autor atualizado com sucesso!");
      } else {
        await createAuthor({ nome, email });
        alert("Autor criado com sucesso!");
      }

      renderAuthorList();
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao salvar autor");
    }
  };

  // -------- APAGAR (DELETE) --------
  if (isEdit && deleteBtn) {
    deleteBtn.onclick = async () => {
      const confirmDelete = confirm(
        `Tem certeza que deseja apagar o autor "${author.nome}"?`
      );

      if (!confirmDelete) return;

      try {
        await deleteAuthor(author.id);

        alert("Autor removido com sucesso!");

        // limpa formulário
        renderAuthorForm(null);

        // atualiza lista
        renderAuthorList();
      } catch (err) {
        console.error(err);
        alert(err.message || "Erro ao apagar autor");
      }
    };
  }
}
