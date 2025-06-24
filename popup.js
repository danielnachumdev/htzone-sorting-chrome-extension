document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('enable-toggle');
    const reloadPrompt = document.getElementById('reload-prompt');
    const reloadButton = document.getElementById('reload-button');

    // Load the saved state
    chrome.storage.sync.get('extensionEnabled', (data) => {
        toggle.checked = data.extensionEnabled !== false; // default to true
    });

    // Save the state when the toggle is changed
    toggle.addEventListener('change', () => {
        const isEnabled = toggle.checked;
        chrome.storage.sync.set({ extensionEnabled: isEnabled }, () => {
            // After saving, check if we need to show the reload prompt
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const currentTab = tabs[0];
                if (currentTab && currentTab.url && currentTab.url.startsWith('https://www.htzone.co.il/subcategory/')) {
                    reloadPrompt.style.display = 'block';
                }
            });
        });
    });

    // Add event listener for the reload button
    reloadButton.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.reload(tabs[0].id);
                window.close(); // Close the popup after reloading
            }
        });
    });
}); 