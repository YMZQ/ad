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

      <el-form-item label="上传照片">
        <el-upload
          action="#"
          list-type="picture-card"
          :before-upload="beforeUpload">
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
        <img v-if="editDetails.img" :src="imgUrl+editDetails.img" alt=""
             style="width: 350px;height: 126px;margin-top: 10px;">
        <p style="font-size: 12px;color: red;">图片尺寸704px*252px</p>
      </el-form-item>

      <el-form-item label="设备名称" prop="deviceType">
        <el-select class="filter-item" v-model="editDetails.deviceType" placeholder="设备类型" filterable>
          <el-option label="全部" value="0"/>
          <el-option label="网页" value="1"/>
          <el-option label="手机" value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="用途名称" prop="categoryType">
        <el-select class="filter-item" v-model="editDetails.categoryType" placeholder="设备类型" filterable>
          <el-option label="轮播图" value="0"/>
          <el-option label="分享APP" value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="语言" prop="language">
        <el-select v-model="editDetails.language" class="filter-item search-item select" filterable
                   placeholder="请选择">
          <el-option
            v-for="item in Methods.langList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="name">
        <el-input v-model="editDetails.name"/>
      </el-form-item>

      <el-form-item label="url地址" prop="address">
        <el-input v-model="editDetails.address"/>
      </el-form-item>

      <el-form-item label="备注">
        <el-input v-model="editDetails.remark" placeholder="分享APP必须填入，为分享时带入的二维码 ；轮播图若不需进行跳转可填入0"/>
      </el-form-item>

      <el-form-item label="排序" prop="orderBy">
        <el-input v-model="editDetails.orderBy"/>
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
    import { addImgs, updataImgs, updataFile, getImgUrl } from '@/api/index';
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
            return {
                initFlag: false,
                editDetails: this.initUser(),
                buttonLoading: false,
                isContent: false,
                screenWidth: 0,
                width: this.initWidth(),
                baseImg: baseImg,
                rules: {
                    googleCode: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    deviceType: { required: true, message: '不能为空', trigger: 'change' },
                    categoryType: { required: true, message: '不能为空', trigger: 'change' },
                    language: { required: true, message: '不能为空', trigger: 'change' },
                    address: { required: true, message: '不能为空', trigger: 'blur' },
                    orderBy: { required: true, message: '不能为空', trigger: 'blur' },
                    name: { required: true, message: '不能为空', trigger: 'blur' }
                },
                imgUrl: '',
                dialogVisibleImg: false,
                disabled: false
            };
        },
        computed: {
            isVisible: {
                get() {
                    if (this.dialogVisible) {
                        this.getImgUrl();
                    }
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
            getImgUrl() {
                getImgUrl().then(response => {
                    this.imgUrl = response.data;
                }).catch(err => {
                });
            },
            beforeUpload(file) {
                let fd = new FormData();
                fd.append('file', file);//传文件
                updataFile(fd).then(response => {
                    this.editDetails.img = response.data;
                }).catch(err => {
                    this.buttonLoading = false;
                });
                return false;  //屏蔽了action的默认上传
            },
            handleRemove(file) {
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisibleImg = true;
            },
            handleDownload(file) {
                console.log(this.dialogImageUrl);
            },
            initUser() {
                return {
                    name: '',
                    address: '',
                    img: '',
                    orderBy: '',
                    remark: '',
                    deviceType: '',
                    categoryType: '',
                    language: '',
                    googleCode: '',
                    type: 2,
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
                this.editDetails.deviceType = this.editDetails.deviceType.toString();
                this.editDetails.categoryType = this.editDetails.categoryType.toString();
                this.editDetails.type = 2;
            },
            close() {
                this.$emit('close');
            },
            submitForm() {
                if (!this.editDetails.img) {
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
                            addImgs(this.editDetails).then(response => {
                                this.isVisible = false;
                                this.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.$emit('success');
                            }).catch(err => {
                                console.log(err);
                                this.buttonLoading = false;
                            });
                        } else {
                            // update
                            updataImgs(this.editDetails).then(response => {
                                this.isVisible = false;
                                this.$message({
                                    message: '更新成功',
                                    type: 'success'
                                });
                                this.$emit('success');
                            }).catch(err => {
                                console.log(err);
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
                this.imgUrl = '';
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
