<template>
    <form>
        <div class="modal__input-container">
            <input 
                type="text" 
                class="modal__input" 
                placeholder="Введите фамилию" 
                @input="inputSearch($event)"
            >
        </div>
    </form>
</template>

<script>
export default {
    methods: {
        inputSearch(e) {
            this.$emit('changeSearch', e.target.value);
        }
    }
}
</script>
