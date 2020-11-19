<template>
  <el-dialog
    title="查看"
    :width="width"
    :visible.sync="isVisible"
    class="user-view"
  >
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24">
        <div class="img-wrapper">
          <img :src="avatar">
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-user" /> <span>用户名：</span> {{ user.username }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-suitcase" /> <span>部门：</span> {{ user.deptName }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-trophy" /> <span>角色：</span> {{ user.roleName }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-phone-outline" /> <span>电话：</span> {{ user.mobile }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-bangzhu" /> <span>状态：</span> {{ user.status === '1' ? '有效' : '禁止' }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
<!--          <i class="el-icon-time" /> <span>创建时间：</span> {{ user.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}-->
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-brush" /> <span>修改时间：</span>
          {{ user.modifyTime }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24">
        <div class="view-item">
          <i class="el-icon-date" /> <span>最后登录时间：</span>
          {{ user.lastLoginTime ? user.lastLoginTime: '从未登录过系统'}}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24">
        <div class="view-item">
          <i class="el-icon-document" /> <span>个人描述：</span> {{ user.description ? user.description: '这家伙很懒，什么都没留下' }}
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'UserView',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      screenWidth: 0,
      width: this.initWidth(),
      user: {}
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible
      },
      set() {
        this.close()
      }
    },
    avatar() {
      if (this.user.avatar) {
        // return require(`@/assets/avatar/${this.user.avatar}`)
      } else {
        // return require('@/assets/avatar/default.jpg')
      }
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    transSex(sex) {
      switch (sex) {
        case '0':
          // return this.$t('common.sex.male')
        case '1':
          // return this.$t('common.sex.female')
        default:
          // return this.$t('common.sex.secret')
      }
    },
    initWidth() {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 550) {
        return '95%'
      } else if (this.screenWidth < 990) {
        return '580px'
      } else if (this.screenWidth < 1400) {
        return '600px'
      } else {
        return '650px'
      }
    },
    setUser(val) {
      this.user = { ...val }
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
  .user-view {
    .img-wrapper {
      text-align: center;
      margin-top: -1.5rem;
      margin-bottom: 10px;
      img {
        width: 4rem;
        border-radius: 50%;
      }
    }
    .view-item {
      margin: 7px;
      i {
        font-size: .97rem;
      }
      span {
        margin-left: 5px;
      }
    }
  }
</style>
