import type { ComponentType } from 'react';
import { Loading } from './components/common.tsx';
import { Layout } from './components/Layout.tsx';
import { BookingPage } from './pages/BookingPage.tsx';
import { ChatPage } from './pages/ChatPage.tsx';
import { ConfirmationPage } from './pages/ConfirmationPage.tsx';
import { DiningPage } from './pages/DiningPage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';
import { OrderPage } from './pages/OrderPage.tsx';
import { PropertiesPage } from './pages/PropertiesPage.tsx';
import { PropertyPage } from './pages/PropertyPage.tsx';
import { RequestsPage } from './pages/RequestsPage.tsx';
import { SignInPage } from './pages/SignInPage.tsx';
import { SpaPage } from './pages/SpaPage.tsx';
import { matchPath, Redirect, usePath } from './router.tsx';
import { useSession } from './session.tsx';

// Every screen, its URL and whether a guest must be signed in to see it.
// Pages receive the URL parameters as props, e.g. /properties/tokyo -> { propertyId: 'tokyo' }.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ROUTES: { path: string; page: ComponentType<any>; isPublic?: boolean }[] = [
  { path: '/sign-in', page: SignInPage, isPublic: true },
  { path: '/', page: PropertiesPage },
  { path: '/properties/:propertyId', page: PropertyPage },
  { path: '/properties/:propertyId/book', page: BookingPage },
  { path: '/properties/:propertyId/dining', page: DiningPage },
  { path: '/properties/:propertyId/requests', page: RequestsPage },
  { path: '/properties/:propertyId/chat', page: ChatPage },
  { path: '/properties/:propertyId/spa', page: SpaPage },
  { path: '/bookings/:reference', page: ConfirmationPage },
  { path: '/orders/:orderId', page: OrderPage },
];

export function App() {
  const path = usePath();
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  for (const route of ROUTES) {
    const params = matchPath(route.path, path);
    if (!params) continue;

    if (!route.isPublic && status === 'signedOut') {
      return <Redirect to={`/sign-in?next=${encodeURIComponent(path)}`} />;
    }
    if (route.path === '/sign-in' && status === 'signedIn') {
      return <Redirect to="/" />;
    }

    const Page = route.page;
    return (
      <Layout>
        <Page key={path} {...params} />
      </Layout>
    );
  }

  return (
    <Layout>
      <NotFoundPage />
    </Layout>
  );
}
