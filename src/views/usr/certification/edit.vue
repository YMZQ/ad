<template>
    <el-dialog
      :title="title"
      :width="width"
      top="50px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="isVisible"
    >
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12">
          <div class="view-item">
            <span>国家：</span> {{ editDetails.countryId }}
          </div>
        </el-col>
        <el-col :xs="24" :sm="12">
          <div class="view-item">
            <span>真实名称：</span> {{ editDetails.realName}}
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12">
          <div class="view-item">
            <span>证件类型：</span> {{ editDetails.cardTypeName }}
          </div>
        </el-col>
        <el-col :xs="24" :sm="12">
          <div class="view-item">
            <span>证件号码：</span> {{ editDetails.cardId}}
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="24" :sm="8">
          <el-image
            style="width: 100px; height: 100px"
            :src="url"
            :preview-src-list="srcList">
          </el-image>
        </el-col>
        <el-col :xs="24" :sm="8">
          <el-image
            style="width: 100px; height: 100px"
            :src="url"
            :preview-src-list="srcList">
          </el-image>
        </el-col>
        <el-col :xs="24" :sm="8">
          <el-image
            style="width: 100px; height: 100px"
            :src="url"
            :preview-src-list="srcList">
          </el-image>
        </el-col>
      </el-row>
      <el-form ref="form" :model="editDetails" :rules="rules" label-position="right" label-width="100px">
        <el-form-item label="审核">
          <el-radio-group v-model="editDetails.google">
            <el-radio label="1" >审核通过</el-radio>
            <el-radio label="0" >审核不通过</el-radio>
          </el-radio-group>
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
                    vipLevel: { required: true, message: '不能为空', trigger: 'change' },
                },
                url: 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
                srcList: [
                    'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
                    'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
                ]
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
        components: {
        },
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
                                // this.$message({
                                //     message: '系统错误',
                                //     type: 'error'
                                // });
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
                                // this.$message({
                                //     message: '系统错误',
                                //     type: 'error'
                                // });
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
  .el-row{
    margin: 10px 0;
  }
</style>
