<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="editDetails" :rules="rules" label-position="right" label-width="125px">
      <el-form-item label="名字" prop="name">
        <el-input v-model.number="editDetails.name" :disabled="disabled"/>
      </el-form-item>
      <el-form-item label="键" prop="key">
        <el-input v-model.number="editDetails.key" :disabled="disabled"/>
      </el-form-item>
      <el-form-item label="值" prop="value">
        <el-input v-model.number="editDetails.value"/>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="editDetails.remark"/>
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
    import { addAddr, updateAddr } from '@/api/index';

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
                    google: { required: true, message: '不能为空', trigger: 'blur' },
                    name: { required: true, message: '不能为空', trigger: 'blur' },
                    key: { required: true, message: '不能为空', trigger: 'blur' },
                    value: { required: true, message: '不能为空', trigger: 'blur' }
                }
            };
        },
        computed: {
            disabled() {
                if (this.editDetails.id) {
                    return true;
                } else {
                    return false;
                }
            },
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
                    key: '',
                    name: '',
                    remark: '',
                    value: '',
                    google: '',
                    type: 3,
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
                this.editDetails = { ...val };
            },
            close() {
                this.$emit('close');
            },
            submitForm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$store.commit('setGa_code', this.editDetails.googleCode);
                        if (!this.editDetails.id) {
                            // create
                            addAddr(this.editDetails).then(response => {
                                this.isVisible = false;
                                this.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.$emit('success');
                            }).catch(err => {
                                this.$message({
                                    message: '系统错误',
                                    type: 'error'
                                });
                            });
                        } else {
                            // update
                            updateAddr(this.editDetails).then(response => {
                                this.isVisible = false;
                                this.$message({
                                    message: '更新成功',
                                    type: 'success'
                                });
                                this.$emit('success');
                            }).catch(err => {
                                console.log(err);
                                this.$message({
                                    message: '系统错误',
                                    type: 'error'
                                });
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
