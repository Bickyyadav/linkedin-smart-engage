const observer = new MutationObserver(() => {
    document
        .querySelectorAll(
            ".ac0607af.bb078a48._176a57ad._69ae962c._713807bc._710ac2b7"
        )
        .forEach((element) => {
            if (element.hasAttribute("data-muted")) return;

            // element.style.backgroundColor = 'red';
            element.setAttribute("data-muted", "true");
            addSuggestionButton(element);
        });
});
observer.observe(document.body, { childList: true, subtree: true });

async function addSuggestionButton(element) {
    if (element.querySelector(".ai-container")) return;

    const res = await fetch(chrome.runtime.getURL("ui/button.html"));
    const html = await res.text();

    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;

    const button = wrapper.querySelector("#aiButton");
    const popup = wrapper.querySelector("#aiPopup");

    // Toggle popup
    button.addEventListener("click", (e) => {
        e.stopPropagation();
        popup.classList.toggle("active");
    });

    // Handle menu click
    wrapper.querySelectorAll(".menu-item").forEach((item) => {
        item.addEventListener("click", () => {
            const tone = item.dataset.tone;
            popup.classList.remove("active");

            insertSuggestion(element, tone);
        });
    });

    document.addEventListener("click", () => {
        popup.classList.remove("active");
    });

    element.appendChild(wrapper);
}


function insertSuggestion(element, tone) {
  const editor = element.querySelector("div[contenteditable='true']");
  if (!editor) return;

  const suggestion = `This is a ${tone} AI comment ✨`;

  editor.innerHTML = `<p>${suggestion}</p>`;
  editor.focus();
}
