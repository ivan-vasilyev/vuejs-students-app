export function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function getCurrentAge(date) {
    var d = date.split('.').reverse().join('.');
    return ((new Date().getTime() - new Date(d)) / (24 * 3600 * 365.25 * 1000)) | 0;
}

export function getUniqueList(list, prop) {
    return [...new Set(list.map(el => el[prop]))];
}

const message = {
    'name': 'В имени не должно быть цифр и символов $#@...',
    'surname':'В фамилии не должно быть цифр и символов $#@...',
    'birthdate': 'Некорректная дата. Введите дату в формате XX.XX.XXXX',
    'group': 'Некорректный номер группы. Введите номер в формате XXX-X-XX'
};

function valid(isValid, errorMessage='') {
    return {
        isValid,
        errorMessage
    }
}

export function errorHandler(name, value, pattern) {
    //проверка на пустоту
    if (!value) {
        return valid(false, 'Поле не должно быть пустым');
    }

    //проверка на соответствие паттерну
    if (!pattern.test(value)) {
        return valid(false, message[name]);
    } 
    
    return valid(true);
}