const API_BASE = "http://localhost:18080";

export async function listAuthors() {
  const res = await fetch(`${API_BASE}/authors`);
  if (!res.ok) throw new Error("Erro ao listar autores");
  return res.json(); // { count, data }
}

export async function createAuthor(author) {
  const res = await fetch(`${API_BASE}/authors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(author)
  });

  if (!res.ok) throw new Error("Erro ao criar autor");
  return res.json(); // autor criado
}

export async function updateAuthor(id, author) {
  const res = await fetch(`${API_BASE}/authors/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(author)
  });

  if (!res.ok) throw new Error("Erro ao atualizar autor");
}

export async function deleteAuthor(id) {
  const res = await fetch(`${API_BASE}/authors/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) throw new Error("Erro ao remover autor");
}
