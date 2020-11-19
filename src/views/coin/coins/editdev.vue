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
      <el-form-item label="币种名" prop="name">
        <el-input v-model="editDetails.name"/>
      </el-form-item>
      <el-form-item label="币种图标">
        <el-upload
          :action="uploadAction"
          :headers="headers"
          list-type="picture-card"
          accept = ".jpg,.jpeg,.png.JPG,.JPEG"
          :limit = '2'
          :file-list="fileList"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :on-progress="uploadProgress">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url" alt=""
            >
            <span class="el-upload-list__item-actions">
        <span
          class="el-upload-list__item-preview"
          @click="handlePictureCardPreview(file)"
        >
          <i class="el-icon-zoom-in"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="handleRemove(file)"
        >
          <i class="el-icon-delete"></i>
        </span>
      </span>
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item label="排序" prop="sort" :show-overflow-tooltip="true">
        <el-tooltip effect="dark" content="排序值越大越靠前" placement="top-start">
          <el-input v-model="editDetails.sort"/>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="网关信息" prop="issuer">
        <el-input v-model="editDetails.issuer"/>
      </el-form-item>

      <el-form-item label="是否显示" prop="isDisplay">
        <el-select class="filter-item" v-model="editDetails.isDisplay" placeholder="请选择">
          <el-option label="是" value="1"/>
          <el-option label="否" value="0"/>
        </el-select>
      </el-form-item>

      <el-form-item label="父币种" prop="parentId">
        <el-select class="filter-item" v-model="editDetails.parentId" placeholder="请选择">
          <el-option v-for="item in coinList" v-if="item.name=='SRC'" :label="item.name" :value="String(item.id)"/>
        </el-select>
      </el-form-item>

      <!--      <el-form-item label="父币种">-->
      <!--        <el-input  placeholder="SRC" disabled/>-->
      <!--      </el-form-item>-->

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
    import { addCoin, updateCoin, updataFile, getCoinList } from '@/api/index';
    import { baseImg, issuer } from '@/config/env.js';
    import { getCookie } from '@/utils/storage';
    import { getFileType } from '@/utils';
    import NProgress from 'nprogress'
    import 'nprogress/nprogress.css'

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
                baseImg: baseImg,
                issuer: issuer,
                coinList: [],
                rules: {
                    googleCode: { required: true, message: '不能为空', trigger: 'blur' },
                    sort: { required: true, message: '不能为空', trigger: 'change' },
                    issuer: { required: true, message: '不能为空', trigger: 'blur' },
                    isDisplay: { required: true, message: '不能为空', trigger: 'blur' },
                    parentId: { required: true, message: '不能为空', trigger: 'change' },
                    name: { required: true, message: '不能为空', trigger: 'blur' }
                },
                img: '',
                dialogVisibleImg: false,
                disabled: false,
                uploadAction:`/admin/admin/file`,
                headers: {
                    Authorization: `${getCookie('token')}`
                },
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
            this.getCoinList();
        },
        mounted() {
            window.onresize = () => {
                return (() => {
                    this.width = this.initWidth();
                })();
            };
        },
        methods: {
            uploadError() {
                this.$message({
                    message: '上传失败',
                    type: 'error'
                })
                NProgress.done()
            },
            uploadSuccess(response) {
                this.editDetails.icon = response.data
                console.log(response.data)
                NProgress.done()
            },
            uploadProgress() {
                NProgress.start()
            },

            getCoinList() {
                getCoinList().then(response => {
                    this.coinList = response.data.records;
                }).catch(err => {
                    console.log(err);
                });
            },
            handleRemove(file, fileList) {
                console.log(file);
                console.log(fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisibleImg = true;
            },


            initUser() {
                return {
                    name: '',
                    sort: '',
                    issuer: this.issuer,
                    isDisplay: '',
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
                this.editDetails.parentId = this.editDetails.parentId.toString();
                this.editDetails.isDisplay = this.editDetails.isDisplay.toString();
                if (!this.editDetails.issuer) {
                    this.editDetails.issuer = this.issuer;
                }
            },
            close() {
                this.$emit('close');
            },
            submitForm() {
                if (!this.editDetails.icon) {
                    this.$message({
                        message: '请上传图片',
                        type: 'error'
                    });
                    return false;
                }
                this.$refs.form.validate((valid) => {
                    this.$store.commit('setGa_code', this.editDetails.googleCode);
                    if (valid) {
                        if (!this.editDetails.id) {
                            addCoin(this.editDetails).then(response => {
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
                            updateCoin(this.editDetails).then(response => {
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
