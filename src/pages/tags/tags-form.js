import { CreateTag } from "../../api/tags.js";
import { renderTagList } from "./tags-list.js";

export function renderTagForm() {
    const actionContainer = document.getElementById("action");

    // monta o HTML
    actionContainer.innerHTML = `
        <h2>Nova Tag</h2>

        <label>
            Tag:<br>
            <input id="tagName" value="">
        </label><br><br>

        <button id="saveTagBtn">Criar Tag</button>
    `;

    const saveBtn = document.getElementById("saveTagBtn");

    saveBtn.onclick = async () => {
        const nome = document.getElementById("tagName").value;

        if (!nome) {
            alert("Nome é obrigatório");
            return;
        }

        try {
            await CreateTag({ nome });
            alert("Tag criada com sucesso!");

            renderTagList();

        } catch (err) {
            console.error(err);
            alert(err.message || "Erro ao salvar tag");
        }
    };
}
