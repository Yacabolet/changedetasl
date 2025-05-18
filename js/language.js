// Language dictionaries for internationalization - Updated to remove all participant ID related keys
const langDict = {
    en: {
        trialCounter: "Trial {0} of {1}",
        
        // Connection error messages
        connectionErrorText1: "Unable to connect to Google Sheets.",
        connectionErrorText2: "Please use a different WIFI or Mobile Data connection and refresh the page.",
        retryConnectionButton: "Retry Connection",
        
        // Instructions page
        instructionsTitle: "Experiment Instructions",
        instructionsText1: "Welcome to the Cognitive Task for our experiment.",
        instructionsText2: "How it works:",
        instructionsStep1: "You will briefly see several colored squares on the screen.",
        instructionsStep2: "The squares will disappear for a moment.",
        instructionsStep3: "After the squares disappear they will reappear and you need to identify whether there was a change in their position by clicking the appropriate button.",
        instructionsStep4: "Instead of clicking/tapping on the buttons, if you're using a keyboard, you can press the K key if you detect a change or the D key if you don't detect a change.",
        instructionsText3: "This experiment will take a few minutes, please try to stay focused throughout the experiment.",
        instructionsText4: "Let's begin with some practice trials to make sure you understand the task.",
        instructionsText5: "Important: Please respond to each trial both quickly AND accurately. If you take more than 15 seconds to respond to any trial, it will automatically skip to the next trial and count as incorrect.",
        instructionsUnderstoodButton: "I understand",
        instructionsUnderstoodButtonDisabled: "I understand (enabled in 5 seconds)",
        instructionsTimer: "Please read the instructions",
        instructionsTimerRemaining: "Please read the instructions ({0} seconds remaining)",
        
        // Training sections
        noChangeTitle: "Practice Trial: No Change",
        noChangeText1: "In this practice, you will see an example where NO squares change position.",
        noChangeText2: "First, several colored squares will appear. Try to remember their positions.",
        noChangeText3: "After they disappear briefly, they will reappear in the exact same positions.",
        noChangeText4: "When this happens, you should click the \"No Change\" button.",
        startNoChangeTraining: "Start Practice Trial",
        noChangeTrainingYes: "Change Detected (K)",
        noChangeTrainingNo: "No Change (D)",
        noChangeFeedbackCorrect: "Correct! Moving to the next practice trial...",
        noChangeFeedbackIncorrect: "Incorrect. This was a 'No Change' trial. The squares returned to the same positions. Try again in 5 seconds.",
        noChangeFeedbackRetry: "Click 'Start Practice Trial' to try again.",
        
        changeTitle: "Practice Trial: Change",
        changeText1: "In this practice, you will see an example where one or more squares CHANGE position.",
        changeText2: "First, several colored squares will appear. Try to remember their positions.",
        changeText3: "After they disappear briefly, they will reappear with at least one square in a different position.",
        changeText4: "When this happens, you should click the \"Change Detected\" button.",
        startChangeTraining: "Start Practice Trial",
        changeTrainingYes: "Change Detected (K)",
        changeTrainingNo: "No Change (D)",
        changeFeedbackCorrect: "Correct! Moving to the main experiment...",
        changeFeedbackIncorrect: "Incorrect. This was a 'Change' trial. At least one square moved to a new position. Try again in 5 seconds.",
        changeFeedbackRetry: "Click 'Start Practice Trial' to try again.",
        
        // Practice trials
        practiceTitle: "Practice Trials",
        practiceText1: "Now you'll complete 3 practice trials to make sure you understand the task.",
        practiceText2: "Some squares may change position, some may not. Use your best judgment.",
        practiceText3: "You must correctly identify all 3 trials to continue to the main experiment.",
        practiceText4: "Remember: You have 15 seconds to respond to each trial.",
        startPracticeTrial: "Start Practice Trial",
        practiceYes: "Change Detected (K)",
        practiceNo: "No Change (D)",
        practiceTrialNumber: "Trial {0} of 3",
        practiceFeedbackCorrect: "Correct! Moving to next trial...",
        practiceFeedbackIncorrect: "Incorrect. Try again after 5 seconds.",
        practiceFeedbackComplete: "All practice trials completed! Starting main experiment...",
        practiceFeedbackRetry: "Some trials were incorrect. Let's try all 3 again after 5 seconds.",
        skipPracticeTrialsButton: "Skip Practice Trials",
        
        // Toggle instructions
        showInstructions: "Show Instructions",
        hideInstructions: "Hide Instructions",
        mainExperimentSummary: "Remember square positions. Indicate if any changed.",
        noChangeSummary: "Practice: NO squares change position.",
        changeSummary: "Practice: Squares DO change position.",
        
        // Main experiment
        mainInstructionsText: "Remember the positions of the squares. After a brief blank screen, indicate if any square changed position.",
        startButton: "Start Experiment",
        responseYes: "Change Detected (K)",
        responseNo: "No Change (D)",
        
        // Results and completion
        savingText: "Saving data, please wait...",
        thankYouText: "Thanks for participating in our study.",
        completionCodeText1: "Please copy this completion code and enter it in the Polyda page:",
        copyCodeButton: "Copy to Clipboard",
        copyCodeButtonCopied: "Copied!",
        showResultsButton: "Show Results",
        showLogButton: "Show Log",
        hideLogButton: "Hide Log",
        openSpreadsheetButton: "Open Spreadsheet",
        resultsTitle: "Results:",
        trialsCompletedLabel: "Trials completed:",
        correctResponsesLabel: "Correct responses:",
        accuracyLabel: "Accuracy:",
        retryButton: "Retry Saving Data",
        
        // Admin controls
        controlPanelButton: "Control Panel",
        adminModeIndicator: "ADMIN MODE ACTIVE",
        controlPanelHeader: "Admin Control Panel",
        adminPassword: "Admin Password:",
        loginButton: "Login",
        loginError: "Incorrect password",
        adminModeToggle: "Enable Admin Mode:",
        clearSheetButton: "Clear Google Sheet",
        clearLocalStorageButton: "Clear Previously Used IDs/Devices",
        viewLogsButton: "Toggle Logs",
        openSpreadsheetDirectButton: "Open Spreadsheet",
        closeControlPanelButton: "Close",
        confirmationTitle: "Confirmation",
        confirmYesButton: "Yes, I'm sure",
        confirmNoButton: "Cancel",
        
        // Skip buttons
        skipInstructionsButton: "Skip Instructions",
        skipNoChangeTrainingButton: "Skip No-Change Training",
        skipChangeTrainingButton: "Skip Change Training",
        skipAllTrialsButton: "Skip All Trials",
        
        // Confirmation messages
        clearSheetConfirmTitle: "Clear Google Sheet?",
        clearSheetConfirmMessage: "This will remove ALL data from the Google Sheet. This action cannot be undone!",
        clearLocalStorageConfirmTitle: "Clear Local Storage?",
        clearLocalStorageConfirmMessage: "This will remove all stored participant IDs and device IDs, allowing them to be reused.",
        
        // Action confirmations
        sheetCleared: "Google Sheet cleared successfully!",
        localStorageCleared: "Local storage cleared. All participant and device IDs have been removed.",
        
        // Timer and timeout
        timeoutMessage: "Too slow, skipping!",
        timerDisplay: "Time: ",
        
        // Status messages
        resultsSavedSuccess: "Results saved successfully!",
        errorSavingData: "Error saving data:",
        
        adminOverride: "Override (Admin Only)",
        
        // Email verification for sheet clearing
        emailVerificationConfirmMessage: "This will clear ALL data from the Google Sheet. A verification code will be sent to your email. Continue?",
        reenterPasswordPrompt: "Please re-enter your admin password:",
        passwordRequired: "Password is required to proceed",
        sendingCode: "Sending code...",
        codeSenatToEmail: "Verification code sent to your email!",
        emailSendFailed: "Failed to send verification email",
        errorInitiatingClear: "Error initiating clear sheet: ",
        verificationCodeTitle: "Email Verification Required",
        verificationCodeMessage: "A 6-digit verification code has been sent to your email. Please enter it below:",
        verificationCodeExpiry: "Code expires in 5 minutes",
        verifyAndClearButton: "Verify and Clear Sheet",
        invalidCodeFormat: "Please enter a 6-digit code",
        verifying: "Verifying..."
    },
    he: {
        trialCounter: "ניסיון {0} מתוך {1}",
        
        // Connection error messages
        connectionErrorText1: "לא ניתן להתחבר ל-Google Sheets.",
        connectionErrorText2: "אנא השתמש/י בחיבור WiFi אחר ורענן/י את הדף.",
        retryConnectionButton: "נסה חיבור מחדש",
        
        // Instructions page
        instructionsTitle: "הוראות הניסוי",
        instructionsText1: "ברוכים/ברוכות הבאים/הבאות למשימה הקוגניטיבית של הניסוי שלנו.",
        instructionsText2: "כיצד זה עובד:",
        instructionsStep1: "תראה/י מספר ריבועים צבעוניים על המסך לזמן קצר.",
        instructionsStep2: "הריבועים ייעלמו לרגע.",
        instructionsStep3: "לאחר שהריבועים ייעלמו הם יחזרו ועלייך לזהות האם היה שינוי במיקומם בלחיצה על הכפתור המתאים.",
        instructionsStep4: "במקום ללחוץ על הכפתורים, אם אתם משתמשים במקלדת, תוכלו ללחוץ על הקש K אם אתם מזהים שינוי או על הקש D אם אתם לא מזהים שינוי.",
        instructionsText3: "הניסוי יקח רק מספר דקות, אנא נסה/י להישאר ממוקד/ת לאורך כל הניסוי.",
        instructionsText4: "כדי לוודא שאת/ה מבינ/ה את המשימה נעשה כעת אימון ניסיון.",
        instructionsText5: "חשוב: אנא השב/י לכל ניסיון במהירות ובדיוק. אם תיקח/י יותר מ-15 שניות להשיב לניסיון כלשהו, הוא יעבור אוטומטית לניסיון הבא וייחשב כתשובה שגויה.",
        instructionsUnderstoodButton: "אני מבין/ה",
        instructionsUnderstoodButtonDisabled: "אני מבין/ה (יופעל בעוד 5 שניות)",
        instructionsTimer: "אנא קרא/י את ההוראות",
        instructionsTimerRemaining: "אנא קרא/י את ההוראות ({0} שניות נותרו)",
        
        // Training sections
        noChangeTitle: "ניסיון אימון: ללא שינוי",
        noChangeText1: "באימון זה, תראה/י דוגמה שבה ריבועים לא משנים את מיקומם.",
        noChangeText2: "תחילה, יופיעו מספר ריבועים צבעוניים. נסה/י לזכור את מיקומם.",
        noChangeText3: "לאחר שייעלמו לרגע, הם יופיעו מחדש באותם מיקומים בדיוק.",
        noChangeText4: "כשזה קורה, עליך ללחוץ על כפתור \"אין שינוי\".",
        startNoChangeTraining: "התחל ניסיון אימון",
        noChangeTrainingYes: "שינוי זוהה (K)",
        noChangeTrainingNo: "אין שינוי (D)",
        noChangeFeedbackCorrect: "נכון! עובר/ת לניסיון האימון הבא...",
        noChangeFeedbackIncorrect: "לא נכון. זה היה ניסיון 'ללא שינוי'. הריבועים חזרו לאותם מיקומים. נסה/י שוב בעוד 5 שניות.",
        noChangeFeedbackRetry: "לחץ/י על 'התחל ניסיון אימון' כדי לנסות שוב.",
        
        changeTitle: "ניסיון אימון: שינוי",
        changeText1: "באימון זה, תראה/י דוגמה שבה ריבוע אחד או יותר משנה מיקום.",
        changeText2: "תחילה, יופיעו מספר ריבועים צבעוניים. נסה/י לזכור את מיקומם.",
        changeText3: "לאחר שייעלמו לרגע, הם יופיעו מחדש כשלפחות ריבוע אחד במיקום שונה.",
        changeText4: "כשזה קורה, עליך ללחוץ על כפתור \"שינוי זוהה\".",
        startChangeTraining: "התחל ניסיון אימון",
        changeTrainingYes: "שינוי זוהה (K)",
        changeTrainingNo: "אין שינוי (D)",
        changeFeedbackCorrect: "נכון! עובר/ת לניסוי העיקרי...",
        changeFeedbackIncorrect: "לא נכון. זה היה ניסיון 'שינוי'. לפחות ריבוע אחד זז למיקום חדש. נסה/י שוב בעוד 5 שניות.",
        changeFeedbackRetry: "לחץ/י על 'התחל ניסיון אימון' כדי לנסות שוב.",
        
        // Practice trials
        practiceTitle: "ניסיונות אימון",
        practiceText1: "כעת תשלים/י 3 ניסיונות אימון כדי לוודא שאת/ה מבין/ה את המשימה.",
        practiceText2: "חלק מהריבועים עלולים לשנות מיקום, חלקם לא. השתמש/י בשיקול הדעת שלך.",
        practiceText3: "עליך לזהות נכון את כל 3 הניסיונות כדי להמשיך לניסוי העיקרי.",
        practiceText4: "זכור/י: יש לך 15 שניות להגיב לכל ניסיון.",
        startPracticeTrial: "התחל ניסיון אימון",
        practiceYes: "שינוי זוהה (K)",
        practiceNo: "אין שינוי (D)",
        practiceTrialNumber: "ניסיון {0} מתוך 3",
        practiceFeedbackCorrect: "נכון! עובר/ת לניסיון הבא...",
        practiceFeedbackIncorrect: "לא נכון. נסה/י שוב בעוד 5 שניות.",
        practiceFeedbackComplete: "כל ניסיונות האימון הושלמו! מתחיל/ה את הניסוי העיקרי...",
        practiceFeedbackRetry: "חלק מהניסיונות היו שגויים. ננסה את כל 3 הניסיונות שוב בעוד 5 שניות.",
        skipPracticeTrialsButton: "דלג על ניסיונות אימון",
        
        // Toggle instructions
        showInstructions: "הצג הוראות",
        hideInstructions: "הסתר הוראות",
        mainExperimentSummary: "זכור מיקומי הריבועים. ציין אם השתנו.",
        noChangeSummary: "תרגול: הריבועים לא משנים מיקום.",
        changeSummary: "תרגול: הריבועים כן משנים מיקום.",
        
        // Main experiment
        mainInstructionsText: "זכור/זכרי את מיקומי הריבועים. לאחר מסך ריק קצר, ציין/י אם ריבוע כלשהו שינה מיקום.",
        startButton: "התחל ניסוי",
        responseYes: "שינוי זוהה (K)",
        responseNo: "אין שינוי (D)",
        
        // Results and completion
        savingText: "שומר נתונים, אנא המתן/י...",
        thankYouText: "תודה על השתתפותך במחקר שלנו.",
        completionCodeText1: "אנא העתק/י את קוד הסיום הזה והזן/י אותו בדף Polyda:",
        copyCodeButton: "העתק ללוח",
        copyCodeButtonCopied: "הועתק!",
        showResultsButton: "הצג תוצאות",
        showLogButton: "הצג יומן",
        hideLogButton: "הסתר יומן",
        openSpreadsheetButton: "פתח גיליון נתונים",
        resultsTitle: "תוצאות:",
        trialsCompletedLabel: "ניסיונות שהושלמו:",
        correctResponsesLabel: "תשובות נכונות:",
        accuracyLabel: "דיוק:",
        retryButton: "נסה לשמור נתונים שוב",
        
        // Admin controls
        controlPanelButton: "לוח בקרה",
        adminModeIndicator: "מצב מנהל פעיל",
        controlPanelHeader: "לוח בקרת מנהל",
        adminPassword: "סיסמת מנהל:",
        loginButton: "כניסה",
        loginError: "סיסמה שגויה",
        adminModeToggle: "הפעל מצב מנהל:",
        clearSheetButton: "נקה גיליון Google",
        clearLocalStorageButton: "נקה מזהים שנעשה בהם שימוש",
        viewLogsButton: "הצג/הסתר יומן",
        openSpreadsheetDirectButton: "פתח גיליון נתונים",
        closeControlPanelButton: "סגור",
        confirmationTitle: "אישור",
        confirmYesButton: "כן, אני בטוח/ה",
        confirmNoButton: "ביטול",
        
        // Skip buttons
        skipInstructionsButton: "דלג על ההוראות",
        skipNoChangeTrainingButton: "דלג על אימון ללא שינוי",
        skipChangeTrainingButton: "דלג על אימון שינוי",
        skipAllTrialsButton: "דלג על כל הניסיונות",
        
        // Confirmation messages
        clearSheetConfirmTitle: "לנקות את גיליון Google?",
        clearSheetConfirmMessage: "פעולה זו תסיר את כל הנתונים מגיליון Google. לא ניתן לבטל פעולה זו!",
        clearLocalStorageConfirmTitle: "לנקות את האחסון המקומי?",
        clearLocalStorageConfirmMessage: "פעולה זו תסיר את כל מזהי המשתתפים והמכשירים המאוחסנים, ותאפשר להשתמש בהם מחדש.",
        
        // Action confirmations
        sheetCleared: "גיליון Google נוקה בהצלחה!",
        localStorageCleared: "האחסון המקומי נוקה. כל מזהי המשתתפים והמכשירים הוסרו.",
        
        // Timer and timeout
        timeoutMessage: "איטי מדי, מדלג!",
        timerDisplay: "זמן: ",
        
        // Status messages
        resultsSavedSuccess: "התוצאות נשמרו בהצלחה!",
        errorSavingData: "שגיאה בשמירת נתונים:",
        
        adminOverride: "עקיפה (מנהל בלבד)",
        
        // Email verification for sheet clearing (Hebrew translations)
        emailVerificationConfirmMessage: "פעולה זו תנקה את כל הנתונים מגיליון Google. קוד אימות יישלח לאימייל שלך. להמשיך?",
        reenterPasswordPrompt: "אנא הזן/י שוב את סיסמת המנהל:",
        passwordRequired: "נדרשת סיסמה כדי להמשיך",
        sendingCode: "שולח קוד...",
        codeSenatToEmail: "קוד אימות נשלח לאימייל שלך!",
        emailSendFailed: "נכשל בשליחת אימייל אימות",
        errorInitiatingClear: "שגיאה ביצירת בקשת ניקוי גיליון: ",
        verificationCodeTitle: "נדרש אימות באימייל",
        verificationCodeMessage: "קוד אימות בן 6 ספרות נשלח לאימייל שלך. אנא הזן/י אותו למטה:",
        verificationCodeExpiry: "הקוד יפוג בעוד 5 דקות",
        verifyAndClearButton: "אמת ונקה גיליון",
        invalidCodeFormat: "אנא הזן/י קוד בן 6 ספרות",
        verifying: "מאמת..."
    }
};

// Current language setting
let currentLang = "he";

// Language management functions
function setLanguage(lang) {
    if (lang && (lang === 'en' || lang === 'he')) {
        currentLang = lang;
    }
}

function getCurrentLanguage() {
    return currentLang;
}

function getText(key) {
    return langDict[currentLang][key] || key;
}

function updateLanguage() {
    // Set document direction
    document.body.dir = currentLang === "he" ? "rtl" : "ltr";
    
    // Hide Control Panel button when language is Hebrew
    const controlPanelButton = document.getElementById('controlPanelButton');
    if (controlPanelButton) {
        controlPanelButton.style.display = currentLang === "he" ? "none" : "block";
    }
    
    // Update timeout message
    const timeoutMessage = document.getElementById('timeoutMessage');
    if (timeoutMessage) {
        timeoutMessage.textContent = getText('timeoutMessage');
    }
    
    // Update timer display
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        if (timerDisplay.textContent.includes(":")) {
            const time = timerDisplay.textContent.split(": ")[1];
            timerDisplay.textContent = getText('timerDisplay') + time;
        } else {
            timerDisplay.textContent = getText('timerDisplay') + "00:00";
        }
    }
    
    // Helper function to update element text
    function updateText(id, textKey) {
        const element = document.getElementById(id);
        if (element && getText(textKey)) {
            element.textContent = getText(textKey);
        }
    }
    
    // Update all text elements (removed participant ID related ones)
    const textElements = [
        'connectionErrorText1', 'connectionErrorText2', 'retryConnectionButton',
        'instructionsTitle', 'instructionsText1', 'instructionsText2',
        'instructionsStep1', 'instructionsStep2', 'instructionsStep3', 'instructionsStep4',
        'instructionsText3', 'instructionsText4', 'instructionsText5',
        'noChangeTitle', 'noChangeText1', 'noChangeText2', 'noChangeText3', 'noChangeText4',
        'startNoChangeTraining', 'noChangeTrainingYes', 'noChangeTrainingNo',
        'changeTitle', 'changeText1', 'changeText2', 'changeText3', 'changeText4',
        'startChangeTraining', 'changeTrainingYes', 'changeTrainingNo',
        'practiceTitle', 'practiceText1', 'practiceText2', 'practiceText3', 'practiceText4',
        'startPracticeTrial', 'practiceYes', 'practiceNo', 'skipPracticeTrialsButton',
        'mainInstructionsText', 'startButton', 'responseYes', 'responseNo',
        'savingText', 'thankYouText', 'completionCodeText1', 'copyCodeButton',
        'showResultsButton', 'openSpreadsheetButton', 'resultsTitle',
        'trialsCompletedLabel', 'correctResponsesLabel', 'accuracyLabel', 'retryButton',
        'controlPanelButton', 'adminModeIndicator', 'loginButton', 'loginError',
        'clearSheetButton', 'clearLocalStorageButton', 'viewLogsButton',
        'openSpreadsheetDirectButton', 'closeControlPanelButton',
        'skipInstructionsButton', 'skipNoChangeTrainingButton', 'skipChangeTrainingButton',
        'skipAllTrialsButton', 'confirmationTitle',
        'confirmYesButton', 'confirmNoButton'
    ];
    
    textElements.forEach(id => updateText(id, id));
    
    // Update instructions button based on state
    const instructionsButton = document.getElementById("instructionsUnderstoodButton");
    if (instructionsButton) {
        updateText("instructionsUnderstoodButton", instructionsButton.disabled ? 
            "instructionsUnderstoodButtonDisabled" : "instructionsUnderstoodButton");
    }
    
    // Update instructions timer text
    updateText("instructionsTimer", "instructionsTimer");
    
    // Update show/hide log button
    const logButton = document.getElementById("showLogButton");
    if (logButton) {
        if (logButton.textContent.includes("Hide")) {
            updateText("showLogButton", "hideLogButton");
        } else {
            updateText("showLogButton", "showLogButton");
        }
    }
    
    // Update admin password label
    const adminPasswordLabel = document.querySelector('#loginSection label');
    if (adminPasswordLabel) {
        adminPasswordLabel.textContent = getText('adminPassword');
    }
    
    // Update admin mode toggle label
    const adminModeToggleLabel = document.querySelector('.controlPanelSection span');
    if (adminModeToggleLabel) {
        adminModeToggleLabel.textContent = getText('adminModeToggle');
    }
    
    // Update control panel header
    const controlPanelHeader = document.querySelector('.controlPanelHeader');
    if (controlPanelHeader) {
        controlPanelHeader.textContent = getText('controlPanelHeader');
    }
    
    // Update language toggle button
    const languageToggle = document.getElementById("languageToggle");
    if (languageToggle) {
        languageToggle.textContent = currentLang === "en" ? "English / עברית" : "עברית / English";
    }
    
    // Apply RTL/LTR classes
    const textAlignElements = document.querySelectorAll("#instructionsPage div, #results, #noChangeTrainingPage p, #changeTrainingPage p");
    textAlignElements.forEach(element => {
        if (currentLang === "he") {
            element.classList.add("rtl");
            element.classList.remove("ltr");
        } else {
            element.classList.add("ltr");
            element.classList.remove("rtl");
        }
    });
    
    // Update compact instruction summaries
    updateText("mainExperimentSummary", "mainExperimentSummary");
    updateText("noChangeSummary", "noChangeSummary");
    updateText("changeSummary", "changeSummary");
    
    // Update toggle buttons
    const updateToggleButtons = (toggleId, instructionId, showKey, hideKey) => {
        const toggleButton = document.getElementById(toggleId);
        const instructions = document.getElementById(instructionId);
        if (toggleButton && instructions) {
            if (instructions.style.display === 'none') {
                toggleButton.textContent = getText(showKey);
            } else {
                toggleButton.textContent = getText(hideKey);
            }
        }
    };
    
    updateToggleButtons('toggleExperimentDetails', 'experimentFullInstructions', 'showInstructions', 'hideInstructions');
    updateToggleButtons('toggleNoChangeDetails', 'noChangeFullInstructions', 'showInstructions', 'hideInstructions');
    updateToggleButtons('toggleChangeDetails', 'changeFullInstructions', 'showInstructions', 'hideInstructions');
    updateToggleButtons('togglePracticeDetails', 'practiceFullInstructions', 'showInstructions', 'hideInstructions');
    
    // Update trial counter if visible
    const experimentTrialInfo = document.getElementById('experimentTrialInfo');
    if (experimentTrialInfo && experimentTrialInfo.style.display !== 'none') {
        const currentTrial = window.ExperimentConfig.state.currentTrial || 1;
        const totalTrials = window.ExperimentConfig.config.numTrials;
        if (window.LanguageManager) {
            experimentTrialInfo.innerHTML = getText('trialCounter')
                .replace('{0}', `<span id="currentTrialDisplay">${currentTrial}</span>`)
                .replace('{1}', `<span id="totalTrialsDisplay">${totalTrials}</span>`);
        }
    }
}

// Toggle language function
function toggleLanguage() {
    currentLang = currentLang === "en" ? "he" : "en";
    updateLanguage();
    // Log language change if logging functions are available
    if (window.ExperimentLogger && window.ExperimentLogger.log) {
        window.ExperimentLogger.log('Language changed to: ' + (currentLang === "en" ? "English" : "Hebrew"));
    }
}

// Export language functions
window.LanguageManager = {
    langDict,
    setLanguage,
    getCurrentLanguage,
    getText,
    updateLanguage,
    toggleLanguage
};