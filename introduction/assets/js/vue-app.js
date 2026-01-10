const GalleryCarousel = {
  template: `
    <div>
      <span class="card-badge">Gallery</span>
      <h3 class="h5 mb-3">Hobbies Photo Gallery</h3>

      <div class="carousel-wrap" @touchstart="touchStart" @touchend="touchEnd">
        <button class="carousel-btn" type="button" @click="prev" aria-label="Previous">‹</button>

        <div class="carousel-frame" :class="frameClass">
          <img
            :src="currentSrc"
            class="gallery-img"
            :alt="'Hobby photo ' + (index + 1)"
            @load="onImgLoad"
          />
        </div>

        <button class="carousel-btn" type="button" @click="next" aria-label="Next">›</button>
      </div>

      <div class="carousel-dots" aria-label="Gallery dots">
        <span v-for="n in images.length"
              :key="n"
              class="dot"
              :class="{active:(n-1)===index}"
              @click="goTo(n-1)"></span>
      </div>
    </div>
  `,
  data() {
    return {
      index: 0,
      images: Array.from({ length: 16 }, (_, i) => `assets/img/gallery/${i + 1}.png`),
      xStart: 0,
      xEnd: 0,
      orientationMap: {}
    };
  },
  computed: {
    currentSrc() {
      return this.images[this.index];
    },
    frameClass() {
      const o = this.orientationMap[this.currentSrc] || "landscape";
      return {
        "is-portrait": o === "portrait",
        "is-landscape": o === "landscape",
        "is-square": o === "square"
      };
    }
  },
  methods: {
    next() { this.index = (this.index + 1) % this.images.length; },
    prev() { this.index = (this.index - 1 + this.images.length) % this.images.length; },
    goTo(i) { this.index = i; },

    touchStart(e) { this.xStart = e.changedTouches[0].screenX; },
    touchEnd(e) {
      this.xEnd = e.changedTouches[0].screenX;
      const diff = this.xStart - this.xEnd;
      if (Math.abs(diff) < 30) return;
      if (diff > 0) this.next();
      else this.prev();
    },

    onImgLoad(e) {
      const img = e.target;
      const w = img.naturalWidth || 0;
      const h = img.naturalHeight || 0;
      if (!w || !h) return;

      let o = "landscape";
      if (h > w * 1.05) o = "portrait";
      else if (w > h * 1.05) o = "landscape";
      else o = "square";

      this.orientationMap[img.currentSrc || img.src] = o;
    }
  }
};

const ContactGuestbookFeed = {
  template: `
    <div class="mt-4">
      <h4 class="h6 mb-3">Messages</h4>

      <div v-if="entries.length === 0" class="text-muted small">
        No messages yet.
      </div>

      <div v-for="(e, i) in entries" :key="i" class="guest-entry">
        <div class="d-flex align-items-baseline gap-2 flex-wrap">
          <strong>{{ e.name }}</strong>
          <span v-if="e.email" class="text-muted small">({{ e.email }})</span>
          <span class="text-muted small">• {{ e.time }}</span>
        </div>
        <p class="mb-0">{{ e.message }}</p>
      </div>
    </div>
  `,
  data() {
    return { entries: [] };
  },
  mounted() {
    const load = () => {
      const saved = localStorage.getItem("guestbookEntries");
      this.entries = saved ? JSON.parse(saved) : [];
    };
    load();
    window.addEventListener("guestbook:updated", load);
  }
};

Vue.createApp({}).component("gallery-carousel", GalleryCarousel).mount("#vueGallery");

if (document.getElementById("vueContactGuestbook")) {
  Vue.createApp({}).component("contact-guestbook-feed", ContactGuestbookFeed).mount("#vueContactGuestbook");
}
