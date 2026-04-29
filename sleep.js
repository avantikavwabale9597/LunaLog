function getToday() {
  return new Date().toLocaleDateString();
}

function calculateSleep(sleep, wake) {
  let s = sleep.split(":");
  let w = wake.split(":");

  let sleepHours = parseInt(s[0]) + parseInt(s[1]) / 60;
  let wakeHours = parseInt(w[0]) + parseInt(w[1]) / 60;

  let total = wakeHours - sleepHours;

  if (total < 0) total += 24;

  return total.toFixed(1);
}

function getSleepMessage(hours) {
  if (hours >= 7 && hours <= 9) return "Perfect Sleep";
  if (hours > -5) return "Not bad";
  return "Try to rest more";
}
function saveSleep() {
  let sleepTime = document.getElementById("sleepTime").value;
  let wakeTime = document.getElementById("wakeTime").value;

  if (!sleepTime || !wakeTime) return;

  let duration = calculateSleep(sleepTime, wakeTime);

  let data = JSON.parse(localStorage.getItem("sleepData")) || [];

  let today = getToday();

  data = data.filter((d) => d.date !== today);

  data.push({
    date: today,
    sleep: sleepTime,
    wake: wakeTime,
    duration: duration,
  });

  localStorage.setItem("sleepData", JSON.stringify(data));

  document.getElementById("sleepResult").innerText =
    duration + " hrs " + getSleepMessage(duration);

  loadSleepHistory();
}
function loadSleepHistory() {
  let data = JSON.parse(localStorage.getItem("sleepData")) || [];

  let last = data.slice(-5).reverse();

  document.getElementById("sleepHistory").innerHTML = last
    .map(
      (d) => `
      <div class="history-card">
        <b>${d.date}</b><br>
        🛌 ${d.sleep} → ${d.wake}<br>
        ⏱ ${d.duration} hrs
      </div>
    `,
    )
    .join("");
}
function saveGoal() {
  let goal = document.getElementById("sleepGoal").value;
  localStorage.setItem("sleepGoal", goal);
  updateGoalProcess();
}

function updateGoalProcess() {
  let goal = parseFloat(localStorage.getItem("sleepGoal")) || 8;
  let data = JSON.parse(localStorage.getItem("sleepData")) || [];

  let last7 = [];

  for (let i = 0; i < 7; i++) {
    let d = new Date();
    d.setDate(d.getDate() - i);
    last7.push(d.toLocaleDateString());
  }

  let successDays = data.filter(
    (d) => last7.includes(d.date) && parseFloat(d.duration) >= goal,
  ).length;

  let percent = (successDays / 7) * 100;
  document.getElementById("goalProgress").innerText =
    ` ${successDays}/7 days achieved`;

  document.getElementById("goalBar").style.width = percent + "%";
}

function updateWeeklyAverage() {
  let data = JSON.parse(localStorage.getItem("sleepData")) || [];

  let today = new Date();
  let last7 = [];

  for (let i = 0; i < 7; i++) {
    let d = new Date();
    d.setDate(today.getDate() - i);
    last7.push(d.toLocaleDateString());
  }

  let total = 0;
  let count = 0;

  data.forEach((item) => {
    if (last7.includes(item.date)) {
      total += parseFloat(item.duration);
      count++;
    }
  });

  let avg = count ? (total / count).toFixed(1) : 0;

  let el = document.getElementById("weeklyAvg");
  if (el) {
    el.innerText = `Weekly Average: ${avg} hrs`;
  }
}

function renderSleepChart() {
  let data = JSON.parse(localStorage.getItem("sleepData")) || [];

  let today = new Date();

  let day = today.getDay();
  let diff = today.getDate() - day + (day === 0 ? -6 : 1);

  let monday = new Date(today.setDate(diff));

  let weekData = [];

  for (let i = 0; i < 7; i++) {
    let d = new Date(monday);
    d.setDate(monday.getDate() + i);

    let dateStr = d.toLocaleDateString();

    let entry = data.find((x) => x.date === dateStr);

    weekData.push({
      date: dateStr,
      hours: entry ? parseFloat(entry.duration) : 0,
    });
  }

  let labels = weekData.map((d) =>
    new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }),
  );

  let hours = weekData.map((d) => d.hours);

  let colors = hours.map((h) => {
    if (h >= 7) return "rgba(34,197,94,0.8)";
    if (h >= 5) return "rgba(250,204,21,0.8)";
    return "rgba(239,68,68,0.8)";
  });

  let ctx = document.getElementById("sleepChart");

  if (!ctx) return;

  if (window.sleepChart && typeof window.sleepChart.destroy === "function") {
    window.sleepChart.destroy();
  }

  window.sleepChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Hours Slept",
          data: hours,
          backgroundColor: colors,
          borderRadius: 8,
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 12,
        },
      },
    },
  });
}
window.onload = function () {
  loadSleepHistory();
  renderSleepChart();
  updateGoalProcess();
  updateWeeklyAverage();
};
