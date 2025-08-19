import { forwardRef, useImperativeHandle } from 'react';

const Mock = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    refresh: () => {},
    d3Zoom: () => ({ on: () => {} }),
    zoom: () => {},
  }));
  return null;
});

export default Mock;
