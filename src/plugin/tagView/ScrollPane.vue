<template>
    <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container" @wheel.native.prevent="handleScroll">
        <slot />
    </el-scrollbar>
</template>

<script>
const tagSpacing = 4;

export default {
    data() {
        return {};
    },
    methods: {
        handleScroll(e) {
            const eventDelta = e.wheelDelta || -e.deltaY * 40;
            const scrollContainer = this.$refs.scrollContainer;
            const scrollWrapper = scrollContainer.$refs.wrap;
            scrollWrapper.scrollLeft = scrollWrapper.scrollLeft + eventDelta / 4;
        },

        moveToTarget(currentTag) {
            const scrollContainer = this.$refs.scrollContainer;
            const container = scrollContainer.$el;
            const containerWidth = container.offsetWidth;
            const scrollWrapper = scrollContainer.$refs.wrap;
            const tagList = this.$parent.$refs.tag;

            let firstTag = null;
            let lastTag = null;

            // find first tag and last tag
            if (tagList.length > 0) {
                firstTag = tagList[0];
                lastTag = tagList[tagList.length - 1];
            }

            if (firstTag === currentTag) {
                scrollWrapper.scrollLeft = 0;
            } else if (lastTag === currentTag) {
                scrollWrapper.scrollLeft = scrollWrapper.scrollWidth - containerWidth;
            } else {
                // find preTag and nextTag
                const currentIndex = tagList.findIndex((item) => item === currentTag);
                const prevTag = tagList[currentIndex - 1];
                const nextTag = tagList[currentIndex + 1];
                // the tag's offsetLeft after of nextTag
                const afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagSpacing;
                // the tag's offsetLeft before of prevTag
                const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagSpacing;

                if (afterNextTagOffsetLeft > scrollWrapper.scrollLeft + containerWidth) {
                    scrollWrapper.scrollLeft = afterNextTagOffsetLeft - containerWidth;
                } else if (beforePrevTagOffsetLeft < scrollWrapper.scrollLeft) {
                    scrollWrapper.scrollLeft = beforePrevTagOffsetLeft;
                }
            }
        }
    }
};
</script>
<style lang="less" scoped>
.scroll-container {
    white-space: nowrap;
    position: relative;
    //overflow: hidden;
    width: 100%;
    height: 100%;
}
</style>
<style lang="less">
.scroll-container {
    .el-scrollbar__wrap {
        //overflow: hidden !important;
        margin: 0 !important;
        height: 100%;
        overflow: visible;
    }
    .el-scrollbar__view{
        height: 100%;
    }
}
</style>
