document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
});

function getStreak() {
  let s = JSON.parse(localStorage.getItem("streak")) || { count: 0 };
  return s.count;
}

function getBestStreak() {
  return JSON.parse(localStorage.getItem("bestStreak")) || 0;
}

function updateStreak() {
  let data = JSON.parse(localStorage.getItem("moodData")) || [];

  if (data.length === 0) {
    localStorage.setItem("streak", JSON.stringify({ count: 0 }));
    return;
  }

  let dates = data.map((d) => new Date(d.date)).sort((a, b) => b - a);

  let streak = 1;

  for (let i = 0; i < dates.length - 1; i++) {
    let diff = Math.round((dates[i] - dates[i + 1]) / (1000 * 60 * 60 * 24));

    if (diff === 1) streak++;
    else if (diff > 1) break;
  }

  localStorage.setItem("streak", JSON.stringify({ count: streak }));

  let best = JSON.parse(localStorage.getItem("bestStreak")) || 0;

  if (streak > best) {
    localStorage.setItem("bestStreak", JSON.stringify(streak));
  }
}
function loadHomeData() {
  let today = new Date().toLocaleDateString();

  let moodData = JSON.parse(localStorage.getItem("moodData")) || [];
  let moodEntry = moodData.find((d) => d.date === today);

  document.getElementById("homeMood").innerText = moodEntry
    ? moodEntry.mood
    : "No entry";

  let sleepData = JSON.parse(localStorage.getItem("sleepData")) || [];
  let sleepEntry = sleepData.find((d) => d.date === today);

  document.getElementById("homeSleep").innerText = sleepEntry
    ? sleepEntry.duration + " hrs"
    : "No data";

  let habits = JSON.parse(localStorage.getItem("habits")) || [];

  let done = habits.filter((h) => (h.dates || []).includes(today)).length;

  document.getElementById("homeHabits").innerText = habits.length
    ? `${done}/${habits.length}`
    : "0";
}

function renderMiniChart() {
  let data = JSON.parse(localStorage.getItem("sleepData")) || [];

  let last7 = [];
  let labels = [];

  for (let i = 6; i >= 0; i--) {
    let d = new Date();
    d.setDate(d.getDate() - i);

    let dateStr = d.toLocaleDateString();

    let entry = data.find((x) => x.date === dateStr);

    last7.push(entry ? parseFloat(entry.duration) : 0);

    labels.push(d.toLocaleDateString("en-US", { weekday: "short" }));
  }

  let ctx = document.getElementById("miniSleepChart");
  if (!ctx) return;

  if (window.miniChart && typeof window.miniChart.destroy === "function") {
    window.miniChart.destroy();
  }

  window.miniChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          data: last7,
          tension: 0.4,
          fill: true,
          backgroundColor: "rgba(34, 197, 94, 0.2)",
          borderColor: "#22c55e",
          pointRadius: 3,
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },

        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              return context.raw + " hrs";
            },
          },
        },
      },

      scales: {
        x: {
          display: true,
          grid: { display: false },
        },
        y: {
          display: true,
          beginAtZero: true,
          max: 12,
          grid: { color: "rgba(0,0,0,0.05)" },
        },
      },
    },
  });
}

function checkWarnings() {
  let today = new Date().toLocaleDateString();

  let moodData = JSON.parse(localStorage.getItem("moodData")) || [];
  let sleepData = JSON.parse(localStorage.getItem("sleepData")) || [];

  let warning = "";

  let moodToday = moodData.find((d) => d.date == today);
  if (!moodToday) {
    warning = "⚠️ You haven't logged your mood today";
  }

  let last2 = sleepData.slice(-2);
  let poorSleep = last2.every((d) => parseFloat(d.duration) < 5);

  if (poorSleep && last2.length === 2) {
    warning = "⚠️ You slept less than 5 hrs for 2 days";
  }

  document.getElementById("smartWarning").innerText = warning;
}
function toggleTheme() {
  document.body.classList.toggle("dark");

  let isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  updateThemeIcon(true);
}

function loadTheme() {
  let saved = localStorage.getItem("theme");

  if (saved === "dark") {
    document.body.classList.add("dark");
  }

  updateThemeIcon(false);
}

function updateThemeIcon(animate) {
  let icon = document.getElementById("themeIcon");
  if (!icon) return;

  let isDark = document.body.classList.contains("dark");

  if (animate) {
    icon.classList.add("rotate");
    setTimeout(() => icon.classList.remove("rotate"), 400);
  }

  icon.src = isDark ? "assets/sun.png" : "assets/moon.png";
}
