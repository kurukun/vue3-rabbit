// 封装分类数据相关的业务代码
import { ref, onMounted } from 'vue'
import { getCategoryAPI } from '@/apis/category'
// vue3获取路由参数
import { useRoute } from 'vue-router'
// 获取钩子
import { onBeforeRouteUpdate } from 'vue-router'

export function useCategory() {
    const categoryData = ref({})
    const route = useRoute()
    const getCategory = async (id = route.params.id) => {
        const res = await getCategoryAPI(id)
        console.log(res);
        categoryData.value = res.result
    }
    onMounted(() => {
        getCategory()
    })
    // 路由参数变化的时候，把分类数据接口重新发送
    onBeforeRouteUpdate((to) => {
        // 存在问题：需要最新的路由参数，因此用to
        getCategory(to.params.id)
    })

    return {
        categoryData
    }
}  