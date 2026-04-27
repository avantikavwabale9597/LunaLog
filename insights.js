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

function getStreak() {
  let s = JSON.parse(localStorage.getItem("streak")) || { count: 0 };
  return s.count;
}

function renderInsights() {
  let data = JSON.parse(localStorage.getItem("moodData")) || [];

  let counts = {
    happy: 0,
    sad: 0,
    tired: 0,
    angry: 0,
  };

  data.forEach((d) => {
    if (counts[d.mood] !== undefined) {
      counts[d.mood]++;
    }
  });

  let maxMood = "happy";
  for (let mood in counts) {
    if (counts[mood] > counts[maxMood]) {
      maxMood = mood;
    }
  }

  document.getElementById("mostMood").innerText =
    "Most frequent mood: " + maxMood + " " + getEmoji(maxMood);
  document.getElementById("streakDisplay").innerText =
    "🔥 Streak: " + getStreak() + " days";

  const ctx = document.getElementById("moodChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        ["😊", "Happy"],
        ["😢", "Sad"],
        ["😴", "Tired"],
        ["😡", "Angry"],
      ],
      datasets: [
        {
          label: "Mood Count",
          data: [counts.happy, counts.sad, counts.tired, counts.angry],
          backgroundColor: ["#22c55e", "#4ade80", "#86efac", "#16a34a"],
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 16,
            },
          },
        },
      },
    },
  });
}

window.onload = function () {
  renderInsights();
};
