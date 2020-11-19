EX
<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar></v-sidebar>
    <div class="content-box" :class="{'content-collapse':collapse}">
      <v-tags></v-tags>
      <div class="content">
<!--        <i class="el-icon-refresh" @click="reload"></i>-->
        <transition name="move" mode="out-in" >
          <keep-alive :include="tagsList">
<!--            <router-view v-if="isRouterAlive"></router-view>-->
            <router-view></router-view>
          </keep-alive>
        </transition>
        <el-backtop target=".content"></el-backtop>
      </div>
      <!--            <div class="login-footer">© 2020 <a target="_blank" href="#">19EX</a></div>-->
    </div>
  </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    // import vTags from './TagsView';
    import vTags from './Tags.vue';
    import bus from './bus';

    export default {
        data() {
            return {
                tagsList: [],
                collapse: false,
                isRouterAlive: true
            };
        },
        provide(){ //提供
            return {
                reload: this.reload
            }
        },
        components: {
            vHead,
            vSidebar,
            vTags
        },
        created() {
            bus.$on('collapse-content', msg => {
                this.collapse = msg;
            });

            // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
            bus.$on('tags', msg => {
                let arr = [];
                for (let i = 0, len = msg.length; i < len; i++) {
                    msg[i].name && arr.push(msg[i].name);
                }
                this.tagsList = arr;
            });
        },
        methods: {
            reload(){
                this.isRouterAlive = false
                this.$nextTick( function () {
                    this.isRouterAlive = true
                })
            }
        }
    };
</script>
<style scoped>
  .app-container {
    margin: 0;
    padding-top: 30px;
  }

  .content-box .login-footer {
    position: fixed;
    bottom: 0;
    right: 0;
    text-align: center;
    height: 2.4rem;
    -webkit-box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .1);
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .1);
    font-size: 13px;
    background: #fff;
    width: calc(100% - 200px);
    display: block;
    z-index: 999;
    color: #606266;
    line-height: 2.4rem;;
  }

</style>
