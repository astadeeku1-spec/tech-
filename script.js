/* Initialization */
    document.addEventListener('DOMContentLoaded', () => {
      initTheme();
      updateTime();
      setInterval(updateTime, 1000);

      // Fetch news from backend
      fetchNews();

      // Handle Splash Screen
      setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
          splash.classList.add('fade-out');
        }
      }, 2000);
    });

    /* Dark Mode */
    function toggleDark() {
      document.body.classList.toggle("dark");
      const btn = document.getElementById("themeBtn");
      const isDark = document.body.classList.contains("dark");
      btn.innerText = isDark ? "☀️" : "🌙";
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    function initTheme() {
      if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        document.getElementById("themeBtn").innerText = "☀️";
      }
    }

    /* Live Time */
    function updateTime() {
      const el = document.getElementById("dateTime");
      if (!el) return;
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      el.innerHTML = now.toLocaleDateString(undefined, options) + " | " + now.toLocaleTimeString();
    }

    /* Information Data */
    const infoData = [
      {
        title: "Quantum Computing Reaches New Milestone in Error Correction",
        description: "Researchers have demonstrated a new method for quantum error correction that could pave the way for stable, large-scale quantum computers.",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
        url: "https://www.nature.com/articles/s41586-022-05434-1"
      },
      {
        title: "AI-Powered Fusion Energy Breakout",
        description: "A new deep learning model has successfully predicted and prevented plasma instabilities in a fusion reactor, extending stable runtimes by 300%.",
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80",
        url: "https://www.technologyreview.com/2024/02/21/1088657/ai-nuclear-fusion-plasma-instabilities/"
      },
      {
        title: "Bio-Digital Storage: DNA Hard Drives",
        description: "Scientists have developed a commercial-grade DNA storage system capable of holding 1 petabyte of data in a space the size of a sugar cube.",
        image: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&w=800&q=80",
        url: "https://www.scientificamerican.com/article/dna-data-storage-is-closer-than-you-think/"
      },
      {
        title: "6G Networking Hits 1 Terabit Per Second",
        description: "Early 6G prototypes have shattered world records, achieving wireless speeds that allow downloading 100 4K movies in a single second.",
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
        url: "https://www.techradar.com/news/6g-everything-you-need-to-know"
      },
      {
        title: "Solid-State Batteries Enter Mass Production",
        description: "The first generation of solid-state EV batteries has rolled off the line, promising 1,000km range and 10-minute charging cycles.",
        image: "https://images.unsplash.com/photo-1593941707882-a5bba1491017?auto=format&fit=crop&w=800&q=80",
        url: "https://www.bloomberg.com/news/articles/2024-01-04/toyota-solid-state-battery-breakthrough-could-rev-up-evs"
      },
      {
        title: "Neuralink 2.0: Telepathic Interface",
        description: "The next iteration of brain-computer interfaces now allows users to type up to 150 words per minute using thought alone with 99.9% precision.",
        image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80",
        url: "https://neuralink.com/"
      },
      {
        title: "Autonomous Air Taxis Approved for NYC",
        description: "Regulators have granted the first commercial license for pilotless VTOL aircraft to operate a shuttle service between JFK and Manhattan.",
        image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800&q=80",
        url: "https://www.theverge.com/2023/11/13/23958983/joby-aviation-electric-air-taxi-nyc-test-flight"
      },
      {
        title: "Generative AI Designs New Antibiotics",
        description: "In a medical first, an AI-designed compound has entered clinical trials for a drug-resistant bacteria that previously had no known cure.",
        image: "https://images.unsplash.com/photo-1532187863486-abf91ad1b162?auto=format&fit=crop&w=800&q=80",
        url: "https://www.bbc.com/news/health-65709834"
      },
      {
        title: "Self-Healing Smart Materials for Infrastructure",
        description: "Concrete infused with specialized bacteria that secretes limestone is being used to build bridge supports that automatically repair cracks.",
        image: "https://images.unsplash.com/photo-1590066074590-6f29fb499c89?auto=format&fit=crop&w=800&q=80",
        url: "https://www.sciencedaily.com/releases/2023/06/230628135832.htm"
      },
      {
        title: "Holographic Workspace Becomes Mainstream",
        description: "Light-field displays are replacing traditional monitors in enterprise environments, offering full 3D collaborative spaces without bulky glasses.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        url: "https://www.wired.com/story/holograms-are-the-future-of-the-office/"
      },
      {
        title: "Space-Based Solar Power Test Successful",
        description: "A satellite constellation has successfully beamed 50kW of power to a terrestrial rectenna, proving the viability of clean 24/7 space solar energy.",
        image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80",
        url: "https://www.space.com/space-solar-power-satellite-beams-energy-earth-first-time"
      }
    ];

    async function fetchNews() {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const newsApiUrl = isLocal ? "http://localhost:3000/api/news" : "https://tech-a5k5.onrender.com/api/news";

      try {
        let response = await fetch(newsApiUrl);

        // If API fails, fallback to the static file
        if (!response.ok) throw new Error('Local server offline');

        const data = await response.json();
        renderInfo(data && data.length > 0 ? data : infoData);
      } catch (error) {
        console.log("Global mode: Fetching static news.json");
        try {
          const response = await fetch("news.json");
          const data = await response.json();
          renderInfo(data);
        } catch (staterr) {
          renderInfo(infoData);
        }
      }
    }

    function renderInfo(data = infoData) {
      const container = document.getElementById("newsContainer");
      if (!container) return;

      container.innerHTML = "";

      data.forEach((item, index) => {
        if (!item.image || item.image.trim() === "") return; // Skip if no data

        const card = document.createElement('div');
        card.className = 'card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div style="overflow: hidden;">
                <img src="${item.image}" alt="Tech Image" onerror="this.closest('.card').remove()">
            </div>
            <div class="card-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `;
        container.appendChild(card);
      });
    }

    /* Feedback Handling Configuration */
    const LOCAL_API = "http://localhost:3000/api/feedback";
    const GLOBAL_API = "https://tech-a5k5.onrender.com/api/feedback";


    const feedbackForm = document.getElementById('feedbackForm');
    const statusMsg = document.getElementById('statusMsg');
    const submitBtn = document.getElementById('submitBtn');

    feedbackForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      // Reset status
      statusMsg.className = 'status-msg';
      statusMsg.innerText = '';
      submitBtn.disabled = true;
      submitBtn.querySelector('span').innerText = 'Transmitting...';

      // Check if running on localhost or global site
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = isLocal ? LOCAL_API : GLOBAL_API;

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message, timestamp: new Date().toISOString() })
        });

        const result = await response.json();

        if (response.ok) {
          statusMsg.innerText = `Success! Feedback synced to your GitHub Repository! 🛸`;
          statusMsg.classList.add('success');
          feedbackForm.reset();
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
