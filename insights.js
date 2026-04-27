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

  let scoreMap = {
    happy: 2,
    tired: 0,
    sad: -1,
    angry: -2,
  };

  let totalScore = 0;
  data.forEach((d) => {
    totalScore += scoreMap[d.mood] || 0;
  });

  let avgScore = data.length ? (totalScore / data.length).toFixed(2) : 0;

  document.getElementById("moodScore").innerText =
    "Mood Score: " +
    avgScore +
    (avgScore > 0 ? "😊" : avgScore < 0 ? " 💙" : " 😐");

  let last5 = data.slice(-5);
  let prev5 = data.slice(-10, -5);

  function calcAvg(arr) {
    if (arr.length === 0) return 0;
    return (
      arr.reduce((sum, d) => sum + (scoreMap[d.mood] || 0), 0) / arr.length
    );
  }

  let lastAvg = calcAvg(last5);
  let prevAvg = calcAvg(prev5);

  let trendText = "";

  if (lastAvg > prevAvg) {
    trendText = "Your mood is improving!";
  } else if (lastAvg < prevAvg) {
    trendText = "Your mood seems lower lately..";
  } else {
    trendText = "Your mood is stable";
  }

  document.getElementById("moodTrend").innerText = trendText;
}

window.onload = function () {
  renderInsights();
};
