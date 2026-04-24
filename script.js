// --- 1. Müzik Çalar ---
const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');
const musicIcon = document.getElementById('music-icon');
const musicText = document.getElementById('music-text');

bgMusic.volume = 0.3;

musicBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicIcon.classList.replace('fa-play', 'fa-pause');
        musicText.textContent = 'Playing...';
    } else {
        bgMusic.pause();
        musicIcon.classList.replace('fa-pause', 'fa-play');
        musicText.textContent = 'Paused';
    }
});

// --- 2. Custom Cursor ---
const cursor = document.querySelector('.custom-cursor');
const links = document.querySelectorAll('a, .audio-player-ui, .avatar, button, .close-btn');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

links.forEach(l => {
    l.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    l.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
});

// --- 3. Typewriter ---
const typeWriterElement = document.getElementById('typewriter');
let texts = ["Gamer", "Writer", "Audiophile", "Tech Enthusiast"];
let tIdx = 0, cIdx = 0, isDel = false;

function type() {
    const cur = texts[tIdx];
    typeWriterElement.textContent = isDel ? cur.substring(0, cIdx--) : cur.substring(0, cIdx++);
    
    let speed = isDel ? 50 : 100;
    if (!isDel && cIdx > cur.length) { isDel = true; speed = 2000; }
    else if (isDel && cIdx < 0) { isDel = false; tIdx = (tIdx + 1) % texts.length; speed = 500; }
    setTimeout(type, speed);
}
type();

// --- 4. Projeler Modal ---
const modal = document.getElementById("projects-modal");
const btn = document.getElementById("open-modal-btn");
const span = document.getElementsByClassName("close-btn")[0];

btn.onclick = function() { modal.classList.add("show"); }
span.onclick = function() { modal.classList.remove("show"); }
window.onclick = function(event) { if (event.target == modal) { modal.classList.remove("show"); } }

// --- 5. Lanyard API (Discord & Spotify) ---
const discordId = '771027676055207938';

async function updateStatus() {
    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
        const { data } = await res.json();
        
        document.getElementById('d-dot').className = `status-dot ${data.discord_status}`;
        const statusMap = { online: 'Çevrimiçi', idle: 'Boşta', dnd: 'Rahatsız Etmeyin', offline: 'Çevrimdışı' };
        document.getElementById('d-text').textContent = statusMap[data.discord_status] || 'Çevrimdışı';

        const spotifyCard = document.getElementById('spotify-status');
        if (data.listening_to_spotify) {
            spotifyCard.style.display = 'flex';
            document.getElementById('song-name').textContent = data.spotify.track;
            document.getElementById('artist-name').textContent = data.spotify.artist;
        } else {
            spotifyCard.style.display = 'none';
        }
    } catch (e) { console.error(e); }
}
setInterval(updateStatus, 10000);
updateStatus();

// --- 6. Particles.js Kurulumu (Varsayılan Beyaz) ---
function initParticles(colorHex) {
    particlesJS('particles-js', {
        particles: {
            number: { value: 50 },
            color: { value: colorHex },
            opacity: { value: 0.3 },
            size: { value: 2 },
            move: { enable: true, speed: 0.8 }
        }
    });
}
initParticles("#ffffff");

// --- 7. EASTER EGG (LUELLA) ---
let typedKeys = "";
document.addEventListener('keydown', (e) => {
    typedKeys += e.key.toLowerCase();
    // Son 6 karakteri tut (luella = 6 harf)
    if (typedKeys.length > 6) {
        typedKeys = typedKeys.slice(-6);
    }
    
    // Eğer "luella" yazıldıysa efekti tetikle
    if (typedKeys === "luella") {
        triggerLuellaEffect();
    }
});

function triggerLuellaEffect() {
    // Kırmızı glitch modunu aç
    document.body.classList.add('blood-mode');
    
    // İsmi değiştir
    document.getElementById('profile-name').textContent = "LUELLA UYANDI...";
    
    // Daktilodaki yazıları karanlık temaya çevir
    texts = ["Sessizlik bozuldu.", "Kimse güvende değil.", "O burada."];
    tIdx = 0; cIdx = 0;
    
    // Parçacıkları kan kırmızısına çevir ve hızlandır
    particlesJS('particles-js', {
        particles: {
            number: { value: 80 },
            color: { value: "#ff0000" },
            opacity: { value: 0.5 },
            size: { value: 3 },
            move: { enable: true, speed: 2.5 }
        }
    });
}
