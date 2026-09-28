import { supabase } from "./supabase-client.js";

var form = document.getElementById("contact-form");
var note = document.getElementById("form-note");

if (form) {
  var interestParam = new URLSearchParams(window.location.search).get("interest");
  if (interestParam && form.looking_for) {
    var matchingOption = Array.prototype.find.call(form.looking_for.options, function (opt) {
      return opt.value === interestParam;
    });
    if (matchingOption) form.looking_for.value = interestParam;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    var submitBtn = form.querySelector("button[type=submit]");
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var company = form.company.value.trim();
    var role = form.role.value.trim();
    var lookingFor = form.looking_for.value;
    var budgetRange = form.budget_range.value;
    var timing = form.timing.value;
    var message = form.message.value.trim();

    if (submitBtn) submitBtn.disabled = true;
    if (note) {
      note.textContent = "Sending…";
      note.classList.remove("success", "error");
    }

    var result = await supabase.from("inquiries").insert({
      name: name,
      email: email,
      company: company || null,
      role: role || null,
      looking_for: lookingFor,
      budget_range: budgetRange,
      timing: timing,
      message: message || null
    });

    if (submitBtn) submitBtn.disabled = false;

    if (result.error) {
      console.error(result.error);
      if (note) {
        note.textContent =
          "Something went wrong sending your message. Please email brandimichelleliving@gmail.com directly.";
        note.classList.add("error");
      }
      return;
    }

    form.reset();
    if (note) {
      note.textContent = "Thanks — your message has been sent. I'll be in touch soon.";
      note.classList.add("success");
    }
  });
}
