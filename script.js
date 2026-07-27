// === PAROLE ITALIANE SEMPLICI (NO ACCENTI, NO APOSTROFI) ===
const parole = [
  "cane", "gatto", "casa", "albero", "fiore",
  "sole", "luna", "stella", "mare", "montagna",
  "pizza", "pasta", "pane", "latte", "acqua",
  "roma", "milano", "napoli", "libro", "scuola"
];

// === VARIABILI GIOCO ===
let parolaScelta = "";
let parolaIndovinata = [];
let tentativiRimanenti = 6;
let lettereUsate = [];
let modalitaGioco = 1; // 1 = un giocatore, 2 = due giocatori

// === AVVIO GIOCO ===
document.addEventListener('DOMContentLoaded', function() {
  aggiungiEventi();
  mostraSelezioneModalita();
});

// === AGGIUNGI EVENTI ===
function aggiungiEventi() {
  document.getElementById('mode1-btn').addEventListener('click', () => scegliModalita(1));
  document.getElementById('mode2-btn').addEventListener('click', () => scegliModalita(2));
  document.getElementById('start-game-btn').addEventListener('click', iniziaGiocoDueGiocatori);
  document.getElementById('reset-button').addEventListener('click', resettaGioco);
}

// === SCEGLI MODALITÀ ===
function scegliModalita(modalita) {
  modalitaGioco = modalita;
  
  // Aggiorna pulsanti
  document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`mode${modalita}-btn`).classList.add('active');
  
  if (modalita === 1) {
    // Un giocatore: inizia subito
    document.getElementById('player2-input').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    document.getElementById('mode-selection').style.display = 'none';
    giocoParolaCasuale();
  } else {
    // Due giocatori: mostra input
    document.getElementById('player2-input').style.display = 'block';
    document.getElementById('game-container').style.display = 'none';
  }
}

// === GIOCO UN GIOCATORE (PAROLA CASUALE) ===
function giocoParolaCasuale() {
  // Sceglie parola a caso
  parolaScelta = parole[Math.floor(Math.random() * parole.length)];
  iniziaPartita();
}

// === GIOCO DUE GIOCATORI ===
function iniziaGiocoDueGiocatori() {
  let parolaInserita = document.getElementById('custom-word').value.trim();
  
  // Controlla lunghezza
  if (parolaInserita.length < 3 || parolaInserita.length > 12) {
    alert('Parola tra 3 e 12 lettere!');
    return;
  }
  
  // Controlla accenti e apostrofi (semplice)
  if (!/^[a-zA-Z]+$/.test(parolaInserita)) {
    alert('Solo lettere normali (no accenti/apost)!');
    return;
  }
  
  parolaScelta = parolaInserita.toLowerCase();
  document.getElementById('custom-word').value = '';
  iniziaPartita();
  
  // Nascondi input
  document.getElementById('player2-input').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';
}

// === INIZIA PARTITA ===
function iniziaPartita() {
  // Crea underscore per ogni lettera
  parolaIndovinata = Array(parolaScelta.length).fill('_');
  tentativiRimanenti = 6;
  lettereUsate = [];
  
  mostraParola();
  aggiornaTeschi();
  mostraLettereUsate();
  creaTastiera();
}

// === MOSTRA PAROLA ===
function mostraParola() {
  document.getElementById('word-container').innerText = parolaIndovinata.join(' ');
}

// === AGGIORNA TESCHI ===
function aggiornaTeschi() {
  // Nascondi tutti
  for (let i = 1; i <= 6; i++) {
    document.getElementById(`hangman-${i}`).style.display = 'none';
  }
  // Mostra teschi persi
  let teschiVisibili = 6 - tentativiRimanenti;
  for (let i = 1; i <= teschiVisibili; i++) {
    document.getElementById(`hangman-${i}`).style.display = 'inline-block';
  }
}

// === MOSTRA LETTERE USATE ===
function mostraLettereUsate() {
  let testo = lettereUsate.length > 0 ? lettereUsate.join(', ') : 'nessuna';
  document.getElementById('guessed-letters').innerText = 'Lettere usate: ' + testo;
}

// === CREA TASTIERA ===
function creaTastiera() {
  const contenitore = document.getElementById('alphabet-container');
  contenitore.innerHTML = '';
  
  // 3 righe tastiera
  const righe = [
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['z','x','c','v','b','n','m']
  ];
  
  for (let riga of righe) {
    let divRiga = document.createElement('div');
    divRiga.classList.add('alphabet-row');
    
    for (let lettera of riga) {
      let bottone = document.createElement('div');
      bottone.classList.add('alphabet-letter');
      bottone.textContent = lettera.toUpperCase();
      bottone.addEventListener('click', function() { indovinaLettera(lettera) });
      divRiga.appendChild(bottone);
    }
    contenitore.appendChild(divRiga);
  }
}

// === INDOVINA LETTERA ===
function indovinaLettera(lettera) {
  // Se già usata
  if (lettereUsate.includes(lettera)) {
    alert('Già provata!');
    return;
  }
  
  lettereUsate.push(lettera);
  
  let indovinata = false;
  
  // Cerca lettera nella parola
  for (let i = 0; i < parolaScelta.length; i++) {
    if (parolaScelta[i] === lettera) {
      parolaIndovinata[i] = lettera;
      indovinata = true;
    }
  }
  
  if (!indovinata) {
    tentativiRimanenti--;
  }
  
  // Aggiorna schermo
  mostraParola();
  aggiornaTeschi();
  mostraLettereUsate();
  creaTastiera();
  
  // Controlla fine
  controllaFine();
}

// === CONTROLLA FINE PARTITA ===
function controllaFine() {
  let parolaCompleta = parolaIndovinata.join('');
  
  if (parolaCompleta === parolaScelta) {
    setTimeout(() => {
      alert('🎉 HAI VINTO!');
      resettaGioco();
    }, 300);
  } else if (tentativiRimanenti <= 0) {
    setTimeout(() => {
      alert('💀 HAI PERSO! Era: ' + parolaScelta.toUpperCase());
      resettaGioco();
    }, 300);
  }
}

// === RESETTA GIOCO ===
function resettaGioco() {
  if (modalitaGioco === 1) {
    giocoParolaCasuale();
  } else {
    // Torna al menu per 2 giocatori
    document.getElementById('mode-selection').style.display = 'flex';
    document.getElementById('player2-input').style.display = 'none';
    document.getElementById('game-container').style.display = 'none';
    document.querySelector('.mode-btn.active').classList.remove('active');
  }
}

// === MOSTRA MENU INIZIALE ===
function mostraSelezioneModalita() {
  document.getElementById('mode-selection').style.display = 'flex';
  document.getElementById('player2-input').style.display = 'none';
  document.getElementById('game-container').style.display = 'none';
}
