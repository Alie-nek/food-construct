document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkout page loaded');
    
    if (window.dishes && window.dishes.length > 0) {
        initializeCheckout();
    } else {
        window.addEventListener('dishesLoaded', initializeCheckout);
        const checkDishes = setInterval(() => {
            if (window.dishes && window.dishes.length > 0) {
                clearInterval(checkDishes);
                initializeCheckout();
            }
        }, 100);
    }
});

function initializeCheckout() {
    loadOrderFromStorage();
    displayOrderCards();
    displayOrderForm();
    setupEventListeners();
    restoreFormFromStorage();
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

function displayOrderCards() {
    const container = document.getElementById('order-items-container');
    const emptyMessage = document.getElementById('no-selection-message');
    
    let hasItems = false;
    
    container.innerHTML = '';
    
    for (const [category, dishId] of Object.entries(window.currentOrder)) {
        if (dishId) {
            const dish = window.dishes.find(d => d.id == dishId);
            if (dish) {
                hasItems = true;
                
                const dishElement = createDishCardElement(dish, category);
                container.appendChild(dishElement);
            }
        }
    }
    
    emptyMessage.style.display = hasItems ? 'none' : 'block';
    container.style.display = hasItems ? 'grid' : 'none';
    
    console.log('Карточки: есть блюда:', hasItems);
}

function displayOrderForm() {
   
    
    const noSelectionMessage = document.getElementById('no-selection-form-message');
    const totalAmount = document.getElementById('total-amount');
    const totalPriceSection = document.getElementById('total-price-section');
    
    if (!noSelectionMessage || !totalAmount || !totalPriceSection) {
        
        return;
    }
    
    let total = 0;
    let hasItems = false;
    
   
    const categories = [
        { 
            key: 'soup', 
            element: document.getElementById('soup-selected'), 
            container: document.getElementById('soup-category'),
            emptyText: 'Не выбран' 
        },
        { 
            key: 'main', 
            element: document.getElementById('main-selected'), 
            container: document.getElementById('main-category'),
            emptyText: 'Не выбрано' 
        },
        { 
            key: 'salad', 
            element: document.getElementById('salad-selected'), 
            container: document.getElementById('salad-category'),
            emptyText: 'Не выбран' 
        },
        { 
            key: 'drink', 
            element: document.getElementById('drink-selected'), 
            container: document.getElementById('drink-category'),
            emptyText: 'Не выбран' 
        },
        { 
            key: 'desert', 
            element: document.getElementById('dessert-selected'), 
            container: document.getElementById('dessert-category'),
            emptyText: 'Не выбран' 
        }
    ];
    
    categories.forEach(category => {
        if (category.container) {
            category.container.style.display = 'none';
        }
    });
    
    categories.forEach(category => {
        if (!category.element || !category.container) {
            return;
        }
        
        const dishId = window.currentOrder[category.key];
        
        if (dishId) {
            const dish = window.dishes.find(d => d.id == dishId);
            if (dish) {
                hasItems = true;
                total += dish.price;
                category.element.innerHTML = `
                    <span class="selected-dish-name">${dish.name}</span>
                    <span class="selected-dish-price">${dish.price} ₽</span>
                `;
                category.container.style.display = 'block';
               
            }
        }
    });
    
    noSelectionMessage.style.display = hasItems ? 'none' : 'block';
    totalPriceSection.style.display = hasItems ? 'block' : 'none';
    totalAmount.textContent = `${total} ₽`;
    
}

function createDishCardElement(dish, category) {
    const dishCard = document.createElement('div');
    dishCard.className = 'dish-card';
    dishCard.setAttribute('data-dish', dish.keyword);
    dishCard.setAttribute('data-kind', dish.kind);
    
    dishCard.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}" onerror="this.style.display='none'">
        <p class="price">${dish.price} ₽</p>
        <p class="name">${dish.name}</p>
        <p class="weight">${dish.count}</p>
        <button class="remove-btn" data-category="${category}">Удалить</button>
    `;
    
    return dishCard;
}

function setupEventListeners() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-btn')) {
            const category = e.target.getAttribute('data-category');
            removeFromOrder(category);
        }
    });
    
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        submitOrder();
    });
    
    document.getElementById('checkout-form').addEventListener('input', function() {
        saveFormToStorage();
    });
    
    document.getElementById('reset').addEventListener('click', function() {
        localStorage.removeItem('foodConstructForm');
        setTimeout(restoreFormFromStorage, 100);
    });
}



function removeFromOrder(category) {
    window.currentOrder[category] = null;
    saveOrderToStorage();
    displayOrderCards(); 
    displayOrderForm();  
    
    if (typeof updateFloatingPanel === 'function') {
        updateFloatingPanel();
    }
}

function saveOrderToStorage() {
    localStorage.setItem('foodConstructOrder', JSON.stringify(window.currentOrder));
}

function saveFormToStorage() {
    const formData = {
        name: document.getElementById('nameuser').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('tel').value,
        address: document.getElementById('address').value,
        subscribe: document.getElementById('inf').checked,
        deliveryType: document.querySelector('input[name="timeofdel"]:checked').value,
        deliveryTime: document.getElementById('time').value,
        comment: document.getElementById('comment').value
    };
    localStorage.setItem('foodConstructForm', JSON.stringify(formData));
}

function restoreFormFromStorage() {
    const savedForm = localStorage.getItem('foodConstructForm');
    if (savedForm) {
        const formData = JSON.parse(savedForm);
        document.getElementById('nameuser').value = formData.name || '';
        document.getElementById('email').value = formData.email || '';
        document.getElementById('tel').value = formData.phone || '';
        document.getElementById('address').value = formData.address || '';
        document.getElementById('inf').checked = formData.subscribe !== false;
        
        if (formData.deliveryType) {
            document.querySelector(`input[name="timeofdel"][value="${formData.deliveryType}"]`).checked = true;
        }
        
        document.getElementById('time').value = formData.deliveryTime || '';
        document.getElementById('comment').value = formData.comment || '';
        
    }
}

async function submitOrder() {
    if (!validateOrderCombo(window.currentOrder)) {
        console.log('Комбо невалидно, показываем уведомление');
        const notificationType = getNotificationType(window.currentOrder);
        showNotification(notificationType);
        return; 
    }
    
    console.log('Комбо валидно, продолжаем отправку...');
    
    if (document.getElementById('time-specified').checked && !document.getElementById('time').value) {
        alert('Пожалуйста, укажите время доставки');
        return;
    }
    
    const formData = {
        full_name: document.getElementById('nameuser').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('tel').value,
        subscribe: document.getElementById('inf').checked ? 1 : 0,
        delivery_address: document.getElementById('address').value,
        delivery_type: document.querySelector('input[name="timeofdel"]:checked').value === 'soon' ? 'now' : 'by_time',
        comment: document.getElementById('comment').value || ''
    };
    
    if (formData.delivery_type === 'by_time') {
        formData.delivery_time = document.getElementById('time').value;
        
        if (!formData.delivery_time) {
            alert('Пожалуйста, укажите время доставки');
            return;
        }
        
        const deliveryTime = new Date(`2000-01-01T${formData.delivery_time}`);
        const now = new Date();
        const currentTime = new Date(`2000-01-01T${now.getHours()}:${now.getMinutes()}`);
        
        if (deliveryTime < currentTime) {
            alert('Время доставки не может быть раньше текущего времени');
            return;
        }
    }
    
    if (window.currentOrder.soup) formData.soup_id = parseInt(window.currentOrder.soup);
    if (window.currentOrder.main) formData.main_course_id = parseInt(window.currentOrder.main);
    if (window.currentOrder.salad) formData.salad_id = parseInt(window.currentOrder.salad);
    if (window.currentOrder.drink) formData.drink_id = parseInt(window.currentOrder.drink);
    if (window.currentOrder.desert) formData.dessert_id = parseInt(window.currentOrder.desert);
    
    console.log('Отправляемые данные заказа:', formData);
    
    try {
        const API_KEY = 'df737163-35b8-4b36-b94b-f06b32e59cf5';
        const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/orders';
        
        const response = await fetch(`${API_URL}?api_key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка сервера: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Заказ успешно создан:', result);
        
        localStorage.removeItem('foodConstructOrder');
        localStorage.removeItem('foodConstructForm');
        
        alert('Заказ успешно оформлен!');
        window.location.href = 'orders.html';
        
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
    }
}