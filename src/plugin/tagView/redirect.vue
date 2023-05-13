<template>
    <div />
</template>
<script>
export default {
    created() {
        const { query } = this.$route.value;
        this.$router.replace({ path: query.path_bloodCat });
    }
};
</script>
