const API_3DVUE = {
    EVENT: { LOAD_COMPLETE: "LOAD_COMPLETE", MODEL_DATA: "MODEL_DATA" },
    ACTION: { LOAD: "LOAD", GET_MODEL_DATA: "GET_MODEL_DATA" }
};

//on attend que le document soit prêt
document.addEventListener('DOMContentLoaded', () => {
    // Initialisation de l'objet qui contiendra toutes nos iframes
    const iframes = {};

    // BOUCLE : on récupère toutes les iframes de la page 
    document.querySelectorAll("iframe").forEach(iframe => {
        const id = iframe.id;

        if (id) {
            // structure de données de chaque iframe
            iframes[id] = {
                element: iframe,
                window: iframe.contentWindow,
                ready: false,
                config: []
            };
        }
    });

    // Initialiser les windows des iframes (sotcker dans contentWindow) pour eviter de devoir les chercher à chaque fois
    Object.keys(iframes).forEach(key => {
        if (iframes[key].element) {
            iframes[key].window = iframes[key].element.contentWindow;
        }
    });

    window.addEventListener("message", function (event) {
        // on ignore les messages vides ou sans l'objet 'data' interne
        if (!event.data || !event.data.data) return;

        // parsing obligatoire (selon la doc)
        const payload = JSON.parse(event.data.data);

        // l'iframe confirme le chargement
        if (event.data.event === API_3DVUE.EVENT.LOAD_COMPLETE) {
            // Trouver quel iframe a envoyé le message
            Object.keys(iframes).forEach(key => {
                const iframe = iframes[key];
                if (event.source === iframe.window) {
                    iframe.ready = true;

                    // LOAD_COMPLETE contient déjà le product_id
                    if (payload.product_id) {
                        iframe.config = payload.product_id.match(/.{1,2}/g);
                        console.log(`Config Initialisée pour ${key}:`, iframe.config);
                    }

                    // une demande les métadonnées pour être sûr
                    iframe.window.postMessage({ action: API_3DVUE.ACTION.GET_MODEL_DATA }, "*");
                }
            });
        }
    });

    // fonction unique pour mettre à jour le modèle
    function applyChange(iframeId, index, value) {
        const iframe = iframes[iframeId];
        if (!iframe || !iframe.ready) return;

        // mise à jour du tableau local
        iframe.config[index] = value;
        const newId = iframe.config.join("");

        // envoi à l'iframe
        iframe.window.postMessage({
            action: API_3DVUE.ACTION.LOAD,
            id: newId
        }, "*");

        console.log(`Action sur ${iframeId} : position modifiée ${index} avec ${value}`);
    }

    // écouteur pour les SELECT (change)
    document.querySelectorAll(".config-select").forEach(select => {
        select.addEventListener("change", function () {
            const iframeId = this.dataset.iframe;
            applyChange(iframeId, this.dataset.index, this.value);
        });
    });

    // écouteur pour les BOUTONS (clic)
    document.querySelectorAll(".config-trigger").forEach(button => {
        button.addEventListener("click", function () {
            const iframeId = this.dataset.iframe;
            applyChange(iframeId, this.dataset.index, this.dataset.value);
        });
    });
});