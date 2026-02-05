import { listNotes } from "../../api/notes.js";
import { renderNoteView } from "./notes-view.js";

export async function renderNotesList() {
  const listContainer = document.getElementById("list");
  listContainer.innerHTML = "<p>Carregando notas...</p>";

  try {
    const result = await listNotes();
    const notes = result.data;

    if (notes.length === 0) {
      listContainer.innerHTML = "<p>Nenhuma nota cadastrada.</p>";
      return;
    }

    listContainer.innerHTML = "<h2>Notas</h2>";

    notes.forEach(note => {
      const card = document.createElement("div");
      card.className = "note-card";

      const preview =
        note.conteudo.length > 80
          ? note.conteudo.slice(0, 80) + "..."
          : note.conteudo;

      card.innerHTML = `
        <h3>${note.titulo}</h3>
        <p>${preview}</p>
      `;

      card.onclick = () => {
        renderNoteView(note);
      };

      listContainer.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    listContainer.innerHTML = `<p style="color:red">${err.message}</p>`;
  }
}
