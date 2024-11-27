document.addEventListener("DOMContentLoaded", () => {
    // Charger les mots-clés depuis le fichier JSON
    fetch("keywords.json")
        .then(response => response.json())
        .then(data => {
            // Récupérer la liste des mots-clés et leurs classes CSS
            const keywords = data.keywords;
            
            // Charger les snippets de code depuis le fichier JSON
            fetch("snippet.json")
                .then(response => response.json())
                .then(snippets => {
                    // Ajouter des snippets aléatoires
                    for (let i = 0; i < 20; i++) {
                        const randomSnippet = snippets[Math.floor(Math.random() * snippets.length)];

                        // Créer un élément <p> pour chaque snippet
                        const snippetElement = document.createElement("p");
                        snippetElement.className = "code-snippet";
                        snippetElement.textContent = randomSnippet; // Insère le contenu brut
                        scrollingText.appendChild(snippetElement);

                        const randomTop = Math.random() * 90+5; 
                        snippetElement.style.top = `${randomTop}%`;

                        
                        const randomDuration = Math.random() * 16 + 8; 
                        snippetElement.style.animationDuration = `${randomDuration}s`;
                    }

                    // Appliquer la coloration syntaxique après la création des snippets
                    applySyntaxHighlighting(keywords);
                })
                .catch(error => console.error("Erreur lors du chargement des snippets :", error));
        })
        .catch(error => console.error("Erreur lors du chargement des mots-clés :", error));

    const scrollingText = document.querySelector(".scrolling-text");

    // Fonction de coloration syntaxique
    function applySyntaxHighlighting(keywords) {
        const snippetElements = document.querySelectorAll(".code-snippet");

        snippetElements.forEach(snippet => {
            let text = snippet.textContent;

            // Remplacer les mots-clés par des balises <span> avec les classes appropriées
            keywords.forEach(({ word, class: cssClass }) => {
                const regex = new RegExp(`\\b${word}\\b`, 'g'); // Mot exact
                text = text.replace(regex, `<span class="${cssClass}">${word}</span>`);
            });

            // Mettre à jour le contenu HTML avec les balises
            snippet.innerHTML = text;
        });
    }
});
