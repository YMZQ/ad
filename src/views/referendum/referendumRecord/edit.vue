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

      <el-form-item label="币种" prop="coinId">
        <el-select class="filter-item" v-model="editDetails.coinId" placeholder="请选择卖方币" filterable
                   :disabled="editDetails.id?true:false">
          <el-option v-for="item in coinList" :label="item.name" :value="String(item.id)"/>
        </el-select>
      </el-form-item>


      <el-form-item label="发起地址" prop="address">
        <el-input v-model="editDetails.address" :disabled="editDetails.id?true:false"/>
      </el-form-item>

      <el-form-item label="激活起始时间" prop="publicBackupsTime">
        <el-date-picker type="datetime" placeholder="选择日期" v-model="editDetails.startTime"
                        value-format="timestamp"></el-date-picker>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select class="filter-item" v-model="editDetails.status" placeholder="请选择">
          <el-option label="即将开始" value="0"/>
          <el-option label="进行中" value="1"/>
          <el-option label="已完成" value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="单票扣除数量" prop="price">
        <el-input v-model="editDetails.price"/>
      </el-form-item>

      <el-form-item label="是否显示" prop="display">
        <el-select class="filter-item" v-model="editDetails.display" placeholder="请选择">
          <el-option label="显示" value="1"/>
          <el-option label="不显示" value="0"/>
        </el-select>
      </el-form-item>

      <el-form-item label="基数设置" prop="baseCount">
        <el-input v-model="editDetails.baseCount"/>
      </el-form-item>

      <el-form-item label="达标数量设置" prop="standardCount">
        <el-input v-model="editDetails.standardCount"/>
      </el-form-item>

      <el-form-item label="创世序号">
        <el-select class="filter-item" v-model="editDetails.defiId" placeholder="创世序号" filterable>
          <el-option v-for="item in list" :label="item.id" :value="String(item.id)"/>
        </el-select>
      </el-form-item>

      <el-form-item label="googleCode" prop="googleCode">
        <el-input v-model.number="editDetails.googleCode"/>
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
    import { addVoteConfig, updateVoteConfig, getAllCoin, getDeifList } from '@/api/index';

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
                    baseCount: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    coinName: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    address: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    price: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    standardCount: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    googleCode: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    coinId: { required: true, message: '不能为空', trigger: 'change' },
                    status: { required: true, message: '不能为空', trigger: 'change' },
                    display: { required: true, message: '不能为空', trigger: 'change' },
                    startTime: { required: true, message: '不能为空', trigger: 'change' }
                },
                dialogImageUrl: '',
                dialogVisibleImg: false,
                disabled: false,
                coinList: [],
                list: []
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
        created() {
            this.getAllCoin();
            this.fetch();
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
            initUser() {
                return {
                    baseCount: '',
                    coinId: '',
                    display: '',
                    address: '',
                    price: '',
                    standardCount: '',
                    status: '',
                    defiId: '',
                    startTime: '',
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
                this.editDetails.coinId = this.editDetails.coinId.toString();
                this.editDetails.status = this.editDetails.status.toString();
                this.editDetails.display = this.editDetails.display.toString();
                if (this.editDetails.defiId) {
                    this.editDetails.defiId = this.editDetails.defiId.toString();
                }
                this.editDetails.startTime = this.getUTCTime(this.editDetails.startTime);
            },
            getUTCTime: function(str) {
                var str = new Date(str);
                var utc = str.getTime();
                return utc;
            },
            close() {
                this.$emit('close');
            },
            fetch(params = {}) {
                getDeifList(params).then(response => {
                    this.list = response.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            submitForm() {
                this.$refs.form.validate((valid) => {
                    this.$store.commit('setGa_code', this.editDetails.googleCode);
                    if (valid) {
                        this.$store.commit('setGa_code', this.editDetails.googleCode);
                        if (!this.editDetails.id) {
                            // create
                            addVoteConfig(this.editDetails).then(response => {
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
                            updateVoteConfig(this.editDetails).then(response => {
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
