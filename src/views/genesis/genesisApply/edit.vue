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
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户地址">
            <el-input v-model="editDetails.address" :disabled="editDetails.id?true:false"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式">
            <el-input v-model="editDetails.contactWay" :disabled="type==2"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发行宣言">
            <el-input v-model="editDetails.declaration" :disabled="type==2"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="币种全称">
            <el-input v-model="editDetails.fullName" :disabled="type==2"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创世发行总数">
            <el-input v-model="editDetails.genesisIssue" :disabled="type==2"/>
          </el-form-item>
        </el-col>
<!--        <el-col :span="12">-->
<!--          <el-form-item label="币种简介">-->
<!--            <el-input v-model="editDetails.introduce" :disabled="type==2"/>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <el-col :span="12">
          <el-form-item label="发行周期">
            <el-input v-model="editDetails.issueCycle" :disabled="type==2"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="发行方">
            <el-input v-model="editDetails.issueName" :disabled="type==2"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="币种简称">
            <el-input v-model="editDetails.name" :disabled="type==2"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="发行价格">
            <el-input v-model="editDetails.price" :disabled="type==2"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="SRC支付数量">
            <el-input v-model="editDetails.srcAmount" :disabled="editDetails.id?true:false"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="发行总数">
            <el-input v-model="editDetails.total" :disabled="type==2"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="U支付数量">
            <el-input v-model="editDetails.usdtAmount" :disabled="editDetails.id?true:false"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="官方网站">
            <el-input v-model="editDetails.website" :disabled="type==2"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="白皮书链接">
            <el-input v-model="editDetails.whiteUrl" :disabled="type==2"/>
          </el-form-item>
        </el-col>

        <template v-if="type==2">
          <el-col :span="12">
            <el-form-item label="申请时间">
              <el-input v-model="editDetails.createdAt" :disabled="type==2"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="审核">
              <el-radio-group v-model="editDetails.status">
                <el-radio :label="1">成功</el-radio>
                <el-radio :label="2">失败</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="审核备注">
              <el-input v-model="editDetails.auditRemark" placeholder="审核备注"/>
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="12">
          <el-form-item label="googleCode" prop="googleCode">
            <el-input v-model="editDetails.googleCode"/>
          </el-form-item>
        </el-col>
      </el-row>


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
    import { updateDeif,toExamine } from '@/api/index';

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
                type: 0,
                status: '',
                auditRemark: '',
                width: this.initWidth(),
                rules: {
                    googleCode: [{ required: true, message: '不能为空', trigger: 'blur' }, {
                        min: 4,
                        message: 'google验证码为四位数',
                        trigger: 'blur'
                    }],
                    status: { required: true, message: '不能为空', trigger: 'change' }
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
                    address: '',
                    name: '',
                    usdtAmount: '',
                    srcAmount: '',
                    status: '',
                    auditRemark: '',
                    google: '',
                    id: ''
                };
            },
            initWidth() {
                this.screenWidth = document.body.clientWidth;
                if (this.screenWidth < 991) {
                    return '80%';
                } else {
                    return '800px';
                }
            },
            setDetails(val, type) {
                this.type = type;
                this.editDetails = { ...val };
            },
            close() {
                this.$emit('close');
            },
            submitForm() {
                this.$refs.form.validate((valid) => {
                    this.$store.commit('setGa_code', this.editDetails.googleCode);
                    if (valid) {
                        if (this.type == 2) {
                            toExamine({
                                id: this.editDetails.id,
                                status: this.editDetails.status,
                                auditRemark: this.editDetails.auditRemark
                            }).then(response => {
                                this.isVisible = false;
                                this.$message({
                                    message: '提交成功',
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
                            updateDeif(this.editDetails.id, this.editDetails).then(response => {
                                this.isVisible = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$emit('success');
                            }).catch(err => {
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
