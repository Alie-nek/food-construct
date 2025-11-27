const notificationMap = {
    'nothing': {
        message: 'Ничего не выбрано. Выберите блюда для заказа',
        icon: '❌'
    },
    'drink': {
        message: 'Напиток обязателен для любого комбо!',
        icon: '🥤'
    },
    'main_salad': {
        message: 'Выберите главное блюдо или салат',
        icon: '🍽️'
    },
    'soup_or_main': {
        message: 'Выберите суп или главное блюдо',
        icon: '🍲'
    },
    'main_only': {
        message: 'Главное блюдо обязательно для выбранной комбинации',
        icon: '🍛'
    },
    'invalid_combo': {
        message: 'Выбранные блюда не соответствуют ни одному из доступных комбо',
        icon: '🚫'
    }
};

function showNotification(notificationType) {
    const notificationInfo = notificationMap[notificationType];
    const existingOverlay = document.querySelector('.combo-notification');
    if (existingOverlay) {
        document.body.removeChild(existingOverlay);
    }
    
    const notification = document.createElement('div');
    notification.className = 'combo-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-image">
                ${notificationInfo.icon}
            </div>
            <h3>Внимание</h3>
            <p>${notificationInfo.message}</p>
            <button class="close-notification">Окей</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    document.body.style.overflow = 'hidden';
    const okButton = notification.querySelector('.close-notification');
    okButton.addEventListener('click', function() {
        document.body.removeChild(notification);
        document.body.style.overflow = '';
    });
    
    notification.addEventListener('click', function(e) {
        if (e.target === notification) {
            document.body.removeChild(notification);
            document.body.style.overflow = '';
        }
    });
    
    const handleEscape = function(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(notification);
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

function getNotificationType(currentOrder) {
    const hasSoup = !!currentOrder.soup;
    const hasMain = !!currentOrder.main;
    const hasSalad = !!currentOrder.salad;
    const hasDrink = !!currentOrder.drink;
    const hasDesert = !!currentOrder.desert;

    console.log('Анализ заказа для уведомления:', {
        hasSoup, hasMain, hasSalad, hasDrink, hasDesert
    });

    if (!hasSoup && !hasMain && !hasSalad && !hasDrink && !hasDesert) {
        return 'nothing';
    }
    
    if (!hasDrink) {
        return 'drink';
    }
    
    if (hasSoup && !hasMain && !hasSalad) {
        return 'main_salad'; 
    }
    
    if (hasSalad && !hasSoup && !hasMain) {
        return 'soup_or_main'; 
    }
    
    if (hasDesert && !hasSoup && !hasMain && !hasSalad) {
        return 'main_only'; 
    }
    
    if (hasDrink && !hasSoup && !hasMain && !hasSalad) {
        return 'main_salad';
    }
    
    return 'invalid_combo';
}

function validateOrderCombo(currentOrder) {
    const hasSoup = !!currentOrder.soup;
    const hasMain = !!currentOrder.main;
    const hasSalad = !!currentOrder.salad;
    const hasDrink = !!currentOrder.drink;
    
    console.log('Проверка комбо:', {
        hasSoup, hasMain, hasSalad, hasDrink
    });

    if (!hasDrink) {
        console.log('Нет напитка - комбо невалидно');
        return false;
    }
    
    const validCombinations = [
        { soup: true, main: true, salad: true, drink: true },
        { soup: true, main: true, drink: true },
        { soup: true, salad: true, drink: true },
        { main: true, salad: true, drink: true },
        { main: true, drink: true }
    ];
    
    const isValid = validCombinations.some(combo => {
        const matches = 
            (!combo.soup || hasSoup) &&
            (!combo.main || hasMain) &&
            (!combo.salad || hasSalad) &&
            (!combo.drink || hasDrink);
        
        console.log('Проверка комбо:', combo, 'результат:', matches);
        return matches;
    });
    
    console.log('Итог проверки комбо:', isValid);
    return isValid;
}

