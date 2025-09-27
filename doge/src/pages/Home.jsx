import Nav from '../layouts/Nav';
import Search from '../components/SearchContainer';
import Footer from '../components/Footer';
import QuickLinks from '../components/QuickLinks';
// import Update from '../components/Update';

export default function Home() {
  return (
    <>
      <Nav />
      <Search />
      <QuickLinks />
      <Footer />
      {/*<Update />*/}
    </>
  );
}
