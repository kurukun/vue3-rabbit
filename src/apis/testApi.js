import httpInstance from "@/utils/http";

export function getCategory() {
    return httpInstance.get('home/category/head');
}
