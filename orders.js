const API_KEY = 'df737163-35b8-4b36-b94b-f06b32e59cf5';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/orders';

let orders = [];
let dishes = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeOrdersPage();
});

async function initializeOrdersPage() {
    console.log('Инициализация страницы заказов...');
    
    if (window.dishes && window.dishes.length > 0) {
        dishes = window.dishes;
        await loadOrders();
    } else {
        await loadDishes();
        await loadOrders();
    }
    
    setupModalListeners();
}

async function loadDishes() {
    try {
        const API_URL_DISHES = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';
        const response = await fetch(`${API_URL_DISHES}?api_key=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        dishes = data.map(dish => {
            return {
                ...dish,
                category: normalizeCategory(dish.category),
                kind: normalizeKind(dish.kind, dish.category)
            };
        });
        
        console.log('Блюда загружены для заказов:', dishes.length);
        
    } catch (error) {
        console.error('Ошибка при загрузке блюд:', error);
        dishes = [];
    }
}

function normalizeCategory(apiCategory) {
    const categoryMap = {
        'soup': 'soup',
        'main-course': 'main',
        'salad': 'salad',
        'drink': 'drink',
        'dessert': 'desert'
    };
    return categoryMap[apiCategory] || apiCategory;
}

function normalizeKind(apiKind, category) {
    return apiKind;
}

async function loadOrders() {
    showLoading(true);
    
    try {
        const response = await fetch(`${API_URL}?api_key=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        orders = await response.json();
        console.log('Заказы загружены:', orders);
        
        displayOrders();
        
    } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
        showError('Не удалось загрузить заказы. Пожалуйста, попробуйте позже.');
    } finally {
        showLoading(false);
    }
}

function displayOrders() {
    const tableBody = document.getElementById('orders-table-body');
    const noOrdersMessage = document.getElementById('no-orders-message');
    
    tableBody.innerHTML = '';
    
    if (orders.length === 0) {
        noOrdersMessage.style.display = 'block';
        return;
    }
    
    noOrdersMessage.style.display = 'none';
    
    const sortedOrders = [...orders].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
    );
    
    sortedOrders.forEach((order, index) => {
        const row = createOrderRow(order, index + 1);
        tableBody.appendChild(row);
    });
}

function createOrderRow(order, orderNumber) {
    const row = document.createElement('tr');
    
    const orderDate = new Date(order.created_at);
    const formattedDate = `${orderDate.getDate().toString().padStart(2, '0')}.${(orderDate.getMonth() + 1).toString().padStart(2, '0')}.${orderDate.getFullYear()} ${orderDate.getHours().toString().padStart(2, '0')}:${orderDate.getMinutes().toString().padStart(2, '0')}`;
    const orderComposition = getOrderComposition(order);
    const totalPrice = calculateOrderTotal(order);
    const deliveryTime = formatDeliveryTime(order);
    
    row.innerHTML = `
        <td>${orderNumber}</td>
        <td>${formattedDate}</td>
        <td class="order-composition">
            <p class="order-composition-text">${orderComposition}</p>
        </td>
        <td class="order-price">${totalPrice} ₽</td>
        <td class="delivery-time">${deliveryTime}</td>
        <td class="order-actions">
            <button class="action-btn btn-details" data-order-id="${order.id}">Подробнее</button>
            <button class="action-btn btn-edit" data-order-id="${order.id}">Редактирование</button>
            <button class="action-btn btn-delete" data-order-id="${order.id}">Удаление</button>
        </td>
    `;
    
    return row;
}

function getOrderComposition(order) {
    const composition = [];
    
    if (order.soup_id) {
        const dish = dishes.find(d => d.id === order.soup_id);
        if (dish) composition.push(dish.name);
    }
    
    if (order.main_course_id) {
        const dish = dishes.find(d => d.id === order.main_course_id);
        if (dish) composition.push(dish.name);
    }
    
    if (order.salad_id) {
        const dish = dishes.find(d => d.id === order.salad_id);
        if (dish) composition.push(dish.name);
    }
    
    if (order.drink_id) {
        const dish = dishes.find(d => d.id === order.drink_id);
        if (dish) composition.push(dish.name);
    }
    
    if (order.dessert_id) {
        const dish = dishes.find(d => d.id === order.dessert_id);
        if (dish) composition.push(dish.name);
    }
    
    return composition.join(', ');
}

function calculateOrderTotal(order) {
    let total = 0;
    
    if (order.soup_id) {
        const dish = dishes.find(d => d.id === order.soup_id);
        if (dish) total += dish.price;
    }
    
    if (order.main_course_id) {
        const dish = dishes.find(d => d.id === order.main_course_id);
        if (dish) total += dish.price;
    }
    
    if (order.salad_id) {
        const dish = dishes.find(d => d.id === order.salad_id);
        if (dish) total += dish.price;
    }
    
    if (order.drink_id) {
        const dish = dishes.find(d => d.id === order.drink_id);
        if (dish) total += dish.price;
    }
    
    if (order.dessert_id) {
        const dish = dishes.find(d => d.id === order.dessert_id);
        if (dish) total += dish.price;
    }
    
    return total;
}

function formatDeliveryTime(order) {
    if (order.delivery_type === 'by_time' && order.delivery_time) {
        return order.delivery_time;
    } else {
        return 'Как можно скорее (с 7:00 до 23:00)';
    }
}

function setupModalListeners() {
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeAllModals);
    });
    
    document.querySelector('.btn-ok').addEventListener('click', closeAllModals);
    
    document.querySelector('.btn-cancel').addEventListener('click', closeAllModals);
    document.querySelector('.btn-cancel-delete').addEventListener('click', closeAllModals);
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-details')) {
            const orderId = e.target.dataset.orderId;
            showOrderDetails(orderId);
        } else if (e.target.classList.contains('btn-edit')) {
            const orderId = e.target.dataset.orderId;
            showEditOrderModal(orderId);
        } else if (e.target.classList.contains('btn-delete')) {
            const orderId = e.target.dataset.orderId;
            showDeleteOrderModal(orderId);
        }
    });
    
    document.getElementById('edit-order-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveOrderChanges();
    });
    
    document.querySelector('.btn-confirm-delete').addEventListener('click', deleteOrder);
    
    document.getElementById('edit-delivery_now').addEventListener('change', function() {
        document.getElementById('edit-time-selection').style.display = 'none';
        document.getElementById('edit-delivery_time').required = false;
    });
    
    document.getElementById('edit-delivery_by_time').addEventListener('change', function() {
        document.getElementById('edit-time-selection').style.display = 'block';
        document.getElementById('edit-delivery_time').required = true;
    });
    
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
}

function showOrderDetails(orderId) {
    const order = orders.find(o => o.id == orderId);
    if (!order) return;
    
    const modal = document.getElementById('order-details-modal');
    const content = document.getElementById('order-details-content');
    
    const dishNames = getOrderComposition(order);
    const totalPrice = calculateOrderTotal(order);
    const deliveryTime = formatDeliveryTime(order);
    const orderDateTime = new Date(order.created_at).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    content.innerHTML = `
        <div class="order-detail">
            <p><strong>Дата заказа:</strong> ${orderDateTime}</p>
            <p><strong>Состав заказа:</strong> ${dishNames}</p>
            <p><strong>Стоимость:</strong> ${totalPrice} ₽</p>
            <p><strong>Время доставки:</strong> ${deliveryTime}</p>
            <p><strong>Адрес доставки:</strong> ${order.delivery_address}</p>
            <p><strong>Комментарий:</strong> ${order.comment || 'нет'}</p>
            <p><strong>Подписка на рассылку:</strong> ${order.subscribe ? 'Да' : 'Нет'}</p>
            <p><strong>Контактные данные:</strong></p>
            <p>Имя: ${order.full_name}</p>
            <p>Email: ${order.email}</p>
            <p>Телефон: ${order.phone}</p>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function showEditOrderModal(orderId) {
    const order = orders.find(o => o.id == orderId);
    if (!order) return;
    
    const modal = document.getElementById('edit-order-modal');
    
    document.getElementById('edit-full_name').value = order.full_name;
    document.getElementById('edit-email').value = order.email;
    document.getElementById('edit-phone').value = order.phone;
    document.getElementById('edit-delivery_address').value = order.delivery_address;
    document.getElementById('edit-comment').value = order.comment || '';
    document.getElementById('edit-subscribe').checked = order.subscribe === 1;
    document.getElementById('edit-order-id').value = order.id;
    
    if (order.delivery_type === 'now') {
        document.getElementById('edit-delivery_now').checked = true;
        document.getElementById('edit-time-selection').style.display = 'none';
        document.getElementById('edit-delivery_time').required = false;
    } else {
        document.getElementById('edit-delivery_by_time').checked = true;
        document.getElementById('edit-time-selection').style.display = 'block';
        document.getElementById('edit-delivery_time').value = order.delivery_time || '';
        document.getElementById('edit-delivery_time').required = true;
    }
    
    modal.style.display = 'flex';
}

async function saveOrderChanges() {
    const orderId = document.getElementById('edit-order-id').value;
    const formData = new FormData(document.getElementById('edit-order-form'));
    
    const updateData = {
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        delivery_address: formData.get('delivery_address'),
        delivery_type: formData.get('delivery_type'),
        comment: formData.get('comment'),
        subscribe: document.getElementById('edit-subscribe').checked ? 1 : 0
    };
    
    if (updateData.delivery_type === 'by_time') {
        updateData.delivery_time = formData.get('delivery_time');
        
        if (!updateData.delivery_time) {
            alert('Пожалуйста, укажите время доставки');
            return;
        }
        
        const deliveryTime = new Date(`2000-01-01T${updateData.delivery_time}`);
        const now = new Date();
        const currentTime = new Date(`2000-01-01T${now.getHours()}:${now.getMinutes()}`);
        
        if (deliveryTime < currentTime) {
            alert('Время доставки не может быть раньше текущего времени');
            return;
        }
    }
    
    try {
        const response = await fetch(`${API_URL}/${orderId}?api_key=${API_KEY}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка сервера: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Заказ обновлен:', result);
        
        const orderIndex = orders.findIndex(o => o.id == orderId);
        if (orderIndex !== -1) {
            orders[orderIndex] = { ...orders[orderIndex], ...updateData };
            if (updateData.delivery_time) {
                orders[orderIndex].delivery_time = updateData.delivery_time;
            }
        }
        
        closeAllModals();
        displayOrders();
        showSuccess('Заказ успешно изменён');
        
    } catch (error) {
        console.error('Ошибка при обновлении заказа:', error);
        showError('Не удалось изменить заказ. Пожалуйста, попробуйте еще раз.');
    }
}

function showDeleteOrderModal(orderId) {
    const modal = document.getElementById('delete-order-modal');
    document.getElementById('delete-order-id').value = orderId;
    modal.style.display = 'flex';
}

async function deleteOrder() {
    const orderId = document.getElementById('delete-order-id').value;
    
    try {
        const response = await fetch(`${API_URL}/${orderId}?api_key=${API_KEY}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Заказ удален:', result);
        
        orders = orders.filter(o => o.id != orderId);
        
        closeAllModals();
        displayOrders();
        showSuccess('Заказ успешно удалён');
        
    } catch (error) {
        console.error('Ошибка при удалении заказа:', error);
        
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function showLoading(show) {
    document.getElementById('loading-message').style.display = show ? 'block' : 'none';
}

function showError(message) {
    alert('Ошибка: ' + message);
}

function showSuccess(message) {
    alert(message);
}