import { listTags, deleteTag } from "../../api/tags.js";

export async function renderTagList() {
    const actionContainer = document.getElementById("action");

    actionContainer.innerHTML = "<p>Carregando tags...</p>";

    try {
        const result = await listTags();
        const tags = result.data;

        if (tags.length === 0) {
            actionContainer.innerHTML = "<p>Nenhuma tag cadastrada.</p>";
            return;
        }

        actionContainer.innerHTML = "<h2>Tags</h2><ul id='tagUL'></ul>";
        const ul = document.getElementById("tagUL");

        tags.forEach(tag => {
            const li = document.createElement("li");
            const span = document.createElement("span");
            span.textContent = tag.nome;

            const deleteBtn = document.createElement("button");
            //deleteBtn.textContent = "Apagar";
            deleteBtn.innerHTML = "🗑️";
            deleteBtn.title = "Apagar tag";
            deleteBtn.classList.add("danger");

            deleteBtn.onclick = async () => {
                const confirmDelete = confirm(`Tem certeza que deseja apagar a tag "${tag.nome}"?`);
                if (!confirmDelete) return;

                try {
                    await deleteTag(tag.id);
                    alert("Tag removida com sucesso!");
                    renderTagList();
                } catch (err) {
                    console.error(err);
                    alert(err.message || "Erro ao apagar tag");
                }
            };

            li.appendChild(span);
            li.appendChild(deleteBtn);
            ul.appendChild(li);
        });

    } catch (error) {
        actionContainer.innerHTML = `<p style="color:red">${error.message}</p>`;
    }
}
