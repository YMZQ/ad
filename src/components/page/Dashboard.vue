<template>
    <div>
        <el-row :gutter="20">
            <el-col  :xs="24" :sm="24" :md="8" :lg="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="@/assets/img/adminIcon.jpeg" class="user-avator" alt/>
                        <div class="user-info-cont">
                            <div class="user-info-name">{{userInfo.username}}</div>
                            <div>管理员</div>
                        </div>
                    </div>
<!--                    <div class="user-info-list">-->
<!--                        上次登录时间：-->
<!--                        <span>{{userInfo.created_at}}</span>-->
<!--                    </div>-->
<!--                    <div class="user-info-list">-->
<!--                        登录地址:-->
<!--&lt;!&ndash;                        <span>{{userInfo.loginAddress.Country}}{{userInfo.loginAddress.City}}{{userInfo.loginAddress.Province}}{{userInfo.loginAddress.Isp}}</span>&ndash;&gt;-->
<!--                    </div>-->
                </el-card>
<!--                <el-card shadow="hover" style="height:252px;">-->
<!--                    <div slot="header" class="clearfix">-->
<!--                        <span>语言详情</span>-->
<!--                    </div>-->
<!--                    Vue-->
<!--                    <el-progress :percentage="71.3" color="#42b983"></el-progress>-->
<!--                    JavaScript-->
<!--                    <el-progress :percentage="24.1" color="#f1e05a"></el-progress>-->
<!--                    CSS-->
<!--                    <el-progress :percentage="13.7"></el-progress>-->
<!--                    HTML-->
<!--                    <el-progress :percentage="5.9" color="#f56c6c"></el-progress>-->
<!--                </el-card>-->
            </el-col>
<!--            <el-col   :xs="24" :sm="24" :md="16" :lg="16">-->
<!--                <el-row :gutter="20" class="mgb20">-->
<!--                    <el-col  :xs="24" :sm="24" :md="8" :lg="8">-->
<!--                        <el-card shadow="hover" :body-style="{padding: '0px'}">-->
<!--                            <div class="grid-content grid-con-1">-->
<!--                                <i class="el-icon-lx-people grid-con-icon"></i>-->
<!--                                <div class="grid-cont-right">-->
<!--                                    <div class="grid-num">1234</div>-->
<!--                                    <div>用户访问量</div>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </el-card>-->
<!--                    </el-col>-->
<!--                    <el-col  :xs="24" :sm="24" :md="8" :lg="8">-->
<!--                        <el-card shadow="hover" :body-style="{padding: '0px'}">-->
<!--                            <div class="grid-content grid-con-2">-->
<!--                                <i class="el-icon-lx-notice grid-con-icon"></i>-->
<!--                                <div class="grid-cont-right">-->
<!--                                    <div class="grid-num">321</div>-->
<!--                                    <div>系统消息</div>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </el-card>-->
<!--                    </el-col>-->
<!--                    <el-col  :xs="24" :sm="24" :md="8" :lg="8">-->
<!--                        <el-card shadow="hover" :body-style="{padding: '0px'}">-->
<!--                            <div class="grid-content grid-con-3">-->
<!--                                <i class="el-icon-lx-goods grid-con-icon"></i>-->
<!--                                <div class="grid-cont-right">-->
<!--                                    <div class="grid-num">5000</div>-->
<!--                                    <div>数量</div>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </el-card>-->
<!--                    </el-col>-->
<!--                </el-row>-->
<!--                <el-card shadow="hover" style="height:403px;">-->
<!--                    <div slot="header" class="clearfix">-->
<!--                        <span>待办事项</span>-->
<!--                        <el-button style="float: right; padding: 3px 0" @click="showAddTodo=true" type="text">添加-->
<!--                        </el-button>-->
<!--                    </div>-->
<!--                    <el-table :show-header="false" :data="todoList" style="width:100%;">-->
<!--                        <el-table-column width="40">-->
<!--                            <template slot-scope="scope">-->
<!--                                <el-checkbox v-model="scope.row.status" @change="changeStatus(scope.row.id,scope.row.status,scope.$index)"></el-checkbox>-->
<!--                            </template>-->
<!--                        </el-table-column>-->
<!--                        <el-table-column>-->
<!--                            <template slot-scope="scope">-->
<!--                                <div class="todo-item"-->
<!--                                     :class="{'todo-item-del': scope.row.status}"-->
<!--                                >{{scope.row.title}}-->
<!--                                </div>-->
<!--                            </template>-->
<!--                        </el-table-column>-->
<!--                        <el-table-column width="60">-->
<!--                            <template slot-scope="scope">-->
<!--                                <i style="margin-right: 10px;" @click="toEditSchedule(scope.row.id)"-->
<!--                                   class="el-icon-edit"></i>-->
<!--                                <i class="el-icon-delete" @click="deleteOne(scope.row.id,scope.$index)"></i>-->
<!--                            </template>-->
<!--                        </el-table-column>-->
<!--                    </el-table>-->
<!--                </el-card>-->
<!--            </el-col>-->
        </el-row>
<!--        <el-row :gutter="20">-->
<!--            <el-col :xs="24" :sm="24" :md="12" :lg="12">-->
<!--                <el-card shadow="hover">-->
<!--                    <schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>-->
<!--                </el-card>-->
<!--            </el-col>-->
<!--            <el-col :xs="24" :sm="24" :md="12" :lg="12">-->
<!--                <el-card shadow="hover">-->
<!--                    <schart ref="line" class="schart" canvasId="line" :options="options2"></schart>-->
<!--                </el-card>-->
<!--            </el-col>-->
<!--        </el-row>-->

<!--        <el-dialog title="添加待办事项" :visible.sync="showAddTodo"-->
<!--                   width="30%">-->
<!--            <el-form :model="addTodoForm" :rules="addTodoRules" ref="addTodoForm" label-width="80px" label="top">-->
<!--                <el-form-item label="标题" prop="title">-->
<!--                    <el-input v-model="addTodoForm.title" placeholder="请输入待办标题" autocomplete="on"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="描述" prop="content">-->
<!--                    <el-input type="textarea" placeholder="请输入描述" maxlength="300"-->
<!--                              rows="4" show-word-limit v-model="addTodoForm.content"></el-input>-->
<!--                </el-form-item>-->
<!--            </el-form>-->
<!--            <span slot="footer" class="dialog-footer">-->
<!--                    <el-button :loading="loading" type="primary"-->
<!--                               @click="addTodoSubmit('addTodoForm','showAddTodo')">确 定</el-button>-->
<!--                    <el-button @click="resetForm('addTodoForm','showAddTodo')">取 消</el-button>-->
<!--                </span>-->
<!--        </el-dialog>-->
<!--        <el-dialog title="编辑待办事项" :visible.sync="showEditTodo"-->
<!--                   width="30%">-->
<!--            <el-form :model="editTodoForm" :rules="editTodoRules" ref="editTodoForm" label-width="80px" label="top">-->
<!--                <el-form-item label="标题" prop="title">-->
<!--                    <el-input v-model="editTodoForm.title" placeholder="请输入待办标题" autocomplete="on"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="描述" prop="content">-->
<!--                    <el-input type="textarea" placeholder="请输入描述" maxlength="300"-->
<!--                              rows="4" show-word-limit v-model="editTodoForm.content"></el-input>-->
<!--                </el-form-item>-->
<!--            </el-form>-->
<!--            <span slot="footer" class="dialog-footer">-->
<!--                    <el-button :loading="loading" type="primary" @click="editTodoSubmit('editTodoForm','showEditTodo')">确 定</el-button>-->
<!--                    <el-button @click="resetForm('editTodoForm','showEditTodo')">取 消</el-button>-->
<!--                </span>-->
<!--        </el-dialog>-->
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import { mapState } from 'vuex';
    // import { getSchedule, setSchedule, getOneSchedule, updateOneSchedule,deleteOneSchedule } from '@/api/index';
    import bus from '../common/bus';

    export default {
        name: 'dashboard',
        data() {
            return {
                loading: false,
                //待办事项
                showAddTodo: false,
                showEditTodo: false,
                todoList: [],
                editTodoId: null,
                addTodoForm: {
                    title: '',
                    content: ''
                },
                editTodoForm: {
                    title: '',
                    content: ''
                },
                addTodoRules: {
                    title: [
                        { required: true, message: '请输入待办标题', trigger: 'blur' },
                        { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                    ],
                    content: [
                        { required: false, message: '请选择活动区域', trigger: 'change' }
                    ]
                },
                editTodoRules: {
                    title: [
                        { required: true, message: '请输入待办标题', trigger: 'blur' },
                        { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                    ],
                    content: [
                        { required: false, message: '请选择活动区域', trigger: 'change' }
                    ]
                },
                data: [
                    {
                        name: '2018/09/04',
                        value: 1083
                    },
                    {
                        name: '2018/09/05',
                        value: 941
                    },
                    {
                        name: '2018/09/06',
                        value: 1139
                    },
                    {
                        name: '2018/09/07',
                        value: 816
                    },
                    {
                        name: '2018/09/08',
                        value: 327
                    },
                    {
                        name: '2018/09/09',
                        value: 228
                    },
                    {
                        name: '2018/09/10',
                        value: 1065
                    }
                ],
                options: {
                    type: 'bar',
                    title: {
                        text: '最近一周各品类销售图'
                    },
                    xRorate: 25,
                    labels: ['周一', '周二', '周三', '周四', '周五'],
                    datasets: [
                        {
                            label: '家电',
                            data: [234, 278, 270, 190, 230]
                        },
                        {
                            label: '百货',
                            data: [164, 178, 190, 135, 160]
                        },
                        {
                            label: '食品',
                            data: [144, 198, 150, 235, 120]
                        }
                    ]
                },
                options2: {
                    type: 'line',
                    title: {
                        text: 'OTC交易量'
                    },
                    labels: ['6月', '7月', '8月', '9月', '10月'],
                    datasets: [
                        {
                            label: 'BTC',
                            data: [23400, 2780, 2700, 1900, 23000]
                        },
                        {
                            label: 'USDT',
                            data: [1640, 17800, 150000, 13500, 16000]
                        },
                        {
                            label: 'ETH',
                            data: [74, 118, 200, 235, 90]
                        }
                    ]
                }
            };
        },
        components: {
            Schart
        },
        computed: {
            ...mapState([
                'userInfo'
            ])
        },
        create(){
        },
        mounted() {
            // this.getTodoList();
        },
        methods: {
            //待办事项
            resetForm(formName, showDialog) {
                this.$refs[formName].resetFields();
                this[showDialog] = false;
            },
            changeStatus(id,status,index){
                if (status){
                    status=1
                }else {
                    status=0
                }
                updateOneSchedule(id, {status}).then(res => {
                    if (res.code == 0) {
                        this.todoList[index].status=!status;
                    }
                }).catch(err => {
                    this.loading = false;
                });
            },
            addTodoSubmit(formName, showDialog) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        setSchedule(this.addTodoForm).then(res => {
                            this.loading = false;
                            if (res.code != 0) {
                                this.$refs[formName].resetFields();
                                res.data.status = 0;
                                this.todoList.unshift(res.data);
                                this[showDialog] = false;
                            }
                        }).catch(err => {
                            this.loading = false;
                        });
                    } else {
                        this.loading = false;
                        return false;
                    }
                });
            },
            editTodoSubmit(formName, showDialog) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        updateOneSchedule(this.editTodoId, this.editTodoForm).then(res => {
                            this.loading = false;
                            if (res.code != 0) {
                                this.$refs[formName].resetFields();
                                this[showDialog] = false;
                                this.getTodoList();
                                this.$message.success(res.msg);
                            }
                        }).catch(err => {
                            this.loading = false;
                        });
                    } else {
                        this.loading = false;
                        return false;
                    }
                });
            },
            // async toEditSchedule(id) {
            //     this.editTodoId = id;
            //     let res = await getOneSchedule(id);
            //     if (res.code == 1) {
            //         let { title, content } = res.data;
            //         this.editTodoForm = { title, content };
            //         this.showEditTodo = true;
            //     }
            //
            // },
            // changeDate() {
            //     const now = new Date().getTime();
            //     this.data.forEach((item, index) => {
            //         const date = new Date(now - (6 - index) * 86400000);
            //         item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            //     });
            // },
            // async getTodoList() {
            //     let res = await getSchedule({ page: 1, size: 7 });
            //     if (res.code == 1) {
            //         this.todoList=  res.data.map((value, index, array) => {
            //             let val={};
            //             Object.assign(val,value);
            //           if (value.status==1){
            //                 val.status=true
            //             }else {
            //                 val.status=false
            //             }
            //           return val;
            //         })
            //     }
            // },
            // async deleteOne(id,index) {
            //     this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            //         cancelButtonText: '取消',
            //         confirmButtonText: '确定',
            //         type: 'warning'
            //     }).then(() => {
            //         deleteOneSchedule(id).then(res=>{
            //             if (res.code!=0){
            //                 this.getTodoList();
            //                 this.$message({
            //                     type: 'success',
            //                     message: '删除成功!'
            //                 });
            //             }
            //         })
            //
            //     }).catch(() => {
            //     });
            // }
        }
    };
</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }
</style>
