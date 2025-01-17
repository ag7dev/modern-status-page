let systems = [];  

function typeWriter(text, elementId, speed = 50) {
    let i = 0;
    const element = document.getElementById(elementId);
    element.innerHTML = ''; 
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

function createSystemCard(system, index) {
    const card = document.createElement('div');
    card.className = 'system-card fade-in';
    card.style.animationDelay = `${index * 100}ms`;
    
    
    const icon = system.icon || '📡'; 
    
    card.innerHTML = `
        <h3><span class="icon">${icon}</span> ${system.name}</h3>
        <div class="status-indicator">
            <span class="status-dot ${system.status}"></span>
            <span class="status-text">${system.status}</span>
        </div>
    `;
    return card;
}

function updateSystemStatus(index, newStatus) {
    systems[index].status = newStatus;
    const card = document.querySelectorAll('.system-card')[index];
    const dot = card.querySelector('.status-dot');
    const text = card.querySelector('.status-text');
    
    dot.className = `status-dot ${newStatus}`;
    text.textContent = newStatus;

    card.style.animation = 'none';
    card.offsetHeight; 
    card.style.animation = null;
}

function updateOverallStatus() {
    const allOperational = systems.every(sys => sys.status === 'operational');
    const message = allOperational
        ? "All systems are operational. Monitoring for any changes....."
        : "Some systems are experiencing issues. Our team is working on it.";
    typeWriter(message, 'status-message');

    const alarmBanner = document.getElementById('alarm-banner');
    if (allOperational) {
        alarmBanner.classList.add('hidden');
    } else {
        alarmBanner.classList.remove('hidden');
    }
}
async function fetchSystemStatus() {
    try {
        const response = await fetch('get_status.php');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        systems = data;
        renderSystems();
        updateOverallStatus();
    } catch (error) {
        console.error('Fehler beim Abrufen der Systemstatus:', error);
    }
}

function renderSystems() {
    const systemsGrid = document.getElementById('systems-grid');
    systemsGrid.innerHTML = ''; 
    systems.forEach((system, index) => {
        const card = createSystemCard(system, index);
        systemsGrid.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchSystemStatus();

});
