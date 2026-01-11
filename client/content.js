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

    button.addEventListener("click", (e) => {
        e.stopPropagation();
        popup.classList.toggle("active");
    });

    wrapper.querySelectorAll(".menu-item").forEach((item) => {
        item.addEventListener("click", () => {
            const tone = item.dataset.tone;
            popup.classList.remove("active");

            // Find post content
            let postContent = "";
            let parent = element.parentElement;

            while (parent) {
                const contentNode = parent.querySelector(".f07604c7._96ab7864");
                if (contentNode) {
                    postContent = contentNode.innerText.trim();
                    break;
                }
                parent = parent.parentElement;
                if (parent === document.body) break;
            }

            if (!postContent) {
                console.warn("Could not find post content for selector .f07604c7._96ab7864");
            }

            insertSuggestion(element, tone, postContent);
        });
    });

    document.addEventListener("click", () => {
        popup.classList.remove("active");
    });

    element.appendChild(wrapper);
}

async function insertSuggestion(element, tone, postContent) {
    const editor = element.querySelector("div[contenteditable='true']");
    if (!editor) return;
   
    // const suggestion = `[${tone}] Response to: "${postContent ? postContent.substring(0, 30) + '...' : 'Unknown'}..." ✨`;
    const suggestion =await generateComment(tone, postContent);

    editor.innerHTML = `<p>${suggestion}</p>`;
    editor.focus();

    // Move cursor to end
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(editor);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
}
