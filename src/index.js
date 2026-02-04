import { listAuthors } from "./api/authors.js";

// pega o botão
const btnLoadAuthors = document.getElementById("btnLoadAuthors");

// pega a lista
const authorList = document.getElementById("authorList");

// evento de clique
btnLoadAuthors.addEventListener("click", async () => {
  try {
    const result = await listAuthors();
    const authors = result.data;

    // limpa a lista antes de renderizar
    authorList.innerHTML = "";

    authors.forEach(author => {
      const li = document.createElement("li");
      li.textContent = `${author.nome} (${author.email})`;
      authorList.appendChild(li);
    });

  } catch (error) {
    alert(error.message);
  }
});
