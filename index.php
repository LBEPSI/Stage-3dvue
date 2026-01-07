<html>
<head>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <style>
        #iframe
        {
            width: 100%;
            min-height: 600px;
            border:none;
        }
    </style>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>

    <script type="text/javascript">

        let API_3DVUE = {
            EVENT:{
                LOAD_COMPLETE:"LOAD_COMPLETE",
            },
            ACTION:{
                LOAD:"LOAD",
            }
        }

        //on attend que le document soit prêt
        $(() => {

            //on récupère l'iframe
            const iframeWindow = document.getElementById("iframe").contentWindow;

            let iFrameReady = false;
            //on ajoute un écouteur pour recevoir les messages de l'iframe
            window.addEventListener("message", function(event) {
                //on attend les message qui nous informe qu'elle est prête à recevoir des messages
                if(event.data.event === API_3DVUE.EVENT.LOAD_COMPLETE && !iFrameReady) iFrameReady = true;
            });

            //url de base de l'objet (on peut aussi le récupérer dynamiquement
            let baseUrl = "0s2d0b0c0p";

            $("select").on("change", (e)=>{

                if(!iFrameReady) return;

                let $select = $(e.target).find(":selected")
                //on récupère l'index dans l'URL du material à changer
                let index = $select.attr('material-index');
                //on récupère l'id du material (voir CSV)
                let value = $select.attr('material-value');
                //on calcul sa position dans l'URL
                let urlPosition = 1+parseInt(index)*2;
                //on génère la nouvelle URL
                baseUrl = baseUrl.slice(0, urlPosition-1) + value + baseUrl.slice(urlPosition + 1);

                //On lance l'appel pour modifier le contenu de l'iframe
                let data = {
                    action:API_3DVUE.ACTION.LOAD,
                    id:baseUrl
                }
                iframeWindow.postMessage(data, "*");
            });
        });

    </script>
</head>

<body>

<div class="container">
    <div class="row mt-3 mb-3">
        <div class="col">

            <div class="form-group">
                <label for="FormAssise">Assise</label>
                <select class="form-control" id="FormAssise">
                    <option material-value="0p" material-index="4">tissu cuir noir</option>
                    <option material-value="0n" material-index="4">tissu coton gris</option>
                    <option material-value="0o" material-index="4">tissu cuir beige</option>
                    <option material-value="0k" material-index="4">tissu gris chiné</option>
                    <option material-value="0l" material-index="4">tissu beige rayé</option>
                </select>
            </div>

        </div>

        <div class="col">

            <div class="form-group">
                <label for="FormsPied">Pieds</label>
                <select class="form-control" id="FormsPied">
                    <option material-value="2d" material-index="1">bois chêne clair</option>
                    <option material-value="1q" material-index="1">métal noir brossé</option>
                    <option material-value="08" material-index="1">metal gris matte</option>
                </select>
            </div>

        </div>

    </div>

    <div class="row">
        <div class="col">
            <iframe id='iframe' src="https://mobilier-v3.3dvue.fr?p=0s2d0b0c0p"></iframe>
        </div>
    </div>

</div>
</body>
</html>