<template xmlns:v-VueClipboard="http://www.w3.org/1999/xhtml">
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="queryParams.address" placeholder="用户地址" class="filter-item search-item"/>
      <el-select v-model="queryParams.name" class="filter-item search-item select" clearable filterable
                 placeholder="币种">
        <el-option
          v-for="item in coinList"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
      <el-select v-model="queryParams.status" class="filter-item search-item select" clearable filterable
                 placeholder="状态">
        <el-option label="待审核" value="0"></el-option>
        <el-option label="成功" value="1"></el-option>
        <el-option label="失败" value="2"></el-option>
      </el-select>
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
          <span>{{scope.row.id}}</span>
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
      <el-table-column label="币种简称" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{  scope.row.name  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" :show-overflow-tooltip="true" align="center" min-width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{  scope.row.status | statusOf}}</span>
        </template>
      </el-table-column>
      <el-table-column label="U支付数量" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{  scope.row.usdtAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="SRC支付数量" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{  scope.row.srcAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作时间" :show-overflow-tooltip="true" align="center" min-width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedAt }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-tooltip v-hasPermission="['defi:update']" class="item" v-if="row.status==0"
                      effect="dark" content="修改" placement="top">
            placement="top">
            <i class="el-icon-setting table-operation" style="color: #2db7f5;"
               @click="edit(row,1)"/>
          </el-tooltip>
          <el-tooltip v-hasPermission="['defi:checked']" effect="dark" content="审核" placement="top" v-if="row.status==0">
            placement="top">
            <i class="el-icon-edit table-operation" style="color: #2db7f5;"
               @click="edit(row,2)"/>
          </el-tooltip>
          <el-tooltip  v-hasPermission="['defi:view']" class="item" effect="dark" content="详情" placement="top">
            <i class="el-icon-view table-operation" style="color: #87d068;"
               @click="view(row)"/>
          </el-tooltip>
          <el-link class="no-perm" v-has-no-permission="['defi:update','defi:checked','defi:view']">
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
    import { getDeif, getDeifCoin } from '@/api/index';


    export default {
        name: 'assetStatistics',
        components: {
            viewDetails,
            Pagination,
            edit
        },
        filters: {
            statusOf: function(val) {
                switch (val) {
                    case 0:
                        return '待审核';
                    case 1:
                        return '成功';
                    case 2:
                        return '失败';
                    case 3:
                        return '其他';
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
                coinList: [],
                selection: [],
                sum: {}
            };
        },
        computed: {},
        mounted() {
            this.fetch();
            this.getAllCoin();
        },
        methods: {
            getAllCoin() {
                getDeifCoin().then(response => {
                    this.coinList = response.data;
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
            view(row) {
                this.$refs.view.setDetails(row);
                this.viewVisible = true;
            },
            viewClose() {
                this.viewVisible = false;
            },
            add() {
                this.dialog.title = '添加';
                this.dialog.isVisible = true;
            },
            edit(row,type) {
                this.$refs.edit.setDetails(row,type);
                this.dialog.title = type==2?'审核':'修改';
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
            fetch(params = {}) {
                params.size = this.pagination.limit;
                params.current = this.pagination.page;
                if (this.queryParams.timeRange) {
                    params.createTimeFrom = this.queryParams.timeRange[0];
                    params.createTimeTo = this.queryParams.timeRange[1];
                }
                this.loading = true;
                getDeif(params).then(response => {
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
