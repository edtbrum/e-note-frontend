const API_BASE = "http://localhost:18080";

export async function listTags() {
    const res = await fetch(`${API_BASE}/tags`);
    if(!res.ok) throw new Error("Erro ao listar tags");
    return res.json();
}

export async function CreateTag(tag) {
    const res = await fetch(`${API_BASE}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(tag)
    });

    if (!res.ok) throw new Error("Erro ao criar tag");
    return res.json(); // tag criada
}

export async function deleteTag(id) {
    const res = await fetch(`${API_BASE}/tags/${id}`, { 
        method: "DELETE" 
    });

    if (!res.ok) throw new Error("Erro ao remover tag");
}
