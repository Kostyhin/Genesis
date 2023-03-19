var courses;

const coursesPerPage = 10;
let currentPage = 1;

async function renderCourses() {
    utils = new Utils();
    courses = await utils.reciveCourses();
    const totalPages = Math.ceil(courses.length / coursesPerPage);
    const startIndex = (currentPage - 1) * coursesPerPage;
    const endIndex = Math.min(startIndex + coursesPerPage, courses.length);

    const coursesList = document.getElementById('courses-list'); 
    coursesList.classList.add('course-grid');
    coursesList.innerHTML = '';
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
        coursesList.appendChild(preview);
    })

    renderPagination(totalPages);
}

async function renderPagination(totalPages) {
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

    const coursesList = document.getElementById('courses-list');
    coursesList.appendChild(pagination);
}

renderCourses();