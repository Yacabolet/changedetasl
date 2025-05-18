// UI management and device-specific setup

// DOM element references (centralized for easy access)
const UI_ELEMENTS = {
    // Forms and main areas
    participantIdForm: null,
    experimentArea: null,
    instructionsPage: null,
    noChangeTrainingPage: null,
    changeTrainingPage: null,
    practiceTrialsPage: null,
    
    // Input elements
    participantIdInput: null,
    
    // Display areas
    stimuliArea: null,
    noChangeTrainingArea: null,
    changeTrainingArea: null,
    practiceArea: null,
    
    // Buttons
    startExperimentButton: null,
    startButton: null,
    responseYes: null,
    responseNo: null,
    instructionsUnderstoodButton: null,
    
    // Messages and feedback
    resultsDiv: null,
    thankYouMessage: null,
    savingMessage: null,
    debugInfo: null,
    
    // Warning messages
    previousParticipationWarning: null,
    sameIdDifferentDeviceWarning: null,
    invalidIdLengthWarning: null,
    connectionErrorMessage: null,
    
    // Other UI elements
    completionCodeElement: null,
    copyCodeButton: null,
    experimentTrialInfo: null,
    timerDisplay: null,
    timeoutMessage: null
};

// Initialize DOM element references
function initializeUIElements() {
    Object.keys(UI_ELEMENTS).forEach(key => {
        const element = document.getElementById(key) || 
                        document.getElementById(key.replace(/([A-Z])/g, (match, offset) => offset > 0 ? match : match.toLowerCase()));
        UI_ELEMENTS[key] = element;
    });
    
    // Special cases for elements with different IDs
    UI_ELEMENTS.participantIdInput = document.getElementById('participantId');
    UI_ELEMENTS.completionCodeElement = document.getElementById('completionCode');
    UI_ELEMENTS.experimentTrialInfo = document.getElementById('experimentTrialInfo');
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('UI elements initialized');
    }
}

// Device-specific setup functions
function setupExperimentAreaForDevice() {
    const toggleButton = document.getElementById('toggleExperimentDetails');
    const fullInstructions = document.getElementById('experimentFullInstructions');
    const compactInstructions = document.getElementById('experimentCompactInstructions');
    
    if (window.ExperimentConfig.isMobile) {
        if (compactInstructions) compactInstructions.style.display = 'block';
        if (fullInstructions) fullInstructions.style.display = 'none';
        
        if (toggleButton) {
            toggleButton.addEventListener('click', function() {
                if (fullInstructions && fullInstructions.style.display === 'none') {
                    fullInstructions.style.display = 'block';
                    if (window.LanguageManager) {
                        toggleButton.textContent = window.LanguageManager.getText('hideInstructions');
                    }
                } else if (fullInstructions) {
                    fullInstructions.style.display = 'none';
                    if (window.LanguageManager) {
                        toggleButton.textContent = window.LanguageManager.getText('showInstructions');
                    }
                }
            });
        }
    } else {
        if (compactInstructions) compactInstructions.style.display = 'none';
        if (fullInstructions) fullInstructions.style.display = 'block';
    }
    
    if (window.LanguageManager) {
        window.LanguageManager.updateLanguage();
    }
}

function setupNoChangeTrainingForDevice() {
    const toggleButton = document.getElementById('toggleNoChangeDetails');
    const fullInstructions = document.getElementById('noChangeFullInstructions');
    const compactInstructions = document.getElementById('noChangeCompactInstructions');
    
    if (window.ExperimentConfig.isMobile) {
        if (compactInstructions) compactInstructions.style.display = 'block';
        if (fullInstructions) fullInstructions.style.display = 'none';
        
        if (toggleButton) {
            toggleButton.addEventListener('click', function() {
                if (fullInstructions && fullInstructions.style.display === 'none') {
                    fullInstructions.style.display = 'block';
                    if (window.LanguageManager) {
                        toggleButton.textContent = window.LanguageManager.getText('hideInstructions');
                    }
                } else if (fullInstructions) {
                    fullInstructions.style.display = 'none';
                    if (window.LanguageManager) {
                        toggleButton.textContent = window.LanguageManager.getText('showInstructions');
                    }
                }
            });
        }
    } else {
        if (compactInstructions) compactInstructions.style.display = 'none';
        if (fullInstructions) fullInstructions.style.display = 'block';
    }
}

function setupChangeTrainingForDevice() {
    const toggleButton = document.getElementById('toggleChangeDetails');
    const fullInstructions = document.getElementById('changeFullInstructions');
    const compactInstructions = document.getElementById('changeCompactInstructions');
    
    if (window.ExperimentConfig.isMobile) {
        if (compactInstructions) compactInstructions.style.display = 'block';
        if (fullInstructions) fullInstructions.style.display = 'none';
        
        if (toggleButton) {
            toggleButton.addEventListener('click', function() {
                if (fullInstructions && fullInstructions.style.display === 'none') {
                    fullInstructions.style.display = 'block';
                    if (window.LanguageManager) {
                        toggleButton.textContent = window.LanguageManager.getText('hideInstructions');
                    }
                } else if (fullInstructions) {
                    fullInstructions.style.display = 'none';
                    if (window.LanguageManager) {
                        toggleButton.textContent = window.LanguageManager.getText('showInstructions');
                    }
                }
            });
        }
    } else {
        if (compactInstructions) compactInstructions.style.display = 'none';
        if (fullInstructions) fullInstructions.style.display = 'block';
    }
}

function setupPracticePageForDevice() {
    const toggleButton = document.getElementById('togglePracticeDetails');
    const fullInstructions = document.getElementById('practiceFullInstructions');
    const compactInstructions = document.getElementById('practiceCompactInstructions');
    
    if (window.ExperimentConfig.isMobile) {
        if (compactInstructions) compactInstructions.style.display = 'block';
        if (fullInstructions) fullInstructions.style.display = 'none';
        
        if (toggleButton) {
            toggleButton.addEventListener('click', function() {
                if (fullInstructions && fullInstructions.style.display === 'none') {
                    fullInstructions.style.display = 'block';
                    if (window.LanguageManager) {
                        toggleButton.textContent = window.LanguageManager.getText('hideInstructions');
                    }
                } else if (fullInstructions) {
                    fullInstructions.style.display = 'none';
                    if (window.LanguageManager) {
                        toggleButton.textContent = window.LanguageManager.getText('showInstructions');
                    }
                }
            });
        }
    } else {
        if (compactInstructions) compactInstructions.style.display = 'none';
        if (fullInstructions) fullInstructions.style.display = 'block';
    }
}

// Instructions timer functions
function startInstructionsTimer() {
    if (window.ExperimentTimers && window.ExperimentTimers.startInstructionsTimer) {
        return window.ExperimentTimers.startInstructionsTimer();
    }
}

// Results display functions
function updateResults() {
    const state = window.ExperimentConfig.state;
    const trialsCompletedElement = document.getElementById('trialsCompleted');
    const correctResponsesElement = document.getElementById('correctResponses');
    const accuracyElement = document.getElementById('accuracy');
    
    console.log("Updating results. Trial:", state.currentTrial, "Correct:", state.correctResponses);
    
    if (trialsCompletedElement) {
        trialsCompletedElement.textContent = state.currentTrial;
    }
    
    if (correctResponsesElement) {
        correctResponsesElement.textContent = state.correctResponses;
    }
    
    if (accuracyElement && state.currentTrial > 0) {
        const accuracy = (state.correctResponses / state.currentTrial * 100).toFixed(1);
        accuracyElement.textContent = accuracy;
    } else if (accuracyElement) {
        accuracyElement.textContent = '0';
    }
    
    // Update trial counter display
    const experimentTrialInfo = document.getElementById('experimentTrialInfo');
    if (experimentTrialInfo && experimentTrialInfo.style.display !== 'none') {
        const currentTrial = state.currentTrial || 1;
        const totalTrials = window.ExperimentConfig.config.numTrials;
        if (window.LanguageManager) {
            experimentTrialInfo.innerHTML = window.LanguageManager.getText('trialCounter')
                .replace('{0}', `<span id="currentTrialDisplay">${currentTrial}</span>`)
                .replace('{1}', `<span id="totalTrialsDisplay">${totalTrials}</span>`);
        }
    }
}

// Response button control
function enableResponses() {
    const responseYes = document.getElementById('responseYes');
    const responseNo = document.getElementById('responseNo');
    
    if (responseYes) responseYes.disabled = false;
    if (responseNo) responseNo.disabled = false;
}

function disableResponses() {
    const responseYes = document.getElementById('responseYes');
    const responseNo = document.getElementById('responseNo');
    
    if (responseYes) responseYes.disabled = true;
    if (responseNo) responseNo.disabled = true;
}

// Screen display management
function showThankYouScreen() {
    const savingMessage = document.getElementById('savingMessage');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const completionCodeElement = document.getElementById('completionCode');
    
    if (savingMessage) savingMessage.style.display = 'none';
    
    if (completionCodeElement && window.ExperimentConfig.completionCode) {
        completionCodeElement.textContent = window.ExperimentConfig.completionCode;
    }
    
    if (thankYouMessage) thankYouMessage.style.display = 'block';
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('Showing thank you message with completion code: ' + window.ExperimentConfig.completionCode);
    }
}

// Page navigation helpers
function showPage(pageId, hidePages = []) {
    // Hide specified pages
    hidePages.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = 'none';
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.style.display = 'block';
}

function hideAllPages() {
    const pages = [
        'participantIdForm',
        'instructionsPage',
        'noChangeTrainingPage',
        'changeTrainingPage',
        'practiceTrialsPage',
        'experimentArea',
        'savingMessage',
        'thankYouMessage'
    ];
    
    pages.forEach(pageId => {
        const element = document.getElementById(pageId);
        if (element) element.style.display = 'none';
    });
}

// Warning message management
function showWarning(warningType) {
    const warningElements = {
        participation: 'previousParticipationWarning',
        sameId: 'sameIdDifferentDeviceWarning',
        invalidId: 'invalidIdLengthWarning',
        connection: 'connectionErrorMessage'
    };
    
    const warningId = warningElements[warningType];
    if (warningId) {
        const element = document.getElementById(warningId);
        if (element) element.style.display = 'block';
        
        // Show participant form initially hidden
        const participantIdForm = document.getElementById('participantIdForm');
        if (participantIdForm && warningType !== 'connection') {
            participantIdForm.style.display = 'none';
        }
        
        // Show bypass button if admin mode is active
        if (window.ExperimentConfig.isAdminModeActive) {
            const bypassButton = document.getElementById('bypassIdCheckButton');
            if (bypassButton) bypassButton.style.display = 'block';
        }
    }
}

function hideAllWarnings() {
    const warnings = [
        'previousParticipationWarning',
        'sameIdDifferentDeviceWarning', 
        'invalidIdLengthWarning',
        'connectionErrorMessage'
    ];
    
    warnings.forEach(warningId => {
        const element = document.getElementById(warningId);
        if (element) element.style.display = 'none';
    });
}

// Copy to clipboard functionality
function setupCopyCodeButton() {
    const copyCodeButton = document.getElementById('copyCodeButton');
    if (copyCodeButton) {
        copyCodeButton.addEventListener('click', function() {
            const completionCode = window.ExperimentConfig.completionCode;
            if (window.ExperimentUtils.copyToClipboard(completionCode)) {
                const originalText = copyCodeButton.textContent;
                if (window.LanguageManager) {
                    copyCodeButton.textContent = window.LanguageManager.getText('copyCodeButtonCopied');
                }
                setTimeout(() => {
                    copyCodeButton.textContent = originalText;
                }, 2000);
            }
        });
    }
}

// Action button setup
function setupActionButtons() {
    const showResultsButton = document.getElementById('showResultsButton');
    const showLogButton = document.getElementById('showLogButton');
    const openSpreadsheetButton = document.getElementById('openSpreadsheetButton');
    const retryButton = document.getElementById('retryButton');
    
    if (showResultsButton) {
        showResultsButton.addEventListener('click', function() {
            const resultsDiv = document.getElementById('results');
            if (resultsDiv) {
                resultsDiv.style.display = resultsDiv.style.display === 'none' ? 'block' : 'none';
            }
        });
    }
    
    if (showLogButton) {
        showLogButton.addEventListener('click', function() {
            const debugInfo = document.getElementById('debugInfo');
            if (debugInfo && window.LanguageManager) {
                debugInfo.style.display = debugInfo.style.display === 'none' ? 'block' : 'none';
                showLogButton.textContent = debugInfo.style.display === 'none' ? 
                    window.LanguageManager.getText('showLogButton') : 
                    window.LanguageManager.getText('hideLogButton');
            }
        });
    }
    
    if (openSpreadsheetButton) {
        openSpreadsheetButton.addEventListener('click', function() {
            window.ExperimentUtils.openUrl(window.ExperimentConfig.SPREADSHEET_URL);
        });
    }
    
    if (retryButton) {
        retryButton.addEventListener('click', function() {
            if (window.ExperimentNetwork && window.ExperimentNetwork.saveResultsToSheet) {
                window.ExperimentNetwork.saveResultsToSheet();
            }
        });
    }
}

// Initialize result elements if they don't exist
function ensureResultElements() {
    const resultsDiv = document.getElementById('results');
    if (!resultsDiv) return;
    
    const requiredElements = [
        { id: 'trialsCompleted', labelKey: 'trialsCompletedLabel' },
        { id: 'correctResponses', labelKey: 'correctResponsesLabel' },
        { id: 'accuracy', labelKey: 'accuracyLabel' }
    ];
    
    requiredElements.forEach(({ id, labelKey }) => {
        if (!document.getElementById(id)) {
            const p = document.createElement('p');
            p.id = labelKey;
            if (window.LanguageManager) {
                p.innerHTML = `${window.LanguageManager.getText(labelKey)} <span id="${id}">0</span>`;
            }
            resultsDiv.appendChild(p);
        }
    });
}

// Language toggle button setup
function setupLanguageToggle() {
    const languageToggle = document.getElementById("languageToggle");
    if (languageToggle) {
        languageToggle.addEventListener("click", function() {
            if (window.LanguageManager) {
                window.LanguageManager.toggleLanguage();
            }
        });
    }
}

// Control panel button visibility
function updateControlPanelButtonVisibility() {
    const controlPanelButton = document.getElementById('controlPanelButton');
    if (controlPanelButton && window.LanguageManager) {
        controlPanelButton.style.display = 
            window.LanguageManager.getCurrentLanguage() === "he" ? "none" : "block";
    }
}

// Initialize all UI components
function initializeUI() {
    initializeUIElements();
    setupCopyCodeButton();
    setupActionButtons();
    setupLanguageToggle();
    ensureResultElements();
    updateControlPanelButtonVisibility();
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('UI system initialized');
    }
}

// Export all UI functions
window.ExperimentUI = {
    UI_ELEMENTS,
    initializeUIElements,
    setupExperimentAreaForDevice,
    setupNoChangeTrainingForDevice,
    setupChangeTrainingForDevice,
    setupPracticePageForDevice,
    startInstructionsTimer,
    updateResults,
    enableResponses,
    disableResponses,
    showThankYouScreen,
    showPage,
    hideAllPages,
    showWarning,
    hideAllWarnings,
    setupCopyCodeButton,
    setupActionButtons,
    ensureResultElements,
    setupLanguageToggle,
    updateControlPanelButtonVisibility,
    initializeUI
};