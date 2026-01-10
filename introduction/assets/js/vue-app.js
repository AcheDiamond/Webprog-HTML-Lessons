const GalleryCarousel = {
  template: `
    <div>
      <span class="card-badge">Gallery</span>
      <h3 class="h5 mb-3">Hobbies Photo Gallery</h3>

      <div class="carousel-wrap" @touchstart="touchStart" @touchend="touchEnd">
        <button class="carousel-btn" type="button" @click="prev" aria-label="Previous">‹</button>

        <div class="carousel-frame">
          <img :src="currentSrc" class="gallery-img" :alt="'Hobby photo ' + (index + 1)" />
        </div>

        <button class="carousel-btn" type="button" @click="next" aria-label="Next">›</button>
      </div>

      <div class="carousel-dots" aria-label="Gallery dots">
        <span v-for="n in images.length"
              :key="n"
              class="dot"
              :class="{active:(n-1)===index}"
              @click="index=n-1"></span>
      </div>
    </div>
  `,
  data() {
    return {
      index: 0,
      images: Array.from({ length: 16 }, (_, i) => `assets/img/gallery/${i + 1}.png`),
      xStart: 0,
      xEnd: 0
    };
  },
  computed: {
    currentSrc() {
      return this.images[this.index];
    }
  },
  methods: {
    next() { this.index = (this.index + 1) % this.images.length; },
    prev() { this.index = (this.index - 1 + this.images.length) % this.images.length; },
    touchStart(e) { this.xStart = e.changedTouches[0].screenX; },
    touchEnd(e) {
      this.xEnd = e.changedTouches[0].screenX;
      const diff = this.xStart - this.xEnd;
      if (Math.abs(diff) < 30) return;
      if (diff > 0) this.next();
      else this.prev();
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

// Mount Gallery
Vue.createApp({}).component("gallery-carousel", GalleryCarousel).mount("#vueGallery");

if (document.getElementById("vueContactGuestbook")) {
  Vue.createApp({}).component("contact-guestbook-feed", ContactGuestbookFeed).mount("#vueContactGuestbook");
}
