document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const gallery = document.getElementById('gallery');
    const fullscreenView = document.getElementById('fullscreen-view');
    const fullscreenImage = document.getElementById('fullscreen-image');
    const backButton = document.getElementById('back-button');
    const imageTitle = document.getElementById('image-title');
    const imageFilm = document.getElementById('image-film');
    const imageCamera = document.getElementById('image-camera');
    const imageLocation = document.getElementById('image-location');
    const imageCaption = document.getElementById('image-caption');
    
    // Intersection Observer for lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const placeholder = img.previousElementSibling;
                
                // Load the image
                img.src = img.dataset.src;
                
                // Handle image load
                img.onload = function() {
                    img.classList.add('loaded');
                    if (placeholder && placeholder.classList.contains('loading-placeholder')) {
                        placeholder.style.display = 'none';
                    }
                };
                
                // Handle image error
                img.onerror = function() {
                    if (placeholder && placeholder.classList.contains('loading-placeholder')) {
                        placeholder.textContent = 'Failed to load';
                        placeholder.style.background = '#333';
                    }
                };
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });
    
    // Get all gallery items and set up lazy loading
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        
        // Start observing the image for lazy loading
        imageObserver.observe(img);
        
        // Add click event to open fullscreen view
        item.addEventListener('click', function() {
            // Only open if image is loaded
            if (img.classList.contains('loaded')) {
                const imageData = {
                    src: img.src,
                    title: item.dataset.title,
                    film: item.dataset.film,
                    camera: item.dataset.camera,
                    location: item.dataset.location,
                    caption: item.dataset.caption
                };
                openFullscreen(imageData);
            }
        });
    });
    
    // Preload first few images immediately for better initial experience
    const firstImages = Array.from(galleryItems).slice(0, 3);
    firstImages.forEach(item => {
        const img = item.querySelector('img');
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    });
    
    // Function to open fullscreen view
    function openFullscreen(imageData) {
        fullscreenImage.src = imageData.src;
        fullscreenImage.alt = imageData.title;
        
        imageTitle.textContent = imageData.title;
        imageFilm.textContent = imageData.film;
        imageCamera.textContent = imageData.camera;
        imageLocation.textContent = imageData.location;
        imageCaption.textContent = imageData.caption;
        
        fullscreenView.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when in fullscreen
    }
    
    // Close fullscreen view when back button is clicked
    backButton.addEventListener('click', function() {
        closeFullscreen();
    });
    
    // Close fullscreen view when clicking outside the image
    fullscreenView.addEventListener('click', function(event) {
        if (event.target === fullscreenView) {
            closeFullscreen();
        }
    });
    
    // Close fullscreen view when ESC key is pressed
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeFullscreen();
        }
    });
    
    // Function to close fullscreen view
    function closeFullscreen() {
        fullscreenView.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }
});
