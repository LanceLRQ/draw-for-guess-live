import React from 'react';
import { renderRoutes } from 'react-router-config';

export const RouterFragment = ({ route }) => {
  return renderRoutes(route.routes);
};

export default RouterFragment;
