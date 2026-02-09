import { deleteNote, findNote } from "../../api/notes.js";
import { listTags } from "../../api/tags.js";
import { confirmDialog } from "../confirm-dialog.js";
import { renderNoteForm } from "./notes-form.js";
import { renderNotesList } from "./notes-list.js";

export async function renderNoteView(note) {
  const actionContainer = document.getElementById("action");

  const formatDate = (dt) => {
    if (!dt) return "";
    return new Date(dt).toLocaleString("pt-BR");
  };

  // busca todas as tags
  let tagMap = {};
  try {
    const result = await listTags();
    result.data.forEach(tag => { tagMap[tag.id] = tag.nome; });
  } catch (err) {
    console.error("Erro ao carregar tags", err);
  }

  // -------- TAGS --------
  const tagsHtml = note.tags?.length
    ? `
      <div class="note-tags">
        ${note.tags.map(tagId => {
          const nome = tagMap[tagId] || `#${tagId}`;
          return `<span class="tag">#${nome}</span>`;
        }).join("")}
      </div>
    `
    : "";

  // -------- LINKS --------
  let linksHtml = "";

  if (note.links?.length) {
    let linksItemsHtml = "";

    for (const link of note.links) {

      // ----- LINK EXTERNO -----
      if (link.tipo === "externo") {
        linksItemsHtml += `
          <li>
            <a href="${link.url}" target="_blank">${link.url}</a>
          </li>
        `;
      }

      // ----- LINK INTERNO -----
      if (link.tipo === "interno") {
        linksItemsHtml += `
          <li>
            <a href="#" data-note-id="${link.nota_destino_id}">
              ${link.nota_destino_titulo}
            </a>
          </li>
        `;
      }
    }

    linksHtml = `
      <div class="note-links">
        <ul>
          ${linksItemsHtml}
        </ul>
      </div>
    `;
  }

  actionContainer.innerHTML = `
    <h2>${note.titulo}</h2>

    ${tagsHtml}

    <p>${note.conteudo}</p>

    ${
      note.lembrete
        ? `<p class="note-reminder"><strong>Lembrete:</strong> ${note.lembrete.data_hora}</p>`
        : ""
    }

    ${linksHtml}

    <p class="note-meta">
      Criado em: ${formatDate(note.criado_em)}
      ${
        note.atualizado_em
          ? ` | Atualizado em: ${formatDate(note.atualizado_em)}`
          : ""
      }
    </p>

    <div class="note-actions">
      <button id="editNoteBtn">Editar</button>
      <button id="deleteNoteBtn" class="danger">Apagar</button>
    </div>
  `;

  // -------- FAZ LINKS INTERNOS FUNCIONAREM --------
  // -------- LINKS INTERNOS: NAVEGAÇÃO --------
  actionContainer.querySelectorAll(".note-links a[data-note-id]")
    .forEach(linkEl => {
      linkEl.onclick = async (e) => {
        e.preventDefault();

        const noteId = Number(linkEl.dataset.noteId);

        try {
          const notaDestino = await findNote(noteId);
          renderNoteView(notaDestino);
        } catch (err) {
          console.error(err);
          alert("Erro ao abrir nota relacionada");
        }
      };
    });

  // -------- BOTÕES --------
  document.getElementById("editNoteBtn").onclick = () => {
    renderNoteForm(note);
  };

  document.getElementById("deleteNoteBtn").onclick = async () => {
    const confirmDelete = await confirmDialog(`Tem certeza que deseja apagar a nota "${note.titulo}"?`);
    if (!confirmDelete) return;

    try {
      await deleteNote(note.id);
      alert("Nota apagada com sucesso!");

      actionContainer.innerHTML = "";
      renderNotesList();
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao apagar a nota");
    }
  };
}
