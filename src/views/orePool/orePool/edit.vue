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
        <el-col :span="12">
          <el-form-item label="发放币种" prop="coinId">
            <el-select class="filter-item" v-model="editDetails.coinId" placeholder="请选择发放币种" filterable
                       :disabled="editDetails.id?true:false">
              <el-option v-for="item in coinList" :label="item.name" :value="String(item.id)"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="sort" :show-overflow-tooltip="true">
            <el-tooltip effect="dark" content="排序值越大越靠前" placement="top-start">
              <el-input v-model="editDetails.sort"/>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="挖矿类型" prop="oreType">
            <el-select class="filter-item" v-model="editDetails.oreType" placeholder="请选择">
              <el-option label="母币" value="0"/>
              <el-option label="母币 + 子币" value="1"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="母币SRC最低持币" label-width="140px">
            <el-input v-model="minHold" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="最低持币数量" prop="minHold">
            <el-input v-model="editDetails.minHold"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-show="editDetails.oreType==1">
          <el-form-item label="子币比例" :prop="editDetails.oreType==1?'holdPercent':''" label-width="140px">
            <el-input v-model="editDetails.holdPercent"/>
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item label="状态" prop="status">
            <el-select class="filter-item" v-model="editDetails.status" placeholder="请选择">
              <el-option label="分红" value="1"/>
              <el-option label="暂停" value="0"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="15">

          <el-form-item label="是否显示" prop="display">
            <el-select class="filter-item" v-model="editDetails.display" placeholder="请选择">
              <el-option label="显示" value="1"/>
              <el-option label="不显示" value="0"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item label="每日挖矿数量" prop="miningAmount">
            <el-input v-model="editDetails.miningAmount"/>
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item label="发放时间" prop="sendTime">
            <el-time-picker type="time" placeholder="选择时间" v-model="editDetails.sendTime" value-format='HH:mm:ss'
                            format='HH:mm:ss'></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item label="googleCode" prop="googleCode">
            <el-input v-model="editDetails.googleCode"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <p class="red">1、币种不可更改，一个币种不可设置多个矿池！</p>
    <p class="red">2、挖矿类型为母币，则仅计算持有最低母币SRC的持有者/推广者获得收益；</p>
    <p class="red">3、挖矿类型为母币+子币，则子币比例的挖矿总量将发放给持有最低持子币数量的子币持有者/推广者，剩余挖矿总量将发放给持有最低母币及子币的持有者/推广者；</p>
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
    import { addOreConfig, updateOreConfig, getAllCoin, getOreConfig } from '@/api/index';

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
                    googleCode: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    miningAmount: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    holdPercent: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    sort: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    minHold: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    coinId: { required: true, message: '不能为空', trigger: 'change' },
                    status: { required: true, message: '不能为空', trigger: 'change' },
                    display: { required: true, message: '不能为空', trigger: 'change' },
                    startTime: { required: true, message: '不能为空', trigger: 'change' },
                    oreType: { required: true, message: '不能为空', trigger: 'change' },
                    sendTime: { required: true, message: '不能为空', trigger: 'change' }
                },
                dialogImageUrl: '',
                dialogVisibleImg: false,
                disabled: false,
                coinList: [],
                minHold: 0
            };
        },
        computed: {
            isVisible: {
                get() {
                    if(this.dialogVisible){
                        this.fetch();

                        this.getAllCoin();
                    }
                    return this.dialogVisible;
                },
                set() {
                    this.close();
                    this.reset();
                }
            }
        },
        created() {
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
                    coinId: '',
                    oreType: '',
                    status: '',
                    display: '',
                    minHold: '',
                    holdPercent: '',
                    miningAmount: '',
                    sendTime: '',
                    sort: '',
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
                this.editDetails.oreType = this.editDetails.oreType.toString();
            },
            getUTCTime: function(str) {
                var str = new Date(str);
                var utc = str.getTime();
                return utc;
            },
            close() {
                this.$emit('close');
            },
            fetch() {
                getOreConfig({ coinName: 'SRC' }).then(response => {
                    this.minHold = response.data.records[0].minHold;
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
                            addOreConfig(this.editDetails).then(response => {
                                this.isVisible = false;
                                this.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.$emit('success');
                            }).catch(err => {});
                        } else {
                            // update
                            updateOreConfig(this.editDetails).then(response => {
                                this.isVisible = false;
                                this.$message({
                                    message: '更新成功',
                                    type: 'success'
                                });
                                this.$emit('success');
                            }).catch(err => {});
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
  .red {
    color: #F56C6C;
    padding-left: 20px;
  }
</style>
