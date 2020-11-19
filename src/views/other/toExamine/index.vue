<template>
  <div class="app-container">
    <div class="filter-container">
      <!--      <el-input v-model="queryParams.id" placeholder="用户ID" class="filter-item search-item"/>-->
      <!--      <el-input v-model="queryParams.name" placeholder="提现地址" class="filter-item search-item"/>-->
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
      <!--      <el-select v-model="queryParams.isRecommend" class="filter-item search-item select" clearable filterable-->
      <!--                 placeholder="状态">-->
      <!--        <el-option-->
      <!--          v-for="item in Methods.examineStatus"-->
      <!--          :key="item.id"-->
      <!--          :label="item.type"-->
      <!--          :value="item.id">-->
      <!--        </el-option>-->
      <!--      </el-select>-->
      <!--      <el-button class="filter-item" type="primary" plain @click="search">-->
      <!--        搜索-->
      <!--      </el-button>-->
<!--      <el-button class="filter-item" type="primary" plain @click="submint">-->
<!--        搜索-->
<!--      </el-button>-->
<!--      <el-button class="filter-item" type="warning" plain @click="reset">-->
<!--        重置-->
<!--      </el-button>-->
      <!--      <el-button class="filter-item" type="info" plain  @click.native="exportExcel">-->
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
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="币种名称" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.full_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="币种简称" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{  scope.row.name  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发行价(USDT)" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{  scope.row.price  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发行总数" :show-overflow-tooltip="true" align="center" min-width="80px" prop="number">
        <template slot-scope="scope">
          <span>{{  scope.row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="官方网站" :show-overflow-tooltip="true" align="center" min-width="120px" prop="number">
        <template slot-scope="scope">
          <span>{{ scope.row.website }}</span>
        </template>
      </el-table-column>
      <el-table-column label="白皮书链接" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{  scope.row.white_url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{  scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发行宣言" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{  scope.row.declaration }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" :show-overflow-tooltip="true" align="center" min-width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" :show-overflow-tooltip="true" align="center" min-width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.status | status}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-tooltip v-if="row.status==0 && row.isPublicChain == 0" class="item" effect="dark" content="修改" placement="top">
            <i class="el-icon-setting table-operation" style="color: #2db7f5;"
               @click="edit(row)"/>
          </el-tooltip>
          <!--          <el-link v-has-no-permission="['user:view','user:update','user:delete']" class="no-perm">-->
          <!--            无权限-->
          <!--          </el-link>-->
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
  import {getAssetCoin, updataAssetCoin} from '@/api/index';


  export default {
    name: 'userList',
    components: {
      Pagination,
      edit
    },
    filters: {
      status: function (val) {
        switch (val) {
          case 0:
            return '待审核';
          case 1:
            return '通过';
          case 2:
            return '审核不通过';
          case 3:
            return '其他';
        }
      },
      typeOf: function (val) {
        switch (val) {
          case 0:
            return '区块链转入';
          case 1:
            return '内部转账';
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
        selection: []
      };
    },
    computed: {},
    mounted() {
      this.fetch();
    },
    methods: {
      /*登录用户*/
      stop() {
        this.$prompt('停用账户，请输入google验证码', '停用账户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\d{4}$/,
          inputErrorMessage: 'Google格式为4位数字',
          type: 'warning'
        }).then(({value}) => {

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
        this.dialog.title = '修改提币费率';
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
        }).then(({value}) => {
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
        getAssetCoin(params).then(response => {
          this.loading = false;
          this.list = response.data.records;
          this.pagination.total = response.data.total;
          this.pagination.page = response.data.current;
          this.pagination.limit = response.data.size;
        }).catch(err => {
          console.log(err);
          this.loading = false;
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
