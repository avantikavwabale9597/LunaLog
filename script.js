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
