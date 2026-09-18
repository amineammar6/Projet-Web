# Voix off et musique — film WEPACK

Le film est livré **muet**. Cette session ne dispose d'aucun moteur de synthèse
vocale ni de banque musicale : produire une voix off ici aurait donné un timbre
robotique, exactement l'inverse du rendu « agence » demandé. Le montage image
est en revanche calé sur le texte ci-dessous, prêt à recevoir la bande son.

## Ce qu'il reste à faire

1. Faire enregistrer `wepack-voix-off.fr.srt` par un comédien voix masculine
   grave, ou par un service de synthèse haut de gamme (ElevenLabs, WellSaid,
   Azure Neural « Henri » / « Claude »).
2. Choisir une musique *Industrial Cinematic Corporate* sous licence
   (Artlist, Epidemic Sound, Musicbed), montée discrète au début, montée
   progressive sur les gammes, final plus large.
3. Mixer : voix à −3 dBFS crête, musique ducking à −18 dB sous la voix.

## Calage sur l'image

Les minutages du fichier SRT correspondent au découpage réel du montage :

| Scène | Début | Fin | Voix off |
| --- | --- | --- | --- |
| 1 Introduction | 0,0 s | 8,0 s | — (musique seule) |
| 2 Hero shot | 7,3 s | 19,0 s | cue 1 |
| 3 Corps monobloc | 18,3 s | 31,3 s | cues 2 et 3 |
| 4 Roulements | 30,6 s | 42,5 s | cue 4 |
| 5 N Series | 41,9 s | 53,1 s | cue 5 |
| 6 D Series | 52,5 s | 63,7 s | cue 6 |
| 7 K Series | 63,1 s | 74,3 s | cue 7 |
| 8 Comparaison | 73,7 s | 85,6 s | cue 8 |
| 9 Performance | 84,9 s | 95,9 s | cues 9 et 10 |
| 10 Final | 95,2 s | 107,3 s | cue 11 |

## Effets à poser au montage son

| Repère | Effet |
| --- | --- |
| 0,7 s | montée sourde, apparition du produit |
| 7,3 s / 18,3 s / 30,6 s … | whoosh court sur chaque fondu de scène |
| 19,8 s | trait métallique sur le tracé du corps monobloc |
| 24,0 s | clic technique à l'apparition de chaque avantage |
| 36,0 s | clic sec sur la coupe comparative |
| 43 s / 53,6 s / 64,2 s | impact grave sur chaque titre de gamme |
| 95,2 s | impact final, puis nappe tenue sous le logo |

## Montage de la bande son sur la vidéo

```console
ffmpeg -i wepack-motoreducteurs-1080p.mp4 -i bande-son.wav \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest \
  wepack-motoreducteurs-1080p-son.mp4
```

Pour incruster le texte en sous-titres (LinkedIn, lecture sans son) :

```console
ffmpeg -i wepack-motoreducteurs-1080p.mp4 \
  -vf "subtitles=voiceover/wepack-voix-off.fr.srt:force_style='FontName=Inter,FontSize=22'" \
  -c:a copy wepack-sous-titre.mp4
```
