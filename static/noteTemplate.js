const templateContainer = document.querySelector('.noteTemplate-container');
const getTemplatesRequest = new XMLHttpRequest();
const noteField = document.getElementById('note');
const LINE_SEPARATOR = '\n';
getTemplatesRequest.open('GET', `/NoteTemplates`);
getTemplatesRequest.onload = function () {
    if (getTemplatesRequest.status === 200) {
        const response = JSON.parse(getTemplatesRequest.responseText);
        const templates = response.NoteTemplates;

        templates.forEach((template) => {
            const templateElement = document.createElement('div');
            templateElement.classList.add('template');

            templateElement.addEventListener('click', function () {
                // Разделяем строки и вставляем каждую строку в поле заметки
                const lines = template.template_text.split(LINE_SEPARATOR);
                noteField.innerHTML = lines.join('<br>');
                const modalElement = document.getElementById('modal_note');
                const modalInstance = bootstrap.Modal.getInstance(modalElement); 
                modalInstance.hide(); // закрываем модальное окно
            });

            const titleContainer = document.createElement('div');
            titleContainer.style.overflow = 'hidden';
            titleContainer.style.textOverflow = 'ellipsis';
            titleContainer.style.whiteSpace = 'nowrap';
            titleContainer.style.width = '100%';

            const templateName = document.createTextNode(template.template_name);
            titleContainer.appendChild(templateName);
            templateElement.appendChild(titleContainer);
            templateContainer.appendChild(templateElement);
        });
    }
};
getTemplatesRequest.send();
