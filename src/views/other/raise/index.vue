<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParams.address" placeholder="用户地址" class="filter-item search-item"/>
      <el-select v-model="queryParams.status" class="filter-item search-item select" clearable filterable
                 placeholder="兑换状态">
        <el-option label="未兑换" value="1"></el-option>
        <el-option label="已兑换" value="2"></el-option>
      </el-select>
      <el-select v-model="queryParams.status" class="filter-item search-item select" clearable filterable
                 placeholder="USDT排序">
        <el-option label="从高到低" value="1"></el-option>
        <el-option label="从低到高" value="2"></el-option>
      </el-select>
      <el-select v-model="queryParams.status" class="filter-item search-item select" clearable filterable
                 placeholder="SRCT排序">
        <el-option label="从高到低" value="1"></el-option>
        <el-option label="从低到高" value="2"></el-option>
      </el-select>
      <el-button class="filter-item" type="primary" plain @click="search">
        搜索
      </el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">
        重置
      </el-button>
      <!--      <el-button class="filter-item" type="info" plain v-has-permission="['user:export']" @click.native="exportExcel">-->
      <!--        导出-->
      <!--      </el-button>-->
    </div>

    <el-table
      ref="table"
      :key="tableKey"
      v-loading="loading"
      :data="list"
      border
      fit
      :default-sort="{prop: 'number',order: 'ascending'}"
      style="width: 100%;"
      @selection-change="onSelectChange"
    >
      <el-table-column label="序号" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.client }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户地址" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column label="快照USDT数"  :show-overflow-tooltip="true"
                       align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排名" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.build }}</span>
        </template>
      </el-table-column>
      <el-table-column label="SRC额度" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否兑换" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="兑换时间" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pagination.total>0" :total="pagination.total" :page.sync="pagination.page"
                :limit.sync="pagination.limit" @pagination="search"/>
    <edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      @success="editSuccess"
      @close="editClose"
    />
    <view-details
      ref="view"
      :dialog-visible="viewVisible"
      @close="viewClose"
    />

  </div>
</template>

<script>
    import edit from './edit';
    import viewDetails from './viewDetails';
    import Pagination from '@/components/page/pagination';
    import { getApp, deleteApp, getNews } from '@/api/index';


    export default {
        name: 'userList',
        components: {
            Pagination,
            edit,
            viewDetails
        },
        filters: {},
        data() {
            return {
                dialog: {
                    isVisible: false,
                    title: ''
                },
                pagination: {
                    total: 0,
                    limit: 20,
                    page: 1
                },
                viewVisible: false,
                tableKey: 0,
                loading: false,
                list: this.Methods.list,
                queryParams: {},
                sort: {},
                selection: []
            };
        },
        computed: {},
        mounted() {
            // this.fetch();
        },
        methods: {
            singleDelete(row) {
                this.$refs.table.toggleRowSelection(row, true);
                this.batchDelete();
            },
            add() {
                this.dialog.title = '添加';
                this.dialog.isVisible = true;
            },
            edit(row) {
                let roleId = [];
                if (row.roleId && typeof row.roleId === 'string') {
                    roleId = row.roleId.split(',');
                    row.roleId = roleId;
                }
                this.$refs.edit.setDetails(row);
                this.dialog.title = '修改';
                this.dialog.isVisible = true;
            },
            view(row) {
                this.$refs.view.setDetails(row);
                this.viewVisible = true;
            },
            viewClose() {
                this.viewVisible = false;
            },
            editClose() {
                this.dialog.isVisible = false;
            },
            editSuccess() {
                this.search();
            },
            onSelectChange(selection) {
                this.selection = selection;
            },
            search() {
                this.fetch({
                    ...this.queryParams,
                    ...this.sort
                });
            },
            reset() {
                this.queryParams = {};
                this.sort = {};
                this.$refs.table.clearSort();
                this.$refs.table.clearFilter();
                this.search();
            },
            batchDelete() {
                if (!this.selection.length) {
                    this.$message({
                        message: '请先选择需要操作的数据',
                        type: 'warning'
                    });
                    return;
                }
                this.$prompt('请输入Google验证码', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^\d{6}$/,
                    inputErrorMessage: 'Google格式为6位数字',
                    type: 'warning'
                }).then(({ value }) => {
                    const ids = [];
                    this.selection.forEach((u) => {
                        ids.push(u.id);
                    });
                    this.delete(ids, value);
                }).catch(() => {
                    this.$refs.table.clearSelection();
                });
            },
            clearSelections() {
            },
            delete(ids, value) {
                this.loading = true;
                this.$store.commit('setGa_code', value);
                deleteApp(ids).then(() => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.search();
                }).catch(() => {
                    this.loading = false;
                });
            },
            fetch(params = {}) {
                this.loading = true;
                getApp(params).then(response => {
                    this.loading = false;
                    this.list = response.data;
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    };
</script>
<style lang="scss" scoped>
  .select {
    width: 150px;
  }
</style>


<!--&lt;!&ndash;<template>&ndash;&gt;-->
<!--&lt;!&ndash;  <el-table&ndash;&gt;-->
<!--&lt;!&ndash;    :data="tableData"&ndash;&gt;-->
<!--&lt;!&ndash;    style="width: 100%"&ndash;&gt;-->
<!--&lt;!&ndash;    :default-sort = "{prop: 'updateTime', order: 'descending'}"&ndash;&gt;-->
<!--&lt;!&ndash;  >&ndash;&gt;-->
<!--&lt;!&ndash;    <el-table-column&ndash;&gt;-->
<!--&lt;!&ndash;      prop="updateTime"&ndash;&gt;-->
<!--&lt;!&ndash;      label="日期"&ndash;&gt;-->
<!--&lt;!&ndash;      sortable&ndash;&gt;-->
<!--&lt;!&ndash;      width="180">&ndash;&gt;-->
<!--&lt;!&ndash;    </el-table-column>&ndash;&gt;-->
<!--&lt;!&ndash;    <el-table-column&ndash;&gt;-->
<!--&lt;!&ndash;      prop="name"&ndash;&gt;-->
<!--&lt;!&ndash;      label="姓名"&ndash;&gt;-->
<!--&lt;!&ndash;      sortable&ndash;&gt;-->
<!--&lt;!&ndash;      width="180">&ndash;&gt;-->
<!--&lt;!&ndash;    </el-table-column>&ndash;&gt;-->
<!--&lt;!&ndash;    <el-table-column&ndash;&gt;-->
<!--&lt;!&ndash;      prop="address"&ndash;&gt;-->
<!--&lt;!&ndash;      label="地址"&ndash;&gt;-->
<!--&lt;!&ndash;      :formatter="formatter">&ndash;&gt;-->
<!--&lt;!&ndash;    </el-table-column>&ndash;&gt;-->
<!--&lt;!&ndash;  </el-table>&ndash;&gt;-->
<!--&lt;!&ndash;</template>&ndash;&gt;-->

<!--&lt;!&ndash;<script>&ndash;&gt;-->
<!--&lt;!&ndash;    export default {&ndash;&gt;-->
<!--&lt;!&ndash;        data() {&ndash;&gt;-->
<!--&lt;!&ndash;            return {&ndash;&gt;-->
<!--&lt;!&ndash;                tableData: this.Methods.list&ndash;&gt;-->
<!--&lt;!&ndash;            }&ndash;&gt;-->
<!--&lt;!&ndash;        },&ndash;&gt;-->
<!--&lt;!&ndash;        methods: {&ndash;&gt;-->
<!--&lt;!&ndash;            formatter(row, column) {&ndash;&gt;-->
<!--&lt;!&ndash;                return row.address;&ndash;&gt;-->
<!--&lt;!&ndash;            }&ndash;&gt;-->
<!--&lt;!&ndash;        }&ndash;&gt;-->
<!--&lt;!&ndash;    }&ndash;&gt;-->
<!--&lt;!&ndash;</script>&ndash;&gt;-->


<!--<template>-->
<!--  <div>-->
<!--    <el-table-->
<!--      ref="multipleTable"-->
<!--      :data="tableData"-->
<!--      tooltip-effect="dark"-->
<!--      style="width: 100%"-->
<!--      @selection-change="handleSelectionChange">-->
<!--      <el-table-column-->
<!--        type="selection"-->
<!--        width="55">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        label="日期"-->
<!--        width="120">-->
<!--        <template slot-scope="scope">{{ scope.row.date }}</template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="name"-->
<!--        label="姓名"-->
<!--        width="120">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="address"-->
<!--        label="地址"-->
<!--        show-overflow-tooltip>-->
<!--      </el-table-column>-->
<!--    </el-table>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--    export default {-->
<!--        data() {-->
<!--            return {-->
<!--                tableData: [{-->
<!--                    date: '2016-05-03',-->
<!--                    name: '王小虎',-->
<!--                    address: '上海市普陀区金沙江路 1518 弄'-->
<!--                }, {-->
<!--                    date: '2016-05-02',-->
<!--                    name: '王小虎',-->
<!--                    address: '上海市普陀区金沙江路 1518 弄'-->
<!--                }, {-->
<!--                    date: '2016-05-04',-->
<!--                    name: '王小虎',-->
<!--                    address: '上海市普陀区金沙江路 1518 弄'-->
<!--                }, {-->
<!--                    date: '2016-05-01',-->
<!--                    name: '王小虎',-->
<!--                    address: '上海市普陀区金沙江路 1518 弄'-->
<!--                }, {-->
<!--                    date: '2016-05-08',-->
<!--                    name: '王小虎',-->
<!--                    address: '上海市普陀区金沙江路 1518 弄'-->
<!--                }, {-->
<!--                    date: '2016-05-06',-->
<!--                    name: '王小虎',-->
<!--                    address: '上海市普陀区金沙江路 1518 弄'-->
<!--                }, {-->
<!--                    date: '2016-05-07',-->
<!--                    name: '王小虎',-->
<!--                    address: '上海市普陀区金沙江路 1518 弄'-->
<!--                }],-->
<!--                multipleSelection: []-->
<!--            };-->
<!--        },-->
<!--        created(){-->
<!--            this.$nextTick(()=>{-->
<!--                this.toggleSelection([this.tableData[1], this.tableData[2]])-->
<!--            })-->
<!--        },-->
<!--        methods: {-->
<!--            toggleSelection(rows) {-->
<!--                if (rows) {-->
<!--                    rows.forEach(row => {-->
<!--                        this.$refs.multipleTable.toggleRowSelection(row);-->
<!--                    });-->
<!--                } else {-->
<!--                    this.$refs.multipleTable.clearSelection();-->
<!--                }-->
<!--            },-->
<!--            handleSelectionChange(val) {-->
<!--                this.multipleSelection = val;-->
<!--            }-->
<!--        },-->
<!--        mounted() {-->


<!--        }-->
<!--    };-->
<!--</script>-->
