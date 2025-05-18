// Main experiment logic and trial management

// Initialize experiment
function initExperiment() {
    const state = window.ExperimentConfig.state;
    const startButton = document.getElementById('startButton');
    const responseYes = document.getElementById('responseYes');
    const responseNo = document.getElementById('responseNo');
    const resultsDiv = document.getElementById('results');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const savingMessage = document.getElementById('savingMessage');
    const showResultsButton = document.getElementById('showResultsButton');
    const showLogButton = document.getElementById('showLogButton');
    const openSpreadsheetButton = document.getElementById('openSpreadsheetButton');
    const retryButton = document.getElementById('retryButton');
    const stimuliArea = document.getElementById('stimuliArea');
    const debugInfo = document.getElementById('debugInfo');
    
    state.currentTrial = 0;
    state.correctResponses = 0;
    state.dataSaved = false;
    state.responseTimes = [];
    state.timeoutTrials = [];
    
    // Ensure result elements exist
    if (window.ExperimentUI) {
        window.ExperimentUI.ensureResultElements();
    }
    
    // Update results display
    if (window.ExperimentUI && window.ExperimentUI.updateResults) {
        window.ExperimentUI.updateResults();
    }
    
    // Setup UI state
    if (startButton) {
        startButton.disabled = false;
        startButton.style.display = 'block';
    }
    if (responseYes) responseYes.disabled = true;
    if (responseNo) responseNo.disabled = true;
    
    // Hide completion screens
    if (resultsDiv) resultsDiv.style.display = 'none';
    if (thankYouMessage) thankYouMessage.style.display = 'none';
    if (savingMessage) savingMessage.style.display = 'none';
    if (showResultsButton) showResultsButton.style.display = 'none';
    if (showLogButton) showLogButton.style.display = 'none';
    if (openSpreadsheetButton) openSpreadsheetButton.style.display = 'none';
    if (retryButton) retryButton.style.display = 'none';
    
    // Show experiment elements
    if (stimuliArea) stimuliArea.style.display = 'block';
    
    // Hide debug info unless in admin mode
    if (debugInfo) {
        debugInfo.style.display = window.ExperimentConfig.isAdminModeActive ? 'block' : 'none';
        debugInfo.innerHTML = '';
    }
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('Experiment initialized');
    }
}

// Start a single trial
function startTrial() {
    const state = window.ExperimentConfig.state;
    const config = window.ExperimentConfig.config;
    const stimuliArea = document.getElementById('stimuliArea');
    const startButton = document.getElementById('startButton');
    const controlPanelButton = document.getElementById('controlPanelButton');
    
    state.isRunning = true;
    clearStimuliArea();
    
    // Hide Control Panel button during trials
    if (controlPanelButton) controlPanelButton.style.display = "none";
    
    // Hide start button during experiment
    if (startButton) startButton.style.display = 'none';
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.logTrial(`Starting trial ${state.currentTrial + 1} of ${config.numTrials}`, `Starting trial ${state.currentTrial + 1}`);
    }
    
    // Generate stimuli positions
    state.stimuliPositions = [];
    for (let i = 0; i < config.numStimuli; i++) {
        const x = Math.random() * config.maxPos * (stimuliArea.offsetWidth - config.stimulusSize);
        const y = Math.random() * config.maxPos * (stimuliArea.offsetHeight - config.stimulusSize);
        state.stimuliPositions.push({ x, y });
    }
    
    // Randomize colors for this trial
    if (window.ExperimentUtils) {
        window.ExperimentUtils.randomizeColors();
    }
    
    // Display stimuli
    displayStimuli(state.stimuliPositions);
    
    // After study time, show blank screen
    setTimeout(() => {
        clearStimuliArea();
        
        // After blank time, show test stimuli
        setTimeout(() => {
            // Determine if there's a change
            state.hasChange = Math.random() < config.changeProb;
            
            let testPositions = [...state.stimuliPositions];
            if (state.hasChange) {
                testPositions = applyChangesToPositions(testPositions);
            } else {
                if (window.ExperimentLogger) {
                    window.ExperimentLogger.logTrial(`Trial ${state.currentTrial + 1}: No change`, `Trial ${state.currentTrial + 1}: Stimuli displayed`);
                }
            }
            
            displayStimuli(testPositions);
            
            if (window.ExperimentUI) {
                window.ExperimentUI.enableResponses();
            }
            
            if (window.ExperimentTimers) {
                window.ExperimentTimers.startResponseTimer();
            }
            
        }, config.blankTime);
    }, config.studyTime);
}

// Apply changes to stimulus positions
function applyChangesToPositions(positions) {
    const state = window.ExperimentConfig.state;
    const config = window.ExperimentConfig.config;
    const stimuliArea = document.getElementById('stimuliArea');
    
    // Determine how many objects will move
    const numObjectsToMove = Math.floor(Math.random() * 
        (config.maxObjectsToMove - config.minObjectsToMove + 1)) + config.minObjectsToMove;
    
    // Decide if we're swapping or moving randomly
    const isSwapping = Math.random() < config.swapProbability;
    
    if (isSwapping && numObjectsToMove === 2) {
        // Swap positions of two random objects
        const indices = window.ExperimentUtils.getRandomIndices(config.numStimuli, 2);
        const temp = { ...positions[indices[0]] };
        positions[indices[0]] = { ...positions[indices[1]] };
        positions[indices[1]] = temp;
        
        if (window.ExperimentLogger) {
            window.ExperimentLogger.logTrial(`Trial ${state.currentTrial + 1}: Swapped positions of stimuli ${indices[0]} and ${indices[1]}`, `Trial ${state.currentTrial + 1}: Stimuli updated`);
        }
    } else {
        // Move random objects with distance constraints
        const indices = window.ExperimentUtils.getRandomIndices(config.numStimuli, numObjectsToMove);
        indices.forEach(index => {
            const oldPos = positions[index];
            let newPos;
            let distance;
            let attempts = 0;
            
            do {
                const newX = Math.random() * config.maxPos * (stimuliArea.offsetWidth - config.stimulusSize);
                const newY = Math.random() * config.maxPos * (stimuliArea.offsetHeight - config.stimulusSize);
                newPos = { x: newX, y: newY };
                
                distance = Math.sqrt(
                    Math.pow(newPos.x - oldPos.x, 2) + 
                    Math.pow(newPos.y - oldPos.y, 2)
                );
                
                attempts++;
                if (attempts > 100) break;
            } while (
                distance < config.minMoveDistance() || 
                distance > config.maxMoveDistance()
            );
            
            positions[index] = newPos;
        });
        
        if (window.ExperimentLogger) {
            window.ExperimentLogger.logTrial(`Trial ${state.currentTrial + 1}: Changed positions of ${numObjectsToMove} stimuli: ${indices.join(', ')}`, `Trial ${state.currentTrial + 1}: Stimuli updated`);
        }
    }
    
    return positions;
}

// Display stimuli on screen
function displayStimuli(positions) {
    const state = window.ExperimentConfig.state;
    const config = window.ExperimentConfig.config;
    const stimuliColors = window.ExperimentConfig.stimuliColors;
    const stimuliArea = document.getElementById('stimuliArea');
    
    clearStimuliArea();
    positions.forEach((pos, index) => {
        const stimulus = document.createElement('div');
        stimulus.className = 'stimulus';
        stimulus.style.left = pos.x + 'px';
        stimulus.style.top = pos.y + 'px';
        stimulus.style.width = config.stimulusSize + 'px';
        stimulus.style.height = config.stimulusSize + 'px';
        stimulus.style.backgroundColor = stimuliColors[state.stimuliColorIndices[index]];
        stimuliArea.appendChild(stimulus);
    });
}

// Clear stimuli area
function clearStimuliArea() {
    const stimuliArea = document.getElementById('stimuliArea');
    if (stimuliArea) {
        while (stimuliArea.firstChild) {
            stimuliArea.removeChild(stimuliArea.firstChild);
        }
    }
}

// Process user response
function processResponse(response) {
    const state = window.ExperimentConfig.state;
    const config = window.ExperimentConfig.config;
    
    if (!state.isRunning) return;
    
    // Clear timeout and disable responses
    if (window.ExperimentTimers && window.ExperimentTimers.cleanupTimers) {
        window.ExperimentTimers.cleanupTimers();
    }
    
    if (window.ExperimentUI) {
        window.ExperimentUI.disableResponses();
    }
    
    state.isRunning = false;
    
    // Calculate and record response time
    const responseTime = (Date.now() - state.trialStartTime) / 1000;
    state.responseTimes.push(responseTime);
    
    // Check if response was correct
    const isCorrect = (response === 'yes' && state.hasChange) || 
                     (response === 'no' && !state.hasChange);
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.logTrial(
            `Trial ${state.currentTrial + 1}: User responded "${response}" in ${responseTime.toFixed(2)} seconds, which is ${isCorrect ? 'correct' : 'incorrect'}`,
            `Trial ${state.currentTrial + 1}: User responded "${response}" in ${responseTime.toFixed(2)} seconds`
        );
    }
    
    if (isCorrect) {
        state.correctResponses++;
    }
    
    state.currentTrial++;
    
    // Update trial counter display
    const experimentTrialInfo = document.getElementById('experimentTrialInfo');
    if (experimentTrialInfo && experimentTrialInfo.style.display !== 'none' && window.LanguageManager) {
        experimentTrialInfo.innerHTML = window.LanguageManager.getText('trialCounter')
            .replace('{0}', `<span id="currentTrialDisplay">${state.currentTrial}</span>`)
            .replace('{1}', `<span id="totalTrialsDisplay">${config.numTrials}</span>`);
    }
    
    try {
        if (window.ExperimentUI && window.ExperimentUI.updateResults) {
            window.ExperimentUI.updateResults();
        }
        
        if (state.currentTrial >= config.numTrials) {
            experimentComplete();
        } else {
            setTimeout(startTrial, 1000);
        }
    } catch (error) {
        if (window.ExperimentLogger) {
            window.ExperimentLogger.logError(error, 'processResponse');
        }
        
        if (state.currentTrial >= config.numTrials) {
            experimentComplete();
        } else {
            setTimeout(startTrial, 1000);
        }
    }
}

// Complete experiment
function experimentComplete() {
    const state = window.ExperimentConfig.state;
    const experimentArea = document.getElementById('experimentArea');
    const startButton = document.getElementById('startButton');
    const controlPanelButton = document.getElementById('controlPanelButton');
    const savingMessage = document.getElementById('savingMessage');
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log(`Experiment complete. Score: ${state.correctResponses}/${state.currentTrial}`);
    }
    
    if (window.ExperimentTimers) {
        window.ExperimentTimers.cleanupTimers();
    }
    
    if (experimentArea) experimentArea.style.display = 'none';
    if (startButton) startButton.style.display = 'block';
    
    if (controlPanelButton && window.LanguageManager) {
        controlPanelButton.style.display = window.LanguageManager.getCurrentLanguage() === "he" ? "none" : "block";
    }
    
    if (savingMessage) savingMessage.style.display = 'block';
    
    if (window.ExperimentNetwork && window.ExperimentNetwork.saveResultsToSheet) {
        window.ExperimentNetwork.saveResultsToSheet();
    }
}

// Experiment state utilities
function pauseExperiment() {
    const state = window.ExperimentConfig.state;
    
    if (state.isRunning) {
        state.isRunning = false;
        
        if (window.ExperimentTimers) {
            window.ExperimentTimers.cleanupTimers();
        }
        
        if (window.ExperimentLogger) {
            window.ExperimentLogger.log('Experiment paused');
        }
    }
}

function resumeExperiment() {
    const state = window.ExperimentConfig.state;
    const config = window.ExperimentConfig.config;
    
    if (!state.isRunning && state.currentTrial < config.numTrials) {
        if (window.ExperimentLogger) {
            window.ExperimentLogger.log('Experiment resumed');
        }
        
        setTimeout(startTrial, 1000);
    }
}

function getExperimentProgress() {
    const state = window.ExperimentConfig.state;
    const config = window.ExperimentConfig.config;
    
    return {
        currentTrial: state.currentTrial,
        totalTrials: config.numTrials,
        correctResponses: state.correctResponses,
        accuracy: state.currentTrial > 0 ? (state.correctResponses / state.currentTrial * 100).toFixed(1) : '0',
        averageResponseTime: state.responseTimes.length > 0 ? 
            (state.responseTimes.reduce((a, b) => a + b, 0) / state.responseTimes.length).toFixed(2) : '0',
        timeoutTrials: state.timeoutTrials.length,
        isComplete: state.currentTrial >= config.numTrials,
        isRunning: state.isRunning
    };
}

function resetExperiment() {
    const state = window.ExperimentConfig.state;
    
    // Stop any running timers
    if (window.ExperimentTimers) {
        window.ExperimentTimers.cleanupTimers();
    }
    
    // Reset state
    state.currentTrial = 0;
    state.correctResponses = 0;
    state.isRunning = false;
    state.dataSaved = false;
    state.responseTimes = [];
    state.timeoutTrials = [];
    state.stimuliPositions = [];
    state.hasChange = false;
    state.stimuliColorIndices = [];
    
    // Clear display areas
    clearStimuliArea();
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('Experiment reset');
    }
    
    // Reinitialize
    initExperiment();
}

// Data collection utilities
function getTrialData() {
    const state = window.ExperimentConfig.state;
    
    return {
        participantId: window.ExperimentConfig.participantId,
        deviceId: window.ExperimentConfig.deviceId,
        currentTrial: state.currentTrial,
        totalTrials: window.ExperimentConfig.config.numTrials,
        correctResponses: state.correctResponses,
        responseTimes: [...state.responseTimes],
        timeoutTrials: [...state.timeoutTrials],
        accuracy: state.currentTrial > 0 ? (state.correctResponses / state.currentTrial * 100).toFixed(1) : '0',
        isComplete: state.currentTrial >= window.ExperimentConfig.config.numTrials,
        language: window.LanguageManager ? window.LanguageManager.getCurrentLanguage() : 'unknown',
        isMobile: window.ExperimentConfig.isMobile,
        adminMode: window.ExperimentConfig.isAdminModeActive
    };
}

function validateTrialData() {
    const state = window.ExperimentConfig.state;
    const config = window.ExperimentConfig.config;
    
    const issues = [];
    
    if (state.responseTimes.length !== state.currentTrial) {
        issues.push('Response times count mismatch');
    }
    
    if (state.correctResponses > state.currentTrial) {
        issues.push('Correct responses exceed total trials');
    }
    
    if (state.currentTrial > config.numTrials) {
        issues.push('Current trial exceeds configured maximum');
    }
    
    state.responseTimes.forEach((time, index) => {
        if (time < 0 || time > config.responseTimeLimit / 1000) {
            issues.push(`Invalid response time at trial ${index + 1}: ${time}s`);
        }
    });
    
    return {
        isValid: issues.length === 0,
        issues: issues
    };
}

// Export all experiment functions
window.ExperimentMain = {
    initExperiment,
    startTrial,
    applyChangesToPositions,
    displayStimuli,
    clearStimuliArea,
    processResponse,
    experimentComplete,
    pauseExperiment,
    resumeExperiment,
    getExperimentProgress,
    resetExperiment,
    getTrialData,
    validateTrialData
};