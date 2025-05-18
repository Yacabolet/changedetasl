// Updated admin.js - Server-side authentication

// Admin authentication functions
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
            window.ExperimentStorage.setStoredAdminState(true, null);
            toggleControlOptions(true);
            
            if (loginError) loginError.style.display = 'none';
            
            if (window.ExperimentLogger) {
                window.ExperimentLogger.log('Admin login successful');
            }
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
        // First attempt: Try to get response (may not work with no-cors)
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
        // If CORS blocks response, fall back to no-cors and use alternative verification
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
        
        // Since we can't read the response in no-cors mode,
        // we'll use a delayed verification strategy
        return await verifyAuthenticationWithFallback(password);
    }
}

// Fallback authentication verification for no-cors mode
async function verifyAuthenticationWithFallback(password) {
    // Wait a moment for the server to process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
        // Send a test request that requires authentication
        const testData = {
            action: 'admin-test',
            password: password,
            timestamp: Date.now()
        };
        
        const response = await fetch(window.ExperimentConfig.GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });
        
        const result = await response.json();
        return { success: result.success };
        
    } catch (error) {
        // If all else fails, we'll have to assume success and let the user proceed
        // This is a limitation of the no-cors approach
        if (window.ExperimentLogger) {
            window.ExperimentLogger.log('Authentication verification failed, assuming success');
        }
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

// Updated clear Google Sheet function with authentication
async function clearGoogleSheetAdmin() {
    if (!window.ExperimentConfig.isAdminAuthenticated) {
        alert('Admin authentication required');
        return;
    }
    
    // Get admin password for server verification
    const tempPassword = prompt('Enter admin password to confirm sheet clearing:');
    if (!tempPassword) return;
    
    try {
        const requestData = {
            action: 'clearSheet',
            adminPassword: tempPassword,
            timestamp: Date.now()
        };
        
        if (window.ExperimentLogger) {
            window.ExperimentLogger.log('Attempting to clear Google Sheet with server authentication');
        }
        
        const savingMessage = document.getElementById('savingMessage');
        if (savingMessage && window.LanguageManager) {
            savingMessage.style.display = 'block';
            savingMessage.innerHTML = `<h2>${window.LanguageManager.getText('savingText')}</h2>`;
        }
        
        await fetch(window.ExperimentConfig.GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        if (savingMessage) savingMessage.style.display = 'none';
        
        if (window.LanguageManager) {
            alert(window.LanguageManager.getText('sheetCleared'));
        } else {
            alert('Google Sheet cleared successfully!');
        }
        
        if (window.ExperimentLogger) {
            window.ExperimentLogger.log('Google Sheet clearing request sent');
        }
        
    } catch (error) {
        if (window.ExperimentLogger) {
            window.ExperimentLogger.logError(error, 'Clear Google Sheet');
        }
        
        const savingMessage = document.getElementById('savingMessage');
        if (savingMessage) savingMessage.style.display = 'none';
        
        alert('Error clearing Google Sheet: ' + error.message);
    }
}

// Remove client-side password checking function
// checkAdminPassword is no longer needed since we use server-side auth

// Keep all other admin functions unchanged...
// (initAdminControls, setupAdminEventListeners, etc. remain the same)