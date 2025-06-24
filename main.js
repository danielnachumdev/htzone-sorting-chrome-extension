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

chrome.storage.sync.get('extensionEnabled', (data) => {
    if (data.extensionEnabled === false) {
        return; // Do not run if disabled
    }

    let currentSortType = '';
    let observer;

    function sortProducts(sortType) {
        if (observer) {
            observer.disconnect();
        }

        const container = document.querySelector('#filteredProducts ul.slidee');
        const items = Array.from(container.querySelectorAll('li'));

        const getText = (el, selector) => {
            const found = el.querySelector(selector);
            return found ? found.textContent.replace(/[^\d.]/g, '') : '';
        };

        const parsePrice = (price) => parseFloat(price || '0') || 0;

        const getSortData = (li) => {
            const item = li.querySelector('.item');
            const name = item?.getAttribute('item_name')?.trim() || '';
            const priceNow = parsePrice(item?.getAttribute('item_price'));
            const priceList = parsePrice(getText(item, '.priceList span'));
            const discountAbs = Math.max(priceList - priceNow, 0);
            const discountPct = priceList > 0 ? (discountAbs / priceList) * 100 : 0;
            return { name, priceNow, discountAbs, discountPct };
        };

        items.sort((a, b) => {
            const aData = getSortData(a);
            const bData = getSortData(b);

            switch (sortType) {
                case SortEnum.ALPHABETICAL_ASC:
                    return aData.name.localeCompare(bData.name);
                case SortEnum.ALPHABETICAL_DESC:
                    return bData.name.localeCompare(aData.name);
                case SortEnum.PRICE_ASC:
                    return aData.priceNow - bData.priceNow;
                case SortEnum.PRICE_DESC:
                    return bData.priceNow - aData.priceNow;
                case SortEnum.DISCOUNT_ABS_ASC:
                    return aData.discountAbs - bData.discountAbs;
                case SortEnum.DISCOUNT_ABS_DESC:
                    return bData.discountAbs - aData.discountAbs;
                case SortEnum.DISCOUNT_PERCENT_ASC:
                    return aData.discountPct - bData.discountPct;
                case SortEnum.DISCOUNT_PERCENT_DESC:
                    return bData.discountPct - aData.discountPct;
                default:
                    return 0;
            }
        });

        // Reorder DOM
        items.forEach(li => container.appendChild(li));

        if (observer) {
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    function addSortDropdownOnce() {
        if (document.querySelector('#product-sort-select')) return; // prevent multiple inserts

        const filterBox = document.createElement('div');
        filterBox.className = 'filterCatBox';

        const title = document.createElement('p');
        title.textContent = 'מיון';

        const sortContainer = document.createElement('div');
        sortContainer.style.padding = '10px 0';
        sortContainer.style.textAlign = 'right';

        const label = document.createElement('label');
        label.textContent = 'מיון לפי: ';
        label.setAttribute('for', 'product-sort-select');
        label.style.fontSize = '14px';

        const select = document.createElement('select');
        select.id = 'product-sort-select';
        select.style.marginLeft = '5px';
        select.style.fontSize = '14px';

        const options = [
            { label: 'ללא מיון', value: '' },
            { label: 'שם (א-ת)', value: 'ALPHABETICAL_ASC' },
            { label: 'שם (ת-א)', value: 'ALPHABETICAL_DESC' },
            { label: 'מחיר (מהזול ליקר)', value: 'PRICE_ASC' },
            { label: 'מחיר (מהיקר לזול)', value: 'PRICE_DESC' },
            { label: 'הנחה שקלית (מהנמוכה לגבוהה)', value: 'DISCOUNT_ABS_ASC' },
            { label: 'הנחה שקלית (מהגבוהה לנמוכה)', value: 'DISCOUNT_ABS_DESC' },
            { label: 'הנחה אחוזית (מהנמוכה לגבוהה)', value: 'DISCOUNT_PERCENT_ASC' },
            { label: 'הנחה אחוזית (מהגבוהה לנמוכה)', value: 'DISCOUNT_PERCENT_DESC' },
        ];

        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            select.appendChild(option);
        });

        select.addEventListener('change', (e) => {
            e.stopPropagation();
            const val = e.target.value;
            currentSortType = val;
            if (val) {
                sortProducts(val);
            }
        });

        sortContainer.appendChild(label);
        sortContainer.appendChild(select);

        filterBox.appendChild(title);
        filterBox.appendChild(sortContainer);

        const formContainer = document.querySelector('#filter_form');
        if (formContainer) {
            formContainer.prepend(filterBox);
        }
    }

    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    const callback = function (mutationsList, observer) {
        const container = document.querySelector('#filteredProducts');
        if (!container) return;

        // Ensure dropdown exists and restore its state if it was re-added
        if (!document.querySelector('#product-sort-select')) {
            addSortDropdownOnce();
            const select = document.querySelector('#product-sort-select');
            if (select) {
                select.value = currentSortType;
            }
        }

        // Check if new product list items were added
        let newItemsAdded = false;
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    // Check if the node is an element that contains a product item
                    if (node.nodeName === 'LI' && node.querySelector && node.querySelector('.item[item_name]')) {
                        newItemsAdded = true;
                        break;
                    }
                }
            }
            if (newItemsAdded) break;
        }

        // Re-apply sort if new items were added and a sort is active
        if (newItemsAdded && currentSortType) {
            sortProducts(currentSortType);
        }
    };

    observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    addSortDropdownOnce();
});
