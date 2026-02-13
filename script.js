// --- 1. KONFIGURASI ---
const tanggalJadian = "2025-12-16"; // Format: YYYY-MM-DD
const myPhotos = [
    { src: '1.png', caption: 'Momen pertama kita kenal..' },
    { src: '2.jpeg', caption: 'Pap kamu yang paling aku suka' },
    { src: '3.jpeg', caption: 'Ini Juga!' },
    { src: '4.jpeg', caption: 'Ini apalagi , cantik! ❤️' }
];
const quotes = [
    "I'm so lucky to have you. ❤️",
    "Kangen kamu 3000x lipat hari ini.",
    "Semangat ya di sana, aku selalu dukung!",
    "Kamu itu alasan aku semangat tiap harinya lhoo.",
    "Distance means nothing when someone means everything.",
    "Can't wait for our next meeting! ✈️"
];

let score = 0;
const targetScore = 5;

// --- 2. FUNGSI UTAMA (WINDOW ONLOAD) ---
window.onload = () => {
    updateDayCounter();
    // Efek hujan hati pelan di background
    setInterval(() => {
        const modal = document.getElementById('loveModal');
        if (modal && !modal.classList.contains('active')) {
            createHeart();
        }
    }, 2000);
};

// --- 3. NAVIGASI STEP ---
function nextStep(step) {
    // Mulai musik saat klik pertama (pindah ke step 2)
    if (step === 2) {
        playMusic();
    }

    const allSteps = document.querySelectorAll('.step');
    allSteps.forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });

    if (step === 2) {
        const target = document.getElementById('step2');
        target.classList.add('active');
        target.style.display = 'block';
        setTimeout(showScatteredPhotos, 500);
    } 
    else if (step === 'video') {
        const videoStep = document.getElementById('step-video');
        videoStep.classList.add('active');
        videoStep.style.display = 'block';
        
        const myVideo = document.getElementById('loveVideo');
        const music = document.getElementById('backsound');
        const btnGame = document.getElementById('btn-to-game');

        // LOGIKA SINKRONISASI:
        // Saat video dimainkan, kecilkan atau pause musik
        if (music) music.pause(); 

        myVideo.play();

        // Saat video selesai, jalankan musik lagi dan munculkan tombol
        myVideo.onended = function() {
            if (music) music.play(); 
            btnGame.style.display = 'block';
            btnGame.style.animation = 'fadeIn 0.5s ease-in';
            document.querySelector('.video-caption').innerText = "Makasih udah nonton! Lanjut yuk..";
        };
    } 
    else if (step === 'game') {
        document.getElementById('step-game').classList.add('active');
        document.getElementById('step-game').style.display = 'block';
        startMiniGame();
    } 
    else {
        const target = document.getElementById('step' + step);
        if (target) {
            target.classList.add('active');
            target.style.display = 'block';
        }
    }
}

function playMusic() {
    const music = document.getElementById('backsound');
    if (music) {
        music.load(); // Memaksa browser memuat ulang file
        music.volume = 0.2;
        
        // Memastikan musik diputar setelah interaksi user
        let playPromise = music.play();
        
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                console.log("Musik diputar!");
            }).catch(error => {
                console.log("Autoplay dicegah, akan dicoba lagi saat klik selanjutnya.");
            });
        }
    }
}

function toggleMute() {
    const music = document.getElementById('backsound');
    const muteIcon = document.getElementById('mute-icon');

    if (music.muted) {
        music.muted = false;
        muteIcon.innerText = "🔊";
    } else {
        music.muted = true;
        muteIcon.innerText = "🔇";
    }
}

// --- 4. ANIMASI FOTO (STEP 2) ---
function showScatteredPhotos() {
    const area = document.getElementById('photo-area');
    if (!area) return;
    area.innerHTML = ''; 
    
    // Pastikan tombol disembunyikan lagi setiap kali fungsi ini dipanggil
    const btnNext = document.getElementById('btn-to-video');
    if (btnNext) btnNext.style.display = 'none';

    myPhotos.forEach((item, index) => {
        const imgDiv = document.createElement('div');
        imgDiv.className = 'polaroid-fly';
        imgDiv.innerHTML = `
            <img src="${item.src}">
            <div class="caption-polaroid">${item.caption}</div>
        `;
        
        // Logika posisi terbang (sama seperti sebelumnya)
        const angle = (index / myPhotos.length) * Math.PI * 2;
        const radius = 120;
        const tx = Math.cos(angle) * radius;
        const ty = Math.sin(angle) * radius;
        const tr = (Math.random() * 20) - 10; 

        imgDiv.style.setProperty('--tx', `${tx}px`);
        imgDiv.style.setProperty('--ty', `${ty}px`);
        imgDiv.style.setProperty('--tr', `${tr}deg`);
        
        area.appendChild(imgDiv);
        
        // Munculkan foto satu per satu
        setTimeout(() => {
            imgDiv.classList.add('show');
            
            // CEK: Jika ini adalah foto TERAKHIR
            if (index === myPhotos.length - 1) {
                // Tunggu sebentar setelah foto terakhir muncul, baru munculkan tombolnya
                setTimeout(() => {
                    if (btnNext) {
                        btnNext.style.display = 'block';
                        btnNext.style.animation = 'fadeIn 0.5s ease-in';
                    }
                }, 1500); // Jeda 1.5 detik setelah foto terakhir terbang
            }
        }, index * 1200); // Muncul tiap 1.2 detik
    });
}

// --- 5. LOGIKA MINI GAME ---
function startMiniGame() {
    score = 0;
    const scoreElement = document.getElementById('score-val');
    if (scoreElement) scoreElement.innerText = score;
    spawnHeart();
}

function spawnHeart() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas || score >= targetScore) return;

    const heart = document.createElement('div');
    heart.className = 'target-heart';
    heart.innerHTML = '❤️';
    
    const maxX = canvas.clientWidth - 50;
    const maxY = canvas.clientHeight - 50;
    
    heart.style.left = Math.random() * maxX + 'px';
    heart.style.top = Math.random() * maxY + 'px';

    heart.onclick = (e) => {
        e.stopPropagation();
        score++;
        const scoreElement = document.getElementById('score-val');
        if (scoreElement) scoreElement.innerText = score;
        heart.remove();
        
        // Burst kecil saat klik
        for(let i=0; i<3; i++) createHeart();

        if (score >= targetScore) {
            setTimeout(() => nextStep(3), 500);
        } else {
            spawnHeart();
        }
    };

    canvas.appendChild(heart);

    // Hati pindah tiap 1.2 detik
    setTimeout(() => {
        if (heart.parentNode) {
            heart.remove();
            spawnHeart();
        }
    }, 1200);
}

// --- 6. DAY COUNTER & QUOTES ---
function updateDayCounter() {
    const start = new Date(tanggalJadian);
    const today = new Date();
    const diffInMs = today - start;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    const counterElement = document.getElementById('day-counter');
    if(counterElement) {
        counterElement.innerText = `Day ${diffInDays} of Us ❤️`;
    }
}

function changeQuote() {
    const text = document.getElementById('quote-text');
    if (text) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        text.innerText = randomQuote;
    }
}

// --- 7. EFEK VISUAL & MODAL ---
function burstHearts() {
    for(let i=0; i<30; i++) {
        setTimeout(createHeart, i * 30);
    }
    setTimeout(() => {
        const modal = document.getElementById('loveModal');
        if (modal) modal.classList.add('active');
    }, 300);
}

function closeModal() {
    const modal = document.getElementById('loveModal');
    modal.classList.remove('active');
    
    // Ide tambahan: Ganti teks tombol utama di Step 3 setelah modal ditutup
    const btnHeart = document.querySelector('.btn-heart');
    if (btnHeart) {
        btnHeart.innerText = "Sampai ketemu nanti siang! 🥰";
        btnHeart.style.background = "#2ecc71"; // Ganti warna jadi hijau (tanda sukses/go)
        btnHeart.disabled = true; // Biar gak diklik berkali-kali
    }
}

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart-float';
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.bottom = '-5vh';
    heart.style.position = 'fixed';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
    heart.style.zIndex = "999";
    heart.style.animation = `moveUp ${Math.random() * 2 + 2}s linear forwards`;
    
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 3000);
}