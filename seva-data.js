/* ============================================================================
   सेवा गतिविधियाँ — Single Source of Truth
   ----------------------------------------------------------------------------
   This array IS the project's service ordering: index 0 = seva1 … index 9 =
   seva10, oldest first. Both the homepage carousel and the seva.html archive
   read from this one array, so they can never drift apart:

     • Homepage  → the LAST 3 entries (newest services), shown newest-first
     • Archive   → all entries, in seva1 → seva10 order

   ----------------------------------------------------------------------------
   HOW TO ADD THE NEXT SERVICE
   ----------------------------------------------------------------------------
   1. Save the photo as images/carousel/Services/seva11.jpeg (next number).
   2. Append one entry block to the END of the array (newest goes last, so the
      seva1 → sevaN order is preserved).
   3. Fill in: image, title, location, dateLabel, desc.
        location  — leave as "" if the activity has no recorded venue
        dateLabel — leave as "" if the activity has no recorded date
   4. Save. The homepage automatically switches to the newest 3 and the archive
      automatically grows. No HTML or CSS edits are needed.
   ========================================================================== */

window.SEVA_ACTIVITIES = [
  {
    image: "images/carousel/Services/seva1.jpeg",
    title: "कुंभ स्नान एवं भंडारा",
    location: "प्रयागराज",
    dateLabel: "",
    desc: "श्री नारायण नारायणी सेवा ट्रस्ट द्वारा प्रयागराज में भंडारा सेवा।"
  },
  {
    image: "images/carousel/Services/seva2.jpeg",
    title: "बाल सेवा एवं अन्नदान",
    location: "Peace and Defence Committee, Liluah, Howrah",
    dateLabel: "22/11/2024",
    desc: "बच्चों के लिए भोजन सेवा।"
  },
  {
    image: "images/carousel/Services/seva3.jpeg",
    title: "कंबल वितरण",
    location: "",
    dateLabel: "14/01/2025",
    desc: "जरूरतमंदों के बीच कंबल वितरण।"
  },
  {
    image: "images/carousel/Services/seva4.jpeg",
    title: "हलवा वितरण",
    location: "",
    dateLabel: "11/02/2025",
    desc: "मासिक सामाजिक सेवा के अंतर्गत हलवा वितरण।"
  },
  {
    image: "images/carousel/Services/seva5.jpeg",
    title: "मासिक कीर्तन",
    location: "Vishalji Agarwal, New Alipore",
    dateLabel: "23/02/2025",
    desc: "मासिक कीर्तन की झलकियाँ।"
  },
  {
    image: "images/carousel/Services/seva6.jpeg",
    title: "मासिक कीर्तन",
    location: "Bonhooghly",
    dateLabel: "06/04/2025",
    desc: "मासिक कीर्तन की झलकियाँ।"
  },
  {
    image: "images/carousel/Services/seva7.jpeg",
    title: "गौशाला सेवा",
    location: "",
    dateLabel: "29/06/2025",
    desc: "सदस्यों द्वारा गौशाला सेवा एवं भ्रमण।"
  },
  {
    image: "images/carousel/Services/seva8.jpeg",
    title: "गौशाला सेवा",
    location: "",
    dateLabel: "14/01/2026",
    desc: "सदस्यों द्वारा गौशाला सेवा एवं भ्रमण।"
  },
  {
    image: "images/carousel/Services/seva9.jpeg",
    title: "शीतला माता स्नान यात्रा 2026",
    location: "बांधाघाट",
    dateLabel: "01/02/2026",
    desc: "हलवा और लड्डू वितरण, जिसमें 10,000+ लोगों ने प्रसाद ग्रहण किया।"
  },
  {
    image: "images/carousel/Services/seva10.jpeg",
    title: "मासिक सामाजिक सेवा",
    location: "",
    dateLabel: "10/05/2026",
    desc: "ट्रस्ट के सदस्यों द्वारा सामाजिक सेवा गतिविधि।"
  }
];

/* ---------------------------------------------------------------------------
   Shared rendering helpers — used by index.html (latest 3) and seva.html (all).
   -------------------------------------------------------------------------- */
(function () {
  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function all() {
    return (window.SEVA_ACTIVITIES || []).slice();
  }

  // The 3 newest services (end of the seva1→seva10 order), newest first.
  function latest(count) {
    var items = all();
    var n = typeof count === 'number' ? count : 3;
    return items.slice(Math.max(0, items.length - n)).reverse();
  }

  function cardMarkup(item, index) {
    var title = escapeHtml(item.title);
    var meta = '';

    if (item.location) {
      meta += '<span class="seva-meta-item">' +
                '<i class="fa-solid fa-location-dot seva-meta-icon" aria-hidden="true"></i>' +
                '<span>' + escapeHtml(item.location) + '</span>' +
              '</span>';
    }
    if (item.dateLabel) {
      meta += '<span class="seva-meta-item">' +
                '<i class="fa-regular fa-calendar seva-meta-icon" aria-hidden="true"></i>' +
                '<span>' + escapeHtml(item.dateLabel) + '</span>' +
              '</span>';
    }

    return '' +
      '<article class="seva-card" style="--seva-delay: ' + (0.1 + index * 0.1).toFixed(2) + 's;">' +
        '<div class="seva-card-media">' +
          '<img src="' + escapeHtml(item.image) + '" alt="' + title + '" loading="lazy" />' +
        '</div>' +
        '<div class="seva-card-body">' +
          '<h4 class="seva-card-title">' + title + '</h4>' +
          (meta ? '<div class="seva-card-meta">' + meta + '</div>' : '') +
          '<p class="seva-card-desc">' + escapeHtml(item.desc) + '</p>' +
        '</div>' +
      '</article>';
  }

  function renderInto(containerId, items) {
    var host = document.getElementById(containerId);
    if (!host) return null;
    host.innerHTML = items.map(cardMarkup).join('');
    return host;
  }

  /* Homepage: the 3 latest services inside a looping horizontal carousel. */
  window.initSevaCarousel = function (trackId, prevBtnId, nextBtnId) {
    var track = renderInto(trackId, latest(3));
    if (!track) return;

    var prev = document.getElementById(prevBtnId);
    var next = document.getElementById(nextBtnId);
    var animating = false;

    function step(direction) {
      var cards = track.children;
      if (animating || cards.length < 2) return;

      // Distance to travel = one card + the flex gap between cards.
      var gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
      var shift = cards[0].getBoundingClientRect().width + gap;

      animating = true;

      if (direction > 0) {
        // Slide left, then move the first card to the end.
        track.style.transition = 'transform 0.55s cubic-bezier(0.22, 0.61, 0.36, 1)';
        track.style.transform = 'translateX(' + (-shift) + 'px)';
        window.setTimeout(function () {
          track.style.transition = 'none';
          track.style.transform = 'translateX(0)';
          track.appendChild(cards[0]);
          // force reflow so the next transition is not swallowed
          void track.offsetWidth;
          animating = false;
        }, 550);
      } else {
        // Move the last card to the front off-screen, then slide it in.
        track.insertBefore(cards[cards.length - 1], cards[0]);
        track.style.transition = 'none';
        track.style.transform = 'translateX(' + (-shift) + 'px)';
        void track.offsetWidth;
        track.style.transition = 'transform 0.55s cubic-bezier(0.22, 0.61, 0.36, 1)';
        track.style.transform = 'translateX(0)';
        window.setTimeout(function () { animating = false; }, 550);
      }
    }

    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });
  };

  /* Archive page: every service, in seva1 → seva10 order. */
  window.renderSevaArchive = function (containerId) {
    renderInto(containerId, all());
  };

  /* Keeps the statistics row's activity count in sync with the array above,
     so adding a service updates the homepage figure automatically. */
  window.updateSevaStatCount = function (elementId) {
    var el = document.getElementById(elementId);
    if (el) el.textContent = String(all().length);
  };

  window.getSevaActivities = all;
})();
