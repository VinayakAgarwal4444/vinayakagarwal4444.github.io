function addNote() {
  var note = document.createElement('div');
  note.setAttribute('class', 'note');

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
