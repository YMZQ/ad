<template>
  <el-dialog
    title="查看"
    :width="width"
    :visible.sync="isVisible"
    class="user-view"
  >
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24">
        <div class="img-wrapper">
          <!--          <img :src="avatar">-->
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>类别名称：</span> {{ viewDetails.categoryName }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>标题：</span> {{ viewDetails.title}}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24">
        <div class="view-item">
          <span class="text-center">内容：</span>
          <div class="content" v-html="viewDetails.content "></div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>排序：</span> {{ viewDetails.orderBy }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>是否推荐：</span> {{ viewDetails.isRecommend | statusFilter}}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>语言：</span> {{ viewDetails.language | langFilter}}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-time"/> <span>创建时间：</span>
          {{ viewDetails.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-brush"/> <span>修改时间：</span>
          {{ viewDetails.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
    export default {
        name: 'viewDetails',
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                screenWidth: 0,
                width: this.initWidth(),
                viewDetails: {}
            };
        },
        computed: {
            isVisible: {
                get() {
                    return this.dialogVisible;
                },
                set() {
                    this.close();
                }
            }
        },
        mounted() {
            window.onresize = () => {
                return (() => {
                    this.width = this.initWidth();
                })();
            };
        },
        methods: {
            initWidth() {
                this.screenWidth = document.body.clientWidth;
                if (this.screenWidth < 550) {
                    return '95%';
                } else if (this.screenWidth < 990) {
                    return '580px';
                } else if (this.screenWidth < 1400) {
                    return '600px';
                } else {
                    return '650px';
                }
            },
            setDetails(val) {
                this.viewDetails = { ...val };
                console.log(this.viewDetails);
            },
            close() {
                this.$emit('close');
            }
        }
    };
</script>
<style lang="scss" scoped>
  .user-view {
    .img-wrapper {
      text-align: center;
      margin-top: -1.5rem;
      margin-bottom: 10px;

      img {
        width: 4rem;
        border-radius: 50%;
      }
    }

    .view-item {
      margin: 7px;

      i {
        font-size: .97rem;
      }

      span {
        margin-left: 5px;
      }
    }
  }

  .content {
    height: 200px;
    overflow-y: auto;
  }
</style>
