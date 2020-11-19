<template xmlns:v-VueClipboard="http://www.w3.org/1999/xhtml">
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="queryParams.address" placeholder="用户ID" class="filter-item search-item"/>
      <el-input v-model.trim="queryParams.toAddress" placeholder="提现地址" class="filter-item search-item"/>
      <!--      <el-input v-model="queryParams.name" placeholder="交易hash" class="filter-item search-item"/>-->
      <!--      <el-select v-model="queryParams.isRecommend" class="filter-item search-item select" clearable filterable-->
      <!--                 placeholder="币种">-->
      <!--        <el-option-->
      <!--          v-for="item in Methods.coinList"-->
      <!--          :key="item.id"-->
      <!--          :label="Methods.Capitalization(item.name)"-->
      <!--          :value="item.id">-->
      <!--        </el-option>-->
      <!--      </el-select>-->
      <!--      <el-date-picker type="datetime" placeholder="开始时间" class="filter-item search-item "-->
      <!--                      style="margin-right: 10px;width: 190px;" v-model="queryParams.start"-->
      <!--                      value-format="timestamp"></el-date-picker>-->
      <!--      <el-date-picker type="datetime" placeholder="结束时间" class="filter-item search-item "-->
      <!--                      style="margin-right: 10px;width: 190px;" v-model="queryParams.end "-->
      <!--                      value-format="timestamp"></el-date-picker>-->
      <el-select v-model="queryParams.status" class="filter-item search-item select" clearable filterable
                 placeholder="状态">
        <el-option
          v-for="item in Methods.payIn"
          :label="item.type"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="queryParams.approvalType" class="filter-item search-item select" clearable filterable
                 placeholder="是否免审">
        <el-option label="是" value="1"></el-option>
        <el-option label="否" value="0"></el-option>
      </el-select>
      <el-date-picker type="datetime" placeholder="开始时间" class="filter-item search-item "
                      style="margin-right: 10px;width: 190px;" v-model="queryParams.start"
                      value-format="timestamp"></el-date-picker>
      <el-date-picker type="datetime" placeholder="结束时间" class="filter-item search-item "
                      style="margin-right: 10px;width: 190px;" v-model="queryParams.end "
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
      <el-table-column label="ID" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户ID" align="center" min-width="120px">
        <template slot-scope="scope">
          <el-tooltip content="点击即可复制内容" placement="top">
          <span v-clipboard:copy="scope.row.address"
                v-clipboard:success="copy">{{ scope.row.address}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="公链币种" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{  scope.row.coinName  }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="币种" :show-overflow-tooltip="true" align="center" min-width="80px">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{  scope.row.chain  }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="币种ID" :show-overflow-tooltip="true" align="center" min-width="80px">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{  scope.row.coinId  }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="金额" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{  scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手续费" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{  scope.row.fee }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" :show-overflow-tooltip="true" align="center" min-width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" :show-overflow-tooltip="true" align="center" min-width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedAt }}</span>
        </template>
      </el-table-column>

      <el-table-column label="提币状态" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.status | statusOf  }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="版本" :show-overflow-tooltip="true" align="center" min-width="60px">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ scope.row.version }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="提现地址" align="center" min-width="160px">
        <template slot-scope="scope">
          <el-tooltip content="点击即可复制内容" placement="top">
          <span v-clipboard:copy="scope.row.toAddress"
                v-clipboard:success="copy">{{ scope.row.toAddress}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="hash" align="center" min-width="240px">
        <template slot-scope="scope">
          <el-tooltip content="点击即可复制内容" placement="top">
          <span v-clipboard:copy="scope.row.txId"
                v-clipboard:success="copy">{{ scope.row.txId}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="业务ID" align="center" min-width="240px">
        <template slot-scope="scope">
          <el-tooltip content="点击即可复制内容" placement="top">
          <span v-clipboard:copy="scope.row.orgTxHash"
                v-clipboard:success="copy">{{ scope.row.orgTxHash}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
<!--          <el-tooltip v-if="row.status === 0 || row.status === 5 " class="item" effect="dark" content="修改"-->
          <el-tooltip  v-hasPermission="['withdraw:update']"   v-if="row.status === 0 || row.status === 5 " class="item" effect="dark" content="修改" placement="top">
                      placement="top">
            <i class="el-icon-setting table-operation" style="color: #2db7f5;"
               @click="edit(row)"/>
          </el-tooltip>
          <!--          <el-link class="no-perm" v-has-no-permission="['withdraw:update']">-->
          <!--            无权限-->
          <!--          </el-link>-->
        </template>
      </el-table-column>
    </el-table>
    <div>
      <p>提币总金额: {{sum.amount}}</p>
      <p>提币总次数: {{sum.num}}</p>
    </div>
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
    import { getAssetWithdraw, getWithdrawSum } from '@/api/index';


    export default {
        name: 'assetStatistics',
        components: {
            Pagination,
            edit
        },
        filters: {
            statusOf: function(val) {
                switch (val) {
                    case 0:
                        return '待审核';
                    case 1:
                        return '审核通过';
                    case 2:
                        return '待确认';
                    case 3:
                        return '已完成';
                    case 4:
                        return '已取消';
                    case 5:
                        return '提币失败';
                }
            }
        },
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
                sum: {}
            };
        },
        computed: {},
        mounted() {
            this.fetch();
            this.getSum();
        },
        methods: {
            getSum(params = {}) {
                getWithdrawSum(params).then(response => {
                    this.sum = response.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            copy(e) {
                this.$message({
                    message: '复制成功',
                    type: 'success'
                });
            },
            /*登录用户*/
            stop() {
                this.$prompt('停用账户，请输入google验证码', '停用账户', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^\d{4}$/,
                    inputErrorMessage: 'Google格式为4位数字',
                    type: 'warning'
                }).then(({ value }) => {

                }).catch(() => {

                });
            },
            add() {
                this.dialog.title = '添加提币费率';
                this.dialog.isVisible = true;
            },
            edit(row) {
                let roleId = [];
                if (row.roleId && typeof row.roleId === 'string') {
                    roleId = row.roleId.split(',');
                    row.roleId = roleId;
                }
                this.$refs.edit.setDetails(row);
                this.dialog.title = '币种审核';
                this.dialog.isVisible = true;
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
                this.getSum({ ...this.queryParams });
            },
            reset() {
                this.queryParams = {};
                this.pagination = {
                    total: 0,
                    limit: 20,
                    page: 1
                };
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
            updateAssetWithdraw(userIds) {
                return false;
                this.loading = true;
                // this.$delete(`system/user/${userIds}`).then(() => {
                //     this.$message({
                //         message: '删除成功',
                //         type: 'success'
                //     });
                //     this.search();
                // });
            },
            fetch(params = {}) {
                params.size = this.pagination.limit;
                params.current = this.pagination.page;
                if (this.queryParams.timeRange) {
                    params.createTimeFrom = this.queryParams.timeRange[0];
                    params.createTimeTo = this.queryParams.timeRange[1];
                }
                this.loading = true;
                getAssetWithdraw(params).then(response => {
                    this.loading = false;
                    this.list = response.data.records;
                    this.pagination.total = response.data.total;
                    this.pagination.page = response.data.current;
                    this.pagination.limit = response.data.size;
                }).catch(err => {
                    console.log(err);
                });
            },
            exportExcel() {
                const tHeader = ['ID', '财务类型', '币种', '账户名称', '余额', '真实余额', '是否默认'];
                const filterVal = ['id', 'id', 'id', 'id', 'id', 'id', 'id'];
                const list = this.list;
                const filename = '财务账户';
                this.Methods.exportExcel(tHeader, filterVal, filename, list);
            }
        }
    };
</script>
<style lang="scss" scoped>
  .select {
    width: 150px;
  }
</style>
