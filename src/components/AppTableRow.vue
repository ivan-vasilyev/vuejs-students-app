<template>
    <tr 
        :class="fieldChecked ? 'table__row_checked' : ''" 
        @click="onCheck()"
    >
        <td>
            <input type="checkbox" :checked="fieldChecked">
        </td>
        <td 
            v-for="(value, index) in student"
            v-if="!(index == 'id' || index == 'birthdate')" 
            :key="index"
        >
            {{ value }}
        </td>
        <td>
            <a class="fas fa-edit" @click.stop="onEdit()"></a>
        </td>
    </tr>
</template>

<script>
export default {
    data() {
        return {
            fieldChecked: false
        }
    },
    methods: {
        onCheck() {
            this.fieldChecked = !this.fieldChecked;
            this.$emit('check', {
                id: this.student.id,
                value: this.fieldChecked
            });
            this.$el.firstChild.firstChild.focus();
        }, 
        onEdit() {
            this.$emit('edit', this.student.id);
        }
    },
    props: {
        student: Object
    }
}
</script>
