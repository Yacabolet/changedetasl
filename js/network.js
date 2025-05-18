// Updated network.js - Compatible with your existing Google Apps Script

// API Communication functions
function testConnection() {
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('Testing connection to Google Sheets...');
    }
    
    const savingMessage = document.getElementById('savingMessage');
    const participantIdForm = document.getElementById('participantIdForm');
    const instructionsPage = document.getElementById('instructionsPage');
    const connectionErrorMessage = document.getElementById('connectionErrorMessage');
    
    // Show loading state
    if (participantIdForm) participantIdForm.style.display = 'none';
    if (instructionsPage) instructionsPage.style.display = 'none';
    if (connectionErrorMessage) connectionErrorMessage.style.display = 'none';
    if (savingMessage) {
        savingMessage.style.display = 'block';
        if (window.LanguageManager) {
            savingMessage.innerHTML = `<h2>${window.LanguageManager.getText('savingText')}</h2>`;
        }
    }
    
    return fetch(window.ExperimentConfig.GOOGLE_SCRIPT_URL, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
    })
    .then(() => {
        if (window.ExperimentLogger) {
            window.ExperimentLogger.log('Connection to Google successful');
        }
        window.ExperimentConfig.isInternetConnected = true;
        
        if (savingMessage) savingMessage.style.display = 'none';
        if (instructionsPage) instructionsPage.style.display = 'block';
        if (connectionErrorMessage) connectionErrorMessage.style.display = 'none';
        
        // Start instructions timer if UI manager is available
        if (window.ExperimentUI && window.ExperimentUI.startInstructionsTimer) {
            window.ExperimentUI.startInstructionsTimer();
        }
        
        return { success: true };
    })
    .catch(error => {
        if (window.ExperimentLogger) {
            window.ExperimentLogger.log('Connection to Google failed: ' + error);
        }
        window.ExperimentConfig.isInternetConnected = false;
        
        if (savingMessage) savingMessage.style.display = 'none';
        if (instructionsPage) instructionsPage.style.display = 'none';
        if (connectionErrorMessage) connectionErrorMessage.style.display = 'block';
        
        // Show debug info if logger is available
        const debugInfo = document.getElementById('debugInfo');
        if (debugInfo) debugInfo.style.display = 'block';
        
        return { success: false, error: error.message };
    });
}

function saveResultsToSheet() {
    const state = window.ExperimentConfig.state;
    const config = window.ExperimentConfig.config;
    
    if (state.dataSaved) {
        if (window.ExperimentLogger) {
            window.ExperimentLogger.log('Data already saved, skipping save operation');
        }
        if (window.ExperimentUI && window.ExperimentUI.showThankYouScreen) {
            window.ExperimentUI.showThankYouScreen();
        }
        return Promise.resolve({ success: true, message: 'Data already saved' });
    }
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('Preparing to save data to Google Sheets');
    }
    
    // Calculate accuracy
    const accuracy = state.currentTrial > 0 
        ? (state.correctResponses / state.currentTrial * 100).toFixed(1) 
        : 0;
    
    // Generate completion code
    const completionCode = window.ExperimentUtils.generateCompletionCode();
    window.ExperimentConfig.completionCode = completionCode;
    
    // Prepare response times string
    const responseTimesStr = state.responseTimes.map(time => time.toFixed(2)).join(',');
    
    // Prepare trial statuses
    const trialStatuses = [];
    for (let i = 0; i < state.currentTrial; i++) {
        if (state.timeoutTrials.includes(i)) {
            trialStatuses.push('timeout');
        } else {
            // Determine if this trial was correct
            // Note: This is a simplified version - you may need to adjust based on your data structure
            const isCorrect = i < state.correctResponses;
            trialStatuses.push(isCorrect ? 'correct' : 'incorrect');
        }
    }
    const trialStatusesStr = trialStatuses.join(',');
    
    // Prepare data object to match your Google Script structure
    const data = {
        participantId: window.ExperimentConfig.participantId,
        deviceId: window.ExperimentConfig.deviceId,
        isMobile: window.ExperimentConfig.isMobile,
        trialsCompleted: state.currentTrial,
        correctResponses: state.correctResponses,
        accuracy: accuracy,
        completionCode: completionCode,
        language: window.LanguageManager ? window.LanguageManager.getCurrentLanguage() : 'en',
        adminMode: window.ExperimentConfig.isAdminModeActive,
        responseTimes: responseTimesStr,
        trialStatuses: trialStatusesStr
    };
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('Sending data: ' + JSON.stringify(data));
    }
    
    // Update save status
    const saveStatus = document.getElementById('saveStatus');
    if (saveStatus && window.LanguageManager) {
        saveStatus.textContent = window.LanguageManager.getText('savingText');
    }
    
    return fetch(window.ExperimentConfig.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (window.ExperimentLogger) {
            window.ExperimentLogger.log('Response received from Google Script');
        }
        state.dataSaved = true;
        
        if (saveStatus && window.LanguageManager) {
            saveStatus.textContent = window.LanguageManager.getText('resultsSavedSuccess');
        }
        
        // Record participation if not in admin mode
        if (!window.ExperimentConfig.isAdminModeActive && window.ExperimentStorage) {
            window.ExperimentStorage.recordParticipation(null);
        }
        
        // Show thank you screen
        if (window.ExperimentUI && window.ExperimentUI.showThankYouScreen) {
            window.ExperimentUI.showThankYouScreen();
        }
        
        return { success: true, data: data };
    })
    .catch(error => {
        if (window.ExperimentLogger) {
            window.ExperimentLogger.log('Error saving data: ' + error.message);
        }
        
        if (saveStatus && window.LanguageManager) {
            saveStatus.textContent = window.LanguageManager.getText('errorSavingData') + ' ' + error.message;
        }
        
        // Show retry button
        const retryButton = document.getElementById('retryButton');
        if (retryButton) retryButton.style.display = 'block';
        
        // Still show thank you screen
        if (window.ExperimentUI && window.ExperimentUI.showThankYouScreen) {
            window.ExperimentUI.showThankYouScreen();
        }
        
        return { success: false, error: error.message };
    });
}

// Updated clear function to work with your authentication system
function clearGoogleSheet() {
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('Attempting to clear Google Sheet...');
    }
    
    const savingMessage = document.getElementById('savingMessage');
    if (savingMessage && window.LanguageManager) {
        savingMessage.style.display = 'block';
        savingMessage.innerHTML = `<h2>${window.LanguageManager.getText('savingText')}</h2>`;
    }
    
    // Get admin password for authentication
    const adminPassword = prompt('Enter admin password to confirm sheet clearing:');
    if (!adminPassword) {
        if (savingMessage) savingMessage.style.display = 'none';
        return Promise.resolve({ success: false, error: 'Operation cancelled' });
    }
    
    const requestData = {
        action: 'clearSheet',
        adminPassword: adminPassword
    };
    
    return fetch(window.ExperimentConfig.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(() => {
        if (window.ExperimentLogger) {
            window.ExperimentLogger.log('Google Sheet clear request sent');
        }
        
        if (savingMessage) savingMessage.style.display = 'none';
        
        if (window.LanguageManager) {
            alert(window.LanguageManager.getText('sheetCleared'));
        }
        
        return { success: true };
    })
    .catch(error => {
        if (window.ExperimentLogger) {
            window.ExperimentLogger.log('Error clearing Google Sheet: ' + error.toString());
        }
        
        if (savingMessage) savingMessage.style.display = 'none';
        
        if (window.LanguageManager) {
            alert(window.LanguageManager.getText('errorSavingData') + ' ' + error.toString());
        }
        
        return { success: false, error: error.message };
    });
}

// Network status checking
function checkNetworkStatus() {
    return navigator.onLine;
}

// Retry mechanism for failed requests
function retryOperation(operation, maxRetries = 3, delay = 1000) {
    let retries = 0;
    
    const attempt = () => {
        return operation()
            .then(result => {
                if (result.success) {
                    return result;
                } else {
                    throw new Error(result.error || 'Operation failed');
                }
            })
            .catch(error => {
                retries++;
                if (retries >= maxRetries) {
                    throw error;
                }
                
                if (window.ExperimentLogger) {
                    window.ExperimentLogger.log(`Retry attempt ${retries}/${maxRetries} after error: ${error.message}`);
                }
                
                return new Promise(resolve => {
                    setTimeout(() => resolve(attempt()), delay * retries);
                });
            });
    };
    
    return attempt();
}

// Batch data sending (for multiple operations)
function sendBatchData(dataArray) {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        return Promise.resolve({ success: false, error: 'No data to send' });
    }
    
    const batchData = {
        action: 'batch',
        data: dataArray,
        timestamp: Date.now()
    };
    
    return fetch(window.ExperimentConfig.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(batchData)
    })
    .then(() => ({ success: true, count: dataArray.length }))
    .catch(error => ({ success: false, error: error.message }));
}

// Connection timeout handling
function fetchWithTimeout(url, options = {}, timeout = 10000) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
    ]);
}

// Network error classification
function classifyNetworkError(error) {
    if (!error) return 'unknown';
    
    const message = error.message.toLowerCase();
    
    if (message.includes('timeout')) return 'timeout';
    if (message.includes('network')) return 'network';
    if (message.includes('cors')) return 'cors';
    if (message.includes('fetch')) return 'fetch';
    
    return 'unknown';
}

// Export all network functions
window.ExperimentNetwork = {
    testConnection,
    saveResultsToSheet,
    clearGoogleSheet,
    checkNetworkStatus,
    retryOperation,
    sendBatchData,
    fetchWithTimeout,
    classifyNetworkError
};