<template>
  <div class="tags" v-if="showTags">
    <ul>
      <li class="tags-li" v-for="(item,index) in tagsList" :class="{'actives': isActive(item.path)}" :key="index"
          @command="handleTags">
        <span :class="{'icon-active': isActive(item.path)}"></span>
        <el-dropdown @command="handleTags">
          <router-link :to="item.path" class="tags-li-title">
            {{item.title}}
          </router-link>
          <el-dropdown-menu size="small" slot="dropdown">
            <el-dropdown-item command="other">关闭其他</el-dropdown-item>
            <el-dropdown-item command="all">关闭所有</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span v-if="item.title!=='系统首页'" class="tags-li-icon-close" @click="closeTags(index)"><i
          class="el-icon-close"></i></span>
      </li>
    </ul>

    <!--        <el-dropdown @command="handleTags" v-for="(item,index) in tagsList">-->
    <!--            <el-button size="mini" type="primary">-->
    <!--                {{item.title}}<span v-if="item.title!=='系统首页'" class="tags-li-icon" @click="closeTags(index)"><i class="el-icon-close"></i></span></i>-->
    <!--            </el-button>-->
    <!--            <el-dropdown-menu size="small" slot="dropdown">-->
    <!--                <el-dropdown-item command="other">关闭其他</el-dropdown-item>-->
    <!--                <el-dropdown-item command="all">关闭所有</el-dropdown-item>-->
    <!--            </el-dropdown-menu>-->
    <!--        </el-dropdown>-->


  </div>
</template>

<script>
    import bus from './bus';

    export default {
        data() {
            return {
                tagsList: []
            };
        },
        methods: {
            isActive(path) {
                return path === this.$route.fullPath;
            },
            // 关闭单个标签
            closeTags(index) {
                const delItem = this.tagsList.splice(index, 1)[0];
                const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];
                if (item) {
                    delItem.path === this.$route.fullPath && this.$router.push(item.path);
                } else {
                    this.$router.push('/');
                }
            },
            // 关闭全部标签
            closeAll() {
                console.log(this.tagsList);
                this.tagsList = [];
                this.$router.push('/');
            },
            // 关闭其他标签
            closeOther() {
                const curItem = this.tagsList.filter(item => {
                    return item.path === this.$route.fullPath;
                });
                console.log(curItem);
                this.tagsList = curItem;
            },
            // 设置标签
            setTags(route) {
                const isExist = this.tagsList.some(item => {
                    return item.path === route.fullPath;
                });
                if (!isExist) {
                    if (this.tagsList.length >= 8) {
                        this.tagsList.shift();
                    }
                    this.tagsList.push({
                        title: route.meta.title,
                        path: route.fullPath,
                        name: route.matched[1].components.default.name
                    });
                }
                bus.$emit('tags', this.tagsList);
            },
            handleTags(command) {
                command === 'other' ? this.closeOther() : this.closeAll();
            }
        },
        computed: {
            showTags() {
                return this.tagsList.length > 0;
            }
        },
        watch: {
            $route(newValue, oldValue) {
                this.setTags(newValue);
            }
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
        }
    };

</script>


<style>
  .tags {
    /*position: relative;*/
    /*height: 30px;*/
    overflow: hidden;
    /*background: #fff;*/
    /*padding-right: 120px;*/
    /*box-shadow: 0 5px 10px #ddd;*/
    height: 35px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #f1f1f1;

  }


  .tags ul {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }

  .tags-li {
    float: left;
    position: relative;
    font-size: 12px;
    overflow: hidden;
    cursor: pointer;
    height: 100%;
    line-height: 34px;
    padding: 0 30px 0 20px;
    border-right: 1px solid #f1f1f1;
    vertical-align: middle;
    color: #666;
    -webkit-transition: all .3s ease-in;
    -moz-transition: all .3s ease-in;
    transition: all .3s ease-in;
    box-sizing: border-box;
  }

  .tags-li:not(.active):hover {
    background: #f8f8f8;
  }


  .tags-li-title {
    float: left;
    height: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #666;
  }

  .icon-active {
    content: "";
    background: #85ef47 !important;
    -webkit-box-shadow: 0 0 7px #b7eb8f;
    box-shadow: 0 0 7px #b7eb8f;
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    position: absolute;
    left: 10px;
    top: 50%;
    margin-top: -2.5px;
  }

  .tags-li-icon-close {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }


</style>
