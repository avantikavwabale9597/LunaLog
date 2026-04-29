function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}

function saveJournal() {
  let date = document.getElementById("journalDate").value || getTodayISO();
  let text = document.getElementById("journalText").value.trim();
  if (!text) return;

  let data = JSON.parse(localStorage.getItem("journalData")) || [];
  data = data.filter((d) => d.date !== date);
  data.push({ date, text });

  localStorage.setItem("journalData", JSON.stringify(data));
  document.getElementById("journalText").value = "";
  loadJournal();
}

function formatDate(dateStr) {
  let d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function loadJournal() {
  let data = JSON.parse(localStorage.getItem("journalData")) || [];
  let last = data.slice(-8).reverse();

  document.getElementById("journalHistory").innerHTML = last
    .map(
      (d, i) => `
      <div class="history-card">

        <div class="card-header">
          <b>${formatDate(d.date)}</b>

          <div class="card-actions">
            <img src="assets/edit.png" class="edit-icon"
              onclick="enableEdit(${i}, '${d.date}')">

            <img src="assets/bin.png" class="delete-icon"
              onclick="deleteJournal('${d.date}')">
          </div>
        </div>

        <p class="history-text" id="text-${i}">
          ${d.text}
        </p>

        ${
          d.text.length > 120
            ? `<span class="read-more" id="read-${i}" onclick="toggleRead(${i})">Read More</span>`
            : ""
        }

        <textarea id="edit-${i}" class="edit-area"></textarea>

        <div class="edit-actions" id="actions-${i}">
          <button onclick="saveEdit(${i}, '${d.date}')">Save</button>
          <button onclick="cancelEdit(${i})">Cancel</button>
        </div>

      </div>
    `,
    )
    .join("");

  // reset all edit UI hidden (important)
  last.forEach((_, i) => {
    document.getElementById(`edit-${i}`).style.display = "none";
    document.getElementById(`actions-${i}`).style.display = "none";
  });
}

function toggleRead(i) {
  let text = document.getElementById(`text-${i}`);
  let btn = document.getElementById(`read-${i}`);

  let expanded = text.getAttribute("data-expanded") === "true";

  if (expanded) {
    text.style.webkitLineClamp = "3";
    btn.innerText = "Read More";
    text.setAttribute("data-expanded", "false");
  } else {
    text.style.webkitLineClamp = "unset";
    btn.innerText = "Show Less";
    text.setAttribute("data-expanded", "true");
  }
}

function enableEdit(i, date) {
  let text = document.getElementById(`text-${i}`);
  let edit = document.getElementById(`edit-${i}`);
  let actions = document.getElementById(`actions-${i}`);
  let read = document.getElementById(`read-${i}`);

  edit.value = text.innerText;

  text.style.display = "none";
  edit.style.display = "block";
  actions.style.display = "flex";

  if (read) read.style.display = "none";
}

function cancelEdit(i) {
  let text = document.getElementById(`text-${i}`);
  let edit = document.getElementById(`edit-${i}`);
  let actions = document.getElementById(`actions-${i}`);
  let read = document.getElementById(`read-${i}`);

  edit.style.display = "none";
  actions.style.display = "none";
  text.style.display = "block";

  // reset state properly
  text.style.webkitLineClamp = "3";
  text.setAttribute("data-expanded", "false");

  if (read) {
    read.innerText = "Read More";
    read.style.display = "inline-block";
  }
}

function saveEdit(i, date) {
  let newText = document.getElementById(`edit-${i}`).value;

  let data = JSON.parse(localStorage.getItem("journalData")) || [];

  data = data.map((d) => (d.date === date ? { ...d, text: newText } : d));

  localStorage.setItem("journalData", JSON.stringify(data));
  loadJournal();
}

function deleteJournal(date) {
  let data = JSON.parse(localStorage.getItem("journalData")) || [];
  data = data.filter((d) => d.date !== date);
  localStorage.setItem("journalData", JSON.stringify(data));
  loadJournal();
}

window.onload = function () {
  document.getElementById("journalDate").value = getTodayISO();
  loadJournal();
};
