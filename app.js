// --- GESTIONE CRONOLOGIA MOSSE ---
var moveHistory = [];
var historyIndex = -1;
var isProgrammatic = false; // Evita loop infiniti quando navighiamo nella cronologia

function updateNavigationButtons() {
    // Attiva o disattiva i tasti Avanti/Indietro a seconda della posizione attuale
    $('#prevBtn').prop('disabled', historyIndex <= 0);
    $('#nextBtn').prop('disabled', historyIndex >= moveHistory.length - 1);
}

function pushHistory(fen) {
    if (isProgrammatic) return;

    // Se l'utente era tornato indietro e fa una nuova mossa, cancella il "futuro" precedente
    if (historyIndex < moveHistory.length - 1) {
        moveHistory = moveHistory.slice(0, historyIndex + 1);
    }

    // Evita di registrare due volte lo stesso identico stato di fila
    if (moveHistory.length > 0 && moveHistory[historyIndex] === fen) return;

    moveHistory.push(fen);
    historyIndex++;
    updateNavigationButtons();
}

// --- 1. Configurazione Scacchiera ---
var config = {
  draggable: true,
  dropOffBoard: 'trash', 
  sparePieces: true,     
  position: 'start',
  pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
  
  // Questo evento rileva AUTOMATICAMENTE qualsiasi modifica alla scacchiera
  onChange: function(oldPos, newPos) {
      var fen = Chessboard.objToFen(newPos);
      pushHistory(fen);
  }
};

var board = Chessboard('myBoard', config);

// --- 2. Logica Tasti Navigazione ---
$('#prevBtn').on('click', function() {
    if (historyIndex > 0) {
        isProgrammatic = true;
        historyIndex--;
        board.position(moveHistory[historyIndex], false); // false disabilita le animazioni per sincronia pura
        isProgrammatic = false;
        updateNavigationButtons();
    }
});

$('#nextBtn').on('click', function() {
    if (historyIndex < moveHistory.length - 1) {
        isProgrammatic = true;
        historyIndex++;
        board.position(moveHistory[historyIndex], false);
        isProgrammatic = false;
        updateNavigationButtons();
    }
});

// --- 3. Controlli Base ---
$('#startBtn').on('click', board.start);
$('#clearBtn').on('click', board.clear);

$('#getFenBtn').on('click', function() {
    var currentFen = board.fen();
    $('#currentFenDisplay').text(currentFen);
});

// --- 4. Carica FEN e Puzzle ---
$('#loadFenBtn').on('click', function() {
    var fen = $('#fenInput').val().trim();
    if (fen) {
        board.position(fen);
    }
});

$('#loadPuzzleBtn').on('click', function() {
    var fen = $('#puzzleSelect').val();
    board.position(fen);
    $('#fenInput').val(fen);
    $('#currentFenDisplay').text(""); 
});

// --- 5. DATABASE LOCALE (localStorage) ---
function updateSavedList() {
    var savedPositions = JSON.parse(localStorage.getItem('chess_positions')) || [];
    var $list = $('#savedPositionsList');
    $list.empty(); 
    
    if (savedPositions.length === 0) {
        $list.html('<p style="color: #888; font-size: 13px; font-style: italic;">Nessuna posizione salvata.</p>');
        return;
    }
    
    savedPositions.forEach(function(item, index) {
        var $item = $('<div class="saved-item"></div>');
        $item.append('<span>' + item.name + '</span>');
        
        var $actions = $('<div class="actions"></div>');
        
        var $loadBtn = $('<button class="btn-sm">Carica</button>').on('click', function() {
            board.position(item.fen);
            $('#fenInput').val(item.fen); 
            $('#currentFenDisplay').text(""); 
        });
        
        var $delBtn = $('<button class="btn-sm btn-danger">Elimina</button>').on('click', function() {
            deletePosition(index);
        });
        
        $actions.append($loadBtn).append($delBtn);
        $item.append($actions);
        $list.append($item);
    });
}

$('#savePosBtn').on('click', function() {
    var name = $('#saveNameInput').val().trim();
    if (!name) {
        alert('Inserisci un nome per la posizione.');
        return;
    }
    
    var fen = board.fen();
    var savedPositions = JSON.parse(localStorage.getItem('chess_positions')) || [];
    
    savedPositions.push({ name: name, fen: fen });
    localStorage.setItem('chess_positions', JSON.stringify(savedPositions));
    
    $('#saveNameInput').val('');
    updateSavedList();
});

function deletePosition(index) {
    var savedPositions = JSON.parse(localStorage.getItem('chess_positions')) || [];
    savedPositions.splice(index, 1);
    localStorage.setItem('chess_positions', JSON.stringify(savedPositions));
    updateSavedList();
}

updateSavedList();

// --- 6. Registrazione Service Worker para PWA ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(registration => {
        console.log('SW registrato:', registration.scope);
      })
      .catch(error => {
        console.log('SW registrazione fallita:', error);
      });
  });
}
