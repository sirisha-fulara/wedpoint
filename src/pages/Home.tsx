import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import PopularTemplates from '../components/PopularTemplates';
import DigitalVideoBanner from '../components/DigitalVideoBanner';
import WhyChooseUs from '../components/WhyChooseUs';

const Home = () => {
  return (
    <main style={{ marginTop: '68px' }}>
      <Hero />
      <Marquee />
      <PopularTemplates initialFilter="all" limit={6} showViewAll={true} />
      <DigitalVideoBanner />
      <WhyChooseUs />
    </main>
  );
};

export default Home;
