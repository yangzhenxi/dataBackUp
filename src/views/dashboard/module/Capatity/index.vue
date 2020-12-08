<template>
  <div class="pool-wrapper">
    <div class="clip-path" />
    <card
      :bodyStyle="{ padding: 0 }"
      :wrapperClass="dataSource.key"
      :headerWrapperClass="`${dataSource.key}-header`"
      :headerActionWrapperClass="`${dataSource.key}-header-action`"
      :contentWrapperClass="`${dataSource.key}-content`"
    >
      <span slot="title" class="title">{{ dataSource.title }}</span>
      <empty :isEmpty="isEmpty(dataSource.data)" :minHeight="minHeight">
        <div style="margin-top: 16px">
          <a-row :gutter="[16, 16]" type="flex" align="middle" justify="space-between">
            <a-col :sm="24" :md="12" class="native" @click.stop>
              <water :data="dataSource.data"></water>
            </a-col>
            <a-col :sm="24" :md="12">
              <div class="total-wrapper">
                <div class="value"><span :style="{color:toDict(dataSource.status,'D_SERVE_STATUS').color }">{{ dataSource.status | convert('D_SERVE_STATUS') }}</span></div>
                <div class="title">总容量：<span>{{ dataSource.TotalCapatity }}</span></div>
              </div>
            </a-col>
          </a-row>
        </div>
        <div slot="empty" class="empty">
          <div class="empty-image">
            <SimpleEmptyImg />
          </div>
          <span class="empty-text">暂无数据</span>
        </div>
      </empty>
    </card>
  </div>
</template>

<script>
import { Card, Empty, MIcon, MTab } from '@/components'
import Water from './modules/water'
import StackBarChart from './modules/StackBarChart'
import SimpleEmptyImg from '@/components/Empty/simple'
import { isEmpty, toDict } from '@/utils/util'
const MTabItem = MTab.Item

export default {
  name: 'Pool',
  props: {
    dataSource: {
      type: Object,
      default () {
        return {
          data: []
        }
      },
      required: true
    }
  },
  components: {
    Card,
    Empty,
    MIcon,
    MTab,
    MTabItem,
    StackBarChart,
    Water,
    SimpleEmptyImg
  },
  data () {
    return {
      minHeight: 190
    }
  },
  computed: {
    theme () {
      return this.$store.getters.theme
    }
  },
  methods: {
    onPoolChange (value) {
      this.$emit('onPoolChange', value)
    },
	isEmpty,
	toDict
  }
}

</script>
<style lang='less' scoped>
  .pool-wrapper {
    position: relative;
    border-radius: 28px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .09);
    transition: .3s all;
    &:hover {
      cursor: pointer;
      background: rgba(0, 0, 0, 0);
      border-color: rgba(0, 0, 0, .09);
      box-shadow: 0 4px 8px rgba(0, 0, 0, .2);
    }
    .clip-path {
      position: absolute;
      width: 100%;
      height: 100%;
      background: #ffffff;
      @width: 2px;
      @edge: 16px;
      clip-path: polygon(
        @edge 0,
        calc(@edge + @width / sqrt(2)) @width,
        @width calc(@edge + @width / sqrt(2)),
        @width calc(100% - (@edge + @width / sqrt(2))),
        calc(@edge + @width / sqrt(2)) calc(100% - @width),
        calc(100% - @edge - @width / sqrt(2)) calc(100% - @width),
        calc(100% - @width) calc(100% - @edge - @width / sqrt(2)),
        calc(100% - @width)  calc(@edge + @width / sqrt(2)),
        calc(100% - @edge - @width / sqrt(2)) @width,

        calc(100% / 3 * 2 + @width) @width,
        calc(100% / 3 * 2 ) calc(@width * 2),
        calc(100% / 3) calc(@width * 2),
        calc(100% / 3 - @width) @width,

        calc(@edge + @width / sqrt(2)) @width,
        @edge 0,

        calc(100% / 3) 0,
        calc(100% / 3 + @width) @width,
        calc(100% / 3 * 2 - @width) @width,
        calc(100% / 3 * 2) 0,

        calc(100% - @edge)  0,
        100% @edge,
        100% calc(100% - @edge),
        calc(100% - @edge) 100%,
        @edge 100%,
        0 calc(100% - @edge),
        0 @edge
      );
      z-index: 2;
    }
    .backup {
      padding: 2px;
      background: rgba(0, 0, 0, 0);
      /deep/ .backup-header {
        border-radius: 18px 18px 0 0;
        background: linear-gradient(to bottom, #ffffff, #ededed);
        z-index: 1;
        .title {
          margin-left: 16px;
          color: #3771cd;
        }
      }
      /deep/ .backup-content {
        margin: 0;
        border-radius: 0 0 18px 18px;
        background: linear-gradient(to bottom, #ffffff, #ededed);
        z-index: 1;
      }
    }
    .pull {
      padding: 2px;
      background: rgba(0, 0, 0, 0);
      /deep/ .pull-header {
        border-radius: 18px 18px 0 0;
        background: linear-gradient(to bottom, #ffffff, #ededed);
        z-index: 1;
        .title {
          margin-left: 16px;
          color: #3771cd;
        }
      }
      /deep/ .pull-content {
        margin: 0;
        border-radius: 0 0 18px 18px;
        background: linear-gradient(to bottom, #ffffff, #ededed);
        z-index: 1;
      }
    }
    .total-wrapper {
      text-align: center;
      .title {
        text-align: center;
        font-size: 24px;
        line-height: 1;
        color: rgba(128, 128, 128, .85);
      }
      .value {
        text-align: center;
        font-size: 48px;
        line-height: 1.2;
      color: rgba(128, 128, 128, .85);
      }
    }
    .native {
      cursor: auto;
    }
  }
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    .empty-image {
      height: 40px;
      margin-bottom: 8px;
    }
  }
  /deep/ .ant-tabs-bar {
    border-bottom: none;
  }
  /deep/ .ant-tabs .ant-tabs-small-bar .ant-tabs-tab {
    padding: 4px 16px;
  }
  /deep/ .ant-tabs-ink-bar {
    background-color: #ffffff00;
  }

</style>
