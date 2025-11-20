document.addEventListener('DOMContentLoaded', function() {
    const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name));
    const soups = sortedDishes.filter(dish => dish.category === 'soup');
    const mains = sortedDishes.filter(dish => dish.category === 'main');
    const salads = sortedDishes.filter(dish => dish.category === 'salad');
    const drinks = sortedDishes.filter(dish => dish.category === 'drink');
    const desserts = sortedDishes.filter(dish => dish.category === 'desert');

    displayDishes(soups, 'firstdish');
    displayDishes(mains, 'secondtdish');
    displayDishes(salads, 'salads-block');
    displayDishes(drinks, 'drinks-block');
    displayDishes(desserts, 'desserts-block');

    function displayDishes(dishesArray, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = ''; 
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
            <img src="${dish.image}" alt="${dish.name}">
            <p class="price">${dish.price} ₽</p>
            <p class="name">${dish.name}</p>
            <p class="weight">${dish.count}</p>
            <button>Добавить</button>
        `;
        
        return dishCard;
    }
});