<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="editDetails" :rules="rules" label-position="right" label-width="140px">
      <el-form-item label="币种名称">
        <el-input v-model="editDetails.full_name" placeholder="请输入提币费率百分比" disabled/>
      </el-form-item>
      <el-form-item label="币种简称">
        <el-input v-model="editDetails.name" placeholder="请输入单笔提币费率" disabled/>
      </el-form-item>
      <el-form-item label="发行价(USDT)">
        <el-input v-model="editDetails.price" placeholder="请输入单笔提币费率" disabled/>
      </el-form-item>
      <el-form-item label="发行总数">
        <el-input v-model="editDetails.total" placeholder="请输入单笔提币费率" disabled/>
      </el-form-item>
      <el-form-item label="官方网站">
        <el-input v-model="editDetails.website" placeholder="请输入单笔提币费率" disabled/>
      </el-form-item>
      <el-form-item label="白皮书链接">
        <el-input v-model="editDetails.white_url" placeholder="请输入单笔提币费率" disabled/>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="editDetails.phone" placeholder="请输入单笔提币费率" disabled/>
      </el-form-item>
      <el-form-item label="发行宣言">
        <el-input v-model="editDetails.declaration" placeholder="请输入单笔提币费率" disabled/>
      </el-form-item>
      <el-form-item label="提交时间">
        <el-input v-model="editDetails.createdAt" placeholder="请输入单笔提币费率" disabled/>
      </el-form-item>
      <el-form-item label="审核">
        <el-radio-group v-model="status">
          <el-radio :label="1">审核通过</el-radio>
          <el-radio :label="0">审核不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="googleCode" prop="googleCode">
        <el-input v-model="editDetails.googleCode"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="warning" plain :loading="buttonLoading" @click="isVisible = false">
        取消
      </el-button>
      <el-button type="primary" plain :loading="buttonLoading" @click="submitForm">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {updataAssetCoin} from '@/api/index';

  export default {
    name: 'edit',
    components: {},
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        initFlag: false,
        editDetails: this.initForm(),
        buttonLoading: false,
        isContent: false,
        screenWidth: 0,
        status: '',
        width: this.initWidth(),
        rules: {
            googleCode: [{required: true, message: '不能为空', trigger: 'blur'}, {
            min: 4,
            message: 'google验证码为四位数',
            trigger: 'blur'
          }],
          fee: {required: true, message: '不能为空', trigger: 'blur'},
          status: {required: true, message: '不能为空', trigger: 'change'},
        }
      };
    },
    computed: {
      isVisible: {
        get() {
          return this.dialogVisible;
        },
        set() {
          this.close();
          this.reset();
        }
      }
    },
    components: {},
    mounted() {
      window.onresize = () => {
        return (() => {
          this.width = this.initWidth();
        })();
      };
    },
    methods: {
      initForm() {
        return {
          coin: '',
          fee: '',
          google: '',
          id: ''
        };
      },
      initWidth() {
        this.screenWidth = document.body.clientWidth;
        if (this.screenWidth < 991) {
          return '80%';
        } else if (this.screenWidth < 1400) {
          return '40%';
        } else {
          return '600px';
        }
      },
      setDetails(val) {
        this.editDetails = {...val};
      },
      close() {
        this.$emit('close');
      },
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let {id} = this.editDetails
            let status = this.status
            updataAssetCoin({id, status}).then(response => {
              this.isVisible = false;
              this.$message({
                message: '提交成功',
                type: 'success'
              });
            }).catch(err => {
              this.$message({
                message: '系统错误',
                type: 'error'
              });
            });

            // if (!this.editDetails.id) {
            //   // create
            //   addUser(this.editDetails).then(response => {
            //     this.buttonLoading = false;
            //     this.isVisible = false;
            //     this.$message({
            //       message: '新增成功',
            //       type: 'success'
            //     });
            //     this.$emit('success');
            //   }).catch(err => {
            //     this.$message({
            //       message: '系统错误',
            //       type: 'error'
            //     });
            //     this.buttonLoading = false;
            //   });
            // } else {
            //   // update
            //   updataUser(this.editDetails).then(response => {
            //     this.buttonLoading = false;
            //     this.isVisible = false;
            //     this.$message({
            //       message: '更新成功',
            //       type: 'success'
            //     });
            //     this.$emit('success');
            //   }).catch(err => {
            //     console.log(err);
            //     this.$message({
            //       message: '系统错误',
            //       type: 'error'
            //     });
            //     this.buttonLoading = false;
            //   });
            // }
          } else {
            return false;
          }
        });
      },
      reset() {
        // 先清除校验，再清除表单，不然有奇怪的bug
        this.$refs.form.clearValidate();
        this.$refs.form.resetFields();
        this.editDetails = this.initForm();
      }
    }
  };
</script>
<style lang="scss" scoped>
  .el-icon-close {
    position: absolute;
    right: 5px;
    top: 54px;
    height: 14px;
    z-index: 99999999999;
    color: #000;
    font-weight: bold;
  }
</style>
