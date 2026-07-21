import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Always open the new route from the top.
    // Fixes cases where SPA navigation + browser restoration leaves the user at a mid-page scroll.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname, location.search, location.hash]);

  return null;
}

