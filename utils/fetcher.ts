import apiClient from '@utils/apliClient';

const fetcher = (url: string) =>
  apiClient.get(url, {
    withCredentials: true,
  }).then(({ data }) => data);

export default fetcher;
