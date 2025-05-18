// Timer management and timeout handling - Updated to track timeouts in trialResults

// Timer utilities
function cleanupTimers() {
    const state = window.ExperimentConfig.state;
    
    if (state.trialTimeout) {
        clearTimeout(state.trialTimeout);
        state.trialTimeout = null;
    }
    
    const timeoutMessage = document.getElementById('timeoutMessage');
    const timerDisplay = document.getElementById('timerDisplay');
    
    if (timeoutMessage) timeoutMessage.style.display = 'none';
    
    if (timerDisplay && window.LanguageManager) {
        timerDisplay.textContent = window.LanguageManager.getText('timerDisplay') + "00:00";
        timerDisplay.style.display = 'none';
    }
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('All timers cleared');
    }
}

function startResponseTimer() {
    const state = window.ExperimentConfig.state;
    const config = window.ExperimentConfig.config;
    
    state.trialStartTime = Date.now();
    updateTimerDisplay();
    
    // Update timer display interval (admin mode only)
    const timerInterval = setInterval(() => {
        if (!state.isRunning && !state.isPracticeRunning) {
            clearInterval(timerInterval);
            return;
        }
        updateTimerDisplay();
    }, 100);
    
    // Set timeout for trial
    state.trialTimeout = setTimeout(() => {
        if (state.isRunning || state.isPracticeRunning) {
            handleTimeout();
        }
    }, config.responseTimeLimit);
}

function updateTimerDisplay() {
    const state = window.ExperimentConfig.state;
    const timerDisplay = document.getElementById('timerDisplay');
    
    if (!state.isRunning && !state.isPracticeRunning) return;
    if (!window.ExperimentConfig.isAdminModeActive) return;
    if (!timerDisplay) return;
    
    const elapsedTime = Date.now() - state.trialStartTime;
    const seconds = Math.floor(elapsedTime / 1000);
    const milliseconds = Math.floor((elapsedTime % 1000) / 10);
    
    const timeText = window.LanguageManager ? window.LanguageManager.getText('timerDisplay') : 'Time: ';
    timerDisplay.textContent = timeText + 
        seconds.toString().padStart(2, '0') + ":" + 
        milliseconds.toString().padStart(2, '0');
}

// Updated to properly track timeouts in trialResults
function handleTimeout() {
    const state = window.ExperimentConfig.state;
    
    if (!state.isRunning && !state.isPracticeRunning) return;
    
    if (state.isPracticeRunning) {
        handlePracticeTimeout();
        return;
    }
    
    // Main experiment timeout
    const timeoutMessage = document.getElementById('timeoutMessage');
    if (timeoutMessage) timeoutMessage.style.display = 'block';
    
    if (window.ExperimentUI && window.ExperimentUI.disableResponses) {
        window.ExperimentUI.disableResponses();
    }
    
    state.isRunning = false;
    
    const config = window.ExperimentConfig.config;
    state.responseTimes.push(config.responseTimeLimit / 1000);
    state.timeoutTrials.push(state.currentTrial);
    
    // Record timeout in trial results array
    state.trialResults.push('timeout');
    
    state.currentTrial++;
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log(`Trial ${state.currentTrial}: Timeout - no response within ${config.responseTimeLimit / 1000} seconds`);
    }
    
    if (window.ExperimentUI && window.ExperimentUI.updateResults) {
        window.ExperimentUI.updateResults();
    }
    
    setTimeout(() => {
        if (timeoutMessage) timeoutMessage.style.display = 'none';
        
        if (state.currentTrial >= config.numTrials) {
            if (window.ExperimentMain && window.ExperimentMain.experimentComplete) {
                window.ExperimentMain.experimentComplete();
            }
        } else {
            setTimeout(() => {
                if (window.ExperimentMain && window.ExperimentMain.startTrial) {
                    window.ExperimentMain.startTrial();
                }
            }, 1000);
        }
    }, 1500);
}

function handlePracticeTimeout() {
    const state = window.ExperimentConfig.state;
    
    if (!state.isPracticeRunning) return;
    
    const timeoutMessage = document.getElementById('timeoutMessage');
    if (timeoutMessage) timeoutMessage.style.display = 'block';
    
    const practiceYes = document.getElementById('practiceYes');
    const practiceNo = document.getElementById('practiceNo');
    if (practiceYes) practiceYes.disabled = true;
    if (practiceNo) practiceNo.disabled = true;
    
    state.isPracticeRunning = false;
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log(`Practice trial ${state.currentPracticeTrial + 1}: Timeout`);
    }
    
    setTimeout(() => {
        if (timeoutMessage) timeoutMessage.style.display = 'none';
        
        const practiceFeedback = document.getElementById('practiceFeedback');
        if (practiceFeedback && window.LanguageManager) {
            practiceFeedback.textContent = window.LanguageManager.getText('practiceFeedbackIncorrect');
            practiceFeedback.style.color = 'red';
            practiceFeedback.style.display = 'block';
        }
        
        setTimeout(() => {
            if (window.ExperimentTraining && window.ExperimentTraining.retryAllPracticeTrials) {
                window.ExperimentTraining.retryAllPracticeTrials();
            }
        }, 5000);
    }, 1500);
}

// Instructions timer (for initial reading period)
function startInstructionsTimer() {
    let timeLeft = 5;
    const instructionsTimer = document.getElementById('instructionsTimer');
    const instructionsUnderstoodButton = document.getElementById('instructionsUnderstoodButton');
    
    const instructionsInterval = setInterval(function() {
        timeLeft--;
        
        if (instructionsTimer && window.LanguageManager) {
            instructionsTimer.textContent = window.LanguageManager.getText('instructionsTimerRemaining').replace('{0}', timeLeft);
        }
        
        if (timeLeft <= 0) {
            clearInterval(instructionsInterval);
            
            if (instructionsTimer && window.LanguageManager) {
                instructionsTimer.textContent = window.LanguageManager.getText('instructionsTimer');
            }
            
            if (instructionsUnderstoodButton && window.LanguageManager) {
                instructionsUnderstoodButton.disabled = false;
                instructionsUnderstoodButton.textContent = window.LanguageManager.getText('instructionsUnderstoodButton');
            }
        }
    }, 1000);
    
    return instructionsInterval;
}

// Generic countdown timer
function startCountdownTimer(duration, callback, updateCallback) {
    let timeLeft = duration;
    
    if (updateCallback) {
        updateCallback(timeLeft);
    }
    
    const interval = setInterval(() => {
        timeLeft--;
        
        if (updateCallback) {
            updateCallback(timeLeft);
        }
        
        if (timeLeft <= 0) {
            clearInterval(interval);
            if (callback) {
                callback();
            }
        }
    }, 1000);
    
    return interval;
}

// Delay function with timer cleanup
function delay(ms) {
    return new Promise(resolve => {
        const timeoutId = setTimeout(resolve, ms);
        
        // Store timeout ID for potential cleanup
        const state = window.ExperimentConfig.state;
        if (!state.activeTimeouts) {
            state.activeTimeouts = [];
        }
        state.activeTimeouts.push(timeoutId);
        
        // Remove from active timeouts when resolved
        setTimeout(() => {
            const index = state.activeTimeouts.indexOf(timeoutId);
            if (index > -1) {
                state.activeTimeouts.splice(index, 1);
            }
        }, ms);
    });
}

// Clear all active timeouts (useful for cleanup)
function clearAllTimeouts() {
    const state = window.ExperimentConfig.state;
    
    if (state.activeTimeouts) {
        state.activeTimeouts.forEach(timeoutId => {
            clearTimeout(timeoutId);
        });
        state.activeTimeouts = [];
    }
    
    // Also clear the main trial timeout
    if (state.trialTimeout) {
        clearTimeout(state.trialTimeout);
        state.trialTimeout = null;
    }
}

// Performance timing utilities
function measureResponseTime(startTime) {
    return (Date.now() - startTime) / 1000;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    
    if (mins > 0) {
        return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    } else {
        return `${secs}.${ms.toString().padStart(2, '0')}s`;
    }
}

// Experiment phase timing
function trackPhaseTime(phaseName, startCallback, endCallback) {
    const startTime = Date.now();
    
    if (startCallback) {
        startCallback(phaseName, startTime);
    }
    
    return function endPhase() {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        if (endCallback) {
            endCallback(phaseName, startTime, endTime, duration);
        }
        
        if (window.ExperimentLogger) {
            window.ExperimentLogger.log(`Phase '${phaseName}' completed in ${formatTime(duration / 1000)}`);
        }
        
        return duration;
    };
}

// Debounce function for preventing rapid successive calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export all timer functions
window.ExperimentTimers = {
    cleanupTimers,
    startResponseTimer,
    updateTimerDisplay,
    handleTimeout,
    handlePracticeTimeout,
    startInstructionsTimer,
    startCountdownTimer,
    delay,
    clearAllTimeouts,
    measureResponseTime,
    formatTime,
    trackPhaseTime,
    debounce
};