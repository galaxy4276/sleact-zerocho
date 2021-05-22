import apiClient from '@utils/apliClient';
import { AxiosResponse } from 'axios';

const getData = (res: AxiosResponse) => res.data;

const fetcher = (url: string) =>
  apiClient.get(url, {
    withCredentials: true,
  }).then(getData);

export default fetcher;
