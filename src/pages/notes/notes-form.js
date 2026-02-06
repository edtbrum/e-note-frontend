import { createNote } from "../../api/notes.js";
import { renderNotesList } from "./notes-list.js";
import { listAuthors } from "../../api/authors.js";
import { listTags } from "../../api/tags.js";

export async function renderNoteForm(note) {
    const actionContainer = document.getElementById("action");
    const isEdit = note !== null;

    // HTML base do formulário
    actionContainer.innerHTML = `
        <h2>${isEdit ? "Editar Nota" : "Escrever Nota"}</h2>

        <label>
            Título:<br>
            <input id="noteTitulo" value="${isEdit ? note.titulo : ""}">
        </label><br><br>

        <label>
            Conteúdo:<br>
            <textarea id="noteConteudo" rows="8">${isEdit ? note.conteudo : ""}
            </textarea>
        </label><br><br>

        <label>
            Autor:<br>
            <select id="noteAutor">
                <option value="">Carregando autores...</option>
            </select>
        </label><br><br>

        <div id="tagsContainer">
        </div>

        <button id="saveNoteBtn">
            ${isEdit ? "Salvar Alterações" : "Criar Nota"}
        </button>
    `;

    // -------- CARREGAR AUTORES --------
    const authorSelect = document.getElementById("noteAutor");

    try {
        const result = await listAuthors();
        const authors = result.data;

        authorSelect.innerHTML = `<option value="">Selecione um autor</option>`;

        authors.forEach(author => {
            const option = document.createElement("option");
            option.value = author.id;
            option.textContent = `${author.nome} (${author.email})`;

            // se estiver editando, marca o autor da nota
            if (isEdit && author.id === note.autor) {
                option.selected = true;
            }

            authorSelect.appendChild(option);
        });
    } catch (err) {
        console.error(err);
        authorSelect.innerHTML = `<option value="">Erro ao carregar autores</option>`;
    }

    // -------- CARREGAR TAGS --------
    try {
        if (isEdit) {
            renderTagsSelector(note.tags);
        }
        else {
            renderTagsSelector([]);
        }
    } catch (err) {
        console.error(err);
        authorSelect.innerHTML = `Erro ao carregar tags`;
    }

    // -------- SALVAR --------
    document.getElementById("saveNoteBtn").onclick = async () => {
        const titulo = document.getElementById("noteTitulo").value.trim();
        const conteudo = document.getElementById("noteConteudo").value.trim();
        const autor = document.getElementById("noteAutor").value;

        if (!titulo || !conteudo || !autor) {
            alert("Título, conteúdo e autor são obrigatórios");
            return;
        }

        const selectedTags = Array.from(document.querySelectorAll('input[name="tags"]:checked'))
            .map(input => Number(input.value));
        console.log("selectedTags:", selectedTags);

        try {
            if (isEdit) {
                // futuramente: updateNote(...)
                alert("Edição ainda não implementada");
            } else {
                await createNote({
                    titulo,
                    conteudo,
                    autor: Number(autor),
                    tags: selectedTags
                });
                alert("Nota criada com sucesso!");
            }

            renderNotesList();

        } catch (err) {
            console.error(err);
            alert(err.message || "Erro ao salvar nota");
        }
    };
}

async function renderTagsSelector(selectedTags = []) {
    const result = await listTags();
    const tags = result.data;
    const container = document.getElementById("tagsContainer");

    if (!Array.isArray(tags)) {
        console.error("Tags não é um array:", tags);
        return;
    }

    container.innerHTML = "<label>Tags:<br></label>"; // limpa antes

    container.innerHTML += tags.map(tag => `
        <label>
            <input
            type="checkbox"
            name="tags"
            value="${tag.id}" 
            ${selectedTags.includes(tag.id) ? "checked" : ""}
            >#${tag.nome}
        </label><br>
    `).join("");

    container.innerHTML += "<br>";
}
