<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#272c33"
      text-color="#fff"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="route in routes" v-if="route.alwaysShow">
        <template v-if="route.children">
          <el-submenu :index="route.path" :key="route.path">
            <template v-if="route.meta" slot="title">
              <i :class="route.meta.icon"></i>
              <span slot="title">{{ route.meta.title }}</span>
            </template>
            <template v-for="subItem in route.children">
              <el-menu-item
                :index="subItem.path"
                :key="subItem.path"
              >{{ subItem.meta.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item v-if="route.meta">
            <i :class="route.meta.icon"></i>
            <span slot="title">{{ route.meta.title }}</span>
          </el-menu-item>
        </template>
      </template>
<!--      <template v-for="route in items">-->
<!--        <template v-if="route.children">-->
<!--          <el-submenu :index="route.path" :key="route.path">-->
<!--            <template v-if="route.meta" slot="title">-->
<!--              <i :class="route.meta.icon"></i>-->
<!--              <span slot="title">{{ route.meta.title }}</span>-->
<!--            </template>-->
<!--            <template v-for="subItem in route.children">-->
<!--              <el-menu-item-->
<!--                :index="subItem.path"-->
<!--                :key="subItem.path"-->
<!--              >{{ subItem.meta.title }}-->
<!--              </el-menu-item>-->
<!--            </template>-->
<!--          </el-submenu>-->
<!--        </template>-->
<!--        <template v-else>-->
<!--          <el-menu-item v-if="route.meta">-->
<!--            <i :class="route.meta.icon"></i>-->
<!--            <span slot="title">{{ route.meta.title }}</span>-->
<!--          </el-menu-item>-->
<!--        </template>-->
<!--      </template>-->
    </el-menu>
  </div>
</template>

<script>
    import bus from '../common/bus';
    import { mapState } from 'vuex';

    export default {
        data() {
            return {
                collapse: false,
                items: this.Methods.route
            };
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            },
            ...mapState([
                'routes'
            ])

        },
        created() {
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
                bus.$emit('collapse-content', msg);
            });
        },
        methods: {
            hasOneShowingChild(children = [], parent) {
                const showingChildren = children.filter(item => {
                    if (item.hidden) {
                        return false;
                    } else {
                        // Temp set(will be used if only has one showing child)
                        this.onlyOneChild = item;
                        return true;
                    }
                });

                // When there is only one child router, the child router is displayed by default
                if (showingChildren.length === 1) {
                    return true;
                }

                // Show parent if there are no child router to display
                if (showingChildren.length === 0) {
                    this.onlyOneChild = { ...parent, path: '', noShowingChildren: true };
                    return true;
                }

                return false;
            },
            resolvePath(routePath) {
                if (isExternal(routePath)) {
                    return routePath;
                }
                if (isExternal(this.basePath)) {
                    return this.basePath;
                }
                return path.resolve(this.basePath, routePath);
            }
        }
    };
</script>

<style scoped>
  .sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
  }

  .sidebar::-webkit-scrollbar {
    width: 0;
  }

  .sidebar-el-menu:not(.el-menu--collapse) {
    width: 200px;
  }

  .el-menu {
    border-right: none;
  }

  .sidebar > ul {
    height: 100%;
  }
</style>
