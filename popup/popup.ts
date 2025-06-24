const matchingUrls = [
    'https://www.htzone.co.il/subcategory/',
    'https://www.htzone.co.il/sale/'
];

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('enable-toggle') as HTMLInputElement | null;
    const reloadPrompt = document.getElementById('reload-prompt') as HTMLElement | null;
    const reloadButton = document.getElementById('reload-button') as HTMLButtonElement | null;

    if (!toggle || !reloadPrompt || !reloadButton) {
        console.error('Popup DOM elements not found.');
        return;
    }

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
                if (currentTab?.url && matchingUrls.some(url => currentTab.url!.startsWith(url))) {
                    reloadPrompt.style.display = 'block';
                }
            });
        });
    });

    // Add event listener for the reload button
    reloadButton.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentTab = tabs[0];
            if (currentTab?.id) {
                chrome.tabs.reload(currentTab.id);
                window.close(); // Close the popup after reloading
            }
        });
    });
}); 