import axios from "./myaxios";
import type { LoginRequestParams, SaveUrlRequestParams } from "../../types/request";

const { get, post } = axios

export const login = (params:LoginRequestParams) => post("/api/login",params)

export const saveUrl = (params:SaveUrlRequestParams) => post("/api/url",params)