const API_3DVUE = {
    EVENT: { LOAD_COMPLETE: "LOAD_COMPLETE", MODEL_DATA: "MODEL_DATA" },
    ACTION: { LOAD: "LOAD", GET_MODEL_DATA: "GET_MODEL_DATA" }
};

//on attend que le document soit prêt
$(() => {
    const $iframe = $("#iframe");
    const iframeWindow = $iframe[0].contentWindow;
    let iFrameReady = false;
    let currentConfig = [];

    window.addEventListener("message", function (event) {

        // on ignore les messages vides ou sans l'objet 'data' interne
        if (!event.data || !event.data.data) return;

        // parsing obligatoire (selon la doc)
        const payload = JSON.parse(event.data.data);

        // l'iframe confirme le chargement
        if (event.data.event === API_3DVUE.EVENT.LOAD_COMPLETE) {
            iFrameReady = true;

            // LOAD_COMPLETE contient déjà le product_id
            if (payload.product_id) {
                currentConfig = payload.product_id.match(/.{1,2}/g);
                console.log("Config Initialisée :", currentConfig);
            }

            // une demande les métadonnées pour être sûr
            iframeWindow.postMessage({ action: API_3DVUE.ACTION.GET_MODEL_DATA }, "*");
        }
    });

    // fonction unique pour mettre à jour le modèle
    function applyChange(index, value) {
        if (!iFrameReady) return;

        // mise à jour du tableau local
        currentConfig[index] = value;
        const newId = currentConfig.join("");

        // envoi à l'iframe
        iframeWindow.postMessage({
            action: API_3DVUE.ACTION.LOAD,
            id: newId
        }, "*");

        console.log("Action : position modifiée " + index + " avec " + value);
    }

    // écouteur pour les SELECT (change)
    $(".config-select").on("change", function () {
        applyChange($(this).data("index"), $(this).val());
    });

    // écouteur pour les BOUTONS (clic)
    $(".config-trigger").on("click", function () {
        applyChange($(this).data("index"), $(this).data("value"));
    });
});
