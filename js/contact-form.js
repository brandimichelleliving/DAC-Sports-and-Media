import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Public by design: the anon key only allows inserts into `inquiries`,
// enforced by the table's row-level security policy in Supabase.
var SUPABASE_URL = "https://tdqdrdojxtwoapfellgf.supabase.co";
var SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkcWRyZG9qeHR3b2FwZmVsbGdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwMDI1NDksImV4cCI6MjEwNTU3ODU0OX0.EdjQbssG_KRDEveqJcQq12ujEOfwSHJqhfXKA7MdLIU";

var supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

var form = document.getElementById("contact-form");
var note = document.getElementById("form-note");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    var submitBtn = form.querySelector("button[type=submit]");
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var company = form.company.value.trim();
    var interest = form.interest.value;
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
      interest: interest,
      message: message
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
