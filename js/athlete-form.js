import { supabase } from "./supabase-client.js";

var form = document.getElementById("athlete-form");
var note = document.getElementById("athlete-form-note");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    var submitBtn = form.querySelector("button[type=submit]");
    var name = form.name.value.trim();
    var sport = form.sport.value.trim();
    var team = form.team.value.trim();
    var social = form.social.value.trim();
    var email = form.email.value.trim();

    if (submitBtn) submitBtn.disabled = true;
    if (note) {
      note.textContent = "Sending…";
      note.classList.remove("success", "error");
    }

    var result = await supabase.from("athlete_signups").insert({
      name: name,
      sport: sport,
      school_or_team: team || null,
      social_handles: social || null,
      email: email
    });

    if (submitBtn) submitBtn.disabled = false;

    if (result.error) {
      console.error(result.error);
      if (note) {
        note.textContent =
          "Something went wrong sending your info. Please email brandimichelleliving@gmail.com directly.";
        note.classList.add("error");
      }
      return;
    }

    form.reset();
    if (note) {
      note.textContent = "Thanks — you're in. I'll follow up about your free profile audit.";
      note.classList.add("success");
    }
  });
}
