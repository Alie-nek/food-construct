function displayAllDishes() {
    if (!dishes || dishes.length === 0) {
        console.log('Нет данных для отображения');
        showNoDishesMessage();
        return;
    }
    
    console.log('Отображение блюд...');
    
    const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name));
    const soups = sortedDishes.filter(dish => dish.category === 'soup');
    const mains = sortedDishes.filter(dish => dish.category === 'main');
    const salads = sortedDishes.filter(dish => dish.category === 'salad');
    const drinks = sortedDishes.filter(dish => dish.category === 'drink');
    const desserts = sortedDishes.filter(dish => dish.category === 'desert');
    
    console.log(`Найдено: ${soups.length} супов, ${mains.length} основных блюд, ${salads.length} салатов, ${drinks.length} напитков, ${desserts.length} десертов`);
    
    displayDishes(soups, 'firstdish');
    displayDishes(mains, 'secondtdish');
    displayDishes(salads, 'salads-block');
    displayDishes(drinks, 'drinks-block');
    displayDishes(desserts, 'desserts-block');
    setTimeout(initFilters, 100);
}

function displayDishes(dishesArray, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Контейнер ${containerId} не найден`);
        return;
    }
    
    container.innerHTML = ''; 
    
    if (dishesArray.length === 0) {
        container.innerHTML = '<p class="no-dishes">Блюда не найдены</p>';
        return;
    }
    
    dishesArray.forEach(dish => {
        const dishElement = createDishElement(dish);
        container.appendChild(dishElement);
    });
}

function createDishElement(dish) {
    const dishCard = document.createElement('div');
    dishCard.className = 'dish-card';
    dishCard.setAttribute('data-dish', dish.keyword);
    dishCard.setAttribute('data-kind', dish.kind);
    
    dishCard.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}" onerror="this.style.display='none'">
        <p class="price">${dish.price} ₽</p>
        <p class="name">${dish.name}</p>
        <p class="weight">${dish.count}</p>
        <button>Добавить</button>
    `;
    
    return dishCard;
}

function showNoDishesMessage() {
    const sections = document.querySelectorAll('#soups, #maincourse, #salads, #drinks-container, #desserts');
    sections.forEach(section => {
        const dishesContainer = section.querySelector('.dishes');
        if (dishesContainer) {
            dishesContainer.innerHTML = '<p class="no-dishes">Блюда временно недоступны</p>';
        }
    });
}