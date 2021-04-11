import { apiClient } from '../client';

const fetcher = (url: string) => {
  apiClient.get(url, {
    withCredentials: true,
  }).then((res) => res.data);
};

export default fetcher;
