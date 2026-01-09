// vue-app.js

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
    next() {
      this.index = (this.index + 1) % this.images.length; // infinite loop
    },
    prev() {
      this.index = (this.index - 1 + this.images.length) % this.images.length;
    },
    touchStart(e) {
      this.xStart = e.changedTouches[0].screenX;
    },
    touchEnd(e) {
      this.xEnd = e.changedTouches[0].screenX;
      const diff = this.xStart - this.xEnd;
      if (Math.abs(diff) < 30) return; // ignore tiny swipes
      if (diff > 0) this.next();
      else this.prev();
    }
  }
};

/* ========= Vue Guestbook / Comments Component ========= */
const GuestbookForm = {
  template: `
    <div>
      <span class="card-badge">Guestbook</span>
      <h3 class="h5 mb-3">Leave a message</h3>

      <form @submit.prevent="submit" novalidate>
        <div class="mb-3">
          <label class="form-label">Name</label>
          <input v-model.trim="name" class="form-control" type="text" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Email (optional)</label>
          <input v-model.trim="email" class="form-control" type="email" />
        </div>

        <div class="mb-3">
          <label class="form-label">Message</label>
          <textarea v-model.trim="message" class="form-control" rows="4" required></textarea>
        </div>

        <div class="d-flex flex-wrap gap-2">
          <button class="btn btn-primary" type="submit">Post</button>
          <button class="btn btn-outline-primary" type="button" @click="clear">Clear</button>
        </div>

        <p v-if="status" class="small mt-3 mb-0" role="status" aria-live="polite">{{ status }}</p>
        <p class="small text-muted mt-2 mb-0">
          Demo guestbook: saved locally in your browser using localStorage.
        </p>
      </form>

      <hr class="my-4" />

      <h4 class="h6 mb-3">Messages</h4>

      <div v-if="entries.length === 0" class="text-muted small">No messages yet.</div>

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
    return {
      name: "",
      email: "",
      message: "",
      status: "",
      entries: []
    };
  },
  mounted() {
    const saved = localStorage.getItem("guestbookEntries");
    if (saved) this.entries = JSON.parse(saved);
  },
  methods: {
    submit() {
      if (!this.name || !this.message) {
        this.status = "Please enter your name and message.";
        return;
      }

      const entry = {
        name: this.name,
        email: this.email,
        message: this.message,
        time: new Date().toLocaleString()
      };

      this.entries.unshift(entry);
      localStorage.setItem("guestbookEntries", JSON.stringify(this.entries));

      this.status = "Posted!";
      this.name = "";
      this.email = "";
      this.message = "";
    },
    clear() {
      this.name = "";
      this.email = "";
      this.message = "";
      this.status = "";
    }
  }
};

/* ========= Mount Apps ========= */
Vue.createApp({}).component("gallery-carousel", GalleryCarousel).mount("#vueGallery");
Vue.createApp({}).component("guestbook-form", GuestbookForm).mount("#vueGuestbook");
