# 📖 Il Mio Ricettario

App PWA per gestire ricette e lista della spesa, con notifiche promemoria.

## File del progetto

| File | Descrizione |
|------|-------------|
| `index.html` | App principale |
| `sw.js` | Service Worker (notifiche in background) |
| `manifest.json` | Configurazione PWA |
| `icon-192.svg` | Icona app |

## Come pubblicare su GitHub Pages

1. Carica tutti i file in un repository GitHub pubblico
2. Vai in **Settings → Pages**
3. Source: `main` branch, cartella `/ (root)`
4. Salva — il sito sarà online su `https://TUONOME.github.io/ricettario/`

## Come convertire in APK con WebIntoApp

1. Vai su [webintoapp.com](https://webintoapp.com)
2. Incolla l'URL GitHub Pages
3. Abilita le notifiche nelle impostazioni
4. Scarica e installa l'APK

## Notifiche

Le notifiche arrivano sul telefono quando:
- L'app è installata come PWA (o APK tramite WebIntoApp)
- L'utente ha concesso il permesso notifiche
- È attivo il promemoria nella sezione 🛒 Lista della Spesa → 🔔
