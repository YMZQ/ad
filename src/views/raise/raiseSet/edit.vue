<template>
  <el-dialog
    :title="disabled1==3?'详情':title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="editDetails" :rules="rules" label-position="right" label-width="125px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="币种" prop="sellCoinId">
            <el-select class="filter-item" v-model="editDetails.sellCoinId" placeholder="请选择卖方币" filterable
                       :disabled="editDetails.id?true:false">
              <el-option v-for="item in coinList" :label="item.name" :value="String(item.id)"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="闪照最低U" prop="minHold">
            <el-input v-model="editDetails.minHold" :disabled="disabled1!=0?true:false"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公募数量" prop="totalQuota">
            <el-input v-model="editDetails.totalQuota" :disabled="disabled1!=0?true:false"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公募价格" prop="price">
            <el-input v-model="editDetails.price" :disabled="disabled1!=0?true:false"/>
          </el-form-item>
        </el-col>
        <template v-for="(domain, index) in editDetails.publicDistribute">
          <el-col :span="8">
            <el-form-item :label="'币种' + (index+1)" :key="domain.key" :prop="'publicDistribute.' + index + '.coinId'"
                          :rules="{ required: true, message: '币种不能为空', trigger: 'change'}">
              <el-select class="filter-item" v-model="domain.coinId" placeholder="请选择币种" filterable
                         :disabled="disabled1!=0?true:false">
                <el-option v-for="item in coinList" :label="item.name" :value="String(item.id)"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最低持有" :key="domain.key" :prop="'publicDistribute.' + index + '.minHold'"
                          :rules="{ required: true, message: '最低持有不能为空', trigger: 'blur'}">
              <el-input v-model="domain.minHold" :disabled="disabled1!=0?true:false"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分配比例" :key="domain.key" :prop="'publicDistribute.' + index + '.percentage'"
                          :rules="{ required: true, message: '分配比例不能为空', trigger: 'blur'}">
              <el-input v-model="domain.percentage" :disabled="disabled1!=0?true:false"/>
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="12">
          <el-form-item label="闪照时间" prop="publicBackupsTime">
            <el-date-picker type="datetime" placeholder="选择日期" v-model="editDetails.publicBackupsTime"
                            :disabled="disabled1>=1?true:false"
                            value-format="timestamp"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="兑换起始时间" prop="exchangeStartTime">
            <el-date-picker type="datetime" placeholder="选择日期" v-model="editDetails.exchangeStartTime"
                            :disabled="disabled1>=2?true :false"
                            value-format="timestamp"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="兑换结束时间" prop="exchangeEndTime">
            <el-date-picker type="datetime" placeholder="选择日期" v-model="editDetails.exchangeEndTime"
                            :disabled="disabled1>=3?true :false"
                            value-format="timestamp"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-show="disabled1 !==3">
          <el-form-item label="googleCode" prop="googleCode">
            <el-input v-model.number="editDetails.googleCode"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="warning" plain :loading="buttonLoading" @click="isVisible = false">
        取消
      </el-button>
      <el-button type="primary" plain :loading="buttonLoading" @click="submitForm" v-show="disabled1 !==3">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
    import { addPublicConfig, updatePublicConfig, getAllCoin,getConfigTime } from '@/api/index';

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

                dynamicValidateForm: {
                    domains: [{
                        coinId: '',
                        minHold: '',
                        percentage: ''
                    }, {
                        coinId: '',
                        minHold: '',
                        percentage: ''
                    }],
                    email: ''
                },


                initFlag: false,
                editDetails: this.initUser(),
                buttonLoading: false,
                isContent: false,
                screenWidth: 0,
                width: this.initWidth(),
                rules: {
                    minHold: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    totalQuota: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    price: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    googleCode: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    exchangeEndTime: { required: true, message: '不能为空', trigger: 'change' },
                    exchangeStartTime: { required: true, message: '不能为空', trigger: 'change' },
                    publicBackupsTime: { required: true, message: '不能为空', trigger: 'change' },
                    sellCoinId: { required: true, message: '不能为空', trigger: 'change' }
                },
                dialogImageUrl: '',
                dialogVisibleImg: false,
                disabled: false,
                configTime: '',
                coinList: []
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
            },
            disabled1: function() {
                let publicBackupsTime = this.getUTCTime(this.editDetails.publicBackupsTime);
                let exchangeStartTime = this.getUTCTime(this.editDetails.exchangeStartTime);
                let exchangeEndTime = this.getUTCTime(this.editDetails.exchangeEndTime);
                let newDate = this.configTime
                let status;
                if (newDate > publicBackupsTime && newDate < exchangeStartTime && newDate < exchangeEndTime) {
                    status = 1;
                } else if (newDate > exchangeStartTime && newDate < exchangeEndTime) {
                    status = 2;
                } else if (newDate > exchangeEndTime) {
                    status = 3;
                } else {
                    status = 0;
                }
                return status;
            }
        },
        created() {
            this.getAllCoin();
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
            getAllCoin() {
                getAllCoin().then(response => {
                    this.coinList = response.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            getConfigTime(){
                getConfigTime().then(response => {
                    this.configTime = response.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            initUser() {
                return {
                    sellCoinId: '',
                    minHold: '',
                    totalQuota: '',
                    price: '',
                    publicBackupsTime: '',
                    exchangeStartTime: '',
                    exchangeEndTime: '',
                    publicDistribute: [{
                        coinId: '', percentage: '', minHold: ''
                    }, {
                        coinId: '', percentage: '', minHold: ''
                    }],
                    googleCode: '',
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
                this.editDetails.sellCoinId = this.editDetails.sellCoinId.toString();
                this.editDetails.publicDistribute.forEach(item => {
                    if (item.coinId) {
                        item.coinId = item.coinId.toString();
                    }
                });
                this.editDetails.publicBackupsTime = this.getUTCTime(this.editDetails.publicBackupsTime);
                this.editDetails.exchangeStartTime = this.getUTCTime(this.editDetails.exchangeStartTime);
                this.editDetails.exchangeEndTime = this.getUTCTime(this.editDetails.exchangeEndTime);
                this.editDetails.publicDistribute = this.editDetails.publicDistribute;
                this.getConfigTime()
            },
            getUTCTime: function(str) {
                var str = new Date(str);
                var utc = str.getTime();
                return utc;
            },
            close() {
                this.$emit('close');
            },
            submitForm() {
                this.$refs.form.validate((valid) => {
                    this.$store.commit('setGa_code', this.editDetails.googleCode);
                    if (valid) {
                        this.$store.commit('setGa_code', this.editDetails.googleCode);
                        if (!this.editDetails.id) {
                            // create
                            addPublicConfig(this.editDetails).then(response => {
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
                            updatePublicConfig(this.editDetails).then(response => {
                                this.isVisible = false;
                                this.$message({
                                    message: '更新成功',
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

  /deep/ .el-upload--picture-card {
    width: 80px;
    height: 80px;
    line-height: 80px;
  }

  /deep/ .el-upload-list, /deep/ .el-upload-list--picture-card, /deep/ .el-upload-list__item {
    width: 80px;
    height: 80px;
    line-height: 80px;
  }

</style>
