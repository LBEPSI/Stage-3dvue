<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Configurateur 3D - 3DVUE</title>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css">

    <style>
        #iframe {
            width: 100%;
            min-height: 600px;
            border: none;
        }
    </style>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>

    <script src="script.js" type="text/javascript"></script>
</head>

<body>

<div class="container">
    <div class="row mt-4 mb-2">
        <div class="col text-center">   
            <h2>Personnalisez votre mobilier</h2>
        </div>
    </div>

    <div class="row mt-3 mb-3">
        <div class="col-md-6">
            <div class="form-group">
                <label for="FormAssise"><strong>Assise</strong></label>
                <select class="form-control config-select" id="FormAssise" data-index="4">
                    <option value="0p">Tissu cuir noir</option>
                    <option value="0n">Tissu coton gris</option>
                    <option value="0o">Tissu cuir beige</option>
                    <option value="0k">Tissu gris chiné</option>
                    <option value="0l">Tissu beige rayé</option>
                </select>
            </div>
        </div>

        <div class="col-md-6">
            <div class="form-group">
                <label for="FormsPied"><strong>Pieds</strong></label>
                <select class="form-control config-select" id="FormsPied" data-index="1">
                    <option value="2d">Bois chêne clair</option>
                    <option value="1q">Métal noir brossé</option>
                    <option value="08">Métal gris matte</option>
                </select>
            </div>
        </div>
    </div>

    <div class="mt-3">
        <label><strong>Choix rapide des pieds :</strong></label><br>
        <button type="button" class="btn btn-outline-primary config-trigger" data-index="1" data-value="2d">Chêne</button>
        <button type="button" class="btn btn-outline-primary config-trigger" data-index="1" data-value="1q">Métal Noir</button>
        <button type="button" class="btn btn-outline-primary config-trigger" data-index="1" data-value="08">Métal Gris</button>
    </div>

    <div class="row">
        <div class="col">
            <div id="iframe-container">
                <iframe id='iframe' src="https://mobilier-v3.3dvue.fr?p=0s2d0b0c0p"></iframe>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col">
            <div id="iframe-container">
                <iframe id='iframe' src="https://mobilier-v3.3dvue.fr/?p=0c032f4831"></iframe>
            </div>
        </div>
    </div>
    <div class="row mt-3">
        <div class="col text-muted small text-center">
            Propulsé par 3DVUE - Configuration dynamique
        </div>
    </div>  
</div>

</body>
</html>