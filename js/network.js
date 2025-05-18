// Updated network.js - Removed clearGoogleSheet function (now handled in admin.js with email verification)

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
    
    // Prepare trial statuses - now using the actual trial results array
    const trialStatusesStr = state.trialResults.join(',');
    
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

// Generic network request function for admin operations
function sendAdminRequest(requestData) {
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('Sending admin request: ' + requestData.action);
    }
    
    return fetch(window.ExperimentConfig.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        // For CORS issues, try no-cors mode
        if (error.message.includes('CORS') || error.name === 'TypeError') {
            if (window.ExperimentLogger) {
                window.ExperimentLogger.log('CORS blocked, using no-cors fallback for: ' + requestData.action);
            }
            
            return fetch(window.ExperimentConfig.GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            })
            .then(() => {
                // For no-cors, we can't read the response, so we assume success
                return { result: 'success', noCorsMode: true };
            });
        }
        throw error;
    });
}

// Network status checking
function checkNetworkStatus() {
    return navigator.onLine;
}

// Enhanced connection test with detailed diagnostics
function performDetailedConnectionTest() {
    const diagnostics = {
        browserOnline: navigator.onLine,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        tests: []
    };
    
    // Test 1: Basic connectivity
    const basicTest = fetch(window.ExperimentConfig.GOOGLE_SCRIPT_URL, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
    })
    .then(() => {
        diagnostics.tests.push({ name: 'Basic connectivity', status: 'success' });
        return true;
    })
    .catch(error => {
        diagnostics.tests.push({ name: 'Basic connectivity', status: 'failed', error: error.message });
        return false;
    });
    
    // Test 2: POST request capability
    const postTest = basicTest.then(basicSuccess => {
        if (!basicSuccess) return false;
        
        return fetch(window.ExperimentConfig.GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'test', timestamp: Date.now() })
        })
        .then(() => {
            diagnostics.tests.push({ name: 'POST request', status: 'success' });
            return true;
        })
        .catch(error => {
            diagnostics.tests.push({ name: 'POST request', status: 'failed', error: error.message });
            return false;
        });
    });
    
    return postTest.then(allSuccess => {
        diagnostics.overallStatus = allSuccess ? 'success' : 'failed';
        
        if (window.ExperimentLogger) {
            window.ExperimentLogger.log('Connection diagnostics: ' + JSON.stringify(diagnostics, null, 2));
        }
        
        return {
            success: allSuccess,
            diagnostics: diagnostics
        };
    });
}

// Retry mechanism for failed requests
function retryOperation(operation, maxRetries = 3, delay = 1000) {
    let retries = 0;
    
    const attempt = () => {
        return operation()
            .then(result => {
                if (result && result.success !== false) {
                    return result;
                } else {
                    throw new Error(result ? (result.error || 'Operation failed') : 'Operation failed');
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
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log(`Sending batch data with ${dataArray.length} items`);
    }
    
    return fetch(window.ExperimentConfig.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(batchData)
    })
    .then(() => {
        if (window.ExperimentLogger) {
            window.ExperimentLogger.log(`Batch data sent successfully (${dataArray.length} items)`);
        }
        return { success: true, count: dataArray.length };
    })
    .catch(error => {
        if (window.ExperimentLogger) {
            window.ExperimentLogger.log(`Batch data send failed: ${error.message}`);
        }
        return { success: false, error: error.message };
    });
}

// Connection timeout handling
function fetchWithTimeout(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const enhancedOptions = {
        ...options,
        signal: controller.signal
    };
    
    return fetch(url, enhancedOptions)
        .finally(() => clearTimeout(timeoutId))
        .catch(error => {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        });
}

// Network error classification and handling
function classifyNetworkError(error) {
    if (!error) return { type: 'unknown', retry: false };
    
    const message = error.message.toLowerCase();
    
    if (message.includes('timeout') || error.name === 'AbortError') {
        return { type: 'timeout', retry: true };
    }
    
    if (message.includes('network') || message.includes('failed to fetch')) {
        return { type: 'network', retry: true };
    }
    
    if (message.includes('cors')) {
        return { type: 'cors', retry: false };
    }
    
    if (message.includes('403') || message.includes('unauthorized')) {
        return { type: 'authentication', retry: false };
    }
    
    if (message.includes('404')) {
        return { type: 'not_found', retry: false };
    }
    
    if (message.includes('500') || message.includes('503')) {
        return { type: 'server_error', retry: true };
    }
    
    return { type: 'unknown', retry: false };
}

// Network monitoring for connection quality
function startNetworkMonitoring(callback) {
    let lastOnlineStatus = navigator.onLine;
    let connectionQuality = 'unknown';
    
    // Monitor online/offline status
    const handleOnline = () => {
        if (window.ExperimentLogger) {
            window.ExperimentLogger.log('Network: Connection restored');
        }
        lastOnlineStatus = true;
        if (callback) callback({ online: true, quality: connectionQuality });
    };
    
    const handleOffline = () => {
        if (window.ExperimentLogger) {
            window.ExperimentLogger.log('Network: Connection lost');
        }
        lastOnlineStatus = false;
        connectionQuality = 'offline';
        if (callback) callback({ online: false, quality: 'offline' });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Periodic connection quality test
    const qualityTestInterval = setInterval(() => {
        if (!navigator.onLine) return;
        
        const startTime = Date.now();
        fetch(window.ExperimentConfig.GOOGLE_SCRIPT_URL, {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache'
        })
        .then(() => {
            const responseTime = Date.now() - startTime;
            if (responseTime < 500) {
                connectionQuality = 'excellent';
            } else if (responseTime < 1500) {
                connectionQuality = 'good';
            } else if (responseTime < 3000) {
                connectionQuality = 'fair';
            } else {
                connectionQuality = 'poor';
            }
            
            if (callback) callback({ online: true, quality: connectionQuality, responseTime });
        })
        .catch(() => {
            connectionQuality = 'poor';
            if (callback) callback({ online: true, quality: 'poor' });
        });
    }, 30000); // Test every 30 seconds
    
    // Return cleanup function
    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        clearInterval(qualityTestInterval);
    };
}

// Request queue for handling requests when offline
class RequestQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
    }
    
    add(requestFunction, priority = 0) {
        this.queue.push({ requestFunction, priority, timestamp: Date.now() });
        this.queue.sort((a, b) => b.priority - a.priority); // Higher priority first
        
        if (navigator.onLine && !this.processing) {
            this.process();
        }
    }
    
    async process() {
        if (this.processing || this.queue.length === 0) return;
        
        this.processing = true;
        
        while (this.queue.length > 0 && navigator.onLine) {
            const { requestFunction } = this.queue.shift();
            
            try {
                await requestFunction();
                await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between requests
            } catch (error) {
                if (window.ExperimentLogger) {
                    window.ExperimentLogger.log('Queued request failed: ' + error.message);
                }
                // Optionally re-queue failed requests
                break;
            }
        }
        
        this.processing = false;
    }
    
    clear() {
        this.queue = [];
    }
    
    getStatus() {
        return {
            pending: this.queue.length,
            processing: this.processing
        };
    }
}

// Create a global request queue instance
const globalRequestQueue = new RequestQueue();

// Start processing queue when connection is restored
window.addEventListener('online', () => {
    globalRequestQueue.process();
});

// Export all network functions
window.ExperimentNetwork = {
    testConnection,
    saveResultsToSheet,
    sendAdminRequest,
    checkNetworkStatus,
    performDetailedConnectionTest,
    retryOperation,
    sendBatchData,
    fetchWithTimeout,
    classifyNetworkError,
    startNetworkMonitoring,
    RequestQueue,
    globalRequestQueue
};