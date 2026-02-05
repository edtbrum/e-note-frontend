export function renderNoteView(note) {
  const actionContainer = document.getElementById("action");

  const formatDate = (dt) => {
    if (!dt) return "";
    return new Date(dt).toLocaleString("pt-BR");
  };

  // -------- TAGS --------
  const tagsHtml = note.tags?.length
    ? `
      <div class="note-tags">
        ${note.tags.map(tagId => `<span class="tag">#${tagId}</span>`).join("")}
      </div>
    `
    : "";

  // -------- LINKS --------
  let linksHtml = "";
  if (note.links?.length) {
    linksHtml = `
      <div class="note-links">
        <h4>Links relacionados</h4>
        <ul>
          ${note.links.map(link => {
            if (link.tipo === "externo") {
              return `
                <li>
                  <a href="${link.url}" target="_blank">${link.url}</a>
                </li>
              `;
            }

            if (link.tipo === "interno") {
              return `
                <li>
                  <a href="#" data-note-id="${link.nota_destino_id}">
                    Nota relacionada #${link.nota_destino_id}
                  </a>
                </li>
              `;
            }
          }).join("")}
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

  // -------- BOTÕES (mock) --------
  document.getElementById("editNoteBtn").onclick = () => {
    alert("Editar ainda não implementado");
  };

  document.getElementById("deleteNoteBtn").onclick = () => {
    alert("Apagar ainda não implementado");
  };
}
