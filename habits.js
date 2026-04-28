function getToday() {
  return new Date().toLocaleDateString();
}

function loadHabits() {
  let habits = JSON.parse(localStorage.getItem("habits")) || [];

  let container = document.getElementById("habitList");
  container.innerHTML = "";

  habits.forEach((habit, index) => {
    let today = getToday();
    let done = (habit.dates || []).includes(today);
    let progress = (habit.dates || []).length;
    let target = habit.targetDays || 7;

    container.innerHTML += `
      <div class="habit-card">
        
        <input 
          type="checkbox" 
          class="habit-checkbox"
          ${done ? "checked" : ""}
          onchange="toggleHabit(${index})"
        >
       <span class="${done ? "done-habit" : ""}">
         ${habit.name}
         <br>
        <small>${habit.category} • ${progress}/${target} days</small>
      </span>
        <button onclick="deleteHabit(${index})">❌</button>

      </div>
    `;
  });
  updateProgress();
  updateWeeklyStats();
  renderDonutChart();
}

function addHabit() {
  let input = document.getElementById("habitInput");
  let name = input.value.trim();
  let category = document.getElementById("categoryInput").value;

  if (!name) return;

  let targetInput = document.getElementById("daysInput").value;
  let target = parseInt(targetInput);

  let habits = JSON.parse(localStorage.getItem("habits")) || [];

  habits.push({
    name: name,
    dates: [],
    targetDays: target || 7,
    category: category,
  });

  localStorage.setItem("habits", JSON.stringify(habits));

  input.value = "";
  document.getElementById("daysInput").value = "";

  loadHabits();
}

function toggleHabit(index) {
  let habits = JSON.parse(localStorage.getItem("habits")) || [];

  let today = getToday();

  let dates = habits[index].dates || [];
  habits[index].dates = dates;

  if (dates.includes(today)) {
    habits[index].dates = dates.filter((d) => d !== today);
  } else if (dates.length < habits[index].targetDays) {
    dates.push(today);
  }

  localStorage.setItem("habits", JSON.stringify(habits));
  loadHabits();
}

function deleteHabit(index) {
  let habits = JSON.parse(localStorage.getItem("habits")) || [];

  habits.splice(index, 1);

  localStorage.setItem("habits", JSON.stringify(habits));
  loadHabits();
}
function updateProgress() {
  let habits = JSON.parse(localStorage.getItem("habits")) || [];
  let today = getToday();

  let total = habits.length;
  let done = habits.filter((h) => (h.dates || []).includes(today)).length;

  document.getElementById("progressText").innerText =
    `${done}/${total} habits completed today`;

  let percent = total ? (done / total) * 100 : 0;
  document.getElementById("progressFill").style.width = percent + "%";

  updateMessage(done, total);
}

function updateMessage(done, total) {
  let msg = "";

  if (total === 0) msg = "Start adding habits 🌱";
  else if (done === total) msg = "Perfect Day! 🔥";
  else if (done > total / 2) msg = "Great progress 💪";
  else if (done > 0) msg = "Good Start 🙂";
  else msg = "Let's begin 🚀";

  document.getElementById("smartMessage").innerText = msg;
}

function updateWeeklyStats() {
  let habits = JSON.parse(localStorage.getItem("habits")) || [];

  let today = new Date();
  let last7Days = [];

  for (let i = 0; i < 7; i++) {
    let d = new Date();
    d.setDate(today.getDate() - i);
    last7Days.push(d.toLocaleDateString());
  }

  let totalPossible = habits.length * 7;
  let completed = 0;

  habits.forEach((h) => {
    (h.dates || []).forEach((date) => {
      if (last7Days.includes(date)) completed++;
    });
  });

  let percent = totalPossible
    ? Math.round((completed / totalPossible) * 100)
    : 0;

  document.getElementById("weeklyStats").innerText =
    `Weekly Consistency: ${percent}%`;
}

function renderDonutChart() {
  let habits = JSON.parse(localStorage.getItem("habits")) || [];

  let counts = {};

  habits.forEach((h) => {
    let cat = h.category || "Other";
    counts[cat] = (counts[cat] || 0) + 1;
  });

  let labels = Object.keys(counts);
  let data = Object.values(counts);

  let ctx = document.getElementById("habitDonut");

  if (!ctx) return;

  if (window.donutChart) {
    window.donutChart.destroy();
  }

  const colors = ["#22c55e", "#4ade80", "#16a34a", "#86efac", "#15803d"];

  window.donutChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          borderWidth: 0,
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
      },
      cutout: "70%",
    },
  });

  let total = data.reduce((a, b) => a + b, 0);
  let legendHTML = "";
  labels.forEach((label, i) => {
    let percent = total ? Math.round((data[i] / total) * 100) : 0;
    legendHTML += `
      <div class="legend-item">
        <span class="legend-color" style="background:${colors[i]}"></span>
        ${label} - ${percent}%
      </div>
    `;
  });

  document.getElementById("chartLegend").innerHTML = legendHTML;
}
window.onload = loadHabits;
