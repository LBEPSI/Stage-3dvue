const API_3DVUE = {
    EVENT: { LOAD_COMPLETE: "LOAD_COMPLETE", MODEL_DATA: "MODEL_DATA" },
    ACTION: { LOAD: "LOAD", }
};

// On attend que le document soit prêt
document.addEventListener('DOMContentLoaded', () => {
    // Initialisation de l'objet qui contiendra toutes nos iframes
    let iframes = [];

    // BOUCLE : on récupère uniquement les iframes de modèle 3D
    document.querySelectorAll("iframe[vue3d-iframe]").forEach(el => {

        let iframe = {
            element:el,
            id_array:null,
            ready:false
        }

        // Extraction du paramètre 'p' de l'URL src avec regex
        const src = el.getAttribute('src');

        if (src) {
            const match = src.match(/[?&]p=([^&]+)/);
            if (match) {
                iframe.id_array = (match[1]) ? match[1].match(/.{1,2}/g): null;
            }
        }

        iframes.push(iframe);

        console.log(`Iframe detectée [${el.getAttribute("vue3d-iframe")}] avec product_id:`, iframe.id_array);
    });

    window.addEventListener("message", function (event) {

        let iframe = iframes.find(
            (iframe) => iframe.element.contentWindow === event.source,
        );

        // L'iframe confirme le chargement
        if (event.data.event === API_3DVUE.EVENT.LOAD_COMPLETE)  iframe.ready = true;
    });

    // Fonction unique pour mettre à jour le modèle
    function applyChange(iframeKey, meshUrlId, value) {

        let iframe = iframes.find(
            (iframe) => iframe.element.getAttribute("vue3d-iframe") === iframeKey,
        );

        // Logs en cas d'erreur
        if (!iframe) {
            console.error(`Erreur: Iframe [${iframeKey}] introuvable`);
            return;
        }

        if (!iframe.ready) {
            console.warn(`Attention: Iframe [${iframeKey}] n'est pas encore chargée`);
            return;
        }

        // Mise à jour du tableau local
        iframe.id_array[parseInt(meshUrlId)+1] = value;
        const newId = iframe.id_array.join("");

        // Envoi à l'iframe
        iframe.element.contentWindow.postMessage({
            action: API_3DVUE.ACTION.LOAD,
            id: newId
        }, "*");

        console.log(`Nouveau product_id envoyé à [${iframeKey}]:`, newId);
    }

    // Écouteur pour les SELECT (change)
    document.querySelectorAll("select[vue3d-select]").forEach(el => {
        el.addEventListener("change", function () {
            const iframeKey = this.getAttribute("vue3d-iframe-target");
            const meshUrlId = this.getAttribute("vue3d-mesh-url-id");
            applyChange(iframeKey, meshUrlId, this.value);
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