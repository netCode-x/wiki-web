import service from "@/utils/axios.ts";
import type {} from "@/type/api";
import type {RawNote} from "@/type/publicType";


/**
 *  获取随记日志
 */
export  const fetchPublicNote =async ()=>{
    const response = await  service.get<RawNote []>('/notes/public/all');
    return response.data;
 }