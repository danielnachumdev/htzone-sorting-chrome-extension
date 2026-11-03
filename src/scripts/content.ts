// Define a type for the data structure of a sortable product
interface SortableItem {
    name: string;
    priceNow: number;
    discountAbs: number;
    discountPct: number;
    element: Element;
}

const SortEnum = {
    ALPHABETICAL_ASC: 'ALPHABETICAL_ASC',
    ALPHABETICAL_DESC: 'ALPHABETICAL_DESC',
    PRICE_ASC: 'PRICE_ASC',
    PRICE_DESC: 'PRICE_DESC',
    DISCOUNT_ABS_ASC: 'DISCOUNT_ABS_ASC',
    DISCOUNT_ABS_DESC: 'DISCOUNT_ABS_DESC',
    DISCOUNT_PERCENT_ASC: 'DISCOUNT_PERCENT_ASC',
    DISCOUNT_PERCENT_DESC: 'DISCOUNT_PERCENT_DESC',
};

// Define a type for the possible sort values from the enum
type SortType = typeof SortEnum[keyof typeof SortEnum] | '';

// --- Main Execution ---
chrome.storage.sync.get('extensionEnabled', (data) => {
    if (data.extensionEnabled === false) {
        return; // Do not run if disabled
    }

    const path = window.location.pathname;
    if (path.startsWith('/subcategory/')) {
        initSubcategoryPage();
    } else if (path.startsWith('/sale/')) {
        initSalePage();
    } else if (path.startsWith('/search-result_algolia')) {
        initAlgoliaSearchPage();
    }
});


// --- Page Initializers ---

function initSubcategoryPage() {
    let currentSortType: SortType = '';
    let observer: MutationObserver;

    function sortProducts(sortType: SortType) {
        if (observer) observer.disconnect();

        const container = document.querySelector('#filteredProducts ul.slidee');
        if (!container) return;
        const items = Array.from(container.querySelectorAll('li'));

        const getText = (el: Element, selector: string): string => el.querySelector(selector)?.textContent?.replace(/[^\d.]/g, '') || '';
        const parsePrice = (price: string | null | undefined): number => parseFloat(price || '0') || 0;

        const getSortData = (li: Element): SortableItem | null => {
            const item = li.querySelector('.item');
            if (!item) return null;
            const name = item.getAttribute('item_name')?.trim() || '';
            const priceNow = parsePrice(item.getAttribute('item_price'));
            const priceList = parsePrice(getText(item, '.priceList span'));
            const discountAbs = Math.max(priceList - priceNow, 0);
            const discountPct = priceList > 0 ? (discountAbs / priceList) * 100 : 0;
            return { name, priceNow, discountAbs, discountPct, element: li };
        };

        const sortedItems = items.map(getSortData).filter((item): item is SortableItem => item !== null).sort((a, b) => sortComparator(a, b, sortType));
        sortedItems.forEach(item => container.appendChild(item.element));

        if (observer) observer.observe(document.body, { childList: true, subtree: true });
    }

    function addSortUI() {
        if (document.querySelector('#product-sort-select')) return;

        const filterBox = document.createElement('div');
        filterBox.className = 'filterCatBox';
        filterBox.id = 'custom-sort-filter-box';

        const title = document.createElement('p');
        title.textContent = 'מיון';
        filterBox.appendChild(title);

        const dropdown = createSortDropdown((e: Event) => {
            e.stopPropagation();
            const target = e.target as HTMLSelectElement;
            const val = target.value as SortType;
            currentSortType = val;
            if (val) sortProducts(val);
        });
        filterBox.appendChild(dropdown);

        const formContainer = document.querySelector('#filter_form');
        if (formContainer) formContainer.prepend(filterBox);

        // Make sidebar sticky
        const filtersSidebar = document.querySelector('#filters') as HTMLElement | null;
        if (filtersSidebar) {
            filtersSidebar.style.position = 'sticky';
            filtersSidebar.style.top = '10px';
        }
    }

    const callback = function (mutationsList: MutationRecord[]) {
        if (!document.querySelector('#custom-sort-filter-box')) {
            addSortUI();
            const select = document.querySelector('#product-sort-select') as HTMLSelectElement | null;
            if (select) select.value = currentSortType;
        }

        let newItemsAdded = false;
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (const node of Array.from(mutation.addedNodes)) {
                    if (node.nodeName === 'LI' && (node as Element).querySelector?.('.item[item_name]')) {
                        newItemsAdded = true;
                        break;
                    }
                }
            }
            if (newItemsAdded) break;
        }

        if (newItemsAdded && currentSortType) sortProducts(currentSortType);
    };

    observer = new MutationObserver(callback);
    observer.observe(document.body, { childList: true, subtree: true });
    addSortUI();
}

function initSalePage() {
    let currentSortType: SortType = '';
    let observer: MutationObserver;

    function sortSaleProducts(sortType: SortType) {
        if (observer) observer.disconnect();
        const container = document.querySelector('.container_items');
        if (!container) return;

        const items = Array.from(container.querySelectorAll('a.inherit'));
        const parsePrice = (priceStr: string | null | undefined): number => parseFloat(priceStr?.replace(/[^\d.]/g, '') || '0') || 0;

        const getSortData = (item: Element): SortableItem | null => {
            const name = item.getAttribute('item_name')?.trim() || '';
            const priceNow = parsePrice(item.querySelector('.item_price')?.textContent);
            const priceList = parsePrice(item.querySelector('.item_price_before_discount')?.textContent);
            const discountAbs = Math.max(priceList - priceNow, 0);
            const discountPct = priceList > 0 ? (discountAbs / priceList) * 100 : 0;
            return { name, priceNow, discountAbs, discountPct, element: item };
        };

        const sortedItems = items.map(getSortData).filter((item): item is SortableItem => item !== null).sort((a, b) => sortComparator(a, b, sortType));
        sortedItems.forEach(item => container.appendChild(item.element));

        if (observer) observer.observe(document.body, { childList: true, subtree: true });
    }

    function addSortUI() {
        if (document.querySelector('#product-sort-select')) return;

        const sidebar = document.createElement('div');
        sidebar.id = 'custom-filters-sidebar';
        sidebar.style.cssText = 'width: 20%; float: left; padding: 10px; position: sticky; top: 10px;';

        const filterBox = document.createElement('div');
        filterBox.className = 'filterCatBox'; // Re-use existing class for style consistency
        filterBox.id = 'custom-sort-filter-box';

        const title = document.createElement('p');
        title.textContent = 'מיון';
        filterBox.appendChild(title);

        const dropdown = createSortDropdown((e: Event) => {
            e.stopPropagation();
            const target = e.target as HTMLSelectElement;
            const val = target.value as SortType;
            currentSortType = val;
            if (val) sortSaleProducts(val);
        });
        filterBox.appendChild(dropdown);
        sidebar.appendChild(filterBox);

        const mainContent = document.querySelector('#main_content.sale_page_wrap');
        const productContainer = document.querySelector('.container.item_container') as HTMLElement | null;
        if (mainContent && productContainer && productContainer.parentNode) {
            productContainer.parentNode.insertBefore(sidebar, productContainer);
            // Adjust product container to make space for sidebar
            productContainer.style.width = '80%';
            productContainer.style.float = 'right';
        }
    }

    const callback = function (mutationsList: MutationRecord[]) {
        if (!document.querySelector('#custom-sort-filter-box')) {
            addSortUI();
            const select = document.querySelector('#product-sort-select') as HTMLSelectElement | null;
            if (select) select.value = currentSortType;
        }

        let newItemsAdded = false;
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && (mutation.target as Element).classList.contains('container_items')) {
                newItemsAdded = true;
                break;
            }
        }

        if (newItemsAdded && currentSortType) sortSaleProducts(currentSortType);
    };

    observer = new MutationObserver(callback);
    observer.observe(document.body, { childList: true, subtree: true });
    addSortUI();
}

function initAlgoliaSearchPage() {
    let currentSortType: SortType = '';
    let observer: MutationObserver;

    function sortAlgoliaProducts(sortType: SortType) {
        if (observer) observer.disconnect();

        // Find the Algolia hits list container
        const container = document.querySelector('.ais-Hits-list');
        if (!container) return;

        // Find all product items (li.ais-Hits-item)
        const items = Array.from(container.querySelectorAll('li.ais-Hits-item'));

        const parsePrice = (priceStr: string | null | undefined): number => parseFloat(priceStr?.replace(/[^\d.]/g, '') || '0') || 0;

        const getSortData = (item: Element): SortableItem | null => {
            // Find the gallery_item div which contains the item attributes
            const galleryItem = item.querySelector('.gallery_item');
            if (!galleryItem) return null;

            // Get product name from .item_text > div
            const nameElement = galleryItem.querySelector('.item_text > div, .item_text div');
            const name = nameElement?.textContent?.trim() || '';

            // Get current price from item_price attribute on gallery_item or from .item_price text
            const itemPriceAttr = galleryItem.getAttribute('item_price');
            const itemPriceElement = galleryItem.querySelector('.item_price');
            const priceNow = itemPriceAttr ?
                parsePrice(itemPriceAttr) :
                parsePrice(itemPriceElement?.textContent);

            // Get list price (before discount) from .item_price_before_discount
            const priceListElement = galleryItem.querySelector('.item_price_before_discount');
            const priceList = priceListElement ? parsePrice(priceListElement.textContent) : 0;

            const discountAbs = Math.max(priceList - priceNow, 0);
            const discountPct = priceList > 0 ? (discountAbs / priceList) * 100 : 0;

            // Only return item if we found at least a name
            if (!name) return null;

            return { name, priceNow, discountAbs, discountPct, element: item };
        };

        const sortedItems = items.map(getSortData).filter((item): item is SortableItem => item !== null).sort((a, b) => sortComparator(a, b, sortType));
        sortedItems.forEach(item => container.appendChild(item.element));

        if (observer) observer.observe(document.body, { childList: true, subtree: true });
    }

    function addSortUI() {
        if (document.querySelector('#product-sort-select')) return;

        // Find the specific filter container for Algolia search pages
        const filterContainer = document.querySelector('#contentWrapper > div > div.search-panel > div.search-panel__filters > div');

        if (!filterContainer) return; // Don't add UI if container doesn't exist yet

        const filterBox = document.createElement('div');
        filterBox.className = 'filterCatBox';
        filterBox.id = 'custom-sort-filter-box';

        const title = document.createElement('p');
        title.textContent = 'מיון';
        filterBox.appendChild(title);

        const dropdown = createSortDropdown((e: Event) => {
            e.stopPropagation();
            const target = e.target as HTMLSelectElement;
            const val = target.value as SortType;
            currentSortType = val;
            if (val) sortAlgoliaProducts(val);
        });
        filterBox.appendChild(dropdown);

        filterContainer.appendChild(filterBox);
    }

    const callback = function (mutationsList: MutationRecord[]) {
        if (!document.querySelector('#custom-sort-filter-box')) {
            addSortUI();
            const select = document.querySelector('#product-sort-select') as HTMLSelectElement | null;
            if (select) select.value = currentSortType;
        }

        let newItemsAdded = false;
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (const node of Array.from(mutation.addedNodes)) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as Element;
                        // Check if it's an Algolia hit item or contains one
                        if (element.classList?.contains('ais-Hits-item') ||
                            element.querySelector?.('li.ais-Hits-item, .gallery_item')) {
                            newItemsAdded = true;
                            break;
                        }
                    }
                }
            }
            if (newItemsAdded) break;
        }

        if (newItemsAdded && currentSortType) sortAlgoliaProducts(currentSortType);
    };

    observer = new MutationObserver(callback);
    observer.observe(document.body, { childList: true, subtree: true });
    addSortUI();
}


// --- Generic Helper Functions ---

function createSortDropdown(onChangeCallback: (e: Event) => void): HTMLDivElement {
    const container = document.createElement('div');
    container.style.cssText = 'padding: 10px 0; text-align: right;';

    const label = document.createElement('label');
    label.textContent = 'מיון לפי: ';
    label.setAttribute('for', 'product-sort-select');
    label.style.fontSize = '14px';

    const select = document.createElement('select');
    select.id = 'product-sort-select';
    select.style.cssText = 'margin-left: 5px; font-size: 14px;';

    const options = [
        { label: 'ללא מיון', value: '' },
        { label: 'שם (א-ת)', value: SortEnum.ALPHABETICAL_ASC },
        { label: 'שם (ת-א)', value: SortEnum.ALPHABETICAL_DESC },
        { label: 'מחיר (מהזול ליקר)', value: SortEnum.PRICE_ASC },
        { label: 'מחיר (מהיקר לזול)', value: SortEnum.PRICE_DESC },
        { label: 'הנחה בשקלים (מהנמוכה לגבוהה)', value: SortEnum.DISCOUNT_ABS_ASC },
        { label: 'הנחה בשקלים (מהגבוהה לנמוכה)', value: SortEnum.DISCOUNT_ABS_DESC },
        { label: 'הנחה באחוזים (מהנמוכה לגבוהה)', value: SortEnum.DISCOUNT_PERCENT_ASC },
        { label: 'הנחה באחוזים (מהגבוהה לנמוכה)', value: SortEnum.DISCOUNT_PERCENT_DESC },
    ];

    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        select.appendChild(option);
    });

    select.addEventListener('change', onChangeCallback);

    container.appendChild(label);
    container.appendChild(select);

    return container;
}

function sortComparator(a: SortableItem, b: SortableItem, sortType: SortType): number {
    switch (sortType) {
        case SortEnum.ALPHABETICAL_ASC: return a.name.localeCompare(b.name);
        case SortEnum.ALPHABETICAL_DESC: return b.name.localeCompare(a.name);
        case SortEnum.PRICE_ASC: return a.priceNow - b.priceNow;
        case SortEnum.PRICE_DESC: return b.priceNow - a.priceNow;
        case SortEnum.DISCOUNT_ABS_ASC: return a.discountAbs - b.discountAbs;
        case SortEnum.DISCOUNT_ABS_DESC: return b.discountAbs - a.discountAbs;
        case SortEnum.DISCOUNT_PERCENT_ASC: return a.discountPct - b.discountPct;
        case SortEnum.DISCOUNT_PERCENT_DESC: return b.discountPct - a.discountPct;
        default: return 0;
    }
}
