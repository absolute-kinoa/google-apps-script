const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/xxx";

function onEventCreated(e) {
  const calendar = CalendarApp.getDefaultCalendar();

  // Fenêtre de recherche autour de maintenant
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  const fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);

  const events = calendar.getEvents(fiveMinutesAgo, fiveMinutesLater);

  if (!events.length) {
    console.log("Aucun événement trouvé");
    return;
  }

  // Événement le plus récemment modifié
  const event = events.sort(
    (a, b) => b.getLastUpdated() - a.getLastUpdated()
  )[0];

  const payload = {
    content:
      `📅 **Nouvel événement ajouté !**\n` +
      `📝 **${event.getTitle()}**\n` +
      `🕒 ${event.getStartTime().toLocaleString()}`
  };

  UrlFetchApp.fetch(DISCORD_WEBHOOK_URL, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  });
}
