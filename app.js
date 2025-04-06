// Основной объект приложения
const PolyclinicApp = {
    visitors: [],
    customProperties: [],

    // Инициализация приложения
    init() {
        this.loadVisitors();
        this.setupEventListeners();
        this.updateVisitorSelect();
        this.renderVisitorsTable();
    },

    // Загрузка данных из localStorage
    loadVisitors() {
        const savedVisitors = localStorage.getItem('polyclinicVisitors');
        const savedProperties = localStorage.getItem('customProperties');
        
        if (savedVisitors) {
            this.visitors = JSON.parse(savedVisitors);
        }
        
        if (savedProperties) {
            this.customProperties = JSON.parse(savedProperties);
            this.customProperties.forEach(prop => {
                this.addPropertyToForm(prop);
            });
        }
    },

    // Сохранение данных в localStorage
    saveVisitors() {
        localStorage.setItem('polyclinicVisitors', JSON.stringify(this.visitors));
        localStorage.setItem('customProperties', JSON.stringify(this.customProperties));
    },

    // Настройка обработчиков событий
    setupEventListeners() {
        // Основные кнопки
        document.getElementById('addBtn').addEventListener('click', () => this.addVisitor());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearForm());
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteVisitor());
        document.getElementById('updateBtn').addEventListener('click', () => this.updateVisitor());
        
        // Поиск
        document.getElementById('searchBtn').addEventListener('click', () => this.searchVisitor());
        document.getElementById('showAllBtn').addEventListener('click', () => this.renderVisitorsTable());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchVisitor();
        });
        
        // Добавление свойств
        document.getElementById('addPropertyBtn').addEventListener('click', () => this.addCustomProperty());
        document.getElementById('newPropertyType').addEventListener('change', (e) => {
            const optionsContainer = document.getElementById('selectOptionsContainer');
            optionsContainer.classList.toggle('hidden', e.target.value !== 'select');
        });
        
        // Выбор посетителя из списка
        document.getElementById('visitorSelect').addEventListener('change', (e) => {
            if (e.target.value) {
                const visitor = this.visitors.find(v => v.id === e.target.value);
                if (visitor) this.fillForm(visitor);
            } else {
                this.clearForm();
            }
        });
    },

    // Генерация ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Добавление посетителя
    addVisitor() {
        const visitor = this.getFormData();
        if (!visitor.fullName) {
            alert('Пожалуйста, введите ФИО посетителя');
            return;
        }
        
        visitor.id = this.generateId();
        this.visitors.push(visitor);
        this.saveVisitors();
        this.updateVisitorSelect();
        this.renderVisitorsTable();
        this.clearForm();
        alert('Посетитель успешно добавлен');
    },

    // Обновление посетителя
    updateVisitor() {
        const select = document.getElementById('visitorSelect');
        if (!select.value) {
            alert('Выберите посетителя для обновления');
            return;
        }
        
        const index = this.visitors.findIndex(v => v.id === select.value);
        if (index !== -1) {
            this.visitors[index] = this.getFormData();
            this.visitors[index].id = select.value;
            this.saveVisitors();
            this.updateVisitorSelect();
            this.renderVisitorsTable();
            this.clearForm();
            alert('Данные посетителя обновлены');
        }
    },

    // Удаление посетителя
    deleteVisitor() {
        const select = document.getElementById('visitorSelect');
        if (!select.value) {
            alert('Выберите посетителя для удаления');
            return;
        }
        
        if (confirm('Вы уверены, что хотите удалить этого посетителя?')) {
            this.visitors = this.visitors.filter(v => v.id !== select.value);
            this.saveVisitors();
            this.updateVisitorSelect();
            this.renderVisitorsTable();
            this.clearForm();
            alert('Посетитель удален');
        }
    },

    // Поиск посетителя
    searchVisitor() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        if (!searchTerm) {
            this.renderVisitorsTable();
            return;
        }
        
        const filtered = this.visitors.filter(v => 
            v.fullName.toLowerCase().includes(searchTerm)
        );
        this.renderVisitorsTable(filtered);
    },

    // Получение данных из формы
    getFormData() {
        const visitor = {
            fullName: document.getElementById('fullName').value,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value,
            hospitalized: document.getElementById('hospitalized').checked
        };
        
        // Добавляем кастомные свойства
        this.customProperties.forEach(prop => {
            const element = document.getElementById(`prop_${prop.name}`);
            if (element) {
                if (prop.type === 'checkbox') {
                    visitor[prop.name] = element.checked;
                } else {
                    visitor[prop.name] = element.value;
                }
            }
        });
        
        return visitor;
    },

    // Заполнение формы данными
    fillForm(visitor) {
        document.getElementById('fullName').value = visitor.fullName || '';
        document.getElementById('address').value = visitor.address || '';
        document.getElementById('phone').value = visitor.phone || '';
        document.getElementById('hospitalized').checked = visitor.hospitalized || false;
        
        // Заполняем кастомные свойства
        this.customProperties.forEach(prop => {
            const element = document.getElementById(`prop_${prop.name}`);
            if (element && visitor[prop.name] !== undefined) {
                if (prop.type === 'checkbox') {
                    element.checked = visitor[prop.name];
                } else {
                    element.value = visitor[prop.name];
                }
            }
        });
    },

    // Очистка формы
    clearForm() {
        document.getElementById('visitorForm').reset();
        document.getElementById('visitorSelect').value = '';
        
        // Очищаем кастомные свойства
        this.customProperties.forEach(prop => {
            const element = document.getElementById(`prop_${prop.name}`);
            if (element) {
                if (prop.type === 'checkbox') {
                    element.checked = false;
                } else {
                    element.value = '';
                }
            }
        });
    },

    // Обновление выпадающего списка посетителей
    updateVisitorSelect() {
        const select = document.getElementById('visitorSelect');
        const currentValue = select.value;
        
        // Очищаем и добавляем только опцию по умолчанию
        select.innerHTML = '<option value="">-- Новый посетитель --</option>';
        
        // Добавляем всех посетителей
        this.visitors.forEach(visitor => {
            const option = document.createElement('option');
            option.value = visitor.id;
            option.textContent = visitor.fullName;
            select.appendChild(option);
        });
        
        // Восстанавливаем выбранное значение, если оно есть
        if (currentValue && this.visitors.some(v => v.id === currentValue)) {
            select.value = currentValue;
        }
    },

    // Отображение таблицы посетителей
    renderVisitorsTable(visitorsToShow = null) {
        const tbody = document.getElementById('visitorsTableBody');
        tbody.innerHTML = '';
        
        const visitors = visitorsToShow || this.visitors;
        
        if (visitors.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="4" style="text-align: center;">Нет данных для отображения</td>';
            tbody.appendChild(row);
            return;
        }
        
        // Создаем заголовки таблицы с учетом кастомных свойств
        const thead = document.querySelector('#visitorsTable thead');
        thead.innerHTML = `
            <tr>
                <th>ФИО</th>
                <th>Адрес</th>
                <th>Телефон</th>
                <th>Стационар</th>
                ${this.customProperties.map(prop => `<th>${prop.name}</th>`).join('')}
            </tr>
        `;
        
        // Добавляем строки с данными
        visitors.forEach(visitor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${visitor.fullName}</td>
                <td>${visitor.address}</td>
                <td>${visitor.phone}</td>
                <td>${visitor.hospitalized ? 'Да' : 'Нет'}</td>
                ${this.customProperties.map(prop => `
                    <td>${visitor[prop.name] !== undefined ? visitor[prop.name] : '-'}</td>
                `).join('')}
            `;
            tbody.appendChild(row);
        });
    },

    // Добавление кастомного свойства
    addCustomProperty() {
        const name = document.getElementById('newPropertyName').value.trim();
        const type = document.getElementById('newPropertyType').value;
        
        if (!name) {
            alert('Введите название свойства');
            return;
        }
        
        // Проверяем, нет ли уже свойства с таким именем
        if (this.customProperties.some(prop => prop.name === name)) {
            alert('Свойство с таким именем уже существует');
            return;
        }
        
        const property = { name, type };
        
        if (type === 'select') {
            const options = document.getElementById('selectOptions').value.split(',').map(o => o.trim());
            if (options.length === 0 || (options.length === 1 && options[0] === '')) {
                alert('Введите варианты для выпадающего списка через запятую');
                return;
            }
            property.options = options;
        }
        
        this.customProperties.push(property);
        this.saveVisitors();
        this.addPropertyToForm(property);
        this.renderVisitorsTable();
        
        // Очищаем форму добавления свойства
        document.getElementById('newPropertyName').value = '';
        document.getElementById('selectOptions').value = '';
        document.getElementById('selectOptionsContainer').classList.add('hidden');
        
        alert(`Свойство "${name}" успешно добавлено`);
    },

    // Добавление элемента формы для нового свойства
    addPropertyToForm(property) {
        const form = document.getElementById('visitorForm');
        const div = document.createElement('div');
        div.id = `prop_div_${property.name}`;
        
        let inputElement;
        
        if (property.type === 'checkbox') {
            div.className = 'checkbox-container';
            inputElement = document.createElement('input');
            inputElement.type = 'checkbox';
            inputElement.id = `prop_${property.name}`;
            
            const label = document.createElement('label');
            label.htmlFor = `prop_${property.name}`;
            label.textContent = property.name;
            
            div.appendChild(inputElement);
            div.appendChild(label);
        } 
        else if (property.type === 'select') {
            const label = document.createElement('label');
            label.htmlFor = `prop_${property.name}`;
            label.textContent = property.name;
            
            inputElement = document.createElement('select');
            inputElement.id = `prop_${property.name}`;
            
            // Добавляем пустую опцию
            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = '-- Выберите --';
            inputElement.appendChild(emptyOption);
            
            // Добавляем варианты из options
            property.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                inputElement.appendChild(opt);
            });
            
            div.appendChild(label);
            div.appendChild(inputElement);
        }
        else {
            const label = document.createElement('label');
            label.htmlFor = `prop_${property.name}`;
            label.textContent = property.name;
            
            inputElement = document.createElement('input');
            inputElement.type = property.type === 'number' ? 'number' : 'text';
            inputElement.id = `prop_${property.name}`;
            
            div.appendChild(label);
            div.appendChild(inputElement);
        }
        
        // Вставляем перед кнопками
        const buttons = form.querySelector('button');
        form.insertBefore(div, buttons);
    }
};

// Инициализация приложения после загрузки страницы
window.addEventListener('DOMContentLoaded', () => {
    PolyclinicApp.init();
});