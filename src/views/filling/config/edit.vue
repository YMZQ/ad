<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <template v-if="editType==1">
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
    </template>
    <template v-if="editType==2">
      <el-form ref="form1" :model="editConfig" :rules="rule" label-position="right" label-width="135px">
        <template v-for="(item, index) in editConfig.exemption">
          <el-form-item v-if="item.key=='auto_withdraw_is_open'" :label="item.name">
            <el-switch active-value="1" inactive-value="0" v-model="item.value">
            </el-switch>
          </el-form-item>
          <el-form-item v-if="item.key!='auto_withdraw_is_open'" :key="item.key" :label="item.name" :prop="'exemption.'+index+'.value'"
                        :rules="{ required: true, message: item.name+'不能为空', trigger: 'blur'}">
            <el-input v-model="item.value" :placeholder="item.name  "/>
          </el-form-item>
        </template>
        <el-form-item label="googleCode" prop="google"  >
          <el-input v-model="editConfig.google"/>
        </el-form-item>
      </el-form>
      <p class="red">说明：</p>
      <p class="red">1、开启情况下，当用户的提币满足以上8个条件时，可免审后直接提币；</p>
      <p class="red">2、请确保提币地址有充足余额。</p>
    </template>
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
    import { addSysConfig, updateconfig, getFconfig, updateBatchConfig } from '@/api/index';

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
            },
            editType: {
                type: [String, Number],
                default: 1
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
                editConfig: {
                    exemption: [],
                    google:''
                },
                rules: {
                    google: { required: true, message: '不能为空', trigger: 'blur' },
                    name: { required: true, message: '不能为空', trigger: 'blur' },
                    key: { required: true, message: '不能为空', trigger: 'blur' },
                    value: { required: true, message: '不能为空', trigger: 'blur' }
                },
                rule: {
                    google: { required: true, message: '不能为空', trigger: 'blur' },
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
                    type: 2,
                    remark: '',
                    value: '',
                    google: '',
                    id: ''
                };
            },
            getdata() {
                getFconfig({ parent_key: this.editDetails.key }).then(response => {
                    this.editConfig.exemption = response.data.records;
                }).catch(err => {
                });
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
                if (this.editDetails.value == '${sub_keys}') {
                    this.getdata();
                }
            },
            close() {
                this.$emit('close');
            },
            submitForm() {
                if (this.editType == 1 && this.editDetails.value != '${sub_keys}') {
                    console.log(this.$refs.form.validate);
                    this.$refs.form.validate((valid) => {
                        if (valid) {
                            this.$store.commit('setGa_code', this.editDetails.googleCode);
                            if (!this.editDetails.id) {
                                // create
                                addSysConfig(this.editDetails).then(response => {
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
                                updateconfig(this.editDetails).then(response => {
                                    this.isVisible = false;
                                    this.$message({
                                        message: '更新成功',
                                        type: 'success'
                                    });
                                    this.$emit('success');
                                }).catch(err => {
                                    console.log(err);
                                });

                            }
                        } else {
                            return false;
                        }
                    });
                } else if (this.editType == 2 && this.editDetails.value == '${sub_keys}') {
                    this.$refs.form1.validate((valid) => {
                        if (valid) {
                            // update
                            this.$store.commit('setGa_code', this.editConfig.google);
                            updateBatchConfig(this.editConfig.exemption).then(response => {
                                this.isVisible = false;
                                this.$message({
                                    message: '更新成功',
                                    type: 'success'
                                });
                                this.$emit('success');
                            }).catch(err => {
                                console.log(err);
                            });
                        } else {
                            return false;
                        }
                    });
                }
            },
            reset() {
                // 先清除校验，再清除表单，不然有奇怪的bug
                this.$refs.form.clearValidate();
                this.$refs.form.resetFields();
                this.editDetails = this.initUser();
                this.editConfig.exemption =[]
                this.editConfig.google =''
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

  .red {
    color: #F56C6C;
    padding-left: 20px;
  }

</style>
