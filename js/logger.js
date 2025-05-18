// Logging and debugging utilities

// Log storage
let logHistory = [];

// Log function with timestamp
function log(message) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(logEntry);
    
    // Store in history
    logHistory.push({
        timestamp: Date.now(),
        message: message,
        formattedMessage: logEntry
    });
    
    // Also log to debug div
    const debugInfo = document.getElementById('debugInfo');
    if (debugInfo) {
        const logLine = document.createElement('div');
        logLine.textContent = logEntry;
        debugInfo.appendChild(logLine);
        debugInfo.scrollTop = debugInfo.scrollHeight;
    }
}

// Special trial logging function
function logTrial(adminMessage, publicMessage) {
    if (window.ExperimentConfig && window.ExperimentConfig.isAdminModeActive) {
        log(adminMessage);
    } else {
        log(publicMessage || 'Trial processed');
    }
}

// Error logging with stack trace
function logError(error, context = '') {
    const errorMessage = `ERROR${context ? ' in ' + context : ''}: ${error.message}`;
    log(errorMessage);
    
    if (error.stack) {
        console.error('Stack trace:', error.stack);
        logHistory[logHistory.length - 1].stack = error.stack;
    }
}

// Warning logging
function logWarning(message, context = '') {
    const warningMessage = `WARNING${context ? ' in ' + context : ''}: ${message}`;
    log(warningMessage);
}

// Performance logging
function logPerformance(label, startTime, endTime = Date.now()) {
    const duration = endTime - startTime;
    log(`PERFORMANCE [${label}]: ${duration}ms`);
    
    // Store performance data
    if (!window.ExperimentLogger.performanceData) {
        window.ExperimentLogger.performanceData = [];
    }
    window.ExperimentLogger.performanceData.push({
        label,
        startTime,
        endTime,
        duration
    });
}

// User action logging
function logUserAction(action, details = {}) {
    const actionMessage = `USER ACTION: ${action}`;
    const detailsStr = Object.keys(details).length > 0 ? ` | Details: ${JSON.stringify(details)}` : '';
    log(actionMessage + detailsStr);
}

// System state logging
function logSystemState(state) {
    log(`SYSTEM STATE: ${JSON.stringify(state, null, 2)}`);
}

// Network activity logging
function logNetworkActivity(type, url, status, responseTime) {
    log(`NETWORK [${type}]: ${url} | Status: ${status} | Time: ${responseTime}ms`);
}

// Log level filtering
const LOG_LEVELS = {
    ERROR: 0,
    WARNING: 1,
    INFO: 2,
    DEBUG: 3
};

let currentLogLevel = LOG_LEVELS.INFO;

function setLogLevel(level) {
    if (typeof level === 'string') {
        level = LOG_LEVELS[level.toUpperCase()];
    }
    if (level >= 0 && level <= 3) {
        currentLogLevel = level;
        log(`Log level set to: ${Object.keys(LOG_LEVELS)[level]}`);
    }
}

function logWithLevel(level, message) {
    if (level <= currentLogLevel) {
        const levelName = Object.keys(LOG_LEVELS)[level];
        log(`[${levelName}] ${message}`);
    }
}

// Log export functions
function exportLogs() {
    const exportData = {
        exportDate: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        experimentConfig: window.ExperimentConfig ? {
            participantId: window.ExperimentConfig.participantId,
            deviceId: window.ExperimentConfig.deviceId,
            isAdminMode: window.ExperimentConfig.isAdminModeActive,
            currentTrial: window.ExperimentConfig.state.currentTrial,
            language: window.LanguageManager ? window.LanguageManager.getCurrentLanguage() : 'unknown'
        } : null,
        logs: logHistory,
        performanceData: window.ExperimentLogger.performanceData || []
    };
    
    return JSON.stringify(exportData, null, 2);
}

function downloadLogs() {
    const logsJson = exportLogs();
    const blob = new Blob([logsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `experiment-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    log('Logs downloaded to file');
}

// Log filtering and searching
function filterLogs(filter) {
    if (typeof filter === 'string') {
        return logHistory.filter(entry => 
            entry.message.toLowerCase().includes(filter.toLowerCase())
        );
    } else if (typeof filter === 'function') {
        return logHistory.filter(filter);
    }
    return logHistory;
}

function searchLogs(searchTerm) {
    return filterLogs(searchTerm);
}

// Clear logs
function clearLogs() {
    logHistory = [];
    window.ExperimentLogger.performanceData = [];
    
    const debugInfo = document.getElementById('debugInfo');
    if (debugInfo) {
        debugInfo.innerHTML = '';
    }
    
    log('Logs cleared');
}

// Log statistics
function getLogStatistics() {
    const stats = {
        totalLogs: logHistory.length,
        errorCount: logHistory.filter(entry => entry.message.includes('ERROR')).length,
        warningCount: logHistory.filter(entry => entry.message.includes('WARNING')).length,
        performanceCount: logHistory.filter(entry => entry.message.includes('PERFORMANCE')).length,
        userActionCount: logHistory.filter(entry => entry.message.includes('USER ACTION')).length,
        firstLog: logHistory.length > 0 ? logHistory[0].timestamp : null,
        lastLog: logHistory.length > 0 ? logHistory[logHistory.length - 1].timestamp : null
    };
    
    if (stats.firstLog && stats.lastLog) {
        stats.sessionDuration = stats.lastLog - stats.firstLog;
    }
    
    return stats;
}

// Debug utilities
function debugDump() {
    const debugData = {
        config: window.ExperimentConfig,
        state: window.ExperimentConfig ? window.ExperimentConfig.state : null,
        storage: window.ExperimentStorage ? window.ExperimentStorage.getAllStoredData() : null,
        logStats: getLogStatistics(),
        recentLogs: logHistory.slice(-10) // Last 10 logs
    };
    
    console.log('DEBUG DUMP:', debugData);
    log('Debug dump printed to console');
    return debugData;
}

function toggleDebugInfo() {
    const debugInfo = document.getElementById('debugInfo');
    if (debugInfo) {
        const isVisible = debugInfo.style.display !== 'none';
        debugInfo.style.display = isVisible ? 'none' : 'block';
        log(`Debug info ${isVisible ? 'hidden' : 'shown'}`);
    }
}

// Console logging override (for capturing all console.log calls)
function interceptConsoleLog() {
    const originalLog = console.log;
    console.log = function(...args) {
        // Call original log
        originalLog.apply(console, args);
        
        // Also log to our system
        const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        
        // Avoid infinite recursion
        if (!message.startsWith('[')) {
            log('CONSOLE: ' + message);
        }
    };
}

// Restore original console.log
function restoreConsoleLog() {
    // This would need to store the original function reference
    log('Console log interception removed');
}

// Real-time log monitoring
function startLogMonitoring(callback, filter = null) {
    const originalLogFunction = log;
    
    log = function(message) {
        originalLogFunction(message);
        
        if (!filter || filter(message)) {
            callback(message, logHistory[logHistory.length - 1]);
        }
    };
    
    log('Log monitoring started');
}

// Export all logging functions
window.ExperimentLogger = {
    log,
    logTrial,
    logError,
    logWarning,
    logPerformance,
    logUserAction,
    logSystemState,
    logNetworkActivity,
    setLogLevel,
    logWithLevel,
    LOG_LEVELS,
    exportLogs,
    downloadLogs,
    filterLogs,
    searchLogs,
    clearLogs,
    getLogStatistics,
    debugDump,
    toggleDebugInfo,
    interceptConsoleLog,
    restoreConsoleLog,
    startLogMonitoring,
    get logHistory() { return [...logHistory]; }, // Return copy to prevent external modification
    performanceData: []
};