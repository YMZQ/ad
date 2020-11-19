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
      <el-form-item label="币种名称" prop="vipLevel">
        <el-select class="filter-item" v-model="editDetails.vipLevel" placeholder="请选择" filterable>
          <el-option label="普通会员" value="1"/>
          <el-option label="市代理" value="2"/>
          <el-option label="市值用户" value="3"/>
          <el-option label="高级会员" value="4"/>
        </el-select>
      </el-form-item>
      <el-form-item label="上传照片" prop="vipLevel">
        <el-upload
          action="#"
          list-type="picture-card"
          :auto-upload="false">
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
          @click="handleDownload(file)"
        >
          <i class="el-icon-download"></i>
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

        <el-dialog :visible.sync="dialogVisibleImg">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>

      <el-form-item label="APP" prop="google">
        <el-input type="textarea" v-model.number="editDetails.google"/>
      </el-form-item>

      <el-form-item label="PC" prop="google">
        <el-input type="textarea" v-model.number="editDetails.google"/>
      </el-form-item>

      <el-form-item label="googleCode" prop="google">
        <el-input v-model.number="editDetails.google"/>
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
