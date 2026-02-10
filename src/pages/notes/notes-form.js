import { createNote, findNote, listNoteReferences, updateNote } from "../../api/notes.js";
import { renderNotesList } from "./notes-list.js";
import { listAuthors } from "../../api/authors.js";
import { listTags } from "../../api/tags.js";
import { toBackendDatetime, toInputDatetime } from "../../utils/datetime.js";

let currentLinks = [];
let noteFormTemplate = null;

export async function renderNoteForm(note) {
    const actionContainer = document.getElementById("action");
    const isEdit = note !== null;

    // -------- CARREGAR LEMBRETE EM CASO DE EDIÇÃO --------
    const lembreteValue = isEdit && note.lembrete ? toInputDatetime(note.lembrete.data_hora) : "";
    let lembreteRemovido = false;

    actionContainer.innerHTML = await loadNoteFormTemplate();
    document.getElementById("form-title").textContent = isEdit ? "Editar Nota" : "Escrever Nota";

    const noteTitulo = document.getElementById("noteTitulo");
    const noteConteudo = document.getElementById("noteConteudo");
    const noteLembrete = document.getElementById("noteLembrete");
    const saveNoteBtn = document.getElementById("saveNoteBtn");
    const removeLembreteBtn = document.getElementById("removeLembreteBtn");

    noteTitulo.value = isEdit ? note.titulo : "";
    noteConteudo.value = isEdit ? note.conteudo : "";
    noteLembrete.value = lembreteValue;
    removeLembreteBtn.hidden = !(isEdit && note.lembrete);
    saveNoteBtn.textContent = isEdit ? "Salvar Alterações" : "Criar Nota";

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

    currentLinks = isEdit && note.links ? [...note.links] : [];

    // -------- CARREGAR LINKS --------
    if (isEdit && note.links?.length) {
        renderLinksList(currentLinks);
    }

    // -------- BOTÃO CRIAR LINK --------
    document.getElementById("createLinkBtn").onclick = async () => {
        const tipo = prompt("Tipo de link:\n1 - Interno(outra nota)\n2 - Externo(URL)");
        if (tipo === "2") {
            // -------- LINK EXTERNO --------
            const url = prompt("Digite ou cole a URL:");
            if (!url) return;

            currentLinks.push({
                tipo: "externo",
                url: url
            });

            renderLinksList(currentLinks);

        } else if (tipo === "1") {
            // -------- LINK INTERNO --------
            await createInternalLink(currentLinks);

        } else {
            alert("Opção inválida");
        }
    };

    // -------- BOTÃO REMOVE LEMBRETE --------
    //const removeBtn = document.getElementById("removeLembreteBtn");
    if (removeLembreteBtn) {
        removeLembreteBtn.onclick = () => {
            noteLembrete.value = "";
            lembreteRemovido = true;
        };
    }

    // -------- SALVAR --------
    saveNoteBtn.onclick = async () => {
        const titulo = noteTitulo.value.trim();
        const conteudo = noteConteudo.value.trim();
        const autor = authorSelect.value;

        if (!titulo || !conteudo || !autor) {
            alert("Título, conteúdo e autor são obrigatórios");
            return;
        }

        const selectedTags = Array.from(document.querySelectorAll('input[name="tags"]:checked'))
            .map(input => Number(input.value));
        //console.log("selectedTags:", selectedTags);

        const lembreteInput = noteLembrete.value;
        let lembrete = null;
        if (!lembreteRemovido && lembreteInput) {
            lembrete = { data_hora: toBackendDatetime(lembreteInput) };
        }

        let notaRetorno;
        if (lembrete || lembreteRemovido) {
            notaRetorno = {
                titulo,
                conteudo,
                autor: Number(autor),
                tags: selectedTags,
                lembrete,
                links: currentLinks
            };
        } else {
            notaRetorno = {
                titulo,
                conteudo,
                autor: Number(autor),
                tags: selectedTags,
                links: currentLinks
            }; 
        }

        try {
            if (isEdit) {
                await updateNote(note.id,notaRetorno);
                alert("Nota editada com sucesso!");
            } else {
                await createNote(notaRetorno);
                alert("Nota criada com sucesso!");
            }

            actionContainer.innerHTML = "";
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

async function renderLinksList(links = []) {
    const container = document.getElementById("linksContainer");

    if (!links.length) {
        container.innerHTML = "<em>Nenhum link</em>";
        return;
    }

    // -------- RESOLVE LINKS INTERNOS -------- NÃO FUNCIONA
    const resolvedLinks = await Promise.all(
        links.map(async (link, index) => {
            return { ...link, index };
        })
    );

    // -------- RENDERIZA HTML --------
    container.innerHTML = `
        <ul>
            ${resolvedLinks.map(link => {
                if (link.tipo === "externo") {
                    return `
                        <li>
                            <a href="${link.url}" target="_blank">
                                ${link.url}
                            </a>
                            <button data-index="${link.index}" class="delete-link-btn">
                                Apagar
                            </button>
                        </li>
                    `;
                }

                if (link.tipo === "interno") {
                    return `
                        <li>
                            <a href="#" data-note-id="${link.nota_destino_id}">
                                ${link.nota_destino_titulo}
                            </a>
                            <button data-index="${link.index}" class="delete-link-btn">
                                Apagar
                            </button>
                        </li>
                    `;
                }
            }).join("")}
        </ul>
    `;

    // -------- BOTÕES APAGAR --------
    container.querySelectorAll(".delete-link-btn").forEach(btn => {
        btn.onclick = () => {
            const index = Number(btn.dataset.index);
            currentLinks.splice(index, 1);
            renderLinksList(currentLinks);
        };
    });

    // -------- LINKS INTERNOS (NAVEGAR) --------
    // container.querySelectorAll("a[data-note-id]").forEach(link => {
    //     link.onclick = e => {
    //         e.preventDefault();
    //         const noteId = Number(link.dataset.noteId);
    //         openNoteById(noteId); // sua função de navegação
    //     };
    // });
}

async function createInternalLink(currentLinks) {
    const refs = await listNoteReferences();

    const box = document.getElementById("internal-link-box");
    const input = document.getElementById("internal-link-search");
    const results = document.getElementById("internal-link-results");

    box.classList.remove("hidden");
    input.value = "";
    results.innerHTML = "";

    input.focus();

    input.oninput = () => {
        const term = input.value.toLowerCase();
        results.innerHTML = "";

        if (term.length < 2) return;

        const filtered = refs.data.filter(n =>
            n.titulo.toLowerCase().includes(term)
        );

        filtered.forEach(nota => {
            const li = document.createElement("li");
            li.textContent = nota.titulo;

            li.onclick = () => {
                currentLinks.push({
                    tipo: "interno",
                    nota_destino_id: nota.id,
                    nota_destino_titulo: nota.titulo
                });

                renderLinksList(currentLinks);

                // limpa UI
                box.classList.add("hidden");
                results.innerHTML = "";
                input.value = "";
            };

            results.appendChild(li);
        });
    };
}

async function loadNoteFormTemplate() {
    if (!noteFormTemplate) {
        const res = await fetch("./pages/notes/notes-form.html");
        noteFormTemplate = await res.text();
    }

    return noteFormTemplate;
}
