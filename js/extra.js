document.addEventListener("DOMContentLoaded", function () {
    // Find all admonitions with the "prompt" class
    document.querySelectorAll(".admonition.prompt").forEach((admonition) => {
        // Create a "Copy" button
        const copyButton = document.createElement("button");
        copyButton.textContent = "Copy";
        copyButton.className = "copy-button";

        // Append the button to the admonition
        admonition.appendChild(copyButton);

        // Add event listener for the button
        copyButton.addEventListener("click", () => {
            // Collect all text content inside the admonition except the title and button
            const promptText = Array.from(admonition.querySelectorAll("p:not(.admonition-title)"))
                .map((p) => p.textContent.trim())
                .join("\n");

            if (promptText) {
                // Copy the collected text to the clipboard
                navigator.clipboard.writeText(promptText).then(
                    () => {
                        // Show feedback on successful copy
                        copyButton.textContent = "Copied!";
                        setTimeout(() => (copyButton.textContent = "Copy"), 2000);
                    },
                    (err) => {
                        console.error("Failed to copy text: ", err);
                    }
                );
            } else {
                console.error("No prompt text found to copy.");
            }
        });
    });
});

// ── Interactive infographic poster iframes ─────────────────────────────────
// Each poster iframe runs grid-diagram.js, which posts its content height via
// postMessage({ type: "microsim-resize", height }). Resize the matching iframe
// to fit so the full content — image, facts panel, and quiz answers — is always
// visible with scrolling="no" (no clipping, no scrollbar), at any window width.
window.addEventListener("message", function (event) {
    const data = event.data;
    if (!data || data.type !== "microsim-resize" || !data.height) return;
    const iframes = document.getElementsByTagName("iframe");
    for (let i = 0; i < iframes.length; i++) {
        if (iframes[i].contentWindow === event.source) {
            iframes[i].style.height = data.height + "px";
            break;
        }
    }
});