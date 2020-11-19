<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="editDetails" :rules="rules" label-position="right" label-width="150px">
      <el-form-item label="买方币" prop="buyCoinId">
        <el-select class="filter-item" v-model="editDetails.buyCoinId" placeholder="请选择买方币" filterable
                   :disabled="editDetails.id?true:false">
          <el-option v-for="item in coinList" :label="item.name" :value="String(item.id)"/>
        </el-select>
      </el-form-item>

      <el-form-item label="卖方币" prop="sellCoinId">
        <el-select class="filter-item" v-model="editDetails.sellCoinId" placeholder="请选择卖方币" filterable
                   :disabled="editDetails.id?true:false">
          <el-option v-for="item in coinList" :label="item.name" :value="String(item.id)"/>
        </el-select>
      </el-form-item>

      <!--      <el-form-item label="(买方)最小交易数量" prop="buyMin">-->
      <!--        <el-input v-model="editDetails.buyMin"/>-->
      <!--      </el-form-item>-->

      <!--      <el-form-item label="(卖方)最小交易数量" prop="sellMin">-->
      <!--        <el-input v-model="editDetails.sellMin"/>-->
      <!--      </el-form-item>-->

      <el-form-item label="买方币有效小数位" prop="buyPoint">
        <el-input v-model="editDetails.buyPoint"/>
      </el-form-item>

      <el-form-item label="卖方币有效小数位" prop="sellPoint">
        <el-input v-model="editDetails.sellPoint"/>
      </el-form-item>

      <el-form-item label="金额有效小数位" prop="moneyPoint">
        <el-input v-model="editDetails.moneyPoint"/>
      </el-form-item>

      <!--      <el-form-item label="矿工费" prop="minerFees">-->
      <!--        <el-input v-model="editDetails.minerFees"/>-->
      <!--      </el-form-item>-->

      <!--      <el-form-item label="买入费率" prop="buyFees">-->
      <!--        <el-input v-model="editDetails.buyFees"/>-->
      <!--      </el-form-item>-->

      <el-form-item label="卖出费率" prop="sellFees">
        <el-input v-model="editDetails.sellFees"/>
      </el-form-item>

      <!--      <el-form-item label="手续费率" prop="sellMin">-->
      <!--        <el-input v-model="editDetails.makerFees"/>-->
      <!--      </el-form-item>-->

      <el-form-item label="是否开盘" prop="isOpen">
        <el-select class="filter-item" v-model="editDetails.isOpen" placeholder="请选择是否开盘">
          <el-option label="是" value="1"/>
          <el-option label="否" value="0"/>
        </el-select>
      </el-form-item>

      <el-form-item label="市场类型" prop="type">
        <el-select class="filter-item" v-model="editDetails.type" placeholder="请选择市场类型" filterable>
          <el-option label="SRC" value="1"/>
          <el-option label="DEFI" value="2"/>
          <el-option label="CEFI" value="3"/>
        </el-select>
      </el-form-item>

      <el-form-item label="是否显示" prop="display">
        <el-select class="filter-item" v-model="editDetails.display" placeholder="请选择是否显示">
          <el-option label="是" value="1"/>
          <el-option label="否" value="0"/>
        </el-select>
      </el-form-item>

      <el-form-item label="首页推荐" prop="display">
        <el-select class="filter-item" v-model="editDetails.isRecommend" placeholder="请选择首页推荐">
          <el-option label="是" value="1"/>
          <el-option label="否" value="0"/>
        </el-select>
      </el-form-item>

      <el-form-item label="开盘时间" prop="openTime">
        <el-date-picker type="datetime" placeholder="选择日期" v-model="editDetails.openTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="提前交易时间" prop="tradeTime">
        <el-date-picker type="datetime" placeholder="选择日期" v-model="editDetails.tradeTime"></el-date-picker>
      </el-form-item>

      <el-form-item label="排序" prop="sort">
        <el-tooltip effect="dark" content="排序值越大越靠前" placement="top-start">
          <el-input v-model="editDetails.sort"/>
        </el-tooltip>
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
    import { addMarket, updateMarket, getAllCoin } from '@/api/index';
    import { baseImg } from '@/config/env.js';

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
            var valiNumberPass1 = (rule, value, callback) => {//包含小数的数字
                let reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
                if (value === '') {
                    callback(new Error('请输入内容'));
                } else if (!reg.test(value)) {
                    callback(new Error('请输入数字'));
                } else {
                    callback();
                }
            };
            return {
                initFlag: false,
                editDetails: this.initUser(),
                buttonLoading: false,
                isContent: false,
                screenWidth: 0,
                width: this.initWidth(),
                baseImg: baseImg,

                rules: {
                    minerFees: {
                        required: true, message: '请输入数字', trigger: 'blur', validator: valiNumberPass1
                    },
                    buyFees: {
                        required: true, message: '请输入数字', trigger: 'blur', validator: valiNumberPass1
                    },
                    sellFees: {
                        required: true, message: '请输入数字', trigger: 'blur', validator: valiNumberPass1
                    },
                    moneyPoint: { required: true, message: '不能为空', trigger: 'blur' },
                    sellMin: { required: true, message: '不能为空', trigger: 'blur' },
                    buyMin: { required: true, message: '不能为空', trigger: 'blur' },
                    sellPoint: { required: true, message: '不能为空', trigger: 'blur' },
                    buyPoint: { required: true, message: '不能为空', trigger: 'blur' },
                    makerFees: { required: true, message: '不能为空', trigger: 'blur' },
                    googleCode: { required: true, message: '不能为空', trigger: 'blur' },
                    openTime: { required: true, message: '不能为空', trigger: 'change' },
                    tradeTime: { required: true, message: '不能为空', trigger: 'change' },
                    isOpen: { required: true, message: '不能为空', trigger: 'change' },
                    display: { required: true, message: '不能为空', trigger: 'change' },
                    isRecommend: { required: true, message: '不能为空', trigger: 'change' },
                    type: { required: true, message: '不能为空', trigger: 'change' },
                    sellCoinId: { required: true, message: '不能为空', trigger: 'change' },
                    buyCoinId: { required: true, message: '不能为空', trigger: 'change' }
                },
                img: '',
                disabled: false,
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
            }
        },
        components: {},
        created() {
            this.getAllCoin();
        },
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
                    minerFees: '',
                    buyFees: '',
                    sellFees: '',
                    moneyPoint: '',
                    sellMin: '',
                    buyMin: '',
                    googleCode: '',
                    openTime: '',
                    tradeTime: '',
                    isOpen: '',
                    display: '',
                    isRecommend: '',
                    buyPoint: '',
                    sellPoint: '',
                    makerFees: '',
                    type: '',
                    sellCoinId: '',
                    buyCoinId: '',
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
                this.editDetails.isOpen = this.editDetails.isOpen.toString();
                this.editDetails.display = this.editDetails.display.toString();
                this.editDetails.type = this.editDetails.type.toString();
                this.editDetails.isRecommend = this.editDetails.isRecommend.toString();
                this.editDetails.buyCoinId = this.editDetails.buyCoinId.toString();
                this.editDetails.sellCoinId = this.editDetails.sellCoinId.toString();
            },
            close() {
                this.$emit('close');
            },
            submitForm() {
                this.$refs.form.validate((valid) => {
                    this.$store.commit('setGa_code', this.editDetails.googleCode);
                    if (valid) {
                        if (!this.editDetails.id) {
                            addMarket(this.editDetails).then(response => {
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
                            updateMarket(this.editDetails).then(response => {
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
