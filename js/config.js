// Configuration constants - read from environment config
const GOOGLE_SCRIPT_URL = window.ENV_CONFIG?.GOOGLE_SCRIPT_URL || 'PLACEHOLDER_URL';
const SPREADSHEET_URL = window.ENV_CONFIG?.SPREADSHEET_URL || 'PLACEHOLDER_URL';
const ADMIN_PASSWORD = window.ENV_CONFIG?.ADMIN_PASSWORD || 'PLACEHOLDER_PASSWORD';

// Check if environment config is loaded
if (!window.ENV_CONFIG) {
    console.error('Environment configuration not loaded. Please ensure env-config.js exists and is properly configured.');
    alert('Configuration error: Please contact the administrator.');
}

// Global variables
let participantId = '';
let deviceId = '';
let isInternetConnected = false;
let completionCode = '';
let isAdminAuthenticated = false;
let isAdminModeActive = false;

// Device detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Experiment configuration
const config = {
    numTrials: 10,
    numStimuli: 5,
    stimulusSize: isMobile ? 50 : 40,
    studyTime: 500,
    blankTime: 900,
    changeProb: 0.5,
    maxPos: 0.8,
    responseTimeLimit: 15000,
    minMoveDistance: function() { return this.stimulusSize / 2; },
    maxMoveDistance: function() { return this.stimulusSize * 2; },
    minObjectsToMove: 1,
    maxObjectsToMove: 3,
    swapProbability: 0.3
};

// Stimulus colors array
const stimuliColors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FF8000', '#8000FF'
];

// Experiment state
let state = {
    currentTrial: 0,
    correctResponses: 0,
    stimuliPositions: [],
    hasChange: false,
    isRunning: false,
    dataSaved: false,
    sameIdDifferentDevice: false,
    stimuliColorIndices: [],
    practiceTrials: [],
    currentPracticeTrial: 0,
    practiceCorrect: 0,
    practiceAttempt: 0,
    isPracticeRunning: false,
    responseTimes: [],
    timeoutTrials: [],
    trialStartTime: 0,
    trialTimeout: null
};

// Export all configuration and state
window.ExperimentConfig = {
    GOOGLE_SCRIPT_URL,
    SPREADSHEET_URL,
    ADMIN_PASSWORD,
    config,
    stimuliColors,
    state,
    isMobile,
    // Global variables with getters/setters for controlled access
    get participantId() { return participantId; },
    set participantId(value) { participantId = value; },
    get deviceId() { return deviceId; },
    set deviceId(value) { deviceId = value; },
    get isInternetConnected() { return isInternetConnected; },
    set isInternetConnected(value) { isInternetConnected = value; },
    get completionCode() { return completionCode; },
    set completionCode(value) { completionCode = value; },
    get isAdminAuthenticated() { return isAdminAuthenticated; },
    set isAdminAuthenticated(value) { isAdminAuthenticated = value; },
    get isAdminModeActive() { return isAdminModeActive; },
    set isAdminModeActive(value) { isAdminModeActive = value; }
};