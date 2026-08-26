const DATA_URL = "data/sessions.json";

function formatDate(date) {
  return new Intl.DateTimeFormat("el-GR", {
    dateStyle: "full",
    timeStyle: "short"
  }).format(date);
}

function renderTimeline(sessions) {
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = sessions.map((session, index) => `
    <article class="session ${session.upcoming ? "upcoming" : ""}">
      <span class="session-dot" aria-hidden="true"></span>
      <div class="session-card">
        ${session.upcoming ? '<span class="badge">Upcoming</span>' : ""}
        <div class="session-number">Session ${session.session}</div>
        <h3>${escapeHtml(session.title)}</h3>
        <ul>
          ${session.events.map(event => `<li>${escapeHtml(event)}</li>`).join("")}
        </ul>
      </div>
    </article>
  `).join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setupCountdown(nextSession) {
  const title = document.getElementById("next-title");
  const message = document.getElementById("next-message");
  const countdown = document.getElementById("countdown");

  if (!nextSession.dateTime) {
    title.textContent = nextSession.title;
    message.textContent = "Δεν έχει οριστεί ακόμα ημερομηνία και ώρα. Το επόμενο ραντεβού θα εμφανιστεί εδώ μόλις το ορίσετε.";
    countdown.hidden = true;
    return;
  }

  const target = new Date(nextSession.dateTime);
  if (Number.isNaN(target.getTime())) {
    title.textContent = nextSession.title;
    message.textContent = "Η ημερομηνία του επόμενου ραντεβού δεν είναι έγκυρη.";
    countdown.hidden = true;
    return;
  }

  title.textContent = nextSession.title;
  message.textContent = `Επόμενο ραντεβού: ${formatDate(target)}`;
  countdown.hidden = false;

  function tick() {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) {
      document.getElementById("days").textContent = "00";
      document.getElementById("hours").textContent = "00";
      document.getElementById("minutes").textContent = "00";
      document.getElementById("seconds").textContent = "00";
      message.textContent = "Το ραντεβού έφτασε. Καλή περιπέτεια! ✦";
      return;
    }
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
  }

  tick();
  setInterval(tick, 1000);
}

fetch(DATA_URL)
  .then(response => {
    if (!response.ok) throw new Error("Could not load sessions.json");
    return response.json();
  })
  .then(data => {
    renderTimeline(data.sessions);
    setupCountdown(data.nextSession);
  })
  .catch(error => {
    console.error(error);
    document.getElementById("timeline").innerHTML =
      "<p style='color:#a99e91;text-align:center'>Δεν ήταν δυνατή η φόρτωση του log.</p>";
  });
