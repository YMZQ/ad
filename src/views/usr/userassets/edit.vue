<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="editDetails" :rules="rules" label-position="right" label-width="100px">
      <el-form-item label="用户名">
        <el-input v-model="editDetails.userName" disabled/>
      </el-form-item>
      <el-form-item v-show="title=='冻结锁仓'" label="冻结锁仓" prop="lockedPostionId">
        <el-select class="filter-item" v-model="editDetails.lockedPostionId" placeholder="请选择冻结锁仓" clearable filterable>
          <el-option v-for="item in Methods.FreezingType" :label="item.name" :value="String(item.id)"/>
        </el-select>
      </el-form-item>
      <el-form-item v-show="title!='冻结锁仓'" label="币种名称" prop="coin">
        <el-select class="filter-item" v-model="editDetails.coin" placeholder="请选择冻结锁仓" clearable filterable>
          <el-option v-for="item in Methods.coinList" :label="Methods.Capitalization(item.name)" :value="String(item.id)"/>
        </el-select>
      </el-form-item>
      <el-form-item label="冻结类型" prop="freezeType">
        <el-select class="filter-item" v-model="editDetails.freezeType" placeholder="请选择冻结类型" clearable filterable>
          <el-option v-for="item in Methods.FreezingType" :label="item.name" :value="String(item.id)"/>
        </el-select>
      </el-form-item>
      <el-form-item label="数量" prop="amount">
        <el-input v-model.number="editDetails.amount"/>
      </el-form-item>
      <el-form-item label="googleCode" prop="google">
        <el-input v-model="editDetails.google"/>
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
                    google: [{required: true, message: '不能为空', trigger: 'blur'},  { min: 4,   message: 'google验证码为四位数', trigger: 'blur' }],
                    lockedPostionId: { required: true, message: '不能为空', trigger: 'change' },
                    freezeType: { required: true, message: '不能为空', trigger: 'change' },
                    amount: [{ required: true, message: '不能为空', trigger: 'blur' }, { type: 'number', message: '请输入数字' }]
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
                    categoryName: '',
                    orderBy: '',
                    isRecommend: '',
                    region: '',
                    language: '',
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
                // this.editDetails = { ...val };
                // this.editDetails.coin = String(this.editDetails.coin)
            },
            close() {
                this.$emit('close');
            },
            submitForm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.buttonLoading = true;
                        if (!this.editDetails.id) {

                            console.log(this.editDetails);
                            return false;

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
                                this.$message({
                                    message: '系统错误',
                                    type: 'error'
                                });
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
                                this.$message({
                                    message: '系统错误',
                                    type: 'error'
                                });
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
