// Sayfadaki elementleri seçiyoruz
const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');
const musicIcon = document.getElementById('music-icon');
const musicText = document.getElementById('music-text');

// Şarkı sesi çok yüksek olup irkiltmesin diye sesi %30'a ayarlıyoruz (istediğin gibi değiştirebilirsin)
bgMusic.volume = 0.3;

// Düğmeye tıklandığında olacaklar
musicBtn.addEventListener('click', () => {
    // Eğer şarkı duraklatılmışsa (veya hiç başlamamışsa)
    if (bgMusic.paused) {
        bgMusic.play(); // Şarkıyı başlat
        musicIcon.classList.remove('fa-play'); // Oynat ikonunu kaldır
        musicIcon.classList.add('fa-pause'); // Duraklat ikonunu ekle
        musicText.textContent = 'Playing...'; // Yazıyı değiştir
        musicBtn.classList.add('playing'); // Düğmeyi biraz daha parlak yap (CSS'teki hover efekti gibi)
    } 
    // Eğer şarkı çalıyorsa
    else {
        bgMusic.pause(); // Şarkıyı durdur
        musicIcon.classList.remove('fa-pause'); // Duraklat ikonunu kaldır
        musicIcon.classList.add('fa-play'); // Oynat ikonunu geri getir
        musicText.textContent = 'Paused'; // Yazıyı değiştir
        musicBtn.classList.remove('playing'); // Parlaklığı eski haline getir
    }
});
