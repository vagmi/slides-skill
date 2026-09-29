/* ============================================================
   video.js — full-bleed video slides.

     <section data-section="Demo · In the app" data-title="Demo"
              data-tone="deep" data-full>
       <div class="video-slide" data-src="assets/demo.mp4"
            data-w="1920" data-h="1080" data-note="90 seconds, no sound">
         <h2 class="title">Watch it <span class="text-gradient">work</span>.</h2>
         <p class="text-lead text-fg-muted">One sentence of setup.</p>
       </div>
     </section>

   The recording sits under a translucent scrim that carries the
   title. Clicking starts it (muted, never autoplaying) and the
   overlay fades out; native controls appear on play; the overlay
   returns when the video ends or you come back to the slide. Print
   and print preview show the title card.

   data-w/data-h are the recording's natural pixel size. The fitted
   size is computed here, not left to CSS max-width/max-height, which
   would letterbox the picture inside its box and leave the border
   floating off the image. Get them with:
     ffprobe -v error -select_streams v:0 \
       -show_entries stream=width,height -of default=nw=1 x.mp4
   ============================================================ */
import { W, H } from "./nav.js";

const MARGIN = 52;
const PLAY =
  `<svg width="36" height="42" viewBox="0 0 36 42" aria-hidden="true">` +
  `<path d="M2 2 L34 21 L2 40 Z" fill="var(--color-brand)"/></svg>`;

function expand(box, rail) {
  const d = box.dataset;
  const s = Math.min((W - MARGIN * 2) / +d.w, (H - MARGIN * 2) / +d.h);
  const section = box.closest(".slide")?.dataset.section || "";

  const video = document.createElement("video");
  Object.assign(video, { src: d.src, muted: true, playsInline: true, preload: "metadata" });
  if (d.poster) video.poster = d.poster;
  video.style.cssText = `width:${Math.round(+d.w * s)}px;height:${Math.round(+d.h * s)}px`;

  const overlay = document.createElement("button");
  overlay.type = "button";
  overlay.className = "video-overlay";
  overlay.setAttribute("aria-label", "Play the video");
  overlay.innerHTML =
    `<span class="scrim" aria-hidden="true"></span>` +
    `<span class="frame"><span class="eyebrow"><span></span><span class="rail"></span></span>` +
    `<span class="my-auto video-copy"><span class="accent-bar mb-8"></span></span>` +
    `<span class="play-row"><span class="play-btn">${PLAY}</span>` +
    `<span class="text-fg">Click to play <span class="text-fg-muted note"></span></span></span></span>`;
  overlay.querySelector(".eyebrow span").textContent = section;
  overlay.querySelector(".note").textContent = "· " + (d.note || "no sound");
  overlay.querySelector(".rail").textContent = box.closest(".slide")?.dataset.rail ?? rail ?? "";
  overlay.querySelector(".video-copy").append(...box.childNodes); // the title + lead

  const holder = document.createElement("div");
  holder.className = "video-box";
  holder.appendChild(video);
  box.setAttribute("data-no-nav", "");
  box.append(holder, overlay);

  const reset = () => {
    video.pause();
    if (video.readyState > 0) video.currentTime = 0;
    video.controls = false;
    overlay.classList.remove("is-playing");
  };
  overlay.addEventListener("click", () => video.play());
  video.addEventListener("play", () => {
    overlay.classList.add("is-playing");
    video.controls = true; // only once playing, so the idle card stays clean
  });
  video.addEventListener("ended", reset);
  box.closest(".slide")?.addEventListener("slide:enter", reset);
}

export function wireVideos(scope, rail) {
  scope.querySelectorAll(".video-slide").forEach((box) => expand(box, rail));
}
