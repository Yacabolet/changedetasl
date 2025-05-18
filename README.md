# Change Detection Experiment

A web-based cognitive psychology experiment that measures participants' ability to detect changes in the positions of colored squares. This tool is designed for researchers studying visual working memory and change blindness.

## What is this?

This is a digital implementation of a classic change detection task used in cognitive psychology research. Participants view several colored squares briefly, then after a short blank interval, the squares reappear. Sometimes one or more squares will have moved to a different position. The participant's job is to detect whether any change occurred.

This type of experiment helps researchers understand:
- Visual working memory capacity
- Attention and change blindness
- Individual differences in cognitive processing

> **Methodological Inspiration**: This implementation draws upon established change detection paradigms for measuring storage capacity and attention in visual working memory, as discussed in Feuerstahler, L.M., Luck, S.J., MacDonald, A. *et al.* A note on the identification of change detection task models to measure storage capacity and attention in visual working memory. *Behav Res* **51**, 1360–1370 (2019). https://doi.org/10.3758/s13428-018-1082-z

## How it works

### For Participants

1. **Instructions**: Clear explanations of the task with visual examples
2. **Training**: Two guided examples showing "no change" and "change" scenarios  
3. **Practice**: Three practice trials (must get all correct to proceed)
4. **Main Experiment**: Typically 10 trials with varying change/no-change conditions
5. **Completion**: Receive a unique completion code for verification

### For Researchers

The experiment automatically:
- Records response times and accuracy for each trial
- Saves data directly to a Google Sheets spreadsheet
- Tracks individual trial results (correct/incorrect/timeout)
- Provides admin tools for managing the experiment
- Generates completion codes for participant verification

## Features

### Multi-language Support
- Full English and Hebrew translations
- Right-to-left text support for Hebrew
- Easy language switching during the experiment

### Mobile & Desktop Friendly
- Responsive design that works on phones, tablets, and computers
- Touch-friendly buttons for mobile users
- Optimized layouts for different screen sizes

### Admin Panel
- Real-time experiment monitoring
- Data management tools
- Skip functionality for testing
- Debug logging and error tracking
- Session-only authentication for security

### Robust Data Collection
- Automatic saving to Google Sheets
- Handles network interruptions gracefully
- Device fingerprinting (no personal data collected)
- Comprehensive logging for troubleshooting

## Technical Setup

### Prerequisites
- A Google account for data storage
- Google Apps Script setup (included in the backend code)
- Web hosting (can be as simple as GitHub Pages)

### Configuration
1. Set up the Google Apps Script backend
2. Update the script URLs in `js/config.js`
3. Configure experiment parameters (number of trials, timing, etc.)
4. Set admin password in the Google Apps Script

### Customization
The experiment is highly configurable:
- Number of trials and stimuli
- Display timing (study time, blank interval)
- Stimulus sizes and colors
- Movement constraints for changes
- Response time limits

## File Structure

- `index.html` - Main experiment interface
- `styles.css` - Responsive styling for all devices
- `js/` folder containing:
  - `config.js` - Experiment settings and parameters
  - `main.js` - Core initialization and event handling
  - `experiment.js` - Main experiment logic
  - `training.js` - Training and practice trial management
  - `ui.js` - User interface management
  - `network.js` - Data saving and communication
  - `admin.js` - Administrative controls
  - `language.js` - Multi-language support
  - `storage.js` - Local data management
  - `timers.js` - Timing and timeout handling
  - `utils.js` - Helper functions
  - `logger.js` - Debug logging system

## Privacy & Data Protection

This experiment is designed with privacy in mind:
- No personal information is collected
- Device identification uses browser fingerprinting (reversible hash)
- All data is anonymized
- Admin access is session-only (no persistent login)
- Complies with research ethics standards

## Research Use

This tool has been designed for academic research and can be easily adapted for different experimental conditions. It's particularly useful for:
- Online psychological studies
- Classroom demonstrations
- Individual difference research
- Cross-cultural cognitive studies

The implementation follows established methodological principles for measuring visual working memory capacity and attention, making it suitable for replication studies and novel research building upon existing paradigms.

## Support

The code is well-documented and modular, making it easy to modify for specific research needs. The admin panel provides comprehensive logging to help troubleshoot any issues during data collection.

## Citation

If you use this tool in your research, please consider citing the methodological foundation:

Feuerstahler, L.M., Luck, S.J., MacDonald, A. *et al.* A note on the identification of change detection task models to measure storage capacity and attention in visual working memory. *Behav Res* **51**, 1360–1370 (2019). https://doi.org/10.3758/s13428-018-1082-z

---

*This experiment tool was created to support cognitive psychology research and is provided freely for academic use.*