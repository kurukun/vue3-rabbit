import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getCategoryAPI } from '@/apis/layout'

export const useCategoryStore = defineStore('category', () => {
    //   导航列表的数据管理
    // state
    const categoryList = ref([])

    // action
    const getCategory = async () => {
        const res = await getCategoryAPI()
        console.log(res)
        categoryList.value = res.result
    }

    return {
        categoryList,
        getCategory
    }
})