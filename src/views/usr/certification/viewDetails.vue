<template>
  <el-dialog
    title="查看"
    :width="width"
    :visible.sync="isVisible"
    class="user-view"
  >
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>国家：</span> {{ viewDetails.countryId }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>真实名称：</span> {{ viewDetails.realName}}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>证件类型：</span> {{ viewDetails.cardTypeName }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>证件号码：</span> {{ viewDetails.cardId}}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="8">
        <el-image
          style="width: 100px; height: 100px"
          :src="url"
          :preview-src-list="srcList">
        </el-image>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-image
          style="width: 100px; height: 100px"
          :src="url"
          :preview-src-list="srcList">
        </el-image>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-image
          style="width: 100px; height: 100px"
          :src="url"
          :preview-src-list="srcList">
        </el-image>
      </el-col>
    </el-row>
<!--    <el-row :gutter="10">-->
<!--      <el-col :xs="24" :sm="12">-->
<!--        <div class="view-item">-->
<!--          <span>审核结果：</span> {{ viewDetails.language | langFilter}}-->
<!--        </div>-->
<!--      </el-col>-->
<!--    </el-row>-->
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
                viewDetails: {},
                url: 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
                srcList: [
                    'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
                    'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
                ]
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
  .el-row{
    margin: 10px 0;
  }
</style>
