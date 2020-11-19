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

      <el-form-item label="币种" prop="coin">
        <el-select class="filter-item" v-model="editDetails.coin" placeholder="请选择卖方币">
          <el-option v-for="item in coinList" :label="item.name" :value="String(item.name)"/>
        </el-select>
      </el-form-item>

      <el-form-item label="转账列表">
        <div style="display: flex;justify-content: space-between;">
          <el-upload
            ref="upload"
            action="#"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :file-list="fileList"
            :auto-upload="false"
            accept=".xlsx">
            <el-button slot="trigger" type="success" plain><i class="el-icon-upload2"></i>{{fileList.length==0?'选取文件':'重新上传'}}
            </el-button>
            <span class="repeat" v-if="repeat!=0">{{repeat==1?'检查到列表中有重复地址':'未检测到转账信息'}}</span>
          </el-upload>
          <el-button style="height: 35px" type="primary" plain><i class="el-icon-download"></i><a
            href="https://super-radar.oss-cn-hongkong.aliyuncs.com/table/%E6%89%B9%E9%87%8F%E8%BD%AC%E8%B4%A6%E7%A4%BA%E4%BE%8B%E6%A8%A1%E6%9D%BF%E3%80%90%E7%A6%81%E6%AD%A2%E5%A4%96%E4%BC%A0%E3%80%91.xlsx">模板下载</a>
          </el-button>
        </div>
      </el-form-item>

      <el-form-item>
        <div>
          <span style="margin-right: 10px">总金额: {{amount}}</span>
          <span>总条数: {{number}}</span>
        </div>
      </el-form-item>
      <el-form-item label="转账地址" prop="transferAddress">
        <el-input v-model="editDetails.transferAddress" placeholder="请输入地址并确保该地址有足量币种及矿工费"/>
      </el-form-item>

      <el-form-item label="私钥" prop="encryptKey">
        <el-input v-model="editDetails.encryptKey"/>
      </el-form-item>

      <el-form-item label="备注">
        <el-input v-model="editDetails.remark"/>
      </el-form-item>

      <el-form-item label="googleCode" prop="googleCode">
        <el-input v-model.number="editDetails.googleCode"/>
      </el-form-item>
    </el-form>
    <p class="red">1、新增成功后即刻开始转账，时间与列表长度成正比，建议条数不大于10000条；</p>
    <p class="red">2、请依据示例上传列表，若格式不对/地址错误/用户未信任该网关将可能失败；</p>
    <p class="red">3、需时间才能完成发放，请避免在短时间内多次重复发起大批量转账；</p>
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
    import { importAir, getAllCoin, addGetAirToken } from '@/api/index';

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
                    coin: { required: true, message: '不能为空', trigger: 'change' },
                    transferAddress: { required: true, message: '不能为空', trigger: 'blur' },
                    number: { required: true, message: '不能为空', trigger: 'blur' },
                    encryptKey: { required: true, message: '不能为空', trigger: 'blur' }
                },
                coinList: [],
                fileList: [],
                file: '',
                amount: null,
                number: null,
                repeat: 0
            };
        },
        computed: {
            isVisible: {
                get() {
                    if (this.dialogVisible) {
                        this.addGetAirToken();
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
            handleChange(file, fileList) {
                this.editDetails.number = '';
                this.repeat = 0;
                this.importfxx(file.raw);
                if (fileList.length > 0) {
                    this.fileList = [fileList[fileList.length - 1]];  // 这一步，是 展示最后一次选择的csv文件
                }
                this.editDetails.file = this.fileList[0].raw;
            },
            handleRemove(file, fileList) {
                this.editDetails.number = '';
                this.repeat = 0;
                this.fileList = fileList;
            },
            handlePreview(file) {
                console.log(file);
            },
            importfxx(obj) {
                let _this = this;
                this.file = event.currentTarget.files[0];
                var rABS = false; //是否将文件读取为二进制字符串
                var f = this.file;

                var reader = new FileReader();
                //if (!FileReader.prototype.readAsBinaryString) {
                FileReader.prototype.readAsBinaryString = function(f) {
                    var binary = '';
                    var rABS = false; //是否将文件读取为二进制字符串
                    var pt = this;
                    var wb; //读取完成的数据
                    var outdata;
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var bytes = new Uint8Array(reader.result);
                        var length = bytes.byteLength;
                        for (var i = 0; i < length; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        //此处引入，用于解析excel
                        var XLSX = require('xlsx');
                        if (rABS) {
                            wb = XLSX.read(btoa(fixdata(binary)), {
                                //手动转化
                                type: 'base64'
                            });
                        } else {
                            wb = XLSX.read(binary, {
                                type: 'binary'
                            });
                        }
                        outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
                        //outdata就是读取的数据（不包含标题行即表头，表头会作为对象的下标）
                        //此处可对数据进行处理
                        // let arr = outdata;
                        // outdata.map(v => {
                        //     console.log(v['用户地址'])
                        //
                        // let obj = {}
                        // obj.code = v['Code']
                        // obj.name = v['Name']
                        // obj.pro = v['province']
                        // obj.cit = v['city']
                        // obj.dis = v['district']
                        // arr.push(obj)
                        // });
                        // _this.da=arr;
                        // _this.dalen=arr.length;
                        // return arr;
                        if (outdata.length) {
                            for (let i = 0; i < outdata.length - 1; i++) {
                                for (let j = i + 1; j < outdata.length; j++) {
                                    if (outdata[i]['用户地址'] === outdata[j]['用户地址']) {
                                        // let item ={address:outdata[i]['用户地址'] ,id:i}
                                        // arr.push(item)
                                        _this.repeat = 1;
                                        break;
                                    }
                                }
                            }
                        } else {
                            _this.repeat = 2;
                        }
                        let amount = 0;
                        outdata.map(v => {
                            amount += v['数量'];
                        });
                        console.log(amount)
                        _this.amount = _this.getFloat(amount, 6);
                        _this.number = outdata.length;
                    };
                    reader.readAsArrayBuffer(f);
                };
                if (rABS) {
                    reader.readAsArrayBuffer(f);
                } else {
                    reader.readAsBinaryString(f);
                }
            },
            getFloat(number, n) {
                n = n ? parseInt(n) : 0;
                if (n <= 0) {
                    return Math.round(number);
                }
                number = Math.round(number * Math.pow(10, n)) / Math.pow(10, n); //四舍五入
                number = Number(number).toFixed(n); //补足位数
                return number;
            },
            getAllCoin() {
                getAllCoin().then(response => {
                    this.coinList = response.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            addGetAirToken() {
                addGetAirToken().then(response => {
                    this.editDetails.groupId = response.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            initUser() {
                return {
                    coin: '',
                    remark: '',
                    transferAddress: '',
                    groupId: '',
                    number: '',
                    file: this.file
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
                        this.buttonLoading = true;
                        this.$store.commit('setGa_code', this.editDetails.googleCode);
                        let fd = new FormData();
                        fd.append('file', this.editDetails.file);
                        fd.append('coin', this.editDetails.coin);
                        fd.append('remark', this.editDetails.remark);
                        fd.append('groupId', this.editDetails.groupId);
                        fd.append('encryptKey', this.editDetails.encryptKey);
                        fd.append('transferAddress', this.editDetails.transferAddress);
                        importAir(fd).then(response => {
                            this.isVisible = false;
                            this.buttonLoading = false;
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            });
                            this.$emit('success');
                        }).catch(err => {
                            this.addGetAirToken();
                            this.buttonLoading = false;
                        });
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
                this.fileList = [];
                this.editDetails.file = '';
                this.repeat = 0;
                this.number = 0;
                this.amount = 0;
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

  /deep/ .el-upload--text {
    width: 230px !important;
    height: 35px !important;
    border: none;
    text-align: left;
    padding-left: 1px;
  }

  /deep/ .el-upload-list__item-name {
    margin-right: 20px;
    /*position: absolute;*/
  }

  .repeat {
    color: #F56C6C;
    position: absolute;
    right: 10px;
    bottom: 0;

  }

  .red {
    color: #F56C6C;
    padding-left: 20px;
  }
</style>
