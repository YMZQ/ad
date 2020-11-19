<template>
  <div id="tags-view-container" class="tags-view-container">
    <!--    <scroll-pane ref="scrollPane" class="tags-view-wrapper">-->
    <router-link
      v-for="tag in tagsList"
      ref="tag"
      :key="tag.path"
      :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
      tag="span"
    >
<!--      :class="isActive(tag)?'active':''"-->
<!--      @click.middle.native="closeSelectedTag(tag)"-->
      <!--        @contextmenu.prevent.native="openMenu(tag,$event)"-->
      <span class="tags-view-item">{{tag.title}}</span>

      <!--        <span v-if="!tag.meta.affix" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />-->
      <!--        <span v-else class="el-icon-none" />-->
    </router-link>
    <!--    </scroll-pane>-->
    <!--    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">-->
    <!--      <li @click="refreshSelectedTag(selectedTag)">-->
    <!--        刷新当前-->
    <!--      </li>-->
    <!--      <li v-if="!(selectedTag.meta&&selectedTag.meta.affix)" @click="closeSelectedTag(selectedTag)">-->
    <!--        关闭当前-->
    <!--      </li>-->
    <!--      <li @click="closeOthersTags">-->
    <!--        关闭其他-->
    <!--      </li>-->
    <!--      <li @click="closeAllTags(selectedTag)">-->
    <!--        关闭所有-->
    <!--      </li>-->
    <!--    </ul>-->
  </div>
</template>

<script>
    // import ScrollPane from './ScrollPane'
    // import { generateTitle } from '@/utils/i18n'
    // import path from 'path'
    import bus from '../bus';


    export default {
        // components: { ScrollPane },
        data() {
            return {
                visible: false,
                top: 0,
                left: 0,
                selectedTag: {},
                affixTags: [],


                tagsList:[]
            };
        },
        computed: {

            // visitedViews() {
            //   console.log(this.$store.state.tagsView.visitedViews)
            //   return this.$store.state.tagsView.visitedViews
            // },
            // routes() {
            //   return this.$store.state.account.routes
            // }
        },
        watch: {
            $route(newValue, oldValue){
                this.setTags(newValue);
            }
            // $route() {
            //   this.addTags()
            //   this.moveToCurrentTag()
            // },
            // visible(value) {
            //   if (value) {
            //     document.body.addEventListener('click', this.closeMenu)
            //   } else {
            //     document.body.removeEventListener('click', this.closeMenu)
            //   }
            // }
        },
        created() {
            this.setTags(this.$route);
            // 监听关闭当前页面的标签页
            bus.$on('close_current_tags', () => {
                for (let i = 0, len = this.tagsList.length; i < len; i++) {
                    const item = this.tagsList[i];
                    if (item.path === this.$route.fullPath) {
                        if (i < len - 1) {
                            this.$router.push(this.tagsList[i + 1].path);
                        } else if (i > 0) {
                            this.$router.push(this.tagsList[i - 1].path);
                        } else {
                            this.$router.push('/');
                        }
                        this.tagsList.splice(i, 1);
                        break;
                    }
                }
            });
        },
        mounted() {
            // this.initTags()
            // this.addTags()
        },
        methods: {
            // 设置标签
            setTags(route){
                const isExist = this.tagsList.some(item => {
                    return item.path === route.fullPath;
                })
                if(!isExist){
                    if(this.tagsList.length >= 8){
                        this.tagsList.shift();
                    }
                    this.tagsList.push({
                        title: route.meta.title,
                        path: route.fullPath,
                        name: route.matched[1].components.default.name
                    })
                }
                bus.$emit('tags', this.tagsList);
            },
            // generateTitle, // generateTitle by vue-i18n
            // isActive(route) {
            //   return route.path === this.$route.path
            // },
            // filterAffixTags(routes, basePath = '/') {
            //   let tags = []
            //   routes.forEach(route => {
            //     if (route.meta && route.meta.affix) {
            //       const tagPath = path.resolve(basePath, route.path)
            //       tags.push({
            //         fullPath: tagPath,
            //         path: tagPath,
            //         name: route.name,
            //         meta: { ...route.meta }
            //       })
            //     }
            //     if (route.children) {
            //       const tempTags = this.filterAffixTags(route.children, route.path)
            //       if (tempTags.length >= 1) {
            //         tags = [...tags, ...tempTags]
            //       }
            //     }
            //   })
            //   return tags
            // },
            // initTags() {
            //   const affixTags = this.affixTags = this.filterAffixTags(this.routes)
            //   for (const tag of affixTags) {
            //     // Must have tag name
            //     if (tag.name) {
            //       this.$store.dispatch('tagsView/addVisitedView', tag)
            //     }
            //   }
            // },
            // addTags() {
            //   const { name } = this.$route
            //   if (name) {
            //     this.$store.dispatch('tagsView/addView', this.$route)
            //   }
            //   return false
            // },
            // moveToCurrentTag() {
            //   const tags = this.$refs.tag
            //   this.$nextTick(() => {
            //     for (const tag of tags) {
            //       if (tag.to.path === this.$route.path) {
            //         this.$refs.scrollPane.moveToTarget(tag)
            //         // when query is different then update
            //         if (tag.to.fullPath !== this.$route.fullPath) {
            //           this.$store.dispatch('tagsView/updateVisitedView', this.$route)
            //         }
            //         break
            //       }
            //     }
            //   })
            // },
            // refreshSelectedTag(view) {
            //   this.$store.dispatch('tagsView/delCachedView', view).then(() => {
            //     const { fullPath } = view
            //     this.$nextTick(() => {
            //       this.$router.replace({
            //         path: '/redirect' + fullPath
            //       })
            //     })
            //   })
            // },
            // closeSelectedTag(view) {
            //   this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
            //     if (this.isActive(view)) {
            //       this.toLastView(visitedViews, view)
            //     }
            //   })
            // },
            // closeOthersTags() {
            //   this.$router.push(this.selectedTag)
            //   this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
            //     this.moveToCurrentTag()
            //   })
            // },
            // closeAllTags(view) {
            //   this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
            //     if (this.affixTags.some(tag => tag.path === view.path)) {
            //       return
            //     }
            //     this.toLastView(visitedViews, view)
            //   })
            // },
            // toLastView(visitedViews, view) {
            //   const latestView = visitedViews.slice(-1)[0]
            //   if (latestView) {
            //     this.$router.push(latestView)
            //   } else {
            //     // now the default is to redirect to the home page if there is no tags-view,
            //     // you can adjust it according to your needs.
            //     if (view.name === 'Dashboard') {
            //       // to reload home page
            //       this.$router.replace({ path: '/redirect' + view.fullPath })
            //     } else {
            //       this.$router.push('/')
            //     }
            //   }
            // },
            // openMenu(tag, e) {
            //   const menuMinWidth = 105
            //   const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
            //   const offsetWidth = this.$el.offsetWidth // container width
            //   const maxLeft = offsetWidth - menuMinWidth // left boundary
            //   const left = e.clientX - offsetLeft + 15 // 15: margin right
            //
            //   if (left > maxLeft) {
            //     this.left = maxLeft
            //   } else {
            //     this.left = left
            //   }
            //
            //   this.top = e.clientY
            //   this.visible = true
            //   this.selectedTag = tag
            // },
            // closeMenu() {
            //   this.visible = false
            // }
        }
    };
</script>

<style lang="scss" scoped>
  .tags-view-container {
    height: 35px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #f1f1f1;

    .tags-view-wrapper {
      .tags-view-item {
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 34px;
        line-height: 34px;
        border-left: 1px solid #f1f1f1;
        color: #999;
        background: #fff;
        padding: 0 5px 0 20px;
        font-size: 13px;
        transition: all .3s;

        .el-icon-none {
          width: 16px
        }

        &:hover {
          color: #495060;

          & .el-icon-close {
            font-size: 1rem;
            font-weight: bold;
            color: red;
          }
        }

        &:first-of-type {
        }

        &:last-of-type {
          border-right: 1px solid #f1f1f1;
        }

        &.active {
          /*background-color: #42b983;*/
          /*color: #fff;*/
          /*border-color: #42b983;*/
          &::before {
            content: '';
            background: #85ef47 !important;
            box-shadow: 0 0 7px #b7eb8f;
            display: inline-block;
            bottom: 3px;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            position: relative;
            margin-right: 4px;
          }
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
      font-size: 13px;
      font-weight: 400;
      color: #333;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

      li {
        margin: 0;
        padding: 7px 20px;
        cursor: pointer;

        &:hover {
          background-color: #e8f4ff;
          color: #46a6ff;
        }
      }
    }
  }
</style>

<style lang="scss">
  //reset element css of el-icon-close
  .tags-view-wrapper {
    .tags-view-item {
      .el-icon-close {
        color: #fff;
        width: 16px;
        height: 16px;
        vertical-align: 2px;
        font-size: 12px;
        font-weight: 600;
        border-radius: 50%;
        text-align: center;
        transform-origin: 100% 50%;

        &:before {
          transform: scale(.6);
          display: inline-block;
          vertical-align: -3px;
        }

        &:hover {
          /*background-color: #b4bccc;*/
          /*color: #fff;*/
        }
      }
    }
  }
  .tags-view-container .tags-view-wrapper .tags-view-item {
    display: inline-block;
    position: relative;
    cursor: pointer;
    height: 34px;
    line-height: 34px;
    border-left: 1px solid #f1f1f1;
    color: #999;
    background: #fff;
    padding: 0 5px 0 20px;
    font-size: 13px;
    -webkit-transition: all .3s;
    transition: all .3s;
  }
</style>
