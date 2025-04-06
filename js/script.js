// Сохранение данных в localStorage
function saveFormData(formData) {
    let responses = JSON.parse(localStorage.getItem('furnitureSurveyResponses')) || [];
    responses.push(formData);
    localStorage.setItem('furnitureSurveyResponses', JSON.stringify(responses));
}

// Валидация формы
function validateForm() {
    const form = document.getElementById('surveyForm');
    const name = form.elements['name'].value;
    const email = form.elements['email'].value;
    const birthdate = form.elements['birthdate'].value;
    const style = form.elements['style'].value;
    const frequency = form.querySelector('input[name="frequency"]:checked');
    
    if (!name || !email || !birthdate || !style || !frequency) {
        alert('Пожалуйста, заполните все обязательные поля!');
        return false;
    }
    
    return true;
}

// Обработка отправки формы
document.getElementById('surveyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const formData = {
        name: this.elements['name'].value,
        email: this.elements['email'].value,
        phone: this.elements['phone'].value,
        birthdate: this.elements['birthdate'].value,
        style: this.elements['style'].value,
        color1: this.elements['color1'].value,
        color2: this.elements['color2'].value,
        furniture: Array.from(this.elements['furniture[]'])
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value),
        frequency: this.querySelector('input[name="frequency"]:checked').value,
        comments: this.elements['comments'].value,
        timestamp: new Date().toISOString()
    };
    
    saveFormData(formData);
    // Сохраняем текущие данные в sessionStorage для передачи
    sessionStorage.setItem('currentResponse', JSON.stringify(formData));
    window.open('html/results.html', '_blank', 'width=800,height=600,resizable=yes');
});

// Просмотр результатов без отправки формы
function viewResults() {
    const responses = JSON.parse(localStorage.getItem('furnitureSurveyResponses')) || [];
    
    if (responses.length === 0) {
        alert('Нет сохраненных результатов опроса.');
        return;
    }
    
    // Сохраняем последние данные в sessionStorage для передачи
    sessionStorage.setItem('currentResponse', JSON.stringify(responses[responses.length - 1]));
    window.open('html/results.html', '_blank', 'width=800,height=600,resizable=yes');
}

// Вспомогательная функция для получения читаемых имен полей
function getFieldName(key) {
    const names = {
        name: 'Имя',
        email: 'Email',
        phone: 'Телефон',
        birthdate: 'Дата рождения',
        style: 'Предпочитаемый стиль',
        color1: 'Цвет 1',
        color2: 'Цвет 2',
        furniture: 'Интересующие типы мебели',
        frequency: 'Частота покупок',
        comments: 'Пожелания'
    };
    
    return names[key] || key;
}

