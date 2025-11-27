document.addEventListener('DOMContentLoaded', function() {
    console.log('OrderManager loaded');
    
    if (window.dishes && window.dishes.length > 0) {
        initializeOrderManager();
    } else {
        window.addEventListener('dishesLoaded', initializeOrderManager);
        const checkDishes = setInterval(() => {
            if (window.dishes && window.dishes.length > 0) {
                clearInterval(checkDishes);
                initializeOrderManager();
            }
        }, 100);
    }
});

function initializeOrderManager() {
    console.log('Инициализация orderManager с блюдами:', window.dishes.length);
    loadOrderFromStorage();
    updateFloatingPanel();
    highlightSelectedDishes();
    setupEventListeners();
}

function loadOrderFromStorage() {
    const savedOrder = localStorage.getItem('foodConstructOrder');
    if (savedOrder) {
        window.currentOrder = JSON.parse(savedOrder);
        console.log('Загружен заказ из localStorage:', window.currentOrder);
    } else {
        window.currentOrder = {
            soup: null,
            main: null,
            salad: null,
            drink: null,
            desert: null
        };
    }
}

function saveOrderToStorage() {
    localStorage.setItem('foodConstructOrder', JSON.stringify(window.currentOrder));
}

function setupEventListeners() {
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' && e.target.textContent === 'Добавить') {
            const dishCard = e.target.closest('.dish-card');
            if (dishCard) {
                const dishKeyword = dishCard.getAttribute('data-dish');
                const dish = window.dishes.find(d => d.keyword === dishKeyword);
                
                if (dish) {
                    addToOrder(dish);
                    updateFloatingPanel();
                    saveOrderToStorage();
                    highlightSelectedDishes();
                } else {
                    console.log('Блюдо не найдено по keyword:', dishKeyword);
                }
            }
        }
    });
}

function addToOrder(dish) {
    window.currentOrder[dish.category] = dish.id;
    console.log('Добавлено в заказ:', dish.name, 'ID:', dish.id, 'Категория:', dish.category);
}

function updateFloatingPanel() {
    const floatingPanel = document.getElementById('floating-order-panel');
    const floatingTotal = document.getElementById('floating-total');
    const checkoutBtn = document.getElementById('floating-checkout-btn');
    
    if (!floatingPanel || !floatingTotal || !checkoutBtn) return;
    
    let total = 0;
    let hasItems = false;
    
    Object.values(window.currentOrder).forEach(dishId => {
        if (dishId) {
            const dish = window.dishes.find(d => d.id == dishId);
            if (dish) {
                total += dish.price;
                hasItems = true;
            }
        }
    });
    
    floatingTotal.textContent = `${total} ₽`;
    
    if (hasItems) {
        floatingPanel.classList.add('visible');
    } else {
        floatingPanel.classList.remove('visible');
    }
    
    const isValidCombo = validateOrderCombo(window.currentOrder);
    if (isValidCombo) {
        checkoutBtn.classList.remove('disabled');
        checkoutBtn.onclick = null;
    } else {
        checkoutBtn.classList.add('disabled');
        checkoutBtn.onclick = (e) => {
            e.preventDefault();
            const notificationType = getNotificationType(window.currentOrder);
            showNotification(notificationType);
        };
    }
}

function highlightSelectedDishes() {
    if (!window.dishes || window.dishes.length === 0) return;
    
    document.querySelectorAll('.dish-card').forEach(card => {
        card.classList.remove('selected');
        const button = card.querySelector('button');
        if (button) {
            button.textContent = 'Добавить';
            button.style.background = '';
        }
    });
    
    Object.entries(window.currentOrder).forEach(([category, dishId]) => {
        if (dishId) {
            const dish = window.dishes.find(d => d.id == dishId);
            if (dish) {
                const dishCard = document.querySelector(`[data-dish="${dish.keyword}"]`);
                if (dishCard) {
                    dishCard.classList.add('selected');
                    const button = dishCard.querySelector('button');
                    if (button) {
                        button.textContent = 'Выбрано';
                        button.style.background = '#4CAF50';
                    }
                }
            }
        }
    });
}