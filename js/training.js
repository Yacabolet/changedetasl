// Training sequences: no-change, change, and practice trials

// Training area helper functions
function clearTrainingArea(area) {
    while (area.firstChild) {
        area.removeChild(area.firstChild);
    }
}

function displayStimuliInTrainingArea(positions, area, colorIndices) {
    const config = window.ExperimentConfig.config;
    const stimuliColors = window.ExperimentConfig.stimuliColors;
    
    positions.forEach((pos, index) => {
        const stimulus = document.createElement('div');
        stimulus.className = 'stimulus';
        stimulus.style.left = pos.x + 'px';
        stimulus.style.top = pos.y + 'px';
        stimulus.style.width = config.stimulusSize + 'px';
        stimulus.style.height = config.stimulusSize + 'px';
        stimulus.style.backgroundColor = stimuliColors[colorIndices[index]];
        area.appendChild(stimulus);
    });
}

// No-change training implementation
function runNoChangeTraining() {
    const config = window.ExperimentConfig.config;
    const stimuliColors = window.ExperimentConfig.stimuliColors;
    const startNoChangeTraining = document.getElementById('startNoChangeTraining');
    const noChangeFeedback = document.getElementById('noChangeFeedback');
    const noChangeTrainingArea = document.getElementById('noChangeTrainingArea');
    
    if (startNoChangeTraining) startNoChangeTraining.disabled = true;
    if (noChangeFeedback) noChangeFeedback.style.display = 'none';
    
    // Generate training positions
    const trainingPositions = [];
    for (let i = 0; i < config.numStimuli; i++) {
        const x = Math.random() * config.maxPos * (noChangeTrainingArea.offsetWidth - config.stimulusSize);
        const y = Math.random() * config.maxPos * (noChangeTrainingArea.offsetHeight - config.stimulusSize);
        trainingPositions.push({ x, y });
    }
    
    // Generate random colors
    const trainingColorIndices = [];
    const shuffledIndices = [...Array(stimuliColors.length).keys()];
    for (let i = shuffledIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
    }
    
    for (let i = 0; i < config.numStimuli; i++) {
        trainingColorIndices.push(shuffledIndices[i % shuffledIndices.length]);
    }
    
    // Display stimuli
    clearTrainingArea(noChangeTrainingArea);
    displayStimuliInTrainingArea(trainingPositions, noChangeTrainingArea, trainingColorIndices);
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.logTrial('No-change training: displaying initial stimuli', 'No-change training: Phase 1');
    }
    
    // After study time, show blank screen
    setTimeout(() => {
        clearTrainingArea(noChangeTrainingArea);
        
        // After blank time, show test stimuli (identical)
        setTimeout(() => {
            displayStimuliInTrainingArea(trainingPositions, noChangeTrainingArea, trainingColorIndices);
            
            const noChangeTrainingYes = document.getElementById('noChangeTrainingYes');
            const noChangeTrainingNo = document.getElementById('noChangeTrainingNo');
            if (noChangeTrainingYes) noChangeTrainingYes.disabled = false;
            if (noChangeTrainingNo) noChangeTrainingNo.disabled = false;
            
            if (window.ExperimentLogger) {
                window.ExperimentLogger.logTrial('No-change training: displaying test stimuli (no change)', 'No-change training: Phase 2');
            }
        }, config.blankTime);
    }, config.studyTime);
}

function handleNoChangeTrainingResponse(isChangeDetected) {
    const noChangeTrainingYes = document.getElementById('noChangeTrainingYes');
    const noChangeTrainingNo = document.getElementById('noChangeTrainingNo');
    const noChangeFeedback = document.getElementById('noChangeFeedback');
    const startNoChangeTraining = document.getElementById('startNoChangeTraining');
    const noChangeTrainingPage = document.getElementById('noChangeTrainingPage');
    const changeTrainingPage = document.getElementById('changeTrainingPage');
    
    if (noChangeTrainingYes) noChangeTrainingYes.disabled = true;
    if (noChangeTrainingNo) noChangeTrainingNo.disabled = true;
    
    if (isChangeDetected) {
        // Incorrect response
        if (noChangeFeedback && window.LanguageManager) {
            noChangeFeedback.textContent = window.LanguageManager.getText('noChangeFeedbackIncorrect');
            noChangeFeedback.style.color = 'red';
            noChangeFeedback.style.display = 'block';
        }
        
        if (window.ExperimentLogger) {
            window.ExperimentLogger.logTrial('No-change training: incorrect response ("yes")', 'No-change training: Response recorded');
        }
        
        setTimeout(function() {
            if (startNoChangeTraining) startNoChangeTraining.disabled = false;
            if (noChangeFeedback && window.LanguageManager) {
                noChangeFeedback.textContent += " " + window.LanguageManager.getText('noChangeFeedbackRetry');
            }
        }, 5000);
    } else {
        // Correct response
        if (noChangeFeedback && window.LanguageManager) {
            noChangeFeedback.textContent = window.LanguageManager.getText('noChangeFeedbackCorrect');
            noChangeFeedback.style.color = 'green';
            noChangeFeedback.style.display = 'block';
        }
        
        if (window.ExperimentLogger) {
            window.ExperimentLogger.logTrial('No-change training: correct response ("no")', 'No-change training: Response recorded');
        }
        
        setTimeout(function() {
            if (noChangeTrainingPage) noChangeTrainingPage.style.display = 'none';
            if (changeTrainingPage) {
                changeTrainingPage.style.display = 'block';
                if (window.ExperimentUI) {
                    window.ExperimentUI.setupChangeTrainingForDevice();
                }
            }
        }, 2000);
    }
}

// Change training implementation
function runChangeTraining() {
    const config = window.ExperimentConfig.config;
    const stimuliColors = window.ExperimentConfig.stimuliColors;
    const startChangeTraining = document.getElementById('startChangeTraining');
    const changeFeedback = document.getElementById('changeFeedback');
    const changeTrainingArea = document.getElementById('changeTrainingArea');
    
    if (startChangeTraining) startChangeTraining.disabled = true;
    if (changeFeedback) changeFeedback.style.display = 'none';
    
    // Generate initial positions
    const initialPositions = [];
    for (let i = 0; i < config.numStimuli; i++) {
        const x = Math.random() * config.maxPos * (changeTrainingArea.offsetWidth - config.stimulusSize);
        const y = Math.random() * config.maxPos * (changeTrainingArea.offsetHeight - config.stimulusSize);
        initialPositions.push({ x, y });
    }
    
    // Generate random colors
    const trainingColorIndices = [];
    const shuffledIndices = [...Array(stimuliColors.length).keys()];
    for (let i = shuffledIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
    }
    
    for (let i = 0; i < config.numStimuli; i++) {
        trainingColorIndices.push(shuffledIndices[i % shuffledIndices.length]);
    }
    
    // Display stimuli
    clearTrainingArea(changeTrainingArea);
    displayStimuliInTrainingArea(initialPositions, changeTrainingArea, trainingColorIndices);
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.logTrial('Change training: displaying initial stimuli', 'Change training: Phase 1');
    }
    
    // After study time, show blank screen
    setTimeout(() => {
        clearTrainingArea(changeTrainingArea);
        
        // After blank time, show test stimuli with changes
        setTimeout(() => {
            const numObjectsToMove = Math.floor(Math.random() * 
                (config.maxObjectsToMove - config.minObjectsToMove + 1)) + config.minObjectsToMove;
            
            const isSwapping = Math.random() < config.swapProbability;
            const changedPositions = [...initialPositions];
            
            if (isSwapping && numObjectsToMove === 2) {
                // Swap positions
                const indices = window.ExperimentUtils.getRandomIndices(config.numStimuli, 2);
                const temp = { ...changedPositions[indices[0]] };
                changedPositions[indices[0]] = { ...changedPositions[indices[1]] };
                changedPositions[indices[1]] = temp;
                
                if (window.ExperimentLogger) {
                    window.ExperimentLogger.logTrial(`Change training: Swapped positions of stimuli ${indices[0]} and ${indices[1]}`, 'Change training: Phase 2');
                }
            } else {
                // Move objects randomly with distance constraints
                const indices = window.ExperimentUtils.getRandomIndices(config.numStimuli, numObjectsToMove);
                indices.forEach(index => {
                    const oldPos = changedPositions[index];
                    let newPos;
                    let distance;
                    let attempts = 0;
                    
                    do {
                        const newX = Math.random() * config.maxPos * (changeTrainingArea.offsetWidth - config.stimulusSize);
                        const newY = Math.random() * config.maxPos * (changeTrainingArea.offsetHeight - config.stimulusSize);
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
                    
                    changedPositions[index] = newPos;
                });
                
                if (window.ExperimentLogger) {
                    window.ExperimentLogger.logTrial(`Change training: Changed positions of ${numObjectsToMove} stimuli: ${indices.join(', ')}`, 'Change training: Phase 2');
                }
            }
            
            // Display changed stimuli
            displayStimuliInTrainingArea(changedPositions, changeTrainingArea, trainingColorIndices);
            
            const changeTrainingYes = document.getElementById('changeTrainingYes');
            const changeTrainingNo = document.getElementById('changeTrainingNo');
            if (changeTrainingYes) changeTrainingYes.disabled = false;
            if (changeTrainingNo) changeTrainingNo.disabled = false;
        }, config.blankTime);
    }, config.studyTime);
}

function handleChangeTrainingResponse(isChangeDetected) {
    const changeTrainingYes = document.getElementById('changeTrainingYes');
    const changeTrainingNo = document.getElementById('changeTrainingNo');
    const changeFeedback = document.getElementById('changeFeedback');
    const startChangeTraining = document.getElementById('startChangeTraining');
    
    if (changeTrainingYes) changeTrainingYes.disabled = true;
    if (changeTrainingNo) changeTrainingNo.disabled = true;
    
    if (isChangeDetected) {
        // Correct response
        if (changeFeedback && window.LanguageManager) {
            changeFeedback.textContent = window.LanguageManager.getText('changeFeedbackCorrect');
            changeFeedback.style.color = 'green';
            changeFeedback.style.display = 'block';
        }
        
        if (window.ExperimentLogger) {
            window.ExperimentLogger.logTrial('Change training: correct response ("yes")', 'Change training: Response recorded');
        }
        
        setTimeout(function() {
            showPracticeTrialsPage();
        }, 2000);
    } else {
        // Incorrect response
        if (changeFeedback && window.LanguageManager) {
            changeFeedback.textContent = window.LanguageManager.getText('changeFeedbackIncorrect');
            changeFeedback.style.color = 'red';
            changeFeedback.style.display = 'block';
        }
        
        if (window.ExperimentLogger) {
            window.ExperimentLogger.logTrial('Change training: incorrect response ("no")', 'Change training: Response recorded');
        }
        
        setTimeout(function() {
            if (startChangeTraining) startChangeTraining.disabled = false;
            if (changeFeedback && window.LanguageManager) {
                changeFeedback.textContent += " " + window.LanguageManager.getText('changeFeedbackRetry');
            }
        }, 5000);
    }
}

// Show practice trials page
function showPracticeTrialsPage() {
    const changeTrainingPage = document.getElementById('changeTrainingPage');
    const practiceTrialsPage = document.getElementById('practiceTrialsPage');
    
    if (changeTrainingPage) changeTrainingPage.style.display = 'none';
    if (practiceTrialsPage) {
        practiceTrialsPage.style.display = 'block';
        if (window.ExperimentUI) {
            window.ExperimentUI.setupPracticePageForDevice();
        }
        initPracticeTrials();
    }
}

// Practice trials implementation
function initPracticeTrials() {
    const state = window.ExperimentConfig.state;
    
    state.practiceTrials = [];
    state.currentPracticeTrial = 0;
    state.practiceCorrect = 0;
    state.practiceAttempt = 0;
    
    // Generate 3 practice trials
    for (let i = 0; i < 3; i++) {
        state.practiceTrials.push({
            hasChange: Math.random() < 0.5,
            positions: [],
            testPositions: [],
            colorIndices: []
        });
    }
    
    updatePracticeTrialNumber();
}

function runPracticeTrial() {
    const state = window.ExperimentConfig.state;
    const config = window.ExperimentConfig.config;
    const stimuliColors = window.ExperimentConfig.stimuliColors;
    
    if (state.currentPracticeTrial >= 3) {
        completePracticeTrials();
        return;
    }
    
    state.isPracticeRunning = true;
    
    const startPracticeTrial = document.getElementById('startPracticeTrial');
    const practiceFeedback = document.getElementById('practiceFeedback');
    const practiceArea = document.getElementById('practiceArea');
    
    if (startPracticeTrial) startPracticeTrial.disabled = true;
    if (practiceFeedback) practiceFeedback.style.display = 'none';
    
    const trial = state.practiceTrials[state.currentPracticeTrial];
    
    // Generate random positions
    trial.positions = [];
    for (let i = 0; i < config.numStimuli; i++) {
        const x = Math.random() * config.maxPos * (practiceArea.offsetWidth - config.stimulusSize);
        const y = Math.random() * config.maxPos * (practiceArea.offsetHeight - config.stimulusSize);
        trial.positions.push({ x, y });
    }
    
    // Generate random colors
    trial.colorIndices = [];
    const shuffledIndices = [...Array(stimuliColors.length).keys()];
    for (let i = shuffledIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
    }
    for (let i = 0; i < config.numStimuli; i++) {
        trial.colorIndices.push(shuffledIndices[i % shuffledIndices.length]);
    }
    
    // Display initial stimuli
    clearPracticeArea(practiceArea);
    displayStimuliInPracticeArea(trial.positions, practiceArea, trial.colorIndices);
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.logTrial(
            `Practice trial ${state.currentPracticeTrial + 1}: ${trial.hasChange ? 'Change' : 'No change'}`,
            `Practice trial ${state.currentPracticeTrial + 1}: Started`
        );
    }
    
    // After study time, blank screen
    setTimeout(() => {
        clearPracticeArea(practiceArea);
        
        // After blank time, show test stimuli
        setTimeout(() => {
            trial.testPositions = [...trial.positions];
            
            if (trial.hasChange) {
                // Apply changes using same logic as main experiment
                const numObjectsToMove = Math.floor(Math.random() * 
                    (config.maxObjectsToMove - config.minObjectsToMove + 1)) + config.minObjectsToMove;
                
                const isSwapping = Math.random() < config.swapProbability;
                
                if (isSwapping && numObjectsToMove === 2) {
                    const indices = window.ExperimentUtils.getRandomIndices(config.numStimuli, 2);
                    const temp = { ...trial.testPositions[indices[0]] };
                    trial.testPositions[indices[0]] = { ...trial.testPositions[indices[1]] };
                    trial.testPositions[indices[1]] = temp;
                } else {
                    const indices = window.ExperimentUtils.getRandomIndices(config.numStimuli, numObjectsToMove);
                    indices.forEach(index => {
                        const oldPos = trial.testPositions[index];
                        let newPos;
                        let distance;
                        let attempts = 0;
                        
                        do {
                            const newX = Math.random() * config.maxPos * (practiceArea.offsetWidth - config.stimulusSize);
                            const newY = Math.random() * config.maxPos * (practiceArea.offsetHeight - config.stimulusSize);
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
                        
                        trial.testPositions[index] = newPos;
                    });
                }
            }
            
            // Display test stimuli
            displayStimuliInPracticeArea(trial.testPositions, practiceArea, trial.colorIndices);
            
            // Enable responses and start timer
            const practiceYes = document.getElementById('practiceYes');
            const practiceNo = document.getElementById('practiceNo');
            if (practiceYes) practiceYes.disabled = false;
            if (practiceNo) practiceNo.disabled = false;
            
            if (window.ExperimentTimers) {
                window.ExperimentTimers.startResponseTimer();
            }
            
        }, config.blankTime);
    }, config.studyTime);
}

function processPracticeResponse(response) {
    const state = window.ExperimentConfig.state;
    
    if (!state.isPracticeRunning) return;
    
    // Clear the timeout
    if (window.ExperimentTimers) {
        window.ExperimentTimers.cleanupTimers();
    }
    
    const practiceYes = document.getElementById('practiceYes');
    const practiceNo = document.getElementById('practiceNo');
    const practiceFeedback = document.getElementById('practiceFeedback');
    const startPracticeTrial = document.getElementById('startPracticeTrial');
    
    if (practiceYes) practiceYes.disabled = true;
    if (practiceNo) practiceNo.disabled = true;
    state.isPracticeRunning = false;
    
    const trial = state.practiceTrials[state.currentPracticeTrial];
    const isCorrect = (response === 'yes' && trial.hasChange) || 
                      (response === 'no' && !trial.hasChange);
    
    if (isCorrect) {
        state.practiceCorrect++;
        if (practiceFeedback && window.LanguageManager) {
            practiceFeedback.textContent = window.LanguageManager.getText('practiceFeedbackCorrect');
            practiceFeedback.style.color = 'green';
            practiceFeedback.style.display = 'block';
        }
        
        state.currentPracticeTrial++;
        
        if (state.currentPracticeTrial < 3) {
            updatePracticeTrialNumber();
            setTimeout(() => {
                if (practiceFeedback) practiceFeedback.style.display = 'none';
                if (startPracticeTrial) startPracticeTrial.disabled = false;
            }, 1500);
        } else {
            // All trials completed
            setTimeout(completePracticeTrials, 1500);
        }
    } else {
        if (practiceFeedback && window.LanguageManager) {
            practiceFeedback.textContent = window.LanguageManager.getText('practiceFeedbackIncorrect');
            practiceFeedback.style.color = 'red';
            practiceFeedback.style.display = 'block';
        }
        
        // After 5 seconds, restart all practice trials
        setTimeout(retryAllPracticeTrials, 5000);
    }
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.logTrial(
            `Practice trial ${state.currentPracticeTrial + 1}: User responded "${response}", ${isCorrect ? 'correct' : 'incorrect'}`,
            `Practice trial ${state.currentPracticeTrial + 1}: Response recorded`
        );
    }
}

function retryAllPracticeTrials() {
    const state = window.ExperimentConfig.state;
    const practiceFeedback = document.getElementById('practiceFeedback');
    const startPracticeTrial = document.getElementById('startPracticeTrial');
    
    if (practiceFeedback && window.LanguageManager) {
        practiceFeedback.textContent = window.LanguageManager.getText('practiceFeedbackRetry');
        practiceFeedback.style.color = 'red';
    }
    
    setTimeout(() => {
        // Reset practice trials
        state.currentPracticeTrial = 0;
        state.practiceCorrect = 0;
        state.practiceAttempt++;
        
        // Generate new practice trials
        initPracticeTrials();
        
        if (practiceFeedback) practiceFeedback.style.display = 'none';
        if (startPracticeTrial) startPracticeTrial.disabled = false;
    }, 5000);
}

function completePracticeTrials() {
    const practiceFeedback = document.getElementById('practiceFeedback');
    const practiceTrialsPage = document.getElementById('practiceTrialsPage');
    const experimentArea = document.getElementById('experimentArea');
    
    if (practiceFeedback && window.LanguageManager) {
        practiceFeedback.textContent = window.LanguageManager.getText('practiceFeedbackComplete');
        practiceFeedback.style.color = 'green';
    }
    
    setTimeout(() => {
        if (practiceTrialsPage) practiceTrialsPage.style.display = 'none';
        if (experimentArea) {
            experimentArea.style.display = 'block';
            if (window.ExperimentUI) {
                window.ExperimentUI.setupExperimentAreaForDevice();
            }
            if (window.ExperimentMain) {
                window.ExperimentMain.initExperiment();
            }
        }
    }, 3000);
}

function updatePracticeTrialNumber() {
    const state = window.ExperimentConfig.state;
    const practiceTrialNumber = document.getElementById('practiceTrialNumber');
    
    if (practiceTrialNumber && window.LanguageManager) {
        practiceTrialNumber.textContent = window.LanguageManager.getText('practiceTrialNumber').replace('{0}', state.currentPracticeTrial + 1);
    }
}

// Practice area helper functions
function clearPracticeArea(area) {
    while (area.firstChild) {
        area.removeChild(area.firstChild);
    }
}

function displayStimuliInPracticeArea(positions, area, colorIndices) {
    const config = window.ExperimentConfig.config;
    const stimuliColors = window.ExperimentConfig.stimuliColors;
    
    positions.forEach((pos, index) => {
        const stimulus = document.createElement('div');
        stimulus.className = 'stimulus';
        stimulus.style.left = pos.x + 'px';
        stimulus.style.top = pos.y + 'px';
        stimulus.style.width = config.stimulusSize + 'px';
        stimulus.style.height = config.stimulusSize + 'px';
        stimulus.style.backgroundColor = stimuliColors[colorIndices[index]];
        area.appendChild(stimulus);
    });
}

// Export all training functions
window.ExperimentTraining = {
    clearTrainingArea,
    displayStimuliInTrainingArea,
    runNoChangeTraining,
    handleNoChangeTrainingResponse,
    runChangeTraining,
    handleChangeTrainingResponse,
    showPracticeTrialsPage,
    initPracticeTrials,
    runPracticeTrial,
    processPracticeResponse,
    retryAllPracticeTrials,
    completePracticeTrials,
    updatePracticeTrialNumber,
    clearPracticeArea,
    displayStimuliInPracticeArea
};