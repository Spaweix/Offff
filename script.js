// --- 0. UI Ses Sistemi (Sentetik Hover/Tık) ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
let uiAudioCtx;

function playHoverSound() {
    if (!uiAudioCtx) uiAudioCtx = new AudioContext();
    if (uiAudioCtx.state === 'suspended') uiAudioCtx.resume();
    
    // Dijital, yumuşak bir klik sesi üretir
    const osc = uiAudioCtx.createOscillator();
    const gain = uiAudioCtx.createGain();
    osc.connect(gain);
    gain.connect(uiAudioCtx.destination);
    
    osc.frequency.setValueAtTime(150, uiAudioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, uiAudioCtx.currentTime + 0.03);
    gain.gain.setValueAtTime(0.05, uiAudioCtx.currentTime); // Düşük ses seviyesi
    gain.gain.exponentialRampToValueAtTime(0.001, uiAudioCtx.currentTime + 0.03);
    
    osc.start(uiAudioCtx.currentTime);
    osc.stop(uiAudioCtx.currentTime + 0.05);
}

// --- 1. Müzik ve Audio Visualizer ---
const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');
const musicIcon = document.getElementById('music-icon');
const musicText = document.getElementById('music-text');
bgMusic.volume = 0.3;

let audioCtx, analyzer, source;
const canvas = document.getElementById('audio-visualizer');
const ctx = canvas.getContext('2d');

function initVisualizer() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
        analyzer = audioCtx.createAnalyser();
        source = audioCtx.createMediaElementSource(bgMusic);
        source.connect(analyzer);
        analyzer.connect(audioCtx.destination);
        analyzer.fftSize = 256;
        
        const bufferLength = analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerWidth > 768 ? 150 : 80;
        }
        window.addEventListener('resize', resize);
        resize();

        function draw() {
            requestAnimationFrame(draw);
            analyzer.getByteFrequencyData(dataArray);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight, x = 0;
            
            // Eğer kan modu açıksa kırmızı, değilse beyaz dalgalar
            const isBloodMode = document.body.classList.contains('blood-mode');
            
            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;
                ctx.fillStyle = isBloodMode 
                    ? `rgba(255, 0, 0, ${barHeight / 150})` 
                    : `rgba(255, 255, 255, ${barHeight / 255})`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 2;
            }
        }
        draw();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

musicBtn.addEventListener('click', () => {
    initVisualizer(); // Müzik başlarken dalgaları çalıştırır
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

// --- 2. Custom Cursor ve Hover Efektleri ---
const cursor = document.querySelector('.custom-cursor');
const targets = document.querySelectorAll('a, .audio-player-ui, .avatar, button, .close-btn');

if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
}

targets.forEach(t => {
    t.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) cursor.classList.add('cursor-hover');
        playHoverSound(); // İkonun üzerine gelindiğinde o dijital sesi çalar
    });
    t.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768) cursor.classList.remove('cursor-hover');
    });
});

// --- 3. Daktilo (Typewriter) ---
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

// --- 4. Modal ---
const modal = document.getElementById("projects-modal");
const openBtn = document.getElementById("open-modal-btn");
const closeBtn = document.querySelector(".close-btn");

openBtn.onclick = () => modal.classList.add("show");
closeBtn.onclick = () => modal.classList.remove("show");
window.onclick = (e) => { if (e.target === modal) modal.classList.remove("show"); }

// --- 5. Lanyard (Discord & Spotify) ---
const discordId = '771027676055207938';
async function updateStatus() {
    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
        const { data } = await res.json();
        
        document.getElementById('d-dot').className = `status-dot ${data.discord_status}`;
        const map = { online: 'Çevrimiçi', idle: 'Boşta', dnd: 'Meşgul', offline: 'Çevrimdışı' };
        document.getElementById('d-text').textContent = map[data.discord_status] || 'Çevrimdışı';

        const spotify = document.getElementById('spotify-status');
        if (data.listening_to_spotify) {
            spotify.style.display = 'flex';
            document.getElementById('song-name').textContent = data.spotify.track;
            document.getElementById('artist-name').textContent = data.spotify.artist;
        } else { spotify.style.display = 'none'; }
    } catch (e) { console.log(e); }
}
setInterval(updateStatus, 10000); updateStatus();

// --- 6. Particles ---
function loadParticles(color) {
    particlesJS('particles-js', {
        particles: {
            number: { value: 50 }, color: { value: color },
            opacity: { value: 0.3 }, size: { value: 2 },
            move: { enable: true, speed: 0.7 }
        }
    });
}
loadParticles("#ffffff");

// --- 7. LUELLA EASTER EGG ---
let input = "";
document.addEventListener('keydown', (e) => {
    input += e.key.toLowerCase();
    if (input.length > 6) input = input.slice(-6);
    if (input === "luella") {
        document.body.classList.add('blood-mode');
        document.getElementById('profile-name').textContent = "SESSİZLİK BOZULDU.";
        
        bgMusic.playbackRate = 0.5; 
        
        texts = ["Onu duydun mu?", "Kaçacak yerin yok.", "Sessizlik başlıyor..."];
        tIdx = 0; cIdx = 0;
        loadParticles("#ff0000");
    }
});

// --- 8. Dinamik Sekme Başlığı ---
let originalTitle = document.title;
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        document.title = "Sessizlik çöküyor...";
    } else {
        document.title = originalTitle;
    }
});
