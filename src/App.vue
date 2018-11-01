<template>
    <div class="main-container">
        <app-modal v-if="showModal"></app-modal>
        <app-table></app-table>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AppModal from './components/AppModal.vue';
import AppTable from './components/AppTable.vue';

export default {
    components: {
        AppModal, 
        AppTable
    },
    computed: {
        ...mapGetters(['showModal'])
    }
}
</script>

<style src='./static/less/main.less' lang='less'></style>
