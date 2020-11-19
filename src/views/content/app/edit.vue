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
      <el-form-item label="APP类型" prop="client">
        <el-select v-model="editDetails.client" class="filter-item search-item select" clearable filterable
                   placeholder="请选择">
          <el-option label="android" value="android"></el-option>
          <el-option label="ios" value="ios"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="版本号" prop="version">
        <el-input v-model="editDetails.version"/>
      </el-form-item>
      <el-form-item label="内部版本号" prop="build">
        <el-input v-model="editDetails.build"/>
      </el-form-item>
      <el-form-item label="下载地址" prop="downloadUrl">
        <el-input v-model="editDetails.downloadUrl"/>
      </el-form-item>
      <el-form-item label="下载地址" prop="url">
        <el-input type="textarea" v-model="editDetails.url"/>
      </el-form-item>
      <el-form-item label="更新描述(中文)">
        <el-input type="textarea" v-model="editDetails.description"/>
      </el-form-item>
      <el-form-item label="更新描述(英文)">
        <el-input type="textarea" v-model="editDetails.enDescription"/>
      </el-form-item>
      <el-form-item label="更新叙述时间" prop="updateTime">
        <el-date-picker type="datetime" placeholder="选择日期" v-model="editDetails.updateTime" value-format="timestamp"></el-date-picker>
      </el-form-item>
      <el-form-item label="是否提醒下载" prop="remind">
        <el-select v-model="editDetails.remind" class="filter-item search-item select" clearable filterable
                   placeholder="请选择">
          <el-option
            v-for="item in Methods.displayType"
            :key="item.id"
            :label="item.type"
            :value="item.id">
          </el-option>
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
    import { addApp, updataApp } from '@/api/index';

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
                    version: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    build: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    downloadUrl: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    url: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    googleCode: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    remind: { required: true, message: '不能为空', trigger: 'change' },
                    client: { required: true, message: '不能为空', trigger: 'change' },
                    updateTime: { required: true, message: '不能为空', trigger: 'change' }
                },
                dialogImageUrl: '',
                dialogVisibleImg: false,
                disabled: false
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
            handleRemove(file) {
                console.log(file);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisibleImg = true;
            },
            handleDownload(file) {
                console.log(file);
                console.log(this.dialogImageUrl);
            },
            initUser() {
                return {
                    client: '',
                    version: '',
                    build: '',
                    url: '',
                    description: '',
                    enDescription: '',
                    remind: '',
                    updateTime: '',
                    downloadUrl: '',
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
                    this.$store.commit('setGa_code', this.editDetails.googleCode);
                    if (valid) {
                        this.$store.commit('setGa_code', this.editDetails.googleCode);
                        if (!this.editDetails.id) {
                            // create
                            addApp(this.editDetails).then(response => {
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
                            updataApp(this.editDetails).then(response => {
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
