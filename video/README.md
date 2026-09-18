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

## Deuxième film — gamme WEPACK

`WepackMotoreducteurs` : 1920x1080, 30 fps, 107 s, dix scènes, fond sombre.

Les cinq rendus produits arrivent déjà détourés (alpha propre), donc rien n'est
reconstruit : ils sont posés, éclairés par l'arrière et reflétés au sol. La
seule retouche est le retrait de l'ombre portée blanche cuite dans la source,
qui virerait au voile gris sur un plateau noir. Elle se retire en deux temps
dans `tools/build-wepack-assets.mjs` :

1. la partie translucide, seule chose à la fois neutre et non opaque du fichier ;
2. la partie opaque, reconnue à sa planéité — une ombre sur un sol lisse a un
   écart-type de luminance de 0,7 à 1,6, contre 16 à 86 pour toute surface
   usinée. Le test ne retient que le gris moyen, ce qui préserve les barres
   blanches, l'aluminium et les plastiques noirs.

### Les deux schémas techniques

Scènes 3 et 4. Ils appliquent la convention de dessin en coupe : **une pièce,
une direction de hachure**. Le corps monobloc est hachuré d'un seul tenant du
logement de roulement à la paroi opposée ; le couvercle rapporté est hachuré en
sens inverse de l'autre côté d'un trait de jonction boulonné. C'est ce qui
porte l'argument, sans qu'aucun texte ait à l'expliquer.

Ce sont des **schémas de principe** : ils illustrent le montage décrit par
WEPACK, ils ne représentent pas une pièce WEPACK précise.

### Chiffres

Les couples, puissances et vitesses vivent dans `src/wepack/theme.ts`, copiés
tels quels depuis la documentation fournie. Rien n'est arrondi ni interpolé.

### Son

Le film est livré muet : voir `voiceover/README.md` pour le script voix off
minuté, les repères de sound design et la commande de mixage.

### Correspondance visuel / gamme

| Gamme | Rendu utilisé |
| --- | --- |
| N Series | réducteur hélicoïdal à flasque ronde |
| D Series | réducteur à arbres parallèles |
| K Series | réducteur à couple conique |

Le rendu à pattes et la vue éclatée servent de plans génériques, sans étiquette
de gamme. À corriger dans `src/wepack/theme.ts` si l'association diffère.

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
