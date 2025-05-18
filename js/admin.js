// Updated admin.js - Session-only authentication with email verification for sheet clearing

// Admin state management
function initAdminControls() {
    // Check stored admin states - authentication is now session-only
    const storedState = window.ExperimentStorage.getStoredAdminState();
    
    // Admin authentication is never restored from storage (session-only)
    window.ExperimentConfig.isAdminAuthenticated = false;
    
    // Admin mode active state can be restored, but requires re-authentication to access
    if (storedState.active) {
        window.ExperimentConfig.isAdminModeActive = true;
        const adminModeToggle = document.getElementById('adminModeToggle');
        if (adminModeToggle) adminModeToggle.checked = true;
        
        const adminModeIndicator = document.getElementById('adminModeIndicator');
        if (adminModeIndicator) adminModeIndicator.style.display = 'block';
        
        updateAdminUI();
    }
    
    // Always show login section on page load
    toggleControlOptions(false);
    
    setupAdminEventListeners();
    updateAdminUI();
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('Admin controls initialized (session-only authentication)');
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
            if (!window.ExperimentConfig.isAdminAuthenticated) {
                alert('Please authenticate first');
                return;
            }
            initiateClearSheet();
        });
    }
    
    if (clearLocalStorageButton) {
        clearLocalStorageButton.addEventListener('click', function() {
            if (!window.ExperimentConfig.isAdminAuthenticated) {
                alert('Please authenticate first');
                return;
            }
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
    
    // Setup session clearing handlers
    if (window.ExperimentStorage) {
        window.ExperimentStorage.setupAdminSessionClearing();
    }
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
            button.addEventListener('click', function() {
                if (!window.ExperimentConfig.isAdminAuthenticated) {
                    alert('Please authenticate first');
                    return;
                }
                action();
            });
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

// Updated authentication functions with session-only storage
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
            
            // Store authentication in session-only storage
            if (window.ExperimentStorage) {
                window.ExperimentStorage.setStoredAdminState(true, null);
            }
            
            toggleControlOptions(true);
            
            if (loginError) loginError.style.display = 'none';
            
            if (window.ExperimentLogger) {
                window.ExperimentLogger.log('Admin login successful (session-only)');
            }
            
            // Show session message
            showSessionMessage();
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

// Show message about session-only authentication
function showSessionMessage() {
    // Create or update session message
    let sessionMsg = document.getElementById('adminSessionMessage');
    if (!sessionMsg) {
        sessionMsg = document.createElement('div');
        sessionMsg.id = 'adminSessionMessage';
        sessionMsg.style.cssText = `
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            font-size: 14px;
            text-align: center;
        `;
        
        const controlOptions = document.getElementById('controlOptions');
        if (controlOptions) {
            controlOptions.insertBefore(sessionMsg, controlOptions.firstChild);
        }
    }
    
    sessionMsg.textContent = '⚠️ Admin access is session-only. You\'ll need to re-authenticate after page refresh.';
    sessionMsg.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        if (sessionMsg) sessionMsg.style.display = 'none';
    }, 5000);
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
    if (!window.ExperimentConfig.isAdminAuthenticated && isActive) {
        alert('Please authenticate first');
        const adminModeToggle = document.getElementById('adminModeToggle');
        if (adminModeToggle) adminModeToggle.checked = false;
        return;
    }
    
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
        window.ExperimentLogger.log('Admin mode ' + (isActive ? 'activated' : 'deactivated') + ' (session-only)');
    }
}

function updateAdminUI() {
    const isActive = window.ExperimentConfig.isAdminModeActive;
    const isAuthenticated = window.ExperimentConfig.isAdminAuthenticated;
    
    // Update skip buttons visibility (only if authenticated)
    const skipButtons = document.querySelectorAll('.skipButton');
    skipButtons.forEach(button => {
        button.style.display = (isActive && isAuthenticated) ? 'block' : 'none';
    });
    
    // Update bypass button
    const bypassButton = document.getElementById('bypassIdCheckButton');
    if (bypassButton) bypassButton.style.display = (isActive && isAuthenticated) ? 'block' : 'none';
    
    // Update debug info display
    const debugInfo = document.getElementById('debugInfo');
    if (debugInfo) debugInfo.style.display = isActive ? 'block' : 'none';
    
    // Update timer visibility
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) timerDisplay.style.display = isActive ? 'block' : 'none';
}

// New function: Initiate clear sheet with email verification
async function initiateClearSheet() {
    try {
        if (window.ExperimentLogger) {
            window.ExperimentLogger.log('Initiating clear sheet with email verification');
        }
        
        const langManager = window.LanguageManager;
        
        // First confirmation - ask if they want to proceed with email verification
        const proceed = confirm(
            langManager ? langManager.getText('emailVerificationConfirmMessage') : 
            'This will clear ALL data from the Google Sheet. A verification code will be sent to your email. Continue?'
        );
        
        if (!proceed) return;
        
        // Get admin password for the request
        const adminPassword = document.getElementById('adminPassword');
        if (!adminPassword || !adminPassword.value) {
            alert(langManager ? langManager.getText('reenterPasswordPrompt') : 'Please re-enter your admin password');
            return;
        }
        
        // Request verification code
        const codeResponse = await requestVerificationCode(adminPassword.value);
        
        if (codeResponse && codeResponse.result === 'success') {
            // Show input dialog for verification code
            showVerificationCodeDialog(adminPassword.value);
        } else {
            alert(
                langManager ? langManager.getText('emailSendFailed') : 
                'Failed to send verification email: ' + (codeResponse ? codeResponse.error : 'Unknown error')
            );
        }
    } catch (error) {
        if (window.ExperimentLogger) {
            window.ExperimentLogger.logError(error, 'initiateClearSheet');
        }
        alert('Error initiating clear sheet: ' + error.message);
    }
}

// Request verification code from server
async function requestVerificationCode(adminPassword) {
    const requestData = {
        action: 'requestClearCode',
        adminPassword: adminPassword,
        timestamp: Date.now()
    };
    
    try {
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
            window.ExperimentLogger.log('CORS blocked, using no-cors fallback for code request');
        }
        
        await fetch(window.ExperimentConfig.GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        // For no-cors, assume success
        return { result: 'success' };
    }
}

// Show verification code input dialog
function showVerificationCodeDialog(adminPassword) {
    const langManager = window.LanguageManager;
    
    // Create modal for verification code input
    const modal = document.createElement('div');
    modal.id = 'verificationCodeModal';
    modal.className = 'confirmationModal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="confirmationContent">
            <h3>${langManager ? langManager.getText('verificationCodeTitle') : 'Email Verification Required'}</h3>
            <p>${langManager ? langManager.getText('verificationCodeMessage') : 'A 6-digit verification code has been sent to your email. Please enter it below:'}</p>
            <div style="margin: 20px 0;">
                <input type="text" id="verificationCodeInput" placeholder="123456" 
                       style="font-size: 18px; padding: 10px; text-align: center; letter-spacing: 2px; width: 150px;"
                       maxlength="6" pattern="[0-9]{6}">
            </div>
            <p style="font-size: 14px; color: #666;">
                ${langManager ? langManager.getText('verificationCodeExpiry') : 'Code expires in 5 minutes'}
            </p>
            <div style="margin-top: 20px;">
                <button id="verifyCodeButton" class="adminButton primary">
                    ${langManager ? langManager.getText('verifyAndClearButton') : 'Verify and Clear Sheet'}
                </button>
                <button id="cancelVerificationButton" class="adminButton">
                    ${langManager ? langManager.getText('confirmNoButton') : 'Cancel'}
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Set up event listeners
    const verificationInput = document.getElementById('verificationCodeInput');
    const verifyButton = document.getElementById('verifyCodeButton');
    const cancelButton = document.getElementById('cancelVerificationButton');
    
    // Focus on input
    if (verificationInput) verificationInput.focus();
    
    // Auto-format input (numbers only)
    if (verificationInput) {
        verificationInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
        
        verificationInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter' && e.target.value.length === 6) {
                verifyButton.click();
            }
        });
    }
    
    if (verifyButton) {
        verifyButton.addEventListener('click', async function() {
            const code = verificationInput ? verificationInput.value : '';
            if (code.length !== 6) {
                alert(langManager ? langManager.getText('invalidCodeFormat') : 'Please enter a 6-digit code');
                return;
            }
            
            verifyButton.disabled = true;
            verifyButton.textContent = langManager ? langManager.getText('verifying') : 'Verifying...';
            
            try {
                await clearSheetWithCode(adminPassword, code);
                document.body.removeChild(modal);
            } catch (error) {
                verifyButton.disabled = false;
                verifyButton.textContent = langManager ? langManager.getText('verifyAndClearButton') : 'Verify and Clear Sheet';
            }
        });
    }
    
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
    }
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Clear sheet with verification code
async function clearSheetWithCode(adminPassword, verificationCode) {
    const requestData = {
        action: 'clearSheet',
        adminPassword: adminPassword,
        verificationCode: verificationCode,
        timestamp: Date.now()
    };
    
    try {
        const response = await fetch(window.ExperimentConfig.GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        const result = await response.json();
        
        if (result.result === 'success') {
            if (window.LanguageManager) {
                alert(window.LanguageManager.getText('sheetCleared'));
            } else {
                alert('Google Sheet cleared successfully!');
            }
            if (window.ExperimentLogger) {
                window.ExperimentLogger.log('Sheet cleared successfully with email verification');
            }
        } else {
            alert('Error: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        // Fallback for CORS issues
        if (window.ExperimentLogger) {
            window.ExperimentLogger.log('CORS blocked, using no-cors fallback for sheet clear');
        }
        
        await fetch(window.ExperimentConfig.GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        // For no-cors, assume success
        if (window.LanguageManager) {
            alert(window.LanguageManager.getText('sheetCleared'));
        } else {
            alert('Sheet clear request sent (no-cors mode)');
        }
    }
}

// Skip functions (now require authentication)
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
        sessionOnly: true, // Indicate this is session-only
        features: {
            skipButtons: true,
            bypassChecks: true,
            debugInfo: true,
            dataManagement: true,
            timer: true,
            emailVerification: true // New feature
        }
    };
}

function logAdminAction(action, details = {}) {
    if (window.ExperimentLogger) {
        window.ExperimentLogger.logUserAction(`ADMIN: ${action}`, details);
    }
}

// Export all admin functions
window.ExperimentAdmin = {
    initAdminControls,
    setupAdminEventListeners,
    setupSkipButtonListeners,
    openControlPanel,
    closeControlPanel,
    attemptAdminLogin,
    sendAuthenticationRequest,
    showSessionMessage,
    showLoginError,
    toggleControlOptions,
    toggleAdminMode,
    updateAdminUI,
    initiateClearSheet,
    requestVerificationCode,
    showVerificationCodeDialog,
    clearSheetWithCode,
    skipInstructions,
    skipNoChangeTraining,
    skipChangeTraining,
    skipPracticeTrials,
    skipAllTrials,
    bypassIdCheck,
    clearLocalStorageAdmin,
    toggleLogs,
    showConfirmation,
    closeConfirmation,
    getAdminStatus,
    logAdminAction
};