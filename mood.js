let selectedMood = "";
let currentDate = new Date();

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
  let today = new Date().toLocaleDateString();

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

function updateStreak() {
  let today = new Date().toLocaleDateString();

  let streak = JSON.parse(localStorage.getItem("streak")) || {
    lastDate: null,
    count: 0,
  };

  if (streak.lastDate === today) return;

  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (streak.lastDate === yesterday.toLocaleDateString()) {
    streak.count++;
  } else {
    streak.count = 1;
  }

  streak.lastDate = today;

  localStorage.setItem("streak", JSON.stringify(streak));
}

function getStreak() {
  let s = JSON.parse(localStorage.getItem("streak")) || { count: 0 };
  return s.count;
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

  for (let day = 1; day <= totalDays; day++) {
    let dateStr = new Date(year, month, day).toLocaleDateString();

    let entry = moodData.find((d) => d.date === dateStr);

    let moodClass = entry ? entry.mood : "";
    let emoji = entry ? getEmoji(entry.mood) : "";

    calendar.innerHTML += `
      <div class="${moodClass}" onclick="showNote('${dateStr}')">
        ${day}<br>${emoji}
      </div>
    `;
  }
}

function showNote(date) {
  let data = JSON.parse(localStorage.getItem("moodData")) || [];
  let entry = data.find((d) => d.date === date);

  if (entry) {
    alert(
      date + "\nMood: " + entry.mood + "\nNote: " + (entry.note || "No note"),
    );
  } else {
    alert("No data for this date");
  }
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

window.onload = function () {
  showTodayMood();
  loadMoodHistory();
  moodMessage();
  renderCalendar();
};
