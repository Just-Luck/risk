(function () {
  var PIVOT_X_PERCENT = 50;
  var PIVOT_Y_PERCENT = 60;
  var NEEDLE_ORIGIN_X_PERCENT = 50;
  var NEEDLE_ORIGIN_Y_PERCENT = 90;
  var NEEDLE_SCALE = 1;
  var NEEDLE_MIN = -90;
  var NEEDLE_MAX = 90;
  var LOW_MAX = -30;
  var MED_MAX = 30;
  var SPIN_DURATION = 3200;
  var OVERSHOOT_DEG = 18;
  var FULL_ROTATIONS = 3;

  var needleEl = document.getElementById("needleImage");
  var resultValueEl = document.getElementById("resultValue");
  var spinBtn = document.getElementById("spinBtn");
  var copyCaBtn = document.getElementById("copyCaBtn");
  var currentAngleDeg = -90;
  var caCopyText = "coming soon";

  function getCategory(angle) {
    if (angle <= LOW_MAX) return "LOW";
    if (angle <= MED_MAX) return "MEDIUM";
    return "HIGH";
  }

  function getNeedleTransform(angleDeg) {
    var tx = -NEEDLE_ORIGIN_X_PERCENT;
    var ty = -NEEDLE_ORIGIN_Y_PERCENT;
    return "translate(" + tx + "%," + ty + "%) scale(" + NEEDLE_SCALE + ") rotate(" + angleDeg + "deg)";
  }

  function setNeedleAngle(deg) {
    needleEl.style.transition = "none";
    needleEl.style.transformOrigin = NEEDLE_ORIGIN_X_PERCENT + "% " + NEEDLE_ORIGIN_Y_PERCENT + "%";
    needleEl.style.left = PIVOT_X_PERCENT + "%";
    needleEl.style.top = PIVOT_Y_PERCENT + "%";
    needleEl.style.transform = getNeedleTransform(deg);
  }

  function spinToAngle(targetDeg, onComplete) {
    needleEl.classList.add("spinning");
    needleEl.style.transition = "none";
    needleEl.style.transformOrigin = NEEDLE_ORIGIN_X_PERCENT + "% " + NEEDLE_ORIGIN_Y_PERCENT + "%";
    needleEl.style.left = PIVOT_X_PERCENT + "%";
    needleEl.style.top = PIVOT_Y_PERCENT + "%";
    var startDeg = currentAngleDeg;
    var endDeg = targetDeg + 360 * FULL_ROTATIONS;
    var overshootDeg = endDeg + (Math.random() > 0.5 ? OVERSHOOT_DEG : -OVERSHOOT_DEG);
    var keyframes = [
      { transform: getNeedleTransform(startDeg), offset: 0 },
      { transform: getNeedleTransform(overshootDeg), offset: 0.88 },
      { transform: getNeedleTransform(endDeg), offset: 1 }
    ];
    needleEl.animate(keyframes, {
      duration: SPIN_DURATION,
      easing: "ease-out",
      fill: "forwards"
    });
    setTimeout(function () {
      needleEl.classList.remove("spinning");
      needleEl.style.transform = getNeedleTransform(targetDeg);
      currentAngleDeg = targetDeg;
      if (onComplete) onComplete();
    }, SPIN_DURATION);
  }

  function randomAngle() {
    return NEEDLE_MIN + Math.random() * (NEEDLE_MAX - NEEDLE_MIN);
  }

  function runSpin() {
    var target = randomAngle();
    var category = getCategory(target);
    spinToAngle(target, function () {
      resultValueEl.textContent = category;
      resultValueEl.className = "result-value result-" + category.toLowerCase();
    });
  }

  spinBtn.addEventListener("click", function () {
    runSpin();
  });

  copyCaBtn.addEventListener("click", function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(caCopyText).then(function () {
        copyCaBtn.textContent = "Copied";
        setTimeout(function () { copyCaBtn.textContent = "Copy"; }, 1500);
      });
    } else {
      var ta = document.createElement("textarea");
      ta.value = caCopyText;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        copyCaBtn.textContent = "Copied";
        setTimeout(function () { copyCaBtn.textContent = "Copy"; }, 1500);
      } catch (e) {}
      document.body.removeChild(ta);
    }
  });

  needleEl.style.transformOrigin = NEEDLE_ORIGIN_X_PERCENT + "% " + NEEDLE_ORIGIN_Y_PERCENT + "%";
  needleEl.style.left = PIVOT_X_PERCENT + "%";
  needleEl.style.top = PIVOT_Y_PERCENT + "%";
  setNeedleAngle(-90);
  runSpin();
})();