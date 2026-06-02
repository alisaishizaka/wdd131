
const form = document.querySelector("#eventForm");
const typeRange = document.querySelector("#typeRange");
const notesContainer = document.querySelector("#notesContainer");
const notesContainer2 = document.querySelector("#notesContainer2");
const studentId = document.querySelector("#studentId");
const accessCode = document.querySelector("#accessCode");
const output = document.querySelector("#output");

function updateNotesField() {
  const value = typeRange.value;

  if (value === 'student') {
    notesContainer.hidden = false;
    studentId.required = true;
    notesContainer2.hidden = true;
    accessCode.required = false;
  } else if (value === 'guest') {
    notesContainer.hidden = true;
    studentId.required = false;
    notesContainer2.hidden = false;
    accessCode.required = true;
  } else {
    notesContainer.hidden = true;
    studentId.required = false;
    notesContainer2.hidden = true;
    accessCode.required = false;
  }
}

typeRange.addEventListener("change", updateNotesField);
updateNotesField();


// Ensure they choose a date later than the current date
function isPastDate(value) {
  const today = new Date();
  const chosen = new Date(value);
  return chosen < today;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  output.textContent = "";

  const firstName = form.firstName.value.trim();
  const lastName = form.lastName.value.trim();
  const email = form.email.value.trim();
  const type = form.typeRange.value;
  const availableDate = form.availableDate.value;
  const studentId = form.studentId.value.trim();
  const accessCode = form.accessCode.value.trim();
  
  if (type === 'student' && studentId.length != 9) {
    output.textContent = "Student I# must be 9 digits";
    return;
  }
  
  if (type === 'guest' && accessCode != 'EVENT131') {
    output.textContent = "Access Code is wrong";
    return;
  }

  if (isPastDate(availableDate)) {
    output.textContent = "Please choose a later date.";
    return;
  }

  output.innerHTML = `
  <h2>Ticket Created</h2>
  <p>${firstName} ${lastName}</p>
  <p>${type}</p>
  <p>${availableDate}</p>
  `;

  form.reset();
  updateNotesField();
});
          