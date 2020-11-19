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
          <el-form-item label="交易币" prop="vipLevel">
            <el-select class="filter-item" v-model="editDetails.vipLevel" placeholder="请选择" filterable>
              <el-option label="普通会员" value="1"/>
              <el-option label="市代理" value="2"/>
              <el-option label="市值用户" value="3"/>
              <el-option label="高级会员" value="4"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="法币" prop="vipLevel">
            <el-select class="filter-item" v-model="editDetails.vipLevel" placeholder="请选择" filterable>
              <el-option label="普通会员" value="1"/>
              <el-option label="市代理" value="2"/>
              <el-option label="市值用户" value="3"/>
              <el-option label="高级会员" value="4"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="接单限制时间" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="支付限制时间" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="确认限制时间" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="申诉限制时间" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="最小发布数量" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="最大发布数量" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="最小交易数量" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="最大交易数量" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="数量小数位" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="价格小数位" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="成交额小数位" prop="google">
            <el-input v-model.number="editDetails.google"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-form-item label="是否开市场" prop="vipLevel">
            <el-select class="filter-item" v-model="editDetails.vipLevel" placeholder="请选择"  filterable>
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
        <el-form-item label="是否支持浮动价" prop="vipLevel">
          <el-select class="filter-item" v-model="editDetails.vipLevel" placeholder="请选择"  filterable>
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
          <el-form-item label="参考火币价格" prop="vipLevel">
            <el-select class="filter-item" v-model="editDetails.vipLevel" placeholder="请选择 "  filterable>
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
