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
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="币种名称" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="币种类型" prop="vipLevel">
            <el-select class="filter-item" v-model="editDetails.vipLevel" placeholder="请选择" filterable>
              <el-option label="主流币" value="1"/>
              <el-option label="ICO币" value="2"/>
              <el-option label="分叉币" value="3"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="中文名称" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="英文名称" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="合约ID" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="最小提币金额" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="日提币额度" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="次提币额度" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="小时免审总额度" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="次免审额度" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="日免审总额度" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="充值到账确认数" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="提币到账确认数" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="开发提币" prop="vipLevel">
            <el-select class="filter-item" v-model="editDetails.vipLevel" placeholder="请选择" filterable>
              <el-option
                v-for="item in Methods.displayType"
                :key="item.id"
                :label="item.type"
                :value="String(item.id)">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="开放充值" prop="vipLevel">
            <el-select class="filter-item" v-model="editDetails.vipLevel" placeholder="请选择" filterable>
              <el-option
                v-for="item in Methods.displayType"
                :key="item.id"
                :label="item.type"
                :value="String(item.id)">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="归属币种" prop="vipLevel">
            <el-select class="filter-item" v-model="editDetails.vipLevel" placeholder="请选择" filterable>
              <el-option
                v-for="item in Methods.displayType"
                :key="item.id"
                :label="item.type"
                :value="String(item.id)">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="独立地址" prop="vipLevel">
            <el-select class="filter-item" v-model="editDetails.vipLevel" placeholder="请选择" filterable>
              <el-option
                v-for="item in Methods.displayType"
                :key="item.id"
                :label="item.type"
                :value="String(item.id)">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="币种显示" prop="vipLevel">
            <el-select class="filter-item" v-model="editDetails.vipLevel" placeholder="请选择" filterable>
              <el-option
                v-for="item in Methods.displayType"
                :key="item.id"
                :label="item.type"
                :value="String(item.id)">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="是否多链" prop="vipLevel">
            <el-select class="filter-item" v-model="editDetails.vipLevel" placeholder="请选择" filterable>
              <el-option
                v-for="item in Methods.displayType"
                :key="item.id"
                :label="item.type"
                :value="String(item.id)">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="多链归属币种" prop="vipLevel">
            <el-select class="filter-item" v-model="editDetails.vipLevel" placeholder="请选择" filterable>
              <el-option
                v-for="item in Methods.displayType"
                :key="item.id"
                :label="item.type"
                :value="String(item.id)">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="CNY小数位精度" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="交易记录地址" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="区块浏览器地址" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="是否备注" prop="vipLevel">
            <el-select class="filter-item" v-model="editDetails.vipLevel" placeholder="请选择" filterable>
              <el-option
                v-for="item in Methods.displayType"
                :key="item.id"
                :label="item.type"
                :value="String(item.id)">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="备注" prop="google">
            <el-input type="textarea" v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="googleCode" prop="google">
            <el-input v-model.number="editDetails.google"/>
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
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    vipLevel: { required: true, message: '不能为空', trigger: 'change' }
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
                    return '800px';
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
