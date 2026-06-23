export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  date: string;
  category: string;
  readingTime: number;
  content: string; // HTML
}

export const posts: BlogPost[] = [
  {
    slug: "lombalgia-cosa-fare",
    title: "Mal di schiena: cosa fare (e cosa NON fare) quando inizia",
    metaTitle: "Mal di schiena: guida pratica | Fisioterapista Castrezzato Franciacorta",
    metaDescription:
      "Hai la lombalgia? Scopri cosa fare nelle prime 48 ore, quando andare dal fisioterapista e come prevenire le recidive. Consigli pratici di un fisioterapista a Castrezzato (BS).",
    excerpt:
      "La lombalgia acuta colpisce l'80% delle persone almeno una volta nella vita. Ecco cosa fare nelle prime ore, quando è il momento di consultare un fisioterapista e come evitare le recidive.",
    date: "2025-03-10",
    category: "Colonna vertebrale",
    readingTime: 5,
    content: `
      <h2>Che cos'è la lombalgia?</h2>
      <p>La <strong>lombalgia</strong> (o "mal di schiena lombare") è uno dei disturbi più diffusi nella popolazione adulta: si stima che l'80% delle persone ne soffra almeno una volta nella vita. Nella maggior parte dei casi è di natura <em>meccanica</em>, cioè non indica una patologia seria, ma un sovraccarico funzionale dei muscoli, dei legamenti o dei dischi intervertebrali.</p>

      <h2>Le prime 48 ore: cosa fare</h2>
      <ul>
        <li><strong>Continua a muoverti</strong> — il riposo a letto prolungato rallenta la guarigione. Cammina piano, cambia posizione frequentemente.</li>
        <li><strong>Applica calore localizzato</strong> — una borsa dell'acqua calda sui lombari può alleviare la tensione muscolare.</li>
        <li><strong>Evita gli sforzi improvvisi</strong> — ma non restare immobile: il movimento controllato è medicina.</li>
        <li><strong>Considera un antinfiammatorio</strong> — solo su consiglio medico e per il tempo strettamente necessario.</li>
      </ul>

      <h2>Cosa NON fare</h2>
      <ul>
        <li>Non stare a letto per giorni: peggiora la rigidità muscolare e l'umore.</li>
        <li>Non automedicarti con esercizi trovati su YouTube senza una valutazione: alcuni movimenti possono aggravare la situazione.</li>
        <li>Non ignorare segnali d'allarme (vedi sotto).</li>
      </ul>

      <h2>Quando andare subito al pronto soccorso</h2>
      <p>Ci sono situazioni in cui il mal di schiena richiede una valutazione medica urgente — i cosiddetti <strong>"red flags"</strong>:</p>
      <ul>
        <li>Dolore che si irradia alle gambe con formicolii o perdita di forza</li>
        <li>Difficoltà a controllare la vescica o l'intestino</li>
        <li>Dolore fortissimo a riposo o di notte</li>
        <li>Febbre associata al dolore lombare</li>
        <li>Storia di tumore o trauma recente</li>
      </ul>

      <h2>Quando contattare un fisioterapista</h2>
      <p>Se il dolore non migliora dopo 3-5 giorni, se si ripete spesso o se vuoi capire <em>perché</em> è successo e come evitare le recidive, è il momento di fissare una valutazione fisioterapica. Durante il primo appuntamento valuteremo la postura, la mobilità lombare, la forza muscolare e costruiremo un piano di trattamento personalizzato.</p>

      <h2>Prenota a Castrezzato (Franciacorta)</h2>
      <p>Il mio studio si trova a <strong>Castrezzato (BS)</strong>, facilmente raggiungibile da tutta la zona Franciacorta: Brescia, Chiari, Palazzolo, Rovato, Coccaglio. Se soffri di mal di schiena, <a href="/prenota">prenota online</a> la tua valutazione o contattami su WhatsApp al <a href="https://wa.me/393454431758">+39 345 443 1758</a>.</p>
    `,
  },
  {
    slug: "distorsione-caviglia-return-to-play",
    title: "Distorsione alla caviglia: i tempi di recupero e il ritorno allo sport",
    metaTitle: "Distorsione caviglia: recupero e ritorno allo sport | Fisioterapista Franciacorta",
    metaDescription:
      "Tempi, fasi e protocollo di recupero dalla distorsione alla caviglia. Come tornare a correre e giocare in modo sicuro. Fisioterapista a Castrezzato, Brescia.",
    excerpt:
      "La distorsione di caviglia è uno degli infortuni più comuni nello sport. Scopri le fasi di recupero, i tempi realistici e come capire quando sei davvero pronto a tornare in campo.",
    date: "2025-04-22",
    category: "Recupero sportivo",
    readingTime: 6,
    content: `
      <h2>Distorsione di caviglia: quanto è comune?</h2>
      <p>La <strong>distorsione laterale di caviglia</strong> rappresenta circa il 25% di tutti gli infortuni sportivi. È frequentissima nel calcio, nel basket e nella pallavolo. Nonostante sia spesso sottovalutata, una gestione inadeguata aumenta significativamente il rischio di recidive e di instabilità cronica.</p>

      <h2>Le fasi di recupero</h2>
      <h3>Fase 1 — Protezione e controllo del dolore (giorni 1-5)</h3>
      <p>Applicazione del protocollo <strong>PEACE &amp; LOVE</strong> (l'aggiornamento basato sull'evidenza del vecchio RICE): protezione, elevazione, evitare anti-infiammatori nelle prime 72 ore, compressione, educazione. Poi: carico graduale, ottimismo, vascolarizzazione ed esercizio.</p>

      <h3>Fase 2 — Mobilità e propriocezione (settimana 1-3)</h3>
      <p>Recupero del range of motion, esercizi di equilibrio, rinforzo muscolare con resistenze progressive. In questa fase il fisioterapista è fondamentale per calibrare i carichi senza ricadute.</p>

      <h3>Fase 3 — Return to Running (settimana 3-6)</h3>
      <p>Ripresa della corsa in linea, poi cambi di direzione, poi movimenti sport-specifici. Il criterio non è il tempo trascorso ma il <em>superamento di test funzionali</em> validati (hop test, Y-balance test).</p>

      <h3>Fase 4 — Return to Sport (settimana 6-10+)</h3>
      <p>Ritorno agli allenamenti di gruppo, poi alle partite. Questo passaggio deve essere graduale e monitorato.</p>

      <h2>Tempi realistici</h2>
      <p>Una distorsione di grado I (stiramento legamentoso) si recupera in <strong>2-4 settimane</strong>. Una di grado II (lesione parziale) richiede <strong>4-8 settimane</strong>. Una di grado III (rottura completa) può richiedere da <strong>3 a 6 mesi</strong>, talvolta con indicazione chirurgica.</p>

      <h2>Il rischio di tornare troppo presto</h2>
      <p>Come calciatore conosco bene la pressione di tornare in campo prima del previsto. Ma tornare senza aver completato la fase propriocettiva aumenta del 40-70% il rischio di recidiva nello stesso anno. Meglio una settimana in più di recupero che tre mesi fuori per recidiva.</p>

      <p>Sono a disposizione a <strong>Castrezzato (BS)</strong> per valutazione e trattamento delle distorsioni di caviglia. <a href="/prenota">Prenota online</a> o scrivimi su WhatsApp.</p>
    `,
  },
  {
    slug: "dolore-ginocchio-cause-trattamento",
    title: "Dolore al ginocchio: le cause più frequenti e quando affidarsi alla fisioterapia",
    metaTitle: "Dolore al ginocchio: cause e fisioterapia | Castrezzato Brescia Franciacorta",
    metaDescription:
      "Dolore al ginocchio durante la corsa, le scale o lo sport? Scopri le patologie più frequenti (sindrome femoro-rotulea, tendinopatia rotulea, menisco) e come la fisioterapia può aiutarti.",
    excerpt:
      "Dal dolore sotto la rotula al classico 'ginocchio del corridore': le patologie del ginocchio sono tra le più frequenti negli sportivi e nei sedentari. Ecco come riconoscerle e trattarle.",
    date: "2025-05-15",
    category: "Ginocchio",
    readingTime: 7,
    content: `
      <h2>Il ginocchio: una struttura complessa</h2>
      <p>Il ginocchio è l'articolazione più grande del corpo e tra le più sollecitate. Supporta il peso corporeo, assorbe gli impatti durante la corsa e permette movimenti complessi nel gesto sportivo. Per questo è anche una delle strutture più a rischio di infortuni e patologie.</p>

      <h2>Le patologie più frequenti</h2>

      <h3>1. Sindrome femoro-rotulea ("ginocchio del corridore")</h3>
      <p>Dolore diffuso sotto o intorno alla rotula, spesso peggiorato da scale, accovacciarsi o corsa in discesa. Nella maggior parte dei casi risponde bene alla fisioterapia: rinforzo del quadricipite e dei glutei, mobilità dell'anca, modifica del carico di allenamento.</p>

      <h3>2. Tendinopatia rotulea ("ginocchio del saltatore")</h3>
      <p>Dolore localizzato al polo inferiore della rotula, tipico di sport con salti (pallavolo, basket, calcio). Il trattamento d'elezione è l'<strong>esercizio eccentrico e isometrico</strong> progredito, non il riposo assoluto.</p>

      <h3>3. Lesioni meniscali</h3>
      <p>Dolore a una delle linee articolari del ginocchio, spesso con gonfiore e senso di blocco. Non tutte le lesioni meniscali richiedono chirurgia: molte rispondono positivamente alla fisioterapia con esercizio specifico.</p>

      <h3>4. Lesioni legamentose (LCA)</h3>
      <p>La rottura del legamento crociato anteriore è tra gli infortuni più temuti negli sportivi. La riabilitazione — che segua o meno l'intervento — dura tipicamente 9-12 mesi ed è fondamentale per ridurre il rischio di re-rottura.</p>

      <h3>5. Gonartosi (artrosi del ginocchio)</h3>
      <p>L'artrosi non è irreversibile, ma è gestibile. L'esercizio fisico terapeutico è il trattamento più efficace dimostrato dalla letteratura per ridurre il dolore e migliorare la funzione.</p>

      <h2>Quando andare dal fisioterapista</h2>
      <p>Se il dolore persiste da più di 2 settimane, se limita le attività quotidiane o sportive, o se si accompagna a gonfiore, instabilità o blocco articolare, è il momento di una valutazione fisioterapica. Prima si interviene, prima si risolve.</p>

      <p>Ricevo a <strong>Castrezzato (BS)</strong>, a pochi minuti da Brescia, Chiari e Palazzolo sull'Oglio. <a href="/prenota">Prenota la tua valutazione online</a>.</p>
    `,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
