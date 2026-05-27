// 1. Configurazione Scacchiera
var config = {
  draggable: true,
  dropOffBoard: 'trash', 
  sparePieces: true,     
  position: 'start',
  pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
};

var board = Chessboard('myBoard', config);

// 2. Controlli Base
$('#startBtn').on('click', board.start);
$('#clearBtn').on('click', board.clear);

$('#getFenBtn').on('click', function() {
    var currentFen = board.fen();
    $('#currentFenDisplay').text(currentFen);
});

// 3. Carica FEN e Puzzle
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

// 4. DATABASE LOCALE (localStorage)
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

// Inizializza la lista al caricamento della pagina
updateSavedList();

// 5. Registrazione Service Worker per uso offline (PWA)
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
