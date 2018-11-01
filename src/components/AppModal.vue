<template>
    <transition name="modal">
        <div class="modal__mask"> 
            <div class="modal__container">
                <div class="modal__header"><h2>{{ isEditing ? 'Редактировать карточку' : 'Добавить студента' }}</h2></div>
                <div class="modal__body">
                    <form class="modal__form">
                        <div 
                            v-for="(field, fieldName, index) in getFormInfo" 
                            :key="index" 
                            class="modal__form-group" 
                            :class="field.isValid === '' ? '' : field.isValid ? 'modal__has-success' : 'modal__has-error'"
                        >
                            <label 
                                class="modal__label"
                                :class="field.isValid === '' ? '' : field.isValid ? 'text-success' : 'text-error'"
                            >{{field.name}}</label>
                            <div class="modal__input-container">
                                <input 
                                    type="text" 
                                    class="modal__input" 
                                    @input="onInputField(fieldName, $event)"
                                    @change="isFieldValid(fieldName)"
                                    :placeholder="field.placeholder"
                                    :value="field.value"
                                >
                                <span 
                                    class="modal__glyphicon-input" 
                                    :class="field.isValid === '' ? '' : field.isValid ? 'fas fa-check' : 'fas fa-times'"
                                ></span>
                            </div>
                            <div class="modal__error-message-container">
                                <p v-if="field.isValid !== '' && !field.isValid" class="modal__error-message">{{ field.errorMessage }}</p>
                            </div>
                        </div>
                        <div class="modal__button-container">
                            <button 
                                class="btn btn-success" 
                                :disabled="!isFormValid"
                                @click.prevent="sendInfo()"
                            >
                                Сохранить
                            </button>
                            <button 
                                class="btn btn-error" 
                                @click.prevent="onCancel()"
                            >
                                Отмена
                            </button>
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    computed: {
        ...mapGetters(["getFormInfo", "isFormValid", "isEditing"])
    },
    methods: {
        ...mapMutations(["inputField"]),
        ...mapActions(["isFieldValid", "addStudent", "onCancel"]),
        onInputField(fieldName, e) {
            this.inputField({
                fieldName,
                value: e.target.value
            });
        },
        sendInfo() {
            this.addStudent();
        }
    }
}
</script>