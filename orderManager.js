document.addEventListener('DOMContentLoaded', function() {
    let currentOrder = {
        soup: null,
        main: null,
        salad: null,
        drink: null,
        desert: null
    };
    
    const orderSummary = document.getElementById('order-summary');
    const noSelectionMessage = document.getElementById('no-selection-message');
    const soupCategory = document.getElementById('soup-category');
    const mainCategory = document.getElementById('main-category');
    const saladCategory = document.getElementById('salad-category');
    const drinkCategory = document.getElementById('drink-category');
    const dessertCategory = document.getElementById('dessert-category');
    const soupSelected = document.getElementById('soup-selected');
    const mainSelected = document.getElementById('main-selected');
    const saladSelected = document.getElementById('salad-selected');
    const drinkSelected = document.getElementById('drink-selected');
    const dessertSelected = document.getElementById('dessert-selected');
    const totalPriceSection = document.getElementById('total-price-section');
    const totalAmount = document.getElementById('total-amount');
    
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' && e.target.textContent === 'Добавить') {
            const dishCard = e.target.closest('.dish-card');
            if (dishCard) {
                const dishKeyword = dishCard.getAttribute('data-dish');
                const dish = dishes.find(d => d.keyword === dishKeyword);
                
                if (dish) {
                    addToOrder(dish);
                    updateOrderDisplay();
                    updateTotalPrice();
                }
            }
        }
    });
    
    function addToOrder(dish) {
        currentOrder[dish.category] = dish;
    }
    
    function updateOrderDisplay() {
        const hasAnySelection = Object.values(currentOrder).some(item => item !== null);
        
        noSelectionMessage.style.display = hasAnySelection ? 'none' : 'block';
        
        updateCategoryDisplay('soup', soupCategory, soupSelected, 'Блюдо не выбрано');
        updateCategoryDisplay('main', mainCategory, mainSelected, 'Блюдо не выбрано');
        updateCategoryDisplay('salad', saladCategory, saladSelected, 'Блюдо не выбрано');
        updateCategoryDisplay('drink', drinkCategory, drinkSelected, 'Напиток не выбран');
        updateCategoryDisplay('desert', dessertCategory, dessertSelected, 'Десерт не выбран');
        
        soupCategory.style.display = hasAnySelection ? 'block' : 'none';
        mainCategory.style.display = hasAnySelection ? 'block' : 'none';
        saladCategory.style.display = hasAnySelection ? 'block' : 'none';
        drinkCategory.style.display = hasAnySelection ? 'block' : 'none';
        dessertCategory.style.display = hasAnySelection ? 'block' : 'none';
    }
    
    function updateCategoryDisplay(category, categoryElement, selectedElement, emptyText) {
        const dish = currentOrder[category];
        
        if (dish) {
            selectedElement.innerHTML = `
                <span class="selected-dish-name">${dish.name}</span>
                <span class="selected-dish-price">${dish.price} ₽</span>
            `;
        } else {
            selectedElement.innerHTML = `
                <span class="no-dish-text">${emptyText}</span>
            `;
        }
    }
    
    function updateTotalPrice() {
        let total = 0;
        Object.values(currentOrder).forEach(dish => {
            if (dish) {
                total += dish.price;
            }
        });
        
        if (total > 0) {
            totalAmount.textContent = `${total} ₽`;
            totalPriceSection.style.display = 'block';
        } else {
            totalPriceSection.style.display = 'none';
        }
    }
    
    
    
    function getCategoryTitle(category) {
        const titles = {
            'soup': 'суп',
            'main': 'главное блюдо', 
            'salad': 'салат',
            'drink': 'напиток',
            'desert': 'десерт'
        };
        return titles[category] || '';
    }
    
    updateOrderDisplay();
    updateTotalPrice();
});