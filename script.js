
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateTime();
  setInterval(updateTime, 1000);
  fetchNews();
});

function toggleDark() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  document.getElementById("themeBtn").innerText = isDark ? "☀️" : "🌙";
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function initTheme() {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    document.getElementById("themeBtn").innerText = "☀️";
  }
}

function updateTime() {
  const el = document.getElementById("dateTime");
  if (!el) return;
  const now = new Date();
  el.innerHTML = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + " | " + now.toLocaleTimeString();
}

const infoData = [
  { title: "Quantum Computing Reaches New Milestone", description: "Researchers have demonstrated a new method...", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800", url: "#" },
  { title: "AI-Powered Fusion Energy", description: "A new deep learning model has predicted plasma stability...", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800", url: "#" },
  { title: "Bio-Digital Storage", description: "Scientists have developed a commercial-grade DNA storage system...", image: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=800", url: "#" },
  { title: "6G Networking", description: "Hit 1 Terabit Per Second in recent local field tests.", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800", url: "#" }
];

async function fetchNews() {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
  const newsApiUrl = "https://tech-a5k5.onrender.com/api/news";

  try {
    let response = await fetch(newsApiUrl);
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();
    renderInfo(data && data.length > 0 ? data : infoData);
  } catch (error) {
    console.log("Using local dummy data due to fetch error:", error);
    renderInfo(infoData);
  }
}

function renderInfo(data) {
  const container = document.getElementById("newsContainer");
  if (!container) return;
  container.innerHTML = "";
  data.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    // Fallback: If the image fails to load, simply hide the img tag but keep the text
    card.innerHTML = `
        <div style="overflow: hidden; max-height: 220px; text-align: center; background: #000;">
            <img src="${item.image}" alt="Tech" style="width: 100%; height: 220px; object-fit: cover;" onerror="this.style.display='none'">
        </div>
        <div class="card-content">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
        </div>
    `;
    container.appendChild(card);
  });
}


const LOCAL_API = "http://localhost:3000/api/feedback";
const GLOBAL_API = "https://tech-a5k5.onrender.com/api/feedback";

document.getElementById('feedbackForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  const statusMsg = document.getElementById('statusMsg');
  const submitBtn = document.getElementById('submitBtn');

  // Reset status
  statusMsg.className = 'status-msg';
  statusMsg.style.display = 'block';
  statusMsg.innerText = '';
  submitBtn.disabled = true;
  submitBtn.querySelector('span').innerText = 'Transmitting...';

  // Check if running locally or globally
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  // Point straight to Render Deployment!
  const apiUrl = isLocal ? LOCAL_API : GLOBAL_API;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message, timestamp: new Date().toISOString() })
    });

    const result = await response.json();

    if (response.ok) {
      statusMsg.innerText = `Success! Feedback synced via Render Deployment! 🛸`;
      statusMsg.classList.add('success');
      e.target.reset();
    } else {
      throw new Error(result.error || 'Server error');
    }
  } catch (error) {
    console.error('Submission error:', error);
    if (!isLocal) {
      statusMsg.innerHTML = `
        <div style="font-weight: 700; margin-bottom: 5px;">Global Transmission Pending.</div>
        <div>Please ensure your Render Web Service has the GITHUB_TOKEN and MONGO_URI environment variables set.</div>
      `;
    } else {
      statusMsg.innerText = 'Local transmission error: ' + error.message;
    }
    statusMsg.classList.add('error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector('span').innerText = 'Deploy Feedback';
  }
});

