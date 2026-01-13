const API_3DVUE = {
    EVENT: { LOAD_COMPLETE: "LOAD_COMPLETE", MODEL_DATA: "MODEL_DATA" },
    ACTION: { LOAD: "LOAD", }
};

// On attend que le document soit prêt
document.addEventListener('DOMContentLoaded', () => {
    // Initialisation de l'objet qui contiendra toutes nos iframes
    const iframes = {};

    // BOUCLE : on récupère uniquement les iframes de modèle 3D
    document.querySelectorAll("iframe.iframe-3dvue").forEach(iframe => {
        // Utilisation de data-attribute au lieu d'ID
        const iframeKey = iframe.dataset.viewer || iframe.id;

        // Extraction du paramètre 'p' de l'URL src avec regex
        const src = iframe.getAttribute('src');
        let productId = null;

        if (src) {
            const match = src.match(/[?&]p=([^&]+)/);
            if (match) {
                productId = match[1];
            }
        }

        if (iframeKey) {
            // Structure simplifiée : element, id et ready uniquement
            iframes[iframeKey] = {
                element: iframe,
                id: productId ? productId.match(/.{1,2}/g) : [], // Configuration depuis l'URL
                ready: false
            };

            console.log(`Iframe initialisée [${iframeKey}] avec product_id:`, productId);
        }
    });

    window.addEventListener("message", function (event) {
        // On ignore les messages vides ou sans l'objet 'data' interne
        if (!event.data || !event.data.data) return;

        // Parsing avec gestion d'erreur améliorée
        let payload;
        try {
            payload = JSON.parse(event.data.data);
        } catch (error) {
            console.error("Erreur lors du parsing du message:", error);
            return;
        }

        // L'iframe confirme le chargement
        if (event.data.event === API_3DVUE.EVENT.LOAD_COMPLETE) {
            // Trouver quel iframe a envoyé le message
            Object.keys(iframes).forEach(key => {
                const iframe = iframes[key];
                if (event.source === iframe.element.contentWindow) {
                    iframe.ready = true;

                    // Mise à jour de la configuration depuis le product_id
                    if (payload.product_id) {
                        iframe.id = payload.product_id.match(/.{1,2}/g);
                        console.log(`Iframe [${key}] prête avec configuration:`, iframe.id);
                    } else {
                        console.log(`Iframe [${key}] prête sans product_id`);
                    }
                }
            });
        }
    });

    // Fonction unique pour mettre à jour le modèle
    function applyChange(iframeKey, index, value) {
        const iframe = iframes[iframeKey];

        // Logs en cas d'erreur
        if (!iframe) {
            console.error(`Erreur: Iframe [${iframeKey}] introuvable`);
            return;
        }

        if (!iframe.ready) {
            console.warn(`Attention: Iframe [${iframeKey}] n'est pas encore prête`);
            return;
        }

        if (!iframe.id || !Array.isArray(iframe.id)) {
            console.error(`Erreur: Configuration invalide pour iframe [${iframeKey}]`);
            return;
        }

        console.log(`Action sur [${iframeKey}]: modification position ${index} avec valeur "${value}"`);

        // Mise à jour du tableau local
        iframe.id[index] = value;
        const newId = iframe.id.join("");

        // Envoi à l'iframe
        iframe.element.contentWindow.postMessage({
            action: API_3DVUE.ACTION.LOAD,
            id: newId
        }, "*");

        console.log(`Nouveau product_id envoyé à [${iframeKey}]:`, newId);
    }

    // Écouteur pour les SELECT (change)
    document.querySelectorAll(".config-select").forEach(select => {
        select.addEventListener("change", function () {
            const iframeKey = this.dataset.iframe;
            applyChange(iframeKey, this.dataset.index, this.value);
        });
    });

    // Écouteur pour les BOUTONS (clic)
    document.querySelectorAll(".config-trigger").forEach(button => {
        button.addEventListener("click", function () {
            const iframeKey = this.dataset.iframe;
            applyChange(iframeKey, this.dataset.index, this.dataset.value);
        });
    });
});