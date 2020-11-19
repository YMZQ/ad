<template>
  <div class="app-container">
    <div class="filter-container" v-if="userInfo.username === 'dev'">
      <el-button class="filter-item" type="warning" plain @click="add">
        添加
      </el-button>
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
      <!--      <el-table-column type="selection" align="center" width="40px"/>-->
      <el-table-column label="名称" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="键" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column label="值" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <i v-hasPermission="['sysConfigAddr:update']" class="el-icon-setting table-operation" style="color: #2db7f5;"
               @click="edit(row)"/>
          </el-tooltip>
          <el-link v-has-no-permission="['sysConfigAddr:update']" class="no-perm">
            无权限
          </el-link>
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
  </div>
</template>

<script>
    import edit from './edit';
    import Pagination from '@/components/page/pagination';
    import { getAddr } from '@/api/index';
    import { mapState } from 'vuex';


    export default {
        components: {
            Pagination,
            edit
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
                selection: []
            };
        },
        computed: {
            ...mapState([
                'userInfo'
            ])
        },
        mounted() {
            this.fetch();
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
                    inputPattern: /^\d{4}$/,
                    inputErrorMessage: 'Google格式为4位数字',
                    type: 'warning'
                }).then(({ value }) => {
                    const ids = [];
                    this.selection.forEach((u) => {
                        ids.push(u.id);
                    });
                    console.log(ids);
                    // this.delete(ids);
                }).catch(() => {
                    this.$refs.table.clearSelection();
                });
            },
            clearSelections() {
            },
            delete(userIds) {
                return false;
                this.loading = true;
                this.$delete(`system/user/${userIds}`).then(() => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.search();
                });
            },
            fetch(params = {}) {
                params.size = this.pagination.limit;
                params.current = this.pagination.page;
                if (this.queryParams.timeRange) {
                    params.createTimeFrom = this.queryParams.timeRange[0];
                    params.createTimeTo = this.queryParams.timeRange[1];
                }
                this.loading = true;
                getAddr(params).then(response => {
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
