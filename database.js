window.dishes = []; 

async function loadDishes() {
    try {
        console.log('Загрузка данных с API...');
        
        const API_KEY = 'df737163-35b8-4b36-b94b-f06b32e59cf5';
        const API_URL = `https://edu.std-900.ist.mospolytech.ru/labs/api/dishes?api_key=${API_KEY}`;
        
        console.log('URL запроса:', API_URL);
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Данные успешно загружены:', data);
        
        if (!data || data.length === 0) {
            throw new Error('Получен пустой ответ от сервера');
        }
        
        window.dishes = data.map(dish => {
            return {
                ...dish,
                category: normalizeCategory(dish.category),
                kind: normalizeKind(dish.kind, dish.category)
            };
        });
        
        console.log('Данные после нормализации:', window.dishes);
    
        if (typeof displayAllDishes === 'function') {
            displayAllDishes();
        }
        
        window.dispatchEvent(new Event('dishesLoaded'));
        
        return window.dishes;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        showErrorMessage('Не удалось загрузить меню. Пожалуйста, попробуйте позже.');
        window.dishes = [];
        return [];
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

function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div style="background: #ffebee; border: 1px solid #f44336; border-radius: 5px; padding: 15px; margin: 20px; text-align: center;">
            <strong>Ошибка:</strong> ${message}
        </div>
    `;
    
    const firstSection = document.querySelector('section');
    if (firstSection) {
        firstSection.parentNode.insertBefore(errorDiv, firstSection);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Запуск загрузки данных с API...');
    loadDishes();
});