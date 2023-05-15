const API = "http://localhost:8000/contact";

let container = document.querySelector(".container");
let btnAdd = document.querySelector(".btn-add");

let mainModal = document.querySelector(".main-modal");

let btnClose = document.querySelector("#btn-close");
let btnSave = document.querySelector("#btn-save");
let btnEdit = document.querySelector("#btn-edit");

let image = document.querySelector("#image");
let name = document.querySelector("#name");
let surname = document.querySelector("#surname");
let number = document.querySelector("#number");
let email = document.querySelector("#email");

let editId = 0;

btnAdd.addEventListener("click", function () {
  mainModal.style.display = "block";
  btnSave.style.display = "block";
  btnEdit.style.display = "none";
});

btnClose.addEventListener("click", function () {
  mainModal.style.display = "none";
});

btnSave.addEventListener("click", async function () {
  let obj = {
    image: image.value,
    name: name.value,
    surname: surname.value,
    number: number.value,
    email: email.value,
  };
  if (
    !obj.image.trim() ||
    !obj.name.trim() ||
    !obj.surname.trim() ||
    !obj.number.trim() ||
    !obj.email.trim()
  ) {
    alert("Заполните поле");
    return;
  }

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });

  image.value = "";
  name.value = "";
  surname.value = "";
  number.value = "";
  email.value = "";

  render();
});

// ! отображение Contact
async function render() {
  let contact = await fetch(API).then((res) => res.json());
  container.innerHTML = "";

  contact.forEach((elem) => {
    let newElem = document.createElement("div");
    newElem.innerHTML = `
    <div class="card" style="width:225px">
   <img src="${elem.image}" alt="..." style="width: 100%">
    <p>Name: ${elem.name}</p>
    <p>Surname: ${elem.surname}</p>
    <p>Number: ${elem.number}</p>
    <p>Email: ${elem.email}</p>
    <div class="btn-edit-delete">
    <button onclick="deleteCard(${elem.id} )" id="delete">DELETE</button>
    <button onclick="editCard(${elem.id})" id="edit">EDIT</button>
    </div>
    </div>`;
    container.append(newElem);
  });

  mainModal.style.display = "none";
}
render();

async function deleteCard(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  render();
}

async function editCard(id) {
  editId = id;
  mainModal.style.display = "block";
  btnSave.style.display = "none";
  btnEdit.style.display = "block";

  let res = await fetch(`${API}/${id}`);
  let data = await res.json();

  image.value = data.image;
  name.value = data.name;
  surname.value = data.surname;
  number.value = data.number;
  email.value = data.email;
}

btnEdit.addEventListener("click", async () => {
  let obj = {
    image: image.value,
    name: name.value,
    surname: surname.value,
    number: number.value,
    email: email.value,
  };

  await fetch(`${API}/${editId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });

  render();
});
