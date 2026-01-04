const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/xxx";

function syncCalendar() {
  const calendar = CalendarApp.getCalendarsByName("Your calendar")[0];
  const props = PropertiesService.getScriptProperties();

  const now = new Date();
  const past = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const future = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const events = calendar.getEvents(past, future);
  const currentState = {};
  
  events.filter(event => !(event.getCreators().includes("test@gmail.com"))).forEach(event => {
    const id = event.getId();
    const splitEventId = event.getId().split('@');
    currentState[id] = {
      title: event.getTitle(),
      start: event.getStartTime().toISOString(),
      end: event.getEndTime().toISOString(),
      updated: event.getLastUpdated().toISOString(),
      url: "https://www.google.com/calendar/event?eid=" + Utilities.base64Encode(splitEventId[0] + " " + calendarId)
    };
    console.log(currentState[id]);
  });

  const previousState = JSON.parse(props.getProperty("events") || "{}");

  // ➕ Création
  for (const id in currentState) {
    if (!previousState[id]) {
      sendEmbed("create", currentState[id]);
    }
  }
  props.setProperty("events", JSON.stringify(currentState));
}

function sendEmbed(type, event) {
  let color, title, emoji;

  switch (type) {
    case "create":
      color = 0x2ecc71;
      emoji = "📅";
      title = "Une nouvelle session a été ajoutée !";
      break;
  }

  const embed = {
    title: `${emoji} ${title}`,
    color: color,
    fields: [
      { name: "📝 Session", value: event.title || "Sans titre", inline: false },
      { name: "➡️​ Lien:", value: event.url || "Pas de lien", inline: false },
      { name: "🕒 Début", value: formatDate(event.start), inline: true },
      { name: "🕔 Fin", value: formatDate(event.end), inline: true }
    ],
    footer: {
      text: "Google Calendar"
    },
    timestamp: new Date().toISOString()
  };

  const payload = {
    embeds: [embed]
  };

  UrlFetchApp.fetch(DISCORD_WEBHOOK_URL, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  });
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString("fr-FR");
}
