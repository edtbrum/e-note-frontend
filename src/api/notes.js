const API_BASE = "http://localhost:18080";

export async function listNotes() {
    const res = await fetch(`${API_BASE}/notes`);
    if(!res.ok) throw new Error("Erro ao listar notas");
    return res.json();
}
