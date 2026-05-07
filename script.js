function toggleProject(card) {
  let all = document.querySelectorAll(".details");

  all.forEach(d => {
    if (d !== card.querySelector(".details")) {
      d.style.display = "none";
    }
  });

  let details = card.querySelector(".details");

  details.style.display =
    details.style.display === "block" ? "none" : "block";
}