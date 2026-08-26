const DATA_URL = "data/sessions.json";

const $ = (id) => document.getElementById(id);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function renderTimeline(sessions) {
  $("timeline").innerHTML = sessions.map(session => `
    <article class="event ${session.upcoming ? "upcoming" : "completed"}">
      <div class="marker" aria-hidden="true"><span>${session.upcoming ? "◆" : "✓"}</span></div>
      <div class="event-card" tabindex="0">
        <div class="event-date">
          ${session.upcoming ? "Upcoming Session" : `Session ${session.session} · Completed`}
        </div>
        <h3 class="event-title">${escapeHtml(session.title)}</h3>
        <div class="event-description">
          ${session.events.map(escapeHtml).join(" · ")}
        </div>
        <div class="status">${session.upcoming ? "◆ Next Chapter" : "✓ Remembered"}</div>
      </div>
    </article>
  `).join("");
}

function formatDate(date) {
  return new Intl.DateTimeFormat("el-GR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Athens"
  }).format(date);
}

function setupCountdown(nextSession) {
  const countdown = $("countdown");
  const noDate = $("no-date");
  const target = $("target");

  if (!nextSession.dateTime) {
    countdown.hidden = true;
    noDate.hidden = false;
    target.textContent = "";
    return;
  }

  const targetDate = new Date(nextSession.dateTime);
  if (Number.isNaN(targetDate.getTime())) {
    countdown.hidden = true;
    noDate.hidden = false;
    noDate.textContent = "Η ημερομηνία του επόμενου ραντεβού δεν είναι έγκυρη.";
    return;
  }

  countdown.hidden = false;
  noDate.hidden = true;
  target.textContent = `ATHENS · ${formatDate(targetDate)}`;

  function tick() {
    let diff = targetDate.getTime() - Date.now();

    if (diff <= 0) {
      $("days").textContent = $("hours").textContent = $("minutes").textContent = $("seconds").textContent = "00";
      $("no-date").hidden = false;
      $("no-date").textContent = "Το ραντεβού έφτασε. Καλή περιπέτεια! ✦";
      countdown.hidden = true;
      return;
    }

    const total = Math.floor(diff / 1000);
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;

    $("days").textContent = String(days).padStart(2, "0");
    $("hours").textContent = String(hours).padStart(2, "0");
    $("minutes").textContent = String(minutes).padStart(2, "0");
    $("seconds").textContent = String(seconds).padStart(2, "0");
  }

  tick();
  setInterval(tick, 1000);
}

function renderBackground(backgroundUrl) {
    const background = document.querySelector(".background");
    if (backgroundUrl) {
      background.style.backgroundImage = `url("${backgroundUrl}")`;
    } else {
      background.style.backgroundImage = "none";
    }
}

fetch(DATA_URL)
  .then(response => {
    if (!response.ok) throw new Error("Could not load sessions.json");
    return response.json();
  })
  .then(data => {
    renderBackground(data.backgroundUrl)
    renderTimeline(data.sessions);
    setupCountdown(data.nextSession);
  })
  .catch(error => {
    console.error(error);
    $("timeline").innerHTML = "<p style='color:#a99e91;text-align:center'>Δεν ήταν δυνατή η φόρτωση του log.</p>";
  });
