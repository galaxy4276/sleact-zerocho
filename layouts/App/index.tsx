import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import loadable from '@loadable/component';

const LogIn = loadable(() => import('@pages/login'));
const SignUp = loadable(() => import('@pages/signup'));
const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Index = () => {
  return (
    <Switch> {/* 여러 라우트 중에 하나만 되게 도와주는 장치 */}
      <Redirect path='/' to='/login' exact />
      <Route path='/login' component={LogIn} />
      <Route path='/signup' component={SignUp} />
      <Route path='/workspace/channel' component={Channel} />
      <Route path='/workspace/dm' component={DirectMessage} />
    </Switch>
  );
};

export default Index;
