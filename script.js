// Mock Data for OpenGradient Models
const modelsData = [
    {
        id: "m1",
        name: "Llama-3-8B-Instruct",
        type: "llm",
        typeLabel: "LLM",
        author: "Meta & OpenGradient",
        architecture: "Transformer",
        inferences: "142,593",
        cost: "0.005 $OG",
        node: "TEE Enclave (Sprinter)",
        description: "Optimized 8B parameter instruct model running secure inference."
    },
    {
        id: "m2",
        name: "Stable Diffusion XL",
        type: "vision",
        typeLabel: "Vision",
        author: "StabilityAI",
        architecture: "Diffusion",
        inferences: "89,012",
        cost: "0.012 $OG",
        node: "Local Worker",
        description: "High-resolution image generation model verified on-chain."
    },
    {
        id: "m3",
        name: "Whisper-v3-Large",
        type: "audio",
        typeLabel: "Audio",
        author: "OpenAI port",
        architecture: "Transformer",
        inferences: "45,821",
        cost: "0.008 $OG",
        node: "TEE Enclave",
        description: "Robust multilingual speech recognition model."
    },
    {
        id: "m4",
        name: "Defi-Yield-Predictor",
        type: "predictive",
        typeLabel: "Predictive",
        author: "0xQuantLabs",
        architecture: "XGBoost",
        inferences: "215,904",
        cost: "0.001 $OG",
        node: "On-Chain Smart Cont.",
        description: "Predicts optimal yield farming routes using SolidML library."
    },
    {
        id: "m5",
        name: "Mistral-7B-Vision",
        type: "llm",
        typeLabel: "LLM/Vision",
        author: "Mistral",
        architecture: "Transformer",
        inferences: "62,109",
        cost: "0.006 $OG",
        node: "Sprinter Node",
        description: "Multimodal LLM optimized for fast decentralized inference."
    },
    {
        id: "m6",
        name: "Voice-Clone-XT",
        type: "audio",
        typeLabel: "Audio",
        author: "AIAudioHub",
        architecture: "VITS",
        inferences: "12,450",
        cost: "0.015 $OG",
        node: "Sprinter Node",
        description: "High-fidelity zero-shot voice cloning model."
    }
];

// DOM Elements
const modelsGrid = document.getElementById('modelsGrid');
const filterItems = document.querySelectorAll('.filter-list li');
const searchInput = document.getElementById('searchInput');

// Modal Elements
const inferenceModal = document.getElementById('inferenceModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const runInferenceBtn = document.getElementById('runInferenceBtn');
const promptInput = document.getElementById('promptInput');
const resultBox = document.getElementById('resultBox');
const resultContent = document.getElementById('resultContent');
const loadingState = document.getElementById('loadingState');
const proofHash = document.getElementById('proofHash');
const connectWalletBtn = document.getElementById('connectWalletBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');

let currentActiveModel = null;

// Initialize
function init() {
    renderModels(modelsData);
    setupEventListeners();
    initTypewriter();
}

// Render Models
function renderModels(models) {
    modelsGrid.innerHTML = '';

    if (models.length === 0) {
        modelsGrid.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center; padding: 3rem;">No models found matching your criteria.</p>';
        return;
    }

    models.forEach(model => {
        const card = document.createElement('div');
        card.className = 'model-card';
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <h3 class="card-title">${model.name}</h3>
                    <span class="card-author">by ${model.author}</span>
                </div>
                <span class="model-type type-${model.type}">${model.typeLabel}</span>
            </div>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem; flex-grow: 1;">${model.description}</p>
            <div class="card-stats">
                <div class="stat">
                    <span class="stat-label">Cost</span>
                    <span class="stat-value">${model.cost}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Calls</span>
                    <span class="stat-value">${model.inferences}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="run-btn" onclick="openModal('${model.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    Run Inference
                </button>
            </div>
        `;
        modelsGrid.appendChild(card);
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Filter click
    filterItems.forEach(item => {
        item.addEventListener('click', (e) => {
            filterItems.forEach(li => li.classList.remove('active'));
            e.target.classList.add('active');

            const filterValue = e.target.getAttribute('data-filter');
            filterModels(filterValue, searchInput.value);
        });
    });

    // Search input
    searchInput.addEventListener('input', (e) => {
        const activeFilter = document.querySelector('.filter-list li.active').getAttribute('data-filter');
        filterModels(activeFilter, e.target.value);
    });

    // Navigation Tabs
    const navLinks = document.querySelectorAll('.nav-links a');
    const pageSections = document.querySelectorAll('.page-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Switch page logic
            const targetId = link.getAttribute('data-target');
            pageSections.forEach(section => {
                if (section.id === targetId) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });

    // Modal Close
    closeModalBtn.addEventListener('click', () => {
        inferenceModal.classList.remove('active');
    });

    // Close on outside click
    inferenceModal.addEventListener('click', (e) => {
        if (e.target === inferenceModal) {
            inferenceModal.classList.remove('active');
        }
    });

    // Connect Wallet (Mock)
    connectWalletBtn.addEventListener('click', () => {
        connectWalletBtn.textContent = 'Connecting...';
        setTimeout(() => {
            connectWalletBtn.textContent = '0xA31...9F0b';
            connectWalletBtn.style.background = 'rgba(58, 123, 213, 0.2)';
            connectWalletBtn.style.borderColor = 'var(--accent-blue)';
            connectWalletBtn.style.boxShadow = 'var(--accent-glow)';
        }, 1200);
    });

    // Run Inference Submisson
    runInferenceBtn.addEventListener('click', handleRunInference);

    // Theme Toggle
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('light-mode');
            const isLight = document.documentElement.classList.contains('light-mode');
            localStorage.setItem('openhive-theme', isLight ? 'light' : 'dark');
            updateThemeIcon();
        });

        // Initialize theme
        const savedTheme = localStorage.getItem('openhive-theme');
        if (savedTheme === 'light') {
            document.documentElement.classList.add('light-mode');
        } else if (savedTheme !== 'dark' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            document.documentElement.classList.add('light-mode');
        }
        updateThemeIcon();
    }
}

function updateThemeIcon() {
    if (!themeToggleBtn) return;
    const isLight = document.documentElement.classList.contains('light-mode');
    if (isLight) {
        themeToggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    } else {
        themeToggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
    }
}

// Filter logic
function filterModels(type, searchQuery) {
    const query = searchQuery.toLowerCase();

    const filtered = modelsData.filter(model => {
        const matchesType = type === 'all' || model.type === type;
        const matchesSearch = model.name.toLowerCase().includes(query) ||
            model.description.toLowerCase().includes(query) ||
            model.author.toLowerCase().includes(query);
        return matchesType && matchesSearch;
    });

    renderModels(filtered);
}

// Open Modal & Populate Data
window.openModal = function (modelId) {
    const model = modelsData.find(m => m.id === modelId);
    if (!model) return;

    currentActiveModel = model;

    // Reset UI state
    promptInput.value = '';
    resultBox.style.display = 'none';
    loadingState.style.display = 'none';
    runInferenceBtn.disabled = false;
    runInferenceBtn.style.opacity = '1';

    // Populate metadata
    document.getElementById('modalModelName').textContent = model.name;
    document.getElementById('modalModelAuthor').textContent = `by ${model.author}`;

    const typeBadge = document.getElementById('modalModelType');
    typeBadge.textContent = model.typeLabel;
    typeBadge.className = `badge model-type type-${model.type}`;

    document.getElementById('modalArchitecture').textContent = model.architecture;
    document.getElementById('modalInferences').textContent = model.inferences;
    document.getElementById('modalCost').textContent = model.cost;
    document.getElementById('modalNode').textContent = model.node;

    // Show modal
    inferenceModal.classList.add('active');
};

// Handle Inference Execution (Mocking OpenGradient Node Process)
function handleRunInference() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        alert("Please enter a prompt or input data.");
        return;
    }

    // Update UI for loading state
    runInferenceBtn.disabled = true;
    runInferenceBtn.style.opacity = '0.5';
    resultBox.style.display = 'none';
    loadingState.style.display = 'flex';

    // Simulate Network Delay & Proof Generation (2.5 seconds)
    setTimeout(() => {
        loadingState.style.display = 'none';

        // Generate mock response based on model category
        resultContent.textContent = generateMockResponse(currentActiveModel.type, prompt);

        // Generate mock proof hash
        const mockHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        proofHash.textContent = mockHash;

        // Show result
        resultBox.style.display = 'block';
        runInferenceBtn.disabled = false;
        runInferenceBtn.style.opacity = '1';
    }, 2500);
}

// Generate Contextual Mock Response
function generateMockResponse(type, prompt) {
    const defaultResponses = {
        llm: `Based on your prompt on OpenGradient:\n\n"Decentralized AI offers a trustless paradigm where execution is verifiable on-chain via cryptographic proofs. This ensures that the output is authentically derived from the stated parameters without tampering."`,
        vision: `[Image Data Successfully Generated]\nShape: (1024, 1024, 3)\nFormat: PNG representation saved off-chain via Walrus integration.\nView at proxy link: https://storage.opengradient.network/v/${Math.floor(Math.random() * 999999)}`,
        audio: `[Audio Stream Generated]\nDuration: 4.2 seconds\nSample Rate: 24kHz\nAvailable at: IPFS://Qm...${Math.random().toString(36).substring(7)}\nStatus: Ready for streaming.`,
        predictive: `Analysis Complete.\n\nOptimal Yield Route:\n1. Provide liquidity to Curve stETH pool (Est. APY 6.5%)\n2. Stake LP tokens in Convex (Boosted to 12%)\n3. Risk Score: 8.4/10\n\n(Computed deterministically via SolidML)`
    };

    return defaultResponses[type] || "Execution completed successfully. (Mock data)";
}

// Typewriter Effect
function initTypewriter() {
    const text = "The Decentralized AI Ecosystem";
    const titleElement = document.getElementById('heroTitle');
    if (!titleElement) return;

    let i = 0;
    let isDeleting = false;

    function typeWriter() {
        titleElement.textContent = text.substring(0, i);

        let typeSpeed = Math.random() * 60 + 40;

        if (!isDeleting && i < text.length) {
            i++;
        } else if (isDeleting && i > 0) {
            i--;
            typeSpeed = Math.random() * 30 + 20; // Delete faster
        } else if (!isDeleting && i === text.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at the end before deleting
        } else if (isDeleting && i === 0) {
            isDeleting = false;
            typeSpeed = 800; // Pause before typing starts again
        }

        setTimeout(typeWriter, typeSpeed);
    }

    // Give it a brief pause before starting (looks more natural on page load)
    setTimeout(typeWriter, 400);
}

// Boot application
document.addEventListener('DOMContentLoaded', init);
