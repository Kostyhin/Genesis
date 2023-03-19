class PreviewItem extends HTMLElement {

  static observedAttributes = ['id', 'title', 'rating', 'skills', 'lessons', 'video', 'image', 'token'];
  shadowRoot;
  Hls;

  constructor() {
    super();
    this.setDefaultAttributes();
    this.shadowRoot = this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<video id="video-player" controls></video>`;
    this.hlsScriptLoaded = false;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'id': this._id = newValue; break;
      case 'title': this._title = newValue; break;
      case 'rating': this._rating = newValue; break;
      case 'skills': this._skills = JSON.parse(newValue); break;
      case 'lessons': this._lessonsCount = newValue; break;
      case 'video': this._videoLink = newValue; break;
      case 'image': this._previewImageLink = newValue; break;
      case 'token': this._token = newValue; break;
    }
  }

  async connectedCallback() {
    this.shadowRoot.innerHTML = '';
    //await import('https://cdn.jsdelivr.net/npm/hls.js@latest');
    /*if (!this.hlsScriptLoaded) {
      const hlsScript = document.createElement('script');
      hlsScript.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
      document.head.appendChild(hlsScript);
      hlsScript.onload = () => {        
        const Hls = window.Hls;
        if (Hls != undefined && Hls.isSupported()) {
          this.hlsScriptLoaded = true;
        } else {
          console.error('HLS not supported');
          return;
        };
      };
    }*/
    const cssModule = await import('../css/style.css', {
      assert: { type: 'css' }
    });
    this.shadowRoot.adoptedStyleSheets = [cssModule.default];
    this.shadowRoot.appendChild(this.getMainElement());
  }

  setDefaultAttributes() {
    this._id = null;
    this._title = null;
    this._rating = null;
    this._skills = null;
    this._lessonsCount = null;
    this._videoLink = null;
    this._previewImageLink = null;
  }

  get title() {
    return this._title;
  }
  set title(v) {
    this.setAttribute("title", v);
  }

  get rating() {
    return this._rating;
  }
  set rating(v) {
    this.setAttribute("rating", v);
  }

  get skills() {
    return this._skills;
  }
  set skills(v) {
    this.setAttribute("skills", v);
  }

  get lessons() {
    return this._lessonsCount;
  }
  set lessons(v) {
    this.setAttribute("lessons", v);
  }

  get video() {
    return this._videoLink;
  }
  set video(v) {
    this.setAttribute("video", v);
  }

  get image() {
    return this._previewImageLink;
  }
  set image(v) {
    this.setAttribute("image", v);
  }

  get token() {
    return this._token;
  }
  set token(v) {
    this.setAttribute("token", v);
  }

  getMainElement() {
    const wrapper = document.createElement("span");
    wrapper.setAttribute("class", "wrapper");

    const courseDiv = document.createElement('div');
    courseDiv.classList.add('course');
    courseDiv.appendChild(this.getTitle());
    courseDiv.appendChild(this.getLeftPart());
    courseDiv.appendChild(this.getRightPart());
    wrapper.appendChild(courseDiv);

    return wrapper;
  }

  getLeftPart() {
    const leftDiv = document.createElement('div');
    leftDiv.classList.add('item-video');
    leftDiv.appendChild(this.getVideo());
    return leftDiv;
  }

  getRightPart() {
    const rightDiv = document.createElement('div');
    rightDiv.classList.add('item-description');
    rightDiv.appendChild(this.getLessonCount());
    rightDiv.appendChild(this.getRating());
    rightDiv.appendChild(this.getSkills());
    return rightDiv;
  }

  getTitle() {
    const title = document.createElement('h3');
    const link = document.createElement('a');
    link.href = `courseItem.html?token=${this._token}&id=${this._id}`;
    link.textContent = this._title;
    title.appendChild(link);
    title.classList.add('item-title');
    return title;
  }

  getRating() {
    const rating = document.createElement('p');
    rating.textContent = `Рейтинг: ${this._rating}`;
    rating.classList.add('rating');
    return rating;
  }

  getLessonCount() {
    const lessonsCount = document.createElement('p');
    lessonsCount.textContent = `${this._lessonsCount} уроків`;
    lessonsCount.classList.add('lessons-count');
    return lessonsCount;
  }

  getSkills() {
    const skills = document.createElement('div');
    const title = document.createElement('h5');
    title.textContent = 'Скіли:';
    skills.appendChild(title);
    const list = document.createElement('ul');
    this._skills.forEach(skill => {
      const item = document.createElement('li');
      item.textContent = skill;
      list.appendChild(item);
    });
    skills.appendChild(list);
    skills.classList.add('skills');
    return skills;
  }

  getVideo() {
    const video = document.createElement('video');
   
    if (this.hlsScriptLoaded) {
      var hls = new Hls();
      hls.loadSource(this._videoLink);
      hls.attachMedia(video);
    } else {
      video.src = './video.mp4';
      console.error('HLS not supported');
    };

    video.poster = `${this._previewImageLink}/cover.webp`;
    video.preload = "none";
    video.controls = false;
    video.muted = true;

    video.addEventListener('mouseover', () => {
      video.play();
    });
    video.addEventListener('mouseout', () => {
      video.pause();
    });

    return video;
  }
}

customElements.define('preview-course', PreviewItem);