// Updated storage.js - Session-only admin authentication

// Storage keys
const STORAGE_KEYS = {
    participants: 'changeDetectionParticipants',
    devices: 'changeDetectionDevices',
    participantDeviceMap: 'changeDetectionParticipantDeviceMap',
    deviceId: 'changeDetectionDeviceId',
    // Remove persistent admin storage keys - they'll be session-only now
    adminModeActive: 'changeDetectionAdminModeActive' // Only store admin mode active state
};

// Session-only admin authentication (not persisted across page loads)
let sessionAdminAuthenticated = false;

// Participation tracking functions
function checkPreviousParticipation(participantId) {
    if (!window.ExperimentUtils.isLocalStorageAvailable()) {
        console.warn('Local storage not available - cannot check previous participation');
        return false;
    }
    
    const previousParticipantIds = JSON.parse(localStorage.getItem(STORAGE_KEYS.participants) || '[]');
    const previousDeviceIds = JSON.parse(localStorage.getItem(STORAGE_KEYS.devices) || '[]');
    const participantToDeviceMap = JSON.parse(localStorage.getItem(STORAGE_KEYS.participantDeviceMap) || '{}');
    
    const deviceId = window.ExperimentConfig.deviceId;
    const participantExists = previousParticipantIds.includes(participantId);
    const deviceExists = previousDeviceIds.includes(deviceId);
    const previousDeviceId = participantToDeviceMap[participantId];
    const sameIdDifferentDevice = previousDeviceId && previousDeviceId !== deviceId;
    
    console.log(`Checking previous participation - Participant: ${participantExists ? 'EXISTS' : 'new'}, Device: ${deviceExists ? 'EXISTS' : 'new'}, Same ID different device: ${sameIdDifferentDevice ? 'YES' : 'no'}`);
    
    // Update state
    window.ExperimentConfig.state.sameIdDifferentDevice = sameIdDifferentDevice;
    
    return participantExists || deviceExists;
}

function recordParticipation(participantId) {
    if (!window.ExperimentUtils.isLocalStorageAvailable()) {
        console.warn('Local storage not available - cannot record participation');
        return;
    }
    
    const deviceId = window.ExperimentConfig.deviceId;
    const previousDeviceIds = JSON.parse(localStorage.getItem(STORAGE_KEYS.devices) || '[]');
    
    // Record device
    if (!previousDeviceIds.includes(deviceId)) {
        previousDeviceIds.push(deviceId);
        localStorage.setItem(STORAGE_KEYS.devices, JSON.stringify(previousDeviceIds));
    }
    
    // Record participant if provided
    if (participantId) {
        const previousParticipantIds = JSON.parse(localStorage.getItem(STORAGE_KEYS.participants) || '[]');
        const participantToDeviceMap = JSON.parse(localStorage.getItem(STORAGE_KEYS.participantDeviceMap) || '{}');
        
        if (!previousParticipantIds.includes(participantId)) {
            previousParticipantIds.push(participantId);
            localStorage.setItem(STORAGE_KEYS.participants, JSON.stringify(previousParticipantIds));
        }
        
        participantToDeviceMap[participantId] = deviceId;
        localStorage.setItem(STORAGE_KEYS.participantDeviceMap, JSON.stringify(participantToDeviceMap));
        
        console.log('Recorded participation for participant ID: ' + participantId + ' and device ID: ' + deviceId);
    } else {
        console.log('Recorded participation for device ID: ' + deviceId);
    }
}

// Device ID management
function getStoredDeviceId() {
    if (!window.ExperimentUtils.isLocalStorageAvailable()) {
        return null;
    }
    return localStorage.getItem(STORAGE_KEYS.deviceId);
}

function setStoredDeviceId(deviceId) {
    if (!window.ExperimentUtils.isLocalStorageAvailable()) {
        console.warn('Local storage not available - cannot store device ID');
        return false;
    }
    localStorage.setItem(STORAGE_KEYS.deviceId, deviceId);
    return true;
}

// Session-only admin state management
function getStoredAdminState() {
    if (!window.ExperimentUtils.isLocalStorageAvailable()) {
        return { authenticated: false, active: false };
    }
    
    // Admin authentication is now session-only (never persisted)
    const authenticated = sessionAdminAuthenticated;
    
    // Admin mode active state can still be persisted (but requires re-authentication)
    const active = localStorage.getItem(STORAGE_KEYS.adminModeActive) === 'true';
    
    return { authenticated, active };
}

function setStoredAdminState(authenticated, active) {
    // Admin authentication is session-only
    if (typeof authenticated === 'boolean') {
        sessionAdminAuthenticated = authenticated;
        console.log('Session admin authentication set to:', authenticated);
    }
    
    // Admin mode active state can be persisted
    if (typeof active === 'boolean' && window.ExperimentUtils.isLocalStorageAvailable()) {
        localStorage.setItem(STORAGE_KEYS.adminModeActive, active.toString());
        console.log('Admin mode active state persisted:', active);
    }
    
    return true;
}

// Clear admin session (called on page unload)
function clearAdminSession() {
    sessionAdminAuthenticated = false;
    console.log('Admin session cleared');
}

// Clear functions
function clearParticipantData() {
    if (!window.ExperimentUtils.isLocalStorageAvailable()) {
        console.warn('Local storage not available - cannot clear participant data');
        return false;
    }
    
    localStorage.removeItem(STORAGE_KEYS.participants);
    localStorage.removeItem(STORAGE_KEYS.devices);
    localStorage.removeItem(STORAGE_KEYS.participantDeviceMap);
    
    console.log('Cleared all participant and device data from local storage');
    return true;
}

function clearAdminData() {
    if (!window.ExperimentUtils.isLocalStorageAvailable()) {
        console.warn('Local storage not available - cannot clear admin data');
        return false;
    }
    
    // Clear session admin auth
    sessionAdminAuthenticated = false;
    
    // Clear persisted admin mode state
    localStorage.removeItem(STORAGE_KEYS.adminModeActive);
    
    console.log('Cleared admin data from both session and local storage');
    return true;
}

function clearAllStorageData() {
    if (!window.ExperimentUtils.isLocalStorageAvailable()) {
        console.warn('Local storage not available - cannot clear storage data');
        return false;
    }
    
    // Clear session admin auth
    sessionAdminAuthenticated = false;
    
    // Clear all experiment-related data
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
    
    console.log('Cleared all experiment data from local storage and session');
    return true;
}

// Get all stored data (for debugging/admin purposes)
function getAllStoredData() {
    if (!window.ExperimentUtils.isLocalStorageAvailable()) {
        return null;
    }
    
    const data = {};
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
        const value = localStorage.getItem(key);
        data[name] = value ? (value.startsWith('[') || value.startsWith('{') ? JSON.parse(value) : value) : null;
    });
    
    // Add session admin auth status
    data.sessionAdminAuthenticated = sessionAdminAuthenticated;
    
    return data;
}

// Storage statistics
function getStorageStatistics() {
    if (!window.ExperimentUtils.isLocalStorageAvailable()) {
        return null;
    }
    
    const participants = JSON.parse(localStorage.getItem(STORAGE_KEYS.participants) || '[]');
    const devices = JSON.parse(localStorage.getItem(STORAGE_KEYS.devices) || '[]');
    const participantDeviceMap = JSON.parse(localStorage.getItem(STORAGE_KEYS.participantDeviceMap) || '{}');
    
    return {
        totalParticipants: participants.length,
        totalDevices: devices.length,
        totalMappings: Object.keys(participantDeviceMap).length,
        isAdminAuthenticated: sessionAdminAuthenticated, // Session-only
        isAdminModeActive: localStorage.getItem(STORAGE_KEYS.adminModeActive) === 'true'
    };
}

// Validation functions
function validateParticipantId(participantId) {
    // Check if participant ID is exactly 9 characters
    if (!participantId || typeof participantId !== 'string') {
        return { valid: false, reason: 'Participant ID must be a string' };
    }
    
    if (participantId.length !== 9) {
        return { valid: false, reason: 'Participant ID must be exactly 9 characters long' };
    }
    
    return { valid: true };
}

// Import/Export functions for admin use
function exportStorageData() {
    const data = getAllStoredData();
    if (!data) return null;
    
    const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        data: data
    };
    
    return JSON.stringify(exportData, null, 2);
}

function importStorageData(jsonString) {
    if (!window.ExperimentUtils.isLocalStorageAvailable()) {
        return { success: false, error: 'Local storage not available' };
    }
    
    try {
        const importData = JSON.parse(jsonString);
        
        if (!importData.data) {
            return { success: false, error: 'Invalid import format' };
        }
        
        // Clear existing data (except session auth)
        clearAllStorageData();
        
        // Import new data (session auth remains cleared)
        Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
            const value = importData.data[name];
            if (value !== null && value !== undefined) {
                const stringValue = typeof value === 'object' ? JSON.stringify(value) : value.toString();
                localStorage.setItem(key, stringValue);
            }
        });
        
        return { success: true, importedAt: new Date().toISOString() };
    } catch (error) {
        return { success: false, error: 'Failed to parse import data: ' + error.message };
    }
}

// Setup page unload handlers to clear admin session
function setupAdminSessionClearing() {
    // Clear admin session on page unload
    window.addEventListener('beforeunload', clearAdminSession);
    window.addEventListener('unload', clearAdminSession);
    
    // Also clear on page visibility change (when tab becomes hidden)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearAdminSession();
        }
    });
    
    console.log('Admin session clearing handlers setup complete');
}

// Export all storage functions
window.ExperimentStorage = {
    STORAGE_KEYS,
    checkPreviousParticipation,
    recordParticipation,
    getStoredDeviceId,
    setStoredDeviceId,
    getStoredAdminState,
    setStoredAdminState,
    clearAdminSession,
    clearParticipantData,
    clearAdminData,
    clearAllStorageData,
    getAllStoredData,
    getStorageStatistics,
    validateParticipantId,
    exportStorageData,
    importStorageData,
    setupAdminSessionClearing
};