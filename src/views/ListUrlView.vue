<script setup lang="ts">
import { NButton, NTag, type DataTableColumns } from 'naive-ui'
import { h } from 'vue'
import * as api from '@/api'
import type { ListUrlResponse } from '../../types/response'
import { useI18n } from 'vue-i18n'
const {t} = useI18n()
const dialog = useDialog()
const notify = useNotification()

const loading = ref(true)
const urls = ref<ListUrlResponse[]>([])

const pagination = reactive({
  page: 1,
  pageSize: 20,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10,20,50,100],
  onUpdatePage: (pn: number = 1) => {
    pagination.page = pn
    const ps = pagination.pageSize
    loading.value = true
    api.listUrls(pn,ps).then((r)=>{
      const { data, total } = r.data
      urls.value = data
      pagination.itemCount = total
      loading.value = false
    })
  },
  onUpdatePageSize: (ps: number) => {
    pagination.pageSize = ps
    pagination.page = 1
    pagination.onUpdatePage()
  }
})
pagination.onUpdatePage()

const deleteUrl = (key: string, index: number) => {
  dialog.error({
    title: t("deleteUrl.title"),
    content: t("deleteUrl.confirm"),
    positiveText: t("enter"),
    negativeText: t("cancel"),
    onPositiveClick: async () => {
      const {data} = await api.deleteUrl(key)
      if (data.error) {
        notify.error({
          title: t("deleteUrl.failed"),
          description: t("error." + data.error.code),
          duration: 1800,
        })
      } else {
        urls.value.splice(index, 1)
        notify.success({
          title: t("deleteUrl.finish"),
          description: "/" + key,
          duration: 1800,
        })
      }
    }
  })
}

const timeformat = (date:Date) => date.toISOString().slice(0, 16).replace("T", " ")

const columns = [
  { 
    title: "No.",
    key: 'index',
    align: 'center',
    render: (_,index) => index + 1
  },
  { 
    title: "KEY",
    key: 'key',
    align: 'center',
    render: row => h('a', { href: location.origin + '/' + row.key, target: '_blank', class: 'row-key' }, { default: () => row.key }) 
  },
  { 
    title:  t('saveTime'), 
    key: 'expireTime', 
    align: 'center',
    render: row => h('span',{ class: 'time' },{default:()=>timeformat(new Date(Number(row.saveTime)))} )
  },
  { 
    title: t('expireTime'), 
    key: 'expireTime', 
    align: 'center',
    render: row => h('span',{ class: 'time' },{default:()=>row.expireTime != '-1' ? timeformat(new Date(Number(row.expireTime))) : t("saveUrlForm.expireDay.value-forever")} )
  },
  { 
    title: 'URL', 
    key: 'url', 
    render: row => h('a', { href: row.url, target: '_blank', class:'row-url' }, [h('span', {}, row.url)]) 
  },
  {
    title: t('saveUrlForm.options.responseMode.label'), 
    key: 'options.responseMode', 
    align: 'center',
    render: row => h(NTag, { type: 'info', size: 'small'}, {default:()=>t("saveUrlForm.options.responseMode.value-" + (row.options?.responseMode || 'redirect'))})
  },
  { 
    title: t('action'), 
    key: 'actions', 
    render: (row, index) => h(NButton, { type: 'error', size: 'tiny', onClick: () => deleteUrl(row.key,index) }, { default: () => t("deleteUrl.btn") }) 
  }
] satisfies DataTableColumns<ListUrlResponse>
</script>

<template>
  <n-data-table remote :columns="columns" :loading="loading" :data="urls" :pagination="pagination" size="medium" @update:page="pagination.onUpdatePage"/>
</template>

<style lang="scss" scoped>
.n-data-table {
  max-width: 900px;
  margin: 0 auto;
  animation: fade-slide-in 0.5s ease-out;
}
</style>

<style lang="scss">
.row-url {
  width: 20em;
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  span {
    word-break: break-all;
    overflow-wrap: break-word;
  }
}
.time,.row-key {
  display: block;
  white-space: nowrap;
}
</style>