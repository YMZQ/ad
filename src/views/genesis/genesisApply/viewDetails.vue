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
          <span>用户地址：</span> {{ viewDetails.address }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>联系方式：</span> {{ viewDetails.contactWay}}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-time"/> <span>审核时间：</span>
          {{ viewDetails.auditAt}}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item"> <span>审核备注：</span>
          {{ viewDetails.auditRemark }}
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>发行宣言：</span> {{ viewDetails.declaration }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>创世发行总数：</span> {{ viewDetails.genesisIssue}}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>发行方：</span> {{ viewDetails.issueName }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>币种简称：</span> {{ viewDetails.name}}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>发行价格：</span> {{ viewDetails.price }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>SRC支付数量：</span> {{ viewDetails.srcAmount }}
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>币种全称：</span> {{ viewDetails.fullName }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>状态：</span> {{ viewDetails.status  | statusOf}}
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>发行总数：</span> {{ viewDetails.total }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>U支付数量：</span> {{ viewDetails.usdtAmount}}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>官方网站：</span> {{ viewDetails.website }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>白皮书链接：</span> {{ viewDetails.whiteUrl}}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <!--      <el-col :xs="24" :sm="12">-->
      <!--        <div class="view-item">-->
      <!--          <span>币种简介：</span> {{ viewDetails.introduce }}-->
      <!--        </div>-->
      <!--      </el-col>-->
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>发行周期：</span> {{ viewDetails.issueCycle}}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-time"/> <span>申请时间：</span>
          {{ viewDetails.createdAt }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" v-if="viewDetails.updatedAt">
        <div class="view-item">
          <i class="el-icon-brush"/> <span>修改时间：</span>
          {{ viewDetails.updatedAt  }}
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
        filters: {
            statusOf: function(val) {
                switch (val) {
                    case 0:
                        return '待审核';
                    case 1:
                        return '成功';
                    case 2:
                        return '失败';
                    case 3:
                        return '其他';
                }
            }
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
    max-height: 200px;
    overflow-y: auto;
  }
</style>
