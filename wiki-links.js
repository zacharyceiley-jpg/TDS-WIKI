// ================================
// TDS Wiki Automatic Key Term Links
// ================================

const wikiKeyLinks = {
  
    "Enemies": "/main/enemies.html",
    "Skins": "/main/skins.html",
    "Codes": "/main/codes.html",
    "Units": "/main/units.html",
    "Maps": "/main/maps.html"
  "Crates": "/main/crates.html"
"Tower": "/main/towers.html"
"Towers": "/main/towers.html"

};


// Don't replace text that is already inside a link,
// button, input, textarea, code, etc.
const ignoredTags = new Set([
    "A",
    "BUTTON",
    "INPUT",
    "TEXTAREA",
    "SELECT",
    "OPTION",
    "SCRIPT",
    "STYLE",
    "CODE",
    "PRE"
]);


function linkKeyTerms(root = document.body) {
    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT
    );

    const textNodes = [];

    while (walker.nextNode()) {
        const node = walker.currentNode;

        if (
            node.parentElement &&
            !ignoredTags.has(node.parentElement.tagName)
        ) {
            textNodes.push(node);
        }
    }

    // Longest terms first so:
    // "Golden Scout" gets matched before "Scout"
    const terms = Object.keys(wikiKeyLinks)
        .sort((a, b) => b.length - a.length);

    if (!terms.length) return;

    const regex = new RegExp(
        terms
            .map(term =>
                term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            )
            .join("|"),
        "gi"
    );

    textNodes.forEach(node => {
        const text = node.nodeValue;

        if (!regex.test(text)) {
            regex.lastIndex = 0;
            return;
        }

        regex.lastIndex = 0;

        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            const before = text.slice(lastIndex, match.index);

            if (before) {
                fragment.appendChild(
                    document.createTextNode(before)
                );
            }

            const matchedTerm = match[0];

            // Find the original key ignoring capitalization
            const key = terms.find(
                term => term.toLowerCase() === matchedTerm.toLowerCase()
            );

            const link = document.createElement("a");

            link.href = wikiKeyLinks[key];
            link.textContent = matchedTerm;
            link.className = "wiki-key-link";

            fragment.appendChild(link);

            lastIndex = regex.lastIndex;
        }

        const after = text.slice(lastIndex);

        if (after) {
            fragment.appendChild(
                document.createTextNode(after)
            );
        }

        node.parentNode.replaceChild(fragment, node);
    });
}


// Run automatically when the page loads
document.addEventListener("DOMContentLoaded", () => {
    linkKeyTerms();
});
