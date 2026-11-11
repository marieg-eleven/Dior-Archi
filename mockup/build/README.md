# Build de la maquette

Auteur : Marie Guegain, eleven.

`index.html` est obtenu à partir de `original.html` (maquette v0.1) :

```
python3 build/step0_fonts.py original.html index.html   # police Figtree, Bodoni réservée aux grands titres
python3 build/step1_data.py index.html                   # 6 projets 2027 réels, appel d'offres Flinders Lane, documents illustrés
python3 build/step2_ui.py index.html                     # photos, plans, tableaux sources, Administration, couverture backlog
python3 build/step3_fixes.py index.html                  # tags backlog, navigation
python3 build/step4_ux.py index.html                     # v0.3 : My work, onglets projet, création de projet, données à jour, outils, recherche par univers
python3 build/step5_app.py index.html                    # v1.0 : couche fonctionnelle (build/pano.js)
python3 build/bundle_app.py                              # standalone/ et ../app/panoptic.html (artefact)
```
