// Updated utils.js - Removed participant ID validation and related functions

// Utility functions for the experiment

// Random number and array utilities
function getRandomIndices(max, count) {
    const indices = [];
    const available = Array.from({ length: max }, (_, i) => i);
    
    // Fisher-Yates shuffle
    for (let i = available.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [available[i], available[j]] = [available[j], available[i]];
    }
    
    return available.slice(0, count);
}

// Color randomization utilities
function randomizeColors() {
    const availableColors = [...window.ExperimentConfig.stimuliColors];
    const config = window.ExperimentConfig.config;
    const state = window.ExperimentConfig.state;
    
    // Shuffle colors
    for (let i = availableColors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableColors[i], availableColors[j]] = [availableColors[j], availableColors[i]];
    }
    
    // Assign unique colors to each stimulus
    state.stimuliColorIndices = [];
    for (let i = 0; i < config.numStimuli; i++) {
        state.stimuliColorIndices.push(i % availableColors.length);
    }
    
    // Log color assignment if logger is available
    if (window.ExperimentLogger) {
        window.ExperimentLogger.logTrial(
            `Assigned colors for trial: ${state.stimuliColorIndices.map(i => availableColors[i]).join(', ')}`,
            'Colors assigned for trial'
        );
    }
}

// Device ID generation and management
function getDeviceId() {
    if (window.ExperimentStorage && window.ExperimentStorage.getStoredDeviceId) {
        let storedDeviceId = window.ExperimentStorage.getStoredDeviceId();
        
        if (!storedDeviceId) {
            // Generate new device ID using browser info
            let newId = '';
            newId += navigator.userAgent || '';
            newId += screen.width || '';
            newId += screen.height || '';
            newId += navigator.language || '';
            newId += new Date().getTimezoneOffset() || '';
            
            // Hash the collected info
            storedDeviceId = hashString(newId);
            if (window.ExperimentStorage.setStoredDeviceId) {
                window.ExperimentStorage.setStoredDeviceId(storedDeviceId);
            }
            console.log('Generated new device ID: ' + storedDeviceId);
        } else {
            console.log('Retrieved existing device ID: ' + storedDeviceId);
        }
        
        return storedDeviceId;
    }
    
    // Fallback if storage system is not available
    const deviceInfo = navigator.userAgent + screen.width + screen.height;
    return hashString(deviceInfo);
}

// Completion code generation - simplified without participant ID
function generateCompletionCode() {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    
    // Add 4 deterministic characters based on device ID
    const deviceId = window.ExperimentConfig.deviceId;
    const hash = hashString(deviceId);
    for (let i = 0; i < 4; i++) {
        const index = Math.abs(parseInt(hash.charAt(i), 16)) % characters.length;
        code += characters.charAt(index);
    }
    
    // Add 4 random characters
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    
    // Log code generation if logger is available
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('Generated completion code: ' + code);
    }
    
    return code;
}

// String hashing utility
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
}

// Device type checking utilities
function isMobileDevice() {
    return window.ExperimentConfig.isMobile;
}

// Local storage availability check
function isLocalStorageAvailable() {
    try {
        return typeof(Storage) !== "undefined";
    } catch (e) {
        return false;
    }
}

// Text formatting utilities
function formatResponseTime(timeInSeconds) {
    return timeInSeconds.toFixed(2);
}

function formatAccuracy(correct, total) {
    if (total === 0) return '0';
    return (correct / total * 100).toFixed(1);
}

// Copy to clipboard utility
function copyToClipboard(text) {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    tempTextArea.setSelectionRange(0, 99999);
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
    
    // Log copy action if logger is available
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('Copied to clipboard: ' + text);
    }
    
    return true;
}

// URL validation and opening
function openUrl(url) {
    try {
        window.open(url, '_blank');
        return true;
    } catch (error) {
        console.error('Failed to open URL:', error);
        return false;
    }
}

// DOM element utilities
function getElementById(id) {
    return document.getElementById(id);
}

function setElementDisplay(id, display) {
    const element = getElementById(id);
    if (element) {
        element.style.display = display;
    }
}

function setElementText(id, text) {
    const element = getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

function setElementHTML(id, html) {
    const element = getElementById(id);
    if (element) {
        element.innerHTML = html;
    }
}

function enableElement(id) {
    const element = getElementById(id);
    if (element) {
        element.disabled = false;
    }
}

function disableElement(id) {
    const element = getElementById(id);
    if (element) {
        element.disabled = true;
    }
}

// Array utilities
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Distance calculation utility
function calculateDistance(pos1, pos2) {
    return Math.sqrt(
        Math.pow(pos2.x - pos1.x, 2) + 
        Math.pow(pos2.y - pos1.y, 2)
    );
}

// Position validation utility
function isValidPosition(x, y, areaWidth, areaHeight, stimulusSize) {
    const config = window.ExperimentConfig.config;
    return x >= 0 && 
           y >= 0 && 
           x <= (areaWidth * config.maxPos - stimulusSize) && 
           y <= (areaHeight * config.maxPos - stimulusSize);
}

// Random position generation
function generateRandomPosition(areaWidth, areaHeight, stimulusSize) {
    const config = window.ExperimentConfig.config;
    const x = Math.random() * config.maxPos * (areaWidth - stimulusSize);
    const y = Math.random() * config.maxPos * (areaHeight - stimulusSize);
    return { x, y };
}

// Export all utility functions (removed participant ID validation)
window.ExperimentUtils = {
    getRandomIndices,
    randomizeColors,
    getDeviceId,
    generateCompletionCode,
    hashString,
    isMobileDevice,
    isLocalStorageAvailable,
    formatResponseTime,
    formatAccuracy,
    copyToClipboard,
    openUrl,
    getElementById,
    setElementDisplay,
    setElementText,
    setElementHTML,
    enableElement,
    disableElement,
    shuffleArray,
    calculateDistance,
    isValidPosition,
    generateRandomPosition
};