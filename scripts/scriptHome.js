document.querySelectorAll('.sidebar a').forEach(function (link) {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        document.querySelectorAll('.sidebar a').forEach(function (link) {
            link.classList.remove('active');
        });
        this.classList.add('active');

        const sectionId = this.getAttribute('data-section');
        document.querySelectorAll('.section').forEach(function (section) {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        const sectionTitleMap = {
            about: 'NoteMarker',
            download: 'Download',
            privacy: 'Privacy Policy',
            license: 'License Agreement',
            'release-notes': 'Release Notes',
            changelog: 'Changelog',
            feedback: 'Feedback',
        };

        document.title = sectionTitleMap[sectionId] || 'NoteMarker';

        document.querySelector('.sidebar').classList.remove('active');
    });
});

document.querySelector('.mobile-menu-toggle').addEventListener('click', function () {
    document.querySelector('.sidebar').classList.toggle('active');
});

document.getElementById('feedback-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const feedback = document.getElementById('feedback').value;

    const githubUrl = 'https://github.com/ThisIs-Developer/NoteMarker-Extension/issues';

    window.open(githubUrl, '_blank');
});

document.querySelectorAll('.gallery-image').forEach(function (image) {
    image.addEventListener('click', function () {
        const overlay = document.getElementById('imageOverlay');
        const overlayImage = document.getElementById('overlayImage');
        overlayImage.src = this.src;
        overlay.style.display = 'flex';
    });
});

document.getElementById('closeOverlay').addEventListener('click', function () {
    document.getElementById('imageOverlay').style.display = 'none'; 
});

document.getElementById('imageOverlay').addEventListener('click', function () {
    this.style.display = 'none'; // Hide overlay
});

