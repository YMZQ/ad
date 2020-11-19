<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="editDetails" :rules="rules" label-position="right" label-width="120px">
      <el-form-item label="VIP等级" prop="level">
        <el-input v-model.number="editDetails.level"/>
      </el-form-item>
      <el-form-item label="VIP名称" prop="e">
        <el-input v-model.number="editDetails.levelName"/>
      </el-form-item>
      <el-form-item label="Taker费率折扣" prop="takerFee">
        <el-input v-model.number="editDetails.takerFee"/>
        被动成交的手续费折扣，例如0.9表示收取正常手续费的90%
      </el-form-item>
      <el-form-item label="Maker费率折扣" prop="makerFee">
        <el-input v-model.number="editDetails.makerFee"/>
        主动成交的手续费折扣，例如0表示不收手续费
      </el-form-item>
      <el-form-item label="积分下限" prop="point">
        <el-input v-model.number="editDetails.point"/>
      </el-form-item>
      <el-form-item label="提币开关" prop="isWithdrawOpen">
        <el-switch v-model="editDetails.isWithdrawOpen">
        </el-switch>
      </el-form-item>
      <el-form-item label="OTC开关" prop="isOtcOpen">
        <el-switch v-model="editDetails.isOtcOpen">
        </el-switch>
      </el-form-item>
      <el-form-item label="googleCode" prop="google">
        <el-input v-model.number="editDetails.google"/>
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
    import { addUser, updataUser } from '@/api/index';

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
                editDetails: this.initUser(),
                buttonLoading: false,
                isContent: false,
                screenWidth: 0,
                width: this.initWidth(),
                rules: {
                    google: [
                        { required: true, message: 'Google验证码不能为空', trigger: 'blur' }
                    ],
                    level: { required: true, message: 'VIP等级不能为空', trigger: 'blur' },
                    levelName: { required: true, message: 'VIP名称不能为空', trigger: 'blur' },
                    point: { required: true, message: '积分下限不能为空', trigger: 'blur' },
                    takerFee: { required: true, message: 'Taker费率折扣不能为空', trigger: 'blur' },
                    makerFee: { required: true, message: 'Maker费率折扣不能为空', trigger: 'blur' }
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
            initUser() {
                return {
                    level: '',
                    levelName: '',
                    point: '',
                    takerFee: '',
                    makerFee: '',
                    isWithdrawOpen: 0,
                    isOtcOpen: 0,
                    google: '',
                    id: ''
                };
            },
            initWidth() {
                this.screenWidth = document.body.clientWidth;
                if (this.screenWidth < 991) {
                    return '90%';
                } else if (this.screenWidth > 991 && this.screenWidth < 1400) {
                    return '80%';
                } else {
                    return '600px';
                }
            },
            setDetails(val) {
                this.editDetails = { ...val };
                if(this.editDetails.isWithdrawOpen){
                    this.editDetails.isWithdrawOpen = true
                }else if(this.editDetails.isOtcOpen){
                    this.editDetails.isOtcOpen = true
                }
            },
            close() {
                this.$emit('close');
            },
            submitForm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.buttonLoading = true;
                        if (!this.editDetails.id) {
                            // create
                            addUser(this.editDetails).then(response => {
                                this.buttonLoading = false;
                                this.isVisible = false;
                                this.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.$emit('success');
                            }).catch(err => {
                                // this.$message({
                                //     message: '系统错误',
                                //     type: 'error'
                                // });
                                this.buttonLoading = false;
                            });
                        } else {
                            // update
                            updataUser(this.editDetails).then(response => {
                                this.buttonLoading = false;
                                this.isVisible = false;
                                this.$message({
                                    message: '更新成功',
                                    type: 'success'
                                });
                                this.$emit('success');
                            }).catch(err => {
                                console.log(err);
                                // this.$message({
                                //     message: '系统错误',
                                //     type: 'error'
                                // });
                                this.buttonLoading = false;
                            });
                        }
                    } else {
                        return false;
                    }
                });
            },
            reset() {
                // 先清除校验，再清除表单，不然有奇怪的bug
                this.$refs.form.clearValidate();
                this.$refs.form.resetFields();
                this.editDetails = this.initUser();
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
