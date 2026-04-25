// --- 0. UI Ses Sistemi (Sentetik Hover/Tık) ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
let uiAudioCtx;

function playHoverSound() {
    if (!uiAudioCtx) uiAudioCtx = new AudioContext();
    if (uiAudioCtx.state === 'suspended') uiAudioCtx.resume();
    
    const osc = uiAudioCtx.createOscillator();
    const gain = uiAudioCtx.createGain();
    osc.connect(gain);
    gain.connect(uiAudioCtx.destination);
    
    osc.frequency.setValueAtTime(150, uiAudioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, uiAudioCtx.currentTime + 0.03);
    gain.gain.setValueAtTime(0.05, uiAudioCtx.currentTime); 
    gain.gain.exponentialRampToValueAtTime(0.001, uiAudioCtx.currentTime + 0.03);
    
    osc.start(uiAudioCtx.currentTime);
    osc.stop(uiAudioCtx.currentTime + 0.05);
}

// --- 1. Müzik, Visualizer ve Giriş Ekranı (Splash Screen) ---
const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');
const musicIcon = document.getElementById('music-icon');
const musicText = document.getElementById('music-text');
const splashScreen = document.getElementById('splash-screen');
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

splashScreen.addEventListener('click', () => {
    playHoverSound();
    splashScreen.classList.add('hidden');
    initVisualizer();
    bgMusic.play();
    musicIcon.classList.replace('fa-play', 'fa-pause');
    musicText.textContent = 'Playing...';
});

musicBtn.addEventListener('click', () => {
    initVisualizer(); 
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
const targets = document.querySelectorAll('a, .audio-player-ui, .avatar, button, .close-btn, #splash-screen');

if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
}

targets.forEach(t => {
    t.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) cursor.classList.add('cursor-hover');
        playHoverSound(); 
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

// --- 5. LANYARD API (ÖNCELİK SPOTIFY OLARAK GÜNCELLENDİ) ---
const discordId = '771027676055207938';
async function updateStatus() {
    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
        const { data } = await res.json();
        
        document.getElementById('d-dot').className = `status-dot ${data.discord_status}`;
        const map = { online: 'Çevrimiçi', idle: 'Boşta', dnd: 'Meşgul', offline: 'Çevrimdışı' };
        document.getElementById('d-text').textContent = map[data.discord_status] || 'Çevrimdışı';

        const activityCard = document.getElementById('activity-card');
        const actIcon = document.getElementById('activity-icon');
        const actName = document.getElementById('activity-name');
        const actDetails = document.getElementById('activity-details');

        // ÖNCELİK 1: SPOTIFY
        if (data.listening_to_spotify) {
            activityCard.style.display = 'flex';
            actIcon.className = 'fab fa-spotify';
            actIcon.style.color = '#1DB954';
            activityCard.style.background = 'rgba(29, 185, 84, 0.1)';
            activityCard.style.borderColor = 'rgba(29, 185, 84, 0.3)';
            actName.textContent = data.spotify.track;
            actDetails.textContent = data.spotify.artist;
        } 
        // ÖNCELİK 2: SPOTIFY KAPALIYSA OYUNLARI GÖSTER
        else if (data.activities && data.activities.length > 0) {
            const activeGame = data.activities.find(a => a.type === 0);
            if (activeGame) {
                activityCard.style.display = 'flex';
                actIcon.className = 'fas fa-gamepad';
                actIcon.style.color = '#fff';
                activityCard.style.background = 'rgba(255, 255, 255, 0.05)';
                activityCard.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                actName.textContent = activeGame.name;
                actDetails.textContent = activeGame.details || activeGame.state || 'Oynuyor';
            } else {
                activityCard.style.display = 'none';
            }
        } 
        // İKİSİ DE YOKSA KARTI GİZLE
        else {
            activityCard.style.display = 'none';
        }

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
