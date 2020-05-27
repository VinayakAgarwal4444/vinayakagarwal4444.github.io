//function to add note

function addNote() {
  var note = document.createElement('div');
  note.setAttribute('class', 'note');
  note.style.transform = `rotate(${randomInteger(-5, 5)}deg)`;
  note.innerHTML = `
    

          <div class="noteHeader">
            <button class="noteClose" onclick="deleteNote(this.parentElement.parentElement)">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="noteTitle" contenteditable="true">Title</div>
          <div class="noteBody" contenteditable="true">Notes</div>
    
    
    `;

  document.body.children[1].children[0].appendChild(note);
}

function deleteNote(oppa) {
  oppa.remove();
}

//random no. generator

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var q = 1;

function darkTheme() {
  if (q % 2 == 1) {
    document.body.style.backgroundColor = '#2b2b28';
    document.getElementById('darkTheme').innerHTML = 'LightMode';
  } else {
    document.body.style.background = '#ebebe3';
    document.getElementById('darkTheme').innerHTML = 'DarkMode';
  }
  q++;
}
