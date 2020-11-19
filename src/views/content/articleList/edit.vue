<template>
  <div>
    <el-dialog
      :title="title"
      :width="width"
      top="50px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="isVisible"
    >
      <el-form ref="form" :model="editDetails" :rules="rules" label-position="right" label-width="100px">
        <!--        <el-form-item label="类别" prop="categoryName">-->
        <!--          <el-select class="filter-item" v-model="editDetails.categoryName" placeholder="请选择">-->
        <!--            <el-option v-for="item in classList" :key="item.id" :label="item.title" :value="item.id"/>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="标题" prop="title">
          <el-input v-model="editDetails.title"/>
        </el-form-item>
<!--        <el-form-item label="作者" prop="title">-->
<!--          <el-input v-model="editDetails.author"/>-->
<!--        </el-form-item>-->
        <!--      <div @click="isContent = true">富文本</div>-->
        <el-form-item label="内容" prop="contents">
          <!--        <el-input v-model="editDetails.content" v-on:click.native.stop="inputblur"  placeholder="点击输入内容" disabled/>-->
          <Tinymce v-if="dialogVisible " ref="editor" :valueID="editDetails.id" v-model="editDetails.contents" :height="200"/>
        </el-form-item>
        <el-form-item label="排序" prop="orderBy">
          <el-input v-model="editDetails.orderBy"/>
        </el-form-item>
        <el-form-item label="是否推荐" prop="isRecommend">
          <el-select class="filter-item" v-model="editDetails.isRecommend" placeholder="请选择">
            <el-option label="是" value="1"/>
            <el-option label="否" value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item label="语言" prop="language">
          <el-select class="filter-item" v-model="editDetails.language" placeholder="请选择">
            <el-option label="中文" value="cn"/>
            <el-option label="英文" value="en"/>
          </el-select>
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
  </div>
</template>
<script>
    import { addNews, updataNews } from '@/api/index';
    import Tinymce from '@/components/Tinymce';

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
                isRichText: false,
                editDetails: this.initUser(),
                buttonLoading: false,
                isContent: false,
                screenWidth: 0,
                width: this.initWidth(),
                classList: [{ id: 0, title: '新闻公告' }, { id: 1, title: '用户协议' }],
                rules: {
                    googleCode: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    language: { required: true, message: '不能为空', trigger: 'change' },
                    region: { required: true, message: '不能为空', trigger: 'change' },
                    isRecommend: { required: true, message: '不能为空', trigger: 'change' },
                    categoryName: { required: true, message: '不能为空', trigger: 'blur' },
                    title: { required: true, message: '不能为空', trigger: 'blur' },
                    contents: { required: true, message: '不能为空', trigger: 'blur' },
                    orderBy: { required: true, message: '内容不能为空', trigger: 'blur' }
                }
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
            richText: {
                get() {
                    return this.isRichText;
                },
                set() {
                    return this.isRichText = false;
                }
            }
        },
        components: {
            Tinymce
        },
        mounted() {

            window.onresize = () => {
                return (() => {
                    this.width = this.initWidth();
                })();
            };
        },
        created() {
            this.init()
        },
        methods: {
            init() {
                if (!this.editDetails.id) {
                    this.editDetails.contents = '';
                }
            },
            inputblur() {
                this.isRichText = true;
            },
            aclone() {
                this.isContent = false;
            },
            initUser() {
                return {
                    categoryName: '',
                    contents: '',
                    orderBy: '',
                    isRecommend: '',
                    region: '',
                    language: '',
                    googleCode: '',
                    id: ''
                };
            },
            initWidth() {
                this.screenWidth = document.body.clientWidth;
                if (this.screenWidth < 991) {
                    return '80%';
                } else if (this.screenWidth < 1400) {
                    return '75%';
                } else {
                    return '750px';
                }
            },
            setDetails(val) {
                this.editDetails = { ...val };
                this.editDetails.isRecommend = this.editDetails.isRecommend.toString();
            },
            close() {
                this.$emit('close');
            },
            submitForm() {
                this.$refs.form.validate((valid) => {
                    this.$store.commit('setGa_code', this.editDetails.googleCode);
                    if (valid) {
                        if (!this.editDetails.id) {
                            // create
                            addNews(this.editDetails).then(response => {
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
                            updataNews(this.editDetails).then(response => {
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
</style>
