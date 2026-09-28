(function () {
  "use strict";

  var QUESTIONS = [
    {
      text: "Does your bio clearly say your sport, position, and team or school?",
      answers: [
        { label: "Yes, clearly", points: 10 },
        { label: "Partly", points: 5 },
        { label: "No", points: 0 }
      ],
      fix: "Rewrite your bio in one line: sport, position, team or school, plus one thing that makes you you."
    },
    {
      text: "How often do you post?",
      answers: [
        { label: "3 or more times a week", points: 10 },
        { label: "1–2 times a week", points: 5 },
        { label: "Less than once a week", points: 0 }
      ],
      fix: "Pick a schedule you can keep in season, even 3 posts a week, and batch content on lighter days."
    },
    {
      text: "How much of your content is short-form video (Reels, TikToks, Shorts)?",
      answers: [
        { label: "Most of it", points: 10 },
        { label: "Some of it", points: 5 },
        { label: "Very little", points: 0 }
      ],
      fix: "Lead with short video. It's how new fans and brands discover you."
    },
    {
      text: "Do you know your engagement rate?",
      answers: [
        { label: "Yes, and I track it", points: 10 },
        { label: "Roughly", points: 5 },
        { label: "No idea", points: 0 }
      ],
      fix: "Check your engagement rate monthly. Brands compare it with accounts your size."
    },
    {
      text: "Do you know who your audience is (top ages, locations, interests)?",
      answers: [
        { label: "Yes", points: 10 },
        { label: "Somewhat", points: 5 },
        { label: "No", points: 0 }
      ],
      fix: "Open your account insights and note your top age range and locations. Brands will ask."
    },
    {
      text: "Does your content cover more than one side of you (game day, training, life off the field)?",
      answers: [
        { label: "Yes, 3 or more themes", points: 10 },
        { label: "Mostly one theme", points: 5 },
        { label: "No real plan", points: 0 }
      ],
      fix: "Choose 3–5 content pillars, like game day, training, and off the field, and rotate between them."
    },
    {
      text: "How quickly do you reply to comments and messages?",
      answers: [
        { label: "Usually within a day", points: 10 },
        { label: "Sometimes", points: 5 },
        { label: "Rarely", points: 0 }
      ],
      fix: "Reply to comments in the first hour after posting. It boosts reach and shows brands you're responsive."
    },
    {
      text: "Have you reviewed your past posts for anything a sponsor wouldn't want to see?",
      answers: [
        { label: "Yes, recently", points: 10 },
        { label: "Not recently", points: 5 },
        { label: "Never", points: 0 }
      ],
      fix: "Scroll back through your posts and archive anything you wouldn't want a sponsor to see."
    },
    {
      text: "Is it easy for a brand to contact you?",
      answers: [
        { label: "Email and media kit link in my bio", points: 10 },
        { label: "One of those", points: 5 },
        { label: "Neither", points: 0 }
      ],
      fix: "Add a contact email to your bio and create a one-page media kit."
    },
    {
      text: "Do you know which brands you'd pitch, and your school's or league's rules for deals?",
      answers: [
        { label: "Both", points: 10 },
        { label: "One of those", points: 5 },
        { label: "Neither", points: 0 }
      ],
      fix: "List 10 brands you already use and love, and read your school's or league's rules on brand deals."
    }
  ];

  var BANDS = [
    {
      min: 80,
      max: 100,
      title: "Brand-Ready",
      message: "You've built a strong foundation. Brands can see who you are and how to reach you. Next step: make sure you're pitching the right partners at the right price."
    },
    {
      min: 50,
      max: 79,
      title: "Almost There",
      message: "You've got real momentum, with a few gaps that could make brands hesitate. Fix your top 3 below and you'll stand out."
    },
    {
      min: 0,
      max: 49,
      title: "Building Your Foundation",
      message: "Everyone starts somewhere. Focus on your top 3 fixes below first; they'll make the biggest difference."
    }
  ];

  var screens = {};
  document.querySelectorAll("[data-screen]").forEach(function (el) {
    screens[el.getAttribute("data-screen")] = el;
  });

  var progressFill = document.getElementById("quiz-progress-fill");
  var questionCount = document.getElementById("quiz-question-count");
  var questionText = document.getElementById("quiz-question-text");
  var answersContainer = document.getElementById("quiz-answers");
  var backBtn = document.getElementById("quiz-back");
  var emailForm = document.getElementById("quiz-email-form");
  var emailNote = document.getElementById("quiz-email-note");

  var currentIndex = 0;
  var responses = new Array(QUESTIONS.length).fill(null);

  function showScreen(name) {
    Object.keys(screens).forEach(function (key) {
      screens[key].hidden = key !== name;
      screens[key].classList.toggle("is-active", key === name);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderQuestion() {
    var q = QUESTIONS[currentIndex];
    progressFill.style.width = Math.round(((currentIndex) / QUESTIONS.length) * 100) + "%";
    questionCount.textContent = "Question " + (currentIndex + 1) + " of " + QUESTIONS.length;
    questionText.textContent = q.text;
    backBtn.hidden = currentIndex === 0;

    answersContainer.innerHTML = "";
    q.answers.forEach(function (answer, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-answer-card";
      if (responses[currentIndex] && responses[currentIndex].label === answer.label) {
        btn.classList.add("is-selected");
      }
      btn.textContent = answer.label;
      btn.addEventListener("click", function () {
        selectAnswer(answer);
      });
      answersContainer.appendChild(btn);
    });

    showScreen("question");
  }

  function selectAnswer(answer) {
    responses[currentIndex] = answer;
    var cards = answersContainer.querySelectorAll(".quiz-answer-card");
    cards.forEach(function (card) {
      card.classList.toggle("is-selected", card.textContent === answer.label);
    });

    window.setTimeout(function () {
      if (currentIndex < QUESTIONS.length - 1) {
        currentIndex += 1;
        renderQuestion();
      } else {
        progressFill.style.width = "100%";
        showScreen("email");
      }
    }, 200);
  }

  document.querySelector('[data-action="start"]').addEventListener("click", function () {
    currentIndex = 0;
    renderQuestion();
  });

  backBtn.addEventListener("click", function () {
    if (currentIndex > 0) {
      currentIndex -= 1;
      renderQuestion();
    }
  });

  function computeScore() {
    return responses.reduce(function (sum, r) {
      return sum + (r ? r.points : 0);
    }, 0);
  }

  function getBand(score) {
    return BANDS.find(function (b) { return score >= b.min && score <= b.max; }) || BANDS[BANDS.length - 1];
  }

  function getTopFixes() {
    var scored = QUESTIONS.map(function (q, i) {
      return { index: i, points: responses[i] ? responses[i].points : 0, fix: q.fix };
    });
    scored.sort(function (a, b) {
      if (a.points !== b.points) return a.points - b.points;
      return a.index - b.index;
    });
    return scored.slice(0, 3).map(function (s) { return s.fix; });
  }

  emailForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    var submitBtn = emailForm.querySelector("button[type=submit]");
    var firstName = emailForm.firstName.value.trim();
    var email = emailForm.email.value.trim();
    var sport = emailForm.sport.value.trim();
    var handle = emailForm.handle.value.trim();
    var newsletterOptIn = emailForm.newsletterOptIn.checked;
    var score = computeScore();
    var band = getBand(score);

    if (submitBtn) submitBtn.disabled = true;
    emailNote.textContent = "Scoring your profile…";
    emailNote.classList.remove("success", "error");

    try {
      var res = await fetch("/api/scorecard-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName,
          email: email,
          sport: sport || null,
          handle: handle || null,
          score: score,
          band: band.title,
          newsletterOptIn: newsletterOptIn
        })
      });

      if (!res.ok) throw new Error("Request failed");

      showResults(score, band);
    } catch (err) {
      console.error(err);
      emailNote.textContent = "Something went wrong getting your score. Please try again in a moment.";
      emailNote.classList.add("error");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  function showResults(score, band) {
    document.getElementById("quiz-score").textContent = String(score);
    document.getElementById("quiz-band-title").textContent = band.title;
    document.getElementById("quiz-band-message").textContent = band.message;

    var fixesList = document.getElementById("quiz-fixes");
    fixesList.innerHTML = "";
    getTopFixes().forEach(function (fix) {
      var li = document.createElement("li");
      li.textContent = fix;
      fixesList.appendChild(li);
    });

    showScreen("results");
  }
})();
