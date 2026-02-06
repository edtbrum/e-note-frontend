const API_BASE = "http://localhost:18080";

export async function listNotes() {
    const res = await fetch(`${API_BASE}/notes`);
    if(!res.ok) throw new Error("Erro ao listar notas");
    return res.json();
}

export async function findNote(id) {
    const res = await fetch(`${API_BASE}/notes/${id}`);
    if(!res.ok) throw new Error("Erro ao listar notas");
    return res.json();
}

export async function createNote(note) {
    const res = await fetch(`${API_BASE}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note)
    });

    if (!res.ok) throw new Error("Erro ao criar a nota");
    return res.json(); // id da nota criada
}

export async function updateNote(id, note) {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note)
    });

    if (!res.ok) throw new Error("Erro ao atualizar nota");
}

export async function deleteNote(id) {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
        method: "DELETE"
    });

    if (!res.ok) throw new Error("Erro ao remover nota");
}
