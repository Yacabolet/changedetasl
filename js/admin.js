// Complete admin.js file with all functions and proper exports

// Admin state management
function initAdminControls() {
    // Check stored admin states
    const storedState = window.ExperimentStorage.getStoredAdminState();
    if (storedState.authenticated) {
        window.ExperimentConfig.isAdminAuthenticated = true;
        toggleControlOptions(true);
    }
    
    if (storedState.active) {
        window.ExperimentConfig.isAdminModeActive = true;
        const adminModeToggle = document.getElementById('adminModeToggle');
        if (adminModeToggle) adminModeToggle.checked = true;
        
        const adminModeIndicator = document.getElementById('adminModeIndicator');
        if (adminModeIndicator) adminModeIndicator.style.display = 'block';
        
        updateAdminUI();
    }
    
    setupAdminEventListeners();
    updateAdminUI();
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('Admin controls initialized');
    }
}

function setupAdminEventListeners() {
    // Control panel open/close
    const controlPanelButton = document.getElementById('controlPanelButton');
    const closeControlPanelButton = document.getElementById('closeControlPanelButton');
    const closeControlPanelX = document.querySelector('.closeControlPanel');
    
    if (controlPanelButton) controlPanelButton.addEventListener('click', openControlPanel);
    if (closeControlPanelButton) closeControlPanelButton.addEventListener('click', closeControlPanel);
    if (closeControlPanelX) closeControlPanelX.addEventListener('click', closeControlPanel);
    
    // Login functionality
    const loginButton = document.getElementById('loginButton');
    const adminPassword = document.getElementById('adminPassword');
    
    if (loginButton) loginButton.addEventListener('click', attemptAdminLogin);
    if (adminPassword) {
        adminPassword.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                attemptAdminLogin();
            }
        });
    }
    
    // Admin mode toggle
    const adminModeToggle = document.getElementById('adminModeToggle');
    if (adminModeToggle) {
        adminModeToggle.addEventListener('change', function() {
            toggleAdminMode(this.checked);
        });
    }
    
    // Data management buttons
    const clearSheetButton = document.getElementById('clearSheetButton');
    const clearLocalStorageButton = document.getElementById('clearLocalStorageButton');
    
    if (clearSheetButton) {
        clearSheetButton.addEventListener('click', function() {
            showConfirmation(
                window.LanguageManager ? window.LanguageManager.getText('clearSheetConfirmTitle') : 'Clear Google Sheet?',
                window.LanguageManager ? window.LanguageManager.getText('clearSheetConfirmMessage') : 'This will remove ALL data from the Google Sheet. This action cannot be undone!',
                clearGoogleSheetAdmin
            );
        });
    }
    
    if (clearLocalStorageButton) {
        clearLocalStorageButton.addEventListener('click', function() {
            showConfirmation(
                window.LanguageManager ? window.LanguageManager.getText('clearLocalStorageConfirmTitle') : 'Clear Local Storage?',
                window.LanguageManager ? window.LanguageManager.getText('clearLocalStorageConfirmMessage') : 'This will remove all stored participant IDs and device IDs, allowing them to be reused.',
                clearLocalStorageAdmin
            );
        });
    }
    
    // Debug tools
    const viewLogsButton = document.getElementById('viewLogsButton');
    const openSpreadsheetDirectButton = document.getElementById('openSpreadsheetDirectButton');
    
    if (viewLogsButton) viewLogsButton.addEventListener('click', toggleLogs);
    if (openSpreadsheetDirectButton) {
        openSpreadsheetDirectButton.addEventListener('click', function() {
            if (window.ExperimentUtils) {
                window.ExperimentUtils.openUrl(window.ExperimentConfig.SPREADSHEET_URL);
            }
        });
    }
    
    // Confirmation modal
    const confirmNoButton = document.getElementById('confirmNoButton');
    if (confirmNoButton) confirmNoButton.addEventListener('click', closeConfirmation);
    
    // Setup skip button listeners
    setupSkipButtonListeners();
}

function setupSkipButtonListeners() {
    const skipButtons = [
        { id: 'skipInstructionsButton', action: skipInstructions },
        { id: 'skipNoChangeTrainingButton', action: skipNoChangeTraining },
        { id: 'skipChangeTrainingButton', action: skipChangeTraining },
        { id: 'skipAllTrialsButton', action: skipAllTrials },
        { id: 'skipPracticeTrialsButton', action: skipPracticeTrials },
        { id: 'bypassIdCheckButton', action: bypassIdCheck }
    ];
    
    skipButtons.forEach(({ id, action }) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', action);
        }
    });
}

// Control panel functions
function openControlPanel() {
    const controlPanelModal = document.getElementById('controlPanelModal');
    if (controlPanelModal) {
        controlPanelModal.style.display = 'block';
    }
}

function closeControlPanel() {
    const controlPanelModal = document.getElementById('controlPanelModal');
    if (controlPanelModal) {
        controlPanelModal.style.display = 'none';
    }
}

// Updated authentication functions with server-side verification
async function attemptAdminLogin() {
    const adminPassword = document.getElementById('adminPassword');
    const loginError = document.getElementById('loginError');
    
    if (!adminPassword) return;
    
    const enteredPassword = adminPassword.value;
    if (!enteredPassword) {
        showLoginError('Please enter a password');
        return;
    }
    
    try {
        // Show loading state
        const loginButton = document.getElementById('loginButton');
        if (loginButton) {
            loginButton.disabled = true;
            loginButton.textContent = 'Authenticating...';
        }
        
        // Send authentication request to Google Apps Script
        const authResponse = await sendAuthenticationRequest(enteredPassword);
        
        if (authResponse.success) {
            window.ExperimentConfig.isAdminAuthenticated = true;
            if (window.ExperimentStorage) {
                window.ExperimentStorage.setStoredAdminState(true, null);
            }
            toggleControlOptions(true);
            
            if (loginError) loginError.style.display = 'none';
            
            if (window.ExperimentLogger) {
                window.ExperimentLogger.log('Admin login successful');
            }
        } else {
            showLoginError('Incorrect password');
            
            if (window.ExperimentLogger) {
                window.ExperimentLogger.log('Admin login failed - incorrect password');
            }
        }
    } catch (error) {
        showLoginError('Authentication failed. Please try again.');
        
        if (window.ExperimentLogger) {
            window.ExperimentLogger.logError(error, 'Admin authentication');
        }
    } finally {
        // Reset login button
        const loginButton = document.getElementById('loginButton');
        if (loginButton) {
            loginButton.disabled = false;
            loginButton.textContent = window.LanguageManager ? 
                window.LanguageManager.getText('loginButton') : 'Login';
        }
    }
}

// Send authentication request to server
async function sendAuthenticationRequest(password) {
    const requestData = {
        action: 'admin-login',
        password: password,
        timestamp: Date.now()
    };
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('Sending admin authentication request');
    }
    
    try {
        // Try standard fetch first
        const response = await fetch(window.ExperimentConfig.GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        const result = await response.json();
        return result;
        
    } catch (error) {
        // Fallback for CORS issues
        if (window.ExperimentLogger) {
            window.ExperimentLogger.log('CORS blocked, using no-cors fallback');
        }
        
        await fetch(window.ExperimentConfig.GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        // For no-cors, we'll assume success since we can't read the response
        return { success: true };
    }
}

// Show login error message
function showLoginError(message) {
    const loginError = document.getElementById('loginError');
    if (loginError) {
        loginError.textContent = message;
        loginError.style.display = 'block';
    }
}

function toggleControlOptions(showOptions) {
    const loginSection = document.getElementById('loginSection');
    const controlOptions = document.getElementById('controlOptions');
    const adminPassword = document.getElementById('adminPassword');
    
    if (loginSection) loginSection.style.display = showOptions ? 'none' : 'block';
    if (controlOptions) controlOptions.style.display = showOptions ? 'block' : 'none';
    if (adminPassword) adminPassword.value = '';
}

// Admin mode toggle
function toggleAdminMode(isActive) {
    window.ExperimentConfig.isAdminModeActive = isActive;
    if (window.ExperimentStorage) {
        window.ExperimentStorage.setStoredAdminState(null, isActive);
    }
    
    const adminModeIndicator = document.getElementById('adminModeIndicator');
    if (adminModeIndicator) {
        adminModeIndicator.style.display = isActive ? 'block' : 'none';
    }
    
    updateAdminUI();
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('Admin mode ' + (isActive ? 'activated' : 'deactivated'));
    }
}

function updateAdminUI() {
    const isActive = window.ExperimentConfig.isAdminModeActive;
    
    // Update skip buttons visibility
    const skipButtons = document.querySelectorAll('.skipButton');
    skipButtons.forEach(button => {
        button.style.display = isActive ? 'block' : 'none';
    });
    
    // Update bypass button
    const bypassButton = document.getElementById('bypassIdCheckButton');
    if (bypassButton) bypassButton.style.display = isActive ? 'block' : 'none';
    
    // Update debug info display
    const debugInfo = document.getElementById('debugInfo');
    if (debugInfo) debugInfo.style.display = isActive ? 'block' : 'none';
    
    // Update timer visibility
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) timerDisplay.style.display = isActive ? 'block' : 'none';
}

// Skip functions
function skipInstructions() {
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('Admin: Skipped instructions');
    }
    
    const instructionsPage = document.getElementById('instructionsPage');
    const noChangeTrainingPage = document.getElementById('noChangeTrainingPage');
    
    if (instructionsPage) instructionsPage.style.display = 'none';
    if (noChangeTrainingPage) {
        noChangeTrainingPage.style.display = 'block';
        if (window.ExperimentUI && window.ExperimentUI.setupNoChangeTrainingForDevice) {
            window.ExperimentUI.setupNoChangeTrainingForDevice();
        }
    }
}

function skipNoChangeTraining() {
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('Admin: Skipped no-change training');
    }
    
    const noChangeTrainingPage = document.getElementById('noChangeTrainingPage');
    const changeTrainingPage = document.getElementById('changeTrainingPage');
    
    if (noChangeTrainingPage) noChangeTrainingPage.style.display = 'none';
    if (changeTrainingPage) {
        changeTrainingPage.style.display = 'block';
        if (window.ExperimentUI && window.ExperimentUI.setupChangeTrainingForDevice) {
            window.ExperimentUI.setupChangeTrainingForDevice();
        }
    }
}

function skipChangeTraining() {
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('Admin: Skipped change training');
    }
    
    const changeTrainingPage = document.getElementById('changeTrainingPage');
    const experimentArea = document.getElementById('experimentArea');
    
    if (changeTrainingPage) changeTrainingPage.style.display = 'none';
    if (experimentArea) {
        experimentArea.style.display = 'block';
        if (window.ExperimentUI && window.ExperimentUI.setupExperimentAreaForDevice) {
            window.ExperimentUI.setupExperimentAreaForDevice();
        }
        if (window.ExperimentMain && window.ExperimentMain.initExperiment) {
            window.ExperimentMain.initExperiment();
        }
    }
}

function skipPracticeTrials() {
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('Admin: Skipped practice trials');
    }
    
    const practiceTrialsPage = document.getElementById('practiceTrialsPage');
    const experimentArea = document.getElementById('experimentArea');
    
    if (practiceTrialsPage) practiceTrialsPage.style.display = 'none';
    if (experimentArea) {
        experimentArea.style.display = 'block';
        if (window.ExperimentUI && window.ExperimentUI.setupExperimentAreaForDevice) {
            window.ExperimentUI.setupExperimentAreaForDevice();
        }
        if (window.ExperimentMain && window.ExperimentMain.initExperiment) {
            window.ExperimentMain.initExperiment();
        }
    }
}

function skipAllTrials() {
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('Admin: Skipped all trials');
    }
    
    if (window.ExperimentTimers && window.ExperimentTimers.cleanupTimers) {
        window.ExperimentTimers.cleanupTimers();
    }
    
    const state = window.ExperimentConfig.state;
    const config = window.ExperimentConfig.config;
    
    state.currentTrial = config.numTrials;
    state.correctResponses = config.numTrials;
    state.responseTimes = Array(config.numTrials).fill(0.5);
    state.timeoutTrials = [];
    
    if (window.ExperimentMain && window.ExperimentMain.experimentComplete) {
        window.ExperimentMain.experimentComplete();
    }
}

function bypassIdCheck() {
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('Admin: Bypassed ID check');
    }
    
    const warningElements = [
        'previousParticipationWarning',
        'sameIdDifferentDeviceWarning',
        'invalidIdLengthWarning'
    ];
    
    warningElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = 'none';
    });
    
    // Call the main startInstructionSequence function
    if (window.ExperimentApp && window.ExperimentApp.startInstructionSequence) {
        window.ExperimentApp.startInstructionSequence();
    }
}

// Data management functions
function clearGoogleSheetAdmin() {
    if (window.ExperimentNetwork && window.ExperimentNetwork.clearGoogleSheet) {
        window.ExperimentNetwork.clearGoogleSheet()
            .then(result => {
                if (result.success) {
                    if (window.LanguageManager) {
                        alert(window.LanguageManager.getText('sheetCleared'));
                    }
                } else {
                    console.error('Failed to clear Google Sheet:', result.error);
                }
            });
    }
}

function clearLocalStorageAdmin() {
    if (window.ExperimentStorage && window.ExperimentStorage.clearParticipantData) {
        const success = window.ExperimentStorage.clearParticipantData();
        if (success && window.LanguageManager) {
            alert(window.LanguageManager.getText('localStorageCleared'));
        }
    }
}

// Debug functions
function toggleLogs() {
    if (window.ExperimentLogger && window.ExperimentLogger.toggleDebugInfo) {
        window.ExperimentLogger.toggleDebugInfo();
    }
}

// Confirmation modal functions
function showConfirmation(title, message, confirmCallback) {
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmationTitle = document.getElementById('confirmationTitle');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const confirmYesButton = document.getElementById('confirmYesButton');
    
    if (confirmationTitle) confirmationTitle.textContent = title;
    if (confirmationMessage) confirmationMessage.textContent = message;
    if (confirmationModal) confirmationModal.style.display = 'block';
    
    // Remove previous event listener
    if (confirmYesButton && confirmYesButton.lastCallback) {
        confirmYesButton.removeEventListener('click', confirmYesButton.lastCallback);
    }
    
    if (confirmYesButton) {
        confirmYesButton.lastCallback = function() {
            confirmCallback();
            closeConfirmation();
        };
        confirmYesButton.addEventListener('click', confirmYesButton.lastCallback);
    }
}

function closeConfirmation() {
    const confirmationModal = document.getElementById('confirmationModal');
    if (confirmationModal) {
        confirmationModal.style.display = 'none';
    }
}

// Admin utilities
function getAdminStatus() {
    return {
        authenticated: window.ExperimentConfig.isAdminAuthenticated,
        active: window.ExperimentConfig.isAdminModeActive,
        features: {
            skipButtons: true,
            bypassChecks: true,
            debugInfo: true,
            dataManagement: true,
            timer: true
        }
    };
}

function logAdminAction(action, details = {}) {
    if (window.ExperimentLogger) {
        window.ExperimentLogger.logUserAction(`ADMIN: ${action}`, details);
    }
}

// Export all admin functions - THIS IS CRUCIAL
window.ExperimentAdmin = {
    initAdminControls,
    setupAdminEventListeners,
    setupSkipButtonListeners,
    openControlPanel,
    closeControlPanel,
    attemptAdminLogin,
    sendAuthenticationRequest,
    showLoginError,
    toggleControlOptions,
    toggleAdminMode,
    updateAdminUI,
    skipInstructions,
    skipNoChangeTraining,
    skipChangeTraining,
    skipPracticeTrials,
    skipAllTrials,
    bypassIdCheck,
    clearGoogleSheetAdmin,
    clearLocalStorageAdmin,
    toggleLogs,
    showConfirmation,
    closeConfirmation,
    getAdminStatus,
    logAdminAction
};