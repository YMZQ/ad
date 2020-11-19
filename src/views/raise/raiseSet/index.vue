<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="queryParams.status" class="filter-item search-item select" clearable filterable
                 placeholder="状态">
        <el-option label="未开始" value="0"></el-option>
        <el-option label="进行中" value="1"></el-option>
        <el-option label="已完成" value="2"></el-option>
      </el-select>
      <el-select v-model="queryParams.sellCoinName" class="filter-item search-item select" clearable filterable
                 placeholder="币种">
        <el-option
          v-for="item in coinList"
          :key="item.name"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" plain @click="search">
        搜索
      </el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">
        重置
      </el-button>
      <el-button v-hasPermission="['publicConfig:add']" class="filter-item" type="warning" plain @click="add">
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
      :default-sort="{prop: 'number',order: 'ascending'}"
      style="width: 100%;"
    >
      <el-table-column label="序号" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.$index+1}}</span>
        </template>
      </el-table-column>

      <el-table-column label="币种" :show-overflow-tooltip="true"
                       align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.sellCoinName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.status | statusOf}}</span>
        </template>
      </el-table-column>
      <el-table-column label="公募价格" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公募币种数量" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.totalQuota  }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="实际募集数量(已完成状态下)" :show-overflow-tooltip="true" align="center" min-width="120px">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.status  }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="公募总U数量(已完成状态下)" :show-overflow-tooltip="true" align="center" min-width="120px">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.status  }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="闪照时间" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.publicBackupsTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="兑换起始时间" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.exchangeStartTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="兑换结束时间" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.exchangeEndTime }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="创建时间" :show-overflow-tooltip="true" align="center" min-width="120px">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.exchangeAt }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="操作" align="center" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-tooltip v-hasPermission="['publicConfig:update']" class="item" effect="dark" content="修改" placement="top">
            <i class="el-icon-setting table-operation" style="color: #2db7f5;"
               @click="edit(row)"/>
          </el-tooltip>
          <el-tooltip v-hasPermission="['publicConfig:view']" class="item" effect="dark" content="详情" placement="top">
            <i class="el-icon-view table-operation"  style="color: #87d068;"
               @click="view(row,2)"/>
          </el-tooltip>
          <el-link class="no-perm" v-has-no-permission="['coin:update','imgs:delete']">
            无权限
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="pagination.total" :page.sync="pagination.page"
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
    import { getPublicConfig,getAllCoin } from '@/api/index';


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
                coinList: [],
                queryParams: {},
                sort: {},
                selection: []
            };
        },
        filters: {
            statusOf: function(val) {
                switch (val) {
                    case 0:
                        return '未开始';
                    case 1:
                        return '进行中';
                    case 2:
                        return '已完成';
                }
            }
        },
        computed: {},
        mounted() {
            this.fetch();
            this.getAllCoin();
        },
        methods: {
            getAllCoin() {
                getAllCoin().then(response => {
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
            add() {
                this.dialog.title = '添加';
                this.dialog.isVisible = true;
            },
            edit(row) {
                this.$refs.edit.setDetails(row);
                this.dialog.title = '修改';
                this.dialog.isVisible = true;
            },
            editClose() {
                this.dialog.isVisible = false;
            },
            editSuccess() {
                this.search();
            },
            view(row) {
                this.$refs.view.setDetails(row);
                this.viewVisible = true;
            },
            viewClose() {
                this.viewVisible = false;
            },
            search() {
                this.fetch({
                    ...this.queryParams,
                    ...this.sort
                });
            },
            reset() {
                this.queryParams = {};
                this.pagination = { total: 0, limit: 20, page: 1 };
                this.sort = {};
                this.$refs.table.clearSort();
                this.$refs.table.clearFilter();
                this.search();
            },

            fetch(params = {}) {
                params.size = this.pagination.limit;
                params.current = this.pagination.page;
                if (params.orderBySrc && params.orderBy) {
                    params.orderBy = params.orderBy + ',' + params.orderBySrc;
                    delete params.orderBySrc;
                } else if (params.orderBySrc) {
                    params.orderBy = params.orderBySrc;
                    delete params.orderBySrc;
                }
                this.loading = true;
                getPublicConfig(params).then(response => {
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

