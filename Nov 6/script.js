// Global variables
let userName = '';
let selectedAnswers = {};
let quizSubmitted = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWelcomeModal();
    initializeCountdown();
    initializeConfetti();
    initializePinata();
    initializeMusicPlayer();
    initializeQuiz();
    initializeMessageForm();
    initializeGallery();
});

function initializeWelcomeModal() {
    const enterSiteBtn = document.getElementById('enterSite');
    const userNameInput = document.getElementById('userName');
    const mainContent = document.getElementById('mainContent');

    enterSiteBtn.addEventListener('click', function() {
        if (userNameInput.value.trim() !== '') {
            userName = userNameInput.value.trim();
            document.getElementById('welcomeModal').style.display = 'none';
            mainContent.classList.remove('hidden');
            createConfetti();
            addWelcomeMessage();
        } else {
            alert('Please enter your name to continue!');
        }
    });

    userNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') enterSiteBtn.click();
    });
}

function addWelcomeMessage() {
    const messagesContainer = document.getElementById('messagesContainer');
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'message';
    welcomeMessage.innerHTML = `
        <div class="message-author">🎉 Birthday Celebration 🎉</div>
        <div class="message-text">Welcome ${userName}! Thanks for joining my birthday celebration! 🎂</div>
        <div class="message-time">Just now</div>
    `;
    messagesContainer.prepend(welcomeMessage);
}

// Countdown Timer
function initializeCountdown() {
    function updateCountdown() {
        const now = new Date();
        const currentYear = now.getFullYear();
        let birthday = new Date(currentYear, 10, 6); // November is month 10 (0-indexed)
        
        // If birthday has passed this year, set for next year
        if (now > birthday) {
            birthday = new Date(currentYear + 1, 10, 6);
        }
        
        const diff = birthday - now;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    setInterval(updateCountdown, 1000);
    updateCountdown();
}

// Confetti Functionality
function initializeConfetti() {
    document.getElementById('confettiBtn').addEventListener('click', createConfetti);
}

function createConfetti() {
    const colors = ['#ff4081', '#ffeb3b', '#673ab7', '#4caf50', '#2196f3'];
    const confettiCount = 150;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '12px';
        confetti.style.height = '12px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.zIndex = '9999';
        confetti.style.opacity = '0.9';
        confetti.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
        
        document.body.appendChild(confetti);
        
        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 3000,
            easing: 'cubic-bezier(0.1, 0.2, 0.8, 0.9)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

// Piñata Interaction
function initializePinata() {
    const pinata = document.getElementById('pinata');
    const pinataModal = document.getElementById('pinataModal');
    const pinataMessage = document.getElementById('pinataMessage');
    const closePinataModal = document.querySelector('#pinataModal .close-modal');
    const modalCloseBtn = document.querySelector('.modal-close');
    
    pinata.addEventListener('click', function() {
        this.style.transform = 'rotate(30deg) scale(1.2)';
        createConfetti();
        
        setTimeout(() => {
            this.style.transform = 'scale(1.1)';
        }, 300);
        
        const funFacts = [
            "I once ate an entire birthday cake by myself! 🍰",
            "My first word was 'cake'! 🎂",
            "I share my birthday with some famous people! 🌟",
            "I was born on the most wonderful day of the year! ✨",
            "My birthday falls on the 310th day of the year! 📅",
            "I'm a pro CODM player! 🎮",
            "Garri is my favorite drink ever! 🥤",
            "I could play CODM for 12 hours straight! ⏰",
            "My cat tries to help me play video games! 🐱",
            "I believe birthday cake should be eaten for breakfast! 🍽️"
        ];
        
        pinataMessage.textContent = funFacts[Math.floor(Math.random() * funFacts.length)];
        pinataModal.classList.remove('hidden');
    });
    
    closePinataModal.addEventListener('click', () => pinataModal.classList.add('hidden'));
    modalCloseBtn.addEventListener('click', () => pinataModal.classList.add('hidden'));
    window.addEventListener('click', (event) => {
        if (event.target === pinataModal) pinataModal.classList.add('hidden');
    });
}

// FIXED Music Player - All songs work independently
function initializeMusicPlayer() {
    const songs = document.querySelectorAll('.song');
    const audioPlayer = document.getElementById('audioPlayer');
    
    // Local file paths - using working online URLs as fallback
    const musicSources = {
        'whosbeen': 'audio/whosbeen.mp3',
        'adunni': 'audio/adunni.mp3',
        'spaghetti': 'audio/spaghetti.mp3',
        'you': 'audio/you.mp3',
        'fun': 'audio/fun.mp3',
        'withyou': 'audio/withyou.mp3'
    };
    
    let currentSong = null;
    let audioEnabled = false;

    // Enable audio on ANY click
    function enableAudio() {
        if (!audioEnabled) {
            audioEnabled = true;
            // Create a silent audio context to unlock audio
            const silentAudio = new Audio();
            silentAudio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUgBjiN1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUgBjiN1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUgBjiN1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUgBjiN1/LMeSw=';
            silentAudio.play().then(() => {
                silentAudio.pause();
            }).catch(() => {
                // Silent fail
            });
        }
    }

    // Enable audio on first interaction
    document.addEventListener('click', enableAudio, { once: true });

    songs.forEach(song => {
        song.addEventListener('click', function() {
            const songId = this.getAttribute('data-song');
            
            // Enable audio if not already enabled
            enableAudio();

            // If clicking the same song, toggle play/pause
            if (currentSong === songId) {
                if (!audioPlayer.paused) {
                    audioPlayer.pause();
                    this.querySelector('.play-indicator i').className = 'fas fa-play';
                    this.classList.remove('playing');
                    return;
                } else {
                    // If paused, resume playing
                    audioPlayer.play().catch(() => {
                        // If resume fails, reload the source
                        audioPlayer.src = musicSources[songId];
                        audioPlayer.play().catch(() => {
                            this.querySelector('.play-indicator i').className = 'fas fa-play';
                            this.classList.remove('playing');
                        });
                    });
                    this.querySelector('.play-indicator i').className = 'fas fa-pause';
                    this.classList.add('playing');
                    return;
                }
            }
            
            // Stop all other songs and reset their UI
            songs.forEach(s => {
                s.classList.remove('playing');
                s.querySelector('.play-indicator i').className = 'fas fa-play';
            });
            
            // Play new song
            this.classList.add('playing');
            this.querySelector('.play-indicator i').className = 'fas fa-pause';
            audioPlayer.src = musicSources[songId];
            currentSong = songId;
            
            audioPlayer.play().catch(() => {
                // Silent fail - just reset UI
                this.querySelector('.play-indicator i').className = 'fas fa-play';
                this.classList.remove('playing');
                currentSong = null;
            });
        });
    });
    
    audioPlayer.addEventListener('ended', function() {
        songs.forEach(song => {
            song.classList.remove('playing');
            song.querySelector('.play-indicator i').className = 'fas fa-play';
        });
        currentSong = null;
    });

    audioPlayer.addEventListener('error', function() {
        // Silent error handling
        songs.forEach(song => {
            song.classList.remove('playing');
            song.querySelector('.play-indicator i').className = 'fas fa-play';
        });
        currentSong = null;
    });
}

// Enhanced Quiz Functionality with WhatsApp Results
function initializeQuiz() {
    const quizOptions = document.querySelectorAll('.quiz-option');
    const submitQuizBtn = document.getElementById('submitQuiz');
    const quizScore = document.getElementById('quizScore');
    
    document.querySelectorAll('.quiz-question').forEach((question, index) => {
        selectedAnswers[index] = null;
    });
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            if (quizSubmitted) return;
            
            const questionIndex = Array.from(this.parentNode.parentNode.parentNode.children).indexOf(this.parentNode.parentNode);
            const questionText = this.parentNode.previousElementSibling.textContent;
            const selectedAnswer = this.textContent;
            
            this.parentNode.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            this.classList.add('selected');
            selectedAnswers[questionIndex] = {
                isCorrect: this.getAttribute('data-correct') === 'true',
                question: questionText,
                answer: selectedAnswer
            };
        });
    });
    
    submitQuizBtn.addEventListener('click', function() {
        if (quizSubmitted) return;
        
        const allAnswered = Object.values(selectedAnswers).every(answer => answer !== null);
        if (!allAnswered) {
            alert('Please answer all questions before submitting!');
            return;
        }
        
        quizSubmitted = true;
        const correctAnswers = Object.values(selectedAnswers).filter(answer => answer.isCorrect === true).length;
        const totalQuestions = Object.keys(selectedAnswers).length;
        const score = Math.round((correctAnswers / totalQuestions) * 100);
        
        // Show results in UI
        document.querySelectorAll('.quiz-option').forEach(option => {
            if (option.classList.contains('selected')) {
                if (option.getAttribute('data-correct') === 'true') {
                    option.classList.add('correct');
                } else {
                    option.classList.add('incorrect');
                }
            } else if (option.getAttribute('data-correct') === 'true') {
                option.classList.add('correct');
            }
        });
        
        let message = '';
        if (score === 100) {
            message = `🎉 Amazing ${userName}! You got ${score}%! You know me so well! 🎉`;
        } else if (score >= 70) {
            message = `👍 Great job ${userName}! You got ${score}% - you know me pretty well!`;
        } else if (score >= 50) {
            message = `😊 Not bad ${userName}! You got ${score}% - we should hang out more!`;
        } else {
            message = `🤔 ${userName}, you only got ${score}%... Do we even know each other? 😂`;
        }
        
        quizScore.textContent = message;
        quizScore.classList.remove('hidden');
        
        if (score >= 70) createConfetti();
        
        quizOptions.forEach(option => option.style.cursor = 'default');
        submitQuizBtn.innerHTML = '<i class="fas fa-check"></i> Quiz Completed!';
        submitQuizBtn.disabled = true;
        
        // Send quiz results to WhatsApp
        sendQuizResultsToWhatsApp(userName, selectedAnswers, score, totalQuestions);
    });
}

function sendQuizResultsToWhatsApp(userName, answers, score, totalQuestions) {
    // Your WhatsApp number (Nigeria format)
    const yourPhoneNumber = '2348127117278'; // 08127117278 with country code
    
    // Build the quiz results message
    let quizMessage = `🎂 BIRTHDAY QUIZ RESULTS 🎂\n\n`;
    quizMessage += `Player: ${userName}\n`;
    quizMessage += `Score: ${score}% (${Object.values(answers).filter(a => a.isCorrect).length}/${totalQuestions})\n\n`;
    quizMessage += `ANSWERS:\n`;
    
    // Add each question and answer
    Object.values(answers).forEach((answer, index) => {
        const questionNumber = index + 1;
        const status = answer.isCorrect ? '✅' : '❌';
        quizMessage += `\n${questionNumber}. ${answer.question}\n`;
        quizMessage += `   Answer: ${answer.answer} ${status}\n`;
    });
    
    quizMessage += `\n---\nSent from your birthday website! 🎉`;
    
    const encodedMessage = encodeURIComponent(quizMessage);
    const whatsappURL = `https://wa.me/${yourPhoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab after a short delay
    setTimeout(() => {
        window.open(whatsappURL, '_blank');
        
        // Show confirmation
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h2>📊 Quiz Results Sent!</h2>
                <div class="modal-body">
                    <p><strong>${userName}'s</strong> quiz results have been sent to your WhatsApp! 📲</p>
                    <p>Score: <strong>${score}%</strong></p>
                    <p><em>You'll receive a detailed breakdown of all their answers.</em></p>
                </div>
                <button class="submit-btn" onclick="this.parentElement.parentElement.remove()">Awesome! 🎂</button>
            </div>
        `;
        document.body.appendChild(modal);
    }, 1500);
}

// Message Form with WhatsApp Integration
function initializeMessageForm() {
    const messageForm = document.getElementById('messageForm');
    const messagesContainer = document.getElementById('messagesContainer');
    
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const author = document.getElementById('authorName').value;
        const message = document.getElementById('messageText').value;
        
        if (author && message) {
            // Add to local display
            const newMessage = document.createElement('div');
            newMessage.className = 'message';
            
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            newMessage.innerHTML = `
                <div class="message-author">${author}</div>
                <div class="message-text">${message}</div>
                <div class="message-time">${timeString}</div>
            `;
            
            messagesContainer.prepend(newMessage);
            
            // Clear form
            document.getElementById('authorName').value = '';
            document.getElementById('messageText').value = '';
            
            // Send to WhatsApp
            sendToWhatsApp(author, message);
            
            createConfetti();
        }
    });
}

function sendToWhatsApp(author, message) {
    // Your WhatsApp number (Nigeria format)
    const yourPhoneNumber = '2348127117278'; // 08127117278 with country code
    
    const whatsappMessage = `🎂 Birthday Message from ${author}:\n\n"${message}"\n\nSent from your birthday website! 🎉`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://wa.me/${yourPhoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');
    
    // Show confirmation
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>📱 Message Sent to WhatsApp!</h2>
            <div class="modal-body">
                <p>Your message has been sent to my WhatsApp! 📲</p>
                <p>Thanks for the birthday wish, <strong>${author}</strong>! 🎉</p>
                <p><em>If WhatsApp didn't open, make sure you have it installed on your device.</em></p>
            </div>
            <button class="submit-btn" onclick="this.parentElement.parentElement.remove()">Awesome! 🎂</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// FIXED Gallery - No lazy loading, images show immediately
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        
        // Add click to enlarge functionality
        item.addEventListener('click', function() {
            showImageModal(img.src);
        });
        
        // Handle image load
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Handle image errors - show actual image path in console
        img.addEventListener('error', function() {
            console.log('Image failed to load:', this.src);
            // Don't replace with error message, keep trying to show image
            this.style.opacity = '1'; // Still show the broken image icon
        });
    });
}

function showImageModal(src) {
    const modal = document.createElement('div');
    modal.className = 'modal image-modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content image-modal-content">
            <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <div class="image-modal-body">
                <img src="${src}" alt="Enlarged view" style="max-width: 100%; max-height: 80vh;">
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Mobile Optimizations
function initializeMobileOptimizations() {
    document.addEventListener('touchstart', function() {}, { passive: true });
    
    const interactiveElements = document.querySelectorAll('button, .quiz-option, .song');
    interactiveElements.forEach(el => {
        el.style.touchAction = 'manipulation';
    });
}