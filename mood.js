let selectedMood = "";
let currentDate = new Date();
let selectedDate = new Date();

function selectMood(mood, el) {
  selectedMood = mood;

  document
    .querySelectorAll(".emojis span")
    .forEach((e) => e.classList.remove("active"));

  if (el) el.classList.add("active");
}

function saveMood() {
  if (!selectedMood) {
    alert("Please select a Mood!");
    return;
  }

  let note = document.getElementById("moodNote").value;

  let data = JSON.parse(localStorage.getItem("moodData")) || [];
  let today = selectedDate.toLocaleDateString();
  data = data.filter((d) => d.date !== today);
  data.push({
    date: today,
    mood: selectedMood,
    note: note,
  });

  localStorage.setItem("moodData", JSON.stringify(data));

  updateStreak();
  showTodayMood();
  loadMoodHistory();
  renderCalendar();

  document.getElementById("moodNote").value = "";

  alert("Mood Saved!");
}

function showTodayMood() {
  let data = JSON.parse(localStorage.getItem("moodData")) || [];
  let today = new Date().toLocaleDateString();

  let entry = data
    .slice()
    .reverse()
    .find((d) => d.date === today);

  if (entry) {
    document.getElementById("todayMood").innerText =
      "Today's mood: " + entry.mood + " " + getEmoji(entry.mood);
  }
}

function moodMessage() {
  let streak = getStreak();

  document.getElementById("moodMessage").innerText =
    streak >= 5 ? "You're doing amazing 🌟" : "Keep tracking 💪";
}

function loadMoodHistory() {
  let data = JSON.parse(localStorage.getItem("moodData")) || [];

  let last = data.slice(-5).reverse();

  document.getElementById("moodHistory").innerHTML = last
    .map((d) => `<p>${d.date} - ${getEmoji(d.mood)} ${d.mood}</p>`)
    .join("");
}

function renderCalendar() {
  const calendar = document.getElementById("calendarDates");
  const monthYear = document.getElementById("monthYear");

  if (!calendar || !monthYear) return;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYear.innerText =
    currentDate.toLocaleString("default", { month: "long" }) + " " + year;

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  calendar.innerHTML = "";

  for (let i = 0; i < firstDay; i++) {
    calendar.innerHTML += "<div></div>";
  }

  let moodData = JSON.parse(localStorage.getItem("moodData")) || [];
  let todayStr = new Date().toLocaleDateString();
  for (let day = 1; day <= totalDays; day++) {
    let dateStr = new Date(year, month, day).toLocaleDateString();

    let entry = moodData.find((d) => d.date === dateStr);

    let moodClass = entry ? entry.mood : "";
    let emoji = entry ? getEmoji(entry.mood) : "";

    let isSelected =
      selectedDate.toLocaleDateString() === dateStr ? "selected-date" : "";

    let isToday = todayStr === dateStr ? "today-date" : "";

    calendar.innerHTML += `
    <div class="${moodClass} ${isSelected} ${isToday}" onclick="showNote('${dateStr}')">
      ${day}<br>${emoji}
    </div>
  `;
  }
}

function showNote(date) {
  selectedDate = new Date(date);

  document.getElementById("selectedDateText").innerText = "Selected: " + date;

  renderCalendar();
  showDayDetails(date);
}

function getEmoji(mood) {
  return (
    {
      happy: "😊",
      sad: "😢",
      tired: "😴",
      angry: "😡",
    }[mood] || ""
  );
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}
function showDayDetails(date) {
  let data = JSON.parse(localStorage.getItem("moodData")) || [];
  let entry = data.find((d) => d.date === date);

  document.getElementById("detailDate").innerText = date;

  if (entry) {
    document.getElementById("detailMood").innerText =
      "Mood: " + entry.mood + " " + getEmoji(entry.mood);

    document.getElementById("detailNote").innerText = entry.note
      ? "Note: " + entry.note
      : "No note";
  } else {
    document.getElementById("detailMood").innerText = "No mood saved";
    document.getElementById("detailNote").innerText = "";
  }
  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

function enableEditNote() {
  let noteEl = document.getElementById("detailNote");
  let input = document.getElementById("editNoteInput");
  let btn = document.getElementById("saveNoteBtn");

  if (!noteEl || !input || !btn) return;

  let noteText = noteEl.innerText.includes("Note:")
    ? noteEl.innerText.replace("Note: ", "")
    : "";

  input.style.display = "block";
  btn.style.display = "inline-block";

  input.value = noteText;
}

function saveEditedNote() {
  let newNote = document.getElementById("editNoteInput").value;
  let date = document.getElementById("detailDate").innerText;

  let data = JSON.parse(localStorage.getItem("moodData")) || [];

  data = data.map((d) => {
    if (d.date === date) {
      return { ...d, note: newNote };
    }
    return d;
  });

  localStorage.setItem("moodData", JSON.stringify(data));

  document.getElementById("editNoteInput").style.display = "none";
  document.getElementById("saveNoteBtn").style.display = "none";

  showDayDetails(date);
}

window.onload = function () {
  showTodayMood();
  loadMoodHistory();
  moodMessage();
  renderCalendar();
};
