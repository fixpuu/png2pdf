# PNG to PDF Pro 📄✨

Applicazione web moderna, velocissima e responsive (ottimizzata al 100% per l'uso da smartphone e desktop) creata per unire e convertire più immagini PNG in un unico file PDF di altissima qualità.

Sviluppata con **Next.js (App Router)**, **Tailwind CSS**, **pdf-lib** e **@dnd-kit**, pronta per il deployment immediato su **Vercel**.

---

## 🚀 Caratteristiche Principali

1. **Ordinamento Impeccabile & Touch-Friendly:**
   - **Doppia modalità di riordino:** Drag-and-drop con sensore touch ottimizzato (nessun blocco dello scroll verticale) oppure semplici pulsanti freccia tattili (`←` / `→` o `↑` / `↓`) per riordinare le pagine con un singolo tocco su smartphone.
   - Strumenti rapidi in testata: **Ordina per nome (A-Z)**, **Inverti ordine**, **Aggiungi altre immagini** e **Svuota lista**.
   - Rotazione di 90° per singola immagine direttamente nella card o nell'anteprima.
   - Modalità Lightbox per ingrandire e verificare ogni pagina a risoluzione completa.

2. **Massima Risoluzione & Velocità (100% Client-Side):**
   - L'elaborazione avviene interamente nel browser dell'utente usando la libreria ad alte prestazioni `pdf-lib`.
   - **Zero perdita di qualità:** I byte originali dei PNG vengono incorporati direttamente nel PDF senza compressioni lossy o riduzioni di DPI.
   - **Zero upload su server:** Massima velocità, nessun timeout serverless e privacy garantita al 100%.
   - **Formati pagina flessibili:**
     - *Risoluzione Originale PNG (1:1)*: Ciascuna pagina adotta le dimensioni esatte dell'immagine.
     - *Standard A4 (Adattivo / Verticale / Orizzontale)*: Adatta con precisione millimetrica l'immagine all'interno del foglio A4 con margini personalizzabili (Nessuno, Stretto 5mm, Standard 10mm).

3. **Ottimizzazione Mobile & UI Moderna:**
   - Interfaccia minimale, pulita e scattante con Tailwind CSS e icone Lucide.
   - Pulsanti di tocco ampi (minimo 44px) studiati specificamente per dita e smartphone.
   - Nome del file PDF personalizzabile e feedback con coriandoli (`canvas-confetti`) al completamento del download.

---

## 🛠️ Come Avviare il Progetto in Locale

### Requisiti
- **Node.js** v18+ (testato su v22)
- **npm** o gestore pacchetti equivalente

### Avvio
```bash
cd png2pdf
npm install
npm run dev
```
Apri il browser su [http://localhost:3000](http://localhost:3000).

### Test di Build di Produzione
```bash
npm run build
```

---

## ⚡ Deployment Istantaneo su Vercel

Il progetto è pre-configurato come applicazione Next.js standard e non richiede alcuna variabile d'ambiente o configurazione server:

### Metodo 1: Tramite GitHub (Consigliato)
1. Esegui il push di questa cartella (`png2pdf`) su una nuova repository GitHub:
   ```bash
   git add .
   git commit -m "Initial commit - PNG to PDF Pro"
   git branch -M main
   git remote add origin <URL-REPO-GITHUB>
   git push -u origin main
   ```
2. Vai su [vercel.com](https://vercel.com) e accedi con GitHub.
3. Clicca su **"Add New Project"** e importa il repository `png2pdf`.
4. Vercel riconoscerà automaticamente Next.js. Clicca su **"Deploy"**.

### Metodo 2: Tramite Vercel CLI
```bash
npm install -g vercel
vercel
```
Rispondi con `Y` alle domande predefinite per pubblicare l'app in pochi secondi.

---

## 📂 Struttura del Progetto

```
png2pdf/
├── src/
│   ├── app/
│   │   ├── globals.css          # Stili globali Tailwind CSS
│   │   ├── layout.tsx           # Metadata SEO, viewport mobile e RootLayout
│   │   └── page.tsx             # Pagina principale dell'applicazione
│   ├── components/
│   │   ├── ExportCard.tsx       # Pannello opzioni, nome file e pulsante download con progress bar
│   │   ├── FileUploader.tsx     # Area drag & drop e selezione file (singola/multipla)
│   │   ├── Footer.tsx           # Footer informativo e badge
│   │   ├── ImagePreviewModal.tsx# Modale lightbox per zoom e navigazione tra le pagine
│   │   ├── Navbar.tsx           # Barra di navigazione con logo e badge privacy
│   │   ├── SortableImageCard.tsx# Card singola pagina con drag-handle e pulsanti freccia touch
│   │   └── SortableImageList.tsx# Griglia/lista riordinabile con @dnd-kit
│   ├── lib/
│   │   ├── pdf-generator.ts     # Motore client-side pdf-lib ad alta qualità
│   │   └── utils.ts             # Utility per byte, dimensioni immagine e ID unici
│   └── types/
│       └── index.ts             # Interfacce TypeScript
├── package.json
└── tsconfig.json
```
