# 📘 README – Intégration d’un configurateur 3D 3DVUE (HTML uniquement)

Ce document explique comment intégrer et configurer un ou plusieurs modèles 3D sur un site web avec 3DVUE.
Toute la logique est déjà gérée automatiquement : Vous devez eulement ajouter des balises HTML correctement configurées.

## Principe général

Le modèle 3D est affiché dans une balise <iframe>

Les menus (<select>) et boutons (<button>) permettent de modifier le modèle

Les liens entre contrôles et modèle se font via des attributs HTML

Les valeurs à utiliser (value) sont fournies dans un fichier CSV


## 1 Ajouter un modèle 3D (iframe)

Chaque modèle 3D doit être placé dans une balise <iframe>.

Exemple minimal

```
<iframe
    vue3d-iframe="chaise"
    src="https://mobilier-v3.3dvue.fr?p=0s2d0b0c0p">
</iframe>
```

Attributs importants
Attribut	Description
vue3d-iframe	Identifiant unique du modèle (libre, ex: chaise, table, lampe)
src	URL du modèle 3D avec sa configuration par défaut

⚠️ Chaque modèle doit avoir un identifiant unique

## 2 Ajouter un menu déroulant (select)

Un menu permet de modifier une partie du modèle (ex : pieds, assise, couleur…).

Exemple complet
```
<select class="form-control"
        vue3d-iframe-target="chaise"
        vue3d-mesh-url-id="1"
        vue3d-select>
    <option value="2d">Bois chêne clair</option>
    <option value="1q">Métal noir brossé</option>
    <option value="08">Métal gris matte</option>
</select>
```

Attributs à renseigner
Attribut	Description
vue3d-select	Indique que ce select agit sur un modèle 3D
vue3d-iframe-target	Identifiant du modèle à modifier
vue3d-mesh-url-id	Position de l’élément dans la configuration du modèle
value	Code du matériau (fourni dans le CSV)
## 3 Comprendre vue3d-mesh-url-id

Le modèle 3D est défini par une chaîne de configuration, composée de blocs de 2 caractères :

```0s | 2d | 0b | 0c | 0p```


Chaque bloc correspond à une partie du modèle :

Position (vue3d-mesh-url-id)	Élément
```
0	Base / Structure
1	Pieds
2	Élément secondaire
3	Dossier
4	Assise
```

👉 Exemple :

```vue3d-mesh-url-id="1"```


➡️ agit sur les pieds

## 4 Que mettre dans <option value=""> (CSV)

Les valeurs possibles sont fournies dans un fichier CSV transmis au client.
```
Exemple de CSV
Nom affiché	Code
Bois chêne clair	2d
Métal noir brossé	1q
Métal gris matte	08
Correspondance HTML
```
```
<option value="2d">Bois chêne clair</option>
<option value="1q">Métal noir brossé</option>
<option value="08">Métal gris matte</option>
```


👉 Le texte est libre,
👉 La valeur DOIT correspondre exactement au code CSV

# 5 Ajouter des boutons (choix rapide)

Les boutons permettent un changement immédiat sans menu déroulant.

Exemple
```
<button
    type="button"
    class="btn btn-outline-primary"
    vue3d-mesh-url-id="1"
    value="2d"
    vue3d-iframe-target="chaise"
    vue3d-button>
    Chêne
</button>
```

Attributs nécessaires
```
Attribut	         Description
vue3d-button	     Indique que le bouton agit sur un modèle
vue3d-iframe-target	 Modèle ciblé
vue3d-mesh-url-id	 Partie du modèle
value	             Code matériau (CSV)
```
## 6 Associer les contrôles au bon modèle

Quand plusieurs modèles sont présents sur une page :

Chaque iframe a son propre identifiant

Chaque select ou bouton cible un seul modèle

Exemple
```vue3d-iframe="lampe"``` ```vue3d-iframe-target="lampe"```


👉 Les actions ne toucheront que ce modèle

## 7 Plusieurs modèles sur la même page

Exemple :
```
<iframe vue3d-iframe="chaise"></iframe>
<iframe vue3d-iframe="lampe"></iframe>
```

Puis :
```
<select vue3d-iframe-target="chaise">...</select>
<select vue3d-iframe-target="lampe">...</select>
```

➡️ Chaque modèle est totalement indépendant

## 8 Bonnes pratiques

✅ Toujours :

Vérifier les codes dans le CSV

Utiliser des identifiants clairs (chaise, table, lampe)

Tester chaque option une par une

❌ Éviter :

Réutiliser le même vue3d-iframe

Inventer des valeurs non présentes dans le CSV

Modifier l’URL à la main sans test

## 9 Résumé rapide
```
Élément	Obligatoire
iframe	vue3d-iframe
select	vue3d-select
bouton	vue3d-button
ciblage	vue3d-iframe-target
élément	vue3d-mesh-url-id
valeur	value (CSV)
```