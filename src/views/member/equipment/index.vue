<template xmlns:v-VueClipboard="http://www.w3.org/1999/xhtml">
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="queryParams.device" placeholder="设备" class="filter-item search-item"/>
      <el-select v-model="queryParams.deviceType" class="filter-item search-item select" clearable filterable
                 placeholder="类型">
        <el-option label="ios" value="0"></el-option>
        <el-option label="android" value="1"></el-option>
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
    >
      <el-table-column label="序号" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <el-tooltip content="点击即可复制内容" placement="top">
          <span v-clipboard:copy="scope.row.device"
                v-clipboard:success="copy">{{ scope.row.device}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" min-width="120px" >
        <template slot-scope="scope">
          <span>{{ scope.row.deviceType | deviceType}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户地址" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="加入时间" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pagination.total>0" :total="pagination.total" :page.sync="pagination.page"
                :limit.sync="pagination.limit" @pagination="search"/>
  </div>
</template>

<script>
    import Pagination from '@/components/page/pagination';
    import { getDevice} from '@/api/index';


    export default {
        name: 'assetStatistics',
        components: {
            Pagination
        },
        filters: {
            deviceType: function(val) {
                switch (val) {
                    case 0:
                        return 'ios';
                    case 1:
                        return 'android';
                }
            }
        },
        data() {
            return {
                pagination: {
                    total: 0,
                    limit: 20,
                    page: 1
                },
                tableKey: 0,
                sum: 0,
                loading: false,
                list: [],
                queryParams: {}
            };
        },
        computed: {},
        mounted() {
            this.fetch();
        },
        methods: {
            copy(e) {
                console.log(e.text);
                this.$message({
                    message: '复制成功',
                    type: 'success'
                });
            },
            onError(e) {
                console.log(e);
                this.$message({
                    message: '复制失败',
                    type: 'error'
                });
            },
            search() {
                this.fetch({
                    ...this.queryParams
                });
            },
            reset() {
                this.queryParams = {};
                this.pagination = { total: 0, limit: 20, page: 1 };
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
                getDevice(params).then(response => {
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
