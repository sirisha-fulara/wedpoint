import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PopularTemplates from '../components/PopularTemplates';
import './Templates.css';

const Templates = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialFilter = searchParams.get('filter') || 'all';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.search]);

  return (
    <main className="templates-page" style={{ paddingTop: '68px', minHeight: '100vh' }}>
      <PopularTemplates initialFilter={initialFilter} />
    </main>
  );
};

export default Templates;
