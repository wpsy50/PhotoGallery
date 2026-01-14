// Since I'm doing maths as well as cs I thought it would be fun to use some basic maths to have the eyes follow the cursor
document.addEventListener('DOMContentLoaded', () => 
{
    if ('ontouchstart' in window) return; // I don't want this on touch devices

    const eyes = document.querySelectorAll('.eye');

    document.addEventListener('mousemove', (e) => 
    {
        eyes.forEach(eye => 
        {
        const pupil = eye.querySelector('.pupil');
        const rect = eye.getBoundingClientRect();

        const center_x = rect.left + rect.width / 2;
        const center_y = rect.top + rect.height / 2;

        const dx = e.clientX - center_x;
        const dy = e.clientY - center_y;
        const angle = Math.atan2(dy, dx);
        const pupil_radius = rect.width * 0.15;

        const x = Math.cos(angle) * pupil_radius;
        const y = Math.sin(angle) * pupil_radius;

        pupil.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
});
