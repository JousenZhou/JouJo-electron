<template>
    <div class="tags-view-container">
        <div class="tags-view-wrapper">
            <router-link
                    v-for="(tag, index) in visitedViews"
                    ref="tag"
                    :key="tag.path"
                    :class="isActive(tag) ? 'active primaryColor' : ''"
                    :to="{
                    path: tag.path,
                    query: tag.query,
                    fullPath: tag.fullPath
                }"
                    tag="span"
                    class="tags-view-item"
                    @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
                    @contextmenu.prevent.native="openMenu(tag, $event, index)"
            >
                <span class="content">{{ tag.meta.title }}</span>
                <span v-if="index !== 0 && !isAffix(tag)" class="el-icon-close"
                      @click.prevent.stop="closeSelectedTag(tag)">
                    <el-icon><Close/></el-icon>
                </span>
            </router-link>
        </div>
        <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px', 'z-index': 4000 }" class="contextmenu">
            <li @click="refreshSelectedTag(selectedTag)">
                <!-- {{ $t("tagsView.refresh") }} -->
                刷新
            </li>
            <li v-if="index !== 0 && !isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
                <!-- {{ $t("tagsView.close") }} -->
                关闭
            </li>
            <li @click="closeOthersTags">
                <!-- {{ $t("tagsView.closeOthers") }} -->
                关闭其他
            </li>
            <li @click="closeAllTags(selectedTag)">
                <!-- {{ $t("tagsView.closeAll") }} -->
                关闭所有
            </li>
        </ul>
    </div>
</template>

<script>
const resolve = function (...paths) {
    let resolvePath = '';
    let isAbsolutePath = false;
    for (let i = paths.length - 1; i > -1; i--) {
        let path = paths[i];
        if (isAbsolutePath) {
            break;
        }
        if (!path) {
            continue
        }
        resolvePath = path + '/' + resolvePath;
        isAbsolutePath = path.charCodeAt(0) === 47;
    }
    if (/^\/+$/.test(resolvePath)) {
        resolvePath = resolvePath.replace(/(\/+)/, '/')
    } else {
        resolvePath = resolvePath.replace(/(?!^)\w+\/+\.{2}\//g, '')
            .replace(/(?!^)\.\//g, '')
            .replace(/\/+$/, '')
    }
    return resolvePath;
}
import ScrollPane from './ScrollPane.vue';
import {Close} from '@element-plus/icons-vue'

export default {
    components: {ScrollPane, Close},
    props: {
        routes: {require: true}
    },
    data() {
        return {
            visible: false,
            top: 0,
            left: 0,
            selectedTag: {},
            affixTags: [],
            index: -1
        };
    },
    computed: {
        visitedViews() {
            return this.$store.state.tagsView.visitedViews;
        },
        routerLink() {
            return this.$route.path;
        }
    },
    watch: {
        routerLink() {
            this.addTags();
            this.moveToCurrentTag();
        },
        visible(value) {
            if (value) {
                document.body.addEventListener('click', this.closeMenu);
            } else {
                document.body.removeEventListener('click', this.closeMenu);
            }
        }
    },
    mounted() {
        this.initTags();
        this.addTags();
    },
    methods: {
        isActive(route) {
            return route.path === this.$route.path;
        },
        // 判断该路由是否可以被关闭
        isAffix(tag) {
            return tag.meta && tag.meta.affix;
        },
        // 递归层级路由 获取到需要被默认展示一维路由数组 如 dashboard
        filterAffixTags(routes, basePath = '/') {
            let tags = [];
            routes.forEach((route) => {
                if (route.meta && route.meta.affix) {
                    // 解析路径
                    const tagPath = resolve(basePath, route.path);
                    tags.push({
                        fullPath: tagPath,
                        path: tagPath,
                        name: route.name,
                        meta: {...route.meta}
                    });
                }
                if (route.children) {
                    const childTags = this.filterAffixTags(route.children, route.path);
                    if (childTags.length >= 1) {
                        tags = [...tags, ...childTags];
                    }
                }
            });

            return tags;
        },
        // 初始化展示默认标签页
        initTags() {
            this.affixTags = this.filterAffixTags(this.routes);
            // console.log('this.affixTags',this.affixTags);
            for (const tag of this.affixTags) {
                // Must have tag name
                if (tag.name) {
                    this.$store.dispatch('tagsView/addVisitedView', tag);
                }
            }
        },

        // 添加标签页
        addTags() {
            const {name} = this.$route;
            if (name) {
                this.$store.dispatch('tagsView/addView', this.$route);
            }
            return false;
        },

        moveToCurrentTag() {
            const tags = this.$refs.tag;
            this.$nextTick(async () => {
                if (tags.to === this.$route.path) {
                    this.$refs.scrollPane.moveToTarget(tags);
                    if (tags.to.fullPath !== this.$route.fullPath) {
                        await this.$store.dispatch('tagsView/updateVisitedView', this.$route);
                    }
                }
            });
        },

        refreshSelectedTag(view) {
            this.$store.dispatch('tagsView/delCachedView', view).then(() => {
                const {fullPath} = view;
                this.$nextTick(() => {
                    this.$router.replace({
                        path: `/redirect`,
                        query: {
                            path_bloodCat: fullPath
                        }
                    });
                });
            });
        },
        // 关闭当前路由页
        closeSelectedTag(view) {
            this.$store.dispatch('tagsView/delView', view).then(({visitedViews}) => {
                if (this.isActive(view)) {
                    this.toLastView(visitedViews, view);
                }
            });
        },
        // 关闭除了当前路由页的其他路由页
        closeOthersTags() {
            this.$router.push(this.selectedTag);
            this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
                this.moveToCurrentTag();
            });
        },

        closeAllTags(view) {
            this.$store.dispatch('tagsView/delAllViews').then(({visitedViews}) => {
                if (this.affixTags.some((tag) => tag.path === view.path)) {
                    return;
                }
                this.toLastView(visitedViews, view);
            });
        },

        toLastView(visitedViews, view) {
            const latestView = visitedViews.slice(-1)[0];
            if (latestView) {
                this.$router.push(latestView);
            } else {
                // Default redirect to the home page if there is no tags-view, adjust it if you want
                if (view.name === 'Dashboard') {
                    // to reload home page
                    this.$router.replace({path: '/redirect' + view.fullPath});
                } else {
                    this.$router.push('/');
                }
            }
        },

        openMenu(tag, e, index) {
            this.left = e.clientX;
            this.index = index;
            this.top = e.clientY;
            this.visible = true;
            this.selectedTag = tag;
        },
        closeMenu() {
            this.visible = false;
        }
    }
};
</script>

<style lang="less" scoped>
.tags-view-container {
  height: 36px;
  width: 100%;
  //background: #F3F3F3;
  background: white;
  text-align: left;

  .tags-view-wrapper {
    height: calc(100% - 6px);
    border-bottom: 1px #e8e2e2 solid;
    padding-top: 6px;
    padding-left: 8px;
    overflow: visible;
    display: flex;

    .tags-view-item {
      flex: 1;
      text-decoration: unset;
      display: flex;
      align-items: center;

      position: relative;
      max-width: 200px;
      cursor: pointer;
      height: 100%;
      color: #353d51;
      font-size: 12px;

      .content {
        flex: 1;
        overflow: hidden;
        display: block;
        width: 100%;
        padding: 0 12px;
        border-right: 1px #d0cdcd solid;
      }

      &.active {
        color: rgba(72, 0, 255, 0.79);
        border: 1px #e8e2e2 solid;
        border-radius: 10px 10px 0 0;
        background: #f0f7ff;
        margin-left: -1px;

        .content {
          border-color: rgba(0, 0, 0, 0);
        }

        &:before {
          content: '';
          width: 100%;
          height: 1px;
          background: #f0f7ff;
          position: absolute;
          bottom: -1px;
          left: 0;
        }
      }
    }

    .el-icon-close {
      margin-right: 10px;
      width: 30px;
      height: 70%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;

      &:hover {
        background-color: #f1f1f1;
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
