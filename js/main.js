// Main initialization and event handler setup - Updated to remove participant ID handling

// Initialize on page load
function initializeApp() {
    // Generate or retrieve device ID
    const deviceId = window.ExperimentUtils.getDeviceId();
    window.ExperimentConfig.deviceId = deviceId;
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('Device ID: ' + deviceId);
    }
    
    // Check device type and adjust interface
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log(`Device type: ${window.ExperimentConfig.isMobile ? 'Mobile' : 'Desktop'}`);
    }
    
    // Check local storage availability
    if (window.ExperimentUtils.isLocalStorageAvailable()) {
        if (window.ExperimentLogger) {
            window.ExperimentLogger.log('Local storage is available');
        }
    } else {
        if (window.ExperimentLogger) {
            window.ExperimentLogger.log('WARNING: Local storage is not available');
        }
    }
    
    // Set initial language
    if (window.LanguageManager) {
        window.LanguageManager.updateLanguage();
    }
    
    // Initialize admin controls
    if (window.ExperimentAdmin) {
        window.ExperimentAdmin.initAdminControls();
    }
    
    // Initialize UI system
    if (window.ExperimentUI) {
        window.ExperimentUI.initializeUI();
    }
    
    // Setup all event listeners
    setupEventListeners();
    
    // Test internet connection
    if (window.ExperimentNetwork) {
        window.ExperimentNetwork.testConnection();
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Retry connection button
    const retryConnectionButton = document.getElementById('retryConnectionButton');
    if (retryConnectionButton) {
        retryConnectionButton.addEventListener('click', function() {
            if (window.ExperimentNetwork) {
                window.ExperimentNetwork.testConnection();
            }
        });
    }

    // Instructions understood button
    const instructionsUnderstoodButton = document.getElementById('instructionsUnderstoodButton');
    if (instructionsUnderstoodButton) {
        instructionsUnderstoodButton.addEventListener('click', handleInstructionsUnderstood);
    }

    // Training event listeners
    setupTrainingEventListeners();

    // Practice trials event listeners
    setupPracticeEventListeners();

    // Main experiment event listeners
    setupMainExperimentEventListeners();

    // Result and completion event listeners
    setupResultEventListeners();

    // Keyboard shortcuts
    setupKeyboardShortcuts();
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('All event listeners setup complete');
    }
}

// Handle instructions understood - simplified without participant ID checks
function handleInstructionsUnderstood() {
    proceedToTraining();
}

// Start instruction sequence - simplified 
function startInstructionSequence() {
    if (window.ExperimentUI) {
        window.ExperimentUI.showPage('instructionsPage');
    }
    
    if (window.ExperimentUI && window.ExperimentUI.startInstructionsTimer) {
        window.ExperimentUI.startInstructionsTimer();
    }
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('Showing instruction sequence');
    }
}

// Proceed to training
function proceedToTraining() {
    if (window.ExperimentUI) {
        window.ExperimentUI.showPage('noChangeTrainingPage', ['instructionsPage']);
        window.ExperimentUI.setupNoChangeTrainingForDevice();
    }
    
    if (window.ExperimentLogger) {
        window.ExperimentLogger.log('Moving to no-change training page');
    }
}

// Setup training event listeners
function setupTrainingEventListeners() {
    // No-change training
    const startNoChangeTraining = document.getElementById('startNoChangeTraining');
    if (startNoChangeTraining) {
        startNoChangeTraining.addEventListener('click', function() {
            if (window.ExperimentTraining) {
                window.ExperimentTraining.runNoChangeTraining();
            }
        });
    }
    
    const noChangeTrainingYes = document.getElementById('noChangeTrainingYes');
    if (noChangeTrainingYes) {
        noChangeTrainingYes.addEventListener('click', function() {
            if (window.ExperimentTraining) {
                window.ExperimentTraining.handleNoChangeTrainingResponse(true);
            }
        });
    }
    
    const noChangeTrainingNo = document.getElementById('noChangeTrainingNo');
    if (noChangeTrainingNo) {
        noChangeTrainingNo.addEventListener('click', function() {
            if (window.ExperimentTraining) {
                window.ExperimentTraining.handleNoChangeTrainingResponse(false);
            }
        });
    }

    // Change training
    const startChangeTraining = document.getElementById('startChangeTraining');
    if (startChangeTraining) {
        startChangeTraining.addEventListener('click', function() {
            if (window.ExperimentTraining) {
                window.ExperimentTraining.runChangeTraining();
            }
        });
    }
    
    const changeTrainingYes = document.getElementById('changeTrainingYes');
    if (changeTrainingYes) {
        changeTrainingYes.addEventListener('click', function() {
            if (window.ExperimentTraining) {
                window.ExperimentTraining.handleChangeTrainingResponse(true);
            }
        });
    }
    
    const changeTrainingNo = document.getElementById('changeTrainingNo');
    if (changeTrainingNo) {
        changeTrainingNo.addEventListener('click', function() {
            if (window.ExperimentTraining) {
                window.ExperimentTraining.handleChangeTrainingResponse(false);
            }
        });
    }
}

// Setup practice event listeners
function setupPracticeEventListeners() {
    const startPracticeTrial = document.getElementById('startPracticeTrial');
    if (startPracticeTrial) {
        startPracticeTrial.addEventListener('click', function() {
            if (window.ExperimentTraining) {
                window.ExperimentTraining.runPracticeTrial();
            }
        });
    }
    
    const practiceYes = document.getElementById('practiceYes');
    if (practiceYes) {
        practiceYes.addEventListener('click', function() {
            if (window.ExperimentTraining) {
                window.ExperimentTraining.processPracticeResponse('yes');
            }
        });
    }
    
    const practiceNo = document.getElementById('practiceNo');
    if (practiceNo) {
        practiceNo.addEventListener('click', function() {
            if (window.ExperimentTraining) {
                window.ExperimentTraining.processPracticeResponse('no');
            }
        });
    }
}

// Setup main experiment event listeners
function setupMainExperimentEventListeners() {
    const startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.addEventListener('click', function() {
            startButton.disabled = true;
            if (window.ExperimentMain) {
                window.ExperimentMain.startTrial();
            }
        });
    }

    const responseYes = document.getElementById('responseYes');
    if (responseYes) {
        responseYes.addEventListener('click', function() {
            if (window.ExperimentMain) {
                window.ExperimentMain.processResponse('yes');
            }
        });
    }

    const responseNo = document.getElementById('responseNo');
    if (responseNo) {
        responseNo.addEventListener('click', function() {
            if (window.ExperimentMain) {
                window.ExperimentMain.processResponse('no');
            }
        });
    }
}

// Setup result and completion event listeners
function setupResultEventListeners() {
    // Copy completion code button is handled in UI module
    
    // Action buttons are also handled in UI module
    
    // Language toggle is handled in UI module
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        const key = event.key.toLowerCase();
        
        // Main experiment shortcuts
        const responseYes = document.getElementById('responseYes');
        const responseNo = document.getElementById('responseNo');
        if (responseYes && !responseYes.disabled) {
            if (key === 'k' || key === 'ל') {
                if (window.ExperimentMain) {
                    window.ExperimentMain.processResponse('yes');
                }
            } else if (key === 'd' || key === 'ג') {
                if (window.ExperimentMain) {
                    window.ExperimentMain.processResponse('no');
                }
            }
        }
        
        // No-change training shortcuts
        const noChangeTrainingYes = document.getElementById('noChangeTrainingYes');
        const noChangeTrainingNo = document.getElementById('noChangeTrainingNo');
        if (noChangeTrainingYes && !noChangeTrainingYes.disabled) {
            if (key === 'k' || key === 'ל') {
                noChangeTrainingYes.click();
            } else if (key === 'd' || key === 'ג') {
                noChangeTrainingNo.click();
            }
        }
        
        // Change training shortcuts
        const changeTrainingYes = document.getElementById('changeTrainingYes');
        const changeTrainingNo = document.getElementById('changeTrainingNo');
        if (changeTrainingYes && !changeTrainingYes.disabled) {
            if (key === 'k' || key === 'ל') {
                changeTrainingYes.click();
            } else if (key === 'd' || key === 'ג') {
                changeTrainingNo.click();
            }
        }
        
        // Practice trials shortcuts
        const practiceYes = document.getElementById('practiceYes');
        const practiceNo = document.getElementById('practiceNo');
        if (practiceYes && !practiceYes.disabled) {
            if (key === 'k' || key === 'ל') {
                practiceYes.click();
            } else if (key === 'd' || key === 'ג') {
                practiceNo.click();
            }
        }
    });
}

// Error handling for the entire application
function setupGlobalErrorHandling() {
    window.addEventListener('error', function(event) {
        const error = event.error || new Error(event.message);
        if (window.ExperimentLogger) {
            window.ExperimentLogger.logError(error, 'Global error handler');
        }
        console.error('Global error:', error);
    });
    
    window.addEventListener('unhandledrejection', function(event) {
        const error = event.reason;
        if (window.ExperimentLogger) {
            window.ExperimentLogger.logError(error, 'Unhandled promise rejection');
        }
        console.error('Unhandled promise rejection:', error);
    });
}

// Performance monitoring
function setupPerformanceMonitoring() {
    if (window.performance && window.performance.mark) {
        window.performance.mark('app-init-start');
        
        window.addEventListener('load', function() {
            window.performance.mark('app-init-end');
            window.performance.measure('app-init', 'app-init-start', 'app-init-end');
            
            const measure = window.performance.getEntriesByName('app-init')[0];
            if (window.ExperimentLogger && measure) {
                window.ExperimentLogger.logPerformance('Application initialization', 0, measure.duration);
            }
        });
    }
}

// Initialize when DOM is ready and all modules are loaded
function initWhenReady() {
    // Check if all required modules are loaded
    const requiredModules = [
        'ExperimentConfig',
        'LanguageManager', 
        'ExperimentUtils',
        'ExperimentStorage',
        'ExperimentLogger',
        'ExperimentNetwork',
        'ExperimentTimers',
        'ExperimentAdmin',
        'ExperimentUI',
        'ExperimentTraining',
        'ExperimentMain'
    ];
    
    const missingModules = requiredModules.filter(module => !window[module]);
    
    if (missingModules.length > 0) {
        console.error('Missing required modules:', missingModules);
        setTimeout(initWhenReady, 100); // Retry after 100ms
        return;
    }
    
    // Setup error handling
    setupGlobalErrorHandling();
    
    // Setup performance monitoring
    setupPerformanceMonitoring();
    
    // Initialize the application
    initializeApp();
}

// Start initialization when window loads
window.addEventListener('load', initWhenReady);

// Export main functions for potential external use (removed participant ID functions)
window.ExperimentApp = {
    initializeApp,
    setupEventListeners,
    handleInstructionsUnderstood,
    startInstructionSequence,
    proceedToTraining,
    setupGlobalErrorHandling,
    setupPerformanceMonitoring
};