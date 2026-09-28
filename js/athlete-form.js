var form = document.getElementById("athlete-form");
var note = document.getElementById("athlete-form-note");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    var submitBtn = form.querySelector("button[type=submit]");
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var sport = form.sport.value.trim();
    var team = form.team.value.trim();
    var instagram = form.instagram.value.trim();
    var tiktok = form.tiktok.value.trim();
    var notes = form.notes.value.trim();

    if (submitBtn) submitBtn.disabled = true;
    if (note) {
      note.textContent = "Sending…";
      note.classList.remove("success", "error");
    }

    try {
      var res = await fetch("/api/athlete-audit-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          sport: sport,
          schoolOrTeam: team || null,
          instagram: instagram || null,
          tiktok: tiktok || null,
          notes: notes || null
        })
      });

      if (!res.ok) throw new Error("Request failed");

      form.reset();
      if (note) {
        note.textContent = "Got it. We'll review your profile and be in touch within 5 business days.";
        note.classList.add("success");
      }
    } catch (err) {
      console.error(err);
      if (note) {
        note.textContent =
          "Something went wrong sending your info. Please email brandimichelleliving@gmail.com directly.";
        note.classList.add("error");
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
