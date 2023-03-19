const Hls = window.Hls;

var token;
var courseId;
var course;

let pipWindow;

function getAllUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    token = urlParams.get('token');
    courseId = urlParams.get('id');
    console.log(token);
    console.log(courseId);
}

async function renderCourse() {
    utils = new Utils();
    course = await utils.reciveCourse();
    lessons = course.lessons;

    const video = document.getElementById('video');
    video.poster = course.previewImageLink + '/cover.webp';
    video.src = course.meta.courseVideoPreview.link;;
    video.preload = "none";

    const lessonsList = document.getElementById('lessons-list');
    const notSupported = document.getElementById('not-supported');
    const pipButton = document.getElementById('pip-button');
    lessonsList.innerHTML = '';
    lessons.forEach(lesson => {

        const item = document.createElement('li');

        const lessonElement = document.createElement('p');
        lessonElement.textContent = lesson.title;
        lessonElement.value = lesson.id;
        lessonElement.classList.add('lesson');
        that = this;
        if (lesson.status === "unlocked") {
            lessonElement.onclick = function () {
                let obj = that.lessons.find(o => o.id === this.value);

                document.getElementById('videoTitle').textContent = obj.title;

                const video = document.getElementById('video');
                let videoSrc = obj.link;
                let isSuported;
                try{
                    isSuported = Hls.isSupported();
                } catch {
                    isSuported = false;
                }
                if (isSuported) {
                    var hls = new Hls();
                    hls.loadSource(videoSrc);
                    hls.attachMedia(video);
                    notSupported.style.visibility = 'hidden';
                    pipButton.style.visibility = 'visible';
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = videoSrc;
                    notSupported.style.visibility = 'hidden';
                    pipButton.style.visibility = 'visible';
                } else {
                    notSupported.style.visibility = 'visible';
                    pipButton.style.visibility = 'hidden';
                }
              
                video.poster = obj.previewImageLink + '/' + obj.order + '.webp';
                video.preload = 'none';
                video.controls = true;
                video.muted = false;
            }
        } else {
            lessonElement.classList.add('deactive-lesson');
            lessonElement.onclick = function (el) {
                alert("Lesson is locked");
            }
        }
        item.appendChild(lessonElement);
        lessonsList.appendChild(item);

    });
}

function requestPictureInPicture() {
    if (document.pictureInPictureEnabled && video !== document.pictureInPictureElement) {
        video.requestPictureInPicture();
    } else {
        document.exitPictureInPicture();
    }
}

function videoSpeedPlus() {
    document.querySelector('video').defaultPlaybackRate = 2.0;
    document.querySelector('video').play();

    /* now play three times as fast just for the heck of it */
    document.querySelector('video').playbackRate = 3.0;
}

function addSpeedKeydownLisyener() {
    document.addEventListener('keydown', function (event) {
        if (event.code == 'KeyZ' && (event.ctrlKey || event.metaKey)) {
            if ((video.playbackRate - 0.2) > 0) {
                try { video.playbackRate -= 0.2; } catch { }
            }
        } else if (event.code == 'KeyY' && (event.ctrlKey || event.metaKey)) {
            if ((video.playbackRate + 0.2) <= 3) {
                try { video.playbackRate += 0.2; } catch { }
            }
        }

    });
}

getAllUrlParams();
renderCourse();
addSpeedKeydownLisyener();

