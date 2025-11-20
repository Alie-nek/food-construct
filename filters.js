document.addEventListener('DOMContentLoaded', function() {
    initFilters();
    
    function initFilters() {
        const allFilterButtons = document.querySelectorAll('.filter-btn');
        
        allFilterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const section = this.closest('section');
                const filterContainer = section.querySelector('.filters');
                const dishesContainer = section.querySelector('.dishes');
                const category = getCategoryFromSection(section);
                
                handleFilterClick(this, filterContainer, dishesContainer, category);
            });
        });
    }
    
    function handleFilterClick(clickedButton, filterContainer, dishesContainer, category) {
        const allButtons = filterContainer.querySelectorAll('.filter-btn');
        const filterKind = clickedButton.getAttribute('data-kind');
        
        if (clickedButton.classList.contains('active')) {
            clickedButton.classList.remove('active');
            showAllDishes(dishesContainer, category);
        } else {
            allButtons.forEach(btn => btn.classList.remove('active'));
            clickedButton.classList.add('active');
            applyFilter(dishesContainer, category, filterKind);
        }
    }
    
    function showAllDishes(dishesContainer, category) {
        const allDishes = dishes.filter(dish => dish.category === category);
        const sortedDishes = [...allDishes].sort((a, b) => a.name.localeCompare(b.name));
        displayFilteredDishes(sortedDishes, dishesContainer);
    }
    
    function applyFilter(dishesContainer, category, filterKind) {
        const filteredDishes = dishes.filter(dish => 
            dish.category === category && dish.kind === filterKind
        );
        
        const sortedDishes = [...filteredDishes].sort((a, b) => a.name.localeCompare(b.name));
        displayFilteredDishes(sortedDishes, dishesContainer);
    }
    
    function displayFilteredDishes(dishesArray, container) {
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
    
    function getCategoryFromSection(section) {
        const sectionId = section.id;
        const categoryMap = {
            'soups': 'soup',
            'maincourse': 'main',
            'salads': 'salad',
            'drinks-container': 'drink',
            'desserts': 'desert'
        };
        return categoryMap[sectionId] || '';
    }
});