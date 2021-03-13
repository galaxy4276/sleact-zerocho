import { ChangeEvent, Dispatch, SetStateAction, useCallback, useState } from 'react';

type ReturnTypes<T = any> =
  [T, (e: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>];

const useInput = <T = string>(initialData: T): ReturnTypes<T>  => {
  const [value, setValue] = useState(initialData);
  const handler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value as unknown as T);
  }, []);
  return [value, handler, setValue];
};

export default useInput;
// unknown 은 any 와 비슷하지만 타입을 좁혀서 사용해야만 한다. ( any 외 다른 타입 할당 불가능 )
// TS Error 에 대한 회피책이라 생각할 수 있겠다.
