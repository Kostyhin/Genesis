const coursesPerPage = 10;
let currentPage = 1;

async function renderCourses() {
    const utils = new Utils();
    const courses = await utils.reciveCourses();
    const totalPages = Math.ceil(courses.length / coursesPerPage);
    const startIndex = (currentPage - 1) * coursesPerPage;
    const endIndex = Math.min(startIndex + coursesPerPage, courses.length);

    const coursesList = document.querySelector('#courses-list');
    coursesList.classList.add('course-grid');

    const fragment = document.createDocumentFragment();

    courses.slice(startIndex, endIndex).forEach(course => {
        const preview = document.createElement('preview-course');
        preview.token = utils.token;
        preview.id = course.id;
        preview.title = course.title;
        preview.rating = course.rating;
        preview.skills = JSON.stringify(course.meta.skills);
        preview.lessons = course.lessonsCount;
        preview.video = course.meta.courseVideoPreview.link;
        preview.image = course.previewImageLink;
        fragment.appendChild(preview);
    });

    coursesList.innerHTML = '';
    coursesList.appendChild(fragment);

    renderPagination(totalPages, coursesList);
}

function renderPagination(totalPages, coursesList) {
    const pagination = document.createElement('div');
    pagination.classList.add('pagination');

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('page-button');
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderCourses();
        });
        pagination.appendChild(pageButton);
    }

    coursesList.appendChild(pagination);
}

renderCourses();