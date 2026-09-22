import { supabase } from "./supabase-client.js";

var form = document.getElementById("audit-form");
var note = document.getElementById("audit-form-note");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    var submitBtn = form.querySelector("button[type=submit]");
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var company = form.company.value.trim();
    var focusArea = form.focus.value;
    var availability = form.availability.value.trim();
    var message = form.message.value.trim();

    if (submitBtn) submitBtn.disabled = true;
    if (note) {
      note.textContent = "Sending…";
      note.classList.remove("success", "error");
    }

    var result = await supabase.from("audit_requests").insert({
      name: name,
      email: email,
      company: company || null,
      focus_area: focusArea,
      availability: availability || null,
      message: message || null
    });

    if (submitBtn) submitBtn.disabled = false;

    if (result.error) {
      console.error(result.error);
      if (note) {
        note.textContent =
          "Something went wrong sending your request. Please email brandimichelleliving@gmail.com directly.";
        note.classList.add("error");
      }
      return;
    }

    form.reset();
    if (note) {
      note.textContent = "Thanks — your audit request is in. I'll follow up to find a time.";
      note.classList.add("success");
    }
  });
}
