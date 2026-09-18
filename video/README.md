# Remotion video

Film produit pour la **pompe péristaltique compacte** (réf. PP4001P0001) :
1920x1080, 30 fps, 50 s, H.264.

## La machine n'est jamais redessinée

Le produit à l'écran est la photographie fournie, pixel pour pixel. Aucune
reconstruction 3D, aucune image générée, aucun détourage.

Les photos sont sur fond blanc : elles sont composées en `mix-blend-mode:
multiply` sur un fond studio clair, ce qui rend le blanc du fond invisible tout
en conservant le corps, le liseré turquoise et l'ombre portée d'origine. Le
mouvement vient de la caméra (`transform`), pas d'une retouche du produit.

> Piège CSS : `opacity`, `transform` ou `filter` sur un **parent** crée un
> contexte d'empilement et coupe le `multiply` du fond — la photo s'affiche
> alors en rectangle blanc. Les fondus et les mouvements doivent porter sur
> l'élément qui porte le blend. Voir `src/promo/Product.tsx`.

## Assets

`public/product/*` est dérivé de `assets-src/` par `node tools/build-assets.mjs` :
aplatissement du bandeau bleu de la fiche technique, balance des blancs du fond,
fondu des bords de recadrage, agrandissement lanczos. Le disque `rotor.png` est
découpé dans la vue de face pour être tourné autour de son axe réel en scène 5.

La résolution source (634 x 550 px pour la photo principale) fixe le plafond de
netteté : les plans macro sont volontairement limités pour éviter le flou.

## Découpage

| Scène | Contenu |
| --- | --- |
| 1 | Apparition, plan large, travelling avant |
| 2 | Tour du produit : 3/4 avant, face, arrière, 3/4 arrière |
| 3 | Lecture technique : cadres, balayage, cote, schéma péristaltique |
| 4 | Macros commentées : écran et molette, tête de pompe, poignée |
| 5 | En fonctionnement : rotor animé, débit et vitesse |
| 6 | Recul caméra puis plaque de marque |

Les textes de marque (`brand`, `product`, `reference`, `website`) sont des props
de la composition, modifiables dans le Studio ou via `--props`.

## Commands

**Install Dependencies**

```console
npm i
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

Dans un conteneur sans Chrome complet (CI, sandbox), indiquez le binaire
`chrome-headless-shell` :

```console
npx remotion render HelloWorld out/video.mp4 \
  --browser-executable=/chemin/vers/chrome-headless-shell
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
