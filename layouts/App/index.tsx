import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import loadable from '@loadable/component';

const LogIn = loadable(() => import('@pages/login'));
const SignUp = loadable(() => import('@pages/signup'));
const Workspace = loadable(() => import('@layouts/Workspace'));

const Index = () => {
  return (
    <Switch> {/* 여러 라우트 중에 하나만 되게 도와주는 장치 */}
      <Redirect path='/' to='/login' exact />
      <Route path='/login' component={LogIn} />
      <Route path='/signup' component={SignUp} />
      <Route path='/workspace' component={Workspace} />
    </Switch>
  );
};

export default Index;
