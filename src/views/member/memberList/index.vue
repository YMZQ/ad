<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParams.address" placeholder="用户地址" class="filter-item search-item"/>
      <el-input v-model="queryParams.walletAddress" placeholder="ERC20地址" class="filter-item search-item"/>
      <el-date-picker type="datetime" placeholder="开始时间" class="filter-item search-item "
                      style="margin-right: 10px;width: 190px;" v-model="queryParams.beginTime"
                      value-format="timestamp"></el-date-picker>
      <el-date-picker type="datetime" placeholder="结束时间" class="filter-item search-item "
                      style="margin-right: 10px;width: 190px;" v-model="queryParams.endTime "
                      value-format="timestamp"></el-date-picker>
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
      style="width: 100%;"
      @selection-change="onSelectChange"
    >
      <el-table-column label="序号" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户地址" align="center" min-width="120px">
        <template slot-scope="scope">
          <el-tooltip content="点击即可复制内容" placement="top">
          <span v-clipboard:copy="scope.row.address"
                v-clipboard:success="copy">{{ scope.row.address}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="ERC20地址" align="center" min-width="100px">
        <template slot-scope="scope">
          <el-tooltip content="点击即可复制内容" placement="top">
          <span v-clipboard:copy="scope.row.walletAddress"
                v-clipboard:success="copy">{{ scope.row.walletAddress}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="激活时间" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="是否激活" :show-overflow-tooltip="true" align="center" min-width="80px">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ scope.row.url }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="当前IP" :show-overflow-tooltip="true" align="center" min-width="200px">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ scope.row.url }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="设备型号" :show-overflow-tooltip="true" align="center" min-width="200px">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ scope.row.url }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="上级地址" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.parentAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下级地址数量" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span @click="view(scope.row,2)">{{ scope.row.subCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="激活邀请数量" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="钱包余额" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span @click="view(scope.row,1)">余额详情</span>
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
    <view-details v-show="viewVisible"
      ref="view"
      :type='typeT'
      :dialog-visible="viewVisible"
      @close="viewClose"
    />

  </div>
</template>

<script>
    import edit from './edit';
    import viewDetails from './viewDetails';
    import Pagination from '@/components/page/pagination';
    import { getAsset } from '@/api/index';


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
                list: [],
                queryParams: {},
                sort: {},
                selection: [],
                type: 0
            };
        },

        computed: {
            typeT(){
                return this.type
            }
        },
        mounted() {
            this.fetch();
        },
        methods: {
            copy(e) {
                this.$message({
                    message: '复制成功',
                    type: 'success'
                });
            },
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
            view(row, type) {
                this.type = type;
                if (this.type) {
                    this.$refs.view.setDetails(row);
                    this.viewVisible = true;
                }
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
                // this.loading = true;
                // this.$store.commit('setGa_code', value);
                // deleteApp(ids).then(() => {
                //     this.$message({
                //         message: '删除成功',
                //         type: 'success'
                //     });
                //     this.search();
                // }).catch(() => {
                //     this.loading = false;
                // });
            },
            fetch(params = {}) {
                params.size = this.pagination.limit;
                params.current = this.pagination.page;
                this.loading = true;
                getAsset(params).then(response => {
                    this.loading = false;
                    this.list = response.data.records;
                    this.pagination.total = response.data.total;
                    this.pagination.page = response.data.current;
                    this.pagination.limit = response.data.size;
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
