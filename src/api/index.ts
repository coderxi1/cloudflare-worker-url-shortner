import axios from "./myaxios";
import type { LoginRequestParams, SaveUrlRequestParams } from "../../types/request";

const { get, post } = axios

export const login = (params:LoginRequestParams) => post("/api/login",params)

export const saveUrl = (params:SaveUrlRequestParams) => post("/api/url",params)

export const listUrls = (pn:number,ps:number) => get("/api/urls",{params:{pn,ps}})

export const deleteUrl = (key:string) => axios.delete("/api/url",{params:{key}})