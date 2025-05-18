// Updated storage.js - Removed all participant tracking functionality

// Storage keys - simplified to only track admin state
const STORAGE_KEYS = {
    deviceId: 'changeDetectionDeviceId',
    adminModeActive: 'changeDetectionAdminModeActive' // Only store admin mode active state
};

// Session-only admin authentication (not persisted across page loads)
let sessionAdminAuthenticated = false;

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
    
    return {
        isAdminAuthenticated: sessionAdminAuthenticated, // Session-only
        isAdminModeActive: localStorage.getItem(STORAGE_KEYS.adminModeActive) === 'true'
    };
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

// Export storage functions (removed all participant-related functions)
window.ExperimentStorage = {
    STORAGE_KEYS,
    getStoredDeviceId,
    setStoredDeviceId,
    getStoredAdminState,
    setStoredAdminState,
    clearAdminSession,
    clearAdminData,
    clearAllStorageData,
    getAllStoredData,
    getStorageStatistics,
    exportStorageData,
    importStorageData,
    setupAdminSessionClearing
};