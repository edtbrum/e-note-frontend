import { listNotes, searchNotesbyText } from "../../api/notes.js";
import { listTags } from "../../api/tags.js";
import { renderNoteView } from "./notes-view.js";

export async function renderNotesList() {
  const listContainer = document.getElementById("list");
  listContainer.innerHTML = "<p>Carregando notas...</p>";

  const select = document.getElementById("select-tags");
  const tagId = select.value;
  //console.log("value:", select.value);
  const search = document.getElementById("note-search");
  const searchText = search.value;
  //console.log("note-seach",searchText);

  try {
    let result;
    if (searchText) {
      result = await searchNotesbyText(searchText);
    }
    else {
      result = await listNotes();
    }
    //const result = await listNotes();
    const allNotes = result.data;
    if (allNotes.length === 0) {
      listContainer.innerHTML = "<p>Nenhuma nota cadastrada.</p>";
      return;
    }

    let notes;

    // Filtra por tags
    if (tagId) {
      notes = allNotes.filter(note => note.tags?.includes(Number(tagId)));
    }
    else {
      notes = allNotes;
    }

    // Filtra por texto da busca
    // if (searchText) {
    //   const text = searchText.toLowerCase();
    //   const filteredSearch = notes.filter(note => 
    //     note.titulo.toLowerCase().includes(text) || 
    //     note.conteudo.toLowerCase().includes(text)
    //   );

    //   notes = filteredSearch;
    // }

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

export async function loadTagsSelect() {
    const select = document.getElementById("select-tags");

    // opção padrão
    select.innerHTML = `
        <option value="">Todas as tags</option>
    `;

    const res = await listTags();

    res.data.forEach(tag => {
        const option = document.createElement("option");
        option.value = tag.id;       // usado no filtro
        option.textContent = tag.nome; // texto visível

        select.appendChild(option);
    });

    select.addEventListener("change", async () => {
        //const tagId = select.value; // string
        //filterNotesByTag(tagId);
        //console.log("value:", select.value);
        //console.log("texto:", select.options[select.selectedIndex].text);
        await renderNotesList();
    });
}
