'use client';

import { ReactNode, useEffect } from 'react';
import Aos from 'aos';
import 'aos/dist/aos.css';

const AppProvidersWrapper = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    Aos.init();

    import('preline/preline');
  }, []);

  return <>{children}</>;
};

export default AppProvidersWrapper;
