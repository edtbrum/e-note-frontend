export function confirmDialog(message) {
  return new Promise(resolve => {
    const modal = document.getElementById("confirmModal");
    const msg = document.getElementById("confirmMessage");
    const yes = document.getElementById("confirmYes");
    const no = document.getElementById("confirmNo");

    msg.textContent = message;
    modal.classList.remove("hidden");

    yes.onclick = () => {
      modal.classList.add("hidden");
      resolve(true);
    };

    no.onclick = () => {
      modal.classList.add("hidden");
      resolve(false);
    };
  });
}
