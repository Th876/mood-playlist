'use strict';

// Particles animation
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particlesArray;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init(); // Re-initialize particles when window is resized
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width; // Random x position
    this.y = Math.random() * canvas.height; // Random y position
    this.size = Math.random() * 2 + 1; // Make particles small 
    this.speedY = (Math.random() * 0.3) + 0.1; // Upward movement is slightly faster
    this.alpha = Math.random() * 1 + 1; 
  }

  update() {
    this.y -= this.speedY; // Move particle upwards

    // Reset particle to the bottom if it moves off the top
    if (this.y < 0) {
      this.y = canvas.height;
      this.x = Math.random() * canvas.width; // Reset to random position horizontally
    }
  }

  draw() {
    ctx.fillStyle = `rgba(0, 0, 0, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function init() {
  particlesArray = [];
  // More particles for better coverage
  for (let i = 0; i < 50; i++) { 
    particlesArray.push(new Particle());
  }
}

function handleParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas each frame
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update(); // Update particle position
    particlesArray[i].draw(); // Draw particle on canvas
  }
  requestAnimationFrame(handleParticles); // Loop animation
}

// Call particle effect
init();
handleParticles();

  // Function to retrieve playlist via YouTube
document.addEventListener("DOMContentLoaded", function() {
  const moodOptions = document.querySelectorAll('.mood-option');
  const loader = document.getElementById('loader');
  const emojiGrid = document.querySelector('.emoji-grid');

  moodOptions.forEach(option => {
    option.addEventListener('click', function() {
      const mood = this.getAttribute('data-mood');
      console.log("Selected mood:", mood);

      // Hide emoji grid temporarily 
      emojiGrid.style.visibility = 'hidden';  // Hide without affecting layout

      // Show the loader
      loader.style.display = 'flex';

      // Fetch YouTube video based on the mood
      fetchYouTubeVideo(mood);
    });
  });

  function fetchYouTubeVideo(mood) {
    // Fetch from Lambda Url
    const searchUrl = `https://obuacv4csd.execute-api.us-east-2.amazonaws.com/playlist?mood=${encodeURIComponent(mood + ' playlist')}`;
  
    fetch(searchUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.items && data.items.length > 0) {
          // Filter out any video that has 'lofi' in the title
          const validVideos = data.items.filter(item => 
            !item.snippet.title.toLowerCase().includes('lofi')
          );
  
          if (validVideos.length > 0) {
            // Randomize video selection
            const randomVideo = getRandomVideo(validVideos);
            const videoId = randomVideo.id.videoId;
            openVideoInNewTab(videoId);
          } else {
            console.error("No valid videos found.");
            loader.textContent = "No valid videos found.";
          }
        } else {
          console.error("No videos found.");
          loader.textContent = "No videos found.";
        }
      })
      .catch(error => {
        console.error('Error fetching from Lambda:', error);
        loader.textContent = "Error fetching videos.";
      });
  }

  // Function to shuffle array randomly
  function getRandomVideo(videos) {
    const shuffled = videos.sort(() => 0.5 - Math.random());
    return shuffled[0]; // Return the first video from the shuffled list
  }

  function openVideoInNewTab(videoId) {
    // Hide loader when video is retrieved
    loader.style.display = 'none';

    // Show emoji grid again after opening the video
    emojiGrid.style.visibility = 'visible'; // Restore visibility without altering layout

    // Open the video in a new tab
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    window.open(videoUrl, '_blank');
  }
});
