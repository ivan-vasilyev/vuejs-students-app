<template>
    <div class="table__container col-md-6 col-md-offset-3">
        <div class="table__logo">Task2. Students</div>
        <div class="table__header-wrapper">
            <button class="btn btn-success" @click="showModal">Добавить студента</button>
            <app-table-form
                @changeSearch="onChangeSearch($event)"
            ></app-table-form>
        </div>
        <div class="table__table-wrapper">
            <table class="table__table-striped" @keyup.delete="deleteStudents()">
                <thead>
                    <tr>
                        <th></th>
                        <th>
                            Имя
                        </th>
                        <th @click.prevent="sortBy('surname')">
                            Фамилия
                            <i class="fas" :class="sortOrders['surname'] > 0 ? 'fa-caret-down' : 'fa-caret-up'"></i>
                        </th>
                        <th>
                            <span @click.prevent="sortBy('age')">
                                Возраст
                                <i class="fas" :class="sortOrders['age'] > 0 ? 'fa-caret-down' : 'fa-caret-up'"></i>
                                </span>
                            <br>
                            <select v-model="selectedAge" class="table__select">
                                <option value=""></option>
                                <option v-for="age in ages" :key="age" :value="age">
                                    {{ age }}
                                </option>
                            </select>
                        </th>
                        <th>
                            <span>
                                Группа
                            </span>
                            <br>
                            <select v-model="selectedGroup" class="table__select">
                                <option value=""></option>
                                <option v-for="group in groups" :key="group" :value="group">
                                    {{ group }}
                                </option>
                            </select>
                        </th>
                        <th>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <app-table-row 
                        v-for="value in filteredStudents" 
                        :key="value.id"
                        :student="value"
                        @check="addStudentToCheckList($event)"
                        @edit="editStudent($event)"
                    ></app-table-row>
                    <tr v-if="filteredStudents.length == 0">
                        <td colspan="6">Ничего не найдено!</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="table__button-container">
            <button 
                class="btn btn-error"
                @click="deleteStudents()"
            >
                Удалить
            </button>
        </div>
    </div>
</template>

<script>
import AppTableRow from './AppTableRow.vue';
import AppTableForm from './AppTableForm.vue';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { getCurrentAge, getUniqueList } from '../lib';

export default {
    components: {
        AppTableRow,
        AppTableForm
    },
    data() {
        return {
            columnName: ['Имя','Фамилия','Возраст','Группа'],
            search: '',
            selectedAge: '',
            selectedGroup: '',
            agesList: [],
            groupsList: [],
            sortKey: '',
            sortOrders: {
                'surname': 1,
                'age': 1
            }
        };
    },
    created() {
        this.fillStudentsList();
    },
    computed: {
        ...mapGetters(['getStudents', 'getStudentsList', 'getCheckedStudents']),
        filteredStudents() {
            this.fillStudentsList();
            let studentList = this.getStudentsList;

            let search = this.search;
            let selectedAge = this.selectedAge;
            let selectedGroup = this.selectedGroup;

            let sortKey = this.sortKey;
            let order = this.sortOrders[sortKey] || 1;

            //Поиск по фамилии
            if (search != '') {
                studentList = studentList.filter(student => student.surname.toLowerCase().indexOf(search) > -1);
            }

            //Фильтрация по полю возраста
            if (selectedAge != '') {
                studentList = studentList.filter(student => student.age == selectedAge);
            }

            //Фильтрация по полю группы
            if (selectedGroup != '') {
                studentList = studentList.filter(student => student.group == selectedGroup);
            }

            //создание списков для фильтров
            this.agesList = getUniqueList(studentList, 'age');
            this.groupsList = getUniqueList(studentList, 'group');

            // Сортировка по полям
            if (sortKey) {
                studentList = studentList.slice().sort(function (a, b) {
                    if (sortKey == 'surname') {
                        a = a[sortKey].toLowerCase();
                        b = b[sortKey].toLowerCase();
                    } else {
                        a = a[sortKey];
                        b = b[sortKey];
                    }
                    return (a === b ? 0 : a > b ? 1 : -1) * order;
                })
            }
            
            return studentList;
        },
        ages() {
            return this.agesList;
        },
        groups() {
            return this.groupsList;
        },
    },
    methods: {
        ...mapMutations([
            'showModal',
            'addStudentToCheckList', 
            'fillStudentsList', 
            'calcAge', 
            'deleteStudents', 
            'editStudent'
        ]),
        ...mapActions(['editStudent']),
        onChangeSearch(value) {
            this.search = value;
        },
        sortBy(key) {
            this.sortKey = key;
            this.sortOrders[key] = this.sortOrders[key] * -1;
        }
    }
}
</script>
