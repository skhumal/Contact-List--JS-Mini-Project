// CONTACT LIST LOGIC 
// SAMPLE DATA
let contacts = loadContacts();

const SAMPLE = [
  {id: idGen(), name:"Thapelo", phone: "0751512753", email: "thapelo@example.com"},
  {id: idGen(), name: "Zandiswa", phone: "0698765433", email: "zandiswa@example.com"},
  {id: idGen(), name: "Thembi", phone: "0714213360", email: "thembi@gmail.com"}
];

const STORAGE_KEY = "my_contact_storage_v1";

// DOM ELEMNTS
const contactList = document.getElementById("contactList");
const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const searchInput = document.getElementById("searchInput");
const formMsg = document.getElementById("formMsg");
const clearBtn = document.getElementById("clearBtn");
const refreshBtn = document.getElementById("refreshBtn");

// INITIAL RENDER
renderContacts(contacts);

// EVENTS
contactForm.addEventListener("submit", (e) =>{
  e.preventDefault();

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const email = emailInput.value.trim();

  if (!name){
    showMsg("Name is required.");
    return;
  }

  if (email && !validateEmail(email)){
    showMsg("Invalid email.");
    return;
  }

  const newContact = { id: idGen(), name, phone, email};
  contacts.push(newContact);
  saveContacts(contacts);
  renderContacts(contacts);

  contactForm.reset();
  showMsg("Contact added!", 1500);
});

searchInput.addEventListener("input", ()=>{
  const q = searchInput.value.toLowerCase();
  if (!q){
    renderContacts(contacts);
    return;
  }

  const filtered = contacts.filter(c => c.name.toLowerCase().includes(q));
  renderContacts(filtered, q);
});

clearBtn.addEventListener("click", () =>{
  if (!confirm("Clear all contacts?")) return;
  contacts = [];
  saveContacts(contacts);
  renderContacts(contacts);
});

// FUNCTIONS
function renderContacts(list, q = ""){
  contactList.innerHTML = "";

  if (list.length === 0){
    contactList.innerHTML = `<div class="empty">No contacts.</div>`;
    return;
  }

  list.forEach(contact =>{
    const el = document.createElement("div");
    el.className = "contact";

    el.innerHTML = `
    <div class="meta">
    <div class="avatar">${escapeHTML(contact.name.slice(0,2)).toUpperCase()}</div>
    <div>
    <div class="name">${highlight(contact.name, q)}</div>
    <div class="sub">${contact.phone || "-"} ${contact.email ? "• " + contact.email: ""}</div>
    </div>
    </div>
    <button class="deleteBtn" data-id="${contact.id}">🗑</button>
    `;

    // delete handler
    el.querySelector(".deleteBtn").addEventListener("click", () => {
      deleteContact(contact.id);
    });

    contactList.appendChild(el);
  });
}

function deleteContact(id){
  if (!confirm("Delete this contact?")) return;
  contacts = contacts.filter(c => c.id !== id);
  saveContacts(contacts);
  renderContacts(contacts);
}

function saveContacts(arr){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function loadContacts(){
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data){
    saveContacts(SAMPLE);
    return SAMPLE.slice();
  }

  try {
    return JSON.parse(data);
  } catch{
    return SAMPLE.slice();
  }
}

function highlight(text, q){
  if (!q) return escapeHTML(text);
  const idx= text.toLowerCase().indexOf(q);
  if (idx === -1) return escapeHTML(text);

  return(
    escapeHTML(text.slice(0, idx)) +
    `<mark style="background:rgba(125,211,252,0.2);color:var(--accent);">` +
    escapeHTML(text.slice(idx, idx + q.length)) +
    `</mark>` +
    escapeHTML(text.slice(idx + q.length))
  );
}

function showMsg(msg, timeout = 0){
  formMsg.textContent = msg;
  if (timeout){
    setTimeout(() => {
      formMsg.textContent = "";
    }, timeout);
  }
}

function validateEmail(email){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// UTILITIES
function escapeHTML(str){
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function idGen(){
  return "id-" + Math.random().toString(36).slice(2, 9);
}

refreshBtn.addEventListener("click", () => {
  searchInput.value = "";
  renderContacts(contacts);
});
