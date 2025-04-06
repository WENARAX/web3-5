document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы формы
    const inputs = document.querySelectorAll('.form-input');
    const colorSelect = document.getElementById('color');
    const clearBtn = document.getElementById('clearBtn');
    const showBtn = document.getElementById('showBtn');
    const addFieldBtn = document.getElementById('addFieldBtn');
    const form = document.getElementById('skiForm');
    
    // Переменная для хранения ссылки на добавленное поле
    let addedField = null;

    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.id = 'myModal';
    modal.className = 'modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const closeSpan = document.createElement('span');
    closeSpan.className = 'close';
    closeSpan.innerHTML = '&times;';
    
    const modalText = document.createElement('p');
    modalText.id = 'modalText';
    
    modalContent.appendChild(closeSpan);
    modalContent.appendChild(modalText);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Переход между полями по нажатию Enter
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                } else {
                    // Если это последнее поле, фокус остается на нем
                    this.blur();
                }
            }
        });
    });

    // Очистка формы
    clearBtn.addEventListener('click', function() {
        inputs.forEach(input => {
            input.value = '';
        });
        
        // Очищаем добавленное поле, если оно существует
        if (addedField) {
            addedField.value = '';
        }
        
        colorSelect.selectedIndex = 0;
        inputs[0].focus();
    });

    // Показать данные в модальном окне
    showBtn.addEventListener('click', function() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const color = colorSelect.value;
        
        modalText.innerHTML = `
            <strong>ФИО:</strong> ${name}<br>
            <strong>Email:</strong> ${email}<br>
            <strong>Телефон:</strong> ${phone}
        `;
        modalText.style.color = color;
        
        modal.style.display = 'block';
    });

    // Добавление/обновление поля
    addFieldBtn.addEventListener('click', function() {
        const levelValue = document.getElementById('level').value;
        const today = new Date();
        const dateStr = today.toLocaleDateString();
        
        // Если поле уже добавлено, обновляем его значение
        if (addedField) {
            addedField.value = `${levelValue} - Дата обновления: ${dateStr}`;
            return;
        }
        
        // Создаем новое поле, если его еще нет
        const newFieldDiv = document.createElement('div');
        newFieldDiv.className = 'form-group';
        
        const newLabel = document.createElement('label');
        newLabel.textContent = 'Дополнительная информация:';
        
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.className = 'form-input';
        newInput.value = `${levelValue} - Дата добавления: ${dateStr}`;
        newInput.style.width = '100%';
        
        // Сохраняем ссылку на добавленное поле
        addedField = newInput;
        
        newFieldDiv.appendChild(newLabel);
        newFieldDiv.appendChild(newInput);
        
        // Вставляем после первого поля
        const firstInputGroup = document.querySelectorAll('.form-group')[0];
        firstInputGroup.parentNode.insertBefore(newFieldDiv, firstInputGroup.nextSibling);
    });

    // Закрытие модального окна
    closeSpan.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});