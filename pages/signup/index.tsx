import React, { useCallback, useState } from 'react';
import {
  Header,
  Form,
  Label,
  Input,
  LinkContainer,
  Button,
  Error,
  Success,
} from './styles';
import { Link, Redirect } from 'react-router-dom';
import useInput from '@hooks/useInput';
import { AxiosError } from 'axios';
import apiClient from '@utils/apliClient';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const SignUp = () => {
  const { data: userData } = useSWR('/users', fetcher);

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, , setPassword] = useInput('');
  const [passwordCheck, , setPasswordCheck] = useInput('');
  const [mismatchError, setMismatchError] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  if (userData) {
    <Redirect to="/workspace/channel" />;
  }

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
    setMismatchError(e.target.value !== passwordCheck);
  }, [passwordCheck]);

  const onChangePasswordCheck = useCallback((e) => {
    setPasswordCheck(e.target.value);
    setMismatchError(e.target.value !== password);
  }, [password]);

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    if (!mismatchError && nickname) {
      setSignUpError('');
      setSignUpSuccess(false);

      apiClient.post('users', {
        email,
        nickname,
        password,
      })
        .then((response) => {
          console.log(response);
          setSignUpSuccess(true);
        })
        .catch((error: AxiosError) => {
          console.log(error.response);
          setSignUpError(error.response?.data);
        });
    }
  }, [email, nickname, password, passwordCheck, mismatchError]);

  if (userData) return <Redirect to='/workspace/sleact/channel/일반' />;

  return (
    <div id='container'>
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id='email-label'>
          <span>이메일 주소</span>
          <div>
            <Input type='email' id='email' name='email' value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id='nickname-label'>
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
