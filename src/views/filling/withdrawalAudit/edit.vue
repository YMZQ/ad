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
<!--      <el-form-item label="ID">-->
<!--        <el-input v-model="editDetails.id" placeholder="" disabled/>-->
<!--      </el-form-item>-->
      <el-form-item label="用户ID">
        <el-input v-model="editDetails.address" placeholder="" disabled/>
      </el-form-item>
      <el-form-item label="公链币种">
        <el-input v-model="editDetails.coinName" placeholder="" disabled/>
      </el-form-item>
      <el-form-item label="币种">
        <el-input v-model="editDetails.chain" placeholder="" disabled/>
      </el-form-item>
<!--      <el-form-item label="币种ID">-->
<!--        <el-input v-model="editDetails.coinId" placeholder="" disabled/>-->
<!--      </el-form-item>-->
      <el-form-item label="金额">
        <el-input v-model="editDetails.amount" placeholder="" disabled/>
      </el-form-item>
      <el-form-item label="手续费">
        <el-input v-model="editDetails.fee" placeholder="" disabled/>
      </el-form-item>
      <el-form-item label="提现地址">
        <el-input v-model="editDetails.fromAddress" placeholder="" disabled/>
      </el-form-item>
      <el-form-item label="入账地址">
        <el-input v-model="editDetails.toAddress" placeholder="" disabled/>
      </el-form-item>
      <el-form-item label="hash">
        <el-input v-model="editDetails.orgTxHash" placeholder="" disabled/>
      </el-form-item>
      <el-form-item label="审核" >
        <el-radio-group v-model="status">
          <el-radio :label="1">审核通过</el-radio>
          <el-radio :label="4">审核不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核备注">
        <el-input v-model="editDetails.reason" placeholder="审核备注"/>
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
    import {updateAssetWithdraw} from '@/api/index';

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
                reason: '',
                width: this.initWidth(),
                rules: {
                    googleCode: [{required: true, message: '不能为空', trigger: 'blur'}, {
                        min: 4,
                        message: 'google验证码为四位数',
                        trigger: 'blur'
                    }],
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
                    this.$store.commit('setGa_code', this.editDetails.googleCode);
                    if (valid) {
                        let {id} = this.editDetails
                        let status = this.status
                        let reason = this.reason
                        updateAssetWithdraw({id, status,reason}).then(response => {
                            this.isVisible = false;
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.$emit('success');
                        }).catch(err => {
                            // this.$message({
                            //     message: '系统错误',
                            //     type: 'error'
                            // });
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
