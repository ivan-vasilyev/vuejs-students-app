import Vue from 'vue';
import Vuex from 'vuex';
import { capitalize, getCurrentAge, errorHandler } from '../lib';

Vue.use(Vuex);

export const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        showModal: false,
        formInfo: {
            name: {
                name: "Имя",
                value: "",
                pattern: /^[a-zA-Zа-яА-ЯёЁ'][a-zA-Z-а-яА-ЯёЁ' ]+[a-zA-Zа-яА-ЯёЁ']?$/,
                isValid: '',
                placeholder: 'Введите имя',
                errorMessage: ''
            },
            surname: {
                name: "Фамилия",
                value: "",
                pattern: /^[a-zA-Zа-яА-ЯёЁ'][a-zA-Z-а-яА-ЯёЁ' ]+[a-zA-Zа-яА-ЯёЁ']?$/,
                isValid: '',
                placeholder: 'Введите фамилию',
                errorMessage: ''
            },
            birthdate: {
                name: "Дата рождения",
                value: "",
                pattern: /^(((0[1-9]|[12]\d|3[01])\.(0[13578]|1[02])\.((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\.(0[13456789]|1[012])\.((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\.02\.((19|[2-9]\d)\d{2}))|(29\.02\.((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/,
                isValid: '',
                placeholder: 'Введите дату рождения в формате XX.XX.XXXX',
                errorMessage: ''
            },
            group: {
                name: "Группа",
                value: "",
                pattern: /^[A-ZА-Я]{2,4}-[1-9]{1,2}-[0-9]{2}$/,
                isValid: '',
                placeholder: 'Введите номер группы. Пример: ИВТ-1-15',
                errorMessage: ''
            }
        },
        formValid: false,
        nextId: 6,
        editing: undefined,
        students: { // Моковые данные
            "0": { "id": "0", "name": "Андрей", "surname": "Андреев", "birthdate": "08.08.2001", "age": "", "group": "ИВТ-1-10" },
            "1": { "id": "1", "name": "Иван", "surname": "Иванов", "birthdate": "11.11.2002", "age": "", "group": "ИВТ-1-11" },
            "2": { "id": "2", "name": "Петр", "surname": "Петров", "birthdate": "11.11.2003", "age": "", "group": "ИВТ-1-12" },
            "3": { "id": "3", "name": "Семен", "surname": "Семенов", "birthdate": "11.11.2004", "age": "", "group": "ИВТ-1-13" },
            "4": { "id": "4", "name": "Самсон", "surname": "Самсонов", "birthdate": "11.11.2005", "age": "", "group": "ИВТ-1-14" },
            "5": { "id": "5", "name": "Александр", "surname": "Александров", "birthdate": "11.11.2006", "age": "", "group": "ИВТ-1-15" }
        },
        studentsList: [],
        checkedStudents: {}
    },
    getters: {
        showModal(state) {
            return state.showModal;
        },
        getFormInfo(state) {
            return state.formInfo;
        },
        isFormValid(state) {
            return state.formValid;
        },
        getStudents(state) {
            return state.students;
        },
        getStudentsList(state) {
            return state.studentsList;
        },
        isEditing(state) {
            return state.editing;
        }
    },
    mutations: {
        showModal(state) {
            state.showModal = ! state.showModal;
        },
        inputField(state, { fieldName, value }) {
            state.formInfo[fieldName].value = value;
        },
        isFieldValid(state, fieldName) {
            let field = state.formInfo[fieldName];
            let { isValid, errorMessage } = errorHandler(fieldName, field.value, field.pattern);
            field.isValid = isValid;
            field.errorMessage = errorMessage;
        },
        checkFormValid(state) {
            let invalidArray = Object.values(state.formInfo).filter(el => !el.isValid);
            state.formValid = invalidArray.length == 0 ? true : false;
        },
        fillStudentsList(state) {
            let students = state.students;
            for (let key in students) {
                students[key].age = getCurrentAge(students[key].birthdate); 
            }
            Vue.set(state, 'studentsList', Object.values(students));
        },
        addStudent(state) {
            let id = state.editing !== undefined ? state.editing : state.nextId++;
            let student = {id};
            Object.entries(state.formInfo).forEach(el => {
                if (el[0] === 'name' || el[0] === 'surname') {
                    student[el[0]] = capitalize(el[1].value);
                } else if (el[0] === 'birthdate') {
                    student[el[0]] = el[1].value;
                    student['age'] = '';
                } else {
                    student[el[0]] = el[1].value;
                }
            });
            Vue.set(state.students, id, student);
        },
        clearForm(state) {
            state.editing = undefined;
            Object.keys(state.formInfo).forEach(el => {
                state.formInfo[el].value = '';
                state.formInfo[el].isValid = '';
            });
            state.formValid = false;
        },
        onCancel(state) {
            state.editing = undefined;
        },
        addStudentToCheckList(state, { id, value }) {
            Vue.set(state.checkedStudents, id, value);
        },
        deleteStudents(state) {
            Object.entries(state.checkedStudents).forEach(el => {
                if (el[1]) {
                    delete state.checkedStudents[el[0]];
                    Vue.delete(state.students, el[0]);
                }
            });
        },
        editStudent(state, id) {
            let student = state.students[id];
            Object.keys(state.formInfo).forEach(el => {
                state.formInfo[el].value = student[el];
                state.formInfo[el].isValid = true;
            });
            state.formValid = true;
            state.editing = id;
        },
    },
    actions: {
        isFieldValid(store, fieldName) {
            store.commit('isFieldValid', fieldName);
            store.commit('checkFormValid');
        },
        addStudent(store) {
            store.commit('addStudent');
            store.commit('clearForm');
            store.commit('showModal');
        },
        editStudent(store, id) {
            store.commit('editStudent', id);
            store.commit('showModal');
        },
        onCancel(store) {
            store.commit('onCancel');
            store.commit('clearForm');
            store.commit('showModal');
        }
    }
});
